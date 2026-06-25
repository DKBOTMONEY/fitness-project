"use server";

import { getPrismaForUser } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";

import { z } from "zod";

async function getAuthPrisma() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) return null;
    return getPrismaForUser(session.user.id);
}

const workoutResultSchema = z.array(z.object({
    exerciseId: z.string(),
    weight: z.number().optional(),
    reps: z.number().optional(),
    completed: z.boolean()
}));

export async function hasProAccess() {
    const authPrisma = await getAuthPrisma();
    if (!authPrisma) return false;

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return false;

    const user = await authPrisma.user.findUnique({
        where: { id: session.user.id },
        select: { subscriptionStatus: true, createdAt: true }
    });

    if (!user) return false;

    if (user.subscriptionStatus === "ACTIVE") return true;

    if (user.subscriptionStatus === "TRIAL") {
        const createdAt = new Date(user.createdAt);
        const trialEndDate = new Date(createdAt.getTime() + 30 * 24 * 60 * 60 * 1000);
        return new Date() < trialEndDate;
    }

    return false;
}

export async function generateWorkout(category: string, intensity: string) {
    const authPrisma = await getAuthPrisma();
    if (!authPrisma) return null;

    const hasAccess = await hasProAccess();
    if (!hasAccess) {
        throw new Error("PRO_ACCESS_REQUIRED");
    }

    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session!.user.id;

    // Map intensity to number of exercises
    const exerciseCount = intensity === "Light" ? 3 : intensity === "Medium" ? 5 : 8;

    // Optimized: Fetch only IDs first for shuffling
    const allExercises = await authPrisma.exercise.findMany({
        where: { category },
        select: { id: true },
    });

    if (allExercises.length === 0) {
        throw new Error("No exercises found for this category");
    }

    // Shuffle and pick
    const shuffledIds = allExercises
        .map(ex => ex.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, exerciseCount);

    // Fetch full details for the selected exercises
    const selectedExercises = await authPrisma.exercise.findMany({
        where: { id: { in: shuffledIds } },
    });

    // Save the workout
    const workout = await authPrisma.workout.create({
        data: {
            userId,
            name: `${category} - ${intensity} Workout`,
            category,
            intensity,
            exercises: {
                connect: selectedExercises.map((ex) => ({ id: ex.id })),
            },
        },
        include: {
            exercises: true,
        },
    });

    return workout;
}

export async function getLatestWorkout() {
    const authPrisma = await getAuthPrisma();
    if (!authPrisma) return null;

    const session = await auth.api.getSession({ headers: await headers() });

    const workout = await authPrisma.workout.findFirst({
        where: { userId: session!.user.id },
        orderBy: { createdAt: "desc" },
        include: { exercises: true },
    });

    return workout;
}

export async function getUserProfile() {
    const authPrisma = await getAuthPrisma();
    if (!authPrisma) return null;

    const session = await auth.api.getSession({ headers: await headers() });

    const user = await authPrisma.user.findUnique({
        where: { id: session!.user.id },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            targetWeight: true,
            currentWeight: true,
            height: true,
            age: true,
            gender: true,
            activityLevel: true,
            targetShape: true,
            subscriptionStatus: true,
            subscriptionEndDate: true,
            createdAt: true,
        }
    });

    return user;
}

export async function updateUserProfile(data: { 
    name?: string; 
    targetWeight?: number; 
    currentWeight?: number;
    height?: number;
    age?: number;
    gender?: string;
    activityLevel?: string;
    targetShape?: string 
}) {
    const authPrisma = await getAuthPrisma();
    if (!authPrisma) return null;

    const session = await auth.api.getSession({ headers: await headers() });

    const updatedUser = await authPrisma.user.update({
        where: { id: session!.user.id },
        data: {
            name: data.name,
            targetWeight: data.targetWeight,
            currentWeight: data.currentWeight,
            height: data.height,
            age: data.age,
            gender: data.gender,
            activityLevel: data.activityLevel,
            targetShape: data.targetShape,
        },
    });

    return updatedUser;
}

export async function processSubscriptionPayment() {
    const authPrisma = await getAuthPrisma();
    if (!authPrisma) return null;

    const session = await auth.api.getSession({ headers: await headers() });

    const user = await authPrisma.user.findUnique({
        where: { id: session!.user.id },
        select: { subscriptionEndDate: true }
    });

    const now = new Date();
    let startDate = now;

    // Logic Fix: If there is an active subscription, start extension from its end date
    if (user?.subscriptionEndDate && user.subscriptionEndDate > now) {
        startDate = user.subscriptionEndDate;
    }

    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);

    const updatedUser = await authPrisma.user.update({
        where: { id: session!.user.id },
        data: {
            subscriptionStatus: "ACTIVE",
            subscriptionEndDate: endDate,
        },
    });

    return updatedUser;
}

export async function getRunningStats() {
    const authPrisma = await getAuthPrisma();
    if (!authPrisma) return null;

    const session = await auth.api.getSession({ headers: await headers() });

    const stats = await authPrisma.runningStat.findMany({
        where: { userId: session!.user.id },
        orderBy: { workoutDate: "asc" },
        take: 30, // Last 30 sessions
    });

    return stats;
}

export async function addRunningStat(data: { distanceKm: number; durationMins: number }) {
    const authPrisma = await getAuthPrisma();
    if (!authPrisma) return null;

    const hasAccess = await hasProAccess();
    if (!hasAccess) {
        throw new Error("PRO_ACCESS_REQUIRED");
    }

    const session = await auth.api.getSession({ headers: await headers() });

    const stat = await authPrisma.runningStat.create({
        data: {
            userId: session!.user.id,
            distanceKm: data.distanceKm,
            durationMins: data.durationMins,
        },
    });

    return stat;
}

export async function addMeal(data: { 
    mealType: string; 
    calories: number; 
    protein: number; 
    carbs: number; 
    fat: number; 
    items?: string 
}) {
    const authPrisma = await getAuthPrisma();
    if (!authPrisma) return null;

    const hasAccess = await hasProAccess();
    if (!hasAccess) {
        throw new Error("PRO_ACCESS_REQUIRED");
    }

    const session = await auth.api.getSession({ headers: await headers() });

    // Sanitize numeric inputs
    const calories = isNaN(data.calories) ? 0 : Math.round(data.calories);
    const protein = isNaN(data.protein) ? 0 : Math.round(data.protein);
    const carbs = isNaN(data.carbs) ? 0 : Math.round(data.carbs);
    const fat = isNaN(data.fat) ? 0 : Math.round(data.fat);

    const meal = await authPrisma.nutritionPlan.create({
        data: {
            userId: session!.user.id,
            mealType: data.mealType,
            calories,
            protein,
            carbs,
            fat,
            items: data.items || "Unspecified food",
        },
    });

    return meal;
}

// Utility to get today range in a specific timezone (default to Bangkok/Thai)
function getTodayRange() {
    const now = new Date();
    const thaiNow = new Date(now.getTime() + (7 * 60 * 60 * 1000));
    const today = new Date(thaiNow);
    today.setUTCHours(0, 0, 0, 0);
    const utcToday = new Date(today.getTime() - (7 * 60 * 60 * 1000));
    
    const tomorrow = new Date(utcToday);
    tomorrow.setDate(utcToday.getDate() + 1);
    
    return { start: utcToday, end: tomorrow };
}

export async function getDailyNutrition() {
    const authPrisma = await getAuthPrisma();
    if (!authPrisma) return null;

    const session = await auth.api.getSession({ headers: await headers() });

    const { start } = getTodayRange();

    const meals = await authPrisma.nutritionPlan.findMany({
        where: {
            userId: session!.user.id,
            createdAt: {
                gte: start,
            },
        },
        orderBy: { createdAt: "asc" },
    });

    return meals;
}

export async function getDailyStats() {
    const authPrisma = await getAuthPrisma();
    if (!authPrisma) return null;

    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session!.user.id;

    const { start, end } = getTodayRange();

    // Performance Optimization: Run queries in parallel
    const [meals, running, workouts, user] = await Promise.all([
        authPrisma.nutritionPlan.findMany({
            where: {
                userId,
                createdAt: { gte: start, lt: end },
            },
        }),
        authPrisma.runningStat.findMany({
            where: {
                userId,
                workoutDate: { gte: start, lt: end },
            },
        }),
        authPrisma.workout.findMany({
            where: {
                userId,
                createdAt: { gte: start, lt: end },
            },
        }),
        authPrisma.user.findUnique({
            where: { id: userId },
            select: { targetWeight: true }
        })
    ]);

    const totalConsumed = meals.reduce((sum, m) => sum + m.calories, 0);
    const userWeight = user?.targetWeight || 70;
    const runningBurn = running.reduce((sum, r) => sum + (r.distanceKm * userWeight * 1.03), 0); 
    const runningMins = running.reduce((sum, r) => sum + r.durationMins, 0);
    const workoutMins = workouts.length * 20; 
    const workoutBurn = workouts.length * 150;

    const activityTimes = [
        ...meals.map(m => m.createdAt.getHours()),
        ...running.map(r => r.workoutDate.getHours()),
        ...workouts.map(w => w.createdAt.getHours())
    ];
    const uniqueHours = new Set(activityTimes).size;

    const targets = await getUserNutritionTargets();
    const moveTarget = Math.round(targets.calories * 0.27);

    return {
        consumed: totalConsumed,
        burned: Math.round(runningBurn + workoutBurn),
        exerciseMins: runningMins + workoutMins,
        standHours: Math.min(12, uniqueHours || 1), 
        targets: {
            nutrition: targets.calories,
            move: moveTarget
        }
    };
}

export async function searchLocalFood(query: string) {
    const authPrisma = await getAuthPrisma();
    if (!authPrisma) return null;

    // 1. Search Local Database first
    const localProducts = await authPrisma.foodProduct.findMany({
        where: {
            OR: [
                { name: { contains: query, mode: "insensitive" } },
                { brand: { contains: query, mode: "insensitive" } },
            ],
        },
        orderBy: [
            { isCommon: "desc" },
            { name: "asc" },
        ],
        take: 10,
    });

    // 2. If we have enough local results, return them
    if (localProducts.length >= 5) {
        return localProducts;
    }

    // 3. Otherwise, fetch from Open Food Facts API
    try {
        const response = await fetch(
            `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
                query
            )}&search_simple=1&action=process&json=1&page_size=20`
        );
        const data = await response.json();

        if (data.products && data.products.length > 0) {
            const externalProducts = data.products
                .filter((p: any) => p.product_name && p.nutriments)
                .map((p: any) => ({
                    id: `ext-${p.code || Math.random()}`,
                    externalId: p.code,
                    name: p.product_name || "Unknown Product",
                    brand: p.brands || "Unknown Brand",
                    calories: Math.round(p.nutriments["energy-kcal_100g"] || 0),
                    protein: Number(p.nutriments.proteins_100g || 0),
                    carbs: Number(p.nutriments.carbohydrates_100g || 0),
                    fat: Number(p.nutriments.fat_100g || 0),
                    image: p.image_front_small_url || null,
                    category: p.categories_tags?.[0]?.replace("en:", "") || null,
                    isCommon: false,
                }));

            // Combine and remove duplicates based on externalId
            const combined = [...localProducts];
            externalProducts.forEach((ext: any) => {
                if (!combined.some((loc) => loc.externalId === ext.externalId)) {
                    combined.push(ext);
                }
            });

            return combined.slice(0, 10);
        }
    } catch (error) {
        console.error("External Food API Error:", error);
    }

    return localProducts;
}

export async function cacheFoodProduct(data: {
    externalId?: string;
    name: string;
    brand?: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    image?: string;
}) {
    const authPrisma = await getAuthPrisma();
    if (!authPrisma) return null;

    if (data.externalId) {
        return await authPrisma.foodProduct.upsert({
            where: { externalId: data.externalId },
            update: {
                name: data.name,
                brand: data.brand,
                calories: data.calories,
                protein: data.protein,
                carbs: data.carbs,
                fat: data.fat,
                image: data.image,
            },
            create: {
                externalId: data.externalId,
                name: data.name,
                brand: data.brand,
                calories: data.calories,
                protein: data.protein,
                carbs: data.carbs,
                fat: data.fat,
                image: data.image,
            },
        });
    }

    return await authPrisma.foodProduct.create({
        data: {
            name: data.name,
            brand: data.brand,
            calories: data.calories,
            protein: data.protein,
            carbs: data.carbs,
            fat: data.fat,
            image: data.image,
        },
    });
}

export async function finishWorkout(workoutId: string, results: unknown) {
    const authPrisma = await getAuthPrisma();
    if (!authPrisma) return null;

    const session = await auth.api.getSession({ headers: await headers() });
    const validatedResults = workoutResultSchema.parse(results);

    const log = await authPrisma.workoutLog.create({
        data: {
            userId: session!.user.id,
            workoutId,
            results: validatedResults, 
        },
    });

    return log;
}

export async function getLineAccountStatus() {
    const authPrisma = await getAuthPrisma();
    if (!authPrisma) return null;

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return null;

    const account = await authPrisma.account.findFirst({
        where: { 
            userId: session.user.id,
            providerId: "line"
        },
        select: {
            accountId: true,
            createdAt: true
        }
    });

    return account;
}

export async function getWorkoutHistory() {
    const authPrisma = await getAuthPrisma();
    if (!authPrisma) return [];
    const session = await auth.api.getSession({ headers: await headers() });
    const logs = await authPrisma.workoutLog.findMany({
        where: { userId: session!.user.id },
        orderBy: { createdAt: "asc" },
        take: 30,
        include: { workout: true }
    });
    return logs;
}

export async function getNutritionHistory() {
    const authPrisma = await getAuthPrisma();
    if (!authPrisma) return [];
    const session = await auth.api.getSession({ headers: await headers() });
    const plans = await authPrisma.nutritionPlan.findMany({
        where: { userId: session!.user.id },
        orderBy: { createdAt: "asc" },
        take: 100,
    });
    return plans;
}

export async function getWeightHistory() {
    const authPrisma = await getAuthPrisma();
    if (!authPrisma) return [];
    const session = await auth.api.getSession({ headers: await headers() });
    const entries = await authPrisma.weightEntry.findMany({
        where: { userId: session!.user.id },
        orderBy: { date: "asc" },
        take: 30,
    });
    return entries;
}

export async function addWeightEntry(weight: number) {
    const authPrisma = await getAuthPrisma();
    if (!authPrisma) return null;

    const hasAccess = await hasProAccess();
    if (!hasAccess) {
        throw new Error("PRO_ACCESS_REQUIRED");
    }

    const session = await auth.api.getSession({ headers: await headers() });
    
    const entry = await authPrisma.weightEntry.create({
        data: {
            userId: session!.user.id,
            weight,
        },
    });
    
    await authPrisma.user.update({
        where: { id: session!.user.id },
        data: { currentWeight: weight }
    });

    return entry;
}

export async function getUserNutritionTargets() {
    const user = await getUserProfile();
    if (!user || !user.currentWeight || !user.height || !user.age) {
        return { calories: 2200, protein: 150, carbs: 200, fat: 65 };
    }

    const w = user.currentWeight;
    const h = user.height;
    const a = user.age;
    const gender = user.gender || "male";
    const activityLevel = user.activityLevel || "sedentary";
    const targetShape = user.targetShape || "Fit";

    let bmr = 10 * w + 6.25 * h - 5 * a;
    bmr = gender === "male" ? bmr + 5 : bmr - 161;

    const multipliers: Record<string, number> = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        very_active: 1.9,
    };
    const multiplier = multipliers[activityLevel] || 1.2;
    const tdee = Math.round(bmr * multiplier);

    let targetCalories = tdee;
    if (targetShape === "Lean") targetCalories = tdee - 500;
    else if (targetShape === "Muscular") targetCalories = tdee + 300;
    else if (targetShape === "Athletic") targetCalories = tdee + 200;

    const macroPercentages: Record<string, { protein: number; carbs: number; fat: number }> = {
        Lean: { protein: 40, carbs: 30, fat: 30 },
        Fit: { protein: 30, carbs: 45, fat: 25 },
        Muscular: { protein: 35, carbs: 40, fat: 25 },
        Athletic: { protein: 30, carbs: 50, fat: 20 },
    };

    const pct = macroPercentages[targetShape] || { protein: 30, carbs: 45, fat: 25 };
    const protein = Math.round((targetCalories * (pct.protein / 100)) / 4);
    const carbs = Math.round((targetCalories * (pct.carbs / 100)) / 4);
    const fat = Math.round((targetCalories * (pct.fat / 100)) / 9);

    return { calories: targetCalories, protein, carbs, fat };
}

export async function getRecoveryStatus() {
    const authPrisma = await getAuthPrisma();
    if (!authPrisma) return { hours: 24, level: 5, label: "Optimal" };

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { hours: 24, level: 5, label: "Optimal" };
    
    const userId = session.user.id;

    const latestWorkout = await authPrisma.workoutLog.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });

    const latestRun = await authPrisma.runningStat.findFirst({
        where: { userId },
        orderBy: { workoutDate: "desc" },
    });

    let lastActivityDate = null;
    if (latestWorkout && latestRun) {
        lastActivityDate = latestWorkout.createdAt > latestRun.workoutDate ? latestWorkout.createdAt : latestRun.workoutDate;
    } else if (latestWorkout) {
        lastActivityDate = latestWorkout.createdAt;
    } else if (latestRun) {
        lastActivityDate = latestRun.workoutDate;
    }

    if (!lastActivityDate) {
        return { hours: 24, level: 5, label: "Optimal" }; // Fully recovered if no activity
    }

    const hoursSince = (new Date().getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60);
    
    let level = 1;
    if (hoursSince >= 24) level = 5;
    else if (hoursSince >= 18) level = 4;
    else if (hoursSince >= 12) level = 3;
    else if (hoursSince >= 6) level = 2;

    let label = "Recovering";
    if (level >= 4) label = "Optimal";
    else if (level >= 3) label = "Good";

    return { hours: Number(hoursSince.toFixed(1)), level, label };
}

export async function verifyStripeSession(sessionId: string) {
    const authPrisma = await getAuthPrisma();
    if (!authPrisma) return { success: false, error: "Not authenticated" };

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { success: false, error: "Not authenticated" };

    try {
        const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

        if (checkoutSession.payment_status === "paid") {
            const subscriptionId = checkoutSession.subscription as string;
            const now = new Date();
            let endDate = new Date(now);
            endDate.setMonth(now.getMonth() + 1);

            if (subscriptionId) {
                const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any;
                endDate = new Date(subscription.current_period_end * 1000);
            }

            const stripeCustomerId = checkoutSession.customer as string;

            await authPrisma.user.update({
                where: { id: session.user.id },
                data: {
                    subscriptionStatus: "ACTIVE",
                    subscriptionEndDate: endDate,
                    ...(stripeCustomerId ? { stripeCustomerId } : {})
                },
            });

            return { success: true };
        }

        return { success: false, error: "Payment not completed" };
    } catch (err) {
        console.error("Failed to verify Stripe session:", err);
        return { success: false, error: "Verification failed" };
    }
}

export async function reportIssue(data: { title: string; description: string; pageUrl?: string; userAgent?: string }) {
    const authPrisma = await getAuthPrisma();
    if (!authPrisma) return { success: false, error: "Not authenticated" };

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { success: false, error: "Not authenticated" };

    try {
        await authPrisma.bugReport.create({
            data: {
                userId: session.user.id,
                title: data.title,
                description: data.description,
                pageUrl: data.pageUrl || "",
                userAgent: data.userAgent || "",
                status: "PENDING"
            }
        });
        return { success: true };
    } catch (err) {
        console.error("Failed to report issue:", err);
        return { success: false, error: "Failed to submit report" };
    }
}

import { betterAuth } from "better-auth/minimal";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { sendVerificationEmail, sendPasswordResetEmail } from "./email";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        sendResetPassword: async ({ user, url }) => {
            if (process.env.NODE_ENV === "development") {
                console.log("Reset Password URL:", url);
            }
            try {
                await sendPasswordResetEmail(user.email, url);
            } catch (error) {
                if (process.env.NODE_ENV === "development") {
                    console.error("Failed to send reset password email, but URL is logged above.");
                } else {
                    console.error("Failed to send reset password email.");
                    throw error;
                }
            }
        },
    },
    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ["google", "line"], // เชื่อมต่ออัตโนมัติสำหรับ Provider ที่เชื่อถือได้
        }
    },
    emailVerification: {
        sendOnSignUp: true,
        requireEmailVerification: true,
        sendVerificationEmail: async ({ user, url }) => {
            if (process.env.NODE_ENV === "development") {
                console.log("Verification URL:", url);
            }
            try {
                await sendVerificationEmail(user.email, url);
            } catch (error) {
                if (process.env.NODE_ENV === "development") {
                    console.error("Failed to send verification email, but URL is logged above.");
                } else {
                    console.error("Failed to send verification email.");
                    throw error;
                }
            }
        },
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        },
        line: {
            clientId: process.env.LINE_CLIENT_ID || "",
            clientSecret: process.env.LINE_CLIENT_SECRET || "",
        },
    },
    hooks: {
        before: createAuthMiddleware(async (ctx) => {
            if (ctx.path.startsWith("/sign-up/email")) {
                const body = ctx.body as Record<string, unknown> | undefined;
                if (!body || typeof body.password !== "string") return;

                const password = body.password;
                const hasUpper = /[A-Z]/.test(password);
                const hasLower = /[a-z]/.test(password);
                const isLongEnough = password.length >= 8;

                if (!hasUpper || !hasLower || !isLongEnough) {
                    throw new APIError("BAD_REQUEST", {
                        message: "Password must contain at least 1 uppercase letter, 1 lowercase letter, and be at least 8 characters long."
                    });
                }
            }
        }),
    },
});

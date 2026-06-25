import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma, getPrismaForUser } from "@/lib/prisma";

// Helper to reply to LINE user
async function replyLineMessage(replyToken: string, text: string) {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!token) {
    console.error("LINE_CHANNEL_ACCESS_TOKEN is not defined");
    return;
  }

  try {
    await fetch("https://api.line.me/v2/bot/message/reply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        replyToken,
        messages: [
          {
            type: "text",
            text,
          },
        ],
      }),
    });
  } catch (error) {
    console.error("Failed to send LINE reply:", error);
  }
}

export async function POST(req: NextRequest) {
  const channelSecret = process.env.LINE_CHANNEL_SECRET;
  if (!channelSecret) {
    return NextResponse.json({ error: "LINE_CHANNEL_SECRET is not configured" }, { status: 500 });
  }

  try {
    const signature = req.headers.get("x-line-signature") || "";
    const body = await req.text();

    // Verify signature
    const hash = crypto
      .createHmac("SHA256", channelSecret)
      .update(body)
      .digest("base64");

    if (signature !== hash) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(body);
    const events = payload.events || [];

    for (const event of events) {
      if (event.type !== "message" || event.message.type !== "text") {
        continue;
      }

      const replyToken = event.replyToken;
      const lineUserId = event.source.userId;
      const userMessage = event.message.text.trim();

      // Find user connected with this LINE Account
      const account = await prisma.account.findFirst({
        where: {
          providerId: "line",
          accountId: lineUserId,
        },
      });

      if (!account) {
        // User has not linked account
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        await replyLineMessage(
          replyToken,
          `สวัสดีครับ! ยินดีต้อนรับสู่ Hundee 🏋️\n\nบัญชี LINE นี้ยังไม่ได้เชื่อมต่อกับระบบแดชบอร์ด กรุณาเข้าสู่ระบบด้วย LINE เพื่อเชื่อมโยงบัญชีและใช้งานแชทบอท:\n🔗 ${appUrl}/login`
        );
        continue;
      }

      const userId = account.userId;
      const userPrisma = getPrismaForUser(userId);

      // Parse commands
      // 1. Help Guide
      if (/^(วิธีใช้งาน|help|เมนู|คู่มือ)/i.test(userMessage)) {
        const helpText = `คู่มือการพิมพ์คุยกับบอท Hundee 🤖

📊 เรียกดูสรุปกิจกรรมวันนี้:
• พิมพ์: สรุป

🍏 บันทึกรายการอาหาร:
• พิมพ์: กิน [ชื่ออาหาร] [แคล] แคล (ระบุโปรตีน คาร์บ ไขมันต่อท้ายได้)
• ตัวอย่าง: กิน อกไก่ 150 แคล 30p 0c 3f

🏃 บันทึกประวัติการวิ่ง:
• พิมพ์: วิ่ง [ระยะทาง] กม [เวลา] นาที
• ตัวอย่าง: วิ่ง 5.2 กม 30 นาที

🏋️ ขอสุ่มตารางออกกำลังกาย:
• พิมพ์: ขอตาราง [บอดี้เวท / ฟรีเวท / เครื่องเล่น]
• ตัวอย่าง: ขอตาราง บอดี้เวท`;
        await replyLineMessage(replyToken, helpText);
        continue;
      }

      // 2. Daily Summary
      if (/^(สรุป|รายงาน|dashboard|stats)/i.test(userMessage)) {
        const now = new Date();
        const thaiNow = new Date(now.getTime() + 7 * 60 * 60 * 1000);
        const today = new Date(thaiNow);
        today.setUTCHours(0, 0, 0, 0);
        const start = new Date(today.getTime() - 7 * 60 * 60 * 1000);
        const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

        const [meals, running, workouts, user] = await Promise.all([
          userPrisma.nutritionPlan.findMany({
            where: { userId, createdAt: { gte: start, lt: end } },
          }),
          userPrisma.runningStat.findMany({
            where: { userId, workoutDate: { gte: start, lt: end } },
          }),
          userPrisma.workout.findMany({
            where: { userId, createdAt: { gte: start, lt: end } },
          }),
          userPrisma.user.findUnique({
            where: { id: userId },
            select: { targetWeight: true, currentWeight: true, height: true, age: true, gender: true, activityLevel: true },
          }),
        ]);

        const totalConsumed = meals.reduce((sum, m) => sum + m.calories, 0);
        const userWeight = user?.targetWeight || 70;
        const runningBurn = running.reduce((sum, r) => sum + r.distanceKm * userWeight * 1.03, 0);
        const runningMins = running.reduce((sum, r) => sum + r.durationMins, 0);
        const workoutMins = workouts.length * 20;
        const workoutBurn = workouts.length * 150;
        const totalBurned = Math.round(runningBurn + workoutBurn);
        
        const activityTimes = [
          ...meals.map((m) => m.createdAt.getHours()),
          ...running.map((r) => r.workoutDate.getHours()),
          ...workouts.map((w) => w.createdAt.getHours()),
        ];
        const uniqueHours = new Set(activityTimes).size;
        const standHours = Math.min(12, uniqueHours || 1);

        const summaryText = `📊 รายงานกิจกรรมวันนี้ของคุณ

🍏 อาหารที่ทาน: ${totalConsumed.toLocaleString()} / 2,200 kcal
🔥 พลังงานที่เผาผลาญ: ${totalBurned.toLocaleString()} kcal
🏃 เวลาออกกำลังกาย: ${runningMins + workoutMins} นาที
🧍 ชั่วโมงการยืน: ${standHours} / 12 ชั่วโมง

สู้ๆ ครับ! วินัยคือกุญแจสู่ความสำเร็จ 💪`;
        await replyLineMessage(replyToken, summaryText);
        continue;
      }

      // 3. Log Food (กิน)
      const foodRegex = /^กิน\s+(.+?)\s+(\d+)\s*แคล(?:\s+(\d+)p)?(?:\s+(\d+)c)?(?:\s+(\d+)f)?/i;
      const foodMatch = userMessage.match(foodRegex);
      if (foodMatch) {
        const items = foodMatch[1];
        const calories = parseInt(foodMatch[2]);
        const protein = foodMatch[3] ? parseInt(foodMatch[3]) : 0;
        const carbs = foodMatch[4] ? parseInt(foodMatch[4]) : 0;
        const fat = foodMatch[5] ? parseInt(foodMatch[5]) : 0;

        await userPrisma.nutritionPlan.create({
          data: {
            userId,
            mealType: "Snack", // Default log via line as snack
            items,
            calories,
            protein,
            carbs,
            fat,
          },
        });

        const reply = `✅ บันทึกรายการอาหารเรียบร้อย!

🍏 รายการ: ${items}
🔥 แคลอรี: ${calories} kcal
💪 สารอาหาร: โปรตีน ${protein}g | คาร์บ ${carbs}g | ไขมัน ${fat}g`;
        await replyLineMessage(replyToken, reply);
        continue;
      }

      // 4. Log Run (วิ่ง)
      const runRegex = /^วิ่ง\s+(\d+(?:\.\d+)?)\s*(?:กม|km)\s*(\d+)\s*(?:นาที|min)/i;
      const runMatch = userMessage.match(runRegex);
      if (runMatch) {
        const distance = parseFloat(runMatch[1]);
        const duration = parseInt(runMatch[2]);
        const pace = (duration / distance).toFixed(2);

        await userPrisma.runningStat.create({
          data: {
            userId,
            distanceKm: distance,
            durationMins: duration,
          },
        });

        const reply = `✅ บันทึกประวัติการวิ่งเรียบร้อย!

🏃 ระยะทาง: ${distance} กม.
⏱️ เวลา: ${duration} นาที
⚡ Pace เฉลี่ย: ${pace} min/km`;
        await replyLineMessage(replyToken, reply);
        continue;
      }

      // 5. Generate Workout (ขอตาราง)
      const workoutRegex = /^ขอตาราง\s*(bodyweight|free weights|weight machines|บอดี้เวท|ฟรีเวท|เครื่องเล่น)/i;
      const workoutMatch = userMessage.match(workoutRegex);
      if (workoutMatch) {
        let category = "Bodyweight";
        const catInput = workoutMatch[1].toLowerCase();
        if (catInput.includes("free") || catInput.includes("ฟรี")) {
          category = "Free Weights";
        } else if (catInput.includes("machine") || catInput.includes("เครื่อง")) {
          category = "Weight Machines";
        }

        const allExercises = await userPrisma.exercise.findMany({
          where: { category },
          select: { id: true, name: true, equipment: true },
        });

        if (allExercises.length === 0) {
          await replyLineMessage(replyToken, `❌ ขออภัยด้วยครับ ไม่พบข้อมูลท่าออกกำลังกายในหมวดหมู่ ${category}`);
          continue;
        }

        const shuffled = allExercises.sort(() => 0.5 - Math.random()).slice(0, 5);
        
        // Save the workout program to their profile
        const workout = await userPrisma.workout.create({
          data: {
            userId,
            name: `${category} - LINE Routine`,
            category,
            intensity: "Medium",
            exercises: {
              connect: shuffled.map((ex) => ({ id: ex.id })),
            },
          },
        });

        const listText = shuffled.map((ex, index) => `${index + 1}. ${ex.name} ${ex.equipment ? `(${ex.equipment.split(',')[0]})` : ""}`).join("\n");
        const reply = `🏋️ จัดเตรียมตารางออกกำลังกายให้คุณแล้ว!

หมวดหมู่: ${category}
ความเข้มข้น: Medium (5 ท่า)
ID ตาราง: ${workout.id.slice(-6).toUpperCase()}

📋 รายการท่า:
${listText}

*คุณสามารถเปิดแอปบนเว็บเพื่อจดบันทึกน้ำหนักที่เล่นในตารางนี้ได้ทันที!`;
        await replyLineMessage(replyToken, reply);
        continue;
      }

      // Unrecognized Command
      await replyLineMessage(
        replyToken,
        `🤖 ขออภัยครับ ผมไม่เข้าใจคำสั่งนี้\n\nพิมพ์ "วิธีใช้งาน" เพื่อดูตัวอย่างวิธีการพิมพ์คำสั่งสำหรับใช้ระบบบันทึกสุขภาพได้เลยครับ!`
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

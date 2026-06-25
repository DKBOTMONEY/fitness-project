# 🚀 คู่มือการขึ้นระบบจริง (Deployment Guide) - Fitness Web Application

คู่มือนี้จะอธิบายขั้นตอนการจัดเตรียมและอัปโหลดระบบ (Deployment) ขึ้นสู่เซิร์ฟเวอร์จริงโดยใช้ **Vercel** เป็นแพลตฟอร์มหลักสำหรับการโฮสต์หน้าบ้าน (Next.js) และ **Supabase / Neon** สำหรับฐานข้อมูล PostgreSQL

---

## 📌 1. สิ่งที่ต้องจัดเตรียม (Prerequisites)

1. **GitHub Repository:** ทำการ Commit และ Push โค้ดของโปรเจกต์ทั้งหมดขึ้น GitHub
2. **Vercel Account:** บัญชีผู้ใช้งานที่เชื่อมต่อกับ GitHub สำหรับดึงโค้ดไป deploy
3. **PostgreSQL Database:** บัญชีฐานข้อมูลออนไลน์ (แนะนำ **Supabase** หรือ **Neon** แบบฟรี) เพื่อนำค่า `DATABASE_URL` มาใช้งาน
4. **LINE Developers Account:** สำหรับ LINE Login API และ LINE Messaging API (Chatbot)
5. **Google Cloud Console Account:** สำหรับ Google OAuth 2.0 Client Credentials
6. **Stripe Account:** บัญชีสำหรับระบบชำระเงิน (เริ่มต้นใช้งานด้วย Test Mode)

---

## ⚙️ 2. ขั้นตอนการตั้งค่าในแต่ละแพลตฟอร์ม (Configuration)

### A. Google OAuth 2.0 (Google Login)
1. ไปที่ [Google Cloud Console](https://console.cloud.google.com/)
2. สร้างโปรเจกต์ใหม่ และไปที่เมนู **APIs & Services > Credentials**
3. สร้าง **OAuth client ID** เลือกแอปพลิเคชันเป็น Web application
4. ในหัวข้อ **Authorized redirect URIs** ให้เพิ่ม URL ต่อไปนี้:
   `https://<ชื่อโปรเจกต์ของคุณ>.vercel.app/api/auth/callback/google`
5. คัดลอกค่า **Client ID** และ **Client Secret** ไว้

### B. LINE Developer Console (LINE Login & Chatbot)
1. ไปที่ [LINE Developers Console](https://developers.line.biz/)
2. **LINE Login Channel:**
   - ในหัวข้อ **Callback URL** ให้ระบุ:
     `https://<ชื่อโปรเจกต์ของคุณ>.vercel.app/api/auth/callback/line`
   - คัดลอกค่า **Channel ID** (`LINE_CLIENT_ID`) และ **Channel Secret** (`LINE_CLIENT_SECRET`)
3. **Messaging API Channel (Chatbot):**
   - ไปที่หัวข้อ **Messaging API** คัดลอกค่า **Channel Access Token** (`LINE_CHANNEL_ACCESS_TOKEN`)
   - ในส่วนของ **Webhook URL** ให้กรอก:
     `https://<ชื่อโปรเจกต์ของคุณ>.vercel.app/api/line-webhook`
   - กด **Verify** (หลังจากรันเว็บบน Vercel สำเร็จแล้ว) และติ๊กเลือกเปิด **Use webhook**

### C. Stripe (Payment Integration)
1. ไปที่ [Stripe Dashboard](https://dashboard.stripe.com/) (สวิตช์เป็น Test Mode)
2. คัดลอก **Publishable key** (`STRIPE_PUBLISHABLE_KEY`) และ **Secret key** (`STRIPE_SECRET_KEY`)
3. ไปที่เมนู **Developers > Webhooks**
4. กด **Add endpoint** และใส่ URL รับข้อมูล:
   `https://<ชื่อโปรเจกต์ของคุณ>.vercel.app/api/stripe`
5. เลือกส่ง Event อย่างน้อย: `checkout.session.completed` และ `customer.subscription.deleted`
6. เมื่อสร้างเสร็จ คัดลอก **Signing secret** (`STRIPE_WEBHOOK_SECRET`) มาใช้งาน

---

## 🚀 3. ขั้นตอนการ Deploy บน Vercel

1. เข้าสู่ระบบ [Vercel](https://vercel.com/) และกดปุ่ม **"Add New" > "Project"**
2. เลือก GitHub Repository ของโปรเจกต์นี้ และกด **"Import"**
3. ในหน้าต่างตั้งค่าโครงการ (Project Settings):
   - **Framework Preset:** เลือกเป็น `Next.js`
   - **Root Directory:** ให้เว้นเป็น `./` (ค่าเริ่มต้น)
4. ขยายหัวข้อ **Environment Variables** และนำค่าต่อไปนี้ไปกรอกทั้งหมด:

| Key | Value / คำแนะนำ |
| :--- | :--- |
| `DATABASE_URL` | ลิงก์เชื่อมต่อฐานข้อมูลจาก Supabase / Neon (ต้องเป็น Connection string) |
| `BETTER_AUTH_SECRET` | คีย์สุ่มความปลอดภัยสูง (สร้างได้จากการรันคีย์สุ่มใน Terminal) |
| `BETTER_AUTH_URL` | `https://<ชื่อโปรเจกต์ของคุณ>.vercel.app/api/auth` |
| `NEXT_PUBLIC_APP_URL` | `https://<ชื่อโปรเจกต์ของคุณ>.vercel.app` |
| `GOOGLE_CLIENT_ID` | ได้รับจากขั้นตอน Google OAuth |
| `GOOGLE_CLIENT_SECRET`| ได้รับจากขั้นตอน Google OAuth |
| `LINE_CLIENT_ID` | Channel ID จาก LINE Login |
| `LINE_CLIENT_SECRET` | Channel Secret จาก LINE Login |
| `LINE_CHANNEL_ACCESS_TOKEN` | Access Token จาก Messaging API |
| `LINE_CHANNEL_SECRET` | Channel Secret จาก Messaging API |
| `STRIPE_PUBLISHABLE_KEY` | คีย์สาธารณะจาก Stripe (ขึ้นต้นด้วย `pk_test_...`) |
| `STRIPE_SECRET_KEY` | คีย์ลับจาก Stripe (ขึ้นต้นด้วย `sk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | Signing secret ของ Webhook ที่สร้างจาก Stripe Dashboard |
| `GMAIL_USER` | อีเมลหลักสำหรับส่งข้อมูลระบบ (ถ้ามีใช้สำหรับ SMTP) |
| `GMAIL_PASS` | รหัสผ่าน App Password ของ Gmail (ถ้ามี) |

5. กดปุ่ม **"Deploy"** และรอระบบทำการ Build หน้าเว็บประมาณ 2-3 นาที

---

## 🗄️ 4. การจัดการฐานข้อมูลออนไลน์ (Database Sync)

หลังจาก Vercel สร้างเว็บไซต์สำเร็จ คุณจำเป็นต้องอัปโหลดโครงสร้างตารางข้อมูล (Schema) เข้าสู่ฐานข้อมูลจริงที่เตรียมไว้ใน `DATABASE_URL`

1. เปิด Terminal ในเครื่องคอมพิวเตอร์ของคุณ
2. รันคำสั่งต่อไปนี้เพื่ออัปโหลดตารางเข้าสู่ฐานข้อมูลโปรดักชันโดยตรง:
   ```bash
   npx prisma db push
   ```
   *(คำสั่งนี้จะอ่านค่า `DATABASE_URL` จากเครื่องคอมพิวเตอร์ของคุณ ดังนั้นกรุณาตรวจสอบให้มั่นใจว่าเครื่องคอมพิวเตอร์ของคุณมีการตั้งค่า environment ชี้ไปยังฐานข้อมูลเดียวกับที่จะใช้บนคลาวด์)*

3. คุณสามารถรันชุดข้อมูลจำลองเพื่อเติมข้อมูลเริ่มต้น (เช่น รายการอาหารยอดฮิต หรือข้อมูลออกกำลังกายเริ่มต้น) ผ่านคำสั่ง:
   ```bash
   npx prisma db seed
   ```

---

## 🔍 5. การตรวจสอบความเรียบร้อย (Post-Deployment Check)

เมื่อดำเนินการทั้งหมดเสร็จเรียบร้อย ให้ทดสอบฟีเจอร์ต่างๆ ดังนี้:
- เข้าสู่ระบบผ่าน Google และ LINE ว่าสามารถเรียกใช้งานและดึงข้อมูลโปรไฟล์ได้ปกติ
- หน้าหลัก Dashboard แสดงหน้าจออย่างสวยงามและข้อมูลตัวหนังสือคมชัด
- ระบบรายงานปัญหา (Report Issue) สามารถกรอกและบันทึกข้อมูลเข้าฐานข้อมูลบน Supabase ได้จริง
- ทดลองสมัครบริการ Pro (Upgrade) และจำลองการชำระเงินด้วยเลขบัตรเครดิต `4242 4242...` ว่าระบบเปลี่ยนสถานะเป็น PRO ACTIVE หรือไม่
- ลองสแกนแอดบอท LINE แล้วพิมพ์คำว่า **"สรุป"** เพื่อทดสอบแชทบอทว่าสามารถตอบกลับสถิติได้ถูกต้อง

---

## ⚙️ 6. ขั้นตอนการแก้ไขและอัปเดตระบบอย่างปลอดภัย (Safe Update & Branching Workflow) [อัปเดต v1.1]

เพื่อป้องกันไม่ให้โค้ดใหม่ที่คุณกำลังแก้ไขไปส่งผลกระทบต่อเว็บไซต์จริง (Production) ที่มีผู้ใช้งานอยู่ แนะนำให้ใช้กระบวนการทำงานแบบ Branching ของ Git ร่วมกับ Preview Deployment ของ Vercel ดังนี้:

### ขั้นตอนที่ 1: การจำลองการทำงานในเครื่อง (Local Testing)
1. ก่อนเริ่มพัฒนาทุกครั้ง ตรวจสอบให้มั่นใจว่าโค้ดทำงานได้ปกติในเครื่องตัวเอง
2. สั่งรันคำสั่งรันระบบในเครื่อง:
   ```bash
   npm run dev
   ```
3. เปิดทดสอบที่ `http://localhost:3000` เพื่อดูการแสดงผลเบื้องต้น

### ขั้นตอนที่ 2: แยกกิ่งเพื่อพัฒนาฟีเจอร์ใหม่ (Branching)
*หลีกเลี่ยงการแก้ไขโค้ดและ Push ขึ้นกิ่ง `main` โดยตรงในขณะที่ระบบกำลังใช้งานจริงอยู่*
1. สร้างกิ่งใหม่จาก `main` (เช่น กิ่งสำหรับแก้บั๊กหรือพัฒนาฟีเจอร์):
   ```bash
   git checkout -b dev-updates
   ```
2. แก้ไขโค้ดและสร้างสรรค์ฟีเจอร์ใหม่ตามต้องการบนกิ่งนี้
3. เมื่อแก้ไขเสร็จและทดสอบในเครื่องผ่านแล้ว ให้เซฟและ Push ขึ้นกิ่งใหม่บน GitHub:
   ```bash
   git add .
   git commit -m "feat: อัปเดตฟีเจอร์ใหม่"
   git push origin dev-updates
   ```

### ขั้นตอนที่ 3: ทดสอบผ่านลิงก์จำลองของ Vercel (Preview Deployment)
1. เมื่อ Push ไปที่กิ่งอื่นที่ไม่ใช่ `main` (เช่น `dev-updates`) Vercel จะตรวจพบและทำการ **Build ระบบแบบทดสอบให้ทันที**
2. Vercel จะให้ลิงก์พิเศษสำหรับตรวจสอบความเรียบร้อย (เรียกว่า **Preview URL**) โดยลิงก์นี้จะไม่ทับเว็บจริงและจะมีเฉพาะคุณหรือผู้ร่วมพัฒนาเท่านั้นที่ดูได้
3. ให้ทดสอบฟีเจอร์ใหม่บน Preview URL นี้เพื่อค้นหาบั๊กเพิ่มเติมก่อนอัปเดตของจริง

### ขั้นตอนที่ 4: รวมโค้ดขึ้นเว็บจริง (Merge to Production)
เมื่อมั่นใจแล้วว่าเวอร์ชันทดสอบทำงานได้อย่างสมบูรณ์แบบ ให้ส่งโค้ดนั้นขึ้นเว็บหลัก:
1. ทำการสร้าง **Pull Request (PR)** บน GitHub เพื่อทำการ Review โค้ด
2. หรือใช้คำสั่ง Git เพื่อนำการเปลี่ยนแปลงกลับมายังกิ่ง `main` ในเครื่องคอมพิวเตอร์ของคุณ:
   ```bash
   git checkout main
   git merge dev-updates
   git push origin main
   ```
3. เมื่อส่งโค้ดเข้ากิ่ง `main` เรียบร้อย Vercel จะทำการอัปเดตเว็บหลักที่ทุกคนเข้าใช้งานให้อัตโนมัติในทันทีอย่างปลอดภัยครับ

---

ขอแสดงความยินดีด้วย! คุณพร้อมเปิดตัวแอปพลิเคชันให้ผู้ใช้ทดสอบแล้วครับ 🎉


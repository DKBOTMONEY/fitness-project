# เอกสารสรุปแผนงานพัฒนาระบบ (Project Action Plan)

## ℹ️ ข้อมูลโครงการ

**ชื่อโปรเจกต์:** ระบบ Authentication (Login/Register) และหน้าแดชบอร์ดหลัก

**ภาพรวมโครงการ:** การพัฒนาระบบเข้าสู่ระบบและสมัครสมาชิกด้วยบัญชี Google และ LINE พร้อมหน้าแดชบอร์ดสำหรับผู้ใช้งาน โดยเน้นการออกแบบสไตล์ Glassmorphism และภาพประกอบ 3D ที่สอดคล้องกับพฤติกรรมด้านสุขภาพ

---

## 📋 ระยะที่ 1: การออกแบบส่วนติดต่อผู้ใช้งาน (UI/UX Design)

### 1.1 หน้าเข้าสู่ระบบ (Login)
- [ ] โครงสร้าง 2 คอลัมน์ ธีมสีส้ม (#FF5722)
- [ ] ปุ่ม Social Login: Google และ LINE
- [ ] ภาพประกอบ: มาสคอต 3D ธีมออกกำลังกาย
- [ ] นำเสนอด้วยสไตล์ Glassmorphism

**Output:**
หน้า /login
ดีไซน์ Responsive บนทุกหน้าจอ
Animated transitions เมื่อเลือก Provider
Code

### 1.2 หน้าสมัครสมาชิก (Register)
- [ ] ฟอร์มกรอกข้อมูล: อีเมล (Gmail), รหัสผ่าน และ ยืนยันรหัสผ่าน
- [ ] ดีไซน์คุมโทนสี Layout เดียวกับหน้า Login
- [ ] Validation แบบ Real-time

**Output:**
หน้า /register
ตรวจสอบความแข็งแรงของรหัสผ่าน (Strength Meter)
Error messages ที่ชัดเจน
Code

### 1.3 หน้าหลัก (Home Page / Dashboard)
- [ ] แสดงข้อมูลโปรไฟล์ผู้ใช้หลังเข้าสู่ระบบ (ดึงข้อมูลจาก Google/LINE)
- [ ] วิดเจ็ตติดตามกิจกรรม: คาร์ดิโอ/เวท
- [ ] เลือกหัวข้อ Weight Training
- [ ] ตารางติดตามโภชนาการ

**Output:**
หน้า /dashboard
Widget สำหรับแสดงสถิติการออกกำลังกาย
Nutrition tracking table
Profile card พร้อมรูปโปรไฟล์
Code

### 1.4 สถานะแจ้งเตือน (States & Validation)
- [ ] ออกแบบข้อความแจ้งเตือนเมื่อ:
  - [ ] กรอกรหัสผ่านผิด
  - [ ] อีเมลซ้ำ
  - [ ] รหัสผ่านไม่ตรงกัน
  - [ ] Input validation errors

**Output:**
Toast notifications
Modal alerts สำหรับ error ที่สำคัญ
Visual feedback สำหรับ success states
Code

### 1.5 การรองรับอุปกรณ์ (Responsive Design)
- [ ] ปรับขนาด Layout ให้เหมาะสมกับ:
  - [ ] หน้าจอคอมพิวเตอร์ (Desktop: 1920px+)
  - [ ] แท็บเล็ต (Tablet: 768px-1024px)
  - [ ] โทรศัพท์มือถือ (Mobile: 320px-767px)

**Output:**
Mobile-first design
Breakpoints: sm, md, lg, xl
Touch-friendly UI elements
Code

---

## 🔐 ระยะที่ 2: การตั้งค่าระบบผู้ให้บริการ API (Third-Party Setup)

### 2.1 LINE Developers Console
- [ ] สร้าง LINE Login Channel
- [ ] เปิดสิทธิ์การเข้าถึง Email (Email address permission)
- [ ] กำหนด Callback URL สำหรับการทดสอบ (Localhost):
http://localhost:3000/api/auth/callback/line

Code

**Output:**
Channel ID: [YOUR_CHANNEL_ID]
Channel Secret: [YOUR_CHANNEL_SECRET]
Bot User ID: [YOUR_BOT_USER_ID]
Code

### 2.2 Google Cloud Console
- [ ] สร้าง OAuth 2.0 Client IDs
  - [ ] Web Application Type
  - [ ] Authorized redirect URIs:
    ```
    http://localhost:3000/api/auth/callback/google
    https://yourdomain.com/api/auth/callback/google
    ```
- [ ] ตั้งค่าหน้าจอขอความยินยอม (Consent Screen):
  - [ ] App name: [Your App Name]
  - [ ] User support email: [Your Email]
  - [ ] Scopes: `email`, `profile`

**Output:**
Client ID: [YOUR_CLIENT_ID]
Client Secret: [YOUR_CLIENT_SECRET]
Code

### 2.3 นโยบายความเป็นส่วนตัว (Privacy Policy)
- [ ] จัดทำหน้าเอกสาร PDPA และข้อตกลงการใช้งาน
- [ ] ปักหมุด links ในระบบขอสิทธิ์
- [ ] แนบไฟล์สำหรับการตรวจสอบของ Google และ LINE

**Output:**
หน้า /privacy-policy
หน้า /terms-of-service
Compliance checklist
Code

---

## 💻 ระยะที่ 3: การพัฒนาระบบและฐานข้อมูล (Development & Database)

### 3.1 โครงสร้างโปรเจกต์ (Tech Stack)

┌─────────────────────────────────────────────┐ │ PRESENTATION LAYER │ │ ┌───────────────────────────────────────┐ │ │ │ Next.js 15 (React) + Tailwind CSS │ │ │ │ State: React Context / Zustand │ │ │ │ 3D Assets & Glassmorphism Design │ │ │ └───────────────────────────────────────┘ │ └─────────────────────────────────────────────┘ ↓ ┌─────────────────────────────────────────────┐ │ AUTHENTICATION & SECURITY LAYER │ │ ┌───────────────────────────────────────┐ │ │ │ Better Auth │ │ │ │ Session Management │ │ │ │ OAuth 2.0 / OpenID Connect │ │ │ │ (LINE & Google Integration) │ │ │ └───────────────────────────────────────┘ │ └─────────────────────────────────────────────┘ ↓ ┌─────────────────────────────────────────────┐ │ DATA & BACKEND LAYER │ │ ┌───────────────────────────────────────┐ │ │ │ Next.js Route Handlers (RESTful API) │ │ │ │ Prisma ORM │ │ │ │ PostgreSQL Database │ │ │ └───────────────────────────────────────┘ │ └─────────────────────────────────────────────┘
 ↓ ┌─────────────────────────────────────────────┐ │ INFRASTRUCTURE & DEPLOYMENT LAYER │ │ ┌───────────────────────────────────────┐ │ │ │ Vercel (Serverless Hosting) │ │ │ │ Supabase (Database Hosting) │ │ │ │ GitHub (Version Control & CI/CD) │ │ │ │ Ubuntu (Development Environment) │ │ │ └───────────────────────────────────────┘ │ └─────────────────────────────────────────────┘

Code

#### ติดตั้ง Dependencies

```bash
npm install next react react-dom
npm install -D tailwindcss postcss autoprefixer
npm install next-auth
npm install @prisma/client
npm install prisma -D
npm install zustand  # หรือใช้ Context API
npm install axios
npm install zod  # สำหรับ validation
npm install bcryptjs  # สำหรับ password hashing
Output:

Code
- Project structure ready
- package.json with all dependencies
- Environment variables configured
3.2 โครงสร้างฐานข้อมูล (ER Diagram)
Code
┌──────────────────────────────────────┐
│            USERS TABLE               │
├──────────────────────────────────────┤
│ id (UUID) - Primary Key              │
│ email (VARCHAR, UNIQUE)              │
│ name (VARCHAR)                       │
│ image (VARCHAR) - Profile picture    │
│ provider (ENUM) - 'google'/'line'    │
│ provider_id (VARCHAR)                │
│ created_at (TIMESTAMP)               │
│ updated_at (TIMESTAMP)               │
│ email_verified (BOOLEAN)             │
└──────────────────────────────────────┘
         ↑         ↓         ↑
         │         │         │
    ┌────┴─┐  ┌────┴─┐  ┌────┴─┐
    │ 1:N  │  │ 1:N  │  │ 1:N  │
    ↓      ↓  ↓      ↓  ↓      ↓

┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ ACCOUNTS TABLE   │  │ SESSIONS TABLE    │  │HEALTH_TRACKING   │
├──────────────────┤  ├──────────────────┤  ├──────────────────┤
│ id (UUID)        │  │ id (UUID)        │  │ id (UUID)        │
│ user_id (FK)     │  │ user_id (FK)     │  │ user_id (FK)     │
│ type             │  │ session_token    │  │ activity_type    │
│ provider         │  │ expires          │  │ calories_burned  │
│ provider_account │  │ created_at       │  │ duration_minutes │
│ access_token     │  │ updated_at       │  │ date             │
│ refresh_token    │  │                  │  │ notes            │
│ created_at       │  │                  │  │ created_at       │
└──────────────────┘  └──────────────────┘  └──────────────────┘

┌──────────────────────────────────┐
│   NUTRITION_TRACKING TABLE       │
├──────────────────────────────────┤
│ id (UUID)                        │
│ user_id (FK)                     │
│ meal_type (ENUM)                 │
│ food_items (TEXT)                │
│ calories (INT)                   │
│ protein (DECIMAL)                │
│ carbs (DECIMAL)                  │
│ fats (DECIMAL)                   │
│ date (DATE)                      │
│ created_at (TIMESTAMP)           │
└──────────────────────────────────┘
Prisma Schema
Prisma
// prisma/schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  image         String?
  provider      String?   // 'google' or 'line'
  providerId    String?
  emailVerified DateTime?
  accounts      Account[]
  sessions      Session[]
  healthTracking HealthTracking[]
  nutritionTracking NutritionTracking[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@map("users")
}

model Account {
  id                 String  @id @default(cuid())
  userId             String
  type               String
  provider           String
  providerAccountId  String
  accessToken        String? @db.Text
  refreshToken       String? @db.Text
  user               User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model HealthTracking {
  id              String   @id @default(cuid())
  userId          String
  activityType    String   // 'cardio', 'weightlifting', 'yoga', etc.
  caloriesBurned  Int
  durationMinutes Int
  date            DateTime
  notes           String?
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt       DateTime @default(now())

  @@map("health_tracking")
}

model NutritionTracking {
  id        String   @id @default(cuid())
  userId    String
  mealType  String   // 'breakfast', 'lunch', 'dinner', 'snack'
  foodItems String
  calories  Int
  protein   Decimal
  carbs     Decimal
  fats      Decimal
  date      DateTime
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@map("nutrition_tracking")
}
Output:

Code
- Migrations created
- Database schema implemented
- Relationships established
3.3 ระบบยืนยันตัวตน (Authentication)
Better Auth Configuration
TypeScript
// lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
        line: {
            clientId: process.env.LINE_CLIENT_ID!,
            clientSecret: process.env.LINE_CLIENT_SECRET!,
        },
    },
});
Environment Variables
env
# .env.local

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/auth_db"

# Google OAuth
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# LINE OAuth
LINE_CLIENT_ID="your_line_client_id"
LINE_CLIENT_SECRET="your_line_client_secret"

# Better Auth
BETTER_AUTH_SECRET="your_better_auth_secret_32_chars"
BETTER_AUTH_URL="http://localhost:3000"

# For Production
# NEXTAUTH_URL="https://yourdomain.com"
Output:

Code
- Authentication routes configured
- OAuth providers integrated
- Session management setup
3.4 ความปลอดภัย (Security)
Input Validation with Zod
TypeScript
// lib/validators.ts
import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;
API Route with Validation
TypeScript
// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/lib/validators";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = registerSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        provider: "credentials",
      },
    });

    return NextResponse.json(
      { message: "Registration successful", user: { id: user.id, email: user.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
Output:

Code
- Input validation implemented
- SQL injection prevention
- Password hashing secured
- CSRF protection enabled
🚀 ระยะที่ 4: การนำระบบขึ้นใช้งานจริง (Deployment)
4.1 ชื่อโดเมน (Domain Name)
 เลือกชื่อโดเมน ที่เหมาะสม
 ลงทะเบียนกับ Domain Registrar:
 Namecheap
 GoDaddy
 Google Domains
 หรือ registrar ท้องถิ่น
Output:

Code
- Domain name: yourdomain.com
- Domain registrar: [Selected]
- Nameservers configured
4.2 คลาวด์เซิร์ฟเวอร์ (Cloud Hosting)
Vercel Deployment
bash
# 1. Connect GitHub repository
# Go to https://vercel.com/new
# Select your GitHub repository
# Click "Import"

# 2. Configure environment variables
# NEXTAUTH_URL=https://yourdomain.com
# NEXTAUTH_SECRET=[generated-secret]
# DATABASE_URL=[from-supabase]
# GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
# LINE_CLIENT_ID, LINE_CLIENT_SECRET

# 3. Deploy
# Click "Deploy"
Supabase Database Setup
bash
# 1. Go to https://supabase.com
# 2. Create new project
# 3. Copy DATABASE_URL
# 4. Update .env.local
# 5. Run migrations:

npx prisma migrate dev --name init
npx prisma generate
Output:

Code
- GitHub repository connected
- Vercel deployment pipeline configured
- Supabase database instance created
- Environment variables set
4.3 การจัดการ DNS และความปลอดภัย
 ชี้ค่า DNS ไปยัง Vercel:

Code
Domain Registrar → Manage DNS

NameServers:
- ns1.vercel-dns.com
- ns2.vercel-dns.com
 เปิดใช้งาน HTTPS (SSL Certificate):

 Vercel อัตโนมัติ (ใช้ Let's Encrypt)
 SSL Certificate สถานะ: ✅ Active
 ตั้งค่า Security Headers:

Code
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Output:

Code
- DNS records configured
- SSL/TLS certificate active
- Security headers implemented
- HTTPS enforced
4.4 การตั้งค่าขั้นสุดท้าย (Final Configuration)
Update LINE Developers Console
Code
Channel Settings → Callback URL
https://yourdomain.com/api/auth/callback/line
Update Google Cloud Console
Code
Authorized redirect URIs:
https://yourdomain.com/api/auth/callback/google
Update Privacy Policy & Terms
 Update links ในหน้า Login/Register
Code
Privacy Policy: https://yourdomain.com/privacy-policy
Terms of Service: https://yourdomain.com/terms-of-service
Output:

Code
- Third-party provider credentials updated
- Production Callback URLs configured
- Legal documents live
4.5 การทดสอบระบบ (UAT - User Acceptance Testing)
Test Cases
Test ID	Scenario	Expected Result	Status
TC-001	Register with valid email and password	Account created, verification email sent	[ ]
TC-002	Register with weak password	Error message: "Password must contain..."	[ ]
TC-003	Register with duplicate email	Error message: "Email already registered"	[ ]
TC-004	Login with Google OAuth	Successfully logged in, redirected to dashboard	[ ]
TC-005	Login with LINE OAuth	Successfully logged in, redirected to dashboard	[ ]
TC-006	Access dashboard without authentication	Redirected to login page	[ ]
TC-007	Logout from dashboard	Session cleared, redirected to home	[ ]
TC-008	View health tracking widgets	Displays user activity data	[ ]
TC-009	View nutrition tracking table	Displays meal logs	[ ]
TC-010	Responsive design on mobile	Layout adapts correctly	[ ]
Performance Testing
Code
✓ Page Load Time: < 2 seconds
✓ Time to Interactive (TTI): < 3 seconds
✓ Cumulative Layout Shift (CLS): < 0.1
✓ Largest Contentful Paint (LCP): < 2.5 seconds
✓ First Input Delay (FID): < 100ms
Security Testing
Code
✓ HTTPS enabled and enforced
✓ No sensitive data in logs
✓ CSRF tokens on forms
✓ XSS prevention implemented
✓ SQL injection prevention tested
✓ Password hashing verified
Output:

Code
- All test cases passed ✓
- Performance metrics acceptable ✓
- Security vulnerabilities: NONE ✓
- Production ready for go-live ✓
🏗️ เทคโนโลยีที่ใช้ (Technology Stack)
Frontend Layer
Technology	Purpose	Version
Next.js	React framework สำหรับ SSR/SSG	16.x
React	UI library	19.x
Tailwind CSS	Styling & Glassmorphism	3.x
TypeScript	Type safety	5.x
Authentication & Security
Technology	Purpose	Version
Better Auth
	OAuth 2.0 handler	5.x
bcryptjs	Password hashing	2.x
jsonwebtoken	JWT token management	9.x
Backend & Database
Technology	Purpose	Version
Node.js	Runtime environment	20.x LTS
Express (via Next.js API Routes)	API framework	Built-in
PostgreSQL	Database	14.x+
Prisma	ORM	5.x
Infrastructure & DevOps
Technology	Purpose
Vercel	Hosting & CI/CD
Supabase	Database hosting
GitHub	Version control
Docker	Containerization (optional)
Ubuntu	Development OS
Third-party Services
Service	Purpose
Google OAuth	Social login
LINE Login	Social login
SendGrid (Optional)	Email verification
📂 Project Structure
Code
project-root/
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root layout
│   │   ├── page.tsx                   # Home page
│   │   ├── login/
│   │   │   └── page.tsx              # Login page
│   │   ├── signup/
│   │   │   └── page.tsx              # Signup page (renamed from register)
│   │   ├── dashboard/
│   │   │   ├── page.tsx              # Dashboard page
│   │   │   └── actions.ts            # Server actions
│   │   └── api/
│   │       └── auth/
│   │           └── [[...all]]/route.ts # Better Auth route handler
│   │
│   ├── lib/
│   │   ├── auth.ts                   # Better Auth server config
│   │   ├── auth-client.ts            # Better Auth react client
│   │   ├── prisma.ts                 # Prisma client
│   │   └── email.ts                  # Email service
│   │
│   └── styles/
│       └── globals.css               # Global styles
│
├── prisma/
│   ├── schema.prisma                 # Database schema
│   ├── seed.ts                       # Database seed script
│   └── migrations/                   # Migration files
│
├── .env                              # Environment variables
├── next.config.ts                    # Next.js config
├── tailwind.config.ts                # Tailwind config
└── package.json
# 🏋️ Fitness Web Application Project

เอกสารฉบับนี้คือสรุปภาพรวม แผนการพัฒนา และโครงสร้างสถาปัตยกรรมของเว็บไซต์แอปพลิเคชันสำหรับฟิตเนส (Desktop Web Version) ที่มีระบบ Authentication และ Dashboard แสดงผลข้อมูลส่วนตัว โดยพัฒนาบนมาตรฐานสถาปัตยกรรม Next.js App Router ล่าสุด

---

## 📌 1. ภาพรวมของโปรเจกต์ (Project Overview)
เว็บไซต์ฟิตเนสแพลตฟอร์มที่เน้นการใช้งานบนหน้าจอคอมพิวเตอร์ (Desktop Web) รองรับการเข้าสู่ระบบผ่าน Social Login (Google & LINE) ฟีเจอร์หลักคือหน้า Dashboard ที่ผู้ใช้สามารถเลือกหมวดหมู่การออกกำลังกาย (Free Weights / Machines) และระดับความเข้มข้น เพื่อให้ระบบประมวลผลจัดตารางออกกำลังกายอัตโนมัติ พร้อมติดตามสถิติการวิ่งและโภชนาการ

---

## 🛠️ 2. สถาปัตยกรรมและเทคโนโลยี (Tech Stack)

ระบบประยุกต์ใช้เทคโนโลยี Web Development สมัยใหม่ โดยแบ่งเลเยอร์ดังนี้:

* **1. Presentation Layer (หน้าบ้าน):**
    * **Framework:** Next.js (v15.5) ขับเคลื่อนด้วยสถาปัตยกรรม App Router
    * **UI Library:** React & React DOM (v19)
    * **Language:** Strict TypeScript
    * **Styling:** Tailwind CSS (v4) ทำงานร่วมกับ PostCSS
    * **Bundler:** Turbopack (สำหรับเร่งความเร็วการ Compile ในโหมด Dev และ Build)
    * **Linting:** ESLint ด้วยรูปแบบ Flat Configuration (`eslint.config.mjs`) ครอบคลุมกฎ `next/core-web-vitals` และ `next/typescript`
* **2. Authentication Layer (ระบบจัดการสิทธิ์):**
    * **Library:** NextAuth.js (Auth.js) เชื่อมต่อ LINE Login API และ Google OAuth 2.0
* **3. Data & Backend Layer (หลังบ้านและฐานข้อมูล):**
    * **API:** Next.js Route Handlers
    * **Database:** PostgreSQL (Supabase / Neon) + ORM (Prisma / Drizzle)
* **4. Infrastructure Layer:**
    * **Deployment:** Vercel (CI/CD) พร้อม Custom Domain

---

## 📂 3. โครงสร้างโฟลเดอร์ (Architecture & Structure)

* `src/app/` : ไดเรกทอรีหลักของระบบ App Router
    * `layout.tsx` : โครงสร้างหลักของเว็บ (Root Layout) ใช้กำหนดฟอนต์และตั้งค่า CSS ระดับโกลบอล
    * `page.tsx` : หน้า Landing Page และหน้าหลักของแต่ละ Route
    * `globals.css` : สไตล์ชีตหลักที่เรียกใช้งาน Tailwind CSS
* `public/` : สำหรับจัดเก็บ Static Assets เช่น ภาพ SVG หรือไอคอน (เรียกใช้งานผ่าน `next/image` เพื่อ Optimize ประสิทธิภาพ)
* `next.config.ts` : ไฟล์ตั้งค่า Next.js ด้วย TypeScript
* `eslint.config.mjs` : ไฟล์ตั้งค่ากฎการเขียนโค้ด (ESLint)

---

## 🎨 4. ระบบการออกแบบ (Design System)

* **Theme & Colors:** สไตล์ Glassmorphism คุมโทนสีส้มแอคทีฟ (`#FF5722`), สีเทาชาร์โคล (Athletic Dark Charcoal)
* **Fonts:** ใช้งานโมดูล `next/font/google` โดยใช้ฟอนต์ตระกูล **Geist** และ **Geist_Mono** เป็นหลักเพื่อความทันสมัยและอ่านง่าย
* **Layout Structure (Desktop):** โครงสร้าง 3 คอลัมน์ (Left Sidebar, Center Area, Right Panel)

---

## 💻 5. คำสั่งพื้นฐาน (Building and Running)

โปรเจกต์นี้ใช้คำสั่งมาตรฐานผ่าน `npm` (หรือ yarn/pnpm/bun) ที่กำหนดไว้ใน `package.json`:

* **เริ่มเซิร์ฟเวอร์สำหรับพัฒนา (Development):**
    ```bash
    npm run dev
    ```
    *(รัน Next.js บน `http://localhost:3000` โดยใช้ Turbopack เพื่อความรวดเร็ว)*

* **สร้างไฟล์สำหรับใช้งานจริง (Production Build):**
    ```bash
    npm run build
    ```
    *(สร้าง Build ที่ถูก Optimize อย่างสมบูรณ์ผ่าน Turbopack)*

* **เริ่มเซิร์ฟเวอร์ใช้งานจริง (Start Production):**
    ```bash
    npm run start
    ```

* **ตรวจสอบคุณภาพโค้ด (Linting):**
    ```bash
    npm run lint
    ```

---

## 🚀 6. แผนการดำเนินงาน (Action Plan)

1.  **UI/UX Design:** สเก็ตช์หน้าจอ (Login/Register/Dashboard) บน Figma ตามข้อกำหนดโครงสร้าง 3 คอลัมน์
2.  **API & Third-Party:** ขอสิทธิ์ LINE Login (ดึง Email) และ Google OAuth 2.0
3.  **Development:** เริ่มโปรเจกต์ด้วยคำสั่งสร้าง Next.js 15.5 วางโครงร่างโฟลเดอร์ `src/app` และเชื่อมต่อ Database/Authentication
4.  **Deployment:** Push โค้ดขึ้น GitHub เพื่อทำ CI/CD ไปยัง Vercel และผูก Domain จริง

---

# Skill Stack & Technology List - Authentication & Dashboard Project

## 📋 สารบัญ
1. [Frontend Skills](#frontend-skills)
2. [Backend Skills](#backend-skills)
3. [Database Skills](#database-skills)
4. [DevOps & Infrastructure](#devops--infrastructure)
5. [UI/UX Design Skills](#uiux-design-skills)
6. [Security Skills](#security-skills)
7. [Testing & QA](#testing--qa)
8. [Project Management](#project-management)

---

## 🎨 Frontend Skills

### HTML & CSS
- [ ] **HTML5** - Semantic markup, form validation
- [ ] **CSS3** - Flexbox, Grid, Animations
- [ ] **Tailwind CSS** - Utility-first CSS, responsive design, Glassmorphism effects
- [ ] **PostCSS** - CSS processing and optimization

### JavaScript/TypeScript
- [ ] **JavaScript (ES6+)** - Modern JavaScript features, async/await, promises
- [ ] **TypeScript** - Type safety, interfaces, generics, strict mode
- [ ] **ES Modules** - Module importing/exporting

### React & Next.js
- [ ] **React 19.x** - Functional components, hooks (useState, useEffect, useContext)
- [ ] **React Hooks** - Custom hooks, performance optimization
- [ ] **React Context API** - State management without external libraries
- [ ] **Next.js 16.x** - App Router, Server Components, SSR, API Routes
- [ ] **Next.js Image Optimization** - Image component, lazy loading
- [ ] **Next.js Middleware** - Route protection, redirects

### State Management
- [ ] **Zustand** - Lightweight state management (alternative to Redux)
- [ ] **React Context** - Built-in state management
- [ ] **Local Storage API** - Client-side persistence

### Form Handling & Validation
- [ ] **React Hook Form** - Efficient form management
- [ ] **Zod** - TypeScript-first schema validation
- [ ] **Client-side validation** - Real-time error messages
- [ ] **Server-side validation** - Secure input validation

### Styling & Design
- [ ] **Glassmorphism Design** - Frosted glass effect, transparency, backdrop blur
- [ ] **CSS Animations** - Keyframes, transitions, smooth effects
- [ ] **Responsive Design** - Mobile-first, breakpoints (sm, md, lg, xl)
- [ ] **Dark Mode Support** - Theme switching
- [ ] **Accessibility (a11y)** - ARIA labels, keyboard navigation, color contrast

### UI Components & Libraries
- [ ] **Headless UI** - Unstyled UI components
- [ ] **Radix UI** - Accessible primitive components
- [ ] **React Hot Toast** - Toast notifications
- [ ] **SWR** - Data fetching with caching
- [ ] **Axios** - HTTP client library

### Performance Optimization
- [ ] **Code Splitting** - Dynamic imports, lazy loading
- [ ] **Bundle Analysis** - Identifying large dependencies
- [ ] **Web Vitals** - LCP, CLS, FID optimization
- [ ] **Image Optimization** - Compression, modern formats (WebP)
- [ ] **Caching Strategies** - Browser caching, HTTP caching

---

## 🔧 Backend Skills

### Node.js & Runtime
- [ ] **Node.js 20.x LTS** - Server-side JavaScript runtime
- [ ] **npm/pnpm** - Package management
- [ ] **Environment Variables** - .env configuration

### API Development
- [ ] **RESTful API Design** - HTTP methods, status codes, endpoints
- [ ] **Next.js API Routes** - /app/api/* route handlers
- [ ] **API Request/Response** - JSON handling, error responses
- [ ] **CORS** - Cross-Origin Resource Sharing configuration

### Authentication & Security
- [ ] **NextAuth.js** - OAuth 2.0, session management
- [ ] **OAuth 2.0 Protocol** - Authorization flows, token handling
- [ ] **JWT (JSON Web Tokens)** - Token generation, verification, expiration
- [ ] **bcryptjs** - Password hashing and verification
- [ ] **Session Management** - Server-side sessions, cookies
- [ ] **CSRF Protection** - Cross-Site Request Forgery prevention
- [ ] **HTTP-only Cookies** - Secure cookie handling
- [ ] **Rate Limiting** - API throttling and protection

### Third-party Integration
- [ ] **Google OAuth 2.0** - Google Sign-In integration
- [ ] **LINE Login** - LINE OAuth integration
- [ ] **Provider Credentials Management** - API keys, secrets
- [ ] **Callback URL Handling** - Authorization callbacks

### Error Handling & Logging
- [ ] **Try-catch Blocks** - Error handling in async functions
- [ ] **Error Boundaries** - React error handling
- [ ] **Logging** - Console logs, file logs, error tracking
- [ ] **Sentry** (Optional) - Error monitoring and tracking

---

## 🗄️ Database Skills

### PostgreSQL
- [ ] **SQL Basics** - SELECT, INSERT, UPDATE, DELETE queries
- [ ] **Relational Database Design** - Normalization, relationships
- [ ] **Foreign Keys** - Referential integrity
- [ ] **Indexes** - Query optimization
- [ ] **Transactions** - ACID properties, commit/rollback
- [ ] **Migrations** - Schema versioning

### Prisma ORM
- [ ] **Prisma Schema** - Model definition, relationships
- [ ] **CRUD Operations** - Create, Read, Update, Delete
- [ ] **Prisma Migrations** - Database versioning (`prisma migrate`)
- [ ] **Prisma Studio** - GUI for database management
- [ ] **Relations** - One-to-Many, Many-to-Many relationships
- [ ] **Aggregations** - Count, sum, average queries
- [ ] **Raw SQL** - Direct SQL queries when needed

### Data Modeling
- [ ] **ER Diagrams** - Entity-Relationship modeling
- [ ] **Database Normalization** - 1NF, 2NF, 3NF
- [ ] **User Data Structure** - Users, Accounts, Sessions tables
- [ ] **Health Tracking Schema** - Activity logs, metrics
- [ ] **Nutrition Tracking Schema** - Meal logs, nutrients

### Database Hosting
- [ ] **Supabase** - PostgreSQL hosting, managed database
- [ ] **Connection Pooling** - Managing database connections
- [ ] **Backup & Recovery** - Data backup strategies
- [ ] **Database Monitoring** - Performance metrics

---

## 🚀 DevOps & Infrastructure

### Version Control
- [ ] **Git** - Commit, push, pull, branching
- [ ] **GitHub** - Repository management, collaborations
- [ ] **Branching Strategy** - Git flow, feature branches
- [ ] **Merge Conflicts** - Resolving conflicts
- [ ] **Pull Requests** - Code review process

### CI/CD Pipeline
- [ ] **GitHub Actions** - Workflow automation
- [ ] **Continuous Integration** - Automated testing on push
- [ ] **Continuous Deployment** - Automated deployment
- [ ] **Environment Variables** - Secrets management in CI/CD

### Cloud Hosting & Deployment
- [ ] **Vercel** - Serverless platform, Next.js deployment
- [ ] **Vercel CLI** - Command-line deployment tools
- [ ] **Automatic Deployments** - Git push → Auto deploy
- [ ] **Preview Deployments** - PR preview environments
- [ ] **Environment Configuration** - Staging, Production

### Domain & DNS
- [ ] **Domain Registration** - GoDaddy, Namecheap, Google Domains
- [ ] **DNS Management** - A records, CNAME records
- [ ] **DNS Propagation** - Waiting for DNS updates
- [ ] **Nameserver Configuration** - Pointing to Vercel

### SSL/TLS & Security
- [ ] **HTTPS** - SSL/TLS certificates
- [ ] **Let's Encrypt** - Free SSL certificates
- [ ] **Certificate Management** - Renewal, installation
- [ ] **Security Headers** - HSTS, CSP, X-Frame-Options

### Monitoring & Analytics
- [ ] **Vercel Analytics** - Page performance, traffic
- [ ] **Web Vitals** - Performance monitoring
- [ ] **Error Tracking** - Bug reporting systems
- [ ] **Uptime Monitoring** - Downtime alerts

---

## 🎨 UI/UX Design Skills

### Design Principles
- [ ] **Glassmorphism** - Frosted glass aesthetic
- [ ] **Color Theory** - Brand colors (#FF5722 orange)
- [ ] **Typography** - Font selection, hierarchy
- [ ] **Spacing & Layout** - Padding, margin, white space
- [ ] **Hierarchy & Visual Flow** - User attention direction

### Responsive Design
- [ ] **Mobile-First Design** - Small screen optimization
- [ ] **Breakpoints** - sm (320px), md (768px), lg (1024px), xl (1920px)
- [ ] **Flexible Layouts** - Adaptable to screen sizes
- [ ] **Touch-friendly UI** - Button sizes, spacing for mobile

### 3D Graphics & Assets
- [ ] **3D Mascot Design** - Fitness-themed 3D character
- [ ] **Blender** (Optional) - 3D modeling tool
- [ ] **Three.js** (Optional) - WebGL 3D rendering
- [ ] **Asset Optimization** - File size, format (PNG, WebP)

### User Experience
- [ ] **User Flow Diagrams** - Task flows, navigation
- [ ] **Wireframing** - Low-fidelity mockups
- [ ] **Prototyping** - Interactive mockups
- [ ] **User Testing** - Feedback collection
- [ ] **Accessibility** - WCAG compliance, color contrast
- [ ] **Loading States** - Skeleton screens, spinners
- [ ] **Empty States** - Messaging for empty content
- [ ] **Error States** - Clear error messages

### Design Tools
- [ ] **Figma** - UI/UX design and prototyping
- [ ] **Adobe XD** - Design tool alternative
- [ ] **Miro** - Wireframing and brainstorming

---

## 🔐 Security Skills

### Authentication & Authorization
- [ ] **OAuth 2.0 Flow** - Authorization code flow
- [ ] **OpenID Connect** - Identity layer on top of OAuth
- [ ] **Session Security** - Secure session handling
- [ ] **Password Security** - Strong password requirements
- [ ] **2FA** (Optional) - Two-factor authentication

### Input Validation & Sanitization
- [ ] **Server-side Validation** - Always validate on backend
- [ ] **Client-side Validation** - User experience validation
- [ ] **Schema Validation** - Zod, Joi validation
- [ ] **Input Sanitization** - Remove malicious code
- [ ] **SQL Injection Prevention** - Parameterized queries

### Data Protection
- [ ] **Password Hashing** - bcrypt, argon2
- [ ] **Data Encryption** - Sensitive data at rest and in transit
- [ ] **PII Protection** - Personal Identifiable Information handling
- [ ] **HTTPS/TLS** - Encrypted communication
- [ ] **HTTP-only Cookies** - JavaScript-inaccessible cookies

### Compliance & Privacy
- [ ] **PDPA** - Personal Data Protection Act (Thailand)
- [ ] **Privacy Policy** - Data usage documentation
- [ ] **Terms of Service** - User agreement
- [ ] **Data Retention** - How long data is stored
- [ ] **Right to be Forgotten** - User data deletion

### Common Vulnerabilities
- [ ] **CSRF (Cross-Site Request Forgery)** - Token protection
- [ ] **XSS (Cross-Site Scripting)** - Input escaping
- [ ] **CORS Misconfiguration** - Proper CORS setup
- [ ] **Insecure Dependencies** - Regular updates, auditing
- [ ] **Exposed Secrets** - Environment variable management

---

## 🧪 Testing & QA

### Unit Testing
- [ ] **Jest** - JavaScript testing framework
- [ ] **React Testing Library** - Component testing
- [ ] **Test Coverage** - Code coverage metrics (>80%)
- [ ] **Test Cases** - Happy path, edge cases, error scenarios

### Integration Testing
- [ ] **API Testing** - Endpoint testing
- [ ] **Database Testing** - Query validation
- [ ] **Authentication Flow Testing** - OAuth integration tests

### End-to-End Testing
- [ ] **Playwright** - E2E test automation
- [ ] **Cypress** - Interactive E2E testing
- [ ] **User Journey Testing** - Complete workflow tests
- [ ] **Cross-browser Testing** - Chrome, Firefox, Safari

### Performance Testing
- [ ] **Lighthouse** - Performance audit
- [ ] **Web Vitals Monitoring** - Core Web Vitals
- [ ] **Load Testing** - Server capacity testing
- [ ] **Stress Testing** - Breaking point discovery

### Manual Testing
- [ ] **Manual QA** - User acceptance testing (UAT)
- [ ] **Regression Testing** - Existing features still work
- [ ] **Exploratory Testing** - Discovering edge cases
- [ ] **Device Testing** - Real device testing

### Test Documentation
- [ ] **Test Plans** - Testing strategy
- [ ] **Test Cases** - Detailed test scenarios
- [ ] **Bug Reports** - Issue documentation
- [ ] **Test Results** - Pass/fail records

---

## 📊 Project Management

### Planning & Requirements
- [ ] **Requirements Gathering** - Feature definition
- [ ] **User Stories** - Agile storytelling
- [ ] **Use Cases** - System interaction scenarios
- [ ] **Acceptance Criteria** - Definition of done
- [ ] **Scope Management** - Feature prioritization

### Agile Methodology
- [ ] **Scrum Framework** - Sprint planning, standups
- [ ] **Sprint Planning** - 2-week sprints
- [ ] **Daily Standup** - 15-minute sync meetings
- [ ] **Sprint Review** - Demo to stakeholders
- [ ] **Sprint Retrospective** - Team improvement discussions

### Task Management & Tracking
- [ ] **Jira** - Issue tracking and sprint management
- [ ] **GitHub Issues** - Repository-level task tracking
- [ ] **GitHub Projects** - Kanban board management
- [ ] **Trello** - Visual task management
- [ ] **Milestone Tracking** - Deadline management

### Documentation
- [ ] **README.md** - Project overview
- [ ] **API Documentation** - Endpoint specifications
- [ ] **Architecture Diagrams** - System design
- [ ] **Deployment Guide** - Setup instructions
- [ ] **Troubleshooting Guide** - Common issues and solutions

### Communication & Collaboration
- [ ] **Slack** - Team communication
- [ ] **GitHub Discussions** - Project discussions
- [ ] **Email** - Formal communications
- [ ] **Meeting Management** - Scheduling, note-taking
- [ ] **Stakeholder Updates** - Progress reports

### Risk Management
- [ ] **Risk Identification** - Potential issues
- [ ] **Risk Mitigation** - Preventive measures
- [ ] **Contingency Planning** - Backup plans
- [ ] **Change Management** - Scope change requests

---

## 📚 Learning Path Priority

### Phase 1: Foundation (Weeks 1-2)
**Must Have:**
- [ ] TypeScript basics
- [ ] React fundamentals & Hooks
- [ ] Tailwind CSS basics
- [ ] Next.js App Router

### Phase 2: Core Features (Weeks 3-5)
**Must Have:**
- [ ] NextAuth.js
- [ ] OAuth 2.0 flow
- [ ] PostgreSQL & Prisma
- [ ] Form validation (React Hook Form + Zod)

### Phase 3: Advanced (Weeks 6-8)
**Nice to Have:**
- [ ] Advanced Next.js patterns
- [ ] Performance optimization
- [ ] Error handling & logging
- [ ] Testing (Jest + RTL)

### Phase 4: Deployment (Weeks 9-10)
**Must Have:**
- [ ] Vercel deployment
- [ ] Supabase setup
- [ ] GitHub Actions CI/CD
- [ ] Domain & DNS configuration

---

## 🎯 Critical Skills (Must Learn First)

| Rank | Skill | Priority | Est. Time |
|------|-------|----------|-----------|
| 1 | TypeScript | 🔴 Critical | 5 days |
| 2 | React Hooks | 🔴 Critical | 3 days |
| 3 | Next.js | 🔴 Critical | 5 days |
| 4 | NextAuth.js | 🔴 Critical | 4 days |
| 5 | OAuth 2.0 | 🔴 Critical | 3 days |
| 6 | PostgreSQL | 🔴 Critical | 5 days |
| 7 | Prisma ORM | 🔴 Critical | 3 days |
| 8 | Tailwind CSS | 🟠 High | 3 days |
| 9 | Git & GitHub | 🟠 High | 2 days |
| 10 | Zod Validation | 🟠 High | 2 days |
| 11 | Vercel Deployment | 🟠 High | 2 days |
| 12 | React Hook Form | 🟡 Medium | 2 days |
| 13 | Testing (Jest) | 🟡 Medium | 3 days |
| 14 | Glassmorphism Design | 🟡 Medium | 2 days |
| 15 | Web Vitals Optimization | 🟡 Medium | 2 days |

---

## 📖 Recommended Learning Resources

### Official Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [NextAuth.js Docs](https://next-auth.js.org)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Video Tutorials
- **YouTube Channels:**
  - Next.js by Vercel
  - Web Dev Simplified
  - Traversy Media
  - Fireship

### Interactive Learning
- [egghead.io](https://egghead.io) - Video courses
- [Frontend Masters](https://frontendmasters.com) - Advanced courses
- [Scrimba](https://scrimba.com) - Interactive coding lessons
- [LeetCode](https://leetcode.com) - Algorithm practice

### Community & Support
- Stack Overflow
- GitHub Discussions
- Discord communities
- Reddit (r/nextjs, r/reactjs)

---

## ✅ Self-Assessment Checklist

### Frontend
- [ ] Can build responsive layouts with Tailwind CSS
- [ ] Understand React hooks and component lifecycle
- [ ] Can implement form validation with React Hook Form & Zod
- [ ] Know how to optimize performance (code splitting, lazy loading)

### Backend & Database
- [ ] Can design database schemas with Prisma
- [ ] Understand OAuth 2.0 flow and can integrate providers
- [ ] Can write secure API routes in Next.js
- [ ] Know input validation and SQL injection prevention

### DevOps & Deployment
- [ ] Can deploy to Vercel and manage environments
- [ ] Understand DNS and SSL/TLS setup
- [ ] Can use GitHub and basic Git commands
- [ ] Know how to manage environment variables

### Security
- [ ] Understand CSRF, XSS, SQL injection prevention
- [ ] Know password hashing best practices
- [ ] Understand JWT and session management
- [ ] Know HTTPS and SSL/TLS importance

### Testing & QA
- [ ] Can write unit tests with Jest
- [ ] Can write component tests with React Testing Library
- [ ] Understand what to test and test coverage
- [ ] Can use browser DevTools for debugging

---

**Last Updated:** 2026-06-04  
**Status:** Ready for Team Learning  
**Review Cycle:** Every 2 weeks

import React from "react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-primary/20 selection:text-primary">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      ></div>

      <div className="max-w-2xl w-full glass-card p-8 md:p-12 rounded-3xl shadow-2xl relative z-10 my-8">
        <header className="mb-8 border-b border-white/5 pb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-base">fitness_center</span>
            </div>
            <span className="font-bold tracking-tight">HUNDEE</span>
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic text-white mb-2">
            นโยบายความเป็นส่วนตัว
          </h1>
          <p className="text-white/40 text-xs font-bold uppercase tracking-wider">
            อัปเดตล่าสุด: 15 มิถุนายน 2569
          </p>
        </header>

        <div className="space-y-6 text-sm text-white/70 leading-relaxed font-medium">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white uppercase tracking-tight">1. ข้อมูลที่เราเก็บรวบรวม</h2>
            <p>
              เราเก็บรวบรวมข้อมูลเพื่อให้บริการที่ดียิ่งขึ้นแก่ผู้ใช้ของเรา ซึ่งรวมถึง:
            </p>
            <ul className="list-disc list-inside pl-4 space-y-1.5 text-white/60">
              <li>ข้อมูลโปรไฟล์จากการเข้าสู่ระบบด้วย Google และ LINE (อีเมล, ชื่อ, รูปโปรไฟล์)</li>
              <li>ข้อมูลชี้วัดทางกายภาพ (น้ำหนัก, ส่วนสูง, อายุ, ระดับกิจกรรม) ที่คุณระบุโดยสมัครใจ</li>
              <li>บันทึกการออกกำลังกายและโภชนาการที่สร้างขึ้นจากการใช้งานแอปพลิเคชัน</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white uppercase tracking-tight">2. วิธีการใช้ข้อมูลของเรา</h2>
            <p>
              เราใช้ข้อมูลที่เก็บรวบรวมเพื่อปรับแต่งตารางฟิตเนสของคุณ คำนวณค่าการเผาผลาญพลังงาน (TDEE/BMR) ติดตามประวัติการออกกำลังกายและโภชนาการ และปกป้องความปลอดภัยของเซสชันบัญชีผู้ใช้ของคุณ เราไม่มีการขายข้อมูลส่วนบุคคลของคุณให้แก่บุคคลภายนอก
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white uppercase tracking-tight">3. การเก็บรักษาและการลบข้อมูล</h2>
            <p>
              เราจัดเก็บข้อมูลของคุณตราบเท่าที่บัญชีของคุณยังคงใช้งานอยู่ คุณสามารถร้องขอการลบข้อมูลส่วนบุคคลและข้อมูลการบันทึกทั้งหมดของคุณได้ตลอดเวลาโดยติดต่อทีมสนับสนุนของเราที่ <span className="text-primary font-bold">privacy@hundee.com</span>
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white uppercase tracking-tight">4. มาตรการรักษาความปลอดภัย</h2>
            <p>
              เราปฏิบัติตามมาตรฐานความปลอดภัยที่เป็นที่ยอมรับในอุตสาหกรรม รวมถึงการเข้ารหัสข้อมูลขณะส่ง (HTTPS) การเข้ารหัสรหัสผ่านอย่างปลอดภัย และการผสานการทำงานกับโปรโตคอล OAuth 2.0 เพื่อป้องกันการเข้าถึงที่ไม่ได้รับอนุญาต
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link href="/login" className="text-xs font-bold text-primary hover:underline uppercase tracking-wider">
            กลับสู่หน้าเข้าสู่ระบบ
          </Link>
          <p className="text-[10px] text-white/30">
            © 2026 Hundee. สงวนลิขสิทธิ์ทั้งหมด
          </p>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import Link from "next/link";

export default function TermsOfServicePage() {
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
            ข้อกำหนดการให้บริการ
          </h1>
          <p className="text-white/40 text-xs font-bold uppercase tracking-wider">
            อัปเดตล่าสุด: 15 มิถุนายน 2569
          </p>
        </header>

        <div className="space-y-6 text-sm text-white/70 leading-relaxed font-medium">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white uppercase tracking-tight">1. การยอมรับข้อกำหนด</h2>
            <p>
              การเข้าถึงและใช้งานแพลตฟอร์ม Hundee ถือว่าคุณตกลงที่จะปฏิบัติตามและผูกพันตามข้อกำหนดการให้บริการเหล่านี้ หากคุณไม่ตกลง คุณไม่ควรเข้าถึงหรือใช้งานแอปพลิเคชันนี้
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white uppercase tracking-tight">2. ความรับผิดชอบต่อบัญชีผู้ใช้</h2>
            <p>
              คุณมีหน้าที่รับผิดชอบในการรักษาความปลอดภัยของข้อมูลประจำตัวของคุณ (อีเมล, เซสชัน OAuth) และตกลงที่จะแจ้งให้เราทราบทันทีหากมีการเข้าถึงหรือใช้งานบัญชีของคุณโดยไม่ได้รับอนุญาต
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white uppercase tracking-tight">3. ข้อปฏิเสธความรับผิดชอบด้านสุขภาพ</h2>
            <p>
              แผนการออกกำลังกายและโภชนาการที่จัดทำโดย Hundee คำนวณจากสูตรทางคณิตศาสตร์ (เช่น Mifflin-St Jeor) และท่าออกกำลังกายมาตรฐานเท่านั้น มีวัตถุประสงค์เพื่อการศึกษาและการติดตามความฟิตส่วนบุคคลเท่านั้น กรุณาปรึกษาผู้ให้บริการทางการแพทย์หรือผู้เชี่ยวชาญก่อนเริ่มโปรแกรมการฝึกซ้อมหรือโภชนาการใดๆ
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white uppercase tracking-tight">4. การสมัครสมาชิก Pro และการเรียกเก็บเงิน</h2>
            <p>
              เมื่อสมัครสมาชิก Pro Plan ของเรา คุณตกลงที่จะชำระค่าบริการสมาชิกรายเดือน 100 บาท การชำระเงินจะถูกประมวลผลอย่างปลอดภัย คุณสามารถยกเลิกการสมัครสมาชิกได้ตลอดเวลาภายใต้พอร์ทัลจัดการการสมัครสมาชิก
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

import React from 'react';
import { CheckCircle2, Star } from 'lucide-react';
import Link from 'next/link';

export function SubscriptionCard({ className = '' }: { className?: string }) {
  const features = [
    'จัดตารางออกกำลังกายไม่จำกัด',
    'คำนวณและบันทึกสารอาหารขั้นสูง',
    'รายงานความคืบหน้ารายสัปดาห์',
    'บริการช่วยเหลือพิเศษระดับ Pro'
  ];

  return (
    <section className={`glass-card rounded-2xl p-6 shadow-md flex flex-col relative overflow-hidden ${className}`}>
      {/* Decorative background element */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/20 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex items-center gap-2 mb-2">
        <Star size={18} className="text-primary fill-primary" />
        <span className="text-xs font-bold uppercase tracking-wider text-primary">พรีเมียม</span>
      </div>
      
      <h2 className="text-2xl font-bold text-foreground mb-1">แพลน Pro</h2>
      <div className="flex items-baseline gap-1 mb-6">
        <span className="text-3xl font-black text-foreground">100</span>
        <span className="text-sm font-bold text-muted-foreground/60">บาท / เดือน</span>
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
            <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Link 
        href="/dashboard/subscription"
        className="w-full py-4 px-4 bg-primary hover:bg-primary/95 text-white font-black text-center text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-primary/20 mt-auto active:scale-[0.98]"
      >
        ปลดล็อกสิทธิ์ใช้งาน Pro
      </Link>
    </section>
  );
}

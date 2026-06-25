"use client";

import React, { useEffect, useState } from "react";
import { getLineAccountStatus } from "../actions";
import { MessageSquare, CheckCircle, AlertCircle, Sparkles, BookOpen, Send, Zap, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function LineSyncPage() {
  const [lineStatus, setLineStatus] = useState<{ accountId: string; createdAt: Date } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLineAccountStatus()
      .then((data) => {
        setLineStatus(data);
      })
      .catch((err) => {
        console.error("Failed to fetch LINE status:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const commands = [
    {
      title: "สรุปรายงานประจำวัน",
      cmd: "สรุป",
      desc: "เรียกดูสรุปการบริโภคแคลอรีประจำวัน พลังงานที่เผาผลาญ เวลาออกกำลังกาย และชั่วโมงการยืนของคุณในวันนี้",
      icon: Zap,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "บันทึกรายการอาหาร",
      cmd: "กิน อกไก่ 150 แคล 30p 2c 3f",
      desc: "บันทึกมื้ออาหารได้ทันที โดยสามารถระบุโปรตีน (p) คาร์โบไฮเดรต (c) และไขมัน (f) ต่อท้ายได้ตามต้องการ",
      icon: Send,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "บันทึกประวัติการวิ่ง",
      cmd: "วิ่ง 5.2 กม 30 นาที",
      desc: "บันทึกกิจกรรมคาร์ดิโอของคุณ ระบบจะช่วยคำนวณความเร็ว Pace เฉลี่ย และค่าพลังงานที่เผาผลาญให้ในทันที",
      icon: Sparkles,
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    },
    {
      title: "ขอรับตารางฝึกซ้อม",
      cmd: "ขอตาราง บอดี้เวท",
      desc: "ให้ระบบสุ่มจัดตารางออกกำลังกายตามประเภทที่เลือก (บอดี้เวท, ฟรีเวท หรือเครื่องเล่น) และบันทึกลงในแดชบอร์ดของคุณ",
      icon: BookOpen,
      color: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-transparent min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground font-medium mt-2">กำลังตรวจสอบสถานะการเชื่อมต่อ LINE...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-8 relative z-10 selection:bg-primary/20 selection:text-primary">
      <header className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight uppercase italic flex items-center gap-3">
          <MessageSquare className="text-primary" />
          เชื่อมต่อแชทบอท LINE
        </h1>
        <p className="text-muted-foreground font-medium text-sm mt-1">
          ซิงค์บันทึกข้อมูลสุขภาพและตารางการฝึกซ้อมของคุณอย่างง่ายดายผ่านแอปแชท LINE
        </p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 max-w-6xl">
        {/* Status Panel */}
        <div className="xl:col-span-5 space-y-6">
          <div className="glass-card rounded-[2rem] p-8 border border-border bg-card/40 backdrop-blur-md relative overflow-hidden flex flex-col justify-between min-h-[300px]">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <div>
              <h3 className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] mb-6 block">
                สถานะการเชื่อมต่อ
              </h3>

              {lineStatus ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl">
                    <CheckCircle size={28} className="text-emerald-400 shrink-0" />
                    <div>
                      <h4 className="text-lg font-black text-foreground uppercase italic">เชื่อมต่อแล้ว</h4>
                      <p className="text-xs text-emerald-500 font-bold mt-0.5">ระบบเชื่อมโยง LINE ทำงานอยู่</p>
                    </div>
                  </div>

                  <div className="space-y-3 p-4 bg-muted/20 border border-border rounded-2xl text-xs font-semibold text-muted-foreground">
                    <div className="flex justify-between">
                      <span>ไอดีบัญชี LINE</span>
                      <span className="font-mono text-muted-foreground/60">{lineStatus.accountId.slice(0, 8)}...{lineStatus.accountId.slice(-6)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>เชื่อมต่อตั้งแต่เมื่อ</span>
                      <span>{new Date(lineStatus.createdAt).toLocaleDateString("th-TH")}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 bg-amber-500/10 border border-amber-500/20 p-5 rounded-2xl">
                    <AlertCircle size={28} className="text-amber-400 shrink-0" />
                    <div>
                      <h4 className="text-lg font-black text-foreground uppercase italic">ยังไม่ได้เชื่อมต่อ</h4>
                      <p className="text-xs text-amber-500 font-bold mt-0.5">รอการเชื่อมต่อบัญชี LINE</p>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground/80 leading-relaxed font-semibold">
                    ในการเชื่อมต่อบัญชี LINE ของคุณเพื่อบันทึกข้อมูลผ่านแชทบอท กรุณา **ออกจากระบบ** และทำการ **เข้าสู่ระบบใหม่อีกครั้ง** โดยใช้ตัวเลือก **&quot;เข้าสู่ระบบด้วย LINE&quot;** บนหน้าล็อกอิน
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-border flex flex-col items-center gap-4">
              {/* QR Code Container */}
              <div className="relative w-40 h-40 bg-white p-3 rounded-2xl border border-border flex items-center justify-center shadow-inner group overflow-hidden">
                {/* Scan glow animation */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500/80 animate-bounce shadow-[0_0_10px_#10b981] z-10"></div>
                
                {/* QR Code Image */}
                <Image 
                  src="https://qr-official.line.me/sid/M/457zpnpy.png" 
                  alt="LINE QR Code" 
                  width={136}
                  height={136}
                  className="w-full h-full object-contain relative z-20 rounded-xl"
                  unoptimized
                />
              </div>
              <p className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-wider">
                สแกน QR Code หรือเพิ่มเพื่อนไอดี: <span className="text-primary font-black">@457zpnpy</span>
              </p>
            </div>
          </div>
        </div>

        {/* Command Cheat Sheet */}
        <div className="xl:col-span-7 space-y-4">
          <h3 className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest pl-1">
            คู่มือคำสั่งสำหรับพิมพ์แชทกับบอท LINE
          </h3>
          <div className="space-y-3">
            {commands.map((cmd, idx) => {
              const Icon = cmd.icon;
              return (
                <div key={idx} className="glass-card border border-border p-5 rounded-2xl flex items-start gap-4 hover:border-primary/20 transition-all group">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${cmd.color}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-foreground">{cmd.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{cmd.desc}</p>
                    
                    <div className="mt-3 flex items-center gap-2 bg-muted/10 border border-border px-3 py-1.5 rounded-lg w-fit">
                      <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider">ตัวอย่างการพิมพ์:</span>
                      <code className="text-xs font-mono font-black text-primary select-all">{cmd.cmd}</code>
                      <ChevronRight size={12} className="text-muted-foreground/30 group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

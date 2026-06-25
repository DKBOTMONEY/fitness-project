"use client";

import React, { useState, useEffect, Suspense } from "react";
import { getUserProfile, verifyStripeSession } from "../actions";
import { CheckCircle2, Star, ShieldCheck, Crown } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

function PremiumCountdown({ endDate }: { endDate: string | Date }) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    expired: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false });

  useEffect(() => {
    const target = new Date(endDate).getTime();

    const calculate = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, expired: false });
    };

    calculate();
    const timer = setInterval(calculate, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (timeLeft.expired) {
    return (
      <span className="text-rose-500 font-bold text-sm">Expired</span>
    );
  }

  return (
    <div className="flex gap-3 justify-center items-center mt-3">
      <div className="flex flex-col bg-primary/20 border border-primary/30 rounded-2xl px-4 py-2 min-w-[70px] shadow-[0_0_15px_rgba(255,87,34,0.1)]">
        <span className="text-lg font-black text-primary">{timeLeft.days}</span>
        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Days</span>
      </div>
      <div className="flex flex-col bg-white/5 border border-white/10 rounded-2xl px-4 py-2 min-w-[70px]">
        <span className="text-lg font-black text-white/90">{timeLeft.hours}</span>
        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Hours</span>
      </div>
      <div className="flex flex-col bg-white/5 border border-white/10 rounded-2xl px-4 py-2 min-w-[70px]">
        <span className="text-lg font-black text-white/90">{timeLeft.minutes}</span>
        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Mins</span>
      </div>
      <div className="flex flex-col bg-white/5 border border-white/10 rounded-2xl px-4 py-2 min-w-[70px]">
        <span className="text-lg font-black text-white/90 animate-pulse">{timeLeft.seconds}</span>
        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Secs</span>
      </div>
    </div>
  );
}

function SubscriptionContent() {
   
  const [profile, setProfile] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    getUserProfile().then(setProfile);
  }, []);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (searchParams.get("success") === "true") {
      if (sessionId) {
        verifyStripeSession(sessionId).then((res) => {
          if (res.success) {
            getUserProfile().then(setProfile);
          }
        });
      }
      toast.success("Subscription activated successfully!", {
        description: "Welcome to Hundee Pro! Premium features are now unlocked.",
      });
    } else if (searchParams.get("canceled") === "true") {
      toast.error("Payment session canceled.", {
        description: "Your transaction was not completed.",
      });
    }
  }, [searchParams]);

  const handleSubscribe = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
      });

      const data = await response.json();
      if (!response.ok || !data.url) {
        throw new Error(data.error || "Failed to initiate payment session");
      }

      // Redirect to Stripe Checkout Page
      window.location.href = data.url;
    } catch (error: any) {
      toast.error(error.message || "Payment initiation failed. Please try again.");
      setIsProcessing(false);
    }
  };

  if (!profile) {
    return (
      <div className="flex flex-col h-full gap-8 relative z-10">
        <header className="mb-4">
          <div className="h-8 w-64 bg-muted rounded-lg animate-pulse"></div>
          <div className="h-4 w-80 bg-muted rounded animate-pulse mt-2"></div>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl">
          {[1, 2].map((i) => (
            <div key={i} className="glass-card rounded-2xl p-6 border border-border min-h-[300px] animate-pulse">
              <div className="h-6 w-32 bg-muted rounded mb-6"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-4 bg-muted rounded w-full"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Calculate Trial Status
  const createdAt = new Date(profile.createdAt);
  const trialEndDate = new Date(createdAt.getTime() + 30 * 24 * 60 * 60 * 1000);
  const now = new Date();
  
  const daysRemaining = Math.max(0, Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  const isTrialActive = profile.subscriptionStatus === "TRIAL" && daysRemaining > 0;
  const isSubscribed = profile.subscriptionStatus === "ACTIVE";

  const features = [
    'Unlimited workout generations',
    'Advanced macro tracking',
    'Weekly progress reports',
    'Premium support'
  ];

  return (
    <div className="flex flex-col h-full gap-8 relative z-10 selection:bg-primary/20 selection:text-primary">
      <header className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
          Subscription Management
        </h1>
        <p className="text-muted-foreground font-medium text-sm mt-1">
          Unlock your full potential with premium features.
        </p>
      </header>

      <div className="max-w-5xl">
        {isSubscribed ? (
          <div className="glass-card rounded-[2rem] p-8 md:p-12 border border-primary/20 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 relative overflow-hidden flex flex-col items-center text-center shadow-2xl">
            {/* Decorative backgrounds */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
            
            {/* Premium Status Heading */}
            <div className="flex items-center gap-2 bg-primary/20 border border-primary/30 px-4 py-2 rounded-full text-primary text-xs font-black uppercase tracking-widest mb-4 shadow-[0_0_15px_rgba(255,87,34,0.15)] animate-pulse">
              <Crown size={14} className="fill-primary animate-pulse" />
              Premium Active • พรีเมี่ยมแอคทีฟ
            </div>

            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Hundee Premium Member</span>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tight mb-4">You are a Pro Member</h2>
            <p className="text-muted-foreground text-sm max-w-md mb-8 leading-relaxed font-medium">
              Your subscription is active. You have full access to all dynamic workout models, advanced nutrition logs, and continuous running metrics.
            </p>

            {/* Countdown Widget */}
            <div className="w-full max-w-md bg-white/[0.02] border border-white/5 p-6 rounded-[1.8rem] mb-8 text-center">
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest block mb-2">เวลาสมาชิกคงเหลือ (Countdown)</span>
              {profile.subscriptionEndDate && (
                <PremiumCountdown endDate={profile.subscriptionEndDate} />
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg mb-8 text-left">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                  <CheckCircle2 size={18} className="text-primary shrink-0" />
                  <span className="text-xs font-semibold text-white/70">{feature}</span>
                </div>
              ))}
            </div>

            {/* Billing dates */}
            <div className="w-full max-w-md p-6 bg-white/[0.02] border border-white/5 rounded-[1.8rem] mb-8 grid grid-cols-2 gap-4 divide-x divide-white/5">
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">วันที่เริ่มสมัคร (Start Date)</span>
                <span className="text-xs font-bold text-white/80 mt-1">
                  {profile.subscriptionEndDate ? (() => {
                    const end = new Date(profile.subscriptionEndDate);
                    const start = new Date(end);
                    start.setMonth(end.getMonth() - 1);
                    return start.toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" });
                  })() : "-"}
                </span>
              </div>
              <div className="flex flex-col text-left pl-4">
                <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">วันหมดอายุ (Expiration Date)</span>
                <span className="text-xs font-bold text-primary mt-1">
                  {profile.subscriptionEndDate ? new Date(profile.subscriptionEndDate).toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" }) : "-"}
                </span>
              </div>
            </div>

            <button
              onClick={handleSubscribe}
              disabled={isProcessing}
              className="w-full max-w-md py-4 px-6 bg-primary hover:bg-primary/95 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              {isProcessing && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              {isProcessing ? "Connecting to Portal..." : "Manage Subscription"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Current Status Card */}
            <section className="glass-card rounded-2xl p-6 border border-border flex flex-col justify-between relative overflow-hidden group">
              <div>
                <div className="flex items-center gap-2 mb-8 border-b border-border pb-4">
                  <span className="w-1.5 h-6 bg-primary rounded-full inline-block"></span>
                  <h3 className="text-lg font-bold text-foreground">Current Status</h3>
                </div>
                
                <div className="flex items-center gap-4 mb-8 bg-muted p-4 rounded-xl border border-border">
                  <div className={`w-3 h-3 rounded-full ${isTrialActive ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" : "bg-rose-500 shadow-[0_0_8px_#f43f5e]"}`}></div>
                  <span className="font-black text-xl text-foreground">
                    {isTrialActive ? "Free Trial" : "Expired"}
                  </span>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-muted-foreground font-semibold text-sm">
                    <ShieldCheck size={20} className="text-emerald-400" />
                    Personalized Workout Plans
                  </li>
                  <li className="flex items-center gap-3 text-muted-foreground font-semibold text-sm">
                    <ShieldCheck size={20} className="text-emerald-400" />
                    Advanced Progress Tracking
                  </li>
                  <li className="flex items-center gap-3 text-muted-foreground font-semibold text-sm">
                    <ShieldCheck size={20} className="text-emerald-400" />
                    Nutrition Strategy
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-muted/50 rounded-xl text-center border border-border border-dashed">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                  {isTrialActive 
                    ? `Trial ends in: ${daysRemaining} days`
                    : "Renew now to continue training."}
                </p>
              </div>
            </section>

            {/* Upgrade Card */}
            <section className="bg-gradient-to-b from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20 flex flex-col relative overflow-hidden group shadow-2xl">
              {/* Decorative background element */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-2 mb-2">
                  <Star size={18} className="text-primary fill-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Premium</span>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-black text-foreground uppercase italic tracking-tighter mb-2">Pro Plan</h2>
                <p className="text-muted-foreground text-sm mb-6">Unlimited access to all elite training features.</p>
                
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl md:text-5xl font-black text-foreground">100</span>
                  <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider ml-1">THB / month</span>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  {features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground font-semibold">
                      <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handleSubscribe}
                  disabled={isProcessing}
                  className="w-full py-4 px-4 bg-primary text-white hover:bg-primary/95 shadow-primary/20 font-black uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
                >
                  {isProcessing ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : null}
                  {isProcessing ? "Processing..." : "Subscribe Now"}
                </button>
                
                {/* ponytail: test card hint for beta testing */}
                <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-xl text-xs text-center text-muted-foreground">
                  <span className="font-bold text-primary block mb-1">🔧 โหมดทดสอบ (Test Mode)</span>
                  ใส่เลขบัตร <code className="bg-muted px-1 py-0.5 rounded text-foreground font-mono">4242 4242 4242 4242</code><br/>
                  วันหมดอายุอนาคต / CVC อะไรก็ได้
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SubscriptionPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col h-full gap-8 relative z-10">
        <header className="mb-4">
          <div className="h-8 w-64 bg-muted rounded-lg animate-pulse"></div>
          <div className="h-4 w-80 bg-muted rounded animate-pulse mt-2"></div>
        </header>
      </div>
    }>
      <SubscriptionContent />
    </Suspense>
  );
}
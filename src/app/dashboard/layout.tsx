"use client";

import React, { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { Sidebar } from "@/components/Sidebar";
import { BottomNav } from "@/components/BottomNav";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { usePathname, useRouter } from "next/navigation";
import { getUserProfile } from "./actions";
import { Lock, CreditCard } from "lucide-react";
import Link from "next/link";
import { ReportIssueModal } from "@/components/ReportIssueModal";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = authClient.useSession();
  const pathname = usePathname();
  const router = useRouter();
   
  const [profile, setProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isReportOpen, setIsReportOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsReportOpen(true);
    window.addEventListener('open-bug-report', handleOpen);
    return () => window.removeEventListener('open-bug-report', handleOpen);
  }, []);

  useEffect(() => {
    if (session) {
      getUserProfile()
        .then((data) => {
          setProfile(data);
          // Redirect to onboarding if basic info is missing
          if (data && (!data.currentWeight || !data.height) && pathname !== "/dashboard/onboarding") {
            router.push("/dashboard/onboarding");
          }
        })
        .catch((err) => {
          console.error("Failed to fetch profile in layout:", err);
        })
        .finally(() => {
          setLoadingProfile(false);
        });
    } else {
      setLoadingProfile(false);
    }
  }, [session, pathname, router]);

  // Show loading state while checking session or profile
  if (isPending || (session && loadingProfile)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="font-body text-sm text-muted-foreground animate-pulse">
            Verifying your session...
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Calculate Pro Access
  const hasProAccess = () => {
    if (!profile) return true; // Default to true during loading to prevent flicker
    if (profile.subscriptionStatus === "ACTIVE") return true;
    if (profile.subscriptionStatus === "TRIAL") {
      const createdAt = new Date(profile.createdAt);
      const trialEndDate = new Date(createdAt.getTime() + 30 * 24 * 60 * 60 * 1000);
      return new Date() < trialEndDate;
    }
    return false;
  };

  const showBlocker = !loadingProfile && !hasProAccess() && 
    pathname !== "/dashboard/subscription" && 
    pathname !== "/dashboard/settings" && 
    pathname !== "/dashboard/profile";

  if (showBlocker) {
    return (
      <div className="min-h-screen bg-background text-foreground font-sans flex flex-col md:flex-row relative overflow-hidden selection:bg-primary/20 selection:text-primary">
        {/* Background Decoration */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <Sidebar />
        <BottomNav />
        
        <main className="flex-1 flex flex-col items-center justify-center p-6 z-10">
          <div className="glass-card rounded-[2rem] p-8 md:p-12 border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent max-w-md w-full text-center shadow-2xl relative overflow-hidden">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Lock size={28} className="text-primary fill-primary animate-pulse" />
            </div>
            
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 block">Access Blocked</span>
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tight mb-4">Pro Access Required</h2>
            <p className="text-muted-foreground text-sm mb-8 leading-relaxed font-semibold">
              Your 30-day free trial has expired or your premium subscription is inactive. Please renew or purchase a Pro plan to continue using this feature.
            </p>
            
            <div className="flex flex-col gap-3">
              <Link 
                href="/dashboard/subscription"
                className="w-full py-4 px-6 bg-primary hover:bg-primary/95 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                <CreditCard size={18} />
                Renew Subscription
              </Link>
              <Link 
                href="/dashboard/settings"
                className="w-full py-4 px-6 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 text-white/70 hover:text-white font-bold uppercase tracking-wider rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer text-xs"
              >
                Adjust Bio Data
              </Link>
            </div>
          </div>
        </main>
        <ReportIssueModal open={isReportOpen} onOpenChange={setIsReportOpen} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col md:flex-row relative selection:bg-primary/20 selection:text-primary overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Grid background layer - Planner style */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      ></div>

      {pathname !== "/dashboard/onboarding" && (
        <>
          <Sidebar />
          <BottomNav />
        </>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto z-10 custom-scrollbar">
        <div className="p-4 md:p-6 lg:p-10 w-full min-h-full">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
          {/* Bottom spacing for mobile nav */}
          <div className="h-16 md:h-8"></div>
        </div>
      </main>

      <ReportIssueModal open={isReportOpen} onOpenChange={setIsReportOpen} />
      
      {/* Adding a subtle global custom scrollbar style */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: hsl(var(--muted));
          border-radius: 20px;
          border: 2px solid transparent;
        }
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}} />
    </div>
  );
}

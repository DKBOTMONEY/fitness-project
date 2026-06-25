"use client";

import React, { useState, useEffect } from 'react';
import { Target, Zap, Flame, Loader2, Crown } from 'lucide-react';
import { getDailyStats, getUserProfile } from '@/app/dashboard/actions';

export function DashboardOverview({ className = '' }: { className?: string }) {
  const [stats, setStats] = useState({
    consumed: 0,
    burned: 0,
    exerciseMins: 0,
    standHours: 0,
    targets: { move: 600, nutrition: 2200 }
  });
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsData, profileData] = await Promise.all([
          getDailyStats(),
          getUserProfile()
        ]);
        if (statsData) {
          setStats(statsData);
        }
        if (profileData) {
          setProfile(profileData);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const rings = [
    { 
      label: 'Move', 
      current: stats.burned, 
      target: stats.targets?.move || 600, 
      unit: 'kcal', 
      color: 'text-rose-500', 
      icon: Flame,
      desc: 'Active calories burned'
    },
    { 
      label: 'Exercise', 
      current: stats.exerciseMins, 
      target: 45, 
      unit: 'min', 
      color: 'text-emerald-500', 
      icon: Zap,
      desc: 'Total workout time'
    },
    { 
      label: 'Nutrition', 
      current: stats.consumed, 
      target: stats.targets?.nutrition || 2200, 
      unit: 'kcal', 
      color: 'text-amber-500', 
      icon: Target,
      desc: 'Calories consumed today'
    },
  ];

  if (loading) {
    return (
      <section className={`glass-card rounded-2xl p-6 flex flex-col min-h-[300px] ${className}`}>
        {/* Skeleton loading */}
        <div className="flex justify-between items-center mb-6">
          <div className="h-6 w-32 bg-muted rounded-lg animate-pulse"></div>
          <div className="h-6 w-28 bg-muted rounded-full animate-pulse"></div>
        </div>
        <div className="flex-1 flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-4">
              <div className="w-32 h-32 rounded-full bg-muted animate-pulse"></div>
              <div className="h-4 w-16 bg-muted rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className={`glass-card rounded-2xl p-6 flex flex-col ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <span className="w-1.5 h-6 bg-primary rounded-full inline-block"></span>
          Daily Protocol
        </h2>
        <div className="flex items-center gap-2">
          {profile?.subscriptionStatus === "ACTIVE" && (
            <span className="text-[9px] font-black text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-[0_0_10px_rgba(255,87,34,0.1)] animate-pulse">
              <Crown size={10} className="fill-primary" />
              PRO ACTIVE
            </span>
          )}
          <span className="text-xs font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
        {rings.map((ring, idx) => {
          const percentage = Math.min(100, Math.round((ring.current / ring.target) * 100));
          const circumference = 2 * Math.PI * 40;
          const strokeDashoffset = circumference - (percentage / 100) * circumference;
          const Icon = ring.icon;

          return (
            <div key={idx} className="flex flex-col items-center gap-4 group">
              <div className="relative w-32 h-32 flex items-center justify-center transition-transform group-hover:scale-105 duration-300">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-muted"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className={`${ring.color} transition-all duration-1000 ease-out`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Icon size={20} className={`${ring.color} mb-1 opacity-80`} />
                  <span className="text-xl font-bold text-foreground leading-none">{ring.current.toLocaleString()}</span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter mt-1">{ring.unit}</span>
                </div>
              </div>
              <div className="text-center">
                <p className="font-bold text-foreground/80 text-sm uppercase tracking-wide">{ring.label}</p>
                <p className="text-[10px] text-muted-foreground font-medium">Goal: {ring.target.toLocaleString()}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-muted p-3 rounded-xl border border-border">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Status</p>
          <p className="text-xs font-medium text-foreground/70 italic">
            {stats.burned > 0 ? "You're making great progress today!" : "Start your first activity to see results."}
          </p>
        </div>
        {profile?.subscriptionStatus === "ACTIVE" && profile?.subscriptionEndDate ? (
          <div className="bg-primary/5 p-3 rounded-xl border border-primary/10">
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Pro Membership</p>
            <p className="text-xs font-bold text-foreground">
              {(() => {
                const diff = new Date(profile.subscriptionEndDate).getTime() - new Date().getTime();
                const days = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
                return `เหลืออีก ${days} วัน`;
              })()}
            </p>
          </div>
        ) : (
          <div className="bg-muted p-3 rounded-xl border border-border">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Membership</p>
            <p className="text-xs font-medium text-foreground/70">Free Account / Trial</p>
          </div>
        )}
        <div className="bg-muted p-3 rounded-xl border border-border text-right">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Stand</p>
          <p className="text-sm font-black text-sky-400">{stats.standHours} / 12 <span className="text-[10px] font-bold text-muted-foreground">HRS</span></p>
        </div>
      </div>
    </section>
  );
}

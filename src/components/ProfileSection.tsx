"use client";

import React, { useEffect, useState } from 'react';
import { getUserProfile, updateUserProfile } from '@/app/dashboard/actions';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export function ProfileSection({ className = '' }: { className?: string }) {
   
  const [profile, setProfile] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form States
  const [name, setName] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [currentWeight, setCurrentWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [activityLevel, setActivityLevel] = useState("sedentary");
  const [targetShape, setTargetShape] = useState("Fit");
  
  const router = useRouter();

  useEffect(() => {
    getUserProfile().then((data) => {
      if (data) {
        setProfile(data);
        setName(data.name || "");
        setTargetWeight(data.targetWeight ? data.targetWeight.toString() : "");
        setCurrentWeight(data.currentWeight ? data.currentWeight.toString() : "");
        setHeight(data.height ? data.height.toString() : "");
        setAge(data.age ? data.age.toString() : "");
        setGender(data.gender || "male");
        setActivityLevel(data.activityLevel || "sedentary");
        setTargetShape(data.targetShape || "Fit");
      }
    });
  }, []);

  // TDEE Calculation Logic (Mifflin-St Jeor)
  const calculateTDEE = () => {
    const w = parseFloat(currentWeight);
    const h = parseFloat(height);
    const a = parseInt(age);
    if (isNaN(w) || isNaN(h) || isNaN(a)) return null;

    let bmr = (10 * w) + (6.25 * h) - (5 * a);
    bmr = gender === "male" ? bmr + 5 : bmr - 161;

    const activityFactors: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };

    const factor = activityFactors[activityLevel] || 1.2;
    const tdee = Math.round(bmr * factor);
    
    return {
      maintenance: tdee,
      loseFat: tdee - 500,
      buildMuscle: tdee + 300
    };
  };

  const tdeeResults = calculateTDEE();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateUserProfile({
        name,
        targetWeight: targetWeight ? parseFloat(targetWeight) : undefined,
        currentWeight: currentWeight ? parseFloat(currentWeight) : undefined,
        height: height ? parseFloat(height) : undefined,
        age: age ? parseInt(age) : undefined,
        gender,
        activityLevel,
        targetShape
      });
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  if (!profile) {
    return (
      <section className={`glass-card rounded-2xl p-6 flex items-center justify-center min-h-[400px] ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </section>
    );
  }

  return (
    <section className={`glass-card rounded-2xl p-8 flex flex-col relative overflow-hidden ${className}`}>
      {/* Decorative background element */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex justify-between items-center mb-8 relative z-10">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-3">
          <span className="w-1.5 h-6 bg-primary rounded-full inline-block"></span>
          Health & Metrics
        </h2>
        <div className="flex gap-3">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="text-xs font-bold bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 active:scale-[0.98]"
          >
            {isSaving ? "Saving..." : "Save Metrics"}
          </button>
          <button 
            onClick={handleLogout}
            className="text-xs font-bold bg-muted text-muted-foreground px-4 py-2 rounded-full hover:bg-accent hover:text-foreground transition-all border border-border flex items-center gap-2"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 relative z-10">
        {/* Basic Info */}
        <div className="xl:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest ml-1">Gender</label>
              <div className="flex gap-2">
                {["male", "female"].map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className={`flex-1 py-2 rounded-xl border transition-all font-bold text-xs capitalize ${
                      gender === g ? "bg-primary/20 border-primary text-primary" : "bg-muted border-border text-muted-foreground/60"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest ml-1">Age</label>
              <input 
                type="number" 
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="25"
                className="w-full bg-muted border border-border rounded-xl px-4 py-3 focus:border-primary focus:outline-none transition-all text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest ml-1">Current Weight</label>
              <div className="relative">
                <input 
                  type="number" 
                  step="0.1"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(e.target.value)}
                  placeholder="70.0"
                  className="w-full bg-muted border border-border rounded-xl px-4 py-3 focus:border-primary focus:outline-none transition-all text-foreground"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground/40">KG</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest ml-1">Height</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="175"
                  className="w-full bg-muted border border-border rounded-xl px-4 py-3 focus:border-primary focus:outline-none transition-all text-foreground"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground/40">CM</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest ml-1">Activity Level</label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="w-full bg-muted border border-border rounded-xl px-4 py-3 focus:border-primary focus:outline-none transition-all text-foreground appearance-none cursor-pointer"
              >
                <option value="sedentary" className="bg-popover text-popover-foreground">Sedentary (Office job)</option>
                <option value="light" className="bg-popover text-popover-foreground">Light (1-2 days/week)</option>
                <option value="moderate" className="bg-popover text-popover-foreground">Moderate (3-5 days/week)</option>
                <option value="active" className="bg-popover text-popover-foreground">Active (6-7 days/week)</option>
                <option value="very_active" className="bg-popover text-popover-foreground">Athlete (2x/day)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest ml-1">Target Shape</label>
              <select
                value={targetShape}
                onChange={(e) => setTargetShape(e.target.value)}
                className="w-full bg-muted border border-border rounded-xl px-4 py-3 focus:border-primary focus:outline-none transition-all text-foreground appearance-none cursor-pointer"
              >
                <option value="Lean" className="bg-popover text-popover-foreground">Lean (Lose Weight)</option>
                <option value="Fit" className="bg-popover text-popover-foreground">Fit (Maintain & Tone)</option>
                <option value="Muscular" className="bg-popover text-popover-foreground">Muscular (Gain Mass)</option>
                <option value="Athletic" className="bg-popover text-popover-foreground">Athletic (Performance)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest ml-1">Goal Weight</label>
              <div className="relative">
                <input 
                  type="number" 
                  step="0.1"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(e.target.value)}
                  placeholder="65.0"
                  className="w-full bg-muted border border-border rounded-xl px-4 py-3 focus:border-primary focus:outline-none transition-all text-foreground"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground/40">KG</span>
              </div>
            </div>
          </div>
        </div>

        {/* TDEE Summary Sidebar */}
        <div className="space-y-6">
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 h-full">
            <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4">Metabolic Summary</h3>
            
            {tdeeResults ? (
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground/60 uppercase mb-1">Total Daily Expenditure (TDEE)</p>
                  <p className="text-4xl font-black text-foreground">{tdeeResults.maintenance} <span className="text-xs font-bold text-muted-foreground/60">kcal</span></p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-muted border border-border">
                    <span className="text-xs font-bold text-muted-foreground">Maintain Weight</span>
                    <span className="text-sm font-black text-foreground">{tdeeResults.maintenance}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-xs font-bold text-emerald-500">Lose Fat (-500)</span>
                    <span className="text-sm font-black text-emerald-400">{tdeeResults.loseFat}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <span className="text-xs font-bold text-amber-500">Gain Muscle (+300)</span>
                    <span className="text-sm font-black text-amber-400">{tdeeResults.buildMuscle}</span>
                  </div>
                </div>

                <p className="text-[10px] text-muted-foreground/60 leading-relaxed italic">
                  *Calculated using the Mifflin-St Jeor formula, widely considered the most accurate BMR estimation.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <p className="text-xs text-muted-foreground/40">Complete your metrics to see your metabolic summary.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
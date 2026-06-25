"use client";

import React, { useState, useEffect } from "react";
import { getUserProfile, updateUserProfile } from "../actions";
import { toast } from "sonner";
import { Scale, Heart, Zap, ShieldAlert, Dumbbell, Apple, Loader2 } from "lucide-react";

export default function SettingsPage() {
   
  const [profile, setProfile] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form states matching profile metrics
  const [name, setName] = useState("");
  const [currentWeight, setCurrentWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [activityLevel, setActivityLevel] = useState("sedentary");
  const [targetShape, setTargetShape] = useState("Fit");
  const [targetWeight, setTargetWeight] = useState("");

  useEffect(() => {
    getUserProfile().then((data) => {
      if (data) {
        setProfile(data);
        setName(data.name || "");
        setCurrentWeight(data.currentWeight ? data.currentWeight.toString() : "");
        setHeight(data.height ? data.height.toString() : "");
        setAge(data.age ? data.age.toString() : "");
        setGender(data.gender || "male");
        setActivityLevel(data.activityLevel || "sedentary");
        setTargetShape(data.targetShape || "Fit");
        setTargetWeight(data.targetWeight ? data.targetWeight.toString() : "");
      }
    });
  }, []);

  // Mifflin-St Jeor TDEE calculations
  const calculateMetabolism = () => {
    const w = parseFloat(currentWeight);
    const h = parseFloat(height);
    const a = parseInt(age);

    if (isNaN(w) || isNaN(h) || isNaN(a)) return null;

    // BMR Mifflin-St Jeor
    let bmr = 10 * w + 6.25 * h - 5 * a;
    bmr = gender === "male" ? bmr + 5 : bmr - 161;

    // Activity Multiplier
    const multipliers: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };
    const multiplier = multipliers[activityLevel] || 1.2;
    const tdee = Math.round(bmr * multiplier);

    // Target calorie offset
    let targetCalories = tdee;
    if (targetShape === "Lean") targetCalories = tdee - 500;
    else if (targetShape === "Muscular") targetCalories = tdee + 300;
    else if (targetShape === "Athletic") targetCalories = tdee + 200;

    // Macro breakdown percentages
    const macroPercentages: Record<string, { protein: number; carbs: number; fat: number }> = {
      Lean: { protein: 40, carbs: 30, fat: 30 },
      Fit: { protein: 30, carbs: 45, fat: 25 },
      Muscular: { protein: 35, carbs: 40, fat: 25 },
      Athletic: { protein: 30, carbs: 50, fat: 20 },
    };

    const pct = macroPercentages[targetShape] || { protein: 30, carbs: 45, fat: 25 };
    const pGrams = Math.round((targetCalories * (pct.protein / 100)) / 4);
    const cGrams = Math.round((targetCalories * (pct.carbs / 100)) / 4);
    const fGrams = Math.round((targetCalories * (pct.fat / 100)) / 9);

    return {
      bmr: Math.round(bmr),
      tdee,
      targetCalories,
      macros: {
        protein: pGrams,
        carbs: cGrams,
        fat: fGrams,
        percentages: pct,
      },
    };
  };

  const stats = calculateMetabolism();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateUserProfile({
        name,
        currentWeight: currentWeight ? parseFloat(currentWeight) : undefined,
        height: height ? parseFloat(height) : undefined,
        age: age ? parseInt(age) : undefined,
        gender,
        activityLevel,
        targetShape,
        targetWeight: targetWeight ? parseFloat(targetWeight) : undefined,
      });
      toast.success("Profile settings updated!");
    } catch (error) {
      toast.error("Failed to update profile settings.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!profile) {
    return (
      <div className="flex flex-col h-full gap-8 relative z-10">
        <header className="mb-4">
          <div className="h-8 w-48 bg-muted rounded-lg animate-pulse"></div>
          <div className="h-4 w-72 bg-muted rounded animate-pulse mt-2"></div>
        </header>
        <section className="glass-card rounded-2xl p-8 border border-border max-w-2xl">
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-24 bg-muted rounded animate-pulse"></div>
                <div className="h-12 bg-muted rounded-xl animate-pulse"></div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-8 relative z-10 selection:bg-primary/20 selection:text-primary">
      <header className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
          Settings & Metabolism
        </h1>
        <p className="text-muted-foreground font-medium text-sm mt-1">
          Tune your biological parameters for target outputs.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl">
        {/* Settings Form */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-6">
          <section className="glass-card rounded-2xl p-6 md:p-8 border border-border relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-center gap-2 mb-8 border-b border-border pb-4">
              <span className="w-1.5 h-6 bg-primary rounded-full inline-block"></span>
              <h2 className="text-lg font-bold text-foreground">Profile Parameters</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-muted border border-border focus:border-primary focus:bg-accent focus:outline-none transition-all duration-300 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 font-bold"
                  placeholder="Your Name"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Gender</label>
                  <div className="flex gap-2">
                    {["male", "female"].map((g) => (
                      <button
                        type="button"
                        key={g}
                        onClick={() => setGender(g)}
                        className={`flex-1 py-2.5 rounded-xl border transition-all font-bold text-xs capitalize ${
                          gender === g ? "bg-primary/20 border-primary text-primary" : "bg-muted border-border text-muted-foreground/60"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Age (years)</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full bg-muted border border-border focus:border-primary focus:bg-accent focus:outline-none transition-all duration-300 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 font-bold"
                    placeholder="e.g. 25"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={currentWeight}
                    onChange={(e) => setCurrentWeight(e.target.value)}
                    className="w-full bg-muted border border-border focus:border-primary focus:bg-accent focus:outline-none transition-all duration-300 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 font-bold"
                    placeholder="e.g. 70.0"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Height (cm)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full bg-muted border border-border focus:border-primary focus:bg-accent focus:outline-none transition-all duration-300 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 font-bold"
                    placeholder="e.g. 175"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Goal Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={targetWeight}
                    onChange={(e) => setTargetWeight(e.target.value)}
                    className="w-full bg-muted border border-border focus:border-primary focus:bg-accent focus:outline-none transition-all duration-300 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 font-bold"
                    placeholder="e.g. 65.0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Activity Level</label>
                  <select
                    value={activityLevel}
                    onChange={(e) => setActivityLevel(e.target.value)}
                    className="w-full bg-muted border border-border focus:border-primary focus:outline-none transition-all duration-300 rounded-xl px-4 py-3 text-foreground appearance-none cursor-pointer font-bold"
                  >
                    <option value="sedentary">Sedentary (desk job)</option>
                    <option value="light">Light (1-2 workouts/wk)</option>
                    <option value="moderate">Moderate (3-5 workouts/wk)</option>
                    <option value="active">Active (6-7 workouts/wk)</option>
                    <option value="very_active">Athlete (2x/day workouts)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Target Protocol</label>
                  <select
                    value={targetShape}
                    onChange={(e) => setTargetShape(e.target.value)}
                    className="w-full bg-muted border border-border focus:border-primary focus:outline-none transition-all duration-300 rounded-xl px-4 py-3 text-foreground appearance-none cursor-pointer font-bold"
                  >
                    <option value="Lean">Lean (Fat Loss)</option>
                    <option value="Fit">Fit (Maintenance & Tone)</option>
                    <option value="Muscular">Muscular (Hypertrophy/Bulk)</option>
                    <option value="Athletic">Athletic (Conditioning)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-8 border-t border-border">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto px-8 py-3.5 bg-primary text-white font-black uppercase tracking-widest rounded-full hover:bg-primary/95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <span className="material-symbols-outlined text-lg">save</span>
                )}
                {isSaving ? "Saving..." : "Save Metrics"}
              </button>
            </div>
          </section>
        </form>

        {/* Biological Metrics Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <section className="bg-muted/50 rounded-2xl p-6 border border-border flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Heart size={120} className="text-primary" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
                <span className="w-1.5 h-6 bg-primary rounded-full inline-block"></span>
                <h3 className="text-lg font-bold text-foreground">Biological Summary</h3>
              </div>

              {stats ? (
                <div className="space-y-6">
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Basal Metabolic Rate (BMR)</span>
                    <p className="text-3xl font-black text-foreground">{stats.bmr.toLocaleString()} <span className="text-xs font-bold text-muted-foreground">kcal/day</span></p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Total Daily Energy Expenditure (TDEE)</span>
                    <p className="text-3xl font-black text-foreground">{stats.tdee.toLocaleString()} <span className="text-xs font-bold text-muted-foreground">kcal/day</span></p>
                  </div>

                  <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-1">Target Intake Protocol</span>
                    <p className="text-4xl font-black text-primary">{stats.targetCalories.toLocaleString()} <span className="text-sm font-bold text-primary/60">kcal</span></p>
                    <p className="text-[10px] text-muted-foreground mt-1.5 leading-relaxed font-semibold">
                      Based on your <strong className="text-foreground">{targetShape}</strong> target, configured at {targetShape === "Lean" ? "deficit of -500 kcal" : targetShape === "Muscular" ? "surplus of +300 kcal" : targetShape === "Athletic" ? "surplus of +200 kcal" : "maintenance level"}.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Target Macro Distribution</span>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl text-center">
                        <span className="text-[9px] font-bold text-emerald-500 uppercase flex items-center justify-center gap-1"><Dumbbell size={10} /> Protein</span>
                        <p className="text-lg font-black text-foreground mt-1">{stats.macros.protein}g</p>
                        <span className="text-[9px] text-muted-foreground font-semibold">{stats.macros.percentages.protein}%</span>
                      </div>

                      <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl text-center">
                        <span className="text-[9px] font-bold text-amber-500 uppercase flex items-center justify-center gap-1"><Apple size={10} /> Carbs</span>
                        <p className="text-lg font-black text-foreground mt-1">{stats.macros.carbs}g</p>
                        <span className="text-[9px] text-muted-foreground font-semibold">{stats.macros.percentages.carbs}%</span>
                      </div>

                      <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl text-center">
                        <span className="text-[9px] font-bold text-rose-500 uppercase flex items-center justify-center gap-1"><Scale size={10} /> Fat</span>
                        <p className="text-lg font-black text-foreground mt-1">{stats.macros.fat}g</p>
                        <span className="text-[9px] text-muted-foreground font-semibold">{stats.macros.percentages.fat}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center border border-dashed border-border rounded-xl">
                  <ShieldAlert className="mx-auto text-muted-foreground/30 mb-2" size={32} />
                  <p className="text-xs text-muted-foreground italic font-medium">Please enter age, weight, and height to activate biological summary calculation.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
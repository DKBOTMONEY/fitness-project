"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { updateUserProfile } from "@/app/dashboard/actions";
import { ChevronRight, ChevronLeft, Activity, Target, Weight, CheckCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentWeight: "",
    height: "",
    age: "",
    gender: "male",
    activityLevel: "moderate",
    targetShape: "Fit",
    targetWeight: ""
  });

  const updateForm = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (step === 1 && (!formData.currentWeight || !formData.height || !formData.age)) {
      toast.error("Please fill in all basic metrics.");
      return;
    }
    if (step === 2 && !formData.activityLevel) {
      toast.error("Please select an activity level.");
      return;
    }
    setStep(s => s + 1);
  };

  const handleBack = () => {
    setStep(s => s - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await updateUserProfile({
        currentWeight: parseFloat(formData.currentWeight),
        height: parseFloat(formData.height),
        age: parseInt(formData.age, 10),
        gender: formData.gender,
        activityLevel: formData.activityLevel,
        targetShape: formData.targetShape,
        targetWeight: parseFloat(formData.targetWeight) || parseFloat(formData.currentWeight),
      });
      toast.success("Profile setup complete!");
      // Force a full reload to let layout re-evaluate the profile
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Onboarding failed:", error);
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0
    })
  };

  // We keep a constant direction of 1 for simplicity here
  const direction = 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background text-foreground p-4 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="w-full max-w-lg glass-card rounded-[2.5rem] border border-border shadow-2xl overflow-hidden flex flex-col relative z-10">
        <div className="p-8 pb-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-xl font-black italic uppercase tracking-widest text-primary flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Setup Profile
            </h1>
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i} 
                  className={`h-1.5 w-8 rounded-full transition-colors duration-500 ${step >= i ? 'bg-primary' : 'bg-muted'}`}
                />
              ))}
            </div>
          </div>

          <div className="relative min-h-[450px]">
            <AnimatePresence mode="wait" custom={direction}>
              {step === 1 && (
                <motion.div
                  key="step1"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex flex-col gap-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Basic Metrics</h2>
                    <p className="text-muted-foreground text-sm">We need this to calculate your daily energy expenditure accurately.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Weight (kg)</label>
                      <div className="relative">
                        <Weight className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input type="number" placeholder="70" value={formData.currentWeight} onChange={e => updateForm("currentWeight", e.target.value)} className="w-full bg-muted border border-border rounded-xl pl-9 pr-4 py-3 outline-none focus:border-primary transition-colors font-medium" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Height (cm)</label>
                      <input type="number" placeholder="175" value={formData.height} onChange={e => updateForm("height", e.target.value)} className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors font-medium" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Age</label>
                      <input type="number" placeholder="25" value={formData.age} onChange={e => updateForm("age", e.target.value)} className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Gender</label>
                      <select value={formData.gender} onChange={e => updateForm("gender", e.target.value)} className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors font-medium appearance-none">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex flex-col gap-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Activity Level</h2>
                    <p className="text-muted-foreground text-sm">How active are you in your daily life?</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    {[
                      { id: "sedentary", label: "Sedentary", desc: "Little to no exercise, desk job" },
                      { id: "light", label: "Light Activity", desc: "Light exercise 1-3 days/week" },
                      { id: "moderate", label: "Moderate", desc: "Moderate exercise 3-5 days/week" },
                      { id: "active", label: "Very Active", desc: "Hard exercise 6-7 days/week" },
                    ].map(lvl => (
                      <div 
                        key={lvl.id}
                        onClick={() => updateForm("activityLevel", lvl.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${formData.activityLevel === lvl.id ? 'bg-primary/10 border-primary shadow-sm' : 'bg-muted border-border hover:border-primary/50'}`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-foreground">{lvl.label}</h4>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.activityLevel === lvl.id ? 'border-primary bg-primary' : 'border-muted-foreground/50'}`}>
                            {formData.activityLevel === lvl.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{lvl.desc}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex flex-col gap-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Your Goal</h2>
                    <p className="text-muted-foreground text-sm">What do you want to achieve?</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    {[
                      { id: "Lean", label: "Get Lean", icon: Target, color: "text-amber-500" },
                      { id: "Fit", label: "Stay Fit", icon: Activity, color: "text-emerald-500" },
                      { id: "Muscular", label: "Build Muscle", icon: Weight, color: "text-primary" },
                    ].map(shape => {
                      const Icon = shape.icon;
                      return (
                        <div 
                          key={shape.id}
                          onClick={() => updateForm("targetShape", shape.id)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4 ${formData.targetShape === shape.id ? 'bg-primary/5 border-primary shadow-sm' : 'bg-muted border-border hover:border-primary/50'}`}
                        >
                          <div className={`w-10 h-10 rounded-lg bg-background flex items-center justify-center shadow-sm ${shape.color}`}>
                            <Icon size={20} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-foreground">{shape.label}</h4>
                          </div>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.targetShape === shape.id ? 'border-primary bg-primary' : 'border-muted-foreground/50'}`}>
                            {formData.targetShape === shape.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  
                  <div className="space-y-2 mt-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Target Weight (Optional)</label>
                    <input type="number" placeholder="Optional" value={formData.targetWeight} onChange={e => updateForm("targetWeight", e.target.value)} className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors font-medium" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="p-6 border-t border-border/50 bg-muted/20 flex justify-between items-center">
          {step > 1 ? (
            <button onClick={handleBack} className="flex items-center gap-2 px-4 py-3 font-bold text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft size={18} /> Back
            </button>
          ) : (
            <div></div> // Empty div for spacing
          )}

          {step < 3 ? (
            <button onClick={handleNext} className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95">
              Next <ChevronRight size={18} />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading} className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
              Complete Setup
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

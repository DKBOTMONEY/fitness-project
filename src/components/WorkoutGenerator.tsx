"use client";

import React, { useState, useEffect } from 'react';
import { Dumbbell, Activity, Weight, Check, RefreshCw, Scale, ChevronRight, Zap, Trophy, History, Loader2 } from 'lucide-react';
import { generateWorkout, getLatestWorkout, finishWorkout, getRecoveryStatus } from '@/app/dashboard/actions';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export function WorkoutGenerator({ className = '' }: { className?: string }) {
  const [selectedType, setSelectedType] = useState('Bodyweight');
  const [selectedIntensity, setSelectedIntensity] = useState('Medium');
  const [unit, setUnit] = useState<'kg' | 'lb'>('kg');
  const [loading, setLoading] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [workout, setWorkout] = useState<any>(null);
  const [exercises, setExercises] = useState<any[]>([]);
  const [recovery, setRecovery] = useState({ hours: 0, level: 5, label: "Optimal" });

  const workoutTypes = [
    { id: 'Bodyweight', icon: Activity, desc: 'Natural motion' },
    { id: 'Free Weights', icon: Dumbbell, desc: 'Compound power' },
    { id: 'Weight Machines', icon: Weight, desc: 'Targeted focus' },
  ];

  const intensities = [
    { label: 'Light', count: 3, reps: '12-15', color: 'bg-emerald-500' },
    { label: 'Medium', count: 5, reps: '10-12', color: 'bg-amber-500' },
    { label: 'Intense', count: 8, reps: '6-8', color: 'bg-rose-500' },
  ];

  useEffect(() => {
    loadLatestWorkout();
  }, []);

  const loadLatestWorkout = async () => {
    try {
      const [latest, recStatus] = await Promise.all([
        getLatestWorkout(),
        getRecoveryStatus()
      ]);
      if (recStatus) setRecovery(recStatus);
      if (latest) {
        setWorkout(latest);
        setExercises(latest.exercises.map((ex: any) => ({
          ...ex,
          completed: false,
          weight: ''
        })));
        setSelectedType(latest.category);
        setSelectedIntensity(latest.intensity);
      }
    } catch (error) {
      console.error("Failed to load latest workout", error);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const newWorkout = await generateWorkout(selectedType, selectedIntensity);
      if (newWorkout) {
        setWorkout(newWorkout);
        setExercises(newWorkout.exercises.map((ex: any) => ({
          ...ex,
          completed: false,
          weight: ''
        })));
        toast.success("New protocol generated", { 
          description: `${selectedType} • ${selectedIntensity}`,
          icon: <Zap size={16} className="text-amber-500" />
        });
      } else {
        toast.error("Failed to generate workout: user not authenticated or database error");
      }
    } catch (error) {
      toast.error("Generation failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async () => {
    if (!workout) return;
    const completedCount = exercises.filter(ex => ex.completed).length;
    if (completedCount === 0) {
      toast.error("Record at least one exercise");
      return;
    }

    setFinishing(true);
    try {
      const results = exercises.map(ex => ({
        exerciseId: ex.id,
        weight: parseFloat(ex.weight) || 0,
        completed: ex.completed
      }));
      await finishWorkout(workout.id, results);
      toast.success("Workout Synchronized", { 
        description: "Your progress has been saved to the archive.",
        icon: <Trophy size={16} className="text-emerald-500" />
      });
      // Optionally reset or keep for review
    } catch (err) {
      toast.error("Failed to sync workout");
    } finally {
      setFinishing(false);
    }
  };

  const toggleExercise = (id: string) => {
    setExercises(exercises.map(ex => 
      ex.id === id ? { ...ex, completed: !ex.completed } : ex
    ));
  };

  const updateWeight = (id: string, weight: string) => {
    setExercises(exercises.map(ex => 
      ex.id === id ? { ...ex, weight } : ex
    ));
  };

  const getCurrentReps = () => {
    return intensities.find(i => i.label === selectedIntensity)?.reps || '10-12';
  };

  return (
    <section className={`grid grid-cols-1 lg:grid-cols-12 gap-6 ${className}`}>
      
      {/* Configuration Panel */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <SettingsIcon size={80} className="rotate-12" />
          </div>
          
          <h2 className="text-xl font-black text-foreground tracking-tighter uppercase mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            Configuration
          </h2>

          <div className="space-y-8">
            <div>
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4 block">Protocol Type</label>
              <div className="grid grid-cols-1 gap-2">
                {workoutTypes.map((type) => {
                  const Icon = type.icon;
                  const isActive = selectedType === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                        isActive
                          ? 'border-primary bg-primary/5 text-foreground shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]'
                          : 'border-border bg-muted/20 text-muted-foreground hover:border-muted-foreground/30 hover:bg-muted/40'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        <Icon size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold tracking-tight uppercase">{type.id}</p>
                        <p className="text-[10px] opacity-60 font-medium">{type.desc}</p>
                      </div>
                      {isActive && <ChevronRight size={16} className="text-primary" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4 block">Intensity Level</label>
              <div className="flex flex-wrap gap-2">
                {intensities.map((intensity) => {
                  const isActive = selectedIntensity === intensity.label;
                  return (
                    <button
                      key={intensity.label}
                      onClick={() => setSelectedIntensity(intensity.label)}
                      className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all border flex items-center justify-center gap-2 ${
                        isActive
                          ? 'border-primary bg-primary text-primary-foreground shadow-lg'
                          : 'border-border bg-transparent text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />}
                      {intensity.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-4 bg-primary text-primary-foreground font-black uppercase tracking-widest rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <RefreshCw size={20} className="animate-spin" /> : <Zap size={20} fill="currentColor" />}
              Generate Routine
            </button>
          </div>
        </div>

        {/* Quick Stats / History Preview */}
        <div className="bg-muted/30 border border-border/50 rounded-3xl p-6 flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <History size={14} /> Recovery Status
            </h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
              recovery.level >= 4 ? 'text-emerald-500 bg-emerald-500/10' : 
              recovery.level >= 3 ? 'text-amber-500 bg-amber-500/10' : 
              'text-rose-500 bg-rose-500/10'
            }`}>
              {recovery.label}
            </span>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-black text-foreground tabular-nums">
              {recovery.hours >= 24 ? '>24' : recovery.hours} <span className="text-xs font-bold text-muted-foreground">hrs</span>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-bold text-muted-foreground uppercase">Since last session</p>
              <div className="flex gap-1 mt-1 justify-end">
                {[1,2,3,4,5].map(i => <div key={i} className={`w-1 h-3 rounded-full ${i <= recovery.level ? (recovery.level >= 4 ? 'bg-emerald-500' : recovery.level >= 3 ? 'bg-amber-500' : 'bg-rose-500') : 'bg-muted'}`} />)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Execution Board */}
      <div className="lg:col-span-8 bg-card border border-border/50 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col">
        {/* Board Header */}
        <div className="p-8 border-b border-border/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-muted/10 backdrop-blur-md">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-2xl font-black text-foreground tracking-tighter uppercase italic">
                Active Protocol
              </h3>
              {workout && (
                <span className="text-[10px] font-black bg-primary text-primary-foreground px-2 py-0.5 rounded-md uppercase tracking-tighter">
                  ID: {workout.id.slice(-6).toUpperCase()}
                </span>
              )}
            </div>
            <p className="text-xs font-medium text-muted-foreground">
              {workout ? `${workout.category} • ${workout.intensity} Intensity` : 'Awaiting configuration...'}
            </p>
          </div>
          
          <div className="flex items-center gap-3 self-end md:self-auto">
            <div className="flex bg-muted rounded-full p-1 border border-border/50">
              <button 
                onClick={() => setUnit('kg')}
                className={`px-3 py-1.5 text-[10px] font-black rounded-full transition-all ${unit === 'kg' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
              >
                KG
              </button>
              <button 
                onClick={() => setUnit('lb')}
                className={`px-3 py-1.5 text-[10px] font-black rounded-full transition-all ${unit === 'lb' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
              >
                LB
              </button>
            </div>
            <button 
              onClick={handleFinish}
              disabled={!workout || finishing}
              className="bg-emerald-500 text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center gap-2"
            >
              {finishing ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} strokeWidth={3} />}
              Finish
            </button>
          </div>
        </div>

        {/* Exercise List */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[radial-gradient(circle_at_top_right,var(--muted)_0%,transparent_40%)]">
          <AnimatePresence mode="popLayout">
            {exercises.length > 0 ? (
              <div className="space-y-4">
                {exercises.map((exercise, index) => (
                  <motion.div
                    key={exercise.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`group flex flex-col md:flex-row md:items-center gap-6 p-5 rounded-3xl border transition-all ${
                      exercise.completed 
                        ? 'bg-emerald-500/[0.03] border-emerald-500/20 opacity-80' 
                        : 'bg-card border-border/50 hover:border-primary/30 shadow-sm'
                    }`}
                  >
                    {/* Checkbox / Rank */}
                    <button 
                      onClick={() => toggleExercise(exercise.id)}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                        exercise.completed 
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                          : 'bg-muted text-muted-foreground border border-border group-hover:border-primary/50'
                      }`}
                    >
                      {exercise.completed ? <Check size={24} strokeWidth={3} /> : <span className="text-sm font-black italic">#{index + 1}</span>}
                    </button>
                    
                    {/* Visual & Info */}
                    <div className="flex-1 flex items-center gap-4">
                      {exercise.image && (
                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-border shrink-0 bg-muted/40 p-1 flex items-center justify-center">
                          <Image 
                            src={exercise.image} 
                            alt={exercise.name} 
                            width={64}
                            height={64}
                            unoptimized
                            onError={(e) => {
                                // Fallback if image fails to load
                                (e.currentTarget as HTMLElement).style.display = 'none';
                                (e.currentTarget as HTMLElement).parentElement!.innerHTML = '<div class="text-muted-foreground/20"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-dumbbell"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 3-3"/><path d="m2 6 3-3"/><path d="m3 10 8 8"/><path d="m14 6 8 8"/><path d="M9 22c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2Z"/><path d="M15 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2Z"/><path d="M22 15c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 1.1 0 2-.9 2-2Z"/><path d="M6 9c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 1.1 0 2-.9 2-2Z"/></svg></div>';
                            }}
                            className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <h4 className={`text-base font-black tracking-tight leading-tight ${exercise.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                          {exercise.name}
                        </h4>
                        <div className="flex flex-wrap gap-2 mt-1.5">
                          <span className="text-[9px] font-black text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded">
                            {getCurrentReps()} REPS
                          </span>
                          {exercise.equipment && (
                            <span className="text-[9px] font-bold text-muted-foreground uppercase border border-border px-2 py-0.5 rounded">
                              {exercise.equipment.split(',')[0]}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Weight Input */}
                    <div className="flex items-center gap-3 self-end md:self-auto">
                      <div className={`flex items-center gap-2 bg-muted/50 px-4 py-2.5 rounded-2xl border transition-all ${exercise.completed ? 'opacity-50' : 'focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 shadow-inner'}`}>
                        <Scale size={16} className="text-muted-foreground" />
                        <input 
                          type="number"
                          placeholder="Load"
                          value={exercise.weight}
                          onChange={(e) => updateWeight(exercise.id, e.target.value)}
                          disabled={exercise.completed}
                          className="w-16 bg-transparent text-sm font-black text-foreground outline-none text-center placeholder:text-muted-foreground/30"
                        />
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{unit}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-20">
                <div className="w-20 h-20 rounded-[2rem] bg-muted flex items-center justify-center text-muted-foreground/20 mb-6 border-2 border-dashed border-border">
                  <Dumbbell size={40} />
                </div>
                <h4 className="text-xl font-black text-foreground uppercase tracking-tighter mb-2">No Protocol Loaded</h4>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Configure your session on the left and generate a tactical workout routine to begin tracking.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: var(--border);
          border-radius: 20px;
        }
      `}</style>
    </section>
  );
}

function SettingsIcon({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

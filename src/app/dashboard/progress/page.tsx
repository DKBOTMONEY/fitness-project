"use client";

import React, { useState, useEffect } from "react";
import { 
  getRunningStats, 
  getWorkoutHistory, 
  getNutritionHistory, 
  getWeightHistory, 
  addWeightEntry,
  getUserProfile
} from "../actions";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  ReferenceLine,
  Legend,
  AreaChart,
  Area
} from "recharts";
import { TrendingUp, Activity, Dumbbell, Apple, Scale, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

type TabType = "running" | "workouts" | "nutrition" | "weight";

export default function ProgressPage() {
  const [activeTab, setActiveTab] = useState<TabType>("running");
  const [loading, setLoading] = useState(true);
  
  // Data States
  const [runningData, setRunningData] = useState<any[]>([]);
  const [workoutData, setWorkoutData] = useState<any[]>([]);
  const [nutritionData, setNutritionData] = useState<any[]>([]);
  const [weightData, setWeightData] = useState<any[]>([]);
  const [targetWeight, setTargetWeight] = useState<number | null>(null);
  
  // Input form state for new weight
  const [newWeight, setNewWeight] = useState("");
  const [isLoggingWeight, setIsLoggingWeight] = useState(false);

  const fetchData = async () => {
    try {
      const [running, workouts, nutrition, weight, profile] = await Promise.all([
        getRunningStats(),
        getWorkoutHistory(),
        getNutritionHistory(),
        getWeightHistory(),
        getUserProfile()
      ]);

      // 1. Process Running Stats
      if (running) {
        setRunningData(running.map((s: any) => ({
          ...s,
          displayDate: new Date(s.workoutDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
        })));
      }

      // 2. Process Workout History
      if (workouts) {
        // Group completed exercises by date
        const workoutGroups: Record<string, { date: string; completedExercises: number; workoutCount: number }> = {};
        workouts.forEach((w: any) => {
          const dateStr = new Date(w.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
          
          let completed = 0;
          try {
            const results = typeof w.results === "string" ? JSON.parse(w.results) : w.results;
            if (Array.isArray(results)) {
              completed = results.filter((r: any) => r.completed).length;
            }
          } catch (e) {
            completed = 0;
          }

          if (workoutGroups[dateStr]) {
            workoutGroups[dateStr].completedExercises += completed;
            workoutGroups[dateStr].workoutCount += 1;
          } else {
            workoutGroups[dateStr] = {
              date: dateStr,
              completedExercises: completed,
              workoutCount: 1
            };
          }
        });
        setWorkoutData(Object.values(workoutGroups));
      }

      // 3. Process Nutrition History (Aggregate by day)
      if (nutrition) {
        const nutritionGroups: Record<string, { date: string; calories: number; protein: number; carbs: number; fat: number }> = {};
        nutrition.forEach((n: any) => {
          const dateStr = new Date(n.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });

          if (nutritionGroups[dateStr]) {
            nutritionGroups[dateStr].calories += n.calories;
            nutritionGroups[dateStr].protein += n.protein;
            nutritionGroups[dateStr].carbs += n.carbs;
            nutritionGroups[dateStr].fat += n.fat;
          } else {
            nutritionGroups[dateStr] = {
              date: dateStr,
              calories: n.calories,
              protein: n.protein,
              carbs: n.carbs,
              fat: n.fat
            };
          }
        });
        setNutritionData(Object.values(nutritionGroups));
      }

      // 4. Process Weight History
      if (weight) {
        setWeightData(weight.map((w: any) => ({
          ...w,
          displayDate: new Date(w.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
        })));
      }

      // 5. Target Weight from Profile
      if (profile && profile.targetWeight) {
        setTargetWeight(profile.targetWeight);
      }
    } catch (error) {
      console.error("Failed to load progress details", error);
      toast.error("Failed to load progress analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogWeight = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedWeight = parseFloat(newWeight);
    if (isNaN(parsedWeight) || parsedWeight <= 0) {
      toast.error("Please enter a valid weight");
      return;
    }

    setIsLoggingWeight(true);
    try {
      await addWeightEntry(parsedWeight);
      toast.success("Weight log updated!");
      setNewWeight("");
      await fetchData(); // Refresh data
    } catch (err) {
      toast.error("Failed to log weight");
    } finally {
      setIsLoggingWeight(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full gap-8 relative z-10">
        <header className="mb-4">
          <div className="h-8 w-48 bg-muted rounded-lg animate-pulse"></div>
          <div className="h-4 w-64 bg-muted rounded animate-pulse mt-2"></div>
        </header>
        <div className="grid grid-cols-1 gap-6 md:gap-8 max-w-5xl">
          {[1, 2].map((i) => (
            <div key={i} className="glass-card rounded-2xl p-6 border border-border">
              <div className="h-6 w-48 bg-muted rounded mb-6 animate-pulse"></div>
              <div className="h-[300px] bg-muted rounded-xl animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-8 relative z-10 selection:bg-primary/20 selection:text-primary">
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            Fitness Analytics
          </h1>
          <p className="text-muted-foreground font-medium text-sm mt-1">
            Visualizing your metrics, habits, and journey towards excellence.
          </p>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex bg-muted p-1 rounded-2xl border border-border/50 self-start md:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab("running")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "running" 
                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Activity size={14} />
            Running
          </button>
          <button
            onClick={() => setActiveTab("workouts")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "workouts" 
                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Dumbbell size={14} />
            Workouts
          </button>
          <button
            onClick={() => setActiveTab("nutrition")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "nutrition" 
                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Apple size={14} />
            Nutrition
          </button>
          <button
            onClick={() => setActiveTab("weight")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "weight" 
                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Scale size={14} />
            Weight
          </button>
        </div>
      </header>

      <div className="max-w-5xl">
        {/* RUNNING TAB */}
        <AnimatePresence mode="wait">
          {activeTab === "running" && (
            <motion.div 
              key="running"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 gap-6 md:gap-8"
            >
            {runningData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 glass-card rounded-2xl border border-border shadow-2xl min-h-[400px]">
                <Activity className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <h2 className="text-xl font-bold text-foreground uppercase tracking-tighter">No Running Logs</h2>
                <p className="text-muted-foreground font-medium mt-2">Log your runs in the Running section to view charts.</p>
              </div>
            ) : (
              <>
                {/* Distance Chart */}
                <section className="glass-card rounded-2xl p-6 border border-border relative overflow-hidden">
                  <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-rose-500 rounded-full inline-block shadow-[0_0_8px_#f43f5e]"></span>
                      Distance Covered (km)
                    </h3>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest bg-muted px-2.5 py-1 rounded-full border border-border">Last 30 Sessions</span>
                  </div>
                  
                  <div className="h-[250px] md:h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={runningData}>
                        <defs>
                          <linearGradient id="colorDistance" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                        <XAxis 
                          dataKey="displayDate" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontWeight: 700 }} 
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontWeight: 700 }} 
                        />
                        <Tooltip 
                          contentStyle={{ backgroundColor: "var(--card)", borderRadius: "16px", border: "1px solid var(--border)" }}
                          itemStyle={{ color: "var(--foreground)", fontWeight: 700 }}
                          labelStyle={{ color: "var(--muted-foreground)" }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="distanceKm" 
                          stroke="#f43f5e" 
                          strokeWidth={3} 
                          fillOpacity={1}
                          fill="url(#colorDistance)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </section>

                {/* Duration Chart */}
                <section className="glass-card rounded-2xl p-6 border border-border relative overflow-hidden">
                  <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-emerald-500 rounded-full inline-block shadow-[0_0_8px_#10b981]"></span>
                      Workout Duration (mins)
                    </h3>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest bg-muted px-2.5 py-1 rounded-full border border-border">Last 30 Sessions</span>
                  </div>
                  
                  <div className="h-[250px] md:h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={runningData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                        <XAxis 
                          dataKey="displayDate" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontWeight: 700 }} 
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontWeight: 700 }} 
                        />
                        <Tooltip 
                          contentStyle={{ backgroundColor: "var(--card)", borderRadius: "16px", border: "1px solid var(--border)" }}
                          itemStyle={{ color: "var(--foreground)", fontWeight: 700 }}
                          labelStyle={{ color: "var(--muted-foreground)" }}
                          cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                        />
                        <Bar 
                          dataKey="durationMins" 
                          fill="#10b981" 
                          radius={[4, 4, 0, 0]}
                          barSize={32}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </section>
              </>
            )}
            </motion.div>
          )}

          {/* WORKOUTS TAB */}
          {activeTab === "workouts" && (
            <motion.div 
              key="workouts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 gap-6 md:gap-8"
            >
            {workoutData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 glass-card rounded-2xl border border-border shadow-2xl min-h-[400px]">
                <Dumbbell className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <h2 className="text-xl font-bold text-foreground uppercase tracking-tighter">No Workout Logs</h2>
                <p className="text-muted-foreground font-medium mt-2">Finish generated workout routines to start tracking history.</p>
              </div>
            ) : (
              <section className="glass-card rounded-2xl p-6 border border-border relative overflow-hidden">
                <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-primary rounded-full inline-block shadow-[0_0_8px_#FF5722]"></span>
                    Completed Exercises History
                  </h3>
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest bg-muted px-2.5 py-1 rounded-full border border-border">Total volume</span>
                </div>
                
                <div className="h-[250px] md:h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={workoutData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontWeight: 700 }} 
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontWeight: 700 }} 
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "var(--card)", borderRadius: "16px", border: "1px solid var(--border)" }}
                        itemStyle={{ color: "var(--foreground)", fontWeight: 700 }}
                        labelStyle={{ color: "var(--muted-foreground)" }}
                        cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                      />
                      <Bar 
                        dataKey="completedExercises" 
                        name="Completed Exercises"
                        fill="#FF5722" 
                        radius={[4, 4, 0, 0]}
                        barSize={32}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>
            )}
            </motion.div>
          )}

          {/* NUTRITION TAB */}
          {activeTab === "nutrition" && (
            <motion.div 
              key="nutrition"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 gap-6 md:gap-8"
            >
            {nutritionData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 glass-card rounded-2xl border border-border shadow-2xl min-h-[400px]">
                <Apple className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <h2 className="text-xl font-bold text-foreground uppercase tracking-tighter">No Nutrition Logs</h2>
                <p className="text-muted-foreground font-medium mt-2">Log meals in the Nutrition section to view daily history.</p>
              </div>
            ) : (
              <>
                {/* Calories Trend */}
                <section className="glass-card rounded-2xl p-6 border border-border relative overflow-hidden">
                  <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-amber-500 rounded-full inline-block shadow-[0_0_8px_#f59e0b]"></span>
                      Daily Calorie Intake (kcal)
                    </h3>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest bg-muted px-2.5 py-1 rounded-full border border-border">Daily Intake</span>
                  </div>
                  
                  <div className="h-[250px] md:h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={nutritionData}>
                        <defs>
                          <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                        <XAxis 
                          dataKey="date" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontWeight: 700 }} 
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontWeight: 700 }} 
                        />
                        <Tooltip 
                          contentStyle={{ backgroundColor: "var(--card)", borderRadius: "16px", border: "1px solid var(--border)" }}
                          itemStyle={{ color: "var(--foreground)", fontWeight: 700 }}
                          labelStyle={{ color: "var(--muted-foreground)" }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="calories" 
                          stroke="#f59e0b" 
                          strokeWidth={3} 
                          fillOpacity={1}
                          fill="url(#colorCalories)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </section>

                {/* Macro Breakdown Trend */}
                <section className="glass-card rounded-2xl p-6 border border-border relative overflow-hidden">
                  <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-emerald-500 rounded-full inline-block shadow-[0_0_8px_#10b981]"></span>
                      Daily Macro Intake (grams)
                    </h3>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest bg-muted px-2.5 py-1 rounded-full border border-border">Protein / Carbs / Fat</span>
                  </div>
                  
                  <div className="h-[250px] md:h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={nutritionData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                        <XAxis 
                          dataKey="date" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontWeight: 700 }} 
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontWeight: 700 }} 
                        />
                        <Tooltip 
                          contentStyle={{ backgroundColor: "var(--card)", borderRadius: "16px", border: "1px solid var(--border)" }}
                          itemStyle={{ fontWeight: 700 }}
                          labelStyle={{ color: "var(--muted-foreground)" }}
                        />
                        <Legend iconType="circle" />
                        <Bar dataKey="protein" fill="#10b981" name="Protein (g)" stackId="a" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="carbs" fill="#f59e0b" name="Carbs (g)" stackId="a" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="fat" fill="#f43f5e" name="Fat (g)" stackId="a" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </section>
              </>
            )}
            </motion.div>
          )}

          {/* WEIGHT TAB */}
          {activeTab === "weight" && (
            <motion.div 
              key="weight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 gap-6 md:gap-8"
            >
            {/* Weight Logger Form */}
            <section className="glass-card rounded-2xl p-6 border border-border relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-primary rounded-full inline-block"></span>
                    Log Today&apos;s Weight
                  </h3>
                  <p className="text-xs text-muted-foreground font-semibold mt-1">Keep your biological metrics synchronized.</p>
                </div>
                
                <form onSubmit={handleLogWeight} className="flex gap-2 items-center max-w-sm">
                  <div className="relative">
                    <input 
                      type="number"
                      step="0.1"
                      placeholder="e.g. 70.5"
                      value={newWeight}
                      onChange={(e) => setNewWeight(e.target.value)}
                      className="bg-muted border border-border focus:border-primary focus:outline-none transition-all rounded-xl pl-4 pr-12 py-2.5 text-sm font-bold text-foreground w-36"
                      required
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">KG</span>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoggingWeight}
                    className="bg-primary text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-primary/95 transition-all shadow-md shadow-primary/20 disabled:opacity-50 flex items-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    {isLoggingWeight ? <Loader2 size={12} className="animate-spin text-white" /> : <Plus size={12} />}
                    Log Weight
                  </button>
                </form>
              </div>
            </section>

            {weightData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 glass-card rounded-2xl border border-border shadow-2xl min-h-[300px]">
                <Scale className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <h2 className="text-xl font-bold text-foreground uppercase tracking-tighter">No Weight Logs</h2>
                <p className="text-muted-foreground font-medium mt-2">Log your current weight using the form above to display the trend.</p>
              </div>
            ) : (
              <section className="glass-card rounded-2xl p-6 border border-border relative overflow-hidden">
                <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-primary rounded-full inline-block shadow-[0_0_8px_#FF5722]"></span>
                    Weight Progress Over Time
                  </h3>
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest bg-muted px-2.5 py-1 rounded-full border border-border">Goal Target</span>
                </div>
                
                <div className="h-[250px] md:h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weightData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                      <XAxis 
                        dataKey="displayDate" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontWeight: 700 }} 
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontWeight: 700 }} 
                        domain={['dataMin - 3', 'dataMax + 3']}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "var(--card)", borderRadius: "16px", border: "1px solid var(--border)" }}
                        itemStyle={{ color: "var(--foreground)", fontWeight: 700 }}
                        labelStyle={{ color: "var(--muted-foreground)" }}
                      />
                      {targetWeight && (
                        <ReferenceLine 
                          y={targetWeight} 
                          stroke="#10b981" 
                          strokeDasharray="5 5" 
                          label={{ value: `Target (${targetWeight} kg)`, fill: '#10b981', fontSize: 10, fontWeight: 800, position: 'top' }} 
                        />
                      )}
                      <Line 
                        type="monotone" 
                        dataKey="weight" 
                        name="Weight (kg)"
                        stroke="#FF5722" 
                        strokeWidth={3} 
                        dot={{ fill: "#FF5722", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </section>
            )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
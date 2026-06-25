"use client";

import React, { useState, useEffect } from 'react';
import { Timer, MapPin, Plus, Loader2, History, TrendingUp } from 'lucide-react';
import { addRunningStat, getRunningStats } from '@/app/dashboard/actions';
import { toast } from 'sonner';

export function RunningTracker({ className = '' }: { className?: string }) {
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getRunningStats();
      setStats(data || []);
    } catch (error) {
      console.error("Failed to fetch running stats", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!distance || !duration) {
      toast.error("Please enter both distance and duration");
      return;
    }

    try {
      setIsSaving(true);
      await addRunningStat({
        distanceKm: parseFloat(distance),
        durationMins: parseInt(duration),
      });
      toast.success("Running session recorded!");
      setDistance('');
      setDuration('');
      fetchStats();
    } catch (error) {
      toast.error("Failed to save session");
    } finally {
      setIsSaving(false);
    }
  };

  const totalDistance = stats.reduce((sum, s) => sum + s.distanceKm, 0);
  const avgPace = stats.length > 0 
    ? (stats.reduce((sum, s) => sum + (s.durationMins / s.distanceKm), 0) / stats.length).toFixed(2)
    : '0.00';

  if (loading) {
    return (
      <div className={`bg-card rounded-xl p-6 shadow-sm border border-border flex items-center justify-center min-h-[300px] ${className}`}>
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <section className={`bg-card rounded-xl p-6 shadow-sm border border-border flex flex-col ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <span className="w-1.5 h-6 bg-rose-500 rounded-full inline-block"></span>
          Running Tracker
        </h2>
        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest bg-muted/50 px-3 py-1 rounded-full border border-border/50">
          <TrendingUp size={14} className="text-rose-500" />
          Keep Moving
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        {/* Input Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-muted/30 p-5 rounded-2xl border border-border/50">
            <h3 className="text-xs font-bold text-foreground/70 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Plus size={14} /> Log New Session
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider pl-1">Distance (Kilometers)</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                  <input 
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider pl-1">Duration (Minutes)</label>
                <div className="relative">
                  <Timer size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                  <input 
                    type="number"
                    placeholder="0"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSaving}
                className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                Record Run
              </button>
            </form>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-muted/20 border border-border/50 text-center">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter mb-1">Total Distance</p>
              <p className="text-xl font-black text-foreground">{totalDistance.toFixed(1)} <span className="text-xs font-bold text-muted-foreground">KM</span></p>
            </div>
            <div className="p-4 rounded-xl bg-muted/20 border border-border/50 text-center">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter mb-1">Avg Pace</p>
              <p className="text-xl font-black text-foreground">{avgPace} <span className="text-xs font-bold text-muted-foreground">min/km</span></p>
            </div>
          </div>
        </div>

        {/* History List */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2 px-1">
            <History size={14} /> Recent Activity
          </h3>
          <div className="max-h-[350px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {stats.length > 0 ? (
              stats.slice().reverse().map((stat) => (
                <div key={stat.id} className="p-4 rounded-2xl border border-border bg-muted/10 flex items-center justify-between group hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">
                        {stat.distanceKm} km Run
                      </h4>
                      <p className="text-[10px] font-medium text-muted-foreground uppercase">
                        {new Date(stat.workoutDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-foreground">{stat.durationMins} <span className="text-[10px] text-muted-foreground">MINS</span></p>
                    <p className="text-[10px] font-bold text-rose-500 uppercase">
                      {(stat.durationMins / stat.distanceKm).toFixed(2)} min/km
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center border-2 border-dashed border-border rounded-2xl">
                <MapPin className="mx-auto text-muted/20 mb-3" size={32} />
                <p className="text-xs text-muted-foreground italic font-medium">No running sessions recorded yet.</p>
                <p className="text-[10px] text-muted-foreground/60 mt-1 uppercase font-bold">Your journey begins with the first step</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

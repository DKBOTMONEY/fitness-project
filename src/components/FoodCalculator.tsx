"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Plus, Loader2, Utensils, Search, Info, Zap } from 'lucide-react';
import { addMeal, getDailyNutrition, searchLocalFood, cacheFoodProduct, getUserNutritionTargets } from '@/app/dashboard/actions';
import Image from 'next/image';
import { toast } from 'sonner';

export function FoodCalculator({ className = '' }: { className?: string }) {
  const [meals, setMeals] = useState<any[]>([]);
  const [targets, setTargets] = useState({ calories: 2200, protein: 150, carbs: 200, fat: 65 });
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [searching, setSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Local fallback for common Thai/Fitness foods in case API is down
  const localCommonFoods = [
    { name: 'อกไก่ (Chicken Breast)', brand: 'Popular', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
    { name: 'ไข่ต้ม (Boiled Egg)', brand: 'Popular', calories: 155, protein: 13, carbs: 1.1, fat: 11 },
    { name: 'ข้าวสวย (Cooked Rice)', brand: 'Popular', calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
    { name: 'เวย์โปรตีน (Whey Protein)', brand: 'Popular', calories: 390, protein: 80, carbs: 5, fat: 5 },
    { name: 'กล้วยหอม (Banana)', brand: 'Popular', calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
    { name: 'นมจืด (Fresh Milk)', brand: 'Popular', calories: 62, protein: 3.2, carbs: 4.8, fat: 3.3 },
    { name: 'ขนมปังโฮลวีต (Whole Wheat Bread)', brand: 'Popular', calories: 247, protein: 13, carbs: 41, fat: 3.4 },
  ];
  
  const [newMeal, setNewMeal] = useState({
    mealType: 'Breakfast',
    items: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  });

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);

  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

  useEffect(() => {
    fetchMeals();
    
    // Close suggestions when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchMeals = async () => {
    try {
      const [mealsData, targetsData] = await Promise.all([
        getDailyNutrition(),
        getUserNutritionTargets()
      ]);
      setMeals(mealsData || []);
      if (targetsData) {
        setTargets(targetsData);
      }
    } catch (err) {
      console.error("Failed to fetch targets:", err);
    } finally {
      setLoading(false);
    }
  };

  const searchFood = async (query: string) => {
    if (query.length < 2) {
      // Show popular items when query is short or empty
      setSuggestions(localCommonFoods.slice(0, 5).map(f => ({ ...f, isLocal: true })));
      setShowSuggestions(true);
      return;
    }

    setSearching(true);
    try {
      // 1. Search our Private Local Library (Database)
      const localResults = await searchLocalFood(query) || [];
      const formattedLocal = localResults.map((p: any) => ({
        ...p,
        isLocal: true,
        externalId: p.externalId
      }));

      // 2. Search Global Database via API Proxy
      let apiResults: any[] = [];
      try {
        const response = await fetch(`/api/food-search?query=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        if (response.ok && data.products) {
          apiResults = data.products.map((p: any) => ({
            externalId: p.code || p._id,
            name: p.product_name || p.generic_name || 'Unknown Food',
            brand: p.brands || '',
            calories: Math.round(parseFloat(p.nutriments?.['energy-kcal_100g'] || '0')),
            protein: Math.round(parseFloat(p.nutriments?.protein_100g || '0')),
            carbs: Math.round(parseFloat(p.nutriments?.carbohydrates_100g || '0')),
            fat: Math.round(parseFloat(p.nutriments?.fat_100g || '0')),
            image: p.image_small_url || p.image_url,
            isLocal: false
          })).filter((p: any) => p.calories > 0);
        }
      } catch (e) {
        console.warn("Global search failed, relying on local results");
      }

      // Merge results (Local first)
      const combined = [...formattedLocal, ...apiResults];
      
      // If still empty, add local statics as fallback
      const staticMatch = localCommonFoods
        .filter(f => f.name.toLowerCase().includes(query.toLowerCase()))
        .map(f => ({ ...f, isLocal: true }));
      
      const finalResults = combined.length > 0 ? combined : staticMatch;
      setSuggestions(finalResults);
      setShowSuggestions(finalResults.length > 0);
    } catch (error) {
      console.error("Search failed", error);
      toast.error("Search system limited");
    } finally {
      setSearching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewMeal({ ...newMeal, items: value });

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    
    if (value.trim().length >= 2) {
      searchTimeoutRef.current = setTimeout(() => {
        searchFood(value);
      }, 600);
    } else if (value.trim().length === 0) {
      setSuggestions(localCommonFoods.slice(0, 5).map(f => ({ ...f, isLocal: true })));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleInputFocus = () => {
    if (newMeal.items.trim().length < 2) {
      setSuggestions(localCommonFoods.slice(0, 5).map(f => ({ ...f, isLocal: true })));
      setShowSuggestions(true);
    }
  };

  const selectSuggestion = async (food: any) => {
    setNewMeal({
      ...newMeal,
      items: food.brand && food.brand !== 'Popular' ? `${food.name} (${food.brand})` : food.name,
      calories: food.calories.toString(),
      protein: food.protein.toString(),
      carbs: food.carbs.toString(),
      fat: food.fat.toString()
    });
    setShowSuggestions(false);

    // Auto-Learning: If it came from Global API, cache it in our Local Library
    if (!food.isLocal && food.brand !== 'Popular') {
      try {
        await cacheFoodProduct({
            externalId: food.externalId,
            name: food.name,
            brand: food.brand,
            calories: parseInt(food.calories),
            protein: parseFloat(food.protein),
            carbs: parseFloat(food.carbs),
            fat: parseFloat(food.fat),
            image: food.image
        });
        console.log(`[Auto-Learning] ${food.name} saved to local library`);
      } catch (e) {
        console.error("Failed to cache food product", e);
      }
    }

    toast.info(`Imported: ${food.name}`, { 
        description: food.isLocal ? "From Local Library" : "From Global Database (Cached)",
        icon: food.isLocal ? <div className="w-2 h-2 bg-emerald-500 rounded-full" /> : <div className="w-2 h-2 bg-amber-500 rounded-full" />
    });
  };

  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const calValue = parseInt(newMeal.calories);
    if (!newMeal.items.trim() || isNaN(calValue)) {
      toast.error("Food name and valid calories are required");
      return;
    }

    try {
      setIsAdding(true);
      await addMeal({
        mealType: newMeal.mealType,
        items: newMeal.items,
        calories: calValue,
        protein: parseInt(newMeal.protein) || 0,
        carbs: parseInt(newMeal.carbs) || 0,
        fat: parseInt(newMeal.fat) || 0,
      });
      
      toast.success("Meal added successfully!");
      setNewMeal({
        mealType: 'Breakfast',
        items: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: ''
      });
      setIsAdding(false);
      fetchMeals();
    } catch (err) {
      toast.error('Failed to add meal');
    } finally {setIsAdding(false);
    }
  };

  const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
  const totalProtein = meals.reduce((sum, m) => sum + m.protein, 0);
  const totalCarbs = meals.reduce((sum, m) => sum + m.carbs, 0);
  const totalFat = meals.reduce((sum, m) => sum + m.fat, 0);

  const macros = [
    { label: 'Protein', current: totalProtein, target: targets.protein, color: 'bg-emerald-500' },
    { label: 'Carbs', current: totalCarbs, target: targets.carbs, color: 'bg-amber-500' },
    { label: 'Fat', current: totalFat, target: targets.fat, color: 'bg-rose-500' },
  ];

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
          <span className="w-1.5 h-6 bg-amber-500 rounded-full inline-block"></span>
          Nutrition Log
        </h2>
        <span className="text-sm font-semibold text-foreground/90 bg-muted px-3 py-1 rounded-full border border-border/50">
          {totalCalories.toLocaleString()} / {targets.calories.toLocaleString()} kcal
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        <div className="space-y-6">
          <form onSubmit={handleAddMeal} className="bg-muted/30 p-4 rounded-xl border border-border/50 space-y-4">
            <div className="space-y-1.5 relative" ref={suggestionRef}>
              <label className="text-[10px] font-bold text-amber-500 uppercase tracking-wider flex justify-between">
                <span>Search & Import Food</span>
                {searching && <Loader2 size={10} className="animate-spin" />}
              </label>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
                <input 
                  type="text"
                  placeholder="Search brand or food name..."
                  value={newMeal.items}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                />
              </div>

              {/* API Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                  <div className="p-2 bg-amber-500/10 border-b border-border flex items-center justify-between">
                    <span className="text-[9px] font-black text-amber-600 uppercase flex items-center gap-1">
                      <Zap size={10} fill="currentColor" /> Quick Select
                    </span>
                  </div>
                  <div className="max-h-[250px] overflow-y-auto">
                    {suggestions.map((food, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => selectSuggestion(food)}
                        className="w-full p-3 flex items-center gap-3 hover:bg-muted text-left transition-colors border-b border-border/30 last:border-0"
                      >
                        {food.image ? (
                          <Image src={food.image} alt="" width={40} height={40} className="w-10 h-10 rounded border border-border bg-white object-contain p-0.5" unoptimized />
                        ) : (
                          <div className="w-10 h-10 rounded bg-muted flex items-center justify-center text-muted-foreground"><Utensils size={16} /></div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-bold text-foreground truncate">{food.name}</p>
                            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${food.isLocal ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          </div>
                          <p className="text-[10px] text-muted-foreground truncate">
                            {food.brand || (food.isLocal ? 'Local Library' : 'Global Database')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-amber-500">{food.calories} kcal</p>
                          <p className="text-[9px] text-muted-foreground uppercase">per 100g</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="p-2 bg-muted/20 text-center">
                    <p className="text-[8px] text-muted-foreground italic">Values are estimates from OFF database</p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Meal Type</label>
                <select 
                  value={newMeal.mealType}
                  onChange={(e) => setNewMeal({...newMeal, mealType: e.target.value})}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-amber-500 outline-none"
                >
                  {mealTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Calories</label>
                <input 
                  type="number"
                  placeholder="kcal"
                  value={newMeal.calories}
                  onChange={(e) => setNewMeal({...newMeal, calories: e.target.value})}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-amber-500 outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Protein</label>
                <input 
                  type="number"
                  placeholder="0"
                  value={newMeal.protein}
                  onChange={(e) => setNewMeal({...newMeal, protein: e.target.value})}
                  className="w-full bg-background border border-border rounded-lg px-2 py-1.5 text-xs text-center"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Carbs</label>
                <input 
                  type="number"
                  placeholder="0"
                  value={newMeal.carbs}
                  onChange={(e) => setNewMeal({...newMeal, carbs: e.target.value})}
                  className="w-full bg-background border border-border rounded-lg px-2 py-1.5 text-xs text-center"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Fat</label>
                <input 
                  type="number"
                  placeholder="0"
                  value={newMeal.fat}
                  onChange={(e) => setNewMeal({...newMeal, fat: e.target.value})}
                  className="w-full bg-background border border-border rounded-lg px-2 py-1.5 text-xs text-center"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isAdding}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
            >
              {isAdding ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
              Add Log
            </button>
          </form>

          {/* Attribution Box - Mandatory for ODbL license */}
          <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl flex gap-3">
            <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
            <p className="text-[9px] text-blue-700/70 dark:text-blue-400/70 leading-relaxed">
              Food database provided by <a href="https://world.openfoodfacts.org" target="_blank" rel="noopener" className="font-bold underline">Open Food Facts</a> under the <a href="https://opendatacommons.org/licenses/odbl/1-0/" target="_blank" rel="noopener" className="font-bold underline">ODbL</a>. 
              Values are crowdsourced and for reference only.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Recent Entries</h3>
            <div className="max-h-[160px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {meals.length > 0 ? (
                meals.map((meal) => (
                  <div key={meal.id} className="p-3 rounded-xl border border-border bg-muted/20 flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <Utensils size={14} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-foreground">{meal.mealType}</h4>
                        <p className="text-[10px] text-muted-foreground truncate max-w-[120px]">{meal.items}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-foreground">{meal.calories} kcal</p>
                      <p className="text-[9px] text-muted-foreground">{meal.protein}P • {meal.carbs}C • {meal.fat}F</p>
                    </div>
                  </div>
                )).reverse()
              ) : (
                <div className="py-8 text-center border-2 border-dashed border-border rounded-xl">
                  <p className="text-xs text-muted-foreground italic">No entries for today yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-muted/50 rounded-2xl p-6 border border-border flex flex-col justify-between">
          <div>
            <div className="flex items-end justify-between mb-6">
              <div>
                <h3 className="text-sm font-bold text-foreground/90 uppercase tracking-widest">Daily Macros</h3>
                <p className="text-xs text-muted-foreground mt-1">Status of your nutritional goals</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-foreground">
                  {Math.round((totalCalories / targets.calories) * 100)}%
                </span>
                <p className="text-[9px] font-bold text-muted-foreground uppercase">Daily Intake</p>
              </div>
            </div>
            
            <div className="space-y-6">
              {macros.map((macro, idx) => {
                const percentage = Math.min(100, Math.round((macro.current / macro.target) * 100));
                return (
                  <div key={idx}>
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="text-muted-foreground uppercase tracking-tighter">{macro.label}</span>
                      <span className="text-foreground">
                        {macro.current}g <span className="text-muted-foreground/40 font-normal">/ {macro.target}g</span>
                      </span>
                    </div>
                    <div className="h-3 w-full bg-background rounded-full overflow-hidden border border-border/50 shadow-inner p-0.5">
                      <div 
                        className={`h-full ${macro.color} rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(0,0,0,0.1)]`} 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium italic leading-relaxed">
              &quot;Eating the right macros helps maintain muscle mass and energy levels throughout the day.&quot;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

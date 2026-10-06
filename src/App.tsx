/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Ingredient, Household, MealSlot, StretchMode, MealPlanResult, Meal, MealSlotPreferences } from './types';
import { PANTRY_PRESETS } from './data/presets';
import { Header } from './components/Header';
import { InventoryManager } from './components/InventoryManager';
import { RationSettings } from './components/RationSettings';
import { PlanView } from './components/PlanView';
import { BurnDownTracker } from './components/BurnDownTracker';
import { SurvivalHacks } from './components/SurvivalHacks';
import { GroceryBridge } from './components/GroceryBridge';
import { PrintableMealPlan } from './components/PrintableMealPlan';
import { 
  Sparkles, 
  Utensils, 
  ShoppingBag, 
  Lightbulb, 
  Printer
} from 'lucide-react';

const STORAGE_KEY_INGREDIENTS = 'pantrybridge_inventory_tamil_v2';
const STORAGE_KEY_PLAN = 'pantrybridge_mealplan_tamil_v2';
const STORAGE_KEY_SETTINGS = 'pantrybridge_settings_tamil_v2';
const STORAGE_KEY_TANGLISH = 'pantrybridge_tanglish_mode';
const STORAGE_KEY_SLOT_PREFS = 'pantrybridge_slot_prefs_tamil';

export default function App() {
  // Tanglish naming toggle (defaults to true as requested by user)
  const [isTanglish, setIsTanglish] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TANGLISH);
      if (saved !== null) return JSON.parse(saved);
    } catch {}
    return true;
  });

  // Print Preview Modal State
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  // 1. Inventory State
  const [ingredients, setIngredients] = useState<Ingredient[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INGREDIENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    // Default Tamil Kudumbam Lean Fridge
    return PANTRY_PRESETS[0].items.map((item, idx) => ({
      ...item,
      id: `init-${idx}-${Date.now()}`
    }));
  });

  // 2. Planning Parameters
  const [daysToSustain, setDaysToSustain] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) return JSON.parse(saved).daysToSustain || 4;
    } catch {}
    return 4;
  });

  const [household, setHousehold] = useState<Household>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) return JSON.parse(saved).household || { adults: 2, children: 1 };
    } catch {}
    return { adults: 2, children: 1, notes: 'Tamil family' };
  });

  const [mealsPerDay, setMealsPerDay] = useState<MealSlot[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) return JSON.parse(saved).mealsPerDay || ['breakfast', 'lunch', 'dinner'];
    } catch {}
    return ['breakfast', 'lunch', 'dinner'];
  });

  // NEW: Time-of-Day Food Habits & Night-Time Rice Preference
  const [mealSlotPreferences, setMealSlotPreferences] = useState<MealSlotPreferences>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SLOT_PREFS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      breakfastStyle: 'tiffin_dosa_idli_upma',
      lunchStyle: 'rice_meals',
      dinnerStyle: 'tiffin_chapati_dosa', // No rice at night by default!
      customNotes: 'No rice at night, prefer Chappatis or Dosas'
    };
  });

  const [dietaryPreference, setDietaryPreference] = useState<string>('tamil_home');
  const [stretchMode, setStretchMode] = useState<StretchMode>('strict_zero_spend');
  const [equipmentNotes, setEquipmentNotes] = useState<string>('Kadai, pressure cooker, dosa tawa');

  // 3. Generated Plan State
  const [mealPlan, setMealPlan] = useState<MealPlanResult | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PLAN);
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Auditing pantry items & perishables...');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [swappingMealKey, setSwappingMealKey] = useState<string | null>(null);

  // Active top navigation tab
  const [activeTab, setActiveTab] = useState<'plan' | 'inventory' | 'habits' | 'hacks' | 'bridge'>('plan');

  const planRef = useRef<HTMLDivElement>(null);

  // Persist state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TANGLISH, JSON.stringify(isTanglish));
    } catch (e) {}
  }, [isTanglish]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SLOT_PREFS, JSON.stringify(mealSlotPreferences));
    } catch (e) {}
  }, [mealSlotPreferences]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_INGREDIENTS, JSON.stringify(ingredients));
    } catch (e) {
      console.error(e);
    }
  }, [ingredients]);

  useEffect(() => {
    try {
      if (mealPlan) {
        localStorage.setItem(STORAGE_KEY_PLAN, JSON.stringify(mealPlan));
      } else {
        localStorage.removeItem(STORAGE_KEY_PLAN);
      }
    } catch (e) {
      console.error(e);
    }
  }, [mealPlan]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY_SETTINGS,
        JSON.stringify({ daysToSustain, household, mealsPerDay, dietaryPreference, stretchMode })
      );
    } catch (e) {}
  }, [daysToSustain, household, mealsPerDay, dietaryPreference, stretchMode]);

  // Inventory Handlers
  const handleAddIngredient = (newItem: Omit<Ingredient, 'id'>) => {
    const item: Ingredient = {
      ...newItem,
      id: `ing-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setIngredients(prev => [item, ...prev]);
  };

  const handleUpdateIngredient = (id: string, updates: Partial<Ingredient>) => {
    setIngredients(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const handleRemoveIngredient = (id: string) => {
    setIngredients(prev => prev.filter(item => item.id !== id));
  };

  const handleLoadPreset = (presetId: string) => {
    const found = PANTRY_PRESETS.find(p => p.id === presetId);
    if (found) {
      const newItems = found.items.map((i, idx) => ({
        ...i,
        id: `preset-${idx}-${Date.now()}`
      }));
      setIngredients(newItems);

      // Automatically sync matching dietary preference and time-of-day food habits!
      if (found.defaultDietary) {
        setDietaryPreference(found.defaultDietary);
      }

      if (found.defaultSlotPrefs) {
        setMealSlotPreferences(prev => ({
          ...prev,
          ...found.defaultSlotPrefs
        }));
      }

      if (presetId === 'chennai_bachelor_room') {
        setHousehold({ adults: 2, children: 0, notes: 'Bachelor room / quick cooking' });
        setDaysToSustain(3);
      } else if (presetId === 'tamil_kudumbam_lean') {
        setHousehold({ adults: 2, children: 2, notes: 'Tamil family' });
        setDaysToSustain(4);
      } else if (presetId === 'tamil_nonveg_family') {
        setHousehold({ adults: 3, children: 1, notes: 'Tamil family (non-veg & eggs)' });
        setDaysToSustain(4);
      } else if (presetId === 'mami_traditional_veg') {
        setHousehold({ adults: 2, children: 2, notes: 'Traditional vegetarian family' });
        setDaysToSustain(4);
      }
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all items from your kitchen pantry inventory?')) {
      setIngredients([]);
    }
  };

  const handleToggleMealSlot = (slot: MealSlot) => {
    if (mealsPerDay.includes(slot)) {
      if (mealsPerDay.length === 1) return;
      setMealsPerDay(mealsPerDay.filter(s => s !== slot));
    } else {
      setMealsPerDay([...mealsPerDay, slot]);
    }
  };

  // Plan Generation
  const handleGeneratePlan = async () => {
    if (ingredients.length === 0) {
      alert('Please add at least one pantry item before generating a meal plan.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const isNoRiceSelected = (mealSlotPreferences.dinnerStyles || [mealSlotPreferences.dinnerStyle || '']).some(
      s => s === 'tiffin_chapati_dosa' || s === 'chapati_only' || s === 'dosa_idli_only'
    );
    const isRiceNonVegSelected = (mealSlotPreferences.dinnerStyles || [mealSlotPreferences.dinnerStyle || '']).includes('rice_only_nonveg');

    const nightRiceText = isNoRiceSelected
      ? 'Configuring NO-RICE Night Rule (Chappati & Dosa)...'
      : isRiceNonVegSelected
        ? 'Allocating night rice only if non-veg/biriyani is cooked...'
        : 'Balancing dinner menu...';

    const messages = [
      'Auditing remaining Tamil pantry vegetables (Thakkali, Urulaikilangu, Vengayam)...',
      'Prioritizing fragile tomatoes and fresh drumstick / greens on Days 1-2...',
      nightRiceText,
      'Calculating EXACT ingredient grams and piece measurements for every recipe...',
      'Formulating authentic Sambar, Rasam, Variety Rice & Night Tiffin schedule...',
      'Finalizing end-of-month Tamil kitchen blueprint...'
    ];
    let msgIdx = 0;
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % messages.length;
      setLoadingMessage(messages[msgIdx]);
    }, 2000);

    try {
      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients,
          daysToSustain,
          household,
          mealsPerDay,
          mealSlotPreferences,
          dietaryPreference,
          stretchMode,
          equipmentNotes,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      setMealPlan(data);
      setActiveTab('plan');

      setTimeout(() => {
        planRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error('Plan generation failed:', err);
      setErrorMessage(err.message || 'Unable to generate meal plan. Please check your network and try again.');
    } finally {
      clearInterval(interval);
      setIsLoading(false);
    }
  };

  // Swap single meal
  const handleSwapMeal = async (dayNumber: number, slot: string, currentRecipeName: string) => {
    const key = `${dayNumber}-${slot}`;
    setSwappingMealKey(key);

    try {
      const res = await fetch('/api/swap-meal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayNumber,
          slot,
          currentRecipeName,
          availableIngredients: ingredients,
          household,
          mealSlotPreferences,
          dietaryPreference,
        }),
      });

      if (!res.ok) throw new Error('Failed to swap meal');

      const newMeal: Meal = await res.json();

      setMealPlan(prev => {
        if (!prev) return null;
        return {
          ...prev,
          days: prev.days.map(d => {
            if (d.dayNumber !== dayNumber) return d;
            return {
              ...d,
              meals: d.meals.map(m => (m.slot === slot ? newMeal : m)),
            };
          }),
        };
      });
    } catch (e) {
      console.error(e);
      alert('Unable to swap recipe right now. Please try again.');
    } finally {
      setSwappingMealKey(null);
    }
  };

  // Toggle meal cooked status
  const handleToggleCooked = (dayNumber: number, slot: string) => {
    setMealPlan(prev => {
      if (!prev) return null;
      return {
        ...prev,
        days: prev.days.map(d => {
          if (d.dayNumber !== dayNumber) return d;
          return {
            ...d,
            meals: d.meals.map(m => {
              if (m.slot === slot) {
                return { ...m, isCooked: !m.isCooked };
              }
              return m;
            }),
          };
        }),
      };
    });
  };

  const handlePrint = () => {
    if (mealPlan) {
      setShowPrintModal(true);
    } else {
      window.print();
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset pantry inventory to default Tamil Kudumbam sample?')) {
      const defaultItems = PANTRY_PRESETS[0].items.map((item, idx) => ({
        ...item,
        id: `sample-${idx}-${Date.now()}`
      }));
      setIngredients(defaultItems);
      setMealPlan(null);
      localStorage.removeItem(STORAGE_KEY_PLAN);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50/25 flex flex-col font-sans">
      
      {/* Top Header */}
      <Header
        daysToSustain={daysToSustain}
        hasPlan={!!mealPlan}
        isTanglish={isTanglish}
        onToggleTanglish={() => setIsTanglish(!isTanglish)}
        onPrint={handlePrint}
        onReset={handleReset}
      />

      {/* Main Content Area (Screen View) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 no-print">
        
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-stone-200/90 pb-3 mb-6 overflow-x-auto">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('plan')}
              className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === 'plan'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span>{isTanglish ? 'Samayal Meal Plan (திட்டம்)' : 'Tamil Meal Plan'}</span>
              {mealPlan && (
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === 'inventory'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <span>{isTanglish ? 'Pantry Items (பொருட்கள்)' : 'Pantry Inventory'}</span>
              <span className="font-mono text-xs opacity-75">({ingredients.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('habits')}
              className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === 'habits'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <span>{isTanglish ? 'Food Habits & Night Rice (வேளை உணவு)' : 'Food Habits & Night Rice'}</span>
            </button>

            <button
              onClick={() => setActiveTab('hacks')}
              className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === 'hacks'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              <span>{isTanglish ? 'Kitchen Tips (டிப்ஸ்)' : 'Zero-Waste Hacks'}</span>
            </button>

            <button
              onClick={() => setActiveTab('bridge')}
              className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === 'bridge'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{isTanglish ? 'Payday Restock (மளிகை லிஸ்ட்)' : 'Next Month Restock'}</span>
            </button>


          </div>

          <div className="hidden md:flex items-center gap-2.5 text-xs text-stone-500 font-mono">
            <span>Pantry: {ingredients.length} items</span>
            <span aria-hidden="true">·</span>
            <span>Night: {(mealSlotPreferences.dinnerStyles || [mealSlotPreferences.dinnerStyle || '']).some(s => s && (s.includes('chapati') || s.includes('tiffin'))) ? 'Chappati/Tiffin' : 'Standard'}</span>
            <span aria-hidden="true">·</span>
            <span>Target: {daysToSustain} days</span>
            {mealPlan && (
              <>
                <span aria-hidden="true">·</span>
                <button
                  onClick={() => setShowPrintModal(true)}
                  className="flex items-center gap-1 text-amber-700 hover:text-amber-900 font-bold cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print PDF</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="mb-8 p-6 bg-white rounded-2xl border border-amber-200/90 shadow-md text-center animate-in fade-in">
            <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900">
              Calculating Tamil Kudumbam Ration Strategy
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-md mx-auto">
              {loadingMessage}
            </p>
            <div className="w-48 h-1.5 bg-stone-100 rounded-full mx-auto mt-4 overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full animate-pulse w-3/4" />
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs sm:text-sm flex items-center justify-between">
            <span>{errorMessage}</span>
            <button onClick={() => setErrorMessage(null)} className="text-rose-950 font-bold ml-3 cursor-pointer">
              Dismiss
            </button>
          </div>
        )}

        {/* TAB 1: MEAL PLAN & RATIONING (DEFAULT) */}
        {activeTab === 'plan' && (
          <div ref={planRef}>
            
            {mealPlan ? (
              <div className="space-y-8">
                
                {/* Active Plan Overview */}
                <PlanView
                  plan={mealPlan}
                  ingredients={ingredients}
                  onSwapMeal={handleSwapMeal}
                  onToggleCooked={handleToggleCooked}
                  swappingMealKey={swappingMealKey}
                  isTanglish={isTanglish}
                  onOpenPrintPreview={() => setShowPrintModal(true)}
                  mealSlotPreferences={mealSlotPreferences}
                  onEditPreferences={() => setActiveTab('habits')}
                />

                {/* Inventory Depletion Tracker */}
                <BurnDownTracker
                  burnDownItems={mealPlan.inventoryBurnDown}
                  daysCount={daysToSustain}
                />

                {/* Survival Hacks Specific to this Pantry */}
                <SurvivalHacks hacks={mealPlan.survivalHacks} />

                {/* Next Month Restock List */}
                <GroceryBridge items={mealPlan.nextMonthGroceryBridge} />

                {/* Footer Action Bar */}
                <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-stone-600">
                    Want to test a different number of days or modify your available vegetables?
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowPrintModal(true)}
                      className="px-3.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold cursor-pointer flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-400" />
                      <span>Print Plan</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('inventory')}
                      className="px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-xs font-medium text-stone-700 cursor-pointer"
                    >
                      Edit Vegetables & Items ({ingredients.length})
                    </button>
                    <button
                      onClick={handleGeneratePlan}
                      className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium cursor-pointer"
                    >
                      Regenerate Plan
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              /* No plan generated yet */
              <div>
                
                {/* Welcome Hero Callout */}
                <div className="mb-8 p-5 sm:p-6 bg-linear-to-r from-stone-900 via-stone-850 to-stone-900 rounded-3xl text-white shadow-md border border-stone-800">
                  <div className="max-w-3xl">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="text-xs font-mono uppercase tracking-wider text-amber-300">
                        Tamil Samayal · End of Month Budget Sustenance
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                      Manage with your kitchen vegetables until next month's salary.
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-300 mt-2 leading-relaxed">
                      Enter your available Vegetables (Thakkali, Vengayam, Urulaikilangu), Fruits, Dals, and Flours. Set your daily food habits (like <strong>No Rice at Night</strong>, preferring Chappati or Dosa). We'll generate an authentic South Indian meal plan with exact physical quantities so you never waste groceries or overspend before payday.
                    </p>
                  </div>
                </div>

                {/* Step 1: Inventory */}
                <InventoryManager
                  ingredients={ingredients}
                  onAddIngredient={handleAddIngredient}
                  onUpdateIngredient={handleUpdateIngredient}
                  onRemoveIngredient={handleRemoveIngredient}
                  onLoadPreset={handleLoadPreset}
                  onClearAll={handleClearAll}
                  isTanglish={isTanglish}
                />

                {/* Step 2: Ration Settings with Time-of-Day Preferences */}
                <RationSettings
                  daysToSustain={daysToSustain}
                  onDaysChange={setDaysToSustain}
                  household={household}
                  onHouseholdChange={setHousehold}
                  mealsPerDay={mealsPerDay}
                  onToggleMealSlot={handleToggleMealSlot}
                  mealSlotPreferences={mealSlotPreferences}
                  onMealSlotPreferencesChange={setMealSlotPreferences}
                  dietaryPreference={dietaryPreference}
                  onDietaryChange={setDietaryPreference}
                  stretchMode={stretchMode}
                  onStretchModeChange={setStretchMode}
                  equipmentNotes={equipmentNotes}
                  onEquipmentNotesChange={setEquipmentNotes}
                  onGenerate={handleGeneratePlan}
                  isLoading={isLoading}
                  totalIngredientsCount={ingredients.length}
                  isTanglish={isTanglish}
                />

              </div>
            )}

          </div>
        )}

        {/* TAB 2: INVENTORY MANAGER */}
        {activeTab === 'inventory' && (
          <div>
            <InventoryManager
              ingredients={ingredients}
              onAddIngredient={handleAddIngredient}
              onUpdateIngredient={handleUpdateIngredient}
              onRemoveIngredient={handleRemoveIngredient}
              onLoadPreset={handleLoadPreset}
              onClearAll={handleClearAll}
              isTanglish={isTanglish}
            />

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleGeneratePlan}
                disabled={isLoading || ingredients.length === 0}
                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Calculate & Generate Plan for {daysToSustain} Days</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: FOOD HABITS & NIGHT RICE PREFERENCE */}
        {activeTab === 'habits' && (
          <div>
            <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-950 flex items-center justify-between">
              <div>
                <strong className="font-bold">Adjust Your Daily Eating Habits:</strong> Changes made here (like strictly avoiding rice at night) will be applied whenever you calculate or regenerate your meal plan.
              </div>
              <button
                onClick={handleGeneratePlan}
                disabled={isLoading || ingredients.length === 0}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium shrink-0 cursor-pointer transition-colors shadow-xs ml-4"
              >
                {mealPlan ? 'Regenerate Plan with Habits' : 'Generate Plan'}
              </button>
            </div>

            <RationSettings
              daysToSustain={daysToSustain}
              onDaysChange={setDaysToSustain}
              household={household}
              onHouseholdChange={setHousehold}
              mealsPerDay={mealsPerDay}
              onToggleMealSlot={handleToggleMealSlot}
              mealSlotPreferences={mealSlotPreferences}
              onMealSlotPreferencesChange={setMealSlotPreferences}
              dietaryPreference={dietaryPreference}
              onDietaryChange={setDietaryPreference}
              stretchMode={stretchMode}
              onStretchModeChange={setStretchMode}
              equipmentNotes={equipmentNotes}
              onEquipmentNotesChange={setEquipmentNotes}
              onGenerate={handleGeneratePlan}
              isLoading={isLoading}
              totalIngredientsCount={ingredients.length}
              isTanglish={isTanglish}
            />
          </div>
        )}

        {/* TAB 4: SURVIVAL HACKS */}
        {activeTab === 'hacks' && (
          <div>
            <SurvivalHacks
              hacks={
                mealPlan?.survivalHacks || [
                  "Night Atta Dough Stretcher: When kneading Chapati dough, knead with lukewarm water and 1 tbsp of milk or leftover dal. It makes the rotis 2x softer and expands dough volume by 20%.",
                  "No-Rice Night Gravy Volume: When making Thokku or Kurma for dinner chapatis, blend 1 boiled potato or 1 spoon of roasted gram (pottukadlai) into the tomato gravy to yield double the gravy without extra vegetables.",
                  "Paruppu Thanni Rasam: Scoop 1 cup of boiled Toor Dal water from the top of your sambar pot; use this to make soul-satisfying Milagu Rasam with zero extra dal!",
                  "Thayir into Spiced Moru Multiplier: Turn 1/2 cup sour curd into 4 glasses of Moru by whisking with 2 cups cold water, ginger, green chilli, salt, and curry leaves.",
                  "Pazhaya Sadam (Fermented Rice): Soak leftover cooked night rice in water inside a clay/steel pot with a drop of buttermilk and salt; eat the next morning with shallots (chinna vengayam) for probiotic energy."
                ]
              }
            />
          </div>
        )}

        {/* TAB 5: GROCERY BRIDGE */}
        {activeTab === 'bridge' && (
          <div>
            <GroceryBridge
              items={
                mealPlan?.nextMonthGroceryBridge || [
                  "Ponni Boiled Rice (10kg Bag - Primary Family Calorie Anchor)",
                  "Chakki Fresh Atta / Wheat Flour (5kg Bag - For Night Chapatis)",
                  "Toor Dal (Thuvaram Paruppu - 1kg)",
                  "Cooking Oil (Sesame/Nallenai & Sunflower Oil - 2L)",
                  "Onion (Vengayam) & Tomato (Thakkali) (2kg Foundation)",
                  "Mustard (Kadugu), Cumin (Jeeragam), Black Pepper (Milagu) Refills"
                ]
              }
            />
          </div>
        )}



      </main>

      {/* Screen Footer */}
      <footer className="border-t border-stone-200/80 bg-white py-6 mt-12 text-center text-xs text-stone-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-stone-900">PantryBridge</span>
            <span aria-hidden="true">·</span>
            <span>Tamil Samayal End-of-Month Budget Sustenance Engine</span>
          </div>
          <div>
            Built with Google Gemini 3.8 Flash for household budget survival.
          </div>
        </div>
      </footer>

      {/* Print Preview Modal when triggered */}
      {showPrintModal && mealPlan && (
        <PrintableMealPlan
          plan={mealPlan}
          household={household}
          daysToSustain={daysToSustain}
          isTanglish={isTanglish}
          isModal={true}
          onClose={() => setShowPrintModal(false)}
        />
      )}

      {/* Hidden Dedicated Print Document (rendered into DOM for standard window.print()) */}
      {mealPlan && (
        <PrintableMealPlan
          plan={mealPlan}
          household={household}
          daysToSustain={daysToSustain}
          isTanglish={isTanglish}
          isModal={false}
        />
      )}

    </div>
  );
}

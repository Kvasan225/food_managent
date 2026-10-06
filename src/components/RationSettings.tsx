import React, { useState } from 'react';
import { Household, MealSlot, StretchMode, MealSlotPreferences } from '../types';
import { 
  Users, 
  Calendar, 
  Utensils, 
  Sparkles, 
  Info,
  Moon,
  Sun,
  Sunrise,
  Coffee,
  CheckSquare,
  Square,
  Wheat,
  Drumstick,
  BookmarkCheck,
  Edit3,
  RotateCcw,
  Check,
  Flame,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface RationSettingsProps {
  daysToSustain: number;
  onDaysChange: (days: number) => void;
  household: Household;
  onHouseholdChange: (h: Household) => void;
  mealsPerDay: MealSlot[];
  onToggleMealSlot: (slot: MealSlot) => void;
  mealSlotPreferences: MealSlotPreferences;
  onMealSlotPreferencesChange: (prefs: MealSlotPreferences) => void;
  dietaryPreference: string;
  onDietaryChange: (diet: string) => void;
  stretchMode: StretchMode;
  onStretchModeChange: (mode: StretchMode) => void;
  equipmentNotes: string;
  onEquipmentNotesChange: (notes: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  totalIngredientsCount: number;
  isTanglish: boolean;
}

export const RationSettings: React.FC<RationSettingsProps> = ({
  daysToSustain,
  onDaysChange,
  household,
  onHouseholdChange,
  mealsPerDay,
  onToggleMealSlot,
  mealSlotPreferences,
  onMealSlotPreferencesChange,
  dietaryPreference,
  onDietaryChange,
  stretchMode,
  onStretchModeChange,
  equipmentNotes,
  onEquipmentNotesChange,
  onGenerate,
  isLoading,
  totalIngredientsCount,
  isTanglish,
}) => {
  const quickDays = [2, 3, 4, 5, 7, 10];

  const diets = [
    { id: 'tamil_home', label: 'Authentic Tamil Home Style (சாம்பார்/ரசம்)' },
    { id: 'traditional_veg', label: 'Pure Veg / Traditional Mami (சைவம்)' },
    { id: 'egg_inclusive', label: 'Includes Eggs / Muttai (முட்டை சமையல்)' },
    { id: 'kid_friendly', label: 'Mild Spices / Kid Friendly' },
    { id: 'one_pot', label: '1-Pot / Quick Cook (குக்கர் சமையல்)' },
    { id: 'no_onion_garlic', label: 'No Onion & Garlic (சத்விக்)' },
  ];

  // Helper to ensure array access for multiple selections
  const selectedBreakfast = mealSlotPreferences.breakfastStyles || [mealSlotPreferences.breakfastStyle || 'tiffin_dosa_idli_upma'];
  const selectedLunch = mealSlotPreferences.lunchStyles || [mealSlotPreferences.lunchStyle || 'rice_meals'];
  const selectedDinner = mealSlotPreferences.dinnerStyles || [mealSlotPreferences.dinnerStyle || 'tiffin_chapati_dosa'];
  const selectedSnack = mealSlotPreferences.snackStyles || ['sundal_pulses'];

  const toggleStyle = (slot: 'breakfast' | 'lunch' | 'dinner' | 'snack', styleId: string) => {
    let current = slot === 'breakfast' ? [...selectedBreakfast] : slot === 'lunch' ? [...selectedLunch] : slot === 'dinner' ? [...selectedDinner] : [...selectedSnack];
    
    if (current.includes(styleId)) {
      if (current.length > 1) {
        current = current.filter(s => s !== styleId);
      }
    } else {
      current.push(styleId);
    }

    if (slot === 'breakfast') {
      onMealSlotPreferencesChange({
        ...mealSlotPreferences,
        breakfastStyles: current,
        breakfastStyle: current[0]
      });
    } else if (slot === 'lunch') {
      onMealSlotPreferencesChange({
        ...mealSlotPreferences,
        lunchStyles: current,
        lunchStyle: current[0]
      });
    } else if (slot === 'dinner') {
      onMealSlotPreferencesChange({
        ...mealSlotPreferences,
        dinnerStyles: current,
        dinnerStyle: current[0]
      });
    } else {
      onMealSlotPreferencesChange({
        ...mealSlotPreferences,
        snackStyles: current
      });
    }
  };

  // Quick 1-tap food habit routine templates with rich metadata (Veg, Non-Veg, Eggs, Sattvic)
  const habitPresets = [
    {
      id: 'standard_no_rice',
      title: 'No Rice at Night',
      dietTag: 'Pure Veg 🟢',
      dietColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      tagline: 'Breakfast: Dosa/Idli • Lunch: Full Meals • Dinner: Chappati/Dosa (NO RICE)',
      action: () => {
        onDietaryChange('traditional_veg');
        onMealSlotPreferencesChange({
          breakfastStyles: ['tiffin_dosa_idli_upma'],
          breakfastCustom: 'Dosa, Idli, or Rava Upma with Chutney',
          lunchStyles: ['rice_meals'],
          lunchCustom: 'Steamed Rice with Sambar / Rasam & Poriyal',
          dinnerStyles: ['tiffin_chapati_dosa', 'dosa_idli_only'],
          dinnerCustom: 'Chappati with Kurma or Dosa with Thokku (NO RICE)',
          snackStyles: ['sundal_pulses'],
          snackCustom: 'Boiled Sundal + Filter Coffee',
          customNotes: 'Pure Veg: Strictly no rice at night, chappati or dosa preferred',
          breakfastStyle: 'tiffin_dosa_idli_upma',
          lunchStyle: 'rice_meals',
          dinnerStyle: 'tiffin_chapati_dosa'
        });
      }
    },
    {
      id: 'non_veg_exception',
      title: 'Rice only if Non-Veg',
      dietTag: 'Non-Veg & Eggs 🔴',
      dietColor: 'bg-rose-100 text-rose-800 border-rose-300',
      tagline: 'Night: Chappati on veg days; Rice only if Muttai / Chicken / Kuska is made',
      action: () => {
        onDietaryChange('egg_inclusive');
        onMealSlotPreferencesChange({
          breakfastStyles: ['tiffin_dosa_idli_upma'],
          breakfastCustom: 'Tiffin: Dosa or Idli with Podi or Bread Omelette',
          lunchStyles: ['rice_meals', 'variety_rice'],
          lunchCustom: 'Full rice meals or weekend Kuska / Chicken Curry',
          dinnerStyles: ['tiffin_chapati_dosa', 'rice_only_nonveg'],
          dinnerCustom: 'Chappati normally; Rice / Biriyani only when Muttai or Chicken is cooked',
          snackStyles: ['tea_coffee_snack'],
          snackCustom: 'Tea with biscuit or roasted peanuts',
          customNotes: 'No rice at night, except when non-veg or biriyani/kuska is prepared',
          breakfastStyle: 'tiffin_dosa_idli_upma',
          lunchStyle: 'rice_meals',
          dinnerStyle: 'rice_only_nonveg'
        });
      }
    },
    {
      id: 'chapati_strict',
      title: 'Strict Night Chapatis',
      dietTag: 'Wheat 🌾 Pure Veg 🟢',
      dietColor: 'bg-amber-100 text-amber-800 border-amber-300',
      tagline: 'Breakfast: Upma/Kanji • Lunch: Sambar Sadam • Dinner: Soft Phulkas/Chapatis only',
      action: () => {
        onDietaryChange('traditional_veg');
        onMealSlotPreferencesChange({
          breakfastStyles: ['tiffin_dosa_idli_upma', 'porridge_light'],
          breakfastCustom: 'Rava Upma or Oats Porridge',
          lunchStyles: ['rice_meals'],
          lunchCustom: 'Sambar Sadam or Mor Kuzhambu with potato roast',
          dinnerStyles: ['chapati_only'],
          dinnerCustom: 'Soft Wheat Phulkas / Chapatis with Dal or Kurma',
          snackStyles: ['sundal_pulses'],
          snackCustom: 'Moong Sundal',
          customNotes: 'Strictly wheat chapatis or rotis for dinner',
          breakfastStyle: 'tiffin_dosa_idli_upma',
          lunchStyle: 'rice_meals',
          dinnerStyle: 'chapati_only'
        });
      }
    },
    {
      id: 'bachelor_quick',
      title: 'Bachelor Quick Cook',
      dietTag: 'Eggs & Quick 🟡',
      dietColor: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      tagline: 'Breakfast: Bread Omelette/Upma • Lunch: Variety Rice • Dinner: Instant Dosa with Thokku',
      action: () => {
        onDietaryChange('egg_inclusive');
        onMealSlotPreferencesChange({
          breakfastStyles: ['tiffin_dosa_idli_upma'],
          breakfastCustom: 'Rava Upma with Green Chilli or Bread Omelette',
          lunchStyles: ['variety_rice', 'rice_meals'],
          lunchCustom: 'Egg Thokku with Ponni Sadam or Lemon Rice',
          dinnerStyles: ['tiffin_chapati_dosa'],
          dinnerCustom: 'Instant Wheat Dosa or Chapati with Muttai Podimas',
          snackStyles: ['kaara_pori'],
          snackCustom: 'Kaara Pori with Tea',
          customNotes: 'Quick bachelor cooking, fast single-pan meals, eggs preferred',
          breakfastStyle: 'tiffin_dosa_idli_upma',
          lunchStyle: 'rice_meals',
          dinnerStyle: 'tiffin_chapati_dosa'
        });
      }
    },
    {
      id: 'sattvic_light',
      title: 'Traditional Sattvic',
      dietTag: 'Sattvic 🌿 No Onion/Garlic',
      dietColor: 'bg-teal-100 text-teal-800 border-teal-300',
      tagline: 'Breakfast: Pongal • Lunch: Traditional Sadam/Kootu • Dinner: Wheat Phulka & Dal',
      action: () => {
        onDietaryChange('no_onion_garlic');
        onMealSlotPreferencesChange({
          breakfastStyles: ['tiffin_dosa_idli_upma', 'porridge_light'],
          breakfastCustom: 'Ven Pongal with Gothsu or Rava Kanji',
          lunchStyles: ['rice_meals'],
          lunchCustom: 'Arisi Sadam + Sambar / Rasam + Thengai Poriyal',
          dinnerStyles: ['tiffin_chapati_dosa', 'chapati_only'],
          dinnerCustom: 'Godhumai Phulka with Paasi Paruppu Kootu (NO RICE)',
          snackStyles: ['sundal_pulses'],
          snackCustom: 'Pattani or Konda Kadalai Sundal',
          customNotes: 'Strictly Sattvic vegetarian, no onion or garlic, wholesome night phulkas',
          breakfastStyle: 'tiffin_dosa_idli_upma',
          lunchStyle: 'rice_meals',
          dinnerStyle: 'chapati_only'
        });
      }
    },
    {
      id: 'rice_anytime',
      title: 'Rice Anytime',
      dietTag: 'Flexi 🍚 (All 3 Meals)',
      dietColor: 'bg-stone-100 text-stone-800 border-stone-300',
      tagline: 'Breakfast: Pongal/Dosa • Lunch: Full Meals • Dinner: Rasam Sadam / Thayir Sadam',
      action: () => {
        onDietaryChange('tamil_home');
        onMealSlotPreferencesChange({
          breakfastStyles: ['tiffin_dosa_idli_upma'],
          breakfastCustom: 'Tiffin: Ven Pongal or Dosa',
          lunchStyles: ['rice_meals', 'variety_rice'],
          lunchCustom: 'Variety rice or full meals',
          dinnerStyles: ['rice_meals_ok', 'tiffin_chapati_dosa'],
          dinnerCustom: 'Light Rasam Sadam, Thayir Sadam, or Dosa',
          snackStyles: ['tea_coffee_snack'],
          snackCustom: 'Tea with biscuit',
          customNotes: 'Rice meals like rasam sadam or thayir sadam are fine at night',
          breakfastStyle: 'tiffin_dosa_idli_upma',
          lunchStyle: 'rice_meals',
          dinnerStyle: 'rice_meals_ok'
        });
      }
    }
  ];

  // Quick suggestions for custom combos
  const breakfastSuggestions = [
    'Idli + Sambar',
    'Poori + Potato Masala',
    'Rava Upma + Chutney',
    'Ven Pongal + Gothsu',
    'Bread Omelette',
    'Poha / Aval Upma',
    'Pazhaya Sadam (Neeragaram)'
  ];

  const lunchSuggestions = [
    'Sambar Sadam + Urulaikilangu Roast',
    'Mor Kuzhambu + Plantain Fry',
    'Lemon Rice + Vadagam',
    'Thakkali Sadam + Boiled Egg',
    'Thayir Sadam + Mango Pickle',
    'Vatha Kuzhambu + Appalam'
  ];

  const dinnerSuggestions = [
    'Chapati + Veg Kurma',
    'Kal Dosa + Thakkali Thokku',
    'Wheat Phulka + Dal Tadka',
    'Egg Biriyani / Kuska (Weekend)',
    'Parotta + Salna',
    'Idiyappam + Sodhi',
    'Rasam Sadam + Omelette'
  ];

  const snackSuggestions = [
    'Sundal + Filter Coffee',
    'Kaara Pori + Masala Tea',
    'Banana / Pazham + Milk',
    'Roasted Peanuts (Verkadalai)',
    'Onion Pakoda + Chai'
  ];

  const hasSnackSlot = mealsPerDay.includes('snack');

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-4 sm:p-6 mb-8">
      
      <div className="pb-4 border-b border-stone-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif text-stone-900 font-semibold tracking-tight">
            2. Rationing & Household Setup {isTanglish ? '(குடும்ப கணக்கு & விருப்பங்கள்)' : ''}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Specify how many days to stretch, household size, and select multiple options or custom combos for each mealtime.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
        
        {/* 1. Target Days */}
        <div className="p-4 rounded-xl bg-stone-50/70 border border-stone-200/70 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                <span>Days to Sustain (நாட்கள்)</span>
              </label>
              <span className="text-base font-serif font-bold text-stone-900">
                {daysToSustain} {daysToSustain === 1 ? 'Day' : 'Days'}
              </span>
            </div>

            <p className="text-xs text-stone-500 mb-3">
              Ration pantry carefully until 1st of month payday.
            </p>

            <div className="flex items-center gap-1.5 flex-wrap">
              {quickDays.map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => onDaysChange(d)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    daysToSustain === d
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-200/60">
            <input
              type="range"
              min="1"
              max="14"
              value={daysToSustain}
              onChange={e => onDaysChange(parseInt(e.target.value, 10))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-stone-400 mt-1">
              <span>1 Day</span>
              <span>7 Days (Week)</span>
              <span>14 Days (Fortnight)</span>
            </div>
          </div>
        </div>

        {/* 2. Household Members */}
        <div className="p-4 rounded-xl bg-stone-50/70 border border-stone-200/70 flex flex-col justify-between">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-600 flex items-center gap-1.5 mb-2">
              <Users className="w-3.5 h-3.5 text-amber-600" />
              <span>Kudumbam Eaters (உறுப்பினர்கள்)</span>
            </label>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                <span className="text-xs text-stone-500 block">Adults (பெரியவர்கள்)</span>
                <div className="flex items-center justify-between mt-1">
                  <button
                    type="button"
                    onClick={() => onHouseholdChange({ ...household, adults: Math.max(1, household.adults - 1) })}
                    className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-mono text-base font-semibold text-stone-900 tabular-nums">
                    {household.adults}
                  </span>
                  <button
                    type="button"
                    onClick={() => onHouseholdChange({ ...household, adults: household.adults + 1 })}
                    className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                <span className="text-xs text-stone-500 block">Kids (குழந்தைகள்)</span>
                <div className="flex items-center justify-between mt-1">
                  <button
                    type="button"
                    onClick={() => onHouseholdChange({ ...household, children: Math.max(0, household.children - 1) })}
                    className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-mono text-base font-semibold text-stone-900 tabular-nums">
                    {household.children}
                  </span>
                  <button
                    type="button"
                    onClick={() => onHouseholdChange({ ...household, children: household.children + 1 })}
                    className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <input
              type="text"
              placeholder="e.g. Teens with big rice appetites / Toddler portion"
              value={household.notes || ''}
              onChange={e => onHouseholdChange({ ...household, notes: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* 3. Meals to Plan & Strategy */}
        <div className="p-4 rounded-xl bg-stone-50/70 border border-stone-200/70 flex flex-col justify-between">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-600 flex items-center gap-1.5 mb-2">
              <Utensils className="w-3.5 h-3.5 text-amber-600" />
              <span>Active Meal Slots (வேளைகள்)</span>
            </label>

            <div className="flex flex-wrap gap-1.5 mt-2">
              {(['breakfast', 'lunch', 'dinner', 'snack'] as MealSlot[]).map(slot => {
                const isSelected = mealsPerDay.includes(slot);
                const label = slot === 'breakfast' ? (isTanglish ? 'Kaalai (காலை)' : 'Breakfast') :
                              slot === 'lunch' ? (isTanglish ? 'Maniyam (மதியம்)' : 'Lunch') :
                              slot === 'dinner' ? (isTanglish ? 'Iravu (இரவு)' : 'Dinner') : 
                              (isTanglish ? 'Tea/Snack (மாலை)' : 'Snack');

                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => onToggleMealSlot(slot)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-3">
            <label className="text-xs text-stone-500 block mb-1">Rationing Philosophy</label>
            <select
              value={stretchMode}
              onChange={e => onStretchModeChange(e.target.value as StretchMode)}
              className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="strict_zero_spend">Strict Zero-Spend (Use ONLY Existing Kitchen Items)</option>
              <option value="balanced_stretch">Balanced Stretch (Comfortable Tamil Food)</option>
              <option value="batch_cook">Batch Cook (Lunch Sambar carried to Night)</option>
            </select>
          </div>
        </div>

      </div>

      {/* HIGHLIGHTED: TIME-OF-DAY FOOD HABITS, MULTI-SELECT & CUSTOM COMBOS SECTION */}
      <div className="mt-6 p-4 sm:p-6 rounded-2xl bg-linear-to-b from-amber-50/80 to-amber-50/30 border-2 border-amber-300/80 shadow-xs">
        
        {/* Header with Title & Quick Habit Presets with Veg / Non-Veg badges */}
        <div className="flex flex-col gap-3 pb-4 border-b border-amber-200/80">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-800 flex items-center justify-center">
                <Moon className="w-4 h-4 text-amber-800" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900">
                  Time-of-Day Food Habits, Multi-Choice & Custom Combos
                </h3>
                <p className="text-xs text-stone-600">
                  Select <strong>multiple choices</strong> for the same mealtime, or <strong>type your exact custom combo</strong> (e.g. Idli + Sambar, Chapati + Kurma).
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-200 text-amber-950 font-bold uppercase self-start sm:self-auto">
              Multi-Choice Enabled
            </span>
          </div>

          {/* Quick Routine Presets / Resets Bar with Veg, Non-Veg, Eggs & Sattvic Info */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                <span>Quick Routine Presets & Resets (விருப்ப அமைப்புகள்):</span>
              </span>
              <span className="text-[11px] text-stone-400">1-tap apply to all meals</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {habitPresets.map(preset => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={preset.action}
                  className="p-2.5 rounded-xl bg-white hover:bg-amber-100/70 text-left border border-stone-200 hover:border-amber-400 transition-all cursor-pointer shadow-3xs flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between gap-1.5 mb-1">
                    <span className="text-xs font-bold text-stone-900 group-hover:text-amber-900">
                      {preset.title}
                    </span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${preset.dietColor}`}>
                      {preset.dietTag}
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-500 leading-snug line-clamp-2">
                    {preset.tagline}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Column Cards: Breakfast, Lunch, Dinner, and Snack with Multi-Select & Custom Combos */}
        <div className={`grid grid-cols-1 md:grid-cols-2 ${hasSnackSlot ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-5 mt-5`}>
          
          {/* Card 1: Breakfast (காலை உணவு) */}
          <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <Sunrise className="w-4 h-4 text-amber-600" />
                  <span>Breakfast (காலை உணவு)</span>
                </label>
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-stone-100 text-stone-600">
                  {selectedBreakfast.length} style{selectedBreakfast.length > 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mb-2.5">Pick one or more options to rotate across days:</p>
              
              <div className="space-y-1.5">
                {[
                  { 
                    id: 'tiffin_dosa_idli_upma', 
                    title: 'South Indian Tiffin (டிபன்)', 
                    desc: 'Dosa, Idli, Rava Upma, Ven Pongal, Aval / Poha' 
                  },
                  { 
                    id: 'porridge_light', 
                    title: 'Light Kanji / Porridge (கஞ்சி)', 
                    desc: 'Rava kanji, Sathumaavu, or Oats with milk/water' 
                  },
                  { 
                    id: 'quick_poha_aval', 
                    title: 'Quick Aval / Poha (அவல் உப்புமா)', 
                    desc: 'Light flattened rice tossed with mustard and peanuts' 
                  },
                  { 
                    id: 'any', 
                    title: 'Any Fast Breakfast', 
                    desc: 'Quick tiffin with whatever is available' 
                  },
                ].map(opt => {
                  const isChecked = selectedBreakfast.includes(opt.id);

                  return (
                    <div
                      key={opt.id}
                      onClick={() => toggleStyle('breakfast', opt.id)}
                      className={`p-2 rounded-lg border transition-all cursor-pointer flex items-start gap-2 ${
                        isChecked
                          ? 'bg-amber-50/80 border-amber-400 text-stone-900 font-medium ring-1 ring-amber-400/30'
                          : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-stone-50/40'
                      }`}
                    >
                      <div className="mt-0.5 text-amber-600 shrink-0">
                        {isChecked ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5 text-stone-400" />}
                      </div>
                      <div>
                        <span className="text-xs font-semibold block text-stone-900 leading-tight">{opt.title}</span>
                        <span className="text-[10px] text-stone-500 block leading-tight mt-0.5">{opt.desc}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom Breakfast Combo Input & Suggestions */}
            <div className="mt-3 pt-3 border-t border-stone-100">
              <label className="text-[11px] font-semibold text-stone-700 flex items-center justify-between mb-1">
                <span className="flex items-center gap-1">
                  <Edit3 className="w-3 h-3 text-amber-600" />
                  <span>Custom Breakfast Combo:</span>
                </span>
                {mealSlotPreferences.breakfastCustom && (
                  <span className="text-[10px] text-amber-700 font-semibold">Active ✓</span>
                )}
              </label>
              <input
                type="text"
                placeholder="Type your combo (e.g. Idli + Sambar, Poori Masala)"
                value={mealSlotPreferences.breakfastCustom || ''}
                onChange={e => onMealSlotPreferencesChange({ ...mealSlotPreferences, breakfastCustom: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />

              {/* One-tap Suggestions */}
              <div className="mt-2 flex flex-wrap gap-1">
                <span className="text-[9px] text-stone-400 w-full">Quick suggestions:</span>
                {breakfastSuggestions.map(sug => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => onMealSlotPreferencesChange({ ...mealSlotPreferences, breakfastCustom: sug })}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 border border-stone-200 transition-colors cursor-pointer"
                  >
                    + {sug}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Lunch (மதிய உணவு) */}
          <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-amber-600" />
                  <span>Lunch (மதிய உணவு)</span>
                </label>
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-stone-100 text-stone-600">
                  {selectedLunch.length} style{selectedLunch.length > 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mb-2.5">Pick one or more options to rotate across days:</p>
              
              <div className="space-y-1.5">
                {[
                  { 
                    id: 'rice_meals', 
                    title: 'Full Rice Meals (சாப்பாடு)', 
                    desc: 'Steamed Ponni Sadam + Sambar / Rasam / Mor Kuzhambu & Poriyal' 
                  },
                  { 
                    id: 'variety_rice', 
                    title: 'Variety Rice (வெரைட்டி ரைஸ்)', 
                    desc: 'Elumichai Sadam (Lemon), Thakkali Sadam, Thayir Sadam' 
                  },
                  { 
                    id: 'chapati_curry', 
                    title: 'Roti / Chapati Lunch', 
                    desc: 'Soft whole wheat rotis with Kurma, Dal, or Sabzi' 
                  },
                  { 
                    id: 'kanji_porridge', 
                    title: 'Light Kanji / Thayir Sadam', 
                    desc: 'Digestible fermented rice or curd rice with pickle & thuvaiyal' 
                  },
                ].map(opt => {
                  const isChecked = selectedLunch.includes(opt.id);

                  return (
                    <div
                      key={opt.id}
                      onClick={() => toggleStyle('lunch', opt.id)}
                      className={`p-2 rounded-lg border transition-all cursor-pointer flex items-start gap-2 ${
                        isChecked
                          ? 'bg-amber-50/80 border-amber-400 text-stone-900 font-medium ring-1 ring-amber-400/30'
                          : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-stone-50/40'
                      }`}
                    >
                      <div className="mt-0.5 text-amber-600 shrink-0">
                        {isChecked ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5 text-stone-400" />}
                      </div>
                      <div>
                        <span className="text-xs font-semibold block text-stone-900 leading-tight">{opt.title}</span>
                        <span className="text-[10px] text-stone-500 block leading-tight mt-0.5">{opt.desc}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom Lunch Combo Input & Suggestions */}
            <div className="mt-3 pt-3 border-t border-stone-100">
              <label className="text-[11px] font-semibold text-stone-700 flex items-center justify-between mb-1">
                <span className="flex items-center gap-1">
                  <Edit3 className="w-3 h-3 text-amber-600" />
                  <span>Custom Lunch Combo:</span>
                </span>
                {mealSlotPreferences.lunchCustom && (
                  <span className="text-[10px] text-amber-700 font-semibold">Active ✓</span>
                )}
              </label>
              <input
                type="text"
                placeholder="Type your combo (e.g. Sambar Sadam + Potato Roast)"
                value={mealSlotPreferences.lunchCustom || ''}
                onChange={e => onMealSlotPreferencesChange({ ...mealSlotPreferences, lunchCustom: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />

              {/* One-tap Suggestions */}
              <div className="mt-2 flex flex-wrap gap-1">
                <span className="text-[9px] text-stone-400 w-full">Quick suggestions:</span>
                {lunchSuggestions.map(sug => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => onMealSlotPreferencesChange({ ...mealSlotPreferences, lunchCustom: sug })}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 border border-stone-200 transition-colors cursor-pointer"
                  >
                    + {sug}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: Dinner (இரவு உணவு) — Multi-Select & Night Rice Rule */}
          <div className="bg-white p-4 rounded-xl border-2 border-amber-400/90 shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-amber-500 text-stone-950 font-mono text-[9px] font-bold px-2 py-0.5 rounded-bl uppercase">
              Night Rice Rule
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Moon className="w-4 h-4 text-indigo-600" />
                  <label className="text-xs font-bold text-stone-900">
                    Dinner (இரவு உணவு)
                  </label>
                </div>
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 mr-12">
                  {selectedDinner.length} choice{selectedDinner.length > 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-[11px] text-stone-600 mb-2.5">
                Choose multiple choices or set night-time rice exception:
              </p>
              
              <div className="space-y-1.5">
                {[
                  { 
                    id: 'tiffin_chapati_dosa', 
                    title: 'No Rice at Night (சப்பாத்தி / தோசை)', 
                    desc: 'Wheat Chapatis, Dosas, Sevai with Kurma or Thokku. NO PLAIN RICE.' 
                  },
                  { 
                    id: 'rice_only_nonveg', 
                    title: 'Rice ONLY if Non-Veg / Biriyani / Eggs', 
                    desc: 'Chapatis on veg nights; rice/kuska allowed only for egg/meat.' 
                  },
                  { 
                    id: 'chapati_only', 
                    title: 'Strictly Chapati Only at Night', 
                    desc: 'Whole wheat phulkas/rotis every evening.' 
                  },
                  { 
                    id: 'rice_meals_ok', 
                    title: 'Rice is OK at Night', 
                    desc: 'Rasam Sadam, Thayir Sadam, or Kuzhambu rice permitted.' 
                  },
                ].map(opt => {
                  const isChecked = selectedDinner.includes(opt.id);

                  return (
                    <div
                      key={opt.id}
                      onClick={() => toggleStyle('dinner', opt.id)}
                      className={`p-2 rounded-lg border transition-all cursor-pointer flex items-start gap-2 ${
                        isChecked
                          ? 'bg-amber-100/90 border-amber-500 text-stone-900 font-semibold ring-1 ring-amber-500/30'
                          : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-stone-50/40'
                      }`}
                    >
                      <div className="mt-0.5 text-amber-700 shrink-0">
                        {isChecked ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5 text-stone-400" />}
                      </div>
                      <div>
                        <span className="text-xs font-semibold block text-stone-900 leading-tight">{opt.title}</span>
                        <span className="text-[10px] text-stone-600 block leading-tight mt-0.5">{opt.desc}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom Dinner Combo Input & Suggestions */}
            <div className="mt-3 pt-3 border-t border-stone-100">
              <label className="text-[11px] font-semibold text-stone-700 flex items-center justify-between mb-1">
                <span className="flex items-center gap-1">
                  <Edit3 className="w-3 h-3 text-amber-600" />
                  <span>Custom Dinner Combo:</span>
                </span>
                {mealSlotPreferences.dinnerCustom && (
                  <span className="text-[10px] text-amber-700 font-semibold">Active ✓</span>
                )}
              </label>
              <input
                type="text"
                placeholder="Type your combo (e.g. Chapati + Thakkali Thokku, Egg Biriyani)"
                value={mealSlotPreferences.dinnerCustom || ''}
                onChange={e => onMealSlotPreferencesChange({ ...mealSlotPreferences, dinnerCustom: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />

              {/* One-tap Suggestions */}
              <div className="mt-2 flex flex-wrap gap-1">
                <span className="text-[9px] text-stone-400 w-full">Quick suggestions:</span>
                {dinnerSuggestions.map(sug => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => onMealSlotPreferencesChange({ ...mealSlotPreferences, dinnerCustom: sug })}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 border border-stone-200 transition-colors cursor-pointer"
                  >
                    + {sug}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card 4: Snack / Evening Tea (மாலை வேளை - if active) */}
          {hasSnackSlot && (
            <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <Coffee className="w-4 h-4 text-amber-700" />
                    <span>Evening Snack (மாலை டிபன்)</span>
                  </label>
                  <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-stone-100 text-stone-600">
                    {selectedSnack.length} style{selectedSnack.length > 1 ? 's' : ''}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 mb-2.5">Pick evening tiffin & tea accompaniments:</p>
                
                <div className="space-y-1.5">
                  {[
                    { 
                      id: 'sundal_pulses', 
                      title: 'Boiled Sundal (சுண்டல்)', 
                      desc: 'Protein-rich pulses tempered with mustard, chillies & coconut' 
                    },
                    { 
                      id: 'kaara_pori', 
                      title: 'Kaara Pori & Mixture (காரப்பொரி)', 
                      desc: 'Puffed rice tossed with garlic, peanuts & curry leaves' 
                    },
                    { 
                      id: 'tea_coffee_snack', 
                      title: 'Filter Coffee / Chai with Biscuits', 
                      desc: 'Hot beverage with light biscuits or rusk' 
                    },
                    { 
                      id: 'bajji_pakoda', 
                      title: 'Pakoda / Bajji (பஜ்ஜி / பக்கோடா)', 
                      desc: 'Crispy onion pakoda or potato bhajji on rainy days' 
                    },
                  ].map(opt => {
                    const isChecked = selectedSnack.includes(opt.id);

                    return (
                      <div
                        key={opt.id}
                        onClick={() => toggleStyle('snack', opt.id)}
                        className={`p-2 rounded-lg border transition-all cursor-pointer flex items-start gap-2 ${
                          isChecked
                            ? 'bg-amber-50/80 border-amber-400 text-stone-900 font-medium ring-1 ring-amber-400/30'
                            : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-stone-50/40'
                        }`}
                      >
                        <div className="mt-0.5 text-amber-600 shrink-0">
                          {isChecked ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5 text-stone-400" />}
                        </div>
                        <div>
                          <span className="text-xs font-semibold block text-stone-900 leading-tight">{opt.title}</span>
                          <span className="text-[10px] text-stone-500 block leading-tight mt-0.5">{opt.desc}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Custom Snack Combo Input & Suggestions */}
              <div className="mt-3 pt-3 border-t border-stone-100">
                <label className="text-[11px] font-semibold text-stone-700 flex items-center justify-between mb-1">
                  <span className="flex items-center gap-1">
                    <Edit3 className="w-3 h-3 text-amber-600" />
                    <span>Custom Snack Combo:</span>
                  </span>
                  {mealSlotPreferences.snackCustom && (
                    <span className="text-[10px] text-amber-700 font-semibold">Active ✓</span>
                  )}
                </label>
                <input
                  type="text"
                  placeholder="Type snack combo (e.g. Sundal + Filter Coffee)"
                  value={mealSlotPreferences.snackCustom || ''}
                  onChange={e => onMealSlotPreferencesChange({ ...mealSlotPreferences, snackCustom: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />

                {/* One-tap Suggestions */}
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className="text-[9px] text-stone-400 w-full">Quick suggestions:</span>
                  {snackSuggestions.map(sug => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => onMealSlotPreferencesChange({ ...mealSlotPreferences, snackCustom: sug })}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 border border-stone-200 transition-colors cursor-pointer"
                    >
                      + {sug}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Custom Habit Note Bar */}
        <div className="mt-4 pt-3.5 border-t border-amber-200/80 flex flex-col sm:flex-row items-center gap-3">
          <span className="text-xs font-semibold text-stone-800 shrink-0 flex items-center gap-1.5">
            <BookmarkCheck className="w-3.5 h-3.5 text-amber-700" />
            <span>Family Food Habit Note:</span>
          </span>
          <input
            type="text"
            placeholder="e.g. 'We eat 3 chapatis per person at night, only kids eat small rice bowl' or 'Sunday non-veg lunch'"
            value={mealSlotPreferences.customNotes || ''}
            onChange={e => onMealSlotPreferencesChange({ ...mealSlotPreferences, customNotes: e.target.value })}
            className="w-full px-3 py-1.5 bg-white rounded-lg border border-stone-300 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

      </div>

      {/* Preferences & Dietary row */}
      <div className="mt-4 pt-4 border-t border-stone-100 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-stone-700 block mb-1.5">
            Tamil Cuisine Dietary Filter
          </label>
          <div className="flex flex-wrap gap-1.5">
            {diets.map(diet => (
              <button
                key={diet.id}
                type="button"
                onClick={() => onDietaryChange(diet.id)}
                className={`text-xs px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  dietaryPreference === diet.id
                    ? 'bg-amber-100 text-amber-900 border border-amber-300 font-medium'
                    : 'bg-stone-50 text-stone-600 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                {diet.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-stone-700 block mb-1.5">
            Cookware / Constraints (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Pressure cooker available, Dosa tawa ready, Mixie working"
            value={equipmentNotes}
            onChange={e => onEquipmentNotesChange(e.target.value)}
            className="w-full px-3 py-1.5 bg-white rounded-lg border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-6 pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-stone-500 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <span>
            {totalIngredientsCount} pantry items will be calculated with exact physical quantities for {household.adults} adult(s){household.children > 0 ? ` and ${household.children} kid(s)` : ''}.
          </span>
        </div>

        <button
          onClick={onGenerate}
          disabled={isLoading || totalIngredientsCount === 0}
          className={`w-full sm:w-auto px-6 py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
            isLoading || totalIngredientsCount === 0
              ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
              : 'bg-amber-600 hover:bg-amber-700 active:scale-[0.99] text-white shadow-amber-600/20'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Calculating Tamil Samayal with Your Food Habits...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Tamil Kitchen Meal Plan</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};

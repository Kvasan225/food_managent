import React, { useState } from 'react';
import { MealPlanResult, DayPlan, Meal, Ingredient, MealSlotPreferences } from '../types';
import { CookingModal } from './CookingModal';
import { formatIngredientName } from '../data/tanglishDictionary';
import { 
  Calendar, 
  ChefHat, 
  Clock, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  Lightbulb, 
  AlertCircle, 
  Check, 
  Flame,
  Printer,
  Scale,
  Moon,
  Sunrise,
  Sun,
  Settings2
} from 'lucide-react';

interface PlanViewProps {
  plan: MealPlanResult;
  ingredients: Ingredient[];
  onSwapMeal: (dayNumber: number, slot: string, currentRecipeName: string) => Promise<void>;
  onToggleCooked: (dayNumber: number, mealSlot: string) => void;
  swappingMealKey: string | null;
  isTanglish: boolean;
  onOpenPrintPreview: () => void;
  mealSlotPreferences?: MealSlotPreferences;
  onEditPreferences?: () => void;
}

export const PlanView: React.FC<PlanViewProps> = ({
  plan,
  ingredients,
  onSwapMeal,
  onToggleCooked,
  swappingMealKey,
  isTanglish,
  onOpenPrintPreview,
  mealSlotPreferences,
  onEditPreferences,
}) => {
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);
  const [selectedCookingMeal, setSelectedCookingMeal] = useState<{ meal: Meal; dayNumber: number } | null>(null);

  if (!plan || !plan.days || plan.days.length === 0) return null;

  const currentDay = plan.days[activeDayIndex] || plan.days[0];

  const dinnerStyleLabel = mealSlotPreferences?.dinnerStyle === 'tiffin_chapati_dosa'
    ? 'No Rice at Night (Chappati / Dosa Only)'
    : mealSlotPreferences?.dinnerStyle === 'rice_only_nonveg'
      ? 'No Rice at Night (Except for Non-Veg / Biriyani)'
      : mealSlotPreferences?.dinnerStyle === 'chapati_only'
        ? 'Strictly Chapatis at Night'
        : 'Rice Meals Permitted at Night';

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-4 sm:p-6 mb-8">
      
      {/* Chef Strategy Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-serif font-bold text-stone-900">
                  {isTanglish ? 'அம்மா / மாமி Samayal Rationing Strategy' : "Chef's Tamil Kitchen Rationing Strategy"}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-200/60 text-amber-900 font-semibold uppercase">
                  {plan.days.length} Days Sustained
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 mt-1 leading-relaxed">
                {plan.chefRationingStrategy}
              </p>
            </div>
          </div>

          <button
            onClick={onOpenPrintPreview}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-semibold cursor-pointer shrink-0 transition-colors shadow-xs no-print"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>Print / PDF Plan</span>
          </button>
        </div>
      </div>

      {/* ACTIVE HABITS BAR (TIME-OF-DAY & NIGHT RICE RULE CONFIRMATION) */}
      {mealSlotPreferences && (
        <div className="mb-6 p-3 bg-stone-50 rounded-xl border border-stone-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-semibold text-stone-500 uppercase tracking-wider text-[11px]">Active Routine:</span>
            
            <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-stone-200 text-stone-800">
              <Sunrise className="w-3.5 h-3.5 text-amber-600" />
              <span>{mealSlotPreferences.breakfastStyle === 'porridge_light' ? 'Kanji / Porridge' : 'Tiffin (Dosa/Upma)'}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-stone-200 text-stone-800">
              <Sun className="w-3.5 h-3.5 text-amber-600" />
              <span>{mealSlotPreferences.lunchStyle === 'variety_rice' ? 'Variety Rice' : mealSlotPreferences.lunchStyle === 'chapati_curry' ? 'Roti Lunch' : 'Rice Meals (சாப்பாடு)'}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-amber-100/70 px-2.5 py-1 rounded-md border border-amber-300 text-amber-950 font-bold">
              <Moon className="w-3.5 h-3.5 text-indigo-700" />
              <span>{dinnerStyleLabel}</span>
            </div>
          </div>

          {onEditPreferences && (
            <button
              onClick={onEditPreferences}
              className="text-stone-500 hover:text-stone-900 font-medium flex items-center gap-1 cursor-pointer transition-colors self-end sm:self-auto shrink-0"
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>Adjust Habits</span>
            </button>
          )}
        </div>
      )}

      {/* Day Selector Tabs */}
      <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6 overflow-x-auto gap-2">
        <div className="flex items-center gap-2">
          {plan.days.map((day, idx) => {
            const isSelected = activeDayIndex === idx;
            const totalCooked = day.meals.filter(m => m.isCooked).length;
            const isAllCooked = totalCooked === day.meals.length && day.meals.length > 0;

            return (
              <button
                key={day.dayNumber}
                onClick={() => setActiveDayIndex(idx)}
                className={`px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200/80 text-stone-700'
                }`}
              >
                <span>{isTanglish ? `Day ${day.dayNumber} (நாள் ${day.dayNumber})` : `Day ${day.dayNumber}`}</span>
                {isAllCooked ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : totalCooked > 0 ? (
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="text-xs text-stone-400 hidden sm:block">
          Showing Day {currentDay.dayNumber} of {plan.days.length}
        </div>
      </div>

      {/* Active Day Content */}
      <div className="animate-in fade-in duration-150">
        
        {/* Day Theme Bar */}
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 bg-stone-50 rounded-xl border border-stone-200/70">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-amber-700 font-semibold block">
              Day {currentDay.dayNumber} Cooking Focus
            </span>
            <h4 className="text-sm sm:text-base font-serif font-bold text-stone-900 mt-0.5">
              {currentDay.theme}
            </h4>
          </div>
          {currentDay.dailyInventoryStatus && (
            <div className="text-xs text-stone-500 italic max-w-sm">
              "{currentDay.dailyInventoryStatus}"
            </div>
          )}
        </div>

        {/* Meals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {currentDay.meals.map((meal) => {
            const swapKey = `${currentDay.dayNumber}-${meal.slot}`;
            const isSwapping = swappingMealKey === swapKey;
            const isNight = meal.slot === 'dinner';

            return (
              <div
                key={meal.slot}
                className={`rounded-2xl border transition-all flex flex-col justify-between overflow-hidden ${
                  meal.isCooked
                    ? 'bg-stone-50/70 border-stone-200 opacity-90'
                    : 'bg-white border-stone-200/90 shadow-2xs hover:shadow-sm'
                }`}
              >
                {/* Meal Card Top */}
                <div className="p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`text-xs font-mono uppercase tracking-wider font-semibold px-2 py-0.5 rounded ${
                      isNight ? 'bg-indigo-100 text-indigo-900' : 'bg-amber-100/70 text-amber-800'
                    }`}>
                      {meal.slot === 'breakfast' ? (isTanglish ? 'Kaalai (Breakfast)' : 'Breakfast') :
                       meal.slot === 'lunch' ? (isTanglish ? 'Maniyam (Lunch)' : 'Lunch') :
                       meal.slot === 'dinner' ? (isTanglish ? 'Iravu (Dinner)' : 'Dinner') : 'Snack'}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-stone-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{meal.prepTimeMinutes + meal.cookTimeMinutes}m</span>
                    </div>
                  </div>

                  <h5 className="text-base font-serif font-bold text-stone-900 leading-snug">
                    {meal.recipeName}
                  </h5>

                  <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                    {meal.description}
                  </p>

                  {/* EXACT REQUIRED INGREDIENT QUANTITIES */}
                  <div className="mt-3.5 pt-3 border-t border-stone-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1">
                        <Scale className="w-3 h-3 text-amber-600" />
                        <span>Exact Quantities Required:</span>
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">For {meal.servings} Servings</span>
                    </div>

                    <div className="space-y-1.5 bg-stone-50/70 rounded-lg p-2.5 border border-stone-200/60">
                      {meal.ingredientsUsed.map((ing, idx) => {
                        const formattedName = isTanglish 
                          ? formatIngredientName(ing.name, true) 
                          : ing.name;

                        return (
                          <div key={idx} className="flex items-center justify-between text-xs gap-2">
                            <span className="text-stone-800 truncate font-medium">
                              {formattedName}
                            </span>
                            <span className="font-mono text-stone-950 font-bold text-xs shrink-0 bg-white px-1.5 py-0.5 rounded border border-stone-200/80 shadow-3xs">
                              {ing.amountUsed}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Kitchen stretch hack banner */}
                  {meal.stretchTip && (
                    <div className="mt-3 p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/70 text-[11px] text-amber-950 flex items-start gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                      <p className="line-clamp-2">
                        <strong>Tamil Kitchen Hack:</strong> {meal.stretchTip}
                      </p>
                    </div>
                  )}
                </div>

                {/* Meal Card Bottom Action Bar */}
                <div className="px-4 py-3 bg-stone-50/80 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onToggleCooked(currentDay.dayNumber, meal.slot)}
                    className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md transition-colors cursor-pointer ${
                      meal.isCooked
                        ? 'text-emerald-700 bg-emerald-100/70'
                        : 'text-stone-500 hover:text-stone-900 hover:bg-stone-200/60'
                    }`}
                  >
                    <Check className={`w-3.5 h-3.5 ${meal.isCooked ? 'text-emerald-700' : 'text-stone-400'}`} />
                    <span>{meal.isCooked ? 'Samayal Done' : 'Check Off'}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onSwapMeal(currentDay.dayNumber, meal.slot, meal.recipeName)}
                      disabled={isSwapping}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
                      title="Swap this recipe with another South Indian alternative"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSwapping ? 'animate-spin text-amber-600' : ''}`} />
                    </button>

                    <button
                      onClick={() => setSelectedCookingMeal({ meal, dayNumber: currentDay.dayNumber })}
                      className="flex items-center gap-1 px-3 py-1.5 bg-stone-900 hover:bg-black text-white rounded-lg text-xs font-medium cursor-pointer transition-colors"
                    >
                      <Flame className="w-3 h-3 text-amber-400" />
                      <span>Cook</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Interactive Cooking Modal */}
      {selectedCookingMeal && (
        <CookingModal
          meal={selectedCookingMeal.meal}
          dayNumber={selectedCookingMeal.dayNumber}
          onClose={() => setSelectedCookingMeal(null)}
          onMarkCooked={() => {
            onToggleCooked(selectedCookingMeal.dayNumber, selectedCookingMeal.meal.slot);
          }}
        />
      )}

    </div>
  );
};

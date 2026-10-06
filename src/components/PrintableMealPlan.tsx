import React from 'react';
import { MealPlanResult, Household } from '../types';
import { Printer, X, Download, ChefHat, Calendar, CheckSquare } from 'lucide-react';

interface PrintableMealPlanProps {
  plan: MealPlanResult;
  household: Household;
  daysToSustain: number;
  isTanglish: boolean;
  onClose?: () => void;
  isModal?: boolean;
}

export const PrintableMealPlan: React.FC<PrintableMealPlanProps> = ({
  plan,
  household,
  daysToSustain,
  isTanglish,
  onClose,
  isModal = false,
}) => {
  if (!plan || !plan.days) return null;

  const handlePrintAction = () => {
    window.print();
  };

  const content = (
    <div className="bg-white text-stone-900 p-6 sm:p-8 max-w-4xl mx-auto leading-normal">
      {/* Print Document Header */}
      <div className="border-b-2 border-stone-800 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif font-bold tracking-tight text-stone-950">
              PantryBridge · Tamil Kitchen Meal Plan
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-stone-150 border border-stone-300">
              {daysToSustain} Days Plan
            </span>
          </div>
          <p className="text-xs text-stone-600 mt-1">
            End-of-Month Kitchen Sustenance Plan · For {household.adults} Adult(s){household.children > 0 ? ` & ${household.children} Kid(s)` : ''}
          </p>
        </div>

        <div className="text-right text-xs text-stone-500 font-mono">
          <div>Printed: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
          <div>Mode: {isTanglish ? 'Tanglish (தமிழ்)' : 'Standard'}</div>
        </div>
      </div>

      {/* Chef Rationing Strategy Note */}
      <div className="p-3.5 mb-6 bg-stone-50 border border-stone-300 rounded-lg text-xs leading-relaxed">
        <strong className="font-bold text-stone-900 block mb-1">
          Chef's Rationing Strategy:
        </strong>
        {plan.chefRationingStrategy}
      </div>

      {/* Day by Day Plan */}
      <div className="space-y-6">
        {plan.days.map(day => (
          <div key={day.dayNumber} className="print-day-break border border-stone-300 rounded-xl p-4 bg-white">
            <div className="border-b border-stone-200 pb-2 mb-3 flex items-center justify-between">
              <h2 className="text-base font-serif font-bold text-stone-900">
                Day {day.dayNumber}: {day.theme}
              </h2>
              {day.dailyInventoryStatus && (
                <span className="text-[11px] text-stone-500 italic">
                  {day.dailyInventoryStatus}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {day.meals.map(meal => (
                <div key={meal.slot} className="border border-stone-200 rounded-lg p-3 bg-stone-50/50 flex flex-col justify-between text-xs">
                  <div>
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase text-stone-500 font-semibold mb-1">
                      <span>{meal.slot}</span>
                      <span>{meal.prepTimeMinutes + meal.cookTimeMinutes}m</span>
                    </div>

                    <h3 className="font-serif font-bold text-sm text-stone-900 leading-snug mb-1">
                      {meal.recipeName}
                    </h3>

                    <p className="text-[11px] text-stone-600 mb-2 leading-relaxed">
                      {meal.description}
                    </p>

                    {/* Exact Ingredients with physical quantities */}
                    <div className="mt-2 pt-2 border-t border-stone-200">
                      <span className="text-[10px] font-bold uppercase text-stone-500 block mb-1">
                        Exact Quantities Required:
                      </span>
                      <ul className="space-y-1">
                        {meal.ingredientsUsed.map((ing, i) => (
                          <li key={i} className="flex items-baseline justify-between text-[11px] gap-2">
                            <span className="text-stone-800">{ing.name}</span>
                            <span className="font-mono font-bold text-stone-950 shrink-0">
                              {ing.amountUsed}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Cooking Instructions */}
                    <div className="mt-2 pt-2 border-t border-stone-200">
                      <span className="text-[10px] font-bold uppercase text-stone-500 block mb-1">
                        Method:
                      </span>
                      <ol className="list-decimal pl-4 space-y-1 text-[11px] text-stone-700 leading-relaxed">
                        {meal.instructions.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  {meal.stretchTip && (
                    <div className="mt-2 pt-1.5 border-t border-dashed border-stone-200 text-[10px] text-amber-900 italic">
                      <strong>Stretch Tip:</strong> {meal.stretchTip}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Depleted Items & Payday Restock Bridge */}
      {plan.nextMonthGroceryBridge && plan.nextMonthGroceryBridge.length > 0 && (
        <div className="mt-8 pt-6 border-t-2 border-stone-800 print-day-break">
          <h2 className="text-base font-serif font-bold text-stone-900 mb-2 flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-stone-700" />
            <span>Payday Restock Bridge (Items Depleted by this Plan)</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            {plan.nextMonthGroceryBridge.map((item, idx) => (
              <div key={idx} className="p-2 border border-stone-200 rounded flex items-center gap-2">
                <span className="w-3.5 h-3.5 border border-stone-400 rounded-xs inline-block" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Kitchen Survival Tips Summary */}
      {plan.survivalHacks && plan.survivalHacks.length > 0 && (
        <div className="mt-6 pt-4 border-t border-stone-200 text-[11px] text-stone-600 print-day-break">
          <strong className="block text-stone-800 mb-1">Zero-Waste Kitchen Survival Tips:</strong>
          <ul className="list-disc pl-4 space-y-0.5">
            {plan.survivalHacks.slice(0, 4).map((hack, i) => (
              <li key={i}>{hack}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  // If used as interactive preview modal
  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
        <div className="bg-white rounded-2xl max-w-4xl w-full my-6 shadow-2xl border border-stone-300 flex flex-col max-h-[92vh] overflow-hidden">
          
          {/* Modal Toolbar (hidden on print) */}
          <div className="p-4 bg-stone-900 text-white flex items-center justify-between no-print shrink-0">
            <div className="flex items-center gap-2">
              <Printer className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="font-serif font-bold text-base text-white">
                  Print / Save Meal Plan as PDF
                </h3>
                <p className="text-xs text-stone-400">
                  Formatted cleanly with exact quantities for your kitchen wall or fridge.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrintAction}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs rounded-lg cursor-pointer flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF Now</span>
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Scrollable Printable Document */}
          <div className="overflow-y-auto flex-1 p-2 sm:p-6 bg-stone-100/50">
            <div className="shadow-lg border border-stone-200 rounded-xl overflow-hidden bg-white">
              {content}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // Pure print view (rendered into DOM with class print-only)
  return (
    <div className="print-only">
      {content}
    </div>
  );
};

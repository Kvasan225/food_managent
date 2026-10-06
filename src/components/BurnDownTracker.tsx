import React from 'react';
import { InventoryBurnDownItem } from '../types';
import { TrendingDown, CheckCircle2, AlertCircle, PackageCheck } from 'lucide-react';

interface BurnDownTrackerProps {
  burnDownItems: InventoryBurnDownItem[];
  daysCount: number;
}

export const BurnDownTracker: React.FC<BurnDownTrackerProps> = ({
  burnDownItems,
  daysCount,
}) => {
  if (!burnDownItems || burnDownItems.length === 0) return null;

  const depletedCount = burnDownItems.filter(i => i.status === 'fully_depleted').length;
  const surplusCount = burnDownItems.length - depletedCount;

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-4 sm:p-6 mb-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-serif text-stone-900 font-semibold tracking-tight">
              Pantry Depletion & Inventory Burn-Down
            </h3>
            <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
              Ration Meter
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Track how each ingredient is metered through Day {daysCount} to prevent premature depletion.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-stone-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Surplus Buffer ({surplusCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-stone-400" />
            <span>Zero-Waste Depleted ({depletedCount})</span>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {burnDownItems.map((item, idx) => {
          const isDepleted = item.status === 'fully_depleted';

          return (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                isDepleted 
                  ? 'bg-stone-50/60 border-stone-200' 
                  : 'bg-white border-stone-200/90 hover:border-stone-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-semibold text-stone-900">
                    {item.ingredientName}
                  </span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    isDepleted 
                      ? 'bg-stone-200 text-stone-700' 
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {isDepleted ? 'Fully Consumed' : 'Surplus Left'}
                  </span>
                </div>

                <div className="mt-2 text-xs flex items-center justify-between text-stone-500 font-mono">
                  <span>Start: {item.initialQty}</span>
                  <span>→</span>
                  <span className={isDepleted ? 'text-stone-400' : 'text-emerald-700 font-medium'}>
                    End: {item.remainingQty}
                  </span>
                </div>
              </div>

              {/* Depletion timeline note */}
              <div className="mt-3 pt-2 border-t border-stone-100 text-[11px] text-stone-500">
                {isDepleted ? (
                  item.depletionDay ? (
                    <span>Last portion rationed on <strong>Day {item.depletionDay}</strong></span>
                  ) : (
                    <span>Exhausted cleanly across meal plan</span>
                  )
                ) : (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Safe buffer into next month</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

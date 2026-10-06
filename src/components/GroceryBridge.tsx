import React, { useState } from 'react';
import { ShoppingBag, Copy, Check, Calendar, ArrowRight } from 'lucide-react';

interface GroceryBridgeProps {
  items: string[];
}

export const GroceryBridge: React.FC<GroceryBridgeProps> = ({ items }) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  if (!items || items.length === 0) return null;

  const toggleCheck = (item: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const handleCopy = () => {
    const text = `Next Month Grocery Restock List (PantryBridge):\n` +
      items.map(i => `- ${i}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-4 sm:p-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-stone-900 text-white flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-xl font-serif text-stone-900 font-semibold tracking-tight">
              Bridge to Next Month: Payday Restock List
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Foundational staples depleted by this meal plan to buy first on Day 1 of the new budget cycle.
            </p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium cursor-pointer transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied to Clipboard!' : 'Copy Restock List'}</span>
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
        {items.map((item, idx) => {
          const isChecked = !!checkedItems[item];
          return (
            <div
              key={idx}
              onClick={() => toggleCheck(item)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 text-xs ${
                isChecked
                  ? 'bg-stone-50 border-stone-200 text-stone-400 line-through'
                  : 'bg-white border-stone-200 hover:border-stone-300 text-stone-800'
              }`}
            >
              <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                isChecked ? 'bg-stone-400 border-stone-400 text-white' : 'border-stone-300'
              }`}>
                {isChecked && <Check className="w-3 h-3" />}
              </div>
              <span className="font-medium">{item}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 rounded-xl bg-stone-50 border border-stone-200/60 text-xs text-stone-500 flex items-center gap-2">
        <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          Buying durable bulk calories (e.g. 5kg rice, dried legumes, whole oats) on the 1st of next month guarantees you never face zero-inventory at month-end.
        </span>
      </div>
    </div>
  );
};

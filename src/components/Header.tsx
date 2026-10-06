import React from 'react';
import { ChefHat, Calendar, Printer, Languages, Sparkles } from 'lucide-react';

interface HeaderProps {
  daysToSustain: number;
  hasPlan: boolean;
  isTanglish: boolean;
  onToggleTanglish: () => void;
  onPrint: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  daysToSustain,
  hasPlan,
  isTanglish,
  onToggleTanglish,
  onPrint,
  onReset,
}) => {
  return (
    <header className="border-b border-stone-200/80 bg-stone-900 text-stone-100 shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-serif tracking-tight text-white font-semibold">
                  PantryBridge
                </h1>
                <span className="text-xs uppercase tracking-wider font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Tamil Samayal · End of Month
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-400 mt-0.5">
                Stretching your kitchen groceries with authentic South Indian recipes until payday.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Tanglish Mode Toggle */}
            <button
              onClick={onToggleTanglish}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                isTanglish
                  ? 'bg-amber-500 text-stone-950 border-amber-400 font-semibold shadow-xs'
                  : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-750'
              }`}
              title="Toggle Tanglish naming (e.g. Tomato - Thakkali, Rice - Arisi)"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>Tanglish (தங்லீஷ்): {isTanglish ? 'ON' : 'OFF'}</span>
            </button>

            {/* Target Days Indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-800 border border-stone-700/80 text-xs text-stone-300">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>
                Target: <strong className="text-amber-300">{daysToSustain} days</strong>
              </span>
            </div>

            {hasPlan && (
              <button
                onClick={onPrint}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                title="Print or save as PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Plan</span>
              </button>
            )}

            <button
              onClick={onReset}
              className="text-xs text-stone-400 hover:text-stone-200 px-2 py-1.5 transition-colors cursor-pointer"
              title="Reset inventory to default sample"
            >
              Reset Data
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

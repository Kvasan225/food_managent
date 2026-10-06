import React, { useState, useEffect } from 'react';
import { Meal } from '../types';
import { X, Clock, Play, Pause, RotateCcw, Check, Flame, Lightbulb, AlertCircle } from 'lucide-react';

interface CookingModalProps {
  meal: Meal;
  dayNumber: number;
  onClose: () => void;
  onMarkCooked?: () => void;
}

export const CookingModal: React.FC<CookingModalProps> = ({
  meal,
  dayNumber,
  onClose,
  onMarkCooked,
}) => {
  // Completed Steps
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Simple Cooking Timer
  const initialSeconds = (meal.cookTimeMinutes || 15) * 60;
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft]);

  const toggleStep = (idx: number) => {
    if (completedSteps.includes(idx)) {
      setCompletedSteps(completedSteps.filter(s => s !== idx));
    } else {
      setCompletedSteps([...completedSteps, idx]);
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full my-8 shadow-2xl border border-stone-200 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between border-b border-stone-800 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400">
                Day {dayNumber} · {meal.slot}
              </span>
              <span className="text-stone-400 text-xs">·</span>
              <span className="text-xs text-stone-300">
                {meal.prepTimeMinutes + meal.cookTimeMinutes} mins total
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-white mt-0.5">
              {meal.recipeName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {meal.description}
          </p>

          {/* Interactive Timer & Quick Meta */}
          <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-amber-600" />
              <div>
                <span className="text-xs text-stone-500 block font-medium">Cooking Timer</span>
                <span className="text-xl font-mono font-bold text-stone-900 tabular-nums">
                  {formatTimer(timeLeft)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTimerRunning(!timerRunning)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-medium cursor-pointer transition-colors"
              >
                {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{timerRunning ? 'Pause' : 'Start Timer'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setTimerRunning(false);
                  setTimeLeft(initialSeconds);
                }}
                className="p-1.5 bg-white border border-stone-200 hover:bg-stone-100 rounded-lg text-stone-600 cursor-pointer"
                title="Reset timer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Deducted Pantry Ingredients */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
              Pantry Ingredients Rationed:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {meal.ingredientsUsed.map((ing, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg border border-stone-200/90 bg-stone-50/50 flex items-start justify-between gap-2 text-xs"
                >
                  <span className="font-semibold text-stone-900">{ing.name}</span>
                  <div className="text-right">
                    <span className="font-mono text-stone-700 font-medium block">
                      {ing.amountUsed}
                    </span>
                    {ing.rationNote && (
                      <span className="text-[10px] text-stone-400 block line-clamp-1">
                        {ing.rationNote}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kitchen Stretch Hack Banner */}
          {meal.stretchTip && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2.5 text-xs text-amber-950">
              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold">Kitchen Rationing Hack: </strong>
                {meal.stretchTip}
              </div>
            </div>
          )}

          {/* Emergency Substitution */}
          {meal.emergencySubstitution && (
            <div className="p-3 bg-stone-100/80 rounded-xl border border-stone-200 flex items-start gap-2.5 text-xs text-stone-700">
              <AlertCircle className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold">Missing something? </strong>
                {meal.emergencySubstitution}
              </div>
            </div>
          )}

          {/* Step-by-Step Instructions */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
              Step-by-Step Method:
            </h4>
            <div className="space-y-2">
              {meal.instructions.map((step, idx) => {
                const isDone = completedSteps.includes(idx);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleStep(idx)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 text-xs leading-relaxed ${
                      isDone
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                        : 'bg-white border-stone-200 text-stone-800 hover:border-stone-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 font-mono text-[11px] font-semibold ${
                      isDone ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-600'
                    }`}>
                      {isDone ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                    </div>
                    <span className={isDone ? 'line-through text-stone-400' : ''}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-stone-500 font-medium">
            {completedSteps.length} of {meal.instructions.length} steps checked
          </div>
          <div className="flex items-center gap-2">
            {onMarkCooked && (
              <button
                type="button"
                onClick={() => {
                  onMarkCooked();
                  onClose();
                }}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium rounded-lg cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark as Cooked</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

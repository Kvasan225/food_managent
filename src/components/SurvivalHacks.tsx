import React from 'react';
import { Lightbulb, Sparkles, ChefHat } from 'lucide-react';

interface SurvivalHacksProps {
  hacks: string[];
}

export const SurvivalHacks: React.FC<SurvivalHacksProps> = ({ hacks }) => {
  if (!hacks || hacks.length === 0) return null;

  return (
    <div className="bg-amber-50/50 rounded-2xl border border-amber-200/80 p-4 sm:p-6 mb-8 shadow-2xs">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-800 flex items-center justify-center">
          <Lightbulb className="w-4 h-4 text-amber-700" />
        </div>
        <div>
          <h3 className="text-lg font-serif font-semibold text-stone-900">
            Zero-Waste Kitchen Survival Hacks
          </h3>
          <p className="text-xs text-stone-500">
            Professional culinary techniques to multiply food volume and salvage every scrap.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        {hacks.map((hack, idx) => {
          // If hack contains a colon like "Starch Water Gold: Never drain...", highlight the title
          const colonIdx = hack.indexOf(':');
          const title = colonIdx !== -1 ? hack.slice(0, colonIdx) : `Hack #${idx + 1}`;
          const body = colonIdx !== -1 ? hack.slice(colonIdx + 1).trim() : hack;

          return (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-white/80 border border-amber-200/60 shadow-2xs flex items-start gap-3"
            >
              <span className="w-6 h-6 rounded-md bg-amber-100 text-amber-800 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <div className="text-xs leading-relaxed text-stone-800">
                <strong className="font-semibold text-amber-950 block mb-0.5">
                  {title}
                </strong>
                <p className="text-stone-600">{body}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Droplets, Plus, RotateCcw, CheckCircle2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WaterTrackerProps {
  targetLiters: number;
}

export const WaterTracker: React.FC<WaterTrackerProps> = ({ targetLiters }) => {
  const [consumedMl, setConsumedMl] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bsf_water_consumed_ml');
      if (saved) return parseInt(saved, 10) || 0;
    }
    return 1250; // Initial healthy start
  });

  const targetMl = Math.round(targetLiters * 1000);
  const percentage = Math.min(100, Math.round((consumedMl / targetMl) * 100));
  const glassCount = Math.floor(consumedMl / 250);
  const totalGlasses = Math.ceil(targetMl / 250);

  const addWater = (amountMl: number) => {
    const updated = consumedMl + amountMl;
    setConsumedMl(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bsf_water_consumed_ml', updated.toString());
    }

    if (consumedMl < targetMl && updated >= targetMl) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 }
        });
      } catch {}
    }
  };

  const resetWater = () => {
    setConsumedMl(0);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bsf_water_consumed_ml', '0');
    }
  };

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xl relative overflow-hidden" id="bsf-water-tracker">
      
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-white">Daily Hydration Pacer</h3>
            <p className="text-[11px] text-zinc-400">Target: {targetLiters} Liters ({totalGlasses} glasses of 250ml)</p>
          </div>
        </div>

        <button
          type="button"
          onClick={resetWater}
          className="p-2 rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition"
          title="Reset today's water counter"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Stats Display */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="space-y-1 text-center sm:text-left">
          <div className="text-3xl sm:text-4xl font-black text-white font-mono flex items-baseline justify-center sm:justify-start gap-1">
            <span>{(consumedMl / 1000).toFixed(2)}</span>
            <span className="text-sm font-normal text-zinc-500">/ {targetLiters.toFixed(1)} L</span>
          </div>
          <div className="text-xs text-cyan-400 font-semibold flex items-center justify-center sm:justify-start gap-1.5">
            {percentage >= 100 ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Target Reached! Muscle Hydration Saturated</span>
              </>
            ) : (
              <span>{glassCount} of {totalGlasses} glasses consumed ({percentage}%)</span>
            )}
          </div>
        </div>

        {/* Quick Add Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => addWater(250)}
            className="px-4 py-2.5 bg-zinc-950 border border-zinc-800 hover:border-cyan-500/50 hover:bg-cyan-500/10 text-zinc-200 text-xs font-bold rounded-2xl transition flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            <span>+250 ml (1 Glass)</span>
          </button>

          <button
            type="button"
            onClick={() => addWater(500)}
            className="px-4 py-2.5 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-300 text-xs font-bold rounded-2xl transition flex items-center gap-1.5 active:scale-95 shadow-md shadow-cyan-500/10"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+500 ml (Shaker)</span>
          </button>
        </div>
      </div>

      {/* Visual Glass Tracker Row */}
      <div className="space-y-2">
        <div className="w-full h-3 rounded-full bg-zinc-950 border border-zinc-800 overflow-hidden p-0.5">
          <div
            style={{ width: `${percentage}%` }}
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
          />
        </div>

        {/* 12-16 Mini Glass Indicators */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto py-1">
          {Array.from({ length: totalGlasses }).map((_, idx) => {
            const isFilled = idx < glassCount;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setConsumedMl((idx + 1) * 250)}
                className={`flex-1 min-w-[20px] h-6 rounded-md border text-[9px] font-mono font-bold transition flex items-center justify-center ${
                  isFilled
                    ? 'bg-cyan-400 text-black border-cyan-300 shadow-sm'
                    : 'bg-zinc-950 text-zinc-600 border-zinc-800 hover:border-zinc-700'
                }`}
                title={`Glass ${idx + 1} (250ml)`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};

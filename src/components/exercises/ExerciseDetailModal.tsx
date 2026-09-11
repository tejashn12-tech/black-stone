import React, { useState, useMemo, useEffect } from 'react';
import { Exercise } from '../../types';
import {
  X,
  ShieldAlert,
  AlertCircle,
  CheckCircle2,
  Flame,
  Dumbbell,
  Layers,
  Activity,
  Target,
  ExternalLink,
  Film,
  Sparkles,
  Info,
  RotateCw,
  Maximize2,
  Check
} from 'lucide-react';

interface ExerciseDetailModalProps {
  exercise: Exercise | null;
  onClose: () => void;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  exercise,
  onClose
}) => {
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Generate candidate mirror URLs
  const sources = useMemo(() => {
    if (!exercise) return [];
    const list: string[] = [];
    if (exercise.mirrorGifUrl) {
      list.push(exercise.mirrorGifUrl);
      list.push(exercise.mirrorGifUrl.replace('cdn.jsdelivr.net', 'fastly.jsdelivr.net'));
      list.push(exercise.mirrorGifUrl.replace('https://cdn.jsdelivr.net/gh/', 'https://raw.githubusercontent.com/').replace('@main', '/main'));
    }
    if (exercise.imageUrl && exercise.imageUrl !== exercise.mirrorGifUrl) {
      list.push(exercise.imageUrl);
    }
    if (exercise.gifUrl) {
      list.push(exercise.gifUrl);
    }
    return list;
  }, [exercise]);

  // Reset states when active exercise changes
  useEffect(() => {
    setCurrentSourceIndex(0);
    setIsLoading(true);
    setIsError(false);
    setIsFullscreen(false);
  }, [exercise?.id]);

  if (!exercise) return null;

  const currentUrl = sources[currentSourceIndex] || exercise.gifUrl;

  const handleImageError = () => {
    if (currentSourceIndex + 1 < sources.length) {
      setCurrentSourceIndex(prev => prev + 1);
    } else {
      setIsError(true);
      setIsLoading(false);
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleReload = () => {
    setIsLoading(true);
    setIsError(false);
    setCurrentSourceIndex(0);
  };

  const handleCopyLink = () => {
    if (currentUrl) {
      navigator.clipboard.writeText(currentUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto" id="exercise-detail-modal">
      <div className="relative w-full max-w-3xl bg-zinc-900 border border-zinc-700/80 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-zinc-950 border-b border-zinc-800">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-orange-500 text-black font-mono">
              {exercise.id}
            </span>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
              {exercise.categoryDisplay}
            </span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
              exercise.difficulty === 'Beginner'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : exercise.difficulty === 'Intermediate'
                ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}>
              {exercise.difficulty}
            </span>
            <span className="text-xs text-zinc-400 flex items-center gap-1 font-mono">
              <Dumbbell className="w-3.5 h-3.5 text-orange-400" /> {exercise.equipment}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Movement Title & Calorie Burn */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
            <div>
              <span className="text-xs font-bold text-orange-400 uppercase font-mono tracking-wider">
                {exercise.targetMuscle} ISOLATION
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-display tracking-wide mt-0.5">
                {exercise.name}
              </h2>
            </div>

            {exercise.caloriesBurnEstimatePerHour && (
              <span className="inline-flex items-center gap-1.5 text-orange-400 font-mono text-xs bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-full w-fit">
                <Flame className="w-4 h-4 text-orange-500" /> ~{exercise.caloriesBurnEstimatePerHour} kcal/hr
              </span>
            )}
          </div>

          {/* GIF Media Player & Biomechanical Motion Showcase */}
          <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 relative">
            <div className="p-3 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between text-xs flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-orange-400" />
                <span className="font-bold text-white">Biomechanical GIF Motion Guide</span>
                <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 font-mono text-[10px]">
                  Looping Form Guide
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleReload}
                  className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white transition flex items-center gap-1 text-[11px]"
                  title="Reload Animation"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reload</span>
                </button>

                <button
                  onClick={handleCopyLink}
                  className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white transition flex items-center gap-1 text-[11px]"
                  title="Copy GIF URL"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <ExternalLink className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Share'}</span>
                </button>
              </div>
            </div>

            {/* Animation Viewer Canvas */}
            <div className={`w-full flex items-center justify-center bg-zinc-950 relative transition-all duration-300 ${
              isFullscreen ? 'h-96 sm:h-[450px] p-2' : 'h-72 sm:h-80 p-4'
            }`}>
              {/* Spinner while downloading GIF */}
              {isLoading && !isError && (
                <div className="absolute inset-0 bg-zinc-950/90 z-20 flex flex-col items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-full border-3 border-orange-500/20 border-t-orange-500 animate-spin" />
                  <span className="text-xs text-zinc-400 font-mono">Loading high-frame-rate GIF...</span>
                </div>
              )}

              {currentUrl && !isError ? (
                <img
                  src={currentUrl}
                  alt={exercise.name}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  className={`max-h-full max-w-full object-contain rounded-xl shadow-2xl transition-opacity duration-500 ${
                    isLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                  loading="lazy"
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                />
              ) : (
                /* High-fidelity Fallback Display */
                <div className="text-center space-y-3 p-6 max-w-md">
                  <div className="w-16 h-16 rounded-3xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mx-auto text-orange-400">
                    <Dumbbell className="w-8 h-8 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{exercise.name}</h4>
                    <p className="text-xs text-zinc-400 mt-1">
                      Target Muscle: <strong className="text-orange-300">{exercise.targetMuscle}</strong> • Category: {exercise.categoryDisplay}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400 font-mono flex items-center justify-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                    <span>Reference: {exercise.name}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Muscle Anatomy Division Breakdown */}
          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase font-bold text-zinc-300 tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-orange-400" /> Anatomical Target Muscle Breakdown
              </h3>
              <span className="text-[10px] font-mono text-zinc-500">Biomechanical Division</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Primary Target Muscle */}
              <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <span className="text-[10px] uppercase font-black text-orange-400 tracking-wider block mb-1.5">
                  Primary Target Muscle
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg text-sm font-bold bg-orange-500 text-black">
                    {exercise.targetMuscle || exercise.targetMuscles[0]}
                  </span>
                  <span className="text-xs text-zinc-300 font-medium">Primary Mover</span>
                </div>
              </div>

              {/* Secondary / Synergist Muscles */}
              <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block mb-1.5">
                  Synergist / Stabilizer Muscles
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {exercise.secondaryMuscles.length > 0 ? (
                    exercise.secondaryMuscles.map((m, idx) => (
                      <span key={idx} className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-zinc-800 text-zinc-200 border border-zinc-700">
                        {m}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-zinc-500 italic">Direct isolation movement</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Step-by-Step Execution Guide */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase font-bold text-zinc-300 tracking-widest flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-orange-400" /> Biomechanical Execution Instructions
            </h3>
            <div className="space-y-2.5">
              {exercise.instructions.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80 text-xs text-zinc-200">
                  <span className="w-5 h-5 rounded-full bg-orange-500 text-black font-extrabold flex items-center justify-center text-[10px] shrink-0">
                    {idx + 1}
                  </span>
                  <p className="leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Tips & Common Mistakes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Safety Tips */}
            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
              <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4 text-emerald-400" /> Form Checkpoints &amp; Safety
              </h4>
              <ul className="space-y-1.5 text-xs text-zinc-300">
                {exercise.safetyTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Common Mistakes */}
            <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/20 space-y-2">
              <h4 className="text-xs font-bold text-rose-400 flex items-center gap-1.5 uppercase tracking-wider">
                <AlertCircle className="w-4 h-4 text-rose-400" /> Common Form Pitfalls
              </h4>
              <ul className="space-y-1.5 text-xs text-zinc-300">
                {exercise.commonMistakes.map((mistake, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <span className="font-mono">Movement ID: {exercise.id}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-orange-500 text-black font-bold hover:bg-orange-400 transition"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};

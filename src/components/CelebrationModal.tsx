import React from 'react';
import { Award, Sparkles, X, CheckCircle2 } from 'lucide-react';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReplayConfetti: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  onClose,
  onReplayConfetti,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border-2 border-[#22C55E] bg-gradient-to-b from-[#11241A] via-[#0E1B14] to-[#090D0B] p-6 sm:p-8 text-center text-white shadow-[0_0_80px_rgba(34,197,94,0.35)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-black/30 p-1.5 text-neutral-400 hover:text-white hover:bg-black/50 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Emerald Glow Ring with Trophy */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#16A34A] to-[#86EFAC] text-[#090D0B] shadow-[0_0_35px_rgba(34,197,94,0.6)]">
          <Award className="h-10 w-10 stroke-[2.2]" />
        </div>

        {/* Exact User Requested Celebration Text */}
        <div className="mt-5 space-y-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-widest uppercase text-[#86EFAC] bg-[#22C55E]/15 px-3 py-1 rounded-full border border-[#22C55E]/30">
            <Sparkles className="h-3.5 w-3.5" />
            100% PERFECT DISCIPLINE
          </span>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight font-mono">
            ALL TARGETS COMPLETED. YOU WON TODAY!
          </h2>

          <p className="text-sm text-neutral-300 max-w-xs mx-auto leading-relaxed pt-1">
            You executed all 5 commitments without hesitation. 5.0 hours of deep study and 2.0 hours of physical exercise conquered.
          </p>
        </div>

        {/* Milestone checklist preview */}
        <div className="my-5 rounded-2xl border border-[#22C55E]/20 bg-[#0A140E]/80 p-3.5 text-xs font-mono text-neutral-300">
          <div className="flex items-center justify-around">
            <div className="flex items-center gap-1.5 text-[#86EFAC]">
              <CheckCircle2 className="h-4 w-4" />
              <span>3 Study Slots</span>
            </div>
            <span className="text-neutral-600">·</span>
            <div className="flex items-center gap-1.5 text-[#86EFAC]">
              <CheckCircle2 className="h-4 w-4" />
              <span>2 Workouts</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => {
              onReplayConfetti();
            }}
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#22C55E] py-3 text-sm font-bold text-[#090D0B] shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:bg-[#16A34A] transition active:scale-95"
          >
            <Sparkles className="h-4 w-4" />
            <span>Celebrate Again (Confetti)</span>
          </button>

          <button
            onClick={onClose}
            className="w-full rounded-xl bg-[#16251D] py-2.5 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-[#1E3327] transition"
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

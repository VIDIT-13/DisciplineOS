import React, { useState, useEffect } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { formatKolkataDashboardDate } from '../utils/dateUtils';
import {
  ShieldCheck,
  Download,
  Smartphone,
  Clock,
  X,
  RotateCcw,
  Share2,
  Sparkles,
  Cloud,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

interface HeaderProps {
  onResetToday: () => void;
  completedCount: number;
  onOpenSyncModal: () => void;
  isCleanSlate: boolean;
  syncStatus: 'synced' | 'syncing' | 'offline';
  onManualSync: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onResetToday,
  completedCount,
  onOpenSyncModal,
  isCleanSlate,
  syncStatus,
  onManualSync,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [timeState, setTimeState] = useState(() => formatKolkataDashboardDate());
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeState(formatKolkataDashboardDate());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1A2620] bg-[#090D0B]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Lockup */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#1A3828] to-[#0D2117] border border-[#22C55E]/30 text-[#22C55E] shadow-sm">
            <ShieldCheck className="h-5 w-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white font-mono">DisciplineOS</span>
              {isCleanSlate ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[#86EFAC] bg-[#22C55E]/15 px-2 py-0.5 rounded-full border border-[#22C55E]/30">
                  <Sparkles className="h-3 w-3" />
                  Personal Journey
                </span>
              ) : (
                <span className="hidden sm:inline-block text-[10px] font-semibold uppercase tracking-wider text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded-full border border-[#22C55E]/20">
                  5 Targets Daily
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-400 hidden sm:block">Zero friction daily execution</p>
          </div>
        </div>

        {/* Live Kolkata Clock & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Cloud Sync Status Badge */}
          <button
            onClick={onManualSync}
            title="Cloud Sync Active across Phone & Safari - Click to Sync Now"
            className="flex items-center gap-1.5 rounded-lg border border-[#1A2620] bg-[#111916] px-2.5 py-1.5 text-xs transition hover:border-[#22C55E]/40"
          >
            {syncStatus === 'syncing' ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 text-[#86EFAC] animate-spin" />
                <span className="text-[11px] font-mono text-[#86EFAC] hidden sm:inline">Syncing...</span>
              </>
            ) : syncStatus === 'synced' ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-[#22C55E]" />
                <span className="text-[11px] font-mono text-neutral-300 hidden sm:inline">Cloud Synced</span>
              </>
            ) : (
              <>
                <Cloud className="h-3.5 w-3.5 text-neutral-500" />
                <span className="text-[11px] font-mono text-neutral-500 hidden sm:inline">Offline</span>
              </>
            )}
          </button>

          {/* Kolkata Time Badge */}
          <div className="hidden md:flex items-center gap-1.5 rounded-lg border border-[#1A2620] bg-[#111916] px-2.5 py-1.5 text-xs text-neutral-300">
            <Clock className="h-3.5 w-3.5 text-[#22C55E]" />
            <span className="font-mono text-[#86EFAC] font-medium">{timeState.timeString}</span>
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider">IST</span>
          </div>

          {/* Use Anywhere / Multi-Device Sync Modal trigger */}
          <button
            onClick={onOpenSyncModal}
            className="flex items-center gap-1.5 rounded-lg border border-[#22C55E]/40 bg-[#14261D] px-2.5 py-1.5 text-xs font-semibold text-[#86EFAC] hover:bg-[#1C3629] transition active:scale-95 shadow-sm"
          >
            <Share2 className="h-3.5 w-3.5 text-[#22C55E]" />
            <span className="hidden xs:inline">Sync & Share</span>
          </button>

          {/* Quick Reset Today button (subtle) */}
          {completedCount > 0 && (
            <button
              onClick={() => setShowResetConfirm(true)}
              title="Reset today's tasks"
              className="flex items-center gap-1.5 rounded-lg border border-[#1A2620] bg-[#111916] px-2.5 py-1.5 text-xs font-medium text-neutral-400 hover:text-white hover:border-[#2B3D33] transition"
            >
              <RotateCcw className="h-3.5 w-3.5 text-neutral-400" />
              <span className="hidden sm:inline">Reset Today</span>
            </button>
          )}

          {/* PWA Install Button */}
          {!isInstalled && isInstallable && (
            <button
              onClick={install}
              className="flex items-center gap-2 rounded-lg bg-[#22C55E] px-3 py-1.5 text-xs font-semibold text-[#090D0B] shadow-sm hover:bg-[#16A34A] transition active:scale-95"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Install App</span>
            </button>
          )}

          {/* iOS Safari PWA Prompt Trigger */}
          {!isInstalled && isIOS && (
            <button
              onClick={() => setShowIOSGuide(true)}
              className="flex items-center gap-1.5 rounded-lg border border-[#22C55E]/30 bg-[#22C55E]/10 px-2.5 py-1.5 text-xs font-medium text-[#86EFAC] hover:bg-[#22C55E]/20 transition"
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>Install</span>
            </button>
          )}
        </div>
      </div>

      {/* iOS Instructions Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-[#1C2822] bg-[#111916] p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-3 border-b border-[#1C2822]">
              <h3 className="text-base font-semibold text-white">Install DisciplineOS on iPhone</h3>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="text-neutral-400 hover:text-white p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-sm text-neutral-300">
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#22C55E]/20 text-xs font-bold text-[#22C55E]">
                  1
                </span>
                <p>
                  Tap the <strong className="text-white">Share</strong> button at the bottom of Safari toolbar.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#22C55E]/20 text-xs font-bold text-[#22C55E]">
                  2
                </span>
                <p>
                  Scroll down and choose <strong className="text-white">Add to Home Screen</strong>.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#22C55E]/20 text-xs font-bold text-[#22C55E]">
                  3
                </span>
                <p>Tap <strong className="text-white">Add</strong> in the top-right corner to launch DisciplineOS as a standalone native app.</p>
              </div>
            </div>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full rounded-xl bg-[#22C55E] py-2.5 text-xs font-semibold text-[#090D0B] hover:bg-[#16A34A] transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-[#1C2822] bg-[#111916] p-6 text-white shadow-2xl">
            <h3 className="text-lg font-bold text-white">Reset Today's Progress?</h3>
            <p className="mt-2 text-sm text-neutral-300">
              This will uncheck all 5 tasks for today. Historical past days are safe and will never be affected.
            </p>
            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="rounded-lg px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onResetToday();
                  setShowResetConfirm(false);
                }}
                className="rounded-lg bg-red-600/80 px-4 py-2 text-xs font-semibold text-white hover:bg-red-600 transition"
              >
                Yes, Reset Today
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

import React, { useMemo, useState } from 'react';
import { useDisciplineStore } from './hooks/useDisciplineStore';
import { useOnlineStatus } from './hooks/usePWAInstall';
import { formatKolkataDashboardDate, getMotivationalMessage } from './utils/dateUtils';
import { Header } from './components/Header';
import { CircularProgress } from './components/CircularProgress';
import { TaskCard } from './components/TaskCard';
import { ProductivityCharts } from './components/ProductivityCharts';
import { HistoryCalendar } from './components/HistoryCalendar';
import { CelebrationModal } from './components/CelebrationModal';
import { StatsBar } from './components/StatsBar';
import { NextSlotCountdown } from './components/NextSlotCountdown';
import { DeviceSyncModal } from './components/DeviceSyncModal';
import { WifiOff, Sparkles, Calendar, ArrowRight } from 'lucide-react';

export default function App() {
  const {
    currentDateKey,
    todayRecord,
    history,
    allTasks,
    stats,
    chartData,
    showCelebration,
    setShowCelebration,
    completeTask,
    undoTask,
    resetToday,
    startFreshForMe,
    restoreStarterDemoData,
    exportHistoryJson,
    importHistoryJson,
    isCleanSlate,
    triggerCelebrationEffect,
    syncStatus,
    syncUserId,
    updateSyncUserId,
    lastSyncTime,
    manualSyncNow,
  } = useDisciplineStore();

  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const isOnline = useOnlineStatus();
  const dateInfo = useMemo(() => formatKolkataDashboardDate(), []);
  const motivation = useMemo(
    () => getMotivationalMessage(todayRecord.count),
    [todayRecord.count]
  );

  return (
    <div className="min-h-screen bg-[#090D0B] text-white flex flex-col font-sans selection:bg-[#22C55E]/30 selection:text-[#86EFAC]">
      {/* Top Navigation */}
      <Header
        onResetToday={resetToday}
        completedCount={todayRecord.count}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        isCleanSlate={isCleanSlate}
        syncStatus={syncStatus}
        onManualSync={manualSyncNow}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-7">
        {/* Clean Slate Ready Banner */}
        {isCleanSlate && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-[#22C55E]/40 bg-gradient-to-r from-[#0F261B] via-[#0D1F16] to-[#0A1711] p-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#22C55E] text-[#090D0B]">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="font-bold text-white text-sm">
                  Clean Slate Ready · Day 1 Starts Tomorrow at 6:30 AM
                </p>
                <p className="text-neutral-300 text-xs">
                  Your tracker is already 100% fresh. When you wake up, just finish Morning Exercise and click YES, COMPLETED!
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsSyncModalOpen(true)}
              className="self-start sm:self-auto flex items-center gap-1.5 rounded-xl bg-[#1D3B2B] px-3 py-1.5 font-mono text-[11px] font-semibold text-[#86EFAC] hover:bg-[#244A36] transition border border-[#22C55E]/30"
            >
              <span>Install / Sync</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* Live Next Slot Countdown */}
        <NextSlotCountdown />

        {/* Top Hero Section: Date, Motivation & Ring */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Hero Card: Today's Date & Motivational Directive */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl border border-[#1C2822] bg-[#111916] p-6 sm:p-7 shadow-xl">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#22C55E]">
                  Today's Execution · Asia/Kolkata
                </span>
                <span aria-hidden="true" className="text-neutral-600">·</span>
                <span className="text-xs font-mono text-neutral-400">
                  {dateInfo.dayName}
                </span>
              </div>

              <h1 className="mt-1.5 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {dateInfo.formattedDate}
              </h1>

              {/* Motivational Banner */}
              <div className="mt-4 rounded-xl border border-[#22C55E]/20 bg-[#0B1510] p-4 text-left">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#86EFAC]">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Daily Directive</span>
                </div>
                <p className="mt-1 text-base font-bold text-white tracking-tight">
                  {motivation.headline}
                </p>
                <p className="mt-0.5 text-xs text-neutral-300">
                  {motivation.subline}
                </p>
              </div>
            </div>

            {/* Quick Micro Target Breakdown */}
            <div className="mt-6 pt-4 border-t border-[#1C2822] flex items-center justify-between text-xs font-mono text-neutral-400">
              <div className="flex items-center gap-4">
                <span>
                  <strong className="text-white">3</strong> Study Slots
                </span>
                <span className="text-neutral-600">·</span>
                <span>
                  <strong className="text-white">2</strong> Workouts
                </span>
              </div>
              <span className="text-[#22C55E] font-semibold">
                Daily Goal: 5 Activities
              </span>
            </div>
          </div>

          {/* Right Hero Card: Large Glowing Circular Progress Indicator */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center rounded-2xl border border-[#1C2822] bg-[#111916] p-6 sm:p-7 shadow-xl">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400 mb-2">
              Progress Indicator
            </span>
            <CircularProgress
              completedCount={todayRecord.count}
              totalCount={5}
              percentage={todayRecord.percentage}
            />
            {todayRecord.percentage === 100 && (
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#22C55E]/20 px-3 py-1 text-xs font-bold text-[#86EFAC] border border-[#22C55E]/40 animate-pulse">
                <span>🏆 All 5 Targets Achieved</span>
              </div>
            )}
          </div>
        </div>

        {/* 5 Daily Task Cards Section */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Daily Task Slots
              </h2>
              <p className="text-xs text-neutral-400">
                Click YES, COMPLETED upon finishing each session to lock in your victory.
              </p>
            </div>
            <div className="text-xs font-mono text-[#86EFAC]">
              {todayRecord.count} of 5 Completed ({todayRecord.percentage}%)
            </div>
          </div>

          {/* Five interactive cards */}
          <div className="space-y-3">
            {allTasks.map((task) => {
              const isCompleted = todayRecord.completedTaskIds.includes(task.id);
              return (
                <TaskCard
                  key={task.id}
                  task={task}
                  isCompleted={isCompleted}
                  onComplete={completeTask}
                  onUndo={undoTask}
                />
              );
            })}
          </div>
        </section>

        {/* Green Productivity Graphs (Recharts) */}
        <section>
          <ProductivityCharts
            chartData={chartData}
            todayPercentage={todayRecord.percentage}
            todayCount={todayRecord.count}
          />
        </section>

        {/* History & Calendar Matrix */}
        <section>
          <HistoryCalendar
            history={history}
            todayKey={currentDateKey}
          />
        </section>

        {/* Stats Summary Bar */}
        <section>
          <StatsBar stats={stats} />
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#16211B] py-6 text-center text-xs text-neutral-500 font-mono">
        <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>DisciplineOS · Built for uncompromising daily focus</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSyncModalOpen(true)}
              className="text-[#86EFAC] hover:underline"
            >
              Use on Phone / Backup
            </button>
            <span aria-hidden="true">·</span>
            <span>Asia/Kolkata Timezone</span>
          </div>
        </div>
      </footer>

      {/* Celebration Modal (when 5/5 completed) */}
      <CelebrationModal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        onReplayConfetti={triggerCelebrationEffect}
      />

      {/* Device Sync & Publishing Modal */}
      <DeviceSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        exportJson={exportHistoryJson}
        importJson={importHistoryJson}
        onStartFresh={startFreshForMe}
        onRestoreDemo={restoreStarterDemoData}
        isCleanSlate={isCleanSlate}
        syncUserId={syncUserId}
        onUpdateSyncUserId={updateSyncUserId}
        onManualSync={manualSyncNow}
        lastSyncTime={lastSyncTime}
      />

      {/* Offline Toast */}
      {!isOnline && (
        <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-[#1C2822] border border-[#22C55E]/40 px-3.5 py-2 text-xs font-medium text-white shadow-xl">
          <WifiOff className="h-4 w-4 text-amber-400" />
          <span>Offline mode active · Local storage is preserving your data</span>
        </div>
      )}
    </div>
  );
}

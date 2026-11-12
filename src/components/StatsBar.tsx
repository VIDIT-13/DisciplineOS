import React from 'react';
import { Flame, Trophy, BookOpen, Dumbbell } from 'lucide-react';
import { AppStats } from '../types';

interface StatsBarProps {
  stats: AppStats;
}

export const StatsBar: React.FC<StatsBarProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Current Streak */}
      <div className="rounded-2xl border border-[#1C2822] bg-[#111916] p-4 transition hover:border-[#2A3D32]">
        <div className="flex items-center justify-between text-neutral-400">
          <span className="text-xs font-mono uppercase tracking-wider">Active Streak</span>
          <Flame className="h-4 w-4 text-[#22C55E]" />
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">
            {stats.currentStreak}
          </span>
          <span className="text-xs font-mono text-[#86EFAC]">days</span>
        </div>
        <p className="mt-1 text-[11px] text-neutral-400">Consistent execution</p>
      </div>

      {/* Perfect 100% Days */}
      <div className="rounded-2xl border border-[#1C2822] bg-[#111916] p-4 transition hover:border-[#2A3D32]">
        <div className="flex items-center justify-between text-neutral-400">
          <span className="text-xs font-mono uppercase tracking-wider">100% Days</span>
          <Trophy className="h-4 w-4 text-[#86EFAC]" />
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">
            {stats.totalPerfectDays}
          </span>
          <span className="text-xs font-mono text-[#86EFAC]">victories</span>
        </div>
        <p className="mt-1 text-[11px] text-neutral-400">All 5 completed</p>
      </div>

      {/* Study Hours */}
      <div className="rounded-2xl border border-[#1C2822] bg-[#111916] p-4 transition hover:border-[#2A3D32]">
        <div className="flex items-center justify-between text-neutral-400">
          <span className="text-xs font-mono uppercase tracking-wider">Study Volume</span>
          <BookOpen className="h-4 w-4 text-[#22C55E]" />
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">
            {stats.totalStudyHours.toFixed(1)}
          </span>
          <span className="text-xs font-mono text-[#86EFAC]">hrs</span>
        </div>
        <p className="mt-1 text-[11px] text-neutral-400">Slots 1, 2 & 3 combined</p>
      </div>

      {/* Exercise Hours */}
      <div className="rounded-2xl border border-[#1C2822] bg-[#111916] p-4 transition hover:border-[#2A3D32]">
        <div className="flex items-center justify-between text-neutral-400">
          <span className="text-xs font-mono uppercase tracking-wider">Training</span>
          <Dumbbell className="h-4 w-4 text-[#86EFAC]" />
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">
            {stats.totalExerciseHours.toFixed(1)}
          </span>
          <span className="text-xs font-mono text-[#86EFAC]">hrs</span>
        </div>
        <p className="mt-1 text-[11px] text-neutral-400">Morning & evening workouts</p>
      </div>
    </div>
  );
};

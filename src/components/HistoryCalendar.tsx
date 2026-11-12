import React, { useState } from 'react';
import { DayRecord } from '../types';
import { DAILY_TASKS, getPercentageColor } from '../utils/dateUtils';
import { Calendar, ChevronLeft, ChevronRight, Check, X } from 'lucide-react';

interface HistoryCalendarProps {
  history: Record<string, DayRecord>;
  todayKey: string;
}

export const HistoryCalendar: React.FC<HistoryCalendarProps> = ({ history, todayKey }) => {
  // Current viewing month
  const [viewDate, setViewDate] = useState(() => {
    const [y, m] = todayKey.split('-').map(Number);
    return new Date(y, m - 1, 1);
  });

  const [selectedRecord, setSelectedRecord] = useState<DayRecord | null>(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth(); // 0-indexed

  // Month navigation
  const prevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const monthName = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(viewDate);

  // Generate days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayWeekday = new Date(year, month, 1).getDay(); // 0 is Sun

  const daysList = [];
  // Empty padding for days before the 1st
  for (let i = 0; i < firstDayWeekday; i++) {
    daysList.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const record = history[dateKey];
    daysList.push({ day, dateKey, record });
  }

  return (
    <div className="rounded-2xl border border-[#1C2822] bg-[#111916] p-5 sm:p-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#1A2620]">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#18261F] text-[#22C55E] border border-[#22C55E]/20">
            <Calendar className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
              Discipline History Calendar
            </h2>
            <p className="text-xs text-neutral-400">Archived daily completions & consistency</p>
          </div>
        </div>

        {/* Month Pager */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs sm:text-sm font-semibold text-neutral-200">
            {monthName}
          </span>
          <div className="flex items-center gap-1 rounded-lg bg-[#0B120E] p-1 border border-[#1C2822]">
            <button
              onClick={prevMonth}
              className="p-1 rounded text-neutral-400 hover:text-white hover:bg-[#18261F] transition"
              aria-label="Previous Month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1 rounded text-neutral-400 hover:text-white hover:bg-[#18261F] transition"
              aria-label="Next Month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="mt-4 grid grid-cols-7 gap-2 text-center text-[11px] font-mono font-medium text-neutral-500 uppercase tracking-wider">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>

      {/* Days Grid */}
      <div className="mt-2 grid grid-cols-7 gap-2">
        {daysList.map((item, index) => {
          if (!item) {
            return <div key={`empty-${index}`} className="h-12 rounded-xl bg-transparent" />;
          }

          const { day, dateKey, record } = item;
          const isToday = dateKey === todayKey;
          const percentage = record ? record.percentage : 0;
          const count = record ? record.count : 0;
          const style = getPercentageColor(percentage);

          // Future check (past current today date)
          const isFuture = dateKey > todayKey;

          return (
            <button
              key={dateKey}
              onClick={() => {
                if (record) {
                  setSelectedRecord(record);
                } else if (!isFuture) {
                  setSelectedRecord({
                    date: dateKey,
                    dayOfWeek: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(
                      new Date(year, month, day)
                    ),
                    completedTaskIds: [],
                    count: 0,
                    percentage: 0,
                    studyHours: 0,
                    exerciseHours: 0,
                    updatedAt: '',
                  });
                }
              }}
              disabled={isFuture}
              className={`group relative flex h-12 flex-col items-center justify-between rounded-xl p-1.5 transition-all ${
                isFuture
                  ? 'opacity-20 cursor-not-allowed bg-[#0B120E] border border-transparent'
                  : 'hover:scale-105 cursor-pointer'
              } ${isToday ? 'ring-2 ring-[#22C55E] ring-offset-2 ring-offset-[#111916]' : ''}`}
              style={{
                backgroundColor: isFuture ? '#0B120E' : style.hex,
              }}
            >
              {/* Day Number */}
              <span
                className={`text-[11px] font-bold font-mono ${
                  percentage >= 60
                    ? 'text-white'
                    : percentage >= 20
                    ? 'text-[#090D0B]'
                    : 'text-neutral-400'
                }`}
              >
                {day}
              </span>

              {/* Progress tag */}
              {!isFuture && (
                <span
                  className={`text-[9px] font-mono font-extrabold ${
                    percentage >= 60
                      ? 'text-white/90'
                      : percentage >= 20
                      ? 'text-[#090D0B]'
                      : 'text-neutral-500'
                  }`}
                >
                  {count > 0 ? `${count}/5` : '0%'}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend with exact specified green shades */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#1A2620] text-xs">
        <span className="text-neutral-400 font-mono text-[11px]">Shades:</span>
        <div className="flex flex-wrap items-center gap-3 font-mono text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-[#22C55E]" />
            <span className="text-neutral-300">100% (Bright Emerald)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-[#16A34A]" />
            <span className="text-neutral-300">60–80% (Medium Green)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-[#86EFAC]" />
            <span className="text-neutral-300">20–40% (Light Green)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-[#27272A]" />
            <span className="text-neutral-400">0% (Grey)</span>
          </div>
        </div>
      </div>

      {/* Day Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#1C2822] bg-[#111916] p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1C2822] pb-3">
              <div>
                <span className="text-xs font-mono text-[#22C55E] uppercase tracking-wider">
                  Day Archive
                </span>
                <h3 className="text-lg font-bold text-white">
                  {new Intl.DateTimeFormat('en-US', {
                    dateStyle: 'full',
                  }).format(
                    new Date(
                      Number(selectedRecord.date.split('-')[0]),
                      Number(selectedRecord.date.split('-')[1]) - 1,
                      Number(selectedRecord.date.split('-')[2])
                    )
                  )}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="rounded-lg p-1 text-neutral-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Completion summary */}
            <div className="my-4 flex items-center justify-between rounded-xl bg-[#090D0B] p-4 border border-[#1C2822]">
              <div>
                <span className="text-xs text-neutral-400">Total Completion</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl font-extrabold text-[#22C55E] font-mono">
                    {selectedRecord.percentage}%
                  </span>
                  <span className="text-sm font-mono text-neutral-400">
                    ({selectedRecord.count} of 5 activities)
                  </span>
                </div>
              </div>
              <div className="text-right text-xs space-y-1 font-mono text-neutral-400">
                <div>Study: <strong className="text-white">{selectedRecord.studyHours}h</strong></div>
                <div>Exercise: <strong className="text-white">{selectedRecord.exerciseHours}h</strong></div>
              </div>
            </div>

            {/* Task Checklist breakdown for that day */}
            <div className="space-y-2 mt-2">
              <span className="text-xs font-mono uppercase text-neutral-400">Target Breakdown</span>
              {DAILY_TASKS.map((task) => {
                const completed = selectedRecord.completedTaskIds.includes(task.id);
                return (
                  <div
                    key={task.id}
                    className={`flex items-center justify-between rounded-xl p-3 text-xs transition ${
                      completed
                        ? 'bg-[#122B1E] border border-[#22C55E]/30 text-white'
                        : 'bg-[#0B120E] border border-[#1C2822] text-neutral-500'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full ${
                          completed ? 'bg-[#22C55E] text-[#090D0B]' : 'bg-[#1C2822] text-neutral-600'
                        }`}
                      >
                        {completed ? <Check className="h-3 w-3 stroke-[3]" /> : '·'}
                      </div>
                      <span className={`font-semibold ${completed ? 'text-white' : 'text-neutral-400'}`}>
                        {task.name}
                      </span>
                    </div>
                    <span className="font-mono text-neutral-400">{task.duration}</span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setSelectedRecord(null)}
              className="mt-5 w-full rounded-xl bg-[#1C2E24] py-2.5 text-xs font-semibold text-[#86EFAC] hover:bg-[#253D30] transition border border-[#22C55E]/30"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

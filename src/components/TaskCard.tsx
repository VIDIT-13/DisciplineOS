import React from 'react';
import { TaskDefinition } from '../types';
import { Check, Clock, Hourglass, RotateCcw, BookOpen, Dumbbell } from 'lucide-react';

interface TaskCardProps {
  task: TaskDefinition;
  isCompleted: boolean;
  onComplete: (taskId: string) => void;
  onUndo: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  isCompleted,
  onComplete,
  onUndo,
}) => {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl p-5 sm:p-6 transition-all duration-300 ${
        isCompleted
          ? 'bg-gradient-to-br from-[#064E3B] via-[#065F46] to-[#047857] border border-[#10B981] shadow-[0_0_30px_rgba(16,185,129,0.25)] text-white'
          : 'bg-[#111916] border border-[#1C2822] hover:border-[#2C3E34] text-white'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Section: Info */}
        <div className="flex items-start gap-3.5">
          {/* Category Icon */}
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
              isCompleted
                ? 'bg-white/20 text-white shadow-inner'
                : 'bg-[#18241F] text-[#22C55E] border border-[#22C55E]/20'
            }`}
          >
            {isCompleted ? (
              <Check className="h-6 w-6 stroke-[2.8]" />
            ) : task.category === 'study' ? (
              <BookOpen className="h-5 w-5 stroke-[2.2]" />
            ) : (
              <Dumbbell className="h-5 w-5 stroke-[2.2]" />
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-mono font-medium tracking-wider uppercase ${
                  isCompleted ? 'text-[#A7F3D0]' : 'text-[#22C55E]'
                }`}
              >
                Slot {task.order} · {task.category === 'study' ? 'Deep Study' : 'Physical Training'}
              </span>
            </div>

            <h3 className="mt-0.5 text-lg font-bold tracking-tight text-white">
              {task.name}
            </h3>

            {/* Schedule & Duration unboxed metadata with dot separators */}
            <div
              className={`mt-1.5 flex flex-wrap items-center gap-2 text-xs ${
                isCompleted ? 'text-white/85' : 'text-neutral-400'
              }`}
            >
              <span className="flex items-center gap-1 font-mono">
                <Clock className="h-3.5 w-3.5 opacity-75" />
                {task.scheduledTime}
              </span>
              <span aria-hidden="true" className="opacity-40">·</span>
              <span className="flex items-center gap-1 font-mono">
                <Hourglass className="h-3.5 w-3.5 opacity-75" />
                {task.duration}
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Action Button */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          {isCompleted ? (
            <div className="flex items-center gap-2">
              {/* Completed Badge Indicator */}
              <div className="flex items-center gap-1.5 rounded-xl bg-white/20 px-3.5 py-2 text-xs font-bold tracking-wide text-white shadow-sm border border-white/25">
                <Check className="h-4 w-4 stroke-[3]" />
                <span>COMPLETED</span>
              </div>

              {/* Undo Button */}
              <button
                onClick={() => onUndo(task.id)}
                title="Undo completion"
                className="flex h-9 items-center gap-1 rounded-xl bg-black/20 hover:bg-black/40 px-2.5 text-xs font-medium text-white/80 hover:text-white transition active:scale-95 border border-white/10"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden xs:inline">Undo</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => onComplete(task.id)}
              className="group/btn relative flex items-center justify-center gap-2 rounded-xl border-2 border-[#22C55E] bg-transparent px-5 py-2.5 text-xs font-bold tracking-wider uppercase text-[#22C55E] transition-all duration-200 hover:bg-[#22C55E] hover:text-[#090D0B] hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] active:scale-95"
            >
              <span>YES, COMPLETED</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

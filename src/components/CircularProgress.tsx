import React from 'react';

interface CircularProgressProps {
  completedCount: number;
  totalCount: number;
  percentage: number;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  completedCount,
  totalCount,
  percentage,
}) => {
  const size = 220;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const isComplete = percentage === 100;

  return (
    <div className="relative flex flex-col items-center justify-center p-2">
      {/* Outer ambient glow when active */}
      <div
        className={`absolute h-48 w-48 rounded-full blur-3xl transition-opacity duration-700 pointer-events-none ${
          isComplete
            ? 'bg-[#22C55E]/30 opacity-100 scale-110'
            : percentage > 0
            ? 'bg-[#22C55E]/15 opacity-70'
            : 'bg-transparent opacity-0'
        }`}
      />

      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="rotate-[-90deg] overflow-visible"
        >
          <defs>
            {/* Linear gradient along ring for Apple Fitness style */}
            <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#22C55E" />
              <stop offset="100%" stopColor="#86EFAC" />
            </linearGradient>

            <filter id="emeraldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#22C55E" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#15211B"
            strokeWidth={strokeWidth}
            className="transition-colors duration-300"
          />

          {/* Notch tick marks for 5 intervals (0%, 20%, 40%, 60%, 80%) */}
          {[0, 1, 2, 3, 4].map((i) => {
            const angle = (i * 72 * Math.PI) / 180;
            const x = size / 2 + (radius) * Math.cos(angle);
            const y = size / 2 + (radius) * Math.sin(angle);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={2}
                fill="#27382F"
                className="transition-colors duration-300"
              />
            );
          })}

          {/* Animated active progress ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="url(#emeraldGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            filter={percentage > 0 ? 'url(#emeraldGlow)' : undefined}
            style={{
              transition: 'stroke-dashoffset 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
          <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white font-mono tabular-nums">
            {percentage}%
          </span>
          <span className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#86EFAC]/80">
            {completedCount} of {totalCount} Done
          </span>
          <span className="text-[10px] text-neutral-400 font-mono mt-0.5">
            {totalCount - completedCount > 0
              ? `${totalCount - completedCount} remaining`
              : 'Target Achieved'}
          </span>
        </div>
      </div>

      {/* Five visual progress segment indicators below circle */}
      <div className="mt-4 flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((slot) => {
          const isDone = slot <= completedCount;
          return (
            <div
              key={slot}
              title={`Target ${slot} (${slot * 20}%)`}
              className={`h-1.5 w-6 sm:w-8 rounded-full transition-all duration-500 ${
                isDone
                  ? 'bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.6)]'
                  : 'bg-[#1A2620]'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};

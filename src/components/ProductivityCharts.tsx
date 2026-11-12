import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, BarChart2 } from 'lucide-react';

interface ChartDataItem {
  dateKey: string;
  displayDate: string;
  weekday: string;
  percentage: number;
  count: number;
  target: number;
  studyHours: number;
  exerciseHours: number;
  isToday: boolean;
}

interface ProductivityChartsProps {
  chartData: ChartDataItem[];
  todayPercentage: number;
  todayCount: number;
}

type TimeFrame = '7d' | '14d' | '30d';

export const ProductivityCharts: React.FC<ProductivityChartsProps> = ({
  chartData,
  todayPercentage,
  todayCount,
}) => {
  const [timeframe, setTimeframe] = useState<TimeFrame>('7d');
  const [activeTab, setActiveTab] = useState<'trend' | 'breakdown'>('trend');

  // Slice data based on timeframe
  const filteredTrendData = React.useMemo(() => {
    const count = timeframe === '7d' ? 7 : timeframe === '14d' ? 14 : 30;
    return chartData.slice(-count);
  }, [chartData, timeframe]);

  // Last 7 days specifically for the weekly activities bar chart
  const weeklyData = React.useMemo(() => {
    return chartData.slice(-7);
  }, [chartData]);

  // Calculate average percentage for current timeframe
  const avgPercentage = React.useMemo(() => {
    if (filteredTrendData.length === 0) return 0;
    const sum = filteredTrendData.reduce((acc, curr) => acc + curr.percentage, 0);
    return Math.round(sum / filteredTrendData.length);
  }, [filteredTrendData]);

  return (
    <div className="rounded-2xl border border-[#1C2822] bg-[#111916] p-5 sm:p-6 shadow-xl">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#1A2620]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#22C55E]">
              Analytics & Trends
            </span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span className="text-xs font-mono text-neutral-400">
              Avg {avgPercentage}%
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2 mt-0.5">
            {activeTab === 'trend' ? 'Productivity Trajectory' : 'Weekly Activity Breakdown'}
          </h2>
        </div>

        {/* View toggles & Timeframe pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Chart Type Selector */}
          <div className="flex items-center rounded-xl bg-[#0B120E] p-1 border border-[#1C2822]">
            <button
              onClick={() => setActiveTab('trend')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeTab === 'trend'
                  ? 'bg-[#22C55E] text-[#090D0B] shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Completion %</span>
            </button>
            <button
              onClick={() => setActiveTab('breakdown')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeTab === 'breakdown'
                  ? 'bg-[#22C55E] text-[#090D0B] shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <BarChart2 className="h-3.5 w-3.5" />
              <span>Weekly Count</span>
            </button>
          </div>

          {/* Timeframe selector (only for trend chart) */}
          {activeTab === 'trend' && (
            <div className="flex items-center rounded-xl bg-[#0B120E] p-1 border border-[#1C2822]">
              {(['7d', '14d', '30d'] as TimeFrame[]).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2.5 py-1 text-xs font-mono font-medium rounded-lg transition ${
                    timeframe === tf
                      ? 'bg-[#1C2E24] text-[#86EFAC] border border-[#22C55E]/30'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  {tf === '7d' ? '7 Days' : tf === '14d' ? '14 Days' : '30 Days'}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Real-time Indicator banner */}
      <div className="my-3 flex items-center justify-between text-xs text-neutral-400 px-1 font-mono">
        <div className="flex items-center gap-2">
          <span className="text-[#86EFAC] font-semibold">Today:</span>
          <span className="text-white font-bold">{todayPercentage}%</span>
          <span className="text-neutral-500">({todayCount}/5 targets completed)</span>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
            <span>Target Line (100%)</span>
          </span>
        </div>
      </div>

      {/* Main Chart Canvas */}
      <div className="mt-2 h-[260px] w-full">
        {activeTab === 'trend' ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={filteredTrendData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="emeraldGradientArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22C55E" stopOpacity={0.45} />
                  <stop offset="70%" stopColor="#22C55E" stopOpacity={0.08} />
                  <stop offset="100%" stopColor="#22C55E" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1A2820"
                vertical={false}
              />

              <XAxis
                dataKey="displayDate"
                stroke="#52525B"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#1C2822' }}
              />

              <YAxis
                domain={[0, 100]}
                ticks={[0, 20, 40, 60, 80, 100]}
                unit="%"
                stroke="#52525B"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#1C2822' }}
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as ChartDataItem;
                    return (
                      <div className="rounded-xl border border-[#22C55E]/40 bg-[#0E1713] p-3 text-xs shadow-2xl backdrop-blur-md">
                        <div className="flex items-center justify-between gap-3 border-b border-[#1C2822] pb-1.5">
                          <span className="font-semibold text-white">
                            {data.displayDate} ({data.weekday})
                          </span>
                          {data.isToday && (
                            <span className="rounded bg-[#22C55E]/20 px-1.5 py-0.5 text-[10px] font-bold text-[#22C55E]">
                              TODAY
                            </span>
                          )}
                        </div>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-neutral-400">Completion:</span>
                            <span className="font-mono font-bold text-[#22C55E] text-sm">
                              {data.percentage}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-neutral-400">Targets:</span>
                            <span className="font-mono text-white">
                              {data.count} / 5 completed
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4 pt-1 text-[11px] text-neutral-400 border-t border-[#1C2822]/60">
                            <span>Study: {data.studyHours}h</span>
                            <span>Exercise: {data.exerciseHours}h</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Area
                type="monotone"
                dataKey="percentage"
                stroke="#22C55E"
                strokeWidth={3}
                fill="url(#emeraldGradientArea)"
                isAnimationActive={true}
                activeDot={{
                  r: 6,
                  fill: '#86EFAC',
                  stroke: '#22C55E',
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weeklyData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1A2820"
                vertical={false}
              />

              <XAxis
                dataKey="weekday"
                stroke="#52525B"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#1C2822' }}
              />

              <YAxis
                domain={[0, 5]}
                ticks={[0, 1, 2, 3, 4, 5]}
                stroke="#52525B"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#1C2822' }}
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as ChartDataItem;
                    return (
                      <div className="rounded-xl border border-[#22C55E]/40 bg-[#0E1713] p-3 text-xs shadow-2xl">
                        <div className="flex items-center justify-between gap-3 border-b border-[#1C2822] pb-1">
                          <span className="font-semibold text-white">
                            {data.displayDate} ({data.weekday})
                          </span>
                          {data.isToday && (
                            <span className="rounded bg-[#22C55E]/20 px-1.5 py-0.5 text-[10px] font-bold text-[#22C55E]">
                              TODAY
                            </span>
                          )}
                        </div>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-neutral-400">Completed:</span>
                            <span className="font-mono font-bold text-[#22C55E]">
                              {data.count} of 5 activities
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-neutral-400">Daily rate:</span>
                            <span className="font-mono text-white">{data.percentage}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Bar
                dataKey="count"
                fill="#22C55E"
                radius={[6, 6, 0, 0]}
                isAnimationActive={true}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

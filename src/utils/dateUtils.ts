import { DayRecord, TaskDefinition } from '../types';

export const DAILY_TASKS: TaskDefinition[] = [
  {
    id: 'morning-exercise',
    name: 'Morning Exercise',
    scheduledTime: '6:30 AM to 7:30 AM',
    duration: '1 Hour',
    durationHours: 1,
    category: 'exercise',
    order: 1,
  },
  {
    id: 'study-slot-1',
    name: 'Study Slot 1',
    scheduledTime: '8:30 AM to 10:30 AM',
    duration: '2 Hours',
    durationHours: 2,
    category: 'study',
    order: 2,
  },
  {
    id: 'study-slot-2',
    name: 'Study Slot 2',
    scheduledTime: '11:00 AM to 12:30 PM',
    duration: '1.5 Hours',
    durationHours: 1.5,
    category: 'study',
    order: 3,
  },
  {
    id: 'study-slot-3',
    name: 'Study Slot 3',
    scheduledTime: '2:00 PM to 3:30 PM',
    duration: '1.5 Hours',
    durationHours: 1.5,
    category: 'study',
    order: 4,
  },
  {
    id: 'evening-exercise',
    name: 'Evening Exercise',
    scheduledTime: '5:00 PM to 6:00 PM',
    duration: '1 Hour',
    durationHours: 1,
    category: 'exercise',
    order: 5,
  },
];

export const TOTAL_DAILY_TASKS = 5;

/**
 * Get current date key 'YYYY-MM-DD' in Asia/Kolkata timezone
 */
export function getKolkataDateString(date: Date = new Date()): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(date); // returns YYYY-MM-DD
  } catch {
    // Fallback if Intl timeZone is not supported
    const offset = 5.5 * 60 * 60 * 1000;
    const kolkataTime = new Date(date.getTime() + offset);
    return kolkataTime.toISOString().split('T')[0];
  }
}

/**
 * Format current date for dashboard display in Asia/Kolkata timezone
 */
export function formatKolkataDashboardDate(date: Date = new Date()): {
  formattedDate: string;
  dayName: string;
  timeString: string;
} {
  const optionsDate: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Kolkata',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  };
  const optionsDay: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
  };
  const optionsTime: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  };

  const dayName = new Intl.DateTimeFormat('en-US', optionsDay).format(date);
  const formattedDate = new Intl.DateTimeFormat('en-US', optionsDate).format(date);
  const timeString = new Intl.DateTimeFormat('en-US', optionsTime).format(date);

  return { formattedDate, dayName, timeString };
}

/**
 * Format date key 'YYYY-MM-DD' into readable label e.g. 'Nov 10'
 */
export function formatShortDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
}

/**
 * Format date key 'YYYY-MM-DD' into weekday e.g. 'Wed'
 */
export function formatWeekday(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
}

/**
 * Calculate study hours and exercise hours for a given completed task list
 */
export function calculateHours(completedTaskIds: string[]): {
  studyHours: number;
  exerciseHours: number;
} {
  let studyHours = 0;
  let exerciseHours = 0;

  for (const taskId of completedTaskIds) {
    const task = DAILY_TASKS.find((t) => t.id === taskId);
    if (task) {
      if (task.category === 'study') {
        studyHours += task.durationHours;
      } else if (task.category === 'exercise') {
        exerciseHours += task.durationHours;
      }
    }
  }

  return { studyHours, exerciseHours };
}

/**
 * Return motivation quote based on progress count
 */
export function getMotivationalMessage(count: number): {
  headline: string;
  subline: string;
} {
  switch (count) {
    case 0:
      return {
        headline: 'Clean slate. Execute with precision.',
        subline: 'Five targets ahead. Start with your morning routine.',
      };
    case 1:
      return {
        headline: 'First target secured. Momentum begins.',
        subline: 'The barrier is broken. Carry this discipline into your next slot.',
      };
    case 2:
      return {
        headline: 'Two locked in. Building unstoppable rhythm.',
        subline: 'Halfway to perfection. Eliminate friction and press forward.',
      };
    case 3:
      return {
        headline: 'Over the crest. 60% discipline achieved.',
        subline: 'Only 2 targets remain. Protect the standard you set.',
      };
    case 4:
      return {
        headline: 'One final target. Close the loop.',
        subline: 'Almost at total victory. Finish strong.',
      };
    case 5:
    default:
      return {
        headline: 'ALL TARGETS COMPLETED. YOU WON TODAY!',
        subline: 'Unbreakable consistency. You executed every single commitment.',
      };
  }
}

/**
 * Get color code for completion percentage per specifications:
 * - 100%: Bright emerald
 * - 60–80%: Medium green
 * - 20–40%: Light green
 * - 0%: Grey
 */
export function getPercentageColor(percentage: number): {
  bg: string;
  border: string;
  text: string;
  hex: string;
  label: string;
} {
  if (percentage >= 100) {
    return {
      bg: 'bg-[#22C55E]',
      border: 'border-[#4ADE80]',
      text: 'text-[#22C55E]',
      hex: '#22C55E',
      label: '100% Completed',
    };
  }
  if (percentage >= 60) {
    return {
      bg: 'bg-[#16A34A]',
      border: 'border-[#22C55E]',
      text: 'text-[#16A34A]',
      hex: '#16A34A',
      label: `${percentage}% Completed`,
    };
  }
  if (percentage >= 20) {
    return {
      bg: 'bg-[#86EFAC]',
      border: 'border-[#86EFAC]',
      text: 'text-[#86EFAC]',
      hex: '#86EFAC',
      label: `${percentage}% Completed`,
    };
  }
  return {
    bg: 'bg-[#27272A]',
    border: 'border-[#3F3F46]',
    text: 'text-[#71717A]',
    hex: '#27272A',
    label: '0% Completed',
  };
}

/**
 * Generate authentic starter history for the last 14 days if user has no past data,
 * so the Recharts graph and calendar immediately look like a real active discipline journey.
 */
export function generateStarterHistory(todayKey: string): Record<string, DayRecord> {
  const records: Record<string, DayRecord> = {};
  const [currYear, currMonth, currDay] = todayKey.split('-').map(Number);
  const anchorDate = new Date(currYear, currMonth - 1, currDay);

  // Realistic completion counts for past 14 days (ending yesterday)
  // e.g. [4, 5, 5, 3, 5, 4, 5, 4, 3, 5, 5, 4, 5, 4]
  const pattern = [4, 5, 5, 3, 5, 4, 5, 4, 3, 5, 5, 4, 5, 4];

  for (let i = pattern.length; i >= 1; i--) {
    const d = new Date(anchorDate);
    d.setDate(anchorDate.getDate() - i);
    const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate()
    ).padStart(2, '0')}`;
    const count = pattern[pattern.length - i];
    const completedTaskIds = DAILY_TASKS.slice(0, count).map((t) => t.id);
    const { studyHours, exerciseHours } = calculateHours(completedTaskIds);
    const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(d);

    records[dateKey] = {
      date: dateKey,
      dayOfWeek: weekday,
      completedTaskIds,
      count,
      percentage: count * 20,
      studyHours,
      exerciseHours,
      updatedAt: d.toISOString(),
    };
  }

  return records;
}

/**
 * Returns current hour and minute in Asia/Kolkata timezone
 */
export function getKolkataTimeComponents(now: Date = new Date()): {
  hours: number;
  minutes: number;
  totalMinutes: number;
} {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    });
    const parts = formatter.formatToParts(now);
    const hours = Number(parts.find((p) => p.type === 'hour')?.value ?? 0);
    const minutes = Number(parts.find((p) => p.type === 'minute')?.value ?? 0);
    return { hours, minutes, totalMinutes: hours * 60 + minutes };
  } catch {
    const offset = 5.5 * 60 * 60 * 1000;
    const kolkata = new Date(now.getTime() + offset);
    const hours = kolkata.getUTCHours();
    const minutes = kolkata.getUTCMinutes();
    return { hours, minutes, totalMinutes: hours * 60 + minutes };
  }
}

/**
 * Find the next upcoming discipline slot and calculate remaining time in Asia/Kolkata
 */
export function getNextScheduledSlot(): {
  slotName: string;
  timeLabel: string;
  isTomorrow: boolean;
  startsInText: string;
} {
  const { totalMinutes } = getKolkataTimeComponents();

  // Slots in minutes from midnight:
  // 1. Morning Exercise: 6:30 AM = 390
  // 2. Study Slot 1: 8:30 AM = 510
  // 3. Study Slot 2: 11:00 AM = 660
  // 4. Study Slot 3: 2:00 PM = 840
  // 5. Evening Exercise: 5:00 PM = 1020

  const schedule = [
    { name: 'Morning Exercise', timeLabel: '6:30 AM', startMin: 390 },
    { name: 'Study Slot 1', timeLabel: '8:30 AM', startMin: 510 },
    { name: 'Study Slot 2', timeLabel: '11:00 AM', startMin: 660 },
    { name: 'Study Slot 3', timeLabel: '2:00 PM', startMin: 840 },
    { name: 'Evening Exercise', timeLabel: '5:00 PM', startMin: 1020 },
  ];

  for (const slot of schedule) {
    if (totalMinutes < slot.startMin) {
      const diff = slot.startMin - totalMinutes;
      const h = Math.floor(diff / 60);
      const m = diff % 60;
      return {
        slotName: slot.name,
        timeLabel: slot.timeLabel,
        isTomorrow: false,
        startsInText: h > 0 ? `${h}h ${m}m` : `${m}m`,
      };
    }
  }

  // If after 5:00 PM (1020), next slot is Tomorrow Morning Exercise at 6:30 AM
  const minutesUntilMidnight = 1440 - totalMinutes;
  const totalDiff = minutesUntilMidnight + 390;
  const h = Math.floor(totalDiff / 60);
  const m = totalDiff % 60;

  return {
    slotName: 'Morning Exercise (Slot 1)',
    timeLabel: 'Tomorrow at 6:30 AM IST',
    isTomorrow: true,
    startsInText: `${h}h ${m}m`,
  };
}

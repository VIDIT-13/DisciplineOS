import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { DayRecord, AppStats } from '../types';
import {
  DAILY_TASKS,
  TOTAL_DAILY_TASKS,
  getKolkataDateString,
  calculateHours,
  generateStarterHistory,
} from '../utils/dateUtils';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'discipline_os_history_v2';
const SYNC_USER_KEY = 'discipline_os_sync_user_v1';
const DEFAULT_USER_ID = 'viditallen4';

export function useDisciplineStore() {
  const [currentDateKey, setCurrentDateKey] = useState<string>(() => getKolkataDateString());
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());

  // Determine user sync ID from URL param (?user=...) or localStorage or default 'viditallen4'
  const [syncUserId, setSyncUserId] = useState<string>(() => {
    try {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const urlUser = urlParams.get('user');
        if (urlUser && urlUser.trim()) {
          const cleanUser = urlUser.trim().toLowerCase();
          localStorage.setItem(SYNC_USER_KEY, cleanUser);
          return cleanUser;
        }
        const storedUser = localStorage.getItem(SYNC_USER_KEY);
        if (storedUser && storedUser.trim()) {
          return storedUser.trim().toLowerCase();
        }
      }
    } catch {}
    return DEFAULT_USER_ID;
  });

  const [history, setHistory] = useState<Record<string, DayRecord>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      return {};
    } catch {
      return {};
    }
  });

  const [showCelebration, setShowCelebration] = useState(false);
  const isSyncingRef = useRef(false);

  // Synchronize with LocalStorage
  const saveHistory = useCallback((newHistory: Record<string, DayRecord>) => {
    setHistory(newHistory);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, []);

  // Sync with Cloud Backend
  const syncWithServer = useCallback(
    async (historyToPush?: Record<string, DayRecord>) => {
      if (isSyncingRef.current) return;
      isSyncingRef.current = true;
      setSyncStatus('syncing');

      try {
        if (historyToPush) {
          // Push local state to server
          const res = await fetch('/api/discipline', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: syncUserId, records: historyToPush }),
          });
          if (res.ok) {
            const data = await res.json();
            if (data.records) {
              saveHistory(data.records);
            }
            setSyncStatus('synced');
            setLastSyncTime(new Date());
          }
        } else {
          // Pull from server and merge
          const res = await fetch(`/api/discipline?user=${encodeURIComponent(syncUserId)}`);
          if (res.ok) {
            const data = await res.json();
            const serverRecords: Record<string, DayRecord> = data.records || {};

            // Get current local records from localStorage to avoid stale closure
            let localRecords: Record<string, DayRecord> = {};
            try {
              const stored = localStorage.getItem(STORAGE_KEY);
              if (stored) localRecords = JSON.parse(stored);
            } catch {}

            // 2-Way Merge
            let hasDifferences = false;
            let needsPushToServer = false;
            const merged: Record<string, DayRecord> = { ...serverRecords };

            for (const dateKey of Object.keys(localRecords)) {
              const localRec = localRecords[dateKey];
              const servRec = merged[dateKey];

              if (!servRec) {
                merged[dateKey] = localRec;
                needsPushToServer = true;
                hasDifferences = true;
              } else {
                const localCount = localRec.count ?? (localRec.completedTaskIds?.length || 0);
                const servCount = servRec.count ?? (servRec.completedTaskIds?.length || 0);

                if (localCount > servCount) {
                  merged[dateKey] = localRec;
                  needsPushToServer = true;
                  hasDifferences = true;
                } else if (servCount > localCount) {
                  hasDifferences = true;
                }
              }
            }

            if (Object.keys(serverRecords).length !== Object.keys(localRecords).length) {
              hasDifferences = true;
            }

            if (hasDifferences) {
              saveHistory(merged);
            }

            if (needsPushToServer) {
              // Push local advances back to server
              await fetch('/api/discipline', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user: syncUserId, records: merged }),
              });
            }

            setSyncStatus('synced');
            setLastSyncTime(new Date());
          }
        }
      } catch (err) {
        console.warn('Sync server offline or unavailable:', err);
        setSyncStatus('offline');
      } finally {
        isSyncingRef.current = false;
      }
    },
    [syncUserId, saveHistory]
  );

  // Initial cloud sync on mount and auto-refresh on focus
  useEffect(() => {
    syncWithServer();

    const handleFocusOrVisible = () => {
      syncWithServer();
    };

    const interval = setInterval(() => {
      syncWithServer();
    }, 15000); // sync every 15 seconds in background

    window.addEventListener('focus', handleFocusOrVisible);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) handleFocusOrVisible();
    });

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocusOrVisible);
    };
  }, [syncWithServer]);

  // Check date rollover every 10 seconds or on tab focus
  useEffect(() => {
    const checkRollover = () => {
      const newKey = getKolkataDateString();
      if (newKey !== currentDateKey) {
        setCurrentDateKey(newKey);
      }
    };

    const interval = setInterval(checkRollover, 10000);
    window.addEventListener('focus', checkRollover);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) checkRollover();
    });

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', checkRollover);
    };
  }, [currentDateKey]);

  // Today's record (always guaranteed to exist)
  const todayRecord: DayRecord = useMemo(() => {
    const existing = history[currentDateKey];
    if (existing) return existing;

    const [year, month, day] = currentDateKey.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(dateObj);

    return {
      date: currentDateKey,
      dayOfWeek: weekday,
      completedTaskIds: [],
      count: 0,
      percentage: 0,
      studyHours: 0,
      exerciseHours: 0,
      updatedAt: new Date().toISOString(),
    };
  }, [history, currentDateKey]);

  // Fire confetti celebration
  const triggerCelebrationEffect = useCallback(() => {
    setShowCelebration(true);
    try {
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
        colors: ['#22C55E', '#86EFAC', '#10B981', '#34D399', '#FFFFFF'],
      };

      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      };

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });
      fire(0.2, {
        spread: 60,
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    } catch {
      // safe fallback
    }
  }, []);

  // Complete a task
  const completeTask = useCallback(
    (taskId: string) => {
      const currentCompleted = todayRecord.completedTaskIds;
      if (currentCompleted.includes(taskId)) return; // Already completed

      const newCompleted = [...currentCompleted, taskId];
      const count = newCompleted.length;
      const percentage = (count / TOTAL_DAILY_TASKS) * 100;
      const { studyHours, exerciseHours } = calculateHours(newCompleted);

      const [year, month, day] = currentDateKey.split('-').map(Number);
      const dateObj = new Date(year, month - 1, day);
      const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(dateObj);

      const updatedRecord: DayRecord = {
        date: currentDateKey,
        dayOfWeek: weekday,
        completedTaskIds: newCompleted,
        count,
        percentage,
        studyHours,
        exerciseHours,
        updatedAt: new Date().toISOString(),
      };

      const updatedHistory = {
        ...history,
        [currentDateKey]: updatedRecord,
      };

      saveHistory(updatedHistory);
      syncWithServer(updatedHistory);

      // Trigger celebration if all 5 completed
      if (count === TOTAL_DAILY_TASKS) {
        triggerCelebrationEffect();
      }
    },
    [todayRecord, currentDateKey, history, saveHistory, syncWithServer, triggerCelebrationEffect]
  );

  // Undo task completion
  const undoTask = useCallback(
    (taskId: string) => {
      const currentCompleted = todayRecord.completedTaskIds;
      if (!currentCompleted.includes(taskId)) return;

      const newCompleted = currentCompleted.filter((id) => id !== taskId);
      const count = newCompleted.length;
      const percentage = (count / TOTAL_DAILY_TASKS) * 100;
      const { studyHours, exerciseHours } = calculateHours(newCompleted);

      const [year, month, day] = currentDateKey.split('-').map(Number);
      const dateObj = new Date(year, month - 1, day);
      const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(dateObj);

      const updatedRecord: DayRecord = {
        date: currentDateKey,
        dayOfWeek: weekday,
        completedTaskIds: newCompleted,
        count,
        percentage,
        studyHours,
        exerciseHours,
        updatedAt: new Date().toISOString(),
      };

      const updatedHistory = {
        ...history,
        [currentDateKey]: updatedRecord,
      };

      saveHistory(updatedHistory);
      syncWithServer(updatedHistory);
    },
    [todayRecord, currentDateKey, history, saveHistory, syncWithServer]
  );

  // Reset today only (clean test / retry)
  const resetToday = useCallback(() => {
    const updatedHistory = { ...history };
    delete updatedHistory[currentDateKey];
    saveHistory(updatedHistory);
    syncWithServer(updatedHistory);
  }, [history, currentDateKey, saveHistory, syncWithServer]);

  // Start 100% clean slate for personal use
  const startFreshForMe = useCallback(() => {
    const cleanHistory: Record<string, DayRecord> = {};
    saveHistory(cleanHistory);
    syncWithServer(cleanHistory);
    try {
      localStorage.setItem('discipline_os_mode', 'clean');
    } catch {}
  }, [saveHistory, syncWithServer]);

  // Restore starter sample data (for previewing charts)
  const restoreStarterDemoData = useCallback(() => {
    const demo = generateStarterHistory(currentDateKey);
    saveHistory(demo);
    syncWithServer(demo);
    try {
      localStorage.setItem('discipline_os_mode', 'demo');
    } catch {}
  }, [currentDateKey, saveHistory, syncWithServer]);

  // Update sync user ID (allows user to connect another device)
  const updateSyncUserId = useCallback(
    (newUserId: string) => {
      const clean = newUserId.trim().toLowerCase();
      if (!clean) return;
      setSyncUserId(clean);
      try {
        localStorage.setItem(SYNC_USER_KEY, clean);
      } catch {}
      // Immediately pull for this user ID
      fetch(`/api/discipline?user=${encodeURIComponent(clean)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.records) {
            saveHistory(data.records);
          }
        })
        .catch(() => {});
    },
    [saveHistory]
  );

  // Export JSON backup for using anywhere on any device
  const exportHistoryJson = useCallback((): string => {
    return JSON.stringify(history, null, 2);
  }, [history]);

  // Import JSON backup
  const importHistoryJson = useCallback(
    (jsonStr: string): boolean => {
      try {
        const parsed = JSON.parse(jsonStr);
        if (typeof parsed === 'object' && parsed !== null) {
          saveHistory(parsed);
          syncWithServer(parsed);
          return true;
        }
      } catch (err) {
        console.error('Import failed', err);
      }
      return false;
    },
    [saveHistory, syncWithServer]
  );

  // Compute overall streaks and statistics
  const stats: AppStats = useMemo(() => {
    const allDates = Object.keys(history).sort();
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;
    let totalPerfectDays = 0;
    let totalStudyHours = 0;
    let totalExerciseHours = 0;

    // Add up hours and perfect days
    allDates.forEach((d) => {
      const rec = history[d];
      totalStudyHours += rec.studyHours || 0;
      totalExerciseHours += rec.exerciseHours || 0;
      if (rec.count === 5) {
        totalPerfectDays += 1;
      }
    });

    // Check today and iterate backwards for active streak
    const [year, month, day] = currentDateKey.split('-').map(Number);
    const today = new Date(year, month - 1, day);

    let checkDate = new Date(today);
    const todayRec = history[currentDateKey];
    if (todayRec && todayRec.count > 0) {
      currentStreak += 1;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
      const k = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(
        checkDate.getDate()
      ).padStart(2, '0')}`;
      const rec = history[k];
      if (rec && rec.count >= 3) {
        currentStreak += 1;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Best streak
    allDates.forEach((d) => {
      const rec = history[d];
      if (rec && rec.count >= 3) {
        tempStreak += 1;
        if (tempStreak > bestStreak) bestStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
    });

    if (currentStreak > bestStreak) bestStreak = currentStreak;

    return {
      currentStreak,
      bestStreak: Math.max(bestStreak, currentStreak),
      totalPerfectDays,
      totalStudyHours,
      totalExerciseHours,
    };
  }, [history, currentDateKey]);

  // Format dataset for Recharts
  const chartData = useMemo(() => {
    const [year, month, day] = currentDateKey.split('-').map(Number);
    const anchor = new Date(year, month - 1, day);
    const result = [];

    for (let i = 29; i >= 0; i--) {
      const d = new Date(anchor);
      d.setDate(anchor.getDate() - i);
      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate()
      ).padStart(2, '0')}`;

      const rec =
        dateKey === currentDateKey
          ? todayRecord
          : history[dateKey] || {
              date: dateKey,
              dayOfWeek: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(d),
              completedTaskIds: [],
              count: 0,
              percentage: 0,
              studyHours: 0,
              exerciseHours: 0,
              updatedAt: d.toISOString(),
            };

      const monthDay = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(d);
      const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(d);

      result.push({
        dateKey,
        displayDate: monthDay,
        weekday,
        percentage: rec.percentage,
        count: rec.count,
        target: 100,
        studyHours: rec.studyHours,
        exerciseHours: rec.exerciseHours,
        isToday: dateKey === currentDateKey,
      });
    }

    return result;
  }, [history, currentDateKey, todayRecord]);

  const isCleanSlate =
    Object.keys(history).length === 0 ||
    (Object.keys(history).length === 1 && history[currentDateKey] !== undefined);

  return {
    currentDateKey,
    todayRecord,
    history,
    allTasks: DAILY_TASKS,
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
    manualSyncNow: () => syncWithServer(),
  };
}

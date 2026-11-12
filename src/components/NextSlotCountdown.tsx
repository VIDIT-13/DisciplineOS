import React, { useState, useEffect } from 'react';
import { getNextScheduledSlot } from '../utils/dateUtils';
import { Clock, Calendar, ArrowRight } from 'lucide-react';

export const NextSlotCountdown: React.FC = () => {
  const [slotInfo, setSlotInfo] = useState(() => getNextScheduledSlot());

  useEffect(() => {
    const interval = setInterval(() => {
      setSlotInfo(getNextScheduledSlot());
    }, 30000); // update every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#1C2822] bg-[#0C1410] px-4 py-2.5 text-xs text-neutral-300">
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#22C55E]/15 text-[#22C55E]">
          <Clock className="h-3.5 w-3.5" />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-neutral-400 font-mono">Next Target:</span>
          <span className="font-bold text-white">{slotInfo.slotName}</span>
          <span className="text-neutral-500">({slotInfo.timeLabel})</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="font-mono text-neutral-400">Starts in</span>
        <span className="rounded-lg bg-[#18261F] px-2 py-0.5 font-mono font-bold text-[#86EFAC] border border-[#22C55E]/30">
          {slotInfo.startsInText}
        </span>
      </div>
    </div>
  );
};

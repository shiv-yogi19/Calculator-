import React, { useState, useEffect } from 'react';
import { Wifi, Signal, BatteryCharging } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const AndroidFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentTheme, useAndroidFrame } = useTheme();
  const [timeStr, setTimeStr] = useState<string>('12:00');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!useAndroidFrame) {
    // Full screen edge-to-edge mode
    return (
      <div
        className="w-full h-screen flex flex-col overflow-hidden"
        style={{ backgroundColor: currentTheme.bg }}
      >
        {children}
      </div>
    );
  }

  // Realistic Android Phone Chassis Container
  return (
    <div className="w-full h-screen flex items-center justify-center bg-neutral-950 p-0 sm:p-4 select-none overflow-hidden">
      {/* Phone chassis */}
      <div
        className="w-full h-full sm:h-[95vh] sm:max-h-[860px] sm:max-w-[420px] sm:rounded-[48px] sm:border-[9px] sm:border-neutral-800 flex flex-col overflow-hidden relative shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] transition-all duration-300 ring-1 ring-white/10"
        style={{
          backgroundColor: currentTheme.bg,
        }}
      >
        {/* Android Punch Hole Camera (desktop preview) */}
        <div className="hidden sm:block absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-black border border-neutral-700/60 z-40 shadow-inner">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-900/60 mx-auto mt-1" />
        </div>

        {/* Android Status Bar */}
        <div className="px-6 pt-2 pb-1 flex items-center justify-between text-[11px] font-semibold text-neutral-300 z-30 select-none">
          <span className="tracking-tight font-mono">{timeStr}</span>
          <div className="flex items-center gap-2">
            <Signal size={13} className="opacity-90" />
            <Wifi size={13} className="opacity-90" />
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-mono">98%</span>
              <BatteryCharging size={14} className="text-emerald-400" />
            </div>
          </div>
        </div>

        {/* App content inside phone viewport */}
        <div className="flex-1 flex flex-col overflow-hidden relative z-10">
          {children}
        </div>

        {/* Android Gesture Bar */}
        <div className="w-full py-1.5 flex items-center justify-center z-30">
          <div className="w-32 h-1 rounded-full bg-white/30" />
        </div>
      </div>
    </div>
  );
};

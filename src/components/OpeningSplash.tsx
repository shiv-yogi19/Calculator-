import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { NexcalIcon } from './NexcalIcon';

export const OpeningSplash: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { currentTheme, brandingSettings, animationSettings } = useTheme();
  const [phase, setPhase] = useState<number>(0);

  useEffect(() => {
    // If opening animation disabled or reduced motion, complete immediately
    if (!brandingSettings.showOpeningAnimation || animationSettings.reduceMotion) {
      onComplete();
      return;
    }

    const t1 = setTimeout(() => setPhase(1), 200); // Icon fade in + neon glow reveal
    const t2 = setTimeout(() => setPhase(2), 700); // Brand name and developer credit
    const t3 = setTimeout(() => setPhase(3), 1600); // Fade out to calculator
    const t4 = setTimeout(() => onComplete(), 2000); // Complete

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [brandingSettings.showOpeningAnimation, animationSettings.reduceMotion, onComplete]);

  return (
    <div
      onClick={onComplete}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-6 select-none cursor-pointer transition-opacity duration-500 ${
        phase === 3 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        backgroundColor: currentTheme.bg,
      }}
    >
      {/* Background radial glow */}
      <div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-35 transition-all duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${currentTheme.glowColor} 0%, transparent 70%)`,
          transform: phase >= 1 ? 'scale(1.2)' : 'scale(0.6)',
        }}
      />

      {/* Main icon with neon expansion */}
      <div
        className={`transition-all duration-700 transform flex flex-col items-center ${
          phase >= 1 ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
        }`}
      >
        <NexcalIcon size={108} glow={phase >= 1} className="mb-6 drop-shadow-2xl" />

        {/* Title */}
        <div
          className={`transition-all duration-500 transform text-center ${
            phase >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <h1
            className="text-3xl font-extrabold tracking-widest uppercase font-mono"
            style={{
              color: currentTheme.numberText,
              textShadow: `0 0 20px ${currentTheme.glowColor}80`,
            }}
          >
            {brandingSettings.appName}
          </h1>

          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="w-6 h-px bg-white/20" />
            <p className="text-xs font-semibold tracking-wider text-neutral-300">
              {brandingSettings.developerCredit}
            </p>
            <span className="w-6 h-px bg-white/20" />
          </div>

          <p className="text-[11px] text-neutral-500 mt-6 tracking-wide animate-pulse">
            Tap anywhere to skip
          </p>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface NexcalIconProps {
  size?: number;
  className?: string;
  glow?: boolean;
}

export const NexcalIcon: React.FC<NexcalIconProps> = ({ size = 64, className = '', glow = true }) => {
  const { currentTheme, brandingSettings } = useTheme();

  // Dynamic glow color matching the active theme or preset
  const accentColor = currentTheme.glowColor || '#00e676';
  const equalsColor = currentTheme.equalsBtnBg || '#00e676';

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{
        width: size,
        height: size,
      }}
    >
      {/* Outer ambient liquid neon glow */}
      {glow && (
        <div
          className="absolute inset-0 rounded-[24%] blur-md opacity-70 transition-all duration-300"
          style={{
            background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
            transform: 'scale(1.15)',
          }}
        />
      )}

      {/* Main Glass Icon Container */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-xl"
      >
        <defs>
          {/* Base Glass Gradient */}
          <linearGradient id="tileGlass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.5" />
          </linearGradient>

          {/* Rim light */}
          <linearGradient id="rimStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="50%" stopColor={accentColor} stopOpacity="0.7" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.2" />
          </linearGradient>

          {/* Button surface gradients */}
          <linearGradient id="pillGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#223326" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#121e15" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="equalsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={equalsColor} />
            <stop offset="100%" stopColor={accentColor} />
          </linearGradient>
        </defs>

        {/* Outer Rounded Squircle Base */}
        <rect
          x="4"
          y="4"
          width="92"
          height="92"
          rx="25"
          fill="#0c1310"
        />
        <rect
          x="4"
          y="4"
          width="92"
          height="92"
          rx="25"
          fill="url(#tileGlass)"
        />
        <rect
          x="4.5"
          y="4.5"
          width="91"
          height="91"
          rx="24.5"
          stroke="url(#rimStroke)"
          strokeWidth="1.8"
        />

        {/* Specular Diagonal Reflection */}
        <path
          d="M 6 30 Q 30 15 50 6 L 68 6 Q 30 35 15 65 Z"
          fill="white"
          fillOpacity="0.08"
        />

        {/* 4 Iconic Mathematical Operator Pills */}
        {/* Top-Left: Minus (−) */}
        <rect
          x="14"
          y="14"
          width="32"
          height="32"
          rx="11"
          fill="url(#pillGrad1)"
          stroke={accentColor}
          strokeWidth="1"
          strokeOpacity="0.4"
        />
        <rect
          x="21"
          y="28.5"
          width="18"
          height="3.5"
          rx="1.75"
          fill="#e8f5e9"
        />

        {/* Top-Right: Multiply (×) */}
        <rect
          x="54"
          y="14"
          width="32"
          height="32"
          rx="11"
          fill="url(#pillGrad1)"
          stroke={accentColor}
          strokeWidth="1"
          strokeOpacity="0.4"
        />
        {/* Crisp Cross */}
        <g transform="translate(70, 30) rotate(45)">
          <rect x="-8.5" y="-1.75" width="17" height="3.5" rx="1.75" fill="#e8f5e9" />
          <rect x="-1.75" y="-8.5" width="3.5" height="17" rx="1.75" fill="#e8f5e9" />
        </g>

        {/* Bottom-Left: Plus (+) */}
        <rect
          x="14"
          y="54"
          width="32"
          height="32"
          rx="11"
          fill="url(#pillGrad1)"
          stroke={accentColor}
          strokeWidth="1"
          strokeOpacity="0.4"
        />
        {/* Crisp Plus */}
        <g transform="translate(30, 70)">
          <rect x="-8.5" y="-1.75" width="17" height="3.5" rx="1.75" fill="#e8f5e9" />
          <rect x="-1.75" y="-8.5" width="3.5" height="17" rx="1.75" fill="#e8f5e9" />
        </g>

        {/* Bottom-Right: Equals (=) - Prominent Neon Highlight */}
        <rect
          x="54"
          y="54"
          width="32"
          height="32"
          rx="11"
          fill="url(#equalsGrad)"
        />
        <rect
          x="61"
          y="65"
          width="18"
          height="3.5"
          rx="1.75"
          fill="#061f10"
        />
        <rect
          x="61"
          y="72"
          width="18"
          height="3.5"
          rx="1.75"
          fill="#061f10"
        />
      </svg>
    </div>
  );
};

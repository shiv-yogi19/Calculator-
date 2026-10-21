import React, { useState, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

interface CalcButtonProps {
  label: React.ReactNode;
  value: string;
  onClick: () => void;
  type?: 'number' | 'operator' | 'equals' | 'clear' | 'special';
  isActive?: boolean;
  isSpecialGlow?: boolean;
  className?: string;
  ariaLabel?: string;
}

export const CalcButton: React.FC<CalcButtonProps> = ({
  label,
  value,
  onClick,
  type = 'number',
  isActive = false,
  isSpecialGlow = false,
  className = '',
  ariaLabel,
}) => {
  const { currentTheme, buttonShape, animationSettings } = useTheme();
  const [isPressed, setIsPressed] = useState(false);
  const [ripplePos, setRipplePos] = useState<{ x: number; y: number; id: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Compute button border radius from ButtonShapeConfig
  const getBorderRadius = () => {
    switch (buttonShape.shape) {
      case 'circle':
        return '9999px';
      case 'pill':
        return '9999px';
      case 'square':
        return '6px';
      case 'rounded-square':
        return '18px';
      case 'extra-rounded':
        return '28px';
      case 'custom':
      default:
        return `${buttonShape.customRadius}px`;
    }
  };

  // Compute colors based on button type
  const getButtonStyles = () => {
    switch (type) {
      case 'operator':
        return {
          bg: isActive ? currentTheme.operatorText : currentTheme.operatorBtnBg,
          text: isActive ? currentTheme.equalsText || '#000000' : currentTheme.operatorText,
          glow: currentTheme.glowColor,
        };
      case 'equals':
        return {
          bg: currentTheme.equalsBtnBg,
          text: currentTheme.equalsText,
          glow: currentTheme.equalsBtnBg,
        };
      case 'clear':
        return {
          bg: currentTheme.clearBtnBg,
          text: currentTheme.clearText,
          glow: currentTheme.clearText,
        };
      case 'special':
        return {
          bg: currentTheme.operatorBtnBg,
          text: currentTheme.operatorText,
          glow: currentTheme.glowColor,
        };
      case 'number':
      default:
        return {
          bg: currentTheme.numberBtnBg,
          text: currentTheme.numberText,
          glow: currentTheme.glowColor,
        };
    }
  };

  const colors = getButtonStyles();

  // Glow intensity scale
  const getGlowShadow = () => {
    if (!animationSettings.glowEnabled) return 'none';

    let spread = 12;
    let opacity = '0.5';

    switch (animationSettings.glowIntensity) {
      case 'subtle':
        spread = 8;
        opacity = '0.3';
        break;
      case 'standard':
        spread = 14;
        opacity = '0.55';
        break;
      case 'vivid':
        spread = 20;
        opacity = '0.75';
        break;
      case 'ultra':
        spread = 28;
        opacity = '0.95';
        break;
    }

    if (isPressed || isSpecialGlow || isActive) {
      return `0 0 ${spread}px ${colors.glow}${opacity}, inset 0 0 10px ${colors.glow}40`;
    }
    return `0 2px 8px rgba(0, 0, 0, 0.3)`;
  };

  // Touch and ripple trigger
  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    setIsPressed(true);

    if (animationSettings.rippleEnabled && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setRipplePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        id: Date.now(),
      });
    }
  };

  const handlePointerUp = () => {
    setIsPressed(false);
  };

  const handlePointerLeave = () => {
    setIsPressed(false);
  };

  const borderRadius = getBorderRadius();
  const pressScale = animationSettings.pressAnimationEnabled && isPressed ? buttonShape.pressScale : 1;

  return (
    <button
      ref={buttonRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onClick={onClick}
      aria-label={ariaLabel || (typeof label === 'string' ? label : value)}
      className={`relative overflow-hidden flex items-center justify-center font-semibold text-xl transition-all select-none ${className}`}
      style={{
        borderRadius,
        backgroundColor: colors.bg,
        color: colors.text,
        height: `${buttonShape.buttonHeight}px`,
        boxShadow: getGlowShadow(),
        transform: `scale(${pressScale})`,
        border: `${buttonShape.borderThickness}px solid rgba(255, 255, 255, ${buttonShape.borderBrightness * (isActive || isPressed ? 0.9 : 0.25)})`,
        transitionDuration: `${animationSettings.reduceMotion ? 0 : animationSettings.glowDuration}ms`,
      }}
    >
      {/* Specular glass top reflection */}
      <div
        className="absolute inset-x-0 top-0 h-1/2 pointer-events-none rounded-t-[inherit] opacity-25"
        style={{
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, transparent 100%)',
        }}
      />

      {/* Ripple Element */}
      {ripplePos && animationSettings.rippleEnabled && (
        <span
          key={ripplePos.id}
          className="absolute w-20 h-20 -ml-10 -mt-10 rounded-full pointer-events-none animate-ripple"
          style={{
            left: ripplePos.x,
            top: ripplePos.y,
            backgroundColor: colors.glow,
          }}
          onAnimationEnd={() => setRipplePos(null)}
        />
      )}

      {/* Button label */}
      <span className="relative z-10 flex items-center justify-center font-mono-numbers">
        {label}
      </span>
    </button>
  );
};

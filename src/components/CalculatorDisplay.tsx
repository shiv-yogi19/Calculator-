import React, { useRef, useEffect } from 'react';
import { Copy, Clipboard, Check } from 'lucide-react';
import { useCalculator } from '../context/CalculatorContext';
import { useTheme } from '../context/ThemeContext';

export const CalculatorDisplay: React.FC = () => {
  const {
    expression,
    previewResult,
    lastCalculatedResult,
    isEvaluated,
    hasError,
    errorMessage,
    copyExpression,
    copyResult,
    pasteToExpression,
    copiedToast,
  } = useCalculator();

  const { currentTheme, animationSettings, displaySettings } = useTheme();
  const expressionScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll expression to right as user types
  useEffect(() => {
    if (expressionScrollRef.current) {
      expressionScrollRef.current.scrollLeft = expressionScrollRef.current.scrollWidth;
    }
  }, [expression]);

  // Dynamic font sizing depending on expression length
  const getExpressionFontSize = () => {
    const len = expression.length;
    if (len > 25) return 'text-xl';
    if (len > 16) return 'text-2xl';
    if (len > 10) return 'text-3xl';
    return 'text-4xl';
  };

  const isMotionReduced = animationSettings.reduceMotion;

  return (
    <div
      className="relative flex-1 min-h-[170px] max-h-[220px] px-5 py-4 flex flex-col justify-end select-none overflow-hidden transition-all duration-300"
      style={{
        background: `radial-gradient(ellipse at 50% 0%, ${currentTheme.glassTint} 0%, transparent 75%)`,
      }}
    >
      {/* Toast Notification */}
      {copiedToast && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full liquid-glass text-xs font-medium text-white flex items-center gap-1.5 shadow-lg border border-white/20 animate-in fade-in zoom-in-95 duration-150">
          <Check size={12} className="text-emerald-400" />
          <span>{copiedToast}</span>
        </div>
      )}

      {/* Quick Action Overlay (Copy/Paste) */}
      <div className="absolute top-2 right-4 flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity z-10">
        <button
          onClick={copyResult}
          disabled={!previewResult && !lastCalculatedResult}
          className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors disabled:opacity-20"
          title="Copy result"
        >
          <Copy size={15} />
        </button>
        <button
          onClick={pasteToExpression}
          className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          title="Paste from clipboard"
        >
          <Clipboard size={15} />
        </button>
      </div>

      {/* Main Expression Display */}
      <div
        ref={expressionScrollRef}
        onClick={copyExpression}
        className={`w-full overflow-x-auto no-scrollbar text-right font-mono-numbers font-medium tracking-tight whitespace-nowrap cursor-pointer transition-all duration-200 ${getExpressionFontSize()}`}
        style={{
          color: isEvaluated ? 'rgba(255, 255, 255, 0.55)' : currentTheme.numberText,
          textShadow: !isEvaluated && animationSettings.glowEnabled ? `0 0 16px ${currentTheme.glowColor}40` : 'none',
        }}
        title="Tap to copy expression"
      >
        {expression || <span className="opacity-20">0</span>}
      </div>

      {/* Secondary Result Preview / Evaluated Answer */}
      <div className="h-14 mt-1 flex items-center justify-end overflow-hidden">
        {hasError ? (
          <div className="text-red-400 font-mono-numbers font-semibold text-lg flex items-center gap-1.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <span>{errorMessage || 'Error'}</span>
          </div>
        ) : isEvaluated && lastCalculatedResult ? (
          /* Final Promoted Answer with Slide-up and Accent Glow */
          <div
            onClick={copyResult}
            className={`font-mono-numbers font-bold text-4xl cursor-pointer ${
              isMotionReduced ? 'transition-opacity duration-150' : 'animate-in fade-in slide-in-from-bottom-4 duration-300'
            }`}
            style={{
              color: currentTheme.equalsBtnBg,
              textShadow: animationSettings.glowEnabled
                ? `0 0 24px ${currentTheme.glowColor}80, 0 0 4px ${currentTheme.glowColor}`
                : 'none',
            }}
            title="Tap to copy answer"
          >
            = {lastCalculatedResult}
          </div>
        ) : previewResult ? (
          /* Live Secondary Preview with Google Calculator-style Slide Transition */
          <div
            onClick={copyResult}
            className={`font-mono-numbers font-semibold text-2xl opacity-75 cursor-pointer ${
              isMotionReduced ? '' : 'animate-in fade-in slide-in-from-bottom-2 duration-200'
            }`}
            style={{
              color: currentTheme.operatorText,
            }}
            title="Tap to use answer"
          >
            = {previewResult}
          </div>
        ) : (
          <div className="h-8" />
        )}
      </div>

      {/* Subtle Bottom Separator Line with Gradient */}
      <div
        className="w-full h-px mt-1 transition-all duration-500 opacity-30"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${currentTheme.glowColor} 50%, transparent 100%)`,
        }}
      />
    </div>
  );
};

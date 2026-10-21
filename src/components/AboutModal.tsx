import React from 'react';
import { X, Info, Sparkles, CheckCircle2, ShieldCheck, Github, Code } from 'lucide-react';
import { useCalculator } from '../context/CalculatorContext';
import { useTheme } from '../context/ThemeContext';
import { NexcalIcon } from './NexcalIcon';

export const AboutModal: React.FC = () => {
  const { isAboutOpen, setIsAboutOpen, setIsPrivacyOpen, setIsAndroidExportOpen } = useCalculator();
  const { currentTheme, brandingSettings } = useTheme();

  if (!isAboutOpen) return null;

  const features = [
    'Original Liquid Glass & Neon Glow touch physics engine',
    'Google Calculator-style animated expression and answer promotion',
    'Safe Shunting-yard mathematical tokenizer & AST evaluator (Zero eval)',
    'Full Scientific mode: Trigonometric, Logarithms, Powers, Factorial, DEG/RAD',
    '9-Category Unit Converter with live reputable currency exchange rates',
    'Financial & Math tools: EMI Loan, GST Tax, Discount, Percentage, Ratio',
    'Dedicated Theme Studio with presets, color picker, and button shape editor',
    '100% Private & Offline capable — all history & settings saved locally',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full sm:max-w-md h-[85vh] max-h-[700px] flex flex-col rounded-t-3xl sm:rounded-3xl border border-white/15 overflow-hidden shadow-2xl animate-in slide-in-from-bottom-6 duration-250"
        style={{
          backgroundColor: currentTheme.surface,
          color: currentTheme.numberText,
        }}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info size={18} style={{ color: currentTheme.glowColor }} />
            <h2 className="font-bold text-base">About {brandingSettings.appName}</h2>
          </div>
          <button
            onClick={() => setIsAboutOpen(false)}
            className="p-2 rounded-xl hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 no-scrollbar">
          {/* Hero Branding */}
          <div className="flex flex-col items-center text-center">
            <NexcalIcon size={84} glow={true} className="mb-3" />
            <h1 className="text-2xl font-extrabold tracking-wider">{brandingSettings.appName}</h1>
            <span
              className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mt-1 border"
              style={{
                color: currentTheme.operatorText,
                borderColor: `${currentTheme.operatorText}40`,
                backgroundColor: `${currentTheme.operatorText}15`,
              }}
            >
              Version 1.0.0
            </span>
            <p className="text-xs font-semibold text-neutral-300 mt-2">
              {brandingSettings.developerCredit}
            </p>
            <p className="text-xs text-neutral-400 mt-3 max-w-xs leading-relaxed">
              NEXCAL is a modern calculator application designed for accurate calculations, customizable themes, smooth animations, and a personalized Android experience.
            </p>
          </div>

          {/* Key Features */}
          <div className="p-4 rounded-3xl liquid-glass border border-white/10 space-y-2.5">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-1">
              Core Capabilities
            </span>
            {features.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-neutral-300">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>{feat}</span>
              </div>
            ))}
          </div>

          {/* Android Native Integration Notice */}
          <div className="p-4 rounded-3xl bg-black/40 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Android Native Architecture
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30">
                Ready to Export
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Includes complete Kotlin Jetpack Compose and Material 3 source files with instructions for compiling a native Android APK in Android Studio.
            </p>
            <button
              onClick={() => {
                setIsAboutOpen(false);
                setIsAndroidExportOpen(true);
              }}
              className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors flex items-center justify-center gap-1.5"
            >
              <Code size={14} />
              <span>Inspect Native Android Kotlin Source</span>
            </button>
          </div>

          {/* Open Source & Attribution */}
          <div className="p-4 rounded-3xl liquid-glass border border-white/10 text-xs text-neutral-400 space-y-1.5">
            <span className="font-bold text-neutral-300 block mb-1">Licenses & Acknowledgments</span>
            <p>React 19 · Vite · Tailwind CSS · Lucide Icons · Plus Jakarta Sans</p>
            <p className="text-[11px] opacity-75">
              Built for performance, precision, and privacy. Released under the MIT open-source license.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between text-xs bg-black/20">
          <button
            onClick={() => {
              setIsAboutOpen(false);
              setIsPrivacyOpen(true);
            }}
            className="text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <ShieldCheck size={14} />
            <span>Privacy Policy</span>
          </button>
          <span className="text-neutral-500 text-[11px]">© 2026 Shiv Yogi</span>
        </div>
      </div>
    </div>
  );
};

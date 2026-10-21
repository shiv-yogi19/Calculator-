import React from 'react';
import { X, ShieldCheck, Lock, Database, WifiOff, FileText } from 'lucide-react';
import { useCalculator } from '../context/CalculatorContext';
import { useTheme } from '../context/ThemeContext';

export const PrivacyModal: React.FC = () => {
  const { isPrivacyOpen, setIsPrivacyOpen } = useCalculator();
  const { currentTheme, brandingSettings } = useTheme();

  if (!isPrivacyOpen) return null;

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
            <ShieldCheck size={18} className="text-emerald-400" />
            <h2 className="font-bold text-base">Privacy & Data Notice</h2>
          </div>
          <button
            onClick={() => setIsPrivacyOpen(false)}
            className="p-2 rounded-xl hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar text-xs leading-relaxed text-neutral-300">
          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-3">
            <Lock size={18} className="text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-300 block mb-0.5">
                Zero Personal Data Collection
              </span>
              <p className="text-[11px] text-emerald-200/80">
                {brandingSettings.appName} is designed from the ground up to respect your digital privacy. We do not track, profile, or sell your calculation data.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl liquid-glass border border-white/10">
              <div className="flex items-center gap-2 mb-1.5 font-bold text-white text-xs">
                <Database size={15} style={{ color: currentTheme.glowColor }} />
                <span>1. Local Storage Only</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                All calculation history entries, custom created themes, button dimensions, and preferences remain strictly inside your device&apos;s local storage (HTML5 LocalStorage / Android DataStore). Nothing is synced to an external server or cloud database.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl liquid-glass border border-white/10">
              <div className="flex items-center gap-2 mb-1.5 font-bold text-white text-xs">
                <WifiOff size={15} style={{ color: currentTheme.glowColor }} />
                <span>2. 100% Offline Capability</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                The standard calculator, scientific mathematical engine, shape customizer, and unit converter run entirely client-side without any internet requirement.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl liquid-glass border border-white/10">
              <div className="flex items-center gap-2 mb-1.5 font-bold text-white text-xs">
                <FileText size={15} style={{ color: currentTheme.glowColor }} />
                <span>3. Network Calls Disclosure</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                The only optional network call occurs if you open the Currency Converter tab and request a live exchange rate refresh from the open public API (open.er-api.com). No user identifiers or telemetry data are ever included.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl liquid-glass border border-white/10">
              <span className="font-bold text-white text-xs block mb-1">
                4. Data Deletion
              </span>
              <p className="text-[11px] text-neutral-400">
                You retain complete control of your data. You can clear your calculation records or reset all settings to defaults at any time from the Settings menu.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-black/20 text-center">
          <button
            onClick={() => setIsPrivacyOpen(false)}
            className="w-full py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import {
  MoreVertical,
  History,
  Palette,
  Settings,
  Info,
  ShieldCheck,
  Binary,
  Layers,
  ArrowLeftRight,
  Sparkles,
  Smartphone,
} from 'lucide-react';
import { useCalculator } from '../context/CalculatorContext';
import { useTheme } from '../context/ThemeContext';
import { NexcalIcon } from './NexcalIcon';

export const HeaderNav: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    angleMode,
    toggleAngleMode,
    memory,
    isScientificOpen,
    toggleScientific,
    history,
    setIsHistoryOpen,
    setIsThemeStudioOpen,
    setIsSettingsOpen,
    setIsAboutOpen,
    setIsPrivacyOpen,
    setIsAndroidExportOpen,
  } = useCalculator();

  const { currentTheme, brandingSettings, useAndroidFrame, setUseAndroidFrame } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when tapping outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header className="relative z-30 px-3 py-2 flex items-center justify-between border-b border-white/10 select-none">
      {/* Brand & In-App Identity */}
      <div className="flex items-center gap-2">
        <NexcalIcon size={34} glow={false} />
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-bold tracking-wider text-sm leading-tight" style={{ color: currentTheme.numberText }}>
              {brandingSettings.appName}
            </span>
            <span
              className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full uppercase tracking-widest border"
              style={{
                color: currentTheme.operatorText,
                borderColor: `${currentTheme.operatorText}40`,
                backgroundColor: `${currentTheme.operatorText}15`,
              }}
            >
              PRO
            </span>
          </div>
          <span className="text-[10px] tracking-wide text-neutral-400 font-medium leading-none">
            {brandingSettings.developerCredit}
          </span>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center p-1 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10">
        <button
          onClick={() => setActiveTab('calculator')}
          className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all duration-200 ${
            activeTab === 'calculator'
              ? 'shadow-md'
              : 'text-neutral-400 hover:text-white'
          }`}
          style={
            activeTab === 'calculator'
              ? {
                  backgroundColor: currentTheme.operatorText,
                  color: currentTheme.equalsText || '#000',
                }
              : {}
          }
        >
          Calc
        </button>

        <button
          onClick={() => setActiveTab('converter')}
          className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all duration-200 ${
            activeTab === 'converter'
              ? 'shadow-md'
              : 'text-neutral-400 hover:text-white'
          }`}
          style={
            activeTab === 'converter'
              ? {
                  backgroundColor: currentTheme.operatorText,
                  color: currentTheme.equalsText || '#000',
                }
              : {}
          }
        >
          Convert
        </button>

        <button
          onClick={() => setActiveTab('tools')}
          className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all duration-200 ${
            activeTab === 'tools'
              ? 'shadow-md'
              : 'text-neutral-400 hover:text-white'
          }`}
          style={
            activeTab === 'tools'
              ? {
                  backgroundColor: currentTheme.operatorText,
                  color: currentTheme.equalsText || '#000',
                }
              : {}
          }
        >
          Tools
        </button>
      </div>

      {/* Right Controls: Quick indicators + Overflow menu */}
      <div className="flex items-center gap-1">
        {/* DEG/RAD Quick Toggle */}
        <button
          onClick={toggleAngleMode}
          className="px-2 py-1 text-[11px] font-bold rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          style={{ color: currentTheme.operatorText }}
          title="Toggle Angle Mode"
        >
          {angleMode}
        </button>

        {/* Memory badge if active */}
        {memory !== 0 && (
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm"
            style={{
              backgroundColor: currentTheme.equalsBtnBg,
              color: currentTheme.equalsText,
            }}
            title={`Memory active: ${memory}`}
          >
            M
          </div>
        )}

        {/* Android Frame Toggle for desktop preview */}
        <button
          onClick={() => setUseAndroidFrame(!useAndroidFrame)}
          className="p-1.5 rounded-xl hover:bg-white/10 text-neutral-400 hover:text-white transition-colors hidden sm:flex"
          title={useAndroidFrame ? 'Switch to Fullscreen View' : 'Switch to Android Phone View'}
        >
          <Smartphone size={17} className={useAndroidFrame ? 'text-green-400' : ''} />
        </button>

        {/* Three-Dot Overflow Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1.5 rounded-xl hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
            aria-label="More options"
          >
            <MoreVertical size={20} />
          </button>

          {/* Dropdown Popup */}
          {isMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-64 rounded-2xl p-1.5 z-50 liquid-glass shadow-2xl border border-white/15 animate-in fade-in slide-in-from-top-2 duration-150"
              style={{
                backgroundColor: currentTheme.surface,
              }}
            >
              <div className="px-3 py-2 border-b border-white/10 mb-1 flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Menu Options
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">v1.0.0</span>
              </div>

              {/* History */}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsHistoryOpen(true);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-xl hover:bg-white/10 text-left transition-colors"
              >
                <History size={16} style={{ color: currentTheme.operatorText }} />
                <span className="flex-1">History</span>
                {history.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/15 text-neutral-300">
                    {history.length}
                  </span>
                )}
              </button>

              {/* Scientific Toggle */}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  toggleScientific();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-xl hover:bg-white/10 text-left transition-colors"
              >
                <Binary size={16} style={{ color: currentTheme.operatorText }} />
                <span className="flex-1">Scientific Mode</span>
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                  style={{
                    backgroundColor: isScientificOpen ? `${currentTheme.glowColor}30` : 'rgba(255,255,255,0.1)',
                    color: isScientificOpen ? currentTheme.glowColor : '#aaa',
                  }}
                >
                  {isScientificOpen ? 'ON' : 'OFF'}
                </span>
              </button>

              {/* Unit Converter */}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setActiveTab('converter');
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-xl hover:bg-white/10 text-left transition-colors"
              >
                <ArrowLeftRight size={16} style={{ color: currentTheme.operatorText }} />
                <span>Unit Converter</span>
              </button>

              {/* Additional Calculators */}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setActiveTab('tools');
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-xl hover:bg-white/10 text-left transition-colors"
              >
                <Layers size={16} style={{ color: currentTheme.operatorText }} />
                <span>Financial & Tools</span>
              </button>

              {/* Theme Studio */}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsThemeStudioOpen(true);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-xl hover:bg-white/10 text-left transition-colors"
              >
                <Palette size={16} style={{ color: currentTheme.operatorText }} />
                <span className="flex-1">Theme Studio</span>
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentTheme.glowColor }} />
              </button>

              {/* Settings */}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsSettingsOpen(true);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-xl hover:bg-white/10 text-left transition-colors"
              >
                <Settings size={16} style={{ color: currentTheme.operatorText }} />
                <span>Settings</span>
              </button>

              {/* Android Native Export */}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsAndroidExportOpen(true);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-xl hover:bg-white/10 text-left transition-colors text-emerald-400"
              >
                <Sparkles size={16} />
                <span>Android Native APK Source</span>
              </button>

              <div className="h-px bg-white/10 my-1" />

              {/* About App */}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsAboutOpen(true);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-xl hover:bg-white/10 text-left transition-colors text-neutral-300"
              >
                <Info size={16} />
                <span>About NEXCAL</span>
              </button>

              {/* Privacy Policy */}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsPrivacyOpen(true);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-xl hover:bg-white/10 text-left transition-colors text-neutral-400"
              >
                <ShieldCheck size={16} />
                <span>Privacy Notice</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

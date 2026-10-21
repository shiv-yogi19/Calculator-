import React, { useState } from 'react';
import {
  X,
  Settings,
  Sparkles,
  Volume2,
  Smartphone,
  Eye,
  Trash2,
  RotateCcw,
  Sliders,
  Shield,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCalculator } from '../context/CalculatorContext';

export const SettingsModal: React.FC = () => {
  const {
    currentTheme,
    allThemes,
    selectTheme,
    animationSettings,
    updateAnimationSettings,
    displaySettings,
    updateDisplaySettings,
    soundHapticsSettings,
    updateSoundHapticsSettings,
    brandingSettings,
    updateBrandingSettings,
    resetAllSettings,
  } = useTheme();

  const {
    isSettingsOpen,
    setIsSettingsOpen,
    clearAllHistory,
    setIsThemeStudioOpen,
    setIsAndroidExportOpen,
  } = useCalculator();

  const [activeCategory, setActiveCategory] = useState<
    'animation' | 'sound' | 'display' | 'branding' | 'data'
  >('animation');

  if (!isSettingsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full sm:max-w-xl h-[90vh] max-h-[750px] flex flex-col rounded-t-3xl sm:rounded-3xl border border-white/15 overflow-hidden shadow-2xl animate-in slide-in-from-bottom-6 duration-250"
        style={{
          backgroundColor: currentTheme.surface,
          color: currentTheme.numberText,
        }}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="p-2 rounded-xl"
              style={{
                backgroundColor: `${currentTheme.glowColor}25`,
                color: currentTheme.glowColor,
              }}
            >
              <Settings size={18} />
            </div>
            <div>
              <h2 className="font-bold text-base">NEXCAL Settings</h2>
              <p className="text-[11px] text-neutral-400">
                Personalization, Animations & Behavior
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-2 rounded-xl hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Category Pills Navigation */}
        <div className="px-3 py-2 border-b border-white/10 flex items-center gap-1.5 bg-black/30 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveCategory('animation')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === 'animation' ? 'bg-white/20 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Glow & Touch
          </button>
          <button
            onClick={() => setActiveCategory('sound')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === 'sound' ? 'bg-white/20 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Sound & Haptics
          </button>
          <button
            onClick={() => setActiveCategory('display')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === 'display' ? 'bg-white/20 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Display
          </button>
          <button
            onClick={() => setActiveCategory('branding')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === 'branding' ? 'bg-white/20 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Branding
          </button>
          <button
            onClick={() => setActiveCategory('data')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === 'data' ? 'bg-white/20 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Data & System
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {/* 1. ANIMATION & TOUCH GLOW */}
          {activeCategory === 'animation' && (
            <div className="space-y-3.5">
              {/* Glow Toggle */}
              <div className="p-3.5 rounded-2xl liquid-glass border border-white/10 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-sm block">Touch Glow Effect</span>
                  <span className="text-[11px] text-neutral-400">
                    Real-time neon bloom around buttons on touch
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={animationSettings.glowEnabled}
                  onChange={(e) => updateAnimationSettings({ glowEnabled: e.target.checked })}
                  className="w-5 h-5 accent-green-400 rounded cursor-pointer"
                />
              </div>

              {/* Glow Intensity */}
              <div className="p-3.5 rounded-2xl liquid-glass border border-white/10 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-neutral-300">Glow Intensity</span>
                  <span className="font-bold uppercase tracking-wider text-green-400">
                    {animationSettings.glowIntensity}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {(['subtle', 'standard', 'vivid', 'ultra'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => updateAnimationSettings({ glowIntensity: lvl })}
                      className={`py-1.5 rounded-xl text-xs font-bold capitalize border transition-all ${
                        animationSettings.glowIntensity === lvl
                          ? 'bg-white/20 border-white/40 text-white'
                          : 'bg-black/30 border-white/10 text-neutral-400'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Touch Ripple */}
              <div className="p-3.5 rounded-2xl liquid-glass border border-white/10 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-sm block">Touch Ripple</span>
                  <span className="text-[11px] text-neutral-400">
                    Radial fluid ripples originating from touch coordinate
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={animationSettings.rippleEnabled}
                  onChange={(e) => updateAnimationSettings({ rippleEnabled: e.target.checked })}
                  className="w-5 h-5 accent-green-400 rounded cursor-pointer"
                />
              </div>

              {/* Press Scale */}
              <div className="p-3.5 rounded-2xl liquid-glass border border-white/10 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-sm block">Button Press Physics</span>
                  <span className="text-[11px] text-neutral-400">
                    Subtle mechanical scale compression on tap
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={animationSettings.pressAnimationEnabled}
                  onChange={(e) =>
                    updateAnimationSettings({ pressAnimationEnabled: e.target.checked })
                  }
                  className="w-5 h-5 accent-green-400 rounded cursor-pointer"
                />
              </div>

              {/* Number Highlight */}
              <div className="p-3.5 rounded-2xl liquid-glass border border-white/10 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-sm block">Digit Key Glow</span>
                  <span className="text-[11px] text-neutral-400">
                    Brief illuminate flash on tapped number digits
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={animationSettings.numberGlowEnabled}
                  onChange={(e) =>
                    updateAnimationSettings({ numberGlowEnabled: e.target.checked })
                  }
                  className="w-5 h-5 accent-green-400 rounded cursor-pointer"
                />
              </div>

              {/* Reduce Motion */}
              <div className="p-3.5 rounded-2xl liquid-glass border border-white/10 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-sm block">Reduce Motion</span>
                  <span className="text-[11px] text-neutral-400">
                    Replaces physics transitions with minimal instant fades
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={animationSettings.reduceMotion}
                  onChange={(e) => updateAnimationSettings({ reduceMotion: e.target.checked })}
                  className="w-5 h-5 accent-green-400 rounded cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* 2. SOUND & HAPTICS */}
          {activeCategory === 'sound' && (
            <div className="space-y-3.5">
              <div className="p-3.5 rounded-2xl liquid-glass border border-white/10 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-sm block">Keypress Audio</span>
                  <span className="text-[11px] text-neutral-400">
                    Synthesized tactile click sounds via Web Audio
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={soundHapticsSettings.soundEnabled}
                  onChange={(e) =>
                    updateSoundHapticsSettings({ soundEnabled: e.target.checked })
                  }
                  className="w-5 h-5 accent-green-400 rounded cursor-pointer"
                />
              </div>

              {soundHapticsSettings.soundEnabled && (
                <div className="p-3.5 rounded-2xl liquid-glass border border-white/10">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-neutral-300">Click Volume</span>
                    <span className="font-mono font-bold">
                      {Math.round(soundHapticsSettings.soundVolume * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={soundHapticsSettings.soundVolume}
                    onChange={(e) =>
                      updateSoundHapticsSettings({ soundVolume: parseFloat(e.target.value) })
                    }
                    className="w-full accent-green-400"
                  />
                </div>
              )}

              <div className="p-3.5 rounded-2xl liquid-glass border border-white/10 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-sm block">Haptic Vibration</span>
                  <span className="text-[11px] text-neutral-400">
                    Subtle tactile buzz on phone hardware
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={soundHapticsSettings.hapticsEnabled}
                  onChange={(e) =>
                    updateSoundHapticsSettings({ hapticsEnabled: e.target.checked })
                  }
                  className="w-5 h-5 accent-green-400 rounded cursor-pointer"
                />
              </div>

              {soundHapticsSettings.hapticsEnabled && (
                <div className="p-3.5 rounded-2xl liquid-glass border border-white/10 space-y-2">
                  <span className="text-xs font-semibold text-neutral-300 block">
                    Vibration Strength
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {(['light', 'medium', 'heavy'] as const).map((strength) => (
                      <button
                        key={strength}
                        onClick={() =>
                          updateSoundHapticsSettings({ vibrationIntensity: strength })
                        }
                        className={`py-1.5 rounded-xl text-xs font-bold capitalize border transition-all ${
                          soundHapticsSettings.vibrationIntensity === strength
                            ? 'bg-white/20 border-white/40 text-white'
                            : 'bg-black/30 border-white/10 text-neutral-400'
                        }`}
                      >
                        {strength}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. DISPLAY & FORMATTING */}
          {activeCategory === 'display' && (
            <div className="space-y-3.5">
              <div className="p-3.5 rounded-2xl liquid-glass border border-white/10 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-sm block">Thousands Separators</span>
                  <span className="text-[11px] text-neutral-400">
                    Format large numbers with commas (e.g. 1,000,000)
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={displaySettings.thousandSeparators}
                  onChange={(e) =>
                    updateDisplaySettings({ thousandSeparators: e.target.checked })
                  }
                  className="w-5 h-5 accent-green-400 rounded cursor-pointer"
                />
              </div>

              <div className="p-3.5 rounded-2xl liquid-glass border border-white/10">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold text-neutral-300">Max Decimal Precision</span>
                  <span className="font-mono font-bold">{displaySettings.decimalPrecision} places</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="12"
                  value={displaySettings.decimalPrecision}
                  onChange={(e) =>
                    updateDisplaySettings({ decimalPrecision: parseInt(e.target.value, 10) })
                  }
                  className="w-full accent-green-400"
                />
              </div>

              <div className="p-3.5 rounded-2xl liquid-glass border border-white/10">
                <span className="font-semibold text-sm block mb-1">Theme Studio Shortcut</span>
                <p className="text-[11px] text-neutral-400 mb-2">
                  Configure custom button corner radiuses, spacing, heights, and glass tints.
                </p>
                <button
                  onClick={() => {
                    setIsSettingsOpen(false);
                    setIsThemeStudioOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
                >
                  Open Theme Studio
                </button>
              </div>
            </div>
          )}

          {/* 4. BRANDING */}
          {activeCategory === 'branding' && (
            <div className="space-y-3.5">
              <div className="p-3.5 rounded-2xl liquid-glass border border-white/10 space-y-2">
                <label className="text-xs font-bold text-neutral-300 block">
                  In-App Application Name
                </label>
                <input
                  type="text"
                  value={brandingSettings.appName}
                  onChange={(e) => updateBrandingSettings({ appName: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-sm font-semibold text-white focus:outline-none"
                  placeholder="NEXCAL"
                />
              </div>

              <div className="p-3.5 rounded-2xl liquid-glass border border-white/10 space-y-2">
                <label className="text-xs font-bold text-neutral-300 block">
                  Developer Credit
                </label>
                <input
                  type="text"
                  value={brandingSettings.developerCredit}
                  onChange={(e) => updateBrandingSettings({ developerCredit: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-sm font-semibold text-white focus:outline-none"
                  placeholder="Created By Shiv Yogi"
                />
              </div>

              <div className="p-3.5 rounded-2xl liquid-glass border border-white/10 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-sm block">Opening Splash Sequence</span>
                  <span className="text-[11px] text-neutral-400">
                    Play neon glass reveal animation on initial app launch
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={brandingSettings.showOpeningAnimation}
                  onChange={(e) =>
                    updateBrandingSettings({ showOpeningAnimation: e.target.checked })
                  }
                  className="w-5 h-5 accent-green-400 rounded cursor-pointer"
                />
              </div>

              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex gap-2">
                <HelpCircle size={16} className="shrink-0 mt-0.5" />
                <p>
                  <strong>Note on Android Launcher Icons:</strong> Changing the in-app brand name or logo customizes the display inside this app. On native Android, system home-screen launcher icons are declared via <code>&lt;activity-alias&gt;</code> in <code>AndroidManifest.xml</code>. See the Native Android Export tab for details.
                </p>
              </div>
            </div>
          )}

          {/* 5. DATA & SYSTEM */}
          {activeCategory === 'data' && (
            <div className="space-y-3.5">
              {/* Native Android Source Export button */}
              <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-sm text-emerald-300 block">
                    Android Native Kotlin & APK Guide
                  </span>
                  <span className="text-[11px] text-emerald-200/70">
                    View ready Jetpack Compose & Material 3 native code
                  </span>
                </div>
                <button
                  onClick={() => {
                    setIsSettingsOpen(false);
                    setIsAndroidExportOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 text-black font-bold text-xs"
                >
                  View Code
                </button>
              </div>

              <div className="p-3.5 rounded-2xl liquid-glass border border-white/10 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-sm block text-red-300">
                    Clear Calculation History
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    Permanently delete all stored calculations from this device
                  </span>
                </div>
                <button
                  onClick={clearAllHistory}
                  className="px-3 py-1.5 rounded-xl bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-semibold hover:bg-red-500/30 transition-colors"
                >
                  Clear History
                </button>
              </div>

              <div className="p-3.5 rounded-2xl liquid-glass border border-white/10 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-sm block text-amber-300">
                    Reset Settings to Default
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    Restore default Neon Forest theme, shapes, and branding
                  </span>
                </div>
                <button
                  onClick={resetAllSettings}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold hover:bg-amber-500/30 transition-colors"
                >
                  Reset All
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

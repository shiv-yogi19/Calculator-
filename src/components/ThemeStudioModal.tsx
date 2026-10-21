import React, { useState } from 'react';
import {
  X,
  Palette,
  Shapes,
  Sliders,
  Check,
  RotateCcw,
  Plus,
  Trash2,
  Copy,
  Sparkles,
} from 'lucide-react';
import { useTheme, BUILT_IN_THEMES } from '../context/ThemeContext';
import { useCalculator } from '../context/CalculatorContext';
import { ThemeConfig, ButtonShapeType } from '../types';

export const ThemeStudioModal: React.FC = () => {
  const {
    currentTheme,
    allThemes,
    buttonShape,
    selectTheme,
    saveCustomTheme,
    deleteCustomTheme,
    updateButtonShape,
  } = useTheme();

  const { isThemeStudioOpen, setIsThemeStudioOpen } = useCalculator();

  const [activeTab, setActiveTab] = useState<'themes' | 'customizer' | 'shapes'>('themes');

  // Custom theme editor form state
  const [editingTheme, setEditingTheme] = useState<ThemeConfig>({
    ...currentTheme,
    id: `custom-${Date.now()}`,
    name: 'My Custom Theme',
    isCustom: true,
  });

  if (!isThemeStudioOpen) return null;

  const handleApplyPreset = (id: string) => {
    selectTheme(id);
    const target = allThemes.find((t) => t.id === id);
    if (target) {
      setEditingTheme({
        ...target,
        id: `custom-${Date.now()}`,
        name: `${target.name} (Custom)`,
        isCustom: true,
      });
    }
  };

  const handleSaveCustom = () => {
    saveCustomTheme(editingTheme);
    selectTheme(editingTheme.id);
    setActiveTab('themes');
  };

  const SHAPE_OPTIONS: { id: ButtonShapeType; label: string; iconShape: string }[] = [
    { id: 'rounded-square', label: 'Rounded Square', iconShape: 'rounded-xl' },
    { id: 'circle', label: 'Circle', iconShape: 'rounded-full' },
    { id: 'extra-rounded', label: 'Extra Rounded', iconShape: 'rounded-3xl' },
    { id: 'pill', label: 'Pill Shape', iconShape: 'rounded-full' },
    { id: 'square', label: 'Square', iconShape: 'rounded-sm' },
    { id: 'custom', label: 'Custom Radius', iconShape: 'rounded-lg' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full sm:max-w-xl h-[90vh] max-h-[750px] flex flex-col rounded-t-3xl sm:rounded-3xl border border-white/15 overflow-hidden shadow-2xl animate-in slide-in-from-bottom-6 duration-250"
        style={{
          backgroundColor: currentTheme.surface,
          color: currentTheme.numberText,
        }}
      >
        {/* Modal Top Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="p-2 rounded-xl"
              style={{
                backgroundColor: `${currentTheme.glowColor}25`,
                color: currentTheme.glowColor,
              }}
            >
              <Palette size={18} />
            </div>
            <div>
              <h2 className="font-bold text-base">Theme Studio & Shapes</h2>
              <p className="text-[11px] text-neutral-400">
                Liquid Glass · Material You · Custom Palettes
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsThemeStudioOpen(false)}
            className="p-2 rounded-xl hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Studio Sub-Tabs */}
        <div className="px-4 py-2 border-b border-white/10 flex items-center gap-2 bg-black/30">
          <button
            onClick={() => setActiveTab('themes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'themes' ? 'bg-white/20 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sparkles size={13} />
            <span>Theme Presets</span>
          </button>
          <button
            onClick={() => setActiveTab('customizer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'customizer' ? 'bg-white/20 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sliders size={13} />
            <span>Theme Editor</span>
          </button>
          <button
            onClick={() => setActiveTab('shapes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'shapes' ? 'bg-white/20 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Shapes size={13} />
            <span>Button Shapes</span>
          </button>
        </div>

        {/* Live Mini Keypad Preview Banner */}
        <div className="px-4 py-2 bg-black/50 border-b border-white/5 flex items-center justify-between">
          <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">
            Live Preview
          </span>
          <div className="flex items-center gap-2">
            <span
              className="px-3 py-1 text-xs font-mono-numbers font-bold rounded-lg border border-white/10"
              style={{
                backgroundColor: currentTheme.numberBtnBg,
                color: currentTheme.numberText,
              }}
            >
              7
            </span>
            <span
              className="px-3 py-1 text-xs font-mono-numbers font-bold rounded-lg border border-white/10"
              style={{
                backgroundColor: currentTheme.operatorBtnBg,
                color: currentTheme.operatorText,
              }}
            >
              +
            </span>
            <span
              className="px-4 py-1 text-xs font-mono-numbers font-bold rounded-lg shadow-md"
              style={{
                backgroundColor: currentTheme.equalsBtnBg,
                color: currentTheme.equalsText,
                boxShadow: `0 0 12px ${currentTheme.glowColor}60`,
              }}
            >
              =
            </span>
          </div>
        </div>

        {/* Tab 1: Theme Presets */}
        {activeTab === 'themes' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {allThemes.map((theme) => {
                const isSelected = currentTheme.id === theme.id;
                return (
                  <div
                    key={theme.id}
                    onClick={() => handleApplyPreset(theme.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                      isSelected
                        ? 'border-white/40 ring-2'
                        : 'border-white/10 hover:border-white/25 bg-black/30'
                    }`}
                    style={{
                      borderColor: isSelected ? theme.glowColor : undefined,
                      backgroundColor: theme.surface,
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3.5 h-3.5 rounded-full shadow-sm"
                          style={{ backgroundColor: theme.glowColor }}
                        />
                        <span className="font-bold text-sm text-white">{theme.name}</span>
                        {theme.isCustom && (
                          <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-white/20 text-white">
                            Custom
                          </span>
                        )}
                      </div>
                      {isSelected && (
                        <div
                          className="p-1 rounded-full text-black"
                          style={{ backgroundColor: theme.glowColor }}
                        >
                          <Check size={12} />
                        </div>
                      )}
                    </div>

                    {/* Color palette chips preview */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <span
                        className="w-5 h-5 rounded-md border border-white/10"
                        style={{ backgroundColor: theme.bg }}
                        title="Background"
                      />
                      <span
                        className="w-5 h-5 rounded-md border border-white/10"
                        style={{ backgroundColor: theme.numberBtnBg }}
                        title="Number Key"
                      />
                      <span
                        className="w-5 h-5 rounded-md border border-white/10 flex items-center justify-center text-[10px] font-bold"
                        style={{ backgroundColor: theme.operatorBtnBg, color: theme.operatorText }}
                        title="Operator"
                      >
                        +
                      </span>
                      <span
                        className="w-5 h-5 rounded-md shadow-sm flex items-center justify-center text-[10px] font-bold"
                        style={{ backgroundColor: theme.equalsBtnBg, color: theme.equalsText }}
                        title="Equals"
                      >
                        =
                      </span>
                    </div>

                    {/* Custom theme actions */}
                    {theme.isCustom && (
                      <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCustomTheme(theme.id);
                          }}
                          className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 p-1"
                        >
                          <Trash2 size={12} />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Create new theme prompt */}
            <div className="pt-2">
              <button
                onClick={() => {
                  setEditingTheme({
                    ...currentTheme,
                    id: `custom-${Date.now()}`,
                    name: 'New Custom Theme',
                    isCustom: true,
                  });
                  setActiveTab('customizer');
                }}
                className="w-full py-3 rounded-2xl border border-dashed border-white/20 hover:border-white/40 flex items-center justify-center gap-2 text-xs font-bold text-neutral-300 hover:text-white transition-all bg-white/5"
              >
                <Plus size={16} />
                <span>Create New Custom Theme</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Theme Customizer Editor */}
        {activeTab === 'customizer' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            <div>
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                Theme Name
              </label>
              <input
                type="text"
                value={editingTheme.name}
                onChange={(e) => setEditingTheme({ ...editingTheme, name: e.target.value })}
                className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-sm font-semibold text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Glow Color */}
              <div className="p-3 rounded-2xl bg-black/30 border border-white/10">
                <label className="text-[11px] font-semibold text-neutral-400 block mb-1.5">
                  Neon Glow Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={editingTheme.glowColor}
                    onChange={(e) => setEditingTheme({ ...editingTheme, glowColor: e.target.value })}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-xs font-mono">{editingTheme.glowColor}</span>
                </div>
              </div>

              {/* Equals Button Color */}
              <div className="p-3 rounded-2xl bg-black/30 border border-white/10">
                <label className="text-[11px] font-semibold text-neutral-400 block mb-1.5">
                  Equals Accent
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={editingTheme.equalsBtnBg}
                    onChange={(e) =>
                      setEditingTheme({
                        ...editingTheme,
                        equalsBtnBg: e.target.value,
                        glowColor: e.target.value,
                      })
                    }
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-xs font-mono">{editingTheme.equalsBtnBg}</span>
                </div>
              </div>

              {/* Background Color */}
              <div className="p-3 rounded-2xl bg-black/30 border border-white/10">
                <label className="text-[11px] font-semibold text-neutral-400 block mb-1.5">
                  Background
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={editingTheme.bg.startsWith('#') ? editingTheme.bg : '#0a0d10'}
                    onChange={(e) => setEditingTheme({ ...editingTheme, bg: e.target.value })}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-xs font-mono">{editingTheme.bg}</span>
                </div>
              </div>

              {/* Operator Text Color */}
              <div className="p-3 rounded-2xl bg-black/30 border border-white/10">
                <label className="text-[11px] font-semibold text-neutral-400 block mb-1.5">
                  Operator Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={editingTheme.operatorText.startsWith('#') ? editingTheme.operatorText : '#00e676'}
                    onChange={(e) => setEditingTheme({ ...editingTheme, operatorText: e.target.value })}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-xs font-mono">{editingTheme.operatorText}</span>
                </div>
              </div>
            </div>

            {/* Sliders for Glow & Glass */}
            <div className="space-y-3 p-3 rounded-2xl bg-black/30 border border-white/10">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-neutral-400">Glow Intensity</span>
                  <span className="font-mono font-bold">{editingTheme.glowIntensity}x</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="2.0"
                  step="0.1"
                  value={editingTheme.glowIntensity}
                  onChange={(e) =>
                    setEditingTheme({ ...editingTheme, glowIntensity: parseFloat(e.target.value) })
                  }
                  className="w-full accent-green-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-neutral-400">Glass Transparency</span>
                  <span className="font-mono font-bold">
                    {Math.round(editingTheme.surfaceTransparency * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="0.95"
                  step="0.05"
                  value={editingTheme.surfaceTransparency}
                  onChange={(e) =>
                    setEditingTheme({
                      ...editingTheme,
                      surfaceTransparency: parseFloat(e.target.value),
                    })
                  }
                  className="w-full accent-green-400"
                />
              </div>
            </div>

            {/* Save Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setActiveTab('themes')}
                className="flex-1 py-2.5 rounded-2xl bg-white/10 text-neutral-300 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCustom}
                className="flex-1 py-2.5 rounded-2xl text-black font-bold text-xs shadow-lg flex items-center justify-center gap-1.5"
                style={{ backgroundColor: currentTheme.glowColor }}
              >
                <Check size={14} />
                <span>Save & Apply Theme</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Button Shape Customizer */}
        {activeTab === 'shapes' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            <div>
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-2">
                Keypad Button Shape
              </span>
              <div className="grid grid-cols-3 gap-2">
                {SHAPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => updateButtonShape({ shape: opt.id })}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                      buttonShape.shape === opt.id
                        ? 'bg-white/20 border-white/40 shadow-sm text-white'
                        : 'bg-black/30 border-white/10 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 border border-white/40 ${opt.iconShape}`}
                      style={{
                        backgroundColor: buttonShape.shape === opt.id ? currentTheme.glowColor : 'transparent',
                      }}
                    />
                    <span className="text-[11px] font-semibold">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Shape Sliders */}
            <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 space-y-3.5">
              {buttonShape.shape === 'custom' && (
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-400">Custom Corner Radius</span>
                    <span className="font-mono font-bold">{buttonShape.customRadius} px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="36"
                    value={buttonShape.customRadius}
                    onChange={(e) =>
                      updateButtonShape({ customRadius: parseInt(e.target.value, 10) })
                    }
                    className="w-full accent-green-400"
                  />
                </div>
              )}

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-neutral-400">Button Height</span>
                  <span className="font-mono font-bold">{buttonShape.buttonHeight} px</span>
                </div>
                <input
                  type="range"
                  min="52"
                  max="80"
                  value={buttonShape.buttonHeight}
                  onChange={(e) =>
                    updateButtonShape({ buttonHeight: parseInt(e.target.value, 10) })
                  }
                  className="w-full accent-green-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-neutral-400">Button Spacing</span>
                  <span className="font-mono font-bold">{buttonShape.horizontalSpacing} px</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="16"
                  value={buttonShape.horizontalSpacing}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    updateButtonShape({ horizontalSpacing: val, verticalSpacing: val });
                  }}
                  className="w-full accent-green-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-neutral-400">Press Scale</span>
                  <span className="font-mono font-bold">{buttonShape.pressScale}</span>
                </div>
                <input
                  type="range"
                  min="0.88"
                  max="1.0"
                  step="0.02"
                  value={buttonShape.pressScale}
                  onChange={(e) =>
                    updateButtonShape({ pressScale: parseFloat(e.target.value) })
                  }
                  className="w-full accent-green-400"
                />
              </div>
            </div>

            {/* Reset Defaults button */}
            <button
              onClick={() => {
                updateButtonShape({
                  shape: 'rounded-square',
                  customRadius: 24,
                  buttonHeight: 68,
                  horizontalSpacing: 10,
                  verticalSpacing: 10,
                  pressScale: 0.94,
                });
              }}
              className="w-full py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 border border-white/10 transition-colors"
            >
              <RotateCcw size={13} />
              <span>Reset Button Shapes to Default</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

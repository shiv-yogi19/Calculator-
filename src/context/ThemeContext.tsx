import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ThemeConfig,
  ButtonShapeConfig,
  AnimationSettings,
  DisplaySettings,
  SoundHapticsSettings,
  BrandingSettings,
} from '../types';

// Preset themes
export const BUILT_IN_THEMES: ThemeConfig[] = [
  {
    id: 'neon-forest',
    name: 'Neon Forest',
    bg: '#050a06',
    surface: '#0d1810',
    keypadBg: '#09110a',
    numberBtnBg: 'rgba(25, 42, 30, 0.65)',
    numberText: '#e8f5e9',
    operatorBtnBg: 'rgba(0, 230, 118, 0.18)',
    operatorText: '#00e676',
    equalsBtnBg: '#00e676',
    equalsText: '#003314',
    clearBtnBg: 'rgba(255, 112, 67, 0.22)',
    clearText: '#ff7043',
    glowColor: '#00e676',
    glassTint: 'rgba(0, 230, 118, 0.08)',
    surfaceTransparency: 0.8,
    borderBrightness: 0.35,
    glowIntensity: 1.2,
  },
  {
    id: 'liquid-ice',
    name: 'Liquid Ice',
    bg: '#060d17',
    surface: '#0e1d2f',
    keypadBg: '#0a1422',
    numberBtnBg: 'rgba(23, 44, 71, 0.65)',
    numberText: '#e1f5fe',
    operatorBtnBg: 'rgba(0, 229, 255, 0.18)',
    operatorText: '#00e5ff',
    equalsBtnBg: '#00e5ff',
    equalsText: '#00252b',
    clearBtnBg: 'rgba(255, 82, 82, 0.22)',
    clearText: '#ff5252',
    glowColor: '#00e5ff',
    glassTint: 'rgba(0, 229, 255, 0.08)',
    surfaceTransparency: 0.8,
    borderBrightness: 0.4,
    glowIntensity: 1.2,
  },
  {
    id: 'cyber-violet',
    name: 'Cyber Violet',
    bg: '#0a0514',
    surface: '#1b0e33',
    keypadBg: '#120922',
    numberBtnBg: 'rgba(48, 23, 85, 0.65)',
    numberText: '#f3e5f5',
    operatorBtnBg: 'rgba(213, 0, 249, 0.18)',
    operatorText: '#e040fb',
    equalsBtnBg: '#d500f9',
    equalsText: '#26002f',
    clearBtnBg: 'rgba(255, 64, 129, 0.22)',
    clearText: '#ff4081',
    glowColor: '#d500f9',
    glassTint: 'rgba(213, 0, 249, 0.08)',
    surfaceTransparency: 0.8,
    borderBrightness: 0.38,
    glowIntensity: 1.25,
  },
  {
    id: 'amoled-black',
    name: 'AMOLED Black',
    bg: '#000000',
    surface: '#111111',
    keypadBg: '#070707',
    numberBtnBg: 'rgba(30, 30, 30, 0.8)',
    numberText: '#ffffff',
    operatorBtnBg: 'rgba(40, 40, 40, 0.8)',
    operatorText: '#69f0ae',
    equalsBtnBg: '#00e676',
    equalsText: '#000000',
    clearBtnBg: 'rgba(45, 25, 25, 0.8)',
    clearText: '#ff5252',
    glowColor: '#69f0ae',
    glassTint: 'rgba(255, 255, 255, 0.03)',
    surfaceTransparency: 0.9,
    borderBrightness: 0.2,
    glowIntensity: 1.0,
  },
  {
    id: 'material-dynamic',
    name: 'Material Dynamic',
    bg: '#141318',
    surface: '#1f1b24',
    keypadBg: '#18151e',
    numberBtnBg: 'rgba(49, 44, 58, 0.7)',
    numberText: '#e6e0e9',
    operatorBtnBg: 'rgba(208, 188, 255, 0.2)',
    operatorText: '#d0bcff',
    equalsBtnBg: '#d0bcff',
    equalsText: '#381e72',
    clearBtnBg: 'rgba(242, 184, 181, 0.2)',
    clearText: '#f2b8b5',
    glowColor: '#d0bcff',
    glassTint: 'rgba(208, 188, 255, 0.08)',
    surfaceTransparency: 0.82,
    borderBrightness: 0.3,
    glowIntensity: 1.1,
  },
  {
    id: 'light-glass',
    name: 'Light Glass',
    bg: '#f0f4f8',
    surface: '#ffffff',
    keypadBg: '#e6ecf3',
    numberBtnBg: 'rgba(255, 255, 255, 0.85)',
    numberText: '#1a202c',
    operatorBtnBg: 'rgba(0, 137, 123, 0.15)',
    operatorText: '#00796b',
    equalsBtnBg: '#00897b',
    equalsText: '#ffffff',
    clearBtnBg: 'rgba(229, 57, 53, 0.12)',
    clearText: '#d32f2f',
    glowColor: '#00897b',
    glassTint: 'rgba(0, 137, 123, 0.06)',
    surfaceTransparency: 0.7,
    borderBrightness: 0.6,
    glowIntensity: 0.8,
  },
  {
    id: 'pure-minimal',
    name: 'Pure Minimal',
    bg: '#0c0d0e',
    surface: '#151719',
    keypadBg: '#101113',
    numberBtnBg: 'rgba(35, 38, 42, 0.6)',
    numberText: '#f0f2f5',
    operatorBtnBg: 'rgba(50, 55, 60, 0.6)',
    operatorText: '#a0aab5',
    equalsBtnBg: '#ffffff',
    equalsText: '#0c0d0e',
    clearBtnBg: 'rgba(50, 55, 60, 0.6)',
    clearText: '#a0aab5',
    glowColor: '#ffffff',
    glassTint: 'rgba(255, 255, 255, 0.03)',
    surfaceTransparency: 0.85,
    borderBrightness: 0.15,
    glowIntensity: 0.5,
  },
];

const DEFAULT_BUTTON_SHAPE: ButtonShapeConfig = {
  shape: 'rounded-square',
  customRadius: 24,
  buttonHeight: 68,
  horizontalSpacing: 10,
  verticalSpacing: 10,
  borderThickness: 1,
  borderBrightness: 0.35,
  glowBorder: true,
  surfaceTransparency: 0.8,
  pressScale: 0.94,
};

const DEFAULT_ANIMATION: AnimationSettings = {
  glowEnabled: true,
  glowIntensity: 'vivid',
  glowDuration: 350,
  rippleEnabled: true,
  pressAnimationEnabled: true,
  numberGlowEnabled: true,
  resultAnimationSpeed: 'normal',
  reduceMotion: false,
};

const DEFAULT_DISPLAY: DisplaySettings = {
  numberFormatting: 'standard',
  decimalPrecision: 10,
  thousandSeparators: true,
  fontSize: 'large',
};

const DEFAULT_SOUND_HAPTICS: SoundHapticsSettings = {
  soundEnabled: true,
  soundVolume: 0.4,
  hapticsEnabled: true,
  vibrationIntensity: 'light',
};

const DEFAULT_BRANDING: BrandingSettings = {
  appName: 'NEXCAL',
  developerCredit: 'Created By Shiv Yogi',
  logoPreset: 'neon-matrix',
  showOpeningAnimation: true,
};

interface ThemeContextType {
  currentTheme: ThemeConfig;
  allThemes: ThemeConfig[];
  buttonShape: ButtonShapeConfig;
  animationSettings: AnimationSettings;
  displaySettings: DisplaySettings;
  soundHapticsSettings: SoundHapticsSettings;
  brandingSettings: BrandingSettings;
  useAndroidFrame: boolean;
  setUseAndroidFrame: (val: boolean) => void;
  selectTheme: (id: string) => void;
  saveCustomTheme: (theme: ThemeConfig) => void;
  deleteCustomTheme: (id: string) => void;
  updateButtonShape: (shape: Partial<ButtonShapeConfig>) => void;
  updateAnimationSettings: (settings: Partial<AnimationSettings>) => void;
  updateDisplaySettings: (settings: Partial<DisplaySettings>) => void;
  updateSoundHapticsSettings: (settings: Partial<SoundHapticsSettings>) => void;
  updateBrandingSettings: (settings: Partial<BrandingSettings>) => void;
  resetAllSettings: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states from localStorage with safe fallbacks
  const [currentThemeId, setCurrentThemeId] = useState<string>(() => {
    return localStorage.getItem('nexcal_theme_id') || 'neon-forest';
  });

  const [customThemes, setCustomThemes] = useState<ThemeConfig[]>(() => {
    try {
      const saved = localStorage.getItem('nexcal_custom_themes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [buttonShape, setButtonShape] = useState<ButtonShapeConfig>(() => {
    try {
      const saved = localStorage.getItem('nexcal_button_shape');
      return saved ? { ...DEFAULT_BUTTON_SHAPE, ...JSON.parse(saved) } : DEFAULT_BUTTON_SHAPE;
    } catch {
      return DEFAULT_BUTTON_SHAPE;
    }
  });

  const [animationSettings, setAnimationSettings] = useState<AnimationSettings>(() => {
    try {
      const saved = localStorage.getItem('nexcal_animation');
      return saved ? { ...DEFAULT_ANIMATION, ...JSON.parse(saved) } : DEFAULT_ANIMATION;
    } catch {
      return DEFAULT_ANIMATION;
    }
  });

  const [displaySettings, setDisplaySettings] = useState<DisplaySettings>(() => {
    try {
      const saved = localStorage.getItem('nexcal_display');
      return saved ? { ...DEFAULT_DISPLAY, ...JSON.parse(saved) } : DEFAULT_DISPLAY;
    } catch {
      return DEFAULT_DISPLAY;
    }
  });

  const [soundHapticsSettings, setSoundHapticsSettings] = useState<SoundHapticsSettings>(() => {
    try {
      const saved = localStorage.getItem('nexcal_sound_haptics');
      return saved ? { ...DEFAULT_SOUND_HAPTICS, ...JSON.parse(saved) } : DEFAULT_SOUND_HAPTICS;
    } catch {
      return DEFAULT_SOUND_HAPTICS;
    }
  });

  const [brandingSettings, setBrandingSettings] = useState<BrandingSettings>(() => {
    try {
      const saved = localStorage.getItem('nexcal_branding');
      return saved ? { ...DEFAULT_BRANDING, ...JSON.parse(saved) } : DEFAULT_BRANDING;
    } catch {
      return DEFAULT_BRANDING;
    }
  });

  const [useAndroidFrame, setUseAndroidFrame] = useState<boolean>(() => {
    const saved = localStorage.getItem('nexcal_android_frame');
    return saved !== null ? saved === 'true' : true; // Default to phone preview frame
  });

  // Combined themes
  const allThemes = [...BUILT_IN_THEMES, ...customThemes];
  const currentTheme = allThemes.find((t) => t.id === currentThemeId) || BUILT_IN_THEMES[0];

  // Persist handlers
  useEffect(() => {
    localStorage.setItem('nexcal_theme_id', currentThemeId);
  }, [currentThemeId]);

  useEffect(() => {
    localStorage.setItem('nexcal_custom_themes', JSON.stringify(customThemes));
  }, [customThemes]);

  useEffect(() => {
    localStorage.setItem('nexcal_button_shape', JSON.stringify(buttonShape));
  }, [buttonShape]);

  useEffect(() => {
    localStorage.setItem('nexcal_animation', JSON.stringify(animationSettings));
  }, [animationSettings]);

  useEffect(() => {
    localStorage.setItem('nexcal_display', JSON.stringify(displaySettings));
  }, [displaySettings]);

  useEffect(() => {
    localStorage.setItem('nexcal_sound_haptics', JSON.stringify(soundHapticsSettings));
  }, [soundHapticsSettings]);

  useEffect(() => {
    localStorage.setItem('nexcal_branding', JSON.stringify(brandingSettings));
  }, [brandingSettings]);

  useEffect(() => {
    localStorage.setItem('nexcal_android_frame', String(useAndroidFrame));
  }, [useAndroidFrame]);

  const selectTheme = (id: string) => {
    setCurrentThemeId(id);
  };

  const saveCustomTheme = (newTheme: ThemeConfig) => {
    setCustomThemes((prev) => {
      const existingIdx = prev.findIndex((t) => t.id === newTheme.id);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = { ...newTheme, isCustom: true };
        return copy;
      }
      return [...prev, { ...newTheme, isCustom: true }];
    });
    setCurrentThemeId(newTheme.id);
  };

  const deleteCustomTheme = (id: string) => {
    setCustomThemes((prev) => prev.filter((t) => t.id !== id));
    if (currentThemeId === id) {
      setCurrentThemeId('neon-forest');
    }
  };

  const updateButtonShape = (changes: Partial<ButtonShapeConfig>) => {
    setButtonShape((prev) => ({ ...prev, ...changes }));
  };

  const updateAnimationSettings = (changes: Partial<AnimationSettings>) => {
    setAnimationSettings((prev) => ({ ...prev, ...changes }));
  };

  const updateDisplaySettings = (changes: Partial<DisplaySettings>) => {
    setDisplaySettings((prev) => ({ ...prev, ...changes }));
  };

  const updateSoundHapticsSettings = (changes: Partial<SoundHapticsSettings>) => {
    setSoundHapticsSettings((prev) => ({ ...prev, ...changes }));
  };

  const updateBrandingSettings = (changes: Partial<BrandingSettings>) => {
    setBrandingSettings((prev) => ({ ...prev, ...changes }));
  };

  const resetAllSettings = () => {
    setCurrentThemeId('neon-forest');
    setButtonShape(DEFAULT_BUTTON_SHAPE);
    setAnimationSettings(DEFAULT_ANIMATION);
    setDisplaySettings(DEFAULT_DISPLAY);
    setSoundHapticsSettings(DEFAULT_SOUND_HAPTICS);
    setBrandingSettings(DEFAULT_BRANDING);
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        allThemes,
        buttonShape,
        animationSettings,
        displaySettings,
        soundHapticsSettings,
        brandingSettings,
        useAndroidFrame,
        setUseAndroidFrame,
        selectTheme,
        saveCustomTheme,
        deleteCustomTheme,
        updateButtonShape,
        updateAnimationSettings,
        updateDisplaySettings,
        updateSoundHapticsSettings,
        updateBrandingSettings,
        resetAllSettings,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export type AngleMode = 'DEG' | 'RAD';

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
  type: 'basic' | 'scientific' | 'percentage' | 'tool';
}

export interface ThemeConfig {
  id: string;
  name: string;
  isCustom?: boolean;
  bg: string;
  surface: string;
  keypadBg: string;
  numberBtnBg: string;
  numberText: string;
  operatorBtnBg: string;
  operatorText: string;
  equalsBtnBg: string;
  equalsText: string;
  clearBtnBg: string;
  clearText: string;
  glowColor: string;
  glassTint: string;
  surfaceTransparency: number; // 0 to 1
  borderBrightness: number; // 0 to 1
  glowIntensity: number; // 0 to 2
}

export type ButtonShapeType = 'circle' | 'rounded-square' | 'extra-rounded' | 'square' | 'pill' | 'custom';

export interface ButtonShapeConfig {
  shape: ButtonShapeType;
  customRadius: number; // in px
  buttonHeight: number; // in px
  horizontalSpacing: number; // in px
  verticalSpacing: number; // in px
  borderThickness: number; // in px
  borderBrightness: number; // 0 to 1
  glowBorder: boolean;
  surfaceTransparency: number; // 0 to 1
  pressScale: number; // e.g. 0.94
}

export interface AnimationSettings {
  glowEnabled: boolean;
  glowIntensity: 'subtle' | 'standard' | 'vivid' | 'ultra';
  glowDuration: number; // ms
  rippleEnabled: boolean;
  pressAnimationEnabled: boolean;
  numberGlowEnabled: boolean;
  resultAnimationSpeed: 'fast' | 'normal' | 'smooth';
  reduceMotion: boolean;
}

export interface DisplaySettings {
  numberFormatting: 'standard' | 'scientific';
  decimalPrecision: number;
  thousandSeparators: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

export interface SoundHapticsSettings {
  soundEnabled: boolean;
  soundVolume: number; // 0 to 1
  hapticsEnabled: boolean;
  vibrationIntensity: 'light' | 'medium' | 'heavy';
}

export interface BrandingSettings {
  appName: string;
  developerCredit: string;
  logoPreset: 'neon-matrix' | 'liquid-ice' | 'cyber-violet' | 'material-you' | 'minimal' | 'custom';
  customLogoUrl?: string;
  showOpeningAnimation: boolean;
}

export type NavigationTab = 'calculator' | 'converter' | 'tools';

export type ConverterCategory =
  | 'length'
  | 'weight'
  | 'temperature'
  | 'area'
  | 'volume'
  | 'time'
  | 'speed'
  | 'storage'
  | 'currency';

export interface UnitDefinition {
  id: string;
  name: string;
  symbol: string;
  ratio: number; // Base unit ratio or special handler
  offset?: number;
}

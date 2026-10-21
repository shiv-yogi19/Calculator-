import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AngleMode, HistoryItem, NavigationTab } from '../types';
import { evaluateExpression, getLivePreview, formatResultNumber } from '../utils/mathEngine';
import { soundHaptics } from '../utils/soundHaptics';
import { useTheme } from './ThemeContext';

interface CalculatorContextType {
  expression: string;
  previewResult: string | null;
  lastCalculatedResult: string | null;
  isEvaluated: boolean;
  hasError: boolean;
  errorMessage: string | null;
  angleMode: AngleMode;
  memory: number;
  isScientificOpen: boolean;
  activeOperator: string | null;
  lastPressedButton: string | null;
  activeTab: NavigationTab;
  history: HistoryItem[];
  // Modals
  isHistoryOpen: boolean;
  isThemeStudioOpen: boolean;
  isSettingsOpen: boolean;
  isAboutOpen: boolean;
  isPrivacyOpen: boolean;
  isAndroidExportOpen: boolean;
  copiedToast: string | null;

  // Actions
  setActiveTab: (tab: NavigationTab) => void;
  toggleScientific: () => void;
  setIsScientificOpen: (val: boolean) => void;
  inputDigit: (digit: string) => void;
  inputOperator: (operator: string) => void;
  inputFunction: (fn: string) => void;
  inputParenthesis: (p: '(' | ')') => void;
  inputDecimal: () => void;
  toggleSign: () => void;
  backspace: () => void;
  clearAll: () => void;
  calculateEquals: () => void;
  toggleAngleMode: () => void;
  memoryClear: () => void;
  memoryRecall: () => void;
  memoryAdd: () => void;
  memorySubtract: () => void;
  copyExpression: () => void;
  copyResult: () => void;
  pasteToExpression: () => Promise<void>;
  deleteHistoryItem: (id: string) => void;
  clearAllHistory: () => void;
  reuseHistoryItem: (item: HistoryItem) => void;
  restoreHistoryExpression: (item: HistoryItem) => void;

  // Modal setters
  setIsHistoryOpen: (val: boolean) => void;
  setIsThemeStudioOpen: (val: boolean) => void;
  setIsSettingsOpen: (val: boolean) => void;
  setIsAboutOpen: (val: boolean) => void;
  setIsPrivacyOpen: (val: boolean) => void;
  setIsAndroidExportOpen: (val: boolean) => void;
}

const CalculatorContext = createContext<CalculatorContextType | null>(null);

export const CalculatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { soundHapticsSettings } = useTheme();

  const [expression, setExpression] = useState<string>('');
  const [previewResult, setPreviewResult] = useState<string | null>(null);
  const [lastCalculatedResult, setLastCalculatedResult] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [angleMode, setAngleMode] = useState<AngleMode>('DEG');
  const [memory, setMemory] = useState<number>(0);
  const [isScientificOpen, setIsScientificOpen] = useState<boolean>(false);
  const [activeOperator, setActiveOperator] = useState<string | null>(null);
  const [lastPressedButton, setLastPressedButton] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<NavigationTab>('calculator');
  const [copiedToast, setCopiedToast] = useState<string | null>(null);

  // Modals
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isThemeStudioOpen, setIsThemeStudioOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);
  const [isAndroidExportOpen, setIsAndroidExportOpen] = useState<boolean>(false);

  // History state
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('nexcal_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('nexcal_history', JSON.stringify(history));
  }, [history]);

  // Audio/Haptic trigger helper
  const triggerFeedback = useCallback(
    (type: 'number' | 'operator' | 'equals' | 'clear' | 'toggle') => {
      if (soundHapticsSettings.soundEnabled) {
        soundHaptics.playClick(type, soundHapticsSettings.soundVolume);
      }
      if (soundHapticsSettings.hapticsEnabled) {
        soundHaptics.triggerVibration(soundHapticsSettings.vibrationIntensity);
      }
    },
    [soundHapticsSettings]
  );

  // Auto calculate live preview whenever expression or angle mode changes
  useEffect(() => {
    if (isEvaluated || !expression) {
      setPreviewResult(null);
      return;
    }
    const preview = getLivePreview(expression, angleMode);
    setPreviewResult(preview);
  }, [expression, angleMode, isEvaluated]);

  // Detect active trailing operator
  useEffect(() => {
    const match = expression.match(/([+\-×÷%^]|mod)\s*$/);
    if (match) {
      setActiveOperator(match[1]);
    } else {
      setActiveOperator(null);
    }
  }, [expression]);

  const showToast = (msg: string) => {
    setCopiedToast(msg);
    setTimeout(() => {
      setCopiedToast(null);
    }, 2000);
  };

  // Button actions
  const inputDigit = (digit: string) => {
    triggerFeedback('number');
    setLastPressedButton(digit);

    if (hasError || isEvaluated) {
      // Start fresh expression
      setExpression(digit);
      setIsEvaluated(false);
      setHasError(false);
      setErrorMessage(null);
      return;
    }

    setExpression((prev) => prev + digit);
  };

  const inputOperator = (operator: string) => {
    triggerFeedback('operator');
    setLastPressedButton(operator);

    if (hasError) {
      setHasError(false);
      setErrorMessage(null);
    }

    if (isEvaluated && lastCalculatedResult) {
      // Continue from previous answer
      setExpression(lastCalculatedResult + ' ' + operator + ' ');
      setIsEvaluated(false);
      return;
    }

    // Replace trailing operator if already typed one
    setExpression((prev) => {
      if (!prev) {
        if (operator === '−' || operator === '-') return '−';
        return '';
      }
      const trimmed = prev.trim();
      if (/[+\-×÷%^]$/.test(trimmed)) {
        return trimmed.slice(0, -1) + operator + ' ';
      }
      return prev + ' ' + operator + ' ';
    });
  };

  const inputDecimal = () => {
    triggerFeedback('number');
    setLastPressedButton('.');

    if (hasError || isEvaluated) {
      setExpression('0.');
      setIsEvaluated(false);
      setHasError(false);
      setErrorMessage(null);
      return;
    }

    setExpression((prev) => {
      if (!prev) return '0.';
      // Find the last number token
      const tokens = prev.split(/[\s+\-×÷%^()]+/);
      const currentToken = tokens[tokens.length - 1];
      if (currentToken.includes('.')) {
        return prev; // already has decimal point
      }
      if (currentToken === '') {
        return prev + '0.';
      }
      return prev + '.';
    });
  };

  const inputParenthesis = (p: '(' | ')') => {
    triggerFeedback('operator');
    setLastPressedButton(p);

    if (hasError || isEvaluated) {
      setExpression(p);
      setIsEvaluated(false);
      setHasError(false);
      return;
    }

    setExpression((prev) => prev + p);
  };

  const inputFunction = (fn: string) => {
    triggerFeedback('operator');
    setLastPressedButton(fn);

    if (hasError || isEvaluated) {
      setIsEvaluated(false);
      setHasError(false);
      setErrorMessage(null);
    }

    // Constant numbers
    if (fn === 'π') {
      setExpression((prev) => prev + 'π');
      return;
    }
    if (fn === 'e') {
      setExpression((prev) => prev + 'e');
      return;
    }

    // Powers
    if (fn === '^2') {
      setExpression((prev) => prev + '^2');
      return;
    }
    if (fn === '^3') {
      setExpression((prev) => prev + '^3');
      return;
    }
    if (fn === '^') {
      setExpression((prev) => prev + '^');
      return;
    }
    if (fn === '!') {
      setExpression((prev) => prev + '!');
      return;
    }

    // Prefixed functions e.g. sin(
    setExpression((prev) => prev + `${fn}(`);
  };

  const toggleSign = () => {
    triggerFeedback('operator');
    if (hasError) return;

    if (isEvaluated && lastCalculatedResult) {
      const num = parseFloat(lastCalculatedResult);
      const inverted = -num;
      setExpression(inverted.toString());
      setLastCalculatedResult(inverted.toString());
      return;
    }

    setExpression((prev) => {
      if (!prev) return '−';
      if (prev.startsWith('−')) return prev.slice(1);
      if (prev.startsWith('-')) return prev.slice(1);
      return '−' + prev;
    });
  };

  const backspace = () => {
    triggerFeedback('clear');
    setLastPressedButton('backspace');

    if (hasError || isEvaluated) {
      setExpression('');
      setIsEvaluated(false);
      setHasError(false);
      setErrorMessage(null);
      return;
    }

    setExpression((prev) => {
      if (!prev || prev.length <= 1) return '';
      // Check multi-character function tokens at end (e.g. "sin(", "cos(", "log(")
      const fnMatch = prev.match(/(asin|acos|atan|sqrt|cbrt|sin|cos|tan|log|ln)\($/);
      if (fnMatch) {
        return prev.slice(0, -fnMatch[0].length);
      }
      // Check spaces
      if (prev.endsWith(' ')) {
        return prev.slice(0, -2);
      }
      return prev.slice(0, -1);
    });
  };

  const clearAll = () => {
    triggerFeedback('clear');
    setLastPressedButton('C');
    setExpression('');
    setPreviewResult(null);
    setLastCalculatedResult(null);
    setIsEvaluated(false);
    setHasError(false);
    setErrorMessage(null);
  };

  const calculateEquals = () => {
    triggerFeedback('equals');
    setLastPressedButton('=');

    if (!expression || expression.trim() === '') return;

    // Check if open parentheses need closing
    let openCount = 0;
    for (const c of expression) {
      if (c === '(') openCount++;
      if (c === ')') openCount--;
    }
    let fullExpr = expression.trim();
    if (openCount > 0) {
      fullExpr += ')'.repeat(openCount);
      setExpression(fullExpr);
    }

    const { result, error } = evaluateExpression(fullExpr, angleMode);

    if (error !== null || result === null) {
      setHasError(true);
      setErrorMessage(error || 'Invalid expression');
      return;
    }

    const formatted = formatResultNumber(result);
    setLastCalculatedResult(formatted);
    setIsEvaluated(true);
    setHasError(false);
    setErrorMessage(null);

    // Save to history
    const historyItem: HistoryItem = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
      expression: fullExpr,
      result: formatted,
      timestamp: Date.now(),
      type: isScientificOpen ? 'scientific' : 'basic',
    };

    setHistory((prev) => [historyItem, ...prev.slice(0, 99)]); // keep up to 100 entries
  };

  const toggleAngleMode = () => {
    triggerFeedback('toggle');
    setAngleMode((prev) => (prev === 'DEG' ? 'RAD' : 'DEG'));
  };

  const toggleScientific = () => {
    triggerFeedback('toggle');
    setIsScientificOpen((prev) => !prev);
  };

  // Memory functions
  const memoryClear = () => {
    triggerFeedback('toggle');
    setMemory(0);
    showToast('Memory Cleared (MC)');
  };

  const memoryRecall = () => {
    triggerFeedback('number');
    const val = memory.toString();
    setExpression((prev) => prev + val);
    showToast(`Memory Recalled: ${val}`);
  };

  const memoryAdd = () => {
    triggerFeedback('operator');
    const target = isEvaluated && lastCalculatedResult ? lastCalculatedResult : previewResult;
    if (target) {
      const num = parseFloat(target.replace(/,/g, ''));
      if (!isNaN(num)) {
        setMemory((prev) => prev + num);
        showToast(`Added to Memory (M+)`);
      }
    }
  };

  const memorySubtract = () => {
    triggerFeedback('operator');
    const target = isEvaluated && lastCalculatedResult ? lastCalculatedResult : previewResult;
    if (target) {
      const num = parseFloat(target.replace(/,/g, ''));
      if (!isNaN(num)) {
        setMemory((prev) => prev - num);
        showToast(`Subtracted from Memory (M−)`);
      }
    }
  };

  // Clipboard
  const copyExpression = () => {
    if (!expression) return;
    navigator.clipboard.writeText(expression);
    showToast('Expression copied');
  };

  const copyResult = () => {
    const val = isEvaluated ? lastCalculatedResult : previewResult;
    if (!val) return;
    navigator.clipboard.writeText(val);
    showToast('Result copied');
  };

  const pasteToExpression = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) return;
      // Sanitize: allow numbers and valid math symbols
      const sanitized = text.replace(/[^0-9+\-*/÷×%.()^!eπ\s]/g, '');
      if (sanitized) {
        setExpression((prev) => prev + sanitized);
        showToast('Pasted');
      } else {
        showToast('Clipboard has no valid numbers');
      }
    } catch {
      showToast('Clipboard access denied');
    }
  };

  // History operations
  const deleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const clearAllHistory = () => {
    setHistory([]);
    showToast('History cleared');
  };

  const reuseHistoryItem = (item: HistoryItem) => {
    setExpression(item.result);
    setLastCalculatedResult(item.result);
    setIsEvaluated(true);
    setIsHistoryOpen(false);
  };

  const restoreHistoryExpression = (item: HistoryItem) => {
    setExpression(item.expression);
    setIsEvaluated(false);
    setIsHistoryOpen(false);
  };

  return (
    <CalculatorContext.Provider
      value={{
        expression,
        previewResult,
        lastCalculatedResult,
        isEvaluated,
        hasError,
        errorMessage,
        angleMode,
        memory,
        isScientificOpen,
        activeOperator,
        lastPressedButton,
        activeTab,
        history,
        isHistoryOpen,
        isThemeStudioOpen,
        isSettingsOpen,
        isAboutOpen,
        isPrivacyOpen,
        isAndroidExportOpen,
        copiedToast,
        setActiveTab,
        toggleScientific,
        setIsScientificOpen,
        inputDigit,
        inputOperator,
        inputFunction,
        inputParenthesis,
        inputDecimal,
        toggleSign,
        backspace,
        clearAll,
        calculateEquals,
        toggleAngleMode,
        memoryClear,
        memoryRecall,
        memoryAdd,
        memorySubtract,
        copyExpression,
        copyResult,
        pasteToExpression,
        deleteHistoryItem,
        clearAllHistory,
        reuseHistoryItem,
        restoreHistoryExpression,
        setIsHistoryOpen,
        setIsThemeStudioOpen,
        setIsSettingsOpen,
        setIsAboutOpen,
        setIsPrivacyOpen,
        setIsAndroidExportOpen,
      }}
    >
      {children}
    </CalculatorContext.Provider>
  );
};

export const useCalculator = () => {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error('useCalculator must be used within CalculatorProvider');
  }
  return context;
};

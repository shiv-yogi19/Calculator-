import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { CalculatorProvider, useCalculator } from './context/CalculatorContext';
import { AndroidFrame } from './components/AndroidFrame';
import { HeaderNav } from './components/HeaderNav';
import { CalculatorDisplay } from './components/CalculatorDisplay';
import { Keypad } from './components/Keypad';
import { ScientificKeypad } from './components/ScientificKeypad';
import { ConverterView } from './components/ConverterView';
import { AdditionalToolsView } from './components/AdditionalToolsView';
import { HistoryModal } from './components/HistoryModal';
import { ThemeStudioModal } from './components/ThemeStudioModal';
import { SettingsModal } from './components/SettingsModal';
import { AboutModal } from './components/AboutModal';
import { PrivacyModal } from './components/PrivacyModal';
import { AndroidExportModal } from './components/AndroidExportModal';
import { OpeningSplash } from './components/OpeningSplash';

const MainAppContent: React.FC = () => {
  const {
    activeTab,
    inputDigit,
    inputOperator,
    inputDecimal,
    backspace,
    clearAll,
    calculateEquals,
    inputParenthesis,
  } = useCalculator();

  const [splashFinished, setSplashFinished] = useState<boolean>(() => {
    // Check if session already played opening animation
    return sessionStorage.getItem('nexcal_splash_done') === 'true';
  });

  const handleSplashDone = () => {
    setSplashFinished(true);
    sessionStorage.setItem('nexcal_splash_done', 'true');
  };

  // Physical keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if an input element has focus
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        inputDigit(e.key);
      } else if (e.key === '.') {
        inputDecimal();
      } else if (e.key === '+') {
        inputOperator('+');
      } else if (e.key === '-') {
        inputOperator('−');
      } else if (e.key === '*') {
        inputOperator('×');
      } else if (e.key === '/') {
        e.preventDefault();
        inputOperator('÷');
      } else if (e.key === '%') {
        inputOperator('%');
      } else if (e.key === '(' || e.key === ')') {
        inputParenthesis(e.key as '(' | ')');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculateEquals();
      } else if (e.key === 'Backspace') {
        backspace();
      } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
        clearAll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputDigit, inputOperator, inputDecimal, backspace, clearAll, calculateEquals, inputParenthesis]);

  return (
    <>
      {!splashFinished && <OpeningSplash onComplete={handleSplashDone} />}

      <AndroidFrame>
        {/* Top bar with tabs, DEG/RAD, memory badge, and overflow menu */}
        <HeaderNav />

        {/* View switching based on active tab */}
        {activeTab === 'calculator' && (
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            <CalculatorDisplay />
            <ScientificKeypad />
            <Keypad />
          </div>
        )}

        {activeTab === 'converter' && <ConverterView />}

        {activeTab === 'tools' && <AdditionalToolsView />}

        {/* Modals & Drawers */}
        <HistoryModal />
        <ThemeStudioModal />
        <SettingsModal />
        <AboutModal />
        <PrivacyModal />
        <AndroidExportModal />
      </AndroidFrame>
    </>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <CalculatorProvider>
        <MainAppContent />
      </CalculatorProvider>
    </ThemeProvider>
  );
}

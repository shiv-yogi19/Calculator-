import React from 'react';
import { Delete, Binary } from 'lucide-react';
import { useCalculator } from '../context/CalculatorContext';
import { useTheme } from '../context/ThemeContext';
import { CalcButton } from './CalcButton';

export const Keypad: React.FC = () => {
  const {
    inputDigit,
    inputOperator,
    inputDecimal,
    backspace,
    clearAll,
    calculateEquals,
    toggleScientific,
    isScientificOpen,
    activeOperator,
    lastPressedButton,
  } = useCalculator();

  const { buttonShape } = useTheme();

  return (
    <div
      className="p-3 select-none flex flex-col justify-end"
      style={{
        gap: `${buttonShape.verticalSpacing}px`,
      }}
    >
      {/* Row 1: Clear, Backspace, %, ÷ */}
      <div
        className="grid grid-cols-4"
        style={{ gap: `${buttonShape.horizontalSpacing}px` }}
      >
        <CalcButton
          label="C"
          value="C"
          onClick={clearAll}
          type="clear"
          ariaLabel="Clear All"
        />
        <CalcButton
          label={<Delete size={22} />}
          value="backspace"
          onClick={backspace}
          type="clear"
          ariaLabel="Backspace"
        />
        <CalcButton
          label="%"
          value="%"
          onClick={() => inputOperator('%')}
          type="operator"
          isActive={activeOperator === '%'}
          ariaLabel="Percent"
        />
        <CalcButton
          label="÷"
          value="÷"
          onClick={() => inputOperator('÷')}
          type="operator"
          isActive={activeOperator === '÷' || activeOperator === '/'}
          ariaLabel="Divide"
        />
      </div>

      {/* Row 2: 7, 8, 9, × */}
      <div
        className="grid grid-cols-4"
        style={{ gap: `${buttonShape.horizontalSpacing}px` }}
      >
        <CalcButton
          label="7"
          value="7"
          onClick={() => inputDigit('7')}
          type="number"
          isSpecialGlow={lastPressedButton === '7'}
        />
        <CalcButton
          label="8"
          value="8"
          onClick={() => inputDigit('8')}
          type="number"
          isSpecialGlow={lastPressedButton === '8'}
        />
        <CalcButton
          label="9"
          value="9"
          onClick={() => inputDigit('9')}
          type="number"
          isSpecialGlow={lastPressedButton === '9'}
        />
        <CalcButton
          label="×"
          value="×"
          onClick={() => inputOperator('×')}
          type="operator"
          isActive={activeOperator === '×' || activeOperator === '*'}
          ariaLabel="Multiply"
        />
      </div>

      {/* Row 3: 4, 5, 6, − */}
      <div
        className="grid grid-cols-4"
        style={{ gap: `${buttonShape.horizontalSpacing}px` }}
      >
        <CalcButton
          label="4"
          value="4"
          onClick={() => inputDigit('4')}
          type="number"
          isSpecialGlow={lastPressedButton === '4'}
        />
        <CalcButton
          label="5"
          value="5"
          onClick={() => inputDigit('5')}
          type="number"
          isSpecialGlow={lastPressedButton === '5'}
        />
        <CalcButton
          label="6"
          value="6"
          onClick={() => inputDigit('6')}
          type="number"
          isSpecialGlow={lastPressedButton === '6'}
        />
        <CalcButton
          label="−"
          value="−"
          onClick={() => inputOperator('−')}
          type="operator"
          isActive={activeOperator === '−' || activeOperator === '-'}
          ariaLabel="Subtract"
        />
      </div>

      {/* Row 4: 1, 2, 3, + */}
      <div
        className="grid grid-cols-4"
        style={{ gap: `${buttonShape.horizontalSpacing}px` }}
      >
        <CalcButton
          label="1"
          value="1"
          onClick={() => inputDigit('1')}
          type="number"
          isSpecialGlow={lastPressedButton === '1'}
        />
        <CalcButton
          label="2"
          value="2"
          onClick={() => inputDigit('2')}
          type="number"
          isSpecialGlow={lastPressedButton === '2'}
        />
        <CalcButton
          label="3"
          value="3"
          onClick={() => inputDigit('3')}
          type="number"
          isSpecialGlow={lastPressedButton === '3'}
        />
        <CalcButton
          label="+"
          value="+"
          onClick={() => inputOperator('+')}
          type="operator"
          isActive={activeOperator === '+'}
          ariaLabel="Add"
        />
      </div>

      {/* Row 5: Scientific Mode Toggle, 0, Decimal Point, Equals */}
      <div
        className="grid grid-cols-4"
        style={{ gap: `${buttonShape.horizontalSpacing}px` }}
      >
        <CalcButton
          label={<Binary size={22} />}
          value="sci"
          onClick={toggleScientific}
          type="special"
          isActive={isScientificOpen}
          ariaLabel="Toggle Scientific Mode"
        />
        <CalcButton
          label="0"
          value="0"
          onClick={() => inputDigit('0')}
          type="number"
          isSpecialGlow={lastPressedButton === '0'}
        />
        <CalcButton
          label="."
          value="."
          onClick={inputDecimal}
          type="number"
          ariaLabel="Decimal Point"
        />
        <CalcButton
          label="="
          value="="
          onClick={calculateEquals}
          type="equals"
          ariaLabel="Equals"
        />
      </div>
    </div>
  );
};

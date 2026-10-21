import React, { useState } from 'react';
import { useCalculator } from '../context/CalculatorContext';
import { useTheme } from '../context/ThemeContext';
import { ChevronUp, ChevronDown } from 'lucide-react';

export const ScientificKeypad: React.FC = () => {
  const {
    angleMode,
    toggleAngleMode,
    inputFunction,
    inputOperator,
    inputParenthesis,
    memory,
    memoryClear,
    memoryRecall,
    memoryAdd,
    memorySubtract,
    isScientificOpen,
    toggleScientific,
  } = useCalculator();

  const { currentTheme, animationSettings } = useTheme();
  const [is2nd, setIs2nd] = useState(false);

  if (!isScientificOpen) {
    // Collapsed bar showing quick expand handle
    return (
      <div className="px-4 py-1 flex items-center justify-between border-t border-white/5 select-none">
        <button
          onClick={toggleScientific}
          className="flex-1 py-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
          title="Expand Scientific Functions"
        >
          <span className="w-8 h-1 rounded-full bg-white/20" />
          <ChevronUp size={14} style={{ color: currentTheme.operatorText }} />
        </button>
      </div>
    );
  }

  const btnStyle = "h-9 rounded-xl text-xs font-semibold flex items-center justify-center border border-white/10 transition-all select-none";

  return (
    <div
      className="px-3 pt-1 pb-2 border-t border-white/10 select-none animate-in fade-in slide-in-from-top-2 duration-200"
      style={{
        backgroundColor: `${currentTheme.surface}90`,
      }}
    >
      {/* Top Drawer Controls */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIs2nd(!is2nd)}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all ${
              is2nd
                ? 'shadow-sm'
                : 'bg-white/5 text-neutral-400 hover:text-white border-white/10'
            }`}
            style={
              is2nd
                ? {
                    backgroundColor: currentTheme.operatorText,
                    color: currentTheme.equalsText || '#000',
                    borderColor: currentTheme.operatorText,
                  }
                : {}
            }
          >
            2nd
          </button>

          <button
            onClick={toggleAngleMode}
            className="px-2 py-1 text-[11px] font-bold rounded-lg bg-white/5 border border-white/10 transition-colors"
            style={{ color: currentTheme.operatorText }}
          >
            {angleMode}
          </button>
        </div>

        {/* Memory Bar */}
        <div className="flex items-center gap-1">
          <button
            onClick={memoryClear}
            className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-white/5 text-neutral-400 hover:text-white border border-white/10"
            title="Clear Memory"
          >
            MC
          </button>
          <button
            onClick={memoryRecall}
            disabled={memory === 0}
            className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-white/5 border border-white/10 disabled:opacity-30"
            style={{ color: memory !== 0 ? currentTheme.operatorText : undefined }}
            title="Recall Memory"
          >
            MR
          </button>
          <button
            onClick={memoryAdd}
            className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-white/5 text-neutral-300 hover:text-white border border-white/10"
            title="Add to Memory"
          >
            M+
          </button>
          <button
            onClick={memorySubtract}
            className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-white/5 text-neutral-300 hover:text-white border border-white/10"
            title="Subtract from Memory"
          >
            M−
          </button>
          <button
            onClick={toggleScientific}
            className="p-1 text-neutral-400 hover:text-white rounded-md"
            title="Collapse Scientific Functions"
          >
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* Scientific Grid: 5 columns x 3 rows */}
      <div className="grid grid-cols-5 gap-1.5 font-mono-numbers">
        {/* Row 1 */}
        <button
          onClick={() => inputFunction(is2nd ? 'asin' : 'sin')}
          className={btnStyle}
          style={{ backgroundColor: currentTheme.keypadBg, color: currentTheme.operatorText }}
        >
          {is2nd ? 'sin⁻¹' : 'sin'}
        </button>

        <button
          onClick={() => inputFunction(is2nd ? 'acos' : 'cos')}
          className={btnStyle}
          style={{ backgroundColor: currentTheme.keypadBg, color: currentTheme.operatorText }}
        >
          {is2nd ? 'cos⁻¹' : 'cos'}
        </button>

        <button
          onClick={() => inputFunction(is2nd ? 'atan' : 'tan')}
          className={btnStyle}
          style={{ backgroundColor: currentTheme.keypadBg, color: currentTheme.operatorText }}
        >
          {is2nd ? 'tan⁻¹' : 'tan'}
        </button>

        <button
          onClick={() => inputFunction(is2nd ? '10^' : 'log')}
          className={btnStyle}
          style={{ backgroundColor: currentTheme.keypadBg, color: currentTheme.operatorText }}
        >
          {is2nd ? '10ˣ' : 'log'}
        </button>

        <button
          onClick={() => inputFunction(is2nd ? 'e^' : 'ln')}
          className={btnStyle}
          style={{ backgroundColor: currentTheme.keypadBg, color: currentTheme.operatorText }}
        >
          {is2nd ? 'eˣ' : 'ln'}
        </button>

        {/* Row 2 */}
        <button
          onClick={() => inputFunction(is2nd ? 'cbrt' : 'sqrt')}
          className={btnStyle}
          style={{ backgroundColor: currentTheme.keypadBg, color: currentTheme.operatorText }}
        >
          {is2nd ? '∛' : '√'}
        </button>

        <button
          onClick={() => inputFunction('^')}
          className={btnStyle}
          style={{ backgroundColor: currentTheme.keypadBg, color: currentTheme.operatorText }}
        >
          xʸ
        </button>

        <button
          onClick={() => inputFunction(is2nd ? '^3' : '^2')}
          className={btnStyle}
          style={{ backgroundColor: currentTheme.keypadBg, color: currentTheme.operatorText }}
        >
          {is2nd ? 'x³' : 'x²'}
        </button>

        <button
          onClick={() => inputFunction('!')}
          className={btnStyle}
          style={{ backgroundColor: currentTheme.keypadBg, color: currentTheme.operatorText }}
        >
          x!
        </button>

        <button
          onClick={() => inputOperator('mod')}
          className={btnStyle}
          style={{ backgroundColor: currentTheme.keypadBg, color: currentTheme.operatorText }}
        >
          mod
        </button>

        {/* Row 3 */}
        <button
          onClick={() => inputFunction('π')}
          className={btnStyle}
          style={{ backgroundColor: currentTheme.keypadBg, color: currentTheme.numberText }}
        >
          π
        </button>

        <button
          onClick={() => inputFunction('e')}
          className={btnStyle}
          style={{ backgroundColor: currentTheme.keypadBg, color: currentTheme.numberText }}
        >
          e
        </button>

        <button
          onClick={() => inputParenthesis('(')}
          className={btnStyle}
          style={{ backgroundColor: currentTheme.keypadBg, color: currentTheme.operatorText }}
        >
          (
        </button>

        <button
          onClick={() => inputParenthesis(')')}
          className={btnStyle}
          style={{ backgroundColor: currentTheme.keypadBg, color: currentTheme.operatorText }}
        >
          )
        </button>

        <button
          onClick={() => inputFunction('inv')}
          className={btnStyle}
          style={{ backgroundColor: currentTheme.keypadBg, color: currentTheme.operatorText }}
        >
          1/x
        </button>
      </div>
    </div>
  );
};

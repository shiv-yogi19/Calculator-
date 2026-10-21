import React, { useState } from 'react';
import { Percent, Tag, Receipt, Banknote, Divide } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { formatResultNumber } from '../utils/mathEngine';

type ToolType = 'percentage' | 'discount' | 'gst' | 'emi' | 'ratio';

export const AdditionalToolsView: React.FC = () => {
  const { currentTheme } = useTheme();
  const [activeTool, setActiveTool] = useState<ToolType>('percentage');

  // Percentage state
  const [pctVal, setPctVal] = useState<string>('15');
  const [pctTotal, setPctTotal] = useState<string>('200');
  const [pctFrom, setPctFrom] = useState<string>('100');
  const [pctTo, setPctTo] = useState<string>('125');

  // Discount state
  const [discPrice, setDiscPrice] = useState<string>('1200');
  const [discPercent, setDiscPercent] = useState<string>('20');
  const [discExtra, setDiscExtra] = useState<string>('5');

  // GST state
  const [gstAmount, setGstAmount] = useState<string>('5000');
  const [gstRate, setGstRate] = useState<string>('18');
  const [gstMode, setGstMode] = useState<'exclusive' | 'inclusive'>('exclusive');

  // EMI state
  const [emiPrincipal, setEmiPrincipal] = useState<string>('500000');
  const [emiRate, setEmiRate] = useState<string>('8.5');
  const [emiTenureYears, setEmiTenureYears] = useState<string>('5');

  // Ratio / Average state
  const [ratioA, setRatioA] = useState<string>('1920');
  const [ratioB, setRatioB] = useState<string>('1080');
  const [avgNumbers, setAvgNumbers] = useState<string>('10, 25, 40, 55, 70');

  // GCD Helper for ratios
  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  return (
    <div
      className="flex-1 flex flex-col p-4 select-none overflow-y-auto no-scrollbar"
      style={{
        backgroundColor: currentTheme.bg,
        color: currentTheme.numberText,
      }}
    >
      {/* Sub-nav tool buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2 mb-3">
        <button
          onClick={() => setActiveTool('percentage')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-semibold whitespace-nowrap border transition-all ${
            activeTool === 'percentage'
              ? 'shadow-lg'
              : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
          }`}
          style={
            activeTool === 'percentage'
              ? {
                  backgroundColor: currentTheme.operatorText,
                  borderColor: currentTheme.operatorText,
                  color: currentTheme.equalsText || '#000',
                }
              : {}
          }
        >
          <Percent size={14} />
          <span>Percentage</span>
        </button>

        <button
          onClick={() => setActiveTool('discount')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-semibold whitespace-nowrap border transition-all ${
            activeTool === 'discount'
              ? 'shadow-lg'
              : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
          }`}
          style={
            activeTool === 'discount'
              ? {
                  backgroundColor: currentTheme.operatorText,
                  borderColor: currentTheme.operatorText,
                  color: currentTheme.equalsText || '#000',
                }
              : {}
          }
        >
          <Tag size={14} />
          <span>Discount</span>
        </button>

        <button
          onClick={() => setActiveTool('gst')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-semibold whitespace-nowrap border transition-all ${
            activeTool === 'gst'
              ? 'shadow-lg'
              : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
          }`}
          style={
            activeTool === 'gst'
              ? {
                  backgroundColor: currentTheme.operatorText,
                  borderColor: currentTheme.operatorText,
                  color: currentTheme.equalsText || '#000',
                }
              : {}
          }
        >
          <Receipt size={14} />
          <span>GST / Tax</span>
        </button>

        <button
          onClick={() => setActiveTool('emi')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-semibold whitespace-nowrap border transition-all ${
            activeTool === 'emi'
              ? 'shadow-lg'
              : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
          }`}
          style={
            activeTool === 'emi'
              ? {
                  backgroundColor: currentTheme.operatorText,
                  borderColor: currentTheme.operatorText,
                  color: currentTheme.equalsText || '#000',
                }
              : {}
          }
        >
          <Banknote size={14} />
          <span>EMI Loan</span>
        </button>

        <button
          onClick={() => setActiveTool('ratio')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-semibold whitespace-nowrap border transition-all ${
            activeTool === 'ratio'
              ? 'shadow-lg'
              : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
          }`}
          style={
            activeTool === 'ratio'
              ? {
                  backgroundColor: currentTheme.operatorText,
                  borderColor: currentTheme.operatorText,
                  color: currentTheme.equalsText || '#000',
                }
              : {}
          }
        >
          <Divide size={14} />
          <span>Ratio & Stats</span>
        </button>
      </div>

      <div className="max-w-md mx-auto w-full flex-1">
        {/* 1. PERCENTAGE CALCULATOR */}
        {activeTool === 'percentage' && (
          <div className="space-y-4">
            {/* Box A: What is X% of Y? */}
            <div className="p-4 rounded-3xl liquid-glass border border-white/10">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-3">
                Value of Percentage (X% of Y)
              </span>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1">Percentage (%)</label>
                  <input
                    type="number"
                    value={pctVal}
                    onChange={(e) => setPctVal(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1">Total Number</label>
                  <input
                    type="number"
                    value={pctTotal}
                    onChange={(e) => setPctTotal(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none"
                  />
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 flex items-center justify-between">
                <span className="text-xs text-neutral-300">Result</span>
                <span className="font-mono-numbers text-xl font-bold" style={{ color: currentTheme.glowColor }}>
                  {formatResultNumber((parseFloat(pctVal || '0') * parseFloat(pctTotal || '0')) / 100)}
                </span>
              </div>
            </div>

            {/* Box B: Percentage Change from A to B */}
            <div className="p-4 rounded-3xl liquid-glass border border-white/10">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-3">
                Percentage Change (From A → B)
              </span>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1">Initial Value</label>
                  <input
                    type="number"
                    value={pctFrom}
                    onChange={(e) => setPctFrom(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1">Final Value</label>
                  <input
                    type="number"
                    value={pctTo}
                    onChange={(e) => setPctTo(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none"
                  />
                </div>
              </div>
              {(() => {
                const f = parseFloat(pctFrom || '0');
                const t = parseFloat(pctTo || '0');
                const change = f !== 0 ? ((t - f) / f) * 100 : 0;
                const isInc = change >= 0;
                return (
                  <div className="p-3 rounded-2xl bg-white/5 flex items-center justify-between">
                    <span className="text-xs text-neutral-300">
                      {isInc ? 'Increase' : 'Decrease'}
                    </span>
                    <span
                      className={`font-mono-numbers text-xl font-bold ${
                        isInc ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {isInc ? '+' : ''}
                      {formatResultNumber(change, { precision: 2 })}%
                    </span>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* 2. DISCOUNT CALCULATOR */}
        {activeTool === 'discount' && (
          <div className="p-4 rounded-3xl liquid-glass border border-white/10 space-y-4">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
              Discount & Savings
            </span>
            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">Original Price ($)</label>
              <input
                type="number"
                value={discPrice}
                onChange={(e) => setDiscPrice(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-base font-bold text-white focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Discount (%)</label>
                <input
                  type="number"
                  value={discPercent}
                  onChange={(e) => setDiscPercent(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Extra Off (%)</label>
                <input
                  type="number"
                  value={discExtra}
                  onChange={(e) => setDiscExtra(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none"
                />
              </div>
            </div>

            {(() => {
              const orig = parseFloat(discPrice || '0');
              const d1 = parseFloat(discPercent || '0');
              const d2 = parseFloat(discExtra || '0');
              const firstDiscount = (orig * d1) / 100;
              const subtotal = orig - firstDiscount;
              const extraDiscount = (subtotal * d2) / 100;
              const totalSaved = firstDiscount + extraDiscount;
              const finalPrice = Math.max(0, orig - totalSaved);
              return (
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="flex justify-between text-xs text-neutral-400">
                    <span>Total Discount Saved</span>
                    <span className="text-emerald-400 font-bold font-mono-numbers">
                      − {formatResultNumber(totalSaved, { precision: 2 })}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 flex items-center justify-between">
                    <span className="text-sm font-bold text-white">Final Price</span>
                    <span className="font-mono-numbers text-2xl font-bold" style={{ color: currentTheme.glowColor }}>
                      {formatResultNumber(finalPrice, { precision: 2 })}
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* 3. GST CALCULATOR */}
        {activeTool === 'gst' && (
          <div className="p-4 rounded-3xl liquid-glass border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                GST / Sales Tax Calculator
              </span>
              <div className="flex items-center rounded-xl bg-black/40 p-0.5 border border-white/10 text-xs">
                <button
                  onClick={() => setGstMode('exclusive')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    gstMode === 'exclusive' ? 'bg-white/20 text-white font-bold' : 'text-neutral-400'
                  }`}
                >
                  Exclusive
                </button>
                <button
                  onClick={() => setGstMode('inclusive')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    gstMode === 'inclusive' ? 'bg-white/20 text-white font-bold' : 'text-neutral-400'
                  }`}
                >
                  Inclusive
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">
                {gstMode === 'exclusive' ? 'Base Amount' : 'Total Amount (Tax Included)'}
              </label>
              <input
                type="number"
                value={gstAmount}
                onChange={(e) => setGstAmount(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-base font-bold text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">GST Rate (%)</label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {['5', '12', '18', '28'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setGstRate(r)}
                    className={`py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      gstRate === r ? 'bg-white/20 border-white/30 text-white' : 'bg-black/30 border-white/10 text-neutral-400'
                    }`}
                  >
                    {r}%
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={gstRate}
                onChange={(e) => setGstRate(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:outline-none"
                placeholder="Custom Rate"
              />
            </div>

            {(() => {
              const amt = parseFloat(gstAmount || '0');
              const rate = parseFloat(gstRate || '0');
              let net = 0;
              let tax = 0;
              let total = 0;

              if (gstMode === 'exclusive') {
                net = amt;
                tax = (amt * rate) / 100;
                total = net + tax;
              } else {
                total = amt;
                net = (amt * 100) / (100 + rate);
                tax = total - net;
              }

              return (
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="flex justify-between text-xs text-neutral-400">
                    <span>Net Amount</span>
                    <span className="font-mono-numbers text-white font-medium">
                      {formatResultNumber(net, { precision: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-neutral-400">
                    <span>CGST ({rate / 2}%) / SGST ({rate / 2}%)</span>
                    <span className="font-mono-numbers text-white font-medium">
                      {formatResultNumber(tax / 2, { precision: 2 })} each
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-neutral-400">
                    <span>Total Tax (GST)</span>
                    <span className="font-mono-numbers text-emerald-400 font-bold">
                      +{formatResultNumber(tax, { precision: 2 })}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 flex items-center justify-between">
                    <span className="text-sm font-bold text-white">Total Gross Amount</span>
                    <span className="font-mono-numbers text-2xl font-bold" style={{ color: currentTheme.glowColor }}>
                      {formatResultNumber(total, { precision: 2 })}
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* 4. EMI / LOAN CALCULATOR */}
        {activeTool === 'emi' && (
          <div className="p-4 rounded-3xl liquid-glass border border-white/10 space-y-4">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
              Loan EMI & Amortization
            </span>
            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">Principal Amount</label>
              <input
                type="number"
                value={emiPrincipal}
                onChange={(e) => setEmiPrincipal(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-base font-bold text-white focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Annual Interest Rate (%)</label>
                <input
                  type="number"
                  value={emiRate}
                  onChange={(e) => setEmiRate(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Tenure (Years)</label>
                <input
                  type="number"
                  value={emiTenureYears}
                  onChange={(e) => setEmiTenureYears(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none"
                />
              </div>
            </div>

            {(() => {
              const p = parseFloat(emiPrincipal || '0');
              const annualR = parseFloat(emiRate || '0');
              const years = parseFloat(emiTenureYears || '0');
              const months = years * 12;
              const r = annualR / (12 * 100);

              let monthlyEmi = 0;
              if (r > 0 && months > 0) {
                monthlyEmi = (p * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
              } else if (months > 0) {
                monthlyEmi = p / months;
              }

              const totalPayment = monthlyEmi * months;
              const totalInterest = Math.max(0, totalPayment - p);

              return (
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="p-3 rounded-2xl bg-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-neutral-300 block">Monthly EMI</span>
                      <span className="text-[10px] text-neutral-500">{months} installments</span>
                    </div>
                    <span className="font-mono-numbers text-2xl font-bold" style={{ color: currentTheme.glowColor }}>
                      {formatResultNumber(monthlyEmi, { precision: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-neutral-400">
                    <span>Total Interest</span>
                    <span className="font-mono-numbers text-orange-400 font-bold">
                      {formatResultNumber(totalInterest, { precision: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-neutral-400">
                    <span>Total Repayment Amount</span>
                    <span className="font-mono-numbers text-white font-semibold">
                      {formatResultNumber(totalPayment, { precision: 2 })}
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* 5. RATIO & AVERAGE CALCULATOR */}
        {activeTool === 'ratio' && (
          <div className="space-y-4">
            {/* Aspect Ratio Box */}
            <div className="p-4 rounded-3xl liquid-glass border border-white/10">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-3">
                Simplify Aspect Ratio (A : B)
              </span>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1">Width / A</label>
                  <input
                    type="number"
                    value={ratioA}
                    onChange={(e) => setRatioA(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1">Height / B</label>
                  <input
                    type="number"
                    value={ratioB}
                    onChange={(e) => setRatioB(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none"
                  />
                </div>
              </div>
              {(() => {
                const a = parseInt(ratioA || '0', 10);
                const b = parseInt(ratioB || '0', 10);
                const divisor = a > 0 && b > 0 ? gcd(a, b) : 1;
                const simA = divisor > 0 ? a / divisor : a;
                const simB = divisor > 0 ? b / divisor : b;
                return (
                  <div className="p-3 rounded-2xl bg-white/5 flex items-center justify-between">
                    <span className="text-xs text-neutral-300">Simplified Ratio</span>
                    <span className="font-mono-numbers text-xl font-bold" style={{ color: currentTheme.glowColor }}>
                      {simA} : {simB}
                    </span>
                  </div>
                );
              })()}
            </div>

            {/* Average & Statistics */}
            <div className="p-4 rounded-3xl liquid-glass border border-white/10">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-2">
                Average & Mean Calculator
              </span>
              <label className="text-[11px] text-neutral-400 block mb-1">
                Numbers (separated by commas or spaces)
              </label>
              <input
                type="text"
                value={avgNumbers}
                onChange={(e) => setAvgNumbers(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono-numbers text-white focus:outline-none mb-3"
              />
              {(() => {
                const arr = avgNumbers
                  .split(/[\s,]+/)
                  .map((s) => parseFloat(s.trim()))
                  .filter((n) => !isNaN(n));
                const count = arr.length;
                const sum = arr.reduce((acc, v) => acc + v, 0);
                const mean = count > 0 ? sum / count : 0;
                const min = count > 0 ? Math.min(...arr) : 0;
                const max = count > 0 ? Math.max(...arr) : 0;

                return (
                  <div className="space-y-1.5 text-xs text-neutral-300">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Total Count:</span>
                      <span className="font-mono-numbers font-semibold">{count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Sum:</span>
                      <span className="font-mono-numbers font-semibold">{formatResultNumber(sum)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Range (Min - Max):</span>
                      <span className="font-mono-numbers font-semibold">
                        {min} - {max}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-white/5 flex items-center justify-between mt-2">
                      <span className="font-bold text-white">Arithmetic Mean (Average)</span>
                      <span className="font-mono-numbers text-xl font-bold" style={{ color: currentTheme.glowColor }}>
                        {formatResultNumber(mean, { precision: 4 })}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

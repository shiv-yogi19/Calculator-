import React, { useState, useEffect } from 'react';
import {
  ArrowLeftRight,
  Copy,
  Check,
  RefreshCw,
  Ruler,
  Scale,
  Thermometer,
  Grid,
  Box,
  Clock,
  Gauge,
  HardDrive,
  Coins,
} from 'lucide-react';
import { ConverterCategory } from '../types';
import { useTheme } from '../context/ThemeContext';
import { formatResultNumber } from '../utils/mathEngine';

interface UnitDef {
  id: string;
  name: string;
  symbol: string;
  ratio: number; // to base unit
  type?: 'linear' | 'temperature';
}

const CATEGORIES: { id: ConverterCategory; label: string; icon: React.ReactNode }[] = [
  { id: 'length', label: 'Length', icon: <Ruler size={16} /> },
  { id: 'weight', label: 'Weight', icon: <Scale size={16} /> },
  { id: 'temperature', label: 'Temp', icon: <Thermometer size={16} /> },
  { id: 'area', label: 'Area', icon: <Grid size={16} /> },
  { id: 'volume', label: 'Volume', icon: <Box size={16} /> },
  { id: 'time', label: 'Time', icon: <Clock size={16} /> },
  { id: 'speed', label: 'Speed', icon: <Gauge size={16} /> },
  { id: 'storage', label: 'Storage', icon: <HardDrive size={16} /> },
  { id: 'currency', label: 'Currency', icon: <Coins size={16} /> },
];

const UNITS_CONFIG: Record<ConverterCategory, UnitDef[]> = {
  length: [
    { id: 'm', name: 'Meter', symbol: 'm', ratio: 1 },
    { id: 'km', name: 'Kilometer', symbol: 'km', ratio: 1000 },
    { id: 'cm', name: 'Centimeter', symbol: 'cm', ratio: 0.01 },
    { id: 'mm', name: 'Millimeter', symbol: 'mm', ratio: 0.001 },
    { id: 'mi', name: 'Mile', symbol: 'mi', ratio: 1609.344 },
    { id: 'yd', name: 'Yard', symbol: 'yd', ratio: 0.9144 },
    { id: 'ft', name: 'Foot', symbol: 'ft', ratio: 0.3048 },
    { id: 'in', name: 'Inch', symbol: 'in', ratio: 0.0254 },
    { id: 'nmi', name: 'Nautical Mile', symbol: 'NM', ratio: 1852 },
  ],
  weight: [
    { id: 'kg', name: 'Kilogram', symbol: 'kg', ratio: 1 },
    { id: 'g', name: 'Gram', symbol: 'g', ratio: 0.001 },
    { id: 'mg', name: 'Milligram', symbol: 'mg', ratio: 0.000001 },
    { id: 'lb', name: 'Pound', symbol: 'lb', ratio: 0.45359237 },
    { id: 'oz', name: 'Ounce', symbol: 'oz', ratio: 0.028349523 },
    { id: 't', name: 'Metric Ton', symbol: 't', ratio: 1000 },
    { id: 'st', name: 'Stone', symbol: 'st', ratio: 6.35029 },
  ],
  temperature: [
    { id: 'c', name: 'Celsius', symbol: '°C', ratio: 1, type: 'temperature' },
    { id: 'f', name: 'Fahrenheit', symbol: '°F', ratio: 1, type: 'temperature' },
    { id: 'k', name: 'Kelvin', symbol: 'K', ratio: 1, type: 'temperature' },
  ],
  area: [
    { id: 'sqm', name: 'Square Meter', symbol: 'm²', ratio: 1 },
    { id: 'sqkm', name: 'Square Kilometer', symbol: 'km²', ratio: 1000000 },
    { id: 'sqft', name: 'Square Foot', symbol: 'ft²', ratio: 0.092903 },
    { id: 'sqyd', name: 'Square Yard', symbol: 'yd²', ratio: 0.836127 },
    { id: 'acre', name: 'Acre', symbol: 'ac', ratio: 4046.86 },
    { id: 'ha', name: 'Hectare', symbol: 'ha', ratio: 10000 },
  ],
  volume: [
    { id: 'l', name: 'Liter', symbol: 'L', ratio: 1 },
    { id: 'ml', name: 'Milliliter', symbol: 'mL', ratio: 0.001 },
    { id: 'm3', name: 'Cubic Meter', symbol: 'm³', ratio: 1000 },
    { id: 'gal', name: 'Gallon (US)', symbol: 'gal', ratio: 3.78541 },
    { id: 'qt', name: 'Quart (US)', symbol: 'qt', ratio: 0.946353 },
    { id: 'pt', name: 'Pint (US)', symbol: 'pt', ratio: 0.473176 },
    { id: 'cup', name: 'Cup (US)', symbol: 'cup', ratio: 0.236588 },
    { id: 'floz', name: 'Fluid Ounce', symbol: 'fl oz', ratio: 0.0295735 },
  ],
  time: [
    { id: 's', name: 'Second', symbol: 's', ratio: 1 },
    { id: 'min', name: 'Minute', symbol: 'min', ratio: 60 },
    { id: 'h', name: 'Hour', symbol: 'h', ratio: 3600 },
    { id: 'd', name: 'Day', symbol: 'd', ratio: 86400 },
    { id: 'wk', name: 'Week', symbol: 'wk', ratio: 604800 },
    { id: 'mo', name: 'Month (avg)', symbol: 'mo', ratio: 2629800 },
    { id: 'yr', name: 'Year (avg)', symbol: 'yr', ratio: 31557600 },
  ],
  speed: [
    { id: 'mps', name: 'Meter / Sec', symbol: 'm/s', ratio: 1 },
    { id: 'kmh', name: 'Kilometer / Hour', symbol: 'km/h', ratio: 0.277778 },
    { id: 'mph', name: 'Miles / Hour', symbol: 'mph', ratio: 0.44704 },
    { id: 'knot', name: 'Knot', symbol: 'kn', ratio: 0.514444 },
    { id: 'fps', name: 'Feet / Sec', symbol: 'ft/s', ratio: 0.3048 },
  ],
  storage: [
    { id: 'b', name: 'Byte', symbol: 'B', ratio: 1 },
    { id: 'kb', name: 'Kilobyte (decimal)', symbol: 'KB', ratio: 1000 },
    { id: 'mb', name: 'Megabyte (decimal)', symbol: 'MB', ratio: 1000000 },
    { id: 'gb', name: 'Gigabyte (decimal)', symbol: 'GB', ratio: 1000000000 },
    { id: 'tb', name: 'Terabyte (decimal)', symbol: 'TB', ratio: 1000000000000 },
    { id: 'kib', name: 'Kibibyte (binary)', symbol: 'KiB', ratio: 1024 },
    { id: 'mib', name: 'Mebibyte (binary)', symbol: 'MiB', ratio: 1048576 },
    { id: 'gib', name: 'Gibibyte (binary)', symbol: 'GiB', ratio: 1073741824 },
  ],
  currency: [
    { id: 'usd', name: 'US Dollar', symbol: '$', ratio: 1 },
    { id: 'eur', name: 'Euro', symbol: '€', ratio: 1.08 },
    { id: 'gbp', name: 'British Pound', symbol: '£', ratio: 1.29 },
    { id: 'inr', name: 'Indian Rupee', symbol: '₹', ratio: 0.012 },
    { id: 'jpy', name: 'Japanese Yen', symbol: '¥', ratio: 0.0067 },
    { id: 'cad', name: 'Canadian Dollar', symbol: 'CA$', ratio: 0.72 },
    { id: 'aud', name: 'Australian Dollar', symbol: 'A$', ratio: 0.66 },
    { id: 'chf', name: 'Swiss Franc', symbol: 'CHF', ratio: 1.15 },
    { id: 'cny', name: 'Chinese Yuan', symbol: '¥', ratio: 0.14 },
    { id: 'sgd', name: 'Singapore Dollar', symbol: 'S$', ratio: 0.76 },
  ],
};

export const ConverterView: React.FC = () => {
  const { currentTheme } = useTheme();

  const [category, setCategory] = useState<ConverterCategory>('length');
  const [inputValue, setInputValue] = useState<string>('1');
  const [sourceUnit, setSourceUnit] = useState<string>('km');
  const [targetUnit, setTargetUnit] = useState<string>('m');
  const [copied, setCopied] = useState<boolean>(false);
  const [currencyRates, setCurrencyRates] = useState<Record<string, number>>({});
  const [ratesLastUpdated, setRatesLastUpdated] = useState<string>('Cached baseline rates');
  const [isUpdatingRates, setIsUpdatingRates] = useState<boolean>(false);

  // Initialize source/target when category switches
  useEffect(() => {
    const list = UNITS_CONFIG[category];
    if (list.length >= 2) {
      setSourceUnit(list[0].id);
      setTargetUnit(list[1].id);
    }
  }, [category]);

  // Fetch reputable currency rates if in currency mode
  const fetchLiveRates = async () => {
    setIsUpdatingRates(true);
    try {
      // Use open reliable currency feed with fallback
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      if (res.ok) {
        const data = await res.json();
        if (data && data.rates) {
          const mapped: Record<string, number> = {};
          Object.keys(data.rates).forEach((k) => {
            mapped[k.toLowerCase()] = data.rates[k];
          });
          setCurrencyRates(mapped);
          setRatesLastUpdated(`Live sync: ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
        }
      }
    } catch {
      setRatesLastUpdated('Offline cache active');
    } finally {
      setIsUpdatingRates(false);
    }
  };

  useEffect(() => {
    if (category === 'currency' && Object.keys(currencyRates).length === 0) {
      fetchLiveRates();
    }
  }, [category]);

  // Conversion calculations
  const calculateConversion = (): string => {
    const num = parseFloat(inputValue);
    if (isNaN(num)) return '0';

    if (category === 'temperature') {
      let celsius = num;
      // Convert source to Celsius
      if (sourceUnit === 'f') {
        celsius = ((num - 32) * 5) / 9;
      } else if (sourceUnit === 'k') {
        celsius = num - 273.15;
      }

      // Convert Celsius to target
      if (targetUnit === 'c') return formatResultNumber(celsius, { precision: 4 });
      if (targetUnit === 'f') return formatResultNumber((celsius * 9) / 5 + 32, { precision: 4 });
      if (targetUnit === 'k') return formatResultNumber(celsius + 273.15, { precision: 4 });
      return formatResultNumber(celsius, { precision: 4 });
    }

    if (category === 'currency') {
      // Using USD as base
      const srcUnitDef = UNITS_CONFIG.currency.find((u) => u.id === sourceUnit);
      const tgtUnitDef = UNITS_CONFIG.currency.find((u) => u.id === targetUnit);

      const srcRate = currencyRates[sourceUnit] || (srcUnitDef ? 1 / srcUnitDef.ratio : 1);
      const tgtRate = currencyRates[targetUnit] || (tgtUnitDef ? 1 / tgtUnitDef.ratio : 1);

      // In rate tables: 1 USD = rate units.
      // So X in Source = (X / srcRate) * tgtRate
      const inUSD = num / srcRate;
      const converted = inUSD * tgtRate;
      return formatResultNumber(converted, { precision: 4 });
    }

    // Standard linear conversion
    const units = UNITS_CONFIG[category];
    const srcDef = units.find((u) => u.id === sourceUnit);
    const tgtDef = units.find((u) => u.id === targetUnit);

    if (!srcDef || !tgtDef) return '0';

    const baseVal = num * srcDef.ratio;
    const result = baseVal / tgtDef.ratio;
    return formatResultNumber(result, { precision: 6 });
  };

  const swapUnits = () => {
    const temp = sourceUnit;
    setSourceUnit(targetUnit);
    setTargetUnit(temp);
  };

  const handleCopy = () => {
    const res = calculateConversion();
    navigator.clipboard.writeText(`${inputValue} ${sourceUnit} = ${res} ${targetUnit}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const currentUnits = UNITS_CONFIG[category];
  const convertedResult = calculateConversion();

  return (
    <div
      className="flex-1 flex flex-col p-4 select-none overflow-y-auto no-scrollbar"
      style={{
        backgroundColor: currentTheme.bg,
        color: currentTheme.numberText,
      }}
    >
      {/* Category Pills Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2 mb-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-semibold whitespace-nowrap border transition-all ${
              category === cat.id
                ? 'shadow-lg'
                : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
            }`}
            style={
              category === cat.id
                ? {
                    backgroundColor: currentTheme.operatorText,
                    borderColor: currentTheme.operatorText,
                    color: currentTheme.equalsText || '#000',
                  }
                : {}
            }
          >
            {cat.icon}
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Main Converter Card */}
      <div className="flex-1 flex flex-col justify-between max-w-md mx-auto w-full gap-3">
        {/* Source Unit Input Box */}
        <div className="p-4 rounded-3xl liquid-glass border border-white/10 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              From
            </span>
            <select
              value={sourceUnit}
              onChange={(e) => setSourceUnit(e.target.value)}
              className="bg-black/50 border border-white/15 rounded-xl px-2.5 py-1 text-xs font-semibold text-white focus:outline-none"
            >
              {currentUnits.map((u) => (
                <option key={u.id} value={u.id} className="bg-neutral-900 text-white">
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="0"
              className="w-full bg-transparent font-mono-numbers text-3xl font-bold focus:outline-none text-white tracking-tight"
            />
            <span className="text-sm font-semibold opacity-60 ml-2">
              {currentUnits.find((u) => u.id === sourceUnit)?.symbol}
            </span>
          </div>
        </div>

        {/* Swap & Action Button Bar */}
        <div className="flex items-center justify-center my-0.5 relative">
          <div className="absolute inset-x-0 h-px bg-white/10" />
          <button
            onClick={swapUnits}
            className="relative z-10 p-2.5 rounded-full liquid-glass border border-white/20 shadow-xl hover:scale-110 active:scale-95 transition-all"
            style={{
              backgroundColor: currentTheme.operatorBtnBg,
              color: currentTheme.operatorText,
            }}
            title="Swap source and target units"
          >
            <ArrowLeftRight size={18} />
          </button>
        </div>

        {/* Target Unit Result Box */}
        <div className="p-4 rounded-3xl liquid-glass border border-white/10 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              To
            </span>
            <select
              value={targetUnit}
              onChange={(e) => setTargetUnit(e.target.value)}
              className="bg-black/50 border border-white/15 rounded-xl px-2.5 py-1 text-xs font-semibold text-white focus:outline-none"
            >
              {currentUnits.map((u) => (
                <option key={u.id} value={u.id} className="bg-neutral-900 text-white">
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <div
              className="font-mono-numbers text-3xl font-bold tracking-tight overflow-x-auto no-scrollbar"
              style={{
                color: currentTheme.glowColor,
                textShadow: `0 0 16px ${currentTheme.glowColor}50`,
              }}
            >
              {convertedResult}
            </div>
            <span className="text-sm font-semibold opacity-60 ml-2">
              {currentUnits.find((u) => u.id === targetUnit)?.symbol}
            </span>
          </div>
        </div>

        {/* Currency status or conversion formula info */}
        {category === 'currency' ? (
          <div className="px-3 py-2 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
            <span className="text-neutral-400 text-[11px]">{ratesLastUpdated}</span>
            <button
              onClick={fetchLiveRates}
              disabled={isUpdatingRates}
              className="flex items-center gap-1 text-[11px] font-semibold text-neutral-300 hover:text-white"
            >
              <RefreshCw size={11} className={isUpdatingRates ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>
        ) : (
          <div className="text-center text-[11px] text-neutral-400 py-1">
            Standard precision · Continuous conversion
          </div>
        )}

        {/* Action Buttons: Copy Result & Clear Input */}
        <div className="grid grid-cols-2 gap-3 mt-1">
          <button
            onClick={() => setInputValue('0')}
            className="py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold border border-white/10 transition-colors"
          >
            Clear Input
          </button>
          <button
            onClick={handleCopy}
            className="py-2.5 rounded-2xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all shadow-md"
            style={{
              backgroundColor: currentTheme.equalsBtnBg,
              color: currentTheme.equalsText,
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy Result'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

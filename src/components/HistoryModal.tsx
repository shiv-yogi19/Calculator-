import React, { useState } from 'react';
import {
  X,
  Trash2,
  Copy,
  RotateCcw,
  Search,
  History as HistoryIcon,
  Check,
  Calendar,
} from 'lucide-react';
import { useCalculator } from '../context/CalculatorContext';
import { useTheme } from '../context/ThemeContext';
import { HistoryItem } from '../types';

export const HistoryModal: React.FC = () => {
  const {
    history,
    isHistoryOpen,
    setIsHistoryOpen,
    deleteHistoryItem,
    clearAllHistory,
    reuseHistoryItem,
    restoreHistoryExpression,
  } = useCalculator();

  const { currentTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isHistoryOpen) return null;

  const filteredHistory = history.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.expression.toLowerCase().includes(q) ||
      item.result.toLowerCase().includes(q)
    );
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' · ' + d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full sm:max-w-md h-[85vh] max-h-[700px] flex flex-col rounded-t-3xl sm:rounded-3xl border border-white/15 overflow-hidden shadow-2xl animate-in slide-in-from-bottom-6 duration-250"
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
                backgroundColor: `${currentTheme.glowColor}20`,
                color: currentTheme.glowColor,
              }}
            >
              <HistoryIcon size={18} />
            </div>
            <div>
              <h2 className="font-bold text-base">Calculation History</h2>
              <p className="text-[11px] text-neutral-400">
                {history.length} {history.length === 1 ? 'entry' : 'entries'} stored locally
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {history.length > 0 && (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="p-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                title="Clear all history"
              >
                <Trash2 size={18} />
              </button>
            )}
            <button
              onClick={() => setIsHistoryOpen(false)}
              className="p-2 rounded-xl hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Clear Confirmation Banner */}
        {showClearConfirm && (
          <div className="p-3 bg-red-950/60 border-b border-red-500/30 flex items-center justify-between animate-in fade-in duration-150">
            <span className="text-xs text-red-200">Clear all calculation records?</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-2.5 py-1 text-xs rounded-lg bg-white/10 text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  clearAllHistory();
                  setShowClearConfirm(false);
                }}
                className="px-2.5 py-1 text-xs rounded-lg bg-red-600 text-white font-semibold"
              >
                Confirm
              </button>
            </div>
          </div>
        )}

        {/* Search Bar */}
        {history.length > 0 && (
          <div className="p-3 border-b border-white/10">
            <div className="relative flex items-center">
              <Search size={15} className="absolute left-3 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search calculations..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs focus:outline-none focus:border-white/30 text-white placeholder-neutral-500"
              />
            </div>
          </div>
        )}

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 no-scrollbar">
          {filteredHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
              <HistoryIcon size={42} className="opacity-20 mb-3" />
              <p className="text-sm font-semibold">No calculation history</p>
              <p className="text-xs text-neutral-500 max-w-[200px] mt-1">
                Completed expressions and answers will be saved here automatically.
              </p>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl liquid-glass border border-white/10 hover:border-white/20 transition-all flex flex-col gap-1.5 group"
              >
                {/* Meta header */}
                <div className="flex items-center justify-between text-[10px] text-neutral-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={11} />
                    <span>{formatDate(item.timestamp)}</span>
                    <span className="uppercase px-1 py-0.2 rounded bg-white/10 text-[9px]">
                      {item.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                    <button
                      onClick={() => handleCopy(`${item.expression} = ${item.result}`, item.id)}
                      className="p-1 rounded-md hover:bg-white/10 text-neutral-400 hover:text-white"
                      title="Copy expression and result"
                    >
                      {copiedId === item.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    </button>
                    <button
                      onClick={() => deleteHistoryItem(item.id)}
                      className="p-1 rounded-md hover:bg-white/10 text-neutral-400 hover:text-red-400"
                      title="Delete record"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                {/* Expression */}
                <div
                  onClick={() => restoreHistoryExpression(item)}
                  className="font-mono-numbers text-sm text-neutral-300 hover:text-white cursor-pointer tracking-wide"
                  title="Click to restore expression into calculator"
                >
                  {item.expression}
                </div>

                {/* Result */}
                <div className="flex items-center justify-between pt-1 border-t border-white/5">
                  <span className="text-[11px] text-neutral-400">Result</span>
                  <div
                    onClick={() => reuseHistoryItem(item)}
                    className="font-mono-numbers font-bold text-lg cursor-pointer flex items-center gap-1.5 hover:underline"
                    style={{ color: currentTheme.glowColor }}
                    title="Click to use result"
                  >
                    <span>= {item.result}</span>
                    <RotateCcw size={13} className="opacity-70" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-white/10 bg-black/20 text-center">
          <p className="text-[11px] text-neutral-400">
            Tap expression to edit · Tap result to continue calculating
          </p>
        </div>
      </div>
    </div>
  );
};

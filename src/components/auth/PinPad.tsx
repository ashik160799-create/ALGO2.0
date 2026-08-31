import React from 'react';
import { Delete, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';

interface PinPadProps {
  value: string;
  onChange: (val: string) => void;
  length?: number;
  label?: string;
  error?: string | null;
  onComplete?: (pin: string) => void;
  showNumpad?: boolean;
}

export const PinPad: React.FC<PinPadProps> = ({
  value,
  onChange,
  length = 4,
  label,
  error,
  onComplete,
  showNumpad = true,
}) => {
  const { currentThemeConfig, colorThemeMode } = useApp();
  const [mask, setMask] = React.useState(true);
  const isLight = colorThemeMode === 'light';

  const handleKeyPress = (num: number) => {
    if (value.length < length) {
      const next = value + num.toString();
      onChange(next);
      if (next.length === length && onComplete) {
        onComplete(next);
      }
    }
  };

  const handleDelete = () => {
    if (value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="w-full flex flex-col items-center select-none">
      {label && (
        <div className="w-full flex items-center justify-between mb-2 px-1">
          <span
            className={`text-xs font-bold ${
              isLight ? 'text-zinc-700' : 'text-zinc-300'
            }`}
          >
            {label}
          </span>
          <button
            type="button"
            onClick={() => setMask(!mask)}
            className={`text-[11px] font-semibold flex items-center gap-1 transition-colors ${
              isLight ? 'text-zinc-500 hover:text-zinc-800' : 'text-zinc-400 hover:text-white'
            }`}
          >
            {mask ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{mask ? 'Show' : 'Hide'}</span>
          </button>
        </div>
      )}

      <div className="flex items-center justify-center gap-3 my-2">
        {Array.from({ length }).map((_, idx) => {
          const char = value[idx];
          const isFilled = char !== undefined;
          const isCurrent = value.length === idx;

          return (
            <motion.div
              key={idx}
              initial={false}
              animate={{
                scale: isCurrent ? 1.06 : 1,
                borderColor: isCurrent
                  ? currentThemeConfig.primaryHex
                  : error
                  ? '#ef4444'
                  : isFilled
                  ? isLight
                    ? '#71717a'
                    : '#a1a1aa'
                  : isLight
                  ? '#e4e4e7'
                  : '#27272a',
              }}
              className={`w-12 h-14 sm:w-14 sm:h-16 rounded-2xl border-2 flex items-center justify-center text-xl sm:text-2xl font-black font-mono transition-all shadow-sm ${
                isLight ? 'bg-zinc-50' : 'bg-zinc-900/90'
              }`}
              style={{
                boxShadow: isCurrent
                  ? `0 0 0 3px ${currentThemeConfig.glowHex}`
                  : 'none',
              }}
            >
              {isFilled ? (
                mask ? (
                  <span
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: currentThemeConfig.primaryHex }}
                  />
                ) : (
                  <span className={isLight ? 'text-zinc-950' : 'text-white'}>
                    {char}
                  </span>
                )
              ) : (
                <span
                  className={`text-sm ${
                    isLight ? 'text-zinc-300' : 'text-zinc-700'
                  }`}
                >
                  •
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-500 font-bold mt-1 text-center"
        >
          {error}
        </motion.p>
      )}

      {showNumpad && (
        <div className="mt-4 w-full max-w-[280px] grid grid-cols-3 gap-2.5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              type="button"
              onClick={() => handleKeyPress(num)}
              className={`h-12 sm:h-14 rounded-2xl text-lg sm:text-xl font-bold font-mono transition-all duration-150 active:scale-95 border flex items-center justify-center ${
                isLight
                  ? 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-900 shadow-sm'
                  : 'bg-zinc-900/80 hover:bg-zinc-800 border-zinc-800 text-white'
              }`}
            >
              {num}
            </button>
          ))}

          <button
            type="button"
            onClick={handleClear}
            className={`h-12 sm:h-14 rounded-2xl text-xs font-bold transition-all border flex items-center justify-center ${
              isLight
                ? 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-600'
                : 'bg-zinc-950 hover:bg-zinc-900 border-zinc-800/80 text-zinc-400'
            }`}
          >
            Clear
          </button>

          <button
            type="button"
            onClick={() => handleKeyPress(0)}
            className={`h-12 sm:h-14 rounded-2xl text-lg sm:text-xl font-bold font-mono transition-all duration-150 active:scale-95 border flex items-center justify-center ${
              isLight
                ? 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-900 shadow-sm'
                : 'bg-zinc-900/80 hover:bg-zinc-800 border-zinc-800 text-white'
            }`}
          >
            0
          </button>

          <button
            type="button"
            onClick={handleDelete}
            aria-label="Delete last digit"
            className={`h-12 sm:h-14 rounded-2xl text-xs font-bold transition-all duration-150 active:scale-95 border flex items-center justify-center ${
              isLight
                ? 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-700'
                : 'bg-zinc-900/80 hover:bg-zinc-800 border-zinc-800 text-zinc-300'
            }`}
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

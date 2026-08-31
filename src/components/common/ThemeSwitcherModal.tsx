import React from 'react';
import { useApp } from '../../context/AppContext';
import { THEME_PRESETS } from '../../utils/themeConfig';
import { Palette, Sun, Moon, Check, Sparkles, X } from 'lucide-react';
import { AlgoLogo } from '../common/AlgoLogo';

interface ThemeSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeSwitcherModal: React.FC<ThemeSwitcherModalProps> = ({ isOpen, onClose }) => {
  const {
    activeColorTheme,
    setActiveColorTheme,
    colorThemeMode,
    setColorThemeMode,
    currentThemeConfig,
  } = useApp();

  if (!isOpen) return null;

  const themeList = Object.values(THEME_PRESETS);
  const isLight = colorThemeMode === 'light';

  return (
    <div
      id="theme-switcher-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="theme-switcher-dialog"
        className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden relative flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 transition-colors ${
          isLight
            ? 'bg-white border-slate-200 text-slate-900'
            : 'bg-slate-900 border-slate-800 text-white'
        }`}
        style={{
          boxShadow: `0 20px 50px -10px ${currentThemeConfig.glowHex}`,
        }}
        onClick={e => e.stopPropagation()}
      >
        <div
          className={`flex items-center justify-between px-5 py-4 border-b ${
            isLight ? 'bg-white border-slate-100' : 'bg-slate-900 border-slate-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-sm transition-all"
              style={{
                backgroundColor: currentThemeConfig.primaryHex || '#0EA36F',
                boxShadow: `0 4px 12px ${currentThemeConfig.glowHex}`,
              }}
            >
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2
                className={`text-base font-extrabold flex items-center gap-1.5 font-['Outfit',sans-serif] ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                Customize App Appearance
                <Sparkles className="w-4 h-4 text-amber-500" />
              </h2>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Choose your luxury salon color scheme & canvas mode
              </p>
            </div>
          </div>

          <button
            id="close-theme-modal-btn"
            type="button"
            onClick={onClose}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              isLight
                ? 'bg-slate-100 border border-slate-200/80 text-slate-500 hover:text-slate-900 hover:bg-slate-200'
                : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div
          className={`p-5 space-y-6 overflow-y-auto custom-scrollbar flex-1 ${
            isLight ? 'bg-white' : 'bg-slate-900'
          }`}
        >
          <div
            className={`p-4 rounded-2xl border shadow-sm flex items-center justify-between transition-colors ${
              isLight
                ? 'bg-slate-50/90 border-slate-200'
                : 'bg-slate-950 border-slate-800'
            }`}
          >
            <div>
              <span
                className={`text-[10px] font-extrabold uppercase tracking-wider block mb-1 ${
                  isLight ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Live Adaptive Brand Logo
              </span>
              <AlgoLogo size="md" hideTagline={false} />
            </div>
            <div className="text-right">
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-extrabold text-white shadow-sm transition-all"
                style={{
                  backgroundColor: currentThemeConfig.primaryHex || '#0EA36F',
                }}
              >
                {currentThemeConfig.name}
              </span>
              <p className={`text-[10px] mt-1 font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Auto-reactive brand colors
              </p>
            </div>
          </div>

          <div>
            <label
              className={`text-xs font-extrabold uppercase tracking-wider block mb-2 ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              Canvas Atmosphere
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                id="mode-dark-btn"
                type="button"
                onClick={() => setColorThemeMode('dark')}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                  colorThemeMode === 'dark'
                    ? 'bg-slate-950 border-2 text-white shadow-md'
                    : isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                }`}
                style={{
                  borderColor: colorThemeMode === 'dark' ? currentThemeConfig.primaryHex : undefined,
                }}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    colorThemeMode === 'dark'
                      ? 'bg-slate-900 text-indigo-400'
                      : 'bg-slate-200/80 text-slate-600'
                  }`}
                >
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs font-bold block ${
                        colorThemeMode === 'dark' ? 'text-white' : 'text-slate-800'
                      }`}
                    >
                      Dark Luxury
                    </span>
                    {colorThemeMode === 'dark' && (
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" style={{ color: currentThemeConfig.primaryHex }} />
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500">Obsidian luxury & neon glow</div>
                </div>
              </button>

              <button
                id="mode-light-btn"
                type="button"
                onClick={() => setColorThemeMode('light')}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                  colorThemeMode === 'light'
                    ? 'bg-emerald-50/50 border-2 text-slate-900 shadow-sm'
                    : isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                }`}
                style={{
                  borderColor: colorThemeMode === 'light' ? currentThemeConfig.primaryHex : undefined,
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: `${currentThemeConfig.primaryHex}20`,
                    color: currentThemeConfig.primaryHex,
                  }}
                >
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs font-bold block ${
                        colorThemeMode === 'light' ? 'text-slate-900' : 'text-slate-300'
                      }`}
                    >
                      Light Boutique
                    </span>
                    {colorThemeMode === 'light' && (
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" style={{ color: currentThemeConfig.primaryHex }} />
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500">Crisp high-contrast salon</div>
                </div>
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label
                className={`text-xs font-extrabold uppercase tracking-wider block ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                Curated Salon Palettes ({themeList.length})
              </label>
              <span className="text-[10px] text-slate-400 font-medium">Instant theme preview</span>
            </div>

            <div className="space-y-2.5">
              {themeList.map(item => {
                const isSelected = activeColorTheme === item.id;
                return (
                  <button
                    key={item.id}
                    id={`theme-select-${item.id}`}
                    type="button"
                    onClick={() => setActiveColorTheme(item.id)}
                    className={`w-full p-3.5 rounded-2xl border flex items-center justify-between text-left transition-all ${
                      isSelected
                        ? isLight
                          ? 'border-2 shadow-sm ring-2 ring-emerald-500/10'
                          : 'border-2 shadow-md ring-1'
                        : isLight
                        ? 'bg-slate-50/70 border-slate-200/90 hover:bg-slate-100/80 hover:border-slate-300'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                    }`}
                    style={{
                      backgroundColor: isSelected
                        ? `${item.primaryHex}15`
                        : undefined,
                      borderColor: isSelected ? item.primaryHex : undefined,
                    }}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className="w-11 h-11 rounded-2xl shrink-0 flex items-center justify-center text-white shadow-sm relative overflow-hidden ring-1 ring-black/10"
                        style={{
                          background: `linear-gradient(135deg, ${item.primaryHex}, ${item.secondaryHex})`,
                        }}
                      >
                        <div
                          className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full ring-2 ring-white shadow-sm"
                          style={{ backgroundColor: item.accentHex }}
                        />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4
                            className={`text-sm font-extrabold tracking-tight ${
                              isLight ? 'text-slate-900' : 'text-white'
                            }`}
                          >
                            {item.name}
                          </h4>
                          {isSelected && (
                            <span
                              className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase text-white shadow-sm"
                              style={{ backgroundColor: item.primaryHex }}
                            >
                              Active
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-xs line-clamp-1 mt-0.5 ${
                            isLight ? 'text-slate-600' : 'text-slate-400'
                          }`}
                        >
                          {item.tagline}
                        </p>

                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1">
                            <span
                              className="w-3 h-3 rounded-full ring-1 ring-black/10 shadow-xs"
                              style={{ backgroundColor: item.primaryHex }}
                            />
                            <span className={`text-[10px] font-mono font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                              {item.primaryHex}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <span
                              className="w-3 h-3 rounded-full ring-1 ring-black/10 shadow-xs"
                              style={{ backgroundColor: item.accentHex }}
                            />
                            <span className={`text-[10px] font-mono font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                              {item.accentHex}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ml-2 transition-all ${
                        isSelected
                          ? 'text-white shadow-sm'
                          : isLight
                          ? 'border border-slate-300 bg-white'
                          : 'border border-slate-700 bg-slate-900'
                      }`}
                      style={{
                        backgroundColor: isSelected ? item.primaryHex : undefined,
                        borderColor: isSelected ? item.primaryHex : undefined,
                      }}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div
          className={`px-5 py-4 border-t flex items-center justify-between ${
            isLight ? 'bg-slate-50 border-slate-100' : 'bg-slate-900 border-slate-800'
          }`}
        >
          <div className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Active:{' '}
            <strong className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {currentThemeConfig.name}
            </strong>{' '}
            ({colorThemeMode === 'light' ? 'Light Boutique' : 'Dark Luxury'})
          </div>
          <button
            id="theme-done-btn"
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl font-extrabold text-xs text-white shadow-md transition-all active:scale-95 hover:brightness-105"
            style={{
              backgroundColor: currentThemeConfig.primaryHex || '#0EA36F',
              boxShadow: `0 4px 14px -2px ${currentThemeConfig.glowHex}`,
            }}
          >
            Apply & Done
          </button>
        </div>
      </div>
    </div>
  );
};

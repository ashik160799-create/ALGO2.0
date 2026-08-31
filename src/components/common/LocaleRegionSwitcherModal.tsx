import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ALL_COUNTRY_LOCALES,
  CountryLocaleData,
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
  formatLocalizedPrice,
} from '../../utils/localeConfig';
import {
  Globe,
  Search,
  Check,
  X,
  Smartphone,
  ShieldCheck,
  Coins,
  Languages,
  RotateCcw,
} from 'lucide-react';

interface LocaleRegionSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocaleRegionSwitcherModal: React.FC<LocaleRegionSwitcherModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    activeCountry,
    setActiveCountryCode,
    activeLanguage,
    setActiveLanguage,
    detectedLocaleInfo,
    isAutoRegionEnabled,
    setIsAutoRegionEnabled,
    resetToDeviceLocale,
    currentThemeConfig,
    colorThemeMode,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'region' | 'language'>('region');

  if (!isOpen) return null;

  const isLight = colorThemeMode === 'light';

  const filteredCountries = ALL_COUNTRY_LOCALES.filter(c => {
    const q = searchQuery.toLowerCase().trim();
    return (
      c.name.toLowerCase().includes(q) ||
      c.nativeName.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.currency.toLowerCase().includes(q) ||
      c.dialCode.includes(q)
    );
  });

  const handleSelectCountry = (country: CountryLocaleData) => {
    setActiveCountryCode(country.code);
    setIsAutoRegionEnabled(false);
  };

  const handleSelectLanguage = (langCode: SupportedLanguage) => {
    setActiveLanguage(langCode);
  };

  const handleResetToAuto = () => {
    resetToDeviceLocale();
  };

  return (
    <div
      id="locale-switcher-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="locale-switcher-dialog"
        className={`w-full max-w-xl rounded-3xl border shadow-2xl overflow-hidden relative flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 transition-colors ${
          isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
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
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-sm transition-all shrink-0"
              style={{
                backgroundColor: currentThemeConfig.primaryHex || '#0EA36F',
                boxShadow: `0 4px 12px ${currentThemeConfig.glowHex}`,
              }}
            >
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-['Outfit',sans-serif]">
                  Region, Currency & Language
                </h2>
                {isAutoRegionEnabled ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <Smartphone className="w-3 h-3" />
                    <span>Auto-Sync</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    Custom
                  </span>
                )}
              </div>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Automatic device detection with zero permission popups
              </p>
            </div>
          </div>

          <button
            type="button"
            id="close-locale-modal-btn"
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              isLight ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div
          className={`px-5 py-3 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
            isLight ? 'bg-slate-50/80 border-slate-100' : 'bg-slate-950/40 border-slate-800/80'
          }`}
        >
          <div className="flex items-start gap-2.5">
            <div
              className="p-2 rounded-xl mt-0.5 shrink-0"
              style={{
                backgroundColor: `${currentThemeConfig.primaryHex}15`,
                color: currentThemeConfig.primaryHex,
              }}
            >
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold">
                <span className={isLight ? 'text-slate-900' : 'text-white'}>Device Locale:</span>
                <code className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[11px]">
                  {detectedLocaleInfo.rawLocale}
                </code>
                <span className="text-slate-400">→</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                  {detectedLocaleInfo.flag} {detectedLocaleInfo.countryCode} ({detectedLocaleInfo.currency}, {detectedLocaleInfo.dialCode})
                </span>
              </div>
              <p className={`text-[11px] mt-0.5 flex items-center gap-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" />
                <span>Read directly from your OS settings — no GPS or prompts needed.</span>
              </p>
            </div>
          </div>

          {!isAutoRegionEnabled && (
            <button
              type="button"
              id="reset-device-locale-btn"
              onClick={handleResetToAuto}
              className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 transition-all shrink-0 active:scale-95 ${
                isLight
                  ? 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100 shadow-xs'
                  : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-750'
              }`}
            >
              <RotateCcw className="w-3 h-3" />
              <span>Sync to Device</span>
            </button>
          )}
        </div>

        <div className="px-5 pt-3">
          <div
            className={`p-1 rounded-2xl border flex items-center gap-1 ${
              isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}
          >
            <button
              type="button"
              id="tab-region-currency"
              onClick={() => setActiveTab('region')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'region'
                  ? 'text-white shadow-sm'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-slate-400 hover:text-white'
              }`}
              style={{
                backgroundColor: activeTab === 'region' ? currentThemeConfig.primaryHex : undefined,
              }}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Region & Currency ({activeCountry.flag} {activeCountry.currency})</span>
            </button>

            <button
              type="button"
              id="tab-language"
              onClick={() => setActiveTab('language')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'language'
                  ? 'text-white shadow-sm'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-slate-400 hover:text-white'
              }`}
              style={{
                backgroundColor: activeTab === 'language' ? currentThemeConfig.primaryHex : undefined,
              }}
            >
              <Languages className="w-3.5 h-3.5" />
              <span>App Language ({SUPPORTED_LANGUAGES.find(l => l.code === activeLanguage)?.nativeName})</span>
            </button>
          </div>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 flex-1 custom-scrollbar">
          {activeTab === 'region' ? (
            <>
              <div
                className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl leading-none">{activeCountry.flag}</span>
                  <div>
                    <h4 className="font-extrabold text-sm flex items-center gap-1.5">
                      <span>{activeCountry.name}</span>
                      <span className="text-slate-400 font-normal">({activeCountry.nativeName})</span>
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                      <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 font-mono font-bold">
                        Currency: {activeCountry.currency} ({activeCountry.symbolNative})
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 font-mono font-bold">
                        Dial Code: {activeCountry.dialCode}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right pl-3 border-l border-slate-200 dark:border-slate-800 shrink-0">
                  <span className="text-[10px] text-slate-400 block font-medium">Sample Haircut</span>
                  <span className="text-sm sm:text-base font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                    {formatLocalizedPrice(120, activeCountry)}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2 px-1">
                  Popular Regions
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { code: 'AE', label: 'UAE', curr: 'AED', dial: '+971' },
                    { code: 'IN', label: 'India', curr: 'INR (₹)', dial: '+91' },
                    { code: 'SA', label: 'Saudi Arabia', curr: 'SAR', dial: '+966' },
                    { code: 'US', label: 'United States', curr: 'USD ($)', dial: '+1' },
                    { code: 'QA', label: 'Qatar', curr: 'QAR', dial: '+974' },
                    { code: 'GB', label: 'United Kingdom', curr: 'GBP (£)', dial: '+44' },
                    { code: 'KW', label: 'Kuwait', curr: 'KWD', dial: '+965' },
                    { code: 'OM', label: 'Oman', curr: 'OMR', dial: '+968' },
                  ].map(pop => {
                    const country = ALL_COUNTRY_LOCALES.find(c => c.code === pop.code);
                    if (!country) return null;
                    const isSelected = activeCountry.code === country.code;
                    return (
                      <button
                        key={pop.code}
                        type="button"
                        onClick={() => handleSelectCountry(country)}
                        className={`p-2.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                          isSelected
                            ? isLight
                              ? 'bg-slate-100 border-slate-400 shadow-sm'
                              : 'bg-slate-800 border-slate-600 shadow-md'
                            : isLight
                            ? 'bg-white border-slate-200 hover:bg-slate-50'
                            : 'bg-slate-900 border-slate-800 hover:bg-slate-850'
                        }`}
                        style={{
                          borderColor: isSelected ? currentThemeConfig.primaryHex : undefined,
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xl">{country.flag}</span>
                          {isSelected && (
                            <Check
                              className="w-4 h-4 stroke-[3]"
                              style={{ color: currentThemeConfig.primaryHex }}
                            />
                          )}
                        </div>
                        <div className="mt-1">
                          <span className="text-xs font-bold block truncate">{country.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {pop.curr} • {pop.dial}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search all 25+ countries, currencies, or dial codes..."
                  className={`w-full pl-10 pr-4 py-2.5 text-xs font-medium rounded-2xl border focus:outline-none transition-all ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-400 focus:bg-white'
                      : 'bg-slate-950 border-slate-800 text-white focus:border-slate-600'
                  }`}
                />
              </div>

              <div className="space-y-1 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                {filteredCountries.map(country => {
                  const isSelected = activeCountry.code === country.code;
                  return (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => handleSelectCountry(country)}
                      className={`w-full p-2.5 rounded-2xl border transition-all flex items-center justify-between text-left ${
                        isSelected
                          ? isLight
                            ? 'bg-slate-100 border-slate-300'
                            : 'bg-slate-800 border-slate-700'
                          : isLight
                          ? 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'
                          : 'bg-slate-900 border-transparent hover:bg-slate-850 hover:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl shrink-0 leading-none">{country.flag}</span>
                        <div className="truncate">
                          <p className="text-xs font-bold truncate flex items-center gap-1.5">
                            <span>{country.name}</span>
                            <span className="text-[10px] text-slate-400 font-normal">
                              ({country.nativeName})
                            </span>
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">
                            Currency: <strong className="text-slate-600 dark:text-slate-300">{country.currency}</strong> ({country.symbolNative}) • Dial: <strong className="text-slate-600 dark:text-slate-300">{country.dialCode}</strong>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 ml-2">
                        <span className="text-xs font-mono font-bold text-slate-500">
                          {formatLocalizedPrice(100, country)}
                        </span>
                        {isSelected && (
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center text-white"
                            style={{ backgroundColor: currentThemeConfig.primaryHex }}
                          >
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <div>
              <p className={`text-xs mb-3 font-medium ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                Choose your preferred interface language. Arabic automatically activates right-to-left (RTL) reading.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SUPPORTED_LANGUAGES.map(lang => {
                  const isSelected = activeLanguage === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => handleSelectLanguage(lang.code)}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? isLight
                            ? 'bg-slate-100 border-slate-400 shadow-sm'
                            : 'bg-slate-800 border-slate-600 shadow-md'
                          : isLight
                          ? 'bg-white border-slate-200 hover:bg-slate-50'
                          : 'bg-slate-900 border-slate-800 hover:bg-slate-850'
                      }`}
                      style={{
                        borderColor: isSelected ? currentThemeConfig.primaryHex : undefined,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl leading-none">{lang.flag}</span>
                        <div>
                          <span className="text-sm font-bold block">{lang.nativeName}</span>
                          <span className="text-xs text-slate-400">{lang.name} ({lang.dir.toUpperCase()})</span>
                        </div>
                      </div>

                      {isSelected && (
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center text-white"
                          style={{ backgroundColor: currentThemeConfig.primaryHex }}
                        >
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div
          className={`px-5 py-3.5 border-t flex items-center justify-between ${
            isLight ? 'bg-slate-50 border-slate-100' : 'bg-slate-950/80 border-slate-800'
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>Selected:</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {activeCountry.flag} {activeCountry.name} ({activeCountry.currency}, {activeCountry.dialCode})
            </span>
          </div>

          <button
            type="button"
            id="apply-locale-settings-btn"
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl text-white text-xs font-extrabold transition-all shadow-md active:scale-95 cursor-pointer"
            style={{
              backgroundColor: currentThemeConfig.primaryHex,
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

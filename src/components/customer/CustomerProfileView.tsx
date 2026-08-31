import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ThemeSwitcherModal } from '../common/ThemeSwitcherModal';
import { SecurityBadge } from '../common/SecurityBadge';
import { parsePhoneNumber } from '../../utils/countryCodes';
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Smartphone,
  Mail,
  Lock,
  User,
  Calendar,
  Globe,
  Palette,
  Sun,
  Moon,
  Store,
  Sparkles,
  CheckCircle2,
  Camera,
  HelpCircle,
  RotateCcw,
  MessageCircle,
} from 'lucide-react';

const COUNTRIES = [
  'India',
  'United Arab Emirates',
  'Saudi Arabia',
  'United States',
  'United Kingdom',
  'Canada',
  'Qatar',
  'Kuwait',
  'Bahrain',
  'Oman',
  'Australia',
  'Germany',
  'France',
  'Singapore',
  'Malaysia',
  'Egypt',
  'Jordan',
  'Pakistan',
  'Bangladesh',
  'Philippines',
  'Italy',
  'Spain',
  'Netherlands',
  'Switzerland',
  'Japan',
  'South Korea',
];

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
];

type ActiveEditField = 'name' | 'phone' | 'email' | 'pin' | 'gender' | 'dob' | 'nationality' | 'avatar' | null;

export const CustomerProfileView: React.FC = () => {
  const {
    customerUser,
    loginAsCustomer,
    setActiveCustomerTab,
    setCurrentRole,
    setShowSplash,
    setAuthModalOpen,
    setAuthMode,
    currentThemeConfig,
    colorThemeMode,
    toggleColorThemeMode,
    appointments,
  } = useApp();

  const isLight = colorThemeMode === 'light';
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const [activeEditModal, setActiveEditModal] = useState<ActiveEditField>(null);

  const [nameVal, setNameVal] = useState(customerUser.name || 'MOHAMED ASHIK');
  const [phoneVal, setPhoneVal] = useState(customerUser.phone || '971544298306');
  const [emailVal, setEmailVal] = useState(customerUser.email || 'ashik160799@gmail.com');
  const [pinVal, setPinVal] = useState(customerUser.appCode || '1234');
  const [confirmPinVal, setConfirmPinVal] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);
  const [genderVal, setGenderVal] = useState<'Male' | 'Female' | 'Other' | 'Prefer not to say'>(
    customerUser.gender || 'Male'
  );
  const [dobVal, setDobVal] = useState(customerUser.dateOfBirth || '1999-07-16');
  const [nationalityVal, setNationalityVal] = useState(customerUser.nationality || 'India');
  const [avatarVal, setAvatarVal] = useState(customerUser.avatar || AVATAR_PRESETS[0]);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [countrySearch, setCountrySearch] = useState('');
  const [savedToast, setSavedToast] = useState<string | null>(null);

  const [smsAlerts, setSmsAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [supportModalOpen, setSupportModalOpen] = useState(false);

  const showToast = (message: string) => {
    setSavedToast(message);
    setTimeout(() => setSavedToast(null), 2500);
  };

  const openFieldEditor = (field: ActiveEditField) => {
    setPinError(null);
    setConfirmPinVal('');
    switch (field) {
      case 'name':
        setNameVal(customerUser.name || '');
        break;
      case 'phone':
        setPhoneVal(customerUser.phone || '');
        break;
      case 'email':
        setEmailVal(customerUser.email || '');
        break;
      case 'pin':
        setPinVal(customerUser.appCode || '1234');
        setConfirmPinVal(customerUser.appCode || '1234');
        break;
      case 'gender':
        setGenderVal(customerUser.gender || 'Male');
        break;
      case 'dob':
        setDobVal(customerUser.dateOfBirth || '1999-07-16');
        break;
      case 'nationality':
        setNationalityVal(customerUser.nationality || 'India');
        setCountrySearch('');
        break;
      case 'avatar':
        setAvatarVal(customerUser.avatar || AVATAR_PRESETS[0]);
        setCustomAvatarUrl('');
        break;
    }
    setActiveEditModal(field);
  };

  const handleSaveField = (field: ActiveEditField) => {
    switch (field) {
      case 'name':
        if (!nameVal.trim()) return;
        loginAsCustomer({ name: nameVal.trim() });
        showToast('Name updated successfully');
        break;
      case 'phone':
        if (!phoneVal.trim()) return;
        loginAsCustomer({ phone: phoneVal.trim() });
        showToast('Phone number updated successfully');
        break;
      case 'email':
        loginAsCustomer({ email: emailVal.trim() });
        showToast('Sign-up Gmail / Email ID updated successfully');
        break;
      case 'pin':
        if (!/^\d{4}$/.test(pinVal)) {
          setPinError('App Code must be exactly 4 numeric digits (e.g. 1234).');
          return;
        }
        if (confirmPinVal && pinVal !== confirmPinVal) {
          setPinError('PIN confirmation does not match.');
          return;
        }
        loginAsCustomer({ appCode: pinVal.trim() });
        showToast('4-Digit Security PIN reset successfully');
        break;
      case 'gender':
        loginAsCustomer({ gender: genderVal });
        showToast('Gender preference updated');
        break;
      case 'dob':
        loginAsCustomer({ dateOfBirth: dobVal });
        showToast('Date of birth updated');
        break;
      case 'nationality':
        loginAsCustomer({ nationality: nationalityVal });
        showToast('Nationality updated');
        break;
      case 'avatar':
        loginAsCustomer({ avatar: customAvatarUrl.trim() || avatarVal });
        showToast('Profile photo updated');
        break;
      default:
        break;
    }
    setActiveEditModal(null);
  };

  const filteredCountries = COUNTRIES.filter(c =>
    c.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const customerAppointments = appointments.filter(a => a.customerId === customerUser.id);
  const parsedPhone = parsePhoneNumber(customerUser.phone || '971544298306');

  return (
    <div className="max-w-2xl mx-auto pb-24 space-y-5 px-1 sm:px-0 animate-in fade-in duration-200">
      <div className="flex items-center justify-between pt-1">
        <button
          id="profile-back-btn"
          type="button"
          onClick={() => setActiveCustomerTab('discover')}
          className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition-all duration-150 active:scale-95 shadow-xs cursor-pointer ${
            isLight
              ? 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
              : 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800'
          }`}
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
        </button>

        <div className="text-center">
          <h1 className={`text-base font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Profile & Settings
          </h1>
          <p className={`text-[11px] font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Manage your account credentials & preferences
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="profile-quick-mode-toggle"
            type="button"
            onClick={toggleColorThemeMode}
            className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition-all duration-150 active:scale-95 shadow-xs cursor-pointer ${
              isLight
                ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-950'
                : 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800 hover:text-white'
            }`}
            title={isLight ? 'Switch to Dark Luxury' : 'Switch to Light Boutique'}
            aria-label="Toggle Theme Mode"
          >
            {isLight ? <Moon className="w-4 h-4 text-indigo-500" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          <button
            id="profile-theme-picker-btn"
            type="button"
            onClick={() => setThemeModalOpen(true)}
            className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition-all duration-150 active:scale-95 shadow-xs relative cursor-pointer ${
              isLight
                ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-950'
                : 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800 hover:text-white'
            }`}
            title="Customize Theme & Salon Palettes"
            aria-label="Theme & Salon Palettes"
          >
            <Palette className="w-4 h-4" style={{ color: currentThemeConfig.primaryHex }} />
            <span
              className="absolute top-2 right-2 w-2 h-2 rounded-full ring-2 ring-white dark:ring-slate-900"
              style={{ backgroundColor: currentThemeConfig.primaryHex }}
            />
          </button>
        </div>
      </div>

      {savedToast && (
        <div
          className="p-3.5 rounded-2xl border flex items-center gap-2.5 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200"
          style={{
            backgroundColor: isLight ? '#f0fdf4' : '#052e16',
            borderColor: '#22c55e',
            color: isLight ? '#15803d' : '#4ade80',
          }}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
          <span className="text-xs font-bold">{savedToast}</span>
        </div>
      )}

      <div
        className={`p-4 sm:p-5 rounded-3xl border shadow-sm relative overflow-hidden transition-all ${
          isLight
            ? 'bg-gradient-to-br from-white via-slate-50 to-white border-slate-200/90'
            : 'bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border-slate-800'
        }`}
        style={{
          boxShadow: `0 10px 30px -10px ${currentThemeConfig.glowHex}`,
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative group shrink-0 self-center sm:self-auto">
            <img
              src={customerUser.avatar || AVATAR_PRESETS[0]}
              alt={customerUser.name}
              className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-offset-2 transition-transform group-hover:scale-105"
              style={{
                borderColor: currentThemeConfig.primaryHex,
                boxShadow: `0 4px 14px ${currentThemeConfig.glowHex}`,
              }}
              referrerPolicy="no-referrer"
            />
            <button
              type="button"
              onClick={() => openFieldEditor('avatar')}
              className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full text-white flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer"
              style={{ backgroundColor: currentThemeConfig.primaryHex }}
              title="Change Profile Photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 min-w-0 text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <h2
                className={`text-lg sm:text-xl font-black tracking-tight truncate ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                {customerUser.name || 'MOHAMED ASHIK'}
              </h2>
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase text-white shrink-0 shadow-xs"
                style={{ backgroundColor: currentThemeConfig.primaryHex }}
              >
                VIP Member
              </span>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs">
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27a7.17 7.17 0 0 1 0-4.54V6.58H1.25a11.97 11.97 0 0 0 0 10.84l4.03-3.15Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
                />
              </svg>
              <span className={`font-semibold truncate ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                {customerUser.email || 'ashik160799@gmail.com'}
              </span>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-1.5 flex-wrap">
              <span className="text-sm leading-none" role="img" aria-label={parsedPhone.country.name}>
                {parsedPhone.country.flag}
              </span>
              <span className={`text-xs font-mono font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                {parsedPhone.dialCode} {parsedPhone.nationalNumber}
              </span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${
                  isLight ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                {parsedPhone.country.name}
              </span>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-2 pt-1 flex-wrap">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold border ${
                  isLight
                    ? 'bg-amber-50 border-amber-200 text-amber-800'
                    : 'bg-amber-950/40 border-amber-800/60 text-amber-300'
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                <span>{customerUser.loyaltyPoints || 420} Loyalty Points</span>
              </span>

              <span className={`text-[11px] font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                ≈ ${(customerUser.loyaltyPoints || 420) / 20} Wallet Balance
              </span>
            </div>
          </div>
        </div>

        <div
          className={`grid grid-cols-3 gap-2 mt-4 pt-4 border-t ${
            isLight ? 'border-slate-200/80' : 'border-slate-800'
          }`}
        >
          <button
            type="button"
            onClick={() => setActiveCustomerTab('bookings')}
            className={`p-2.5 rounded-2xl border text-center transition-all hover:scale-[1.02] active:scale-95 cursor-pointer ${
              isLight ? 'bg-white border-slate-200/80 hover:bg-slate-50' : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/50'
            }`}
          >
            <div className={`text-base font-extrabold font-mono leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {customerAppointments.length || 3}
            </div>
            <div className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Bookings
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveCustomerTab('saved')}
            className={`p-2.5 rounded-2xl border text-center transition-all hover:scale-[1.02] active:scale-95 cursor-pointer ${
              isLight ? 'bg-white border-slate-200/80 hover:bg-slate-50' : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/50'
            }`}
          >
            <div className={`text-base font-extrabold font-mono leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {customerUser.savedSalonIds.length || 2}
            </div>
            <div className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Saved Salons
            </div>
          </button>

          <button
            type="button"
            onClick={() => setThemeModalOpen(true)}
            className={`p-2.5 rounded-2xl border text-center transition-all hover:scale-[1.02] active:scale-95 cursor-pointer ${
              isLight ? 'bg-white border-slate-200/80 hover:bg-slate-50' : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/50'
            }`}
          >
            <div
              className="text-base font-extrabold truncate leading-tight"
              style={{ color: currentThemeConfig.primaryHex }}
            >
              {currentThemeConfig.name.split(' ')[0]}
            </div>
            <div className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Theme Palette
            </div>
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className={`text-xs font-extrabold uppercase tracking-wider ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Personal Information & Credentials
          </h3>
          <span className="text-[11px] text-slate-400 font-medium">Tap row to edit</span>
        </div>

        <div
          className={`rounded-3xl border overflow-hidden shadow-sm divide-y transition-colors ${
            isLight
              ? 'bg-white border-slate-200/80 divide-slate-100'
              : 'bg-slate-900/90 border-slate-800 divide-slate-800/80'
          }`}
        >
          <div
            id="profile-item-name"
            onClick={() => openFieldEditor('name')}
            role="button"
            tabIndex={0}
            className={`p-3.5 sm:p-4 flex items-center justify-between cursor-pointer transition-colors ${
              isLight ? 'hover:bg-slate-50 active:bg-slate-100' : 'hover:bg-slate-800/60 active:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3.5 min-w-0 pr-2">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isLight ? 'bg-slate-100 text-slate-800' : 'bg-slate-800 text-slate-200'
                }`}
              >
                <User className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="min-w-0">
                <h4 className={`text-sm font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Full Name
                </h4>
                <p className={`text-xs mt-0.5 truncate uppercase font-semibold ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  {customerUser.name || 'MOHAMED ASHIK'}
                </p>
              </div>
            </div>
            <ArrowRight className={`w-4 h-4 shrink-0 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
          </div>

          <div
            id="profile-item-email"
            onClick={() => openFieldEditor('email')}
            role="button"
            tabIndex={0}
            className={`p-3.5 sm:p-4 flex items-center justify-between cursor-pointer transition-colors ${
              isLight ? 'hover:bg-slate-50 active:bg-slate-100' : 'hover:bg-slate-800/60 active:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3.5 min-w-0 pr-2">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isLight ? 'bg-red-50 text-red-600' : 'bg-red-950/40 text-red-400'
                }`}
              >
                <Mail className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className={`text-sm font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    Sign-up Gmail / Email ID
                  </h4>
                  <span className="text-[10px] font-extrabold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20 flex items-center gap-0.5">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>Verified</span>
                  </span>
                </div>
                <p className={`text-xs mt-0.5 truncate font-medium ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  {customerUser.email || 'ashik160799@gmail.com'}
                </p>
              </div>
            </div>
            <ArrowRight className={`w-4 h-4 shrink-0 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
          </div>

          <div
            id="profile-item-phone"
            onClick={() => openFieldEditor('phone')}
            role="button"
            tabIndex={0}
            className={`p-3.5 sm:p-4 flex items-center justify-between cursor-pointer transition-colors ${
              isLight ? 'hover:bg-slate-50 active:bg-slate-100' : 'hover:bg-slate-800/60 active:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3.5 min-w-0 pr-2">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isLight ? 'bg-slate-100 text-slate-800' : 'bg-slate-800 text-slate-200'
                }`}
              >
                <Smartphone className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="min-w-0">
                <h4 className={`text-sm font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Mobile Contact Number
                </h4>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="text-sm leading-none" role="img" aria-label={parsedPhone.country.name}>
                    {parsedPhone.country.flag}
                  </span>
                  <span className={`text-xs font-semibold font-mono ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
                    {parsedPhone.dialCode} {parsedPhone.nationalNumber}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md border ${
                      isLight
                        ? 'bg-slate-100 border-slate-200 text-slate-600'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    {parsedPhone.country.name}
                  </span>
                </div>
              </div>
            </div>
            <ArrowRight className={`w-4 h-4 shrink-0 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
          </div>

          <div
            id="profile-item-pin"
            onClick={() => openFieldEditor('pin')}
            role="button"
            tabIndex={0}
            className={`p-3.5 sm:p-4 flex items-center justify-between cursor-pointer transition-colors ${
              isLight ? 'hover:bg-slate-50 active:bg-slate-100' : 'hover:bg-slate-800/60 active:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3.5 min-w-0 pr-2">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isLight ? 'bg-amber-50 text-amber-600' : 'bg-amber-950/40 text-amber-400'
                }`}
              >
                <Lock className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className={`text-sm font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    4-Digit Security PIN
                  </h4>
                  <span className="text-[10px] font-extrabold text-amber-600 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20 flex items-center gap-0.5">
                    <RotateCcw className="w-2.5 h-2.5" />
                    <span>Reset PIN</span>
                  </span>
                </div>
                <p className={`text-xs mt-0.5 font-medium font-mono ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  •••• (Terminal fast-access code: {customerUser.appCode || '1234'})
                </p>
              </div>
            </div>
            <ArrowRight className={`w-4 h-4 shrink-0 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
          </div>

          <div
            id="profile-item-gender"
            onClick={() => openFieldEditor('gender')}
            role="button"
            tabIndex={0}
            className={`p-3.5 sm:p-4 flex items-center justify-between cursor-pointer transition-colors ${
              isLight ? 'hover:bg-slate-50 active:bg-slate-100' : 'hover:bg-slate-800/60 active:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3.5 min-w-0 pr-2">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isLight ? 'bg-slate-100 text-slate-800' : 'bg-slate-800 text-slate-200'
                }`}
              >
                <CreditCard className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="min-w-0">
                <h4 className={`text-sm font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Gender Preference
                </h4>
                <p className={`text-xs mt-0.5 truncate font-semibold ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  {customerUser.gender || 'Male'}
                </p>
              </div>
            </div>
            <ArrowRight className={`w-4 h-4 shrink-0 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
          </div>

          <div
            id="profile-item-dob"
            onClick={() => openFieldEditor('dob')}
            role="button"
            tabIndex={0}
            className={`p-3.5 sm:p-4 flex items-center justify-between cursor-pointer transition-colors ${
              isLight ? 'hover:bg-slate-50 active:bg-slate-100' : 'hover:bg-slate-800/60 active:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3.5 min-w-0 pr-2">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isLight ? 'bg-slate-100 text-slate-800' : 'bg-slate-800 text-slate-200'
                }`}
              >
                <Calendar className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="min-w-0">
                <h4 className={`text-sm font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Date of Birth
                </h4>
                <p className={`text-xs mt-0.5 truncate font-semibold font-mono ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  {customerUser.dateOfBirth || '1999-07-16'}
                </p>
              </div>
            </div>
            <ArrowRight className={`w-4 h-4 shrink-0 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
          </div>

          <div
            id="profile-item-nationality"
            onClick={() => openFieldEditor('nationality')}
            role="button"
            tabIndex={0}
            className={`p-3.5 sm:p-4 flex items-center justify-between cursor-pointer transition-colors ${
              isLight ? 'hover:bg-slate-50 active:bg-slate-100' : 'hover:bg-slate-800/60 active:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3.5 min-w-0 pr-2">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isLight ? 'bg-slate-100 text-slate-800' : 'bg-slate-800 text-slate-200'
                }`}
              >
                <Globe className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="min-w-0">
                <h4 className={`text-sm font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Nationality / Region
                </h4>
                <p className={`text-xs mt-0.5 truncate font-semibold ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  {customerUser.nationality || 'India'}
                </p>
              </div>
            </div>
            <ArrowRight className={`w-4 h-4 shrink-0 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
          </div>
        </div>

        <SecurityBadge variant="banner" />
      </div>

      <div className="space-y-2">
        <div className="px-1">
          <h3 className={`text-xs font-extrabold uppercase tracking-wider ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Notification Preferences
          </h3>
        </div>

        <div
          className={`p-4 sm:p-5 rounded-3xl border shadow-sm space-y-4 transition-colors ${
            isLight ? 'bg-white border-slate-200/80' : 'bg-slate-900/90 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isLight ? 'bg-slate-100 text-slate-800' : 'bg-slate-800 text-slate-200'
                }`}
              >
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  SMS Appointment Reminders
                </h4>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Receive 2h advance SMS reminder before your scheduled appointment
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setSmsAlerts(!smsAlerts);
                showToast(smsAlerts ? 'SMS alerts turned off' : 'SMS alerts activated');
              }}
              className={`w-12 h-7 rounded-full p-1 transition-colors relative shrink-0 cursor-pointer ${
                smsAlerts ? 'bg-emerald-500' : isLight ? 'bg-slate-200' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  smsAlerts ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isLight ? 'bg-emerald-50 text-emerald-600' : 'bg-emerald-950/40 text-emerald-400'
                }`}
              >
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  WhatsApp Instant Digital Pass
                </h4>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Direct pass QR code & location link sent directly to your WhatsApp
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setWhatsappAlerts(!whatsappAlerts);
                showToast(whatsappAlerts ? 'WhatsApp alerts disabled' : 'WhatsApp alerts activated');
              }}
              className={`w-12 h-7 rounded-full p-1 transition-colors relative shrink-0 cursor-pointer ${
                whatsappAlerts ? 'bg-emerald-500' : isLight ? 'bg-slate-200' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  whatsappAlerts ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div
        className={`p-4 sm:p-5 rounded-3xl border shadow-sm flex items-center justify-between gap-3 transition-colors ${
          isLight ? 'bg-white border-slate-200/80' : 'bg-slate-900/90 border-slate-800'
        }`}
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm"
            style={{ backgroundColor: currentThemeConfig.primaryHex }}
          >
            <HelpCircle className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className={`text-sm font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
              ALGO Concierge & VIP Help
            </h4>
            <p className={`text-xs truncate ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              24/7 assistance with rescheduling, custom stylists, or billing
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setSupportModalOpen(true)}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors shrink-0 cursor-pointer ${
            isLight
              ? 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
              : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
          }`}
        >
          Contact Support
        </button>
      </div>

      <div
        className={`p-4 sm:p-5 rounded-3xl border space-y-4 shadow-sm ${
          isLight ? 'bg-white border-slate-200/80' : 'bg-slate-900/90 border-slate-800'
        }`}
      >
        <div
          className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isLight ? 'bg-slate-50 border-slate-200/80' : 'bg-slate-950 border-slate-800'
          }`}
        >
          <div>
            <h4
              className={`text-xs font-bold flex items-center gap-1.5 ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              <Store className="w-4 h-4 shrink-0" style={{ color: currentThemeConfig.primaryHex }} />
              <span>Salon Owner or Stylist?</span>
            </h4>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Switch to ALGO Business Hub to manage bookings, staff, and schedules.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCurrentRole('business')}
            className="px-4 py-2.5 rounded-xl text-white font-bold text-xs shadow-md shrink-0 transition-transform active:scale-95 cursor-pointer"
            style={{
              backgroundColor: currentThemeConfig.primaryHex,
            }}
          >
            Open Business Hub →
          </button>
        </div>
      </div>

      <ThemeSwitcherModal isOpen={themeModalOpen} onClose={() => setThemeModalOpen(false)} />
    </div>
  );
};

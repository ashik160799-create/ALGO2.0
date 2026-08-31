import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AlgoLogo } from '../common/AlgoLogo';
import { ThemeSwitcherModal } from '../common/ThemeSwitcherModal';
import { LocaleRegionSwitcherModal } from '../common/LocaleRegionSwitcherModal';
import {
  Store,
  LayoutDashboard,
  Calendar,
  Scissors,
  Users,
  User,
  Bell,
  Sparkles,
  ChevronDown,
  Palette,
  Sun,
  Moon,
  BarChart3,
  Settings,
} from 'lucide-react';

export const BusinessNavbar: React.FC = () => {
  const {
    businessUser,
    activeBusinessTab,
    setActiveBusinessTab,
    setCurrentRole,
    setShowSplash,
    setAuthModalOpen,
    setAuthMode,
    salons,
    updateSalonProfile,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    appointments,
    currentThemeConfig,
    colorThemeMode,
    toggleColorThemeMode,
    activeCountry,
    isLocaleModalOpen,
    setIsLocaleModalOpen,
  } = useApp();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [themeModalOpen, setThemeModalOpen] = useState(false);

  const isLight = colorThemeMode === 'light';
  const activeSalon = salons.find(s => s.id === businessUser.salonId) || salons[0];
  const businessNotifs = notifications.filter(n => n.userType === 'business');
  const unreadCount = businessNotifs.filter(n => !n.read).length;

  const todayBookingsCount = appointments.filter(
    a => a.salonId === activeSalon.id && a.status === 'confirmed'
  ).length;

  const pendingRequestsCount = appointments.filter(
    a => a.salonId === activeSalon.id && a.status === 'pending'
  ).length;

  const toggleSalonOpenState = () => {
    updateSalonProfile(activeSalon.id, {
      isOpenNow: !activeSalon.isOpenNow,
    });
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full backdrop-blur-md border-b shadow-sm transition-colors ${
        isLight ? 'bg-white/95 border-slate-200 text-slate-900' : 'bg-slate-950/95 border-slate-800 text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 w-full">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-1 sm:gap-2">
          <div className="flex items-center gap-2 shrink-0">
            <button
              id="business-brand-logo-btn"
              onClick={() => setActiveBusinessTab('overview')}
              className="text-left focus:outline-none flex items-center transition-transform hover:opacity-90 active:scale-95 shrink-0"
              title="ALGO Salon Partner Hub"
            >
              <AlgoLogo size="sm" subtext="PARTNER" />
            </button>

            <div
              className={`hidden 2xl:flex items-center gap-2 px-3 py-1 rounded-2xl border shrink-0 ${
                isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-slate-800'
              }`}
            >
              <Store className="w-3.5 h-3.5" style={{ color: currentThemeConfig.accentHex }} />
              <div className="text-xs">
                <span className={`font-bold block truncate max-w-[140px] ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {activeSalon.name}
                </span>
              </div>
              <button
                onClick={toggleSalonOpenState}
                className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                  activeSalon.isOpenNow
                    ? isLight
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                    : isLight
                    ? 'bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                }`}
              >
                {activeSalon.isOpenNow ? '● OPEN' : '● CLOSED'}
              </button>
            </div>
          </div>

          <nav
            className={`hidden lg:flex items-center gap-0.5 xl:gap-1 p-1 rounded-2xl border text-xs font-semibold shrink-0 ${
              isLight ? 'bg-slate-100/90 border-slate-200/90' : 'bg-slate-900/90 border-slate-800'
            }`}
          >
            <button
              id="biz-nav-overview"
              onClick={() => setActiveBusinessTab('overview')}
              className={`flex items-center gap-1 xl:gap-1.5 px-2 xl:px-3 py-1.5 rounded-xl transition-all text-[11px] xl:text-xs ${
                activeBusinessTab === 'overview'
                  ? 'text-white shadow font-bold'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              style={{
                backgroundColor: activeBusinessTab === 'overview' ? currentThemeConfig.primaryHex : undefined,
              }}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>

            <button
              id="biz-nav-customers"
              onClick={() => setActiveBusinessTab('customers')}
              className={`flex items-center gap-1 xl:gap-1.5 px-2 xl:px-3 py-1.5 rounded-xl transition-all text-[11px] xl:text-xs relative ${
                activeBusinessTab === 'customers'
                  ? 'text-white shadow font-bold'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              style={{
                backgroundColor: activeBusinessTab === 'customers' ? currentThemeConfig.primaryHex : undefined,
              }}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Customers</span>
              {pendingRequestsCount > 0 && (
                <span className="w-3.5 h-3.5 rounded-full bg-amber-400 text-slate-950 text-[9px] flex items-center justify-center font-bold animate-pulse">
                  {pendingRequestsCount}
                </span>
              )}
            </button>

            <button
              id="biz-nav-staff"
              onClick={() => setActiveBusinessTab('staff')}
              className={`flex items-center gap-1 xl:gap-1.5 px-2 xl:px-3 py-1.5 rounded-xl transition-all text-[11px] xl:text-xs ${
                activeBusinessTab === 'staff'
                  ? 'text-white shadow font-bold'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              style={{
                backgroundColor: activeBusinessTab === 'staff' ? currentThemeConfig.primaryHex : undefined,
              }}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Staff</span>
            </button>

            <button
              id="biz-nav-services"
              onClick={() => setActiveBusinessTab('services')}
              className={`flex items-center gap-1 xl:gap-1.5 px-2 xl:px-3 py-1.5 rounded-xl transition-all text-[11px] xl:text-xs ${
                activeBusinessTab === 'services'
                  ? 'text-white shadow font-bold'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              style={{
                backgroundColor: activeBusinessTab === 'services' ? currentThemeConfig.primaryHex : undefined,
              }}
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>Services</span>
            </button>

            <button
              id="biz-nav-calendar"
              onClick={() => setActiveBusinessTab('calendar')}
              className={`flex items-center gap-1 xl:gap-1.5 px-2 xl:px-3 py-1.5 rounded-xl transition-all text-[11px] xl:text-xs relative ${
                activeBusinessTab === 'calendar'
                  ? 'text-white shadow font-bold'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              style={{
                backgroundColor: activeBusinessTab === 'calendar' ? currentThemeConfig.primaryHex : undefined,
              }}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Bookings</span>
              {todayBookingsCount > 0 && (
                <span className="w-3.5 h-3.5 rounded-full bg-amber-400 text-slate-950 text-[9px] flex items-center justify-center font-bold">
                  {todayBookingsCount}
                </span>
              )}
            </button>

            <button
              id="biz-nav-reports"
              onClick={() => setActiveBusinessTab('reports')}
              className={`flex items-center gap-1 xl:gap-1.5 px-2 xl:px-3 py-1.5 rounded-xl transition-all text-[11px] xl:text-xs ${
                activeBusinessTab === 'reports'
                  ? 'text-white shadow font-bold'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              style={{
                backgroundColor: activeBusinessTab === 'reports' ? currentThemeConfig.primaryHex : undefined,
              }}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Reports</span>
            </button>

            <button
              id="biz-nav-profile"
              onClick={() => setActiveBusinessTab('profile')}
              className={`flex items-center gap-1 xl:gap-1.5 px-2 xl:px-3 py-1.5 rounded-xl transition-all text-[11px] xl:text-xs ${
                activeBusinessTab === 'profile' || activeBusinessTab === 'settings'
                  ? 'text-white shadow font-bold'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              style={{
                backgroundColor: activeBusinessTab === 'profile' || activeBusinessTab === 'settings' ? currentThemeConfig.primaryHex : undefined,
              }}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              id="biz-navbar-locale-btn"
              type="button"
              onClick={() => setIsLocaleModalOpen(true)}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-xs ${
                isLight
                  ? 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
                  : 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800'
              }`}
              title={`Region: ${activeCountry.name} (${activeCountry.currency}, ${activeCountry.dialCode}) - Click to configure`}
            >
              <span className="text-sm leading-none">{activeCountry.flag}</span>
              <span className="font-mono text-[11px] font-extrabold">{activeCountry.currency}</span>
              <span className="text-[10px] text-slate-400 font-mono hidden 2xl:inline">{activeCountry.dialCode}</span>
            </button>

            <button
              id="biz-theme-mode-toggle"
              type="button"
              onClick={toggleColorThemeMode}
              className={`p-1.5 sm:p-2 rounded-xl border transition-all ${
                isLight
                  ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200/80 hover:text-slate-950'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
              }`}
              title={isLight ? 'Switch to Dark Mode (Noir)' : 'Switch to Light Mode (Clean)'}
            >
              {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            <button
              id="biz-header-theme-btn"
              type="button"
              onClick={() => setThemeModalOpen(true)}
              className={`hidden md:inline-flex items-center gap-1.5 px-2 xl:px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all shadow-sm group ${
                isLight
                  ? 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200/80'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200'
              }`}
              title="Change Color Theme & Palette"
            >
              <span
                className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                style={{ backgroundColor: currentThemeConfig.primaryHex }}
              />
              <span className={`hidden 2xl:inline text-xs font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                {currentThemeConfig.name}
              </span>
              <Palette className={`w-3.5 h-3.5 ${isLight ? 'text-slate-500 group-hover:text-slate-900' : 'text-slate-400 group-hover:text-white'}`} />
            </button>

            <button
              id="switch-to-customer-btn"
              onClick={() => setCurrentRole('customer')}
              className={`hidden sm:inline-flex items-center gap-1.5 px-2 xl:px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all shadow-sm ${
                isLight
                  ? 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title="Switch to Customer Booking App"
            >
              <User className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden xl:inline">Customer View</span>
              <span className="xl:hidden">Customer</span>
            </button>

            <div className="relative">
              <button
                id="biz-notifications-btn"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className={`relative p-1.5 sm:p-2 rounded-xl border transition-colors ${
                  isLight
                    ? 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-950'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] text-white flex items-center justify-center font-bold animate-pulse"
                    style={{ backgroundColor: currentThemeConfig.primaryHex }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div
                  className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border shadow-2xl p-4 z-50 animate-fadeIn ${
                    isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-700 text-slate-200'
                  }`}
                >
                  <div className={`flex items-center justify-between pb-2 border-b ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4" style={{ color: currentThemeConfig.accentHex }} />
                      <span className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        Partner Activity Alerts
                      </span>
                    </div>
                    {businessNotifs.length > 0 && (
                      <button
                        onClick={() => clearAllNotifications('business')}
                        className={`text-[11px] ${isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'}`}
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  <div className={`mt-3 max-h-72 overflow-y-auto space-y-2.5 divide-y ${isLight ? 'divide-slate-100' : 'divide-slate-800/50'}`}>
                    {businessNotifs.length === 0 ? (
                      <div className={`text-center py-6 text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        No activity notifications yet.
                      </div>
                    ) : (
                      businessNotifs.map(n => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(n.id);
                            if (n.type === 'booking') setActiveBusinessTab('calendar');
                            if (n.type === 'review') setActiveBusinessTab('reviews');
                            setNotificationsOpen(false);
                          }}
                          className={`pt-2 cursor-pointer transition-colors ${
                            !n.read
                              ? isLight
                                ? 'bg-slate-50 p-2 rounded-xl border border-slate-200'
                                : 'bg-slate-900/60 p-2 rounded-xl border border-slate-700'
                              : ''
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <h4 className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                              {n.title}
                            </h4>
                            <span className="text-[10px] text-slate-500">{n.timestamp}</span>
                          </div>
                          <p className={`text-xs mt-0.5 leading-tight ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                            {n.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                id="biz-profile-menu-btn"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className={`flex items-center gap-2 p-1.5 rounded-xl border transition-all text-xs ${
                  isLight
                    ? 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow"
                  style={{ backgroundColor: currentThemeConfig.primaryHex }}
                >
                  {businessUser.name.charAt(0)}
                </div>
                <span className={`hidden sm:inline font-semibold max-w-[100px] truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {businessUser.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {profileDropdownOpen && (
                <div
                  className={`absolute right-0 mt-2 w-60 rounded-2xl border shadow-2xl p-2 z-50 text-xs animate-fadeIn ${
                    isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-700 text-slate-200'
                  }`}
                >
                  <div className={`p-2 border-b ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                    <p className={`font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{businessUser.name}</p>
                    <p className={`text-[11px] truncate ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{businessUser.ownerRole}</p>
                    <p className={`text-[10px] truncate mt-1 ${isLight ? 'text-slate-500' : 'text-slate-300'}`}>
                      Salon: {activeSalon.name}
                    </p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setThemeModalOpen(true);
                        setProfileDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 ${
                        isLight ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-900' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <Palette className="w-3.5 h-3.5" style={{ color: currentThemeConfig.accentHex }} />
                      Change Colors & Theme
                    </button>
                    <button
                      onClick={() => {
                        setActiveBusinessTab('overview');
                        setProfileDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 ${
                        isLight ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-900' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-indigo-500" />
                      Business Dashboard
                    </button>
                    <button
                      onClick={() => {
                        setActiveBusinessTab('profile');
                        setProfileDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 ${
                        isLight ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-900' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <Store className="w-3.5 h-3.5 text-purple-500" />
                      Salon Settings
                    </button>
                  </div>

                  <div className={`pt-1 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                    <button
                      onClick={() => {
                        setShowSplash(true);
                        setProfileDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 ${
                        isLight ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      View Splash Screen
                    </button>
                    <button
                      onClick={() => {
                        setCurrentRole('customer');
                        setProfileDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 font-medium ${
                        isLight ? 'text-purple-700 hover:bg-purple-50' : 'text-purple-300 hover:bg-purple-950/50'
                      }`}
                    >
                      <User className="w-3.5 h-3.5 text-purple-500" />
                      Switch to Customer Portal
                    </button>
                    <button
                      onClick={() => {
                        setAuthMode('login');
                        setAuthModalOpen(true);
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    >
                      Log Out / Switch Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ThemeSwitcherModal isOpen={themeModalOpen} onClose={() => setThemeModalOpen(false)} />
      <LocaleRegionSwitcherModal isOpen={isLocaleModalOpen} onClose={() => setIsLocaleModalOpen(false)} />
    </header>
  );
};

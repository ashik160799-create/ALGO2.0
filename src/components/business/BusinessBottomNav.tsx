import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  Users,
  Calendar,
  BarChart3,
  Settings,
} from 'lucide-react';

interface BusinessBottomNavProps {
  onOpenReports?: () => void;
}

export const BusinessBottomNav: React.FC<BusinessBottomNavProps> = ({
  onOpenReports,
}) => {
  const {
    activeBusinessTab,
    setActiveBusinessTab,
    currentThemeConfig,
    colorThemeMode,
    appointments,
    businessUser,
  } = useApp();

  const isLight = colorThemeMode === 'light';

  const actionableBookings = appointments.filter(
    a =>
      a.salonId === businessUser.salonId &&
      (a.status === 'pending' || a.status === 'rescheduled_by_business')
  ).length;

  const pendingCustomers = appointments.filter(
    a => a.salonId === businessUser.salonId && a.status === 'pending'
  ).length;

  const navItems = [
    {
      id: 'overview',
      label: 'Home',
      icon: Home,
      action: () => setActiveBusinessTab('overview'),
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: Users,
      badge: pendingCustomers > 0 ? pendingCustomers : undefined,
      action: () => setActiveBusinessTab('customers'),
    },
    {
      id: 'calendar',
      label: 'Bookings',
      icon: Calendar,
      badge: actionableBookings > 0 ? actionableBookings : undefined,
      action: () => setActiveBusinessTab('calendar'),
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: BarChart3,
      action: () => setActiveBusinessTab('reports'),
    },
    {
      id: 'profile',
      label: 'Settings',
      icon: Settings,
      action: () => setActiveBusinessTab('profile'),
    },
  ];

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-lg transition-colors lg:hidden ${
        isLight
          ? 'bg-white/95 border-slate-200 text-slate-700 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]'
          : 'bg-slate-950/95 border-slate-800/90 text-slate-400 shadow-[0_-4px_25px_rgba(0,0,0,0.5)]'
      }`}
    >
      <div className="grid grid-cols-5 max-w-lg mx-auto px-2 py-1.5">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive =
            item.id === 'profile'
              ? activeBusinessTab === 'profile' || activeBusinessTab === 'settings'
              : activeBusinessTab === item.id;

          return (
            <button
              key={item.id}
              id={`biz-bottom-nav-${item.id}`}
              type="button"
              onClick={item.action}
              aria-current={isActive ? 'page' : undefined}
              aria-label={`${item.label}${item.badge ? `, ${item.badge} action required` : ''}`}
              className="flex min-h-11 flex-col items-center justify-center py-1 relative group transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset"
            >
              <div
                className={`relative p-1.5 rounded-xl transition-all ${
                  isActive
                    ? 'scale-105'
                    : 'opacity-70 group-hover:opacity-100'
                }`}
                style={
                  isActive
                    ? {
                        color: currentThemeConfig.primaryHex,
                        backgroundColor: `${currentThemeConfig.primaryHex}15`,
                      }
                    : undefined
                }
              >
                <Icon className="w-5 h-5" />
                {item.badge && item.badge > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] text-white flex items-center justify-center font-bold"
                    style={{ backgroundColor: currentThemeConfig.primaryHex }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[11px] tracking-tight font-medium mt-0.5 transition-colors ${
                  isActive
                    ? 'font-bold'
                    : isLight
                    ? 'text-slate-600'
                    : 'text-slate-400'
                }`}
                style={
                  isActive
                    ? { color: currentThemeConfig.primaryHex }
                    : undefined
                }
              >
                {item.label}
              </span>

              {isActive && (
                <span
                  className="absolute bottom-0 w-6 h-0.5 rounded-full"
                  style={{
                    backgroundColor: currentThemeConfig.primaryHex,
                    boxShadow: `0 0 8px ${currentThemeConfig.glowHex}`,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

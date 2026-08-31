import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlgoLogo } from '../common/AlgoLogo';
import { ThemeSwitcherModal } from '../common/ThemeSwitcherModal';
import { LocationPermissionScreen } from './LocationPermissionScreen';
import { CustomerAuthFlow } from '../auth/CustomerAuthFlow';
import { BusinessAuthFlow } from '../auth/BusinessAuthFlow';
import { useApp } from '../../context/AppContext';
import {
  Store,
  Scissors,
  ArrowRight,
  ShieldCheck,
  Palette,
  LogIn,
  CheckCircle2,
  CalendarCheck,
  CreditCard,
  Tag,
  Clock,
  ArrowLeft,
} from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const {
    setCurrentRole,
    setShowSplash,
    currentThemeConfig,
    colorThemeMode,
  } = useApp();

  const [selectedRole, setSelectedRole] = useState<'customer' | 'business'>('customer');
  const [activeFlow, setActiveFlow] = useState<'splash' | 'location_permission' | 'customer_auth' | 'business_auth'>('splash');
  const [pendingAction, setPendingAction] = useState<'explore' | 'signin'>('explore');
  const [flowInitialMode, setFlowInitialMode] = useState<'new' | 'existing'>('new');
  const [themeModalOpen, setThemeModalOpen] = useState(false);

  const isLight = colorThemeMode === 'light';

  const handlePrimaryAction = () => {
    setCurrentRole(selectedRole);
    setPendingAction('explore');
    setActiveFlow('location_permission');
  };

  const handleSignIn = () => {
    setCurrentRole(selectedRole);
    setPendingAction('signin');
    setActiveFlow('location_permission');
  };

  const handleLocationResolved = () => {
    if (pendingAction === 'signin') {
      setFlowInitialMode('existing');
    } else {
      setFlowInitialMode('new');
    }

    if (selectedRole === 'customer') {
      setActiveFlow('customer_auth');
    } else {
      setActiveFlow('business_auth');
    }
  };

  const handleFlowComplete = () => {
    localStorage.setItem('algosalon_seen_splash', 'true');
    setCurrentRole(selectedRole);
    setShowSplash(false);
  };

  return (
    <div
      className={`min-h-screen w-full flex flex-col justify-between p-4 sm:p-6 md:p-8 relative overflow-x-hidden font-['Plus_Jakarta_Sans',sans-serif] select-none transition-colors duration-300 ${
        isLight ? 'bg-white text-zinc-950' : 'bg-[#000000] text-white'
      }`}
    >
      <div
        className={`absolute inset-0 pointer-events-none ${
          isLight
            ? 'bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)]'
            : 'bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)]'
        } bg-[size:28px_28px]`}
      />

      <div
        className="absolute top-1/6 left-1/2 -translate-x-1/2 w-[480px] h-[280px] rounded-full blur-3xl pointer-events-none opacity-20 transition-all duration-700"
        style={{ backgroundColor: currentThemeConfig.primaryHex }}
      />

      <header className="w-full flex items-center justify-between max-w-md mx-auto z-10 pt-1">
        <div className="flex items-center gap-2">
          {activeFlow !== 'splash' ? (
            <button
              type="button"
              onClick={() => setActiveFlow('splash')}
              className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-xl border transition-all ${
                isLight
                  ? 'bg-zinc-100 hover:bg-zinc-200 border-zinc-300 text-zinc-800'
                  : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-200'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <span
              className="w-2.5 h-2.5 rounded-full animate-pulse shadow-sm"
              style={{ backgroundColor: currentThemeConfig.primaryHex }}
            />
          )}
          <span
            className={`text-xs sm:text-sm font-bold tracking-tight ${
              isLight ? 'text-zinc-800' : 'text-zinc-200'
            }`}
          >
            {activeFlow === 'splash'
              ? 'Premium Salon Network'
              : activeFlow === 'location_permission'
              ? 'Nearby Location Access'
              : selectedRole === 'customer'
              ? 'Customer Multi-Screen Onboarding'
              : 'Salon Partner Registration'}
          </span>
        </div>

        <button
          id="splash-theme-btn"
          type="button"
          onClick={() => setThemeModalOpen(true)}
          aria-label="Open Theme and Color Palette Settings"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm group ${
            isLight
              ? 'bg-zinc-100/90 hover:bg-zinc-200/90 border-zinc-300 text-zinc-800 hover:text-zinc-950'
              : 'bg-zinc-900/90 hover:bg-zinc-800 border-zinc-700/80 text-zinc-200 hover:text-white'
          }`}
        >
          <Palette
            className="w-3.5 h-3.5 transition-transform group-hover:rotate-12"
            style={{ color: currentThemeConfig.primaryHex }}
          />
          <span>Theme</span>
        </button>
      </header>

      <main className="w-full max-w-md mx-auto my-auto flex flex-col items-center text-center z-10 py-3 sm:py-5">
        <AnimatePresence mode="wait">
          {activeFlow === 'splash' && (
            <motion.div
              key="hero_splash"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="w-full flex flex-col items-center"
            >
              <motion.div
                initial={{ scale: 0.94, opacity: 0, y: -10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center"
              >
                <div
                  className={`relative p-2 rounded-[32px] border transition-all duration-300 shadow-xl ${
                    isLight
                      ? 'bg-white border-zinc-200 shadow-zinc-300/60'
                      : 'bg-zinc-950 border-zinc-800 shadow-black'
                  }`}
                >
                  <AlgoLogo size="splash" showText={false} />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.35 }}
                className="mt-4 flex flex-col items-center"
              >
                <div className="flex items-center justify-center gap-2.5">
                  <span
                    className={`text-3xl sm:text-4xl font-black tracking-tight font-['Outfit',sans-serif] ${
                      isLight ? 'text-zinc-950' : 'text-white'
                    }`}
                  >
                    ALGO
                  </span>
                  <span
                    className="px-3.5 py-1 rounded-xl text-white font-black text-2xl sm:text-3xl tracking-tight shadow-md font-['Outfit',sans-serif]"
                    style={{
                      backgroundColor: currentThemeConfig.primaryHex,
                      boxShadow: `0 8px 20px -4px ${currentThemeConfig.glowHex}`,
                    }}
                  >
                    SALON
                  </span>
                </div>

                <p
                  className={`mt-2 text-sm sm:text-base font-semibold tracking-wide ${
                    isLight ? 'text-zinc-700' : 'text-zinc-200'
                  }`}
                >
                  Look Good • Feel Great
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.35 }}
                className="mt-5 w-full grid grid-cols-2 gap-3 text-left"
              >
                <div
                  className={`flex items-start gap-2.5 p-3 rounded-2xl border transition-all ${
                    isLight
                      ? 'bg-zinc-50 border-zinc-200/90 shadow-sm'
                      : 'bg-zinc-900/90 border-zinc-800/90 shadow-md'
                  }`}
                >
                  <div
                    className="p-1.5 rounded-xl shrink-0 mt-0.5"
                    style={{
                      backgroundColor: `${currentThemeConfig.primaryHex}20`,
                      color: currentThemeConfig.primaryHex,
                    }}
                  >
                    <CalendarCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span
                      className={`block text-xs sm:text-sm font-bold leading-snug ${
                        isLight ? 'text-zinc-950' : 'text-white'
                      }`}
                    >
                      Instant Confirmation
                    </span>
                    <span
                      className={`block text-[11px] sm:text-xs font-medium leading-tight mt-0.5 ${
                        isLight ? 'text-zinc-600' : 'text-zinc-300'
                      }`}
                    >
                      Live slot booking
                    </span>
                  </div>
                </div>

                <div
                  className={`flex items-start gap-2.5 p-3 rounded-2xl border transition-all ${
                    isLight
                      ? 'bg-zinc-50 border-zinc-200/90 shadow-sm'
                      : 'bg-zinc-900/90 border-zinc-800/90 shadow-md'
                  }`}
                >
                  <div
                    className="p-1.5 rounded-xl shrink-0 mt-0.5"
                    style={{
                      backgroundColor: `${currentThemeConfig.primaryHex}20`,
                      color: currentThemeConfig.primaryHex,
                    }}
                  >
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <span
                      className={`block text-xs sm:text-sm font-bold leading-snug ${
                        isLight ? 'text-zinc-950' : 'text-white'
                      }`}
                    >
                      Pay at Salon
                    </span>
                    <span
                      className={`block text-[11px] sm:text-xs font-medium leading-tight mt-0.5 ${
                        isLight ? 'text-zinc-600' : 'text-zinc-300'
                      }`}
                    >
                      Cash, UPI & Card
                    </span>
                  </div>
                </div>

                <div
                  className={`flex items-start gap-2.5 p-3 rounded-2xl border transition-all ${
                    isLight
                      ? 'bg-zinc-50 border-zinc-200/90 shadow-sm'
                      : 'bg-zinc-900/90 border-zinc-800/90 shadow-md'
                  }`}
                >
                  <div
                    className="p-1.5 rounded-xl shrink-0 mt-0.5"
                    style={{
                      backgroundColor: `${currentThemeConfig.primaryHex}20`,
                      color: currentThemeConfig.primaryHex,
                    }}
                  >
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <span
                      className={`block text-xs sm:text-sm font-bold leading-snug ${
                        isLight ? 'text-zinc-950' : 'text-white'
                      }`}
                    >
                      Upfront Pricing
                    </span>
                    <span
                      className={`block text-[11px] sm:text-xs font-medium leading-tight mt-0.5 ${
                        isLight ? 'text-zinc-600' : 'text-zinc-300'
                      }`}
                    >
                      No surprise add-ons
                    </span>
                  </div>
                </div>

                <div
                  className={`flex items-start gap-2.5 p-3 rounded-2xl border transition-all ${
                    isLight
                      ? 'bg-zinc-50 border-zinc-200/90 shadow-sm'
                      : 'bg-zinc-900/90 border-zinc-800/90 shadow-md'
                  }`}
                >
                  <div
                    className="p-1.5 rounded-xl shrink-0 mt-0.5"
                    style={{
                      backgroundColor: `${currentThemeConfig.primaryHex}20`,
                      color: currentThemeConfig.primaryHex,
                    }}
                  >
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span
                      className={`block text-xs sm:text-sm font-bold leading-snug ${
                        isLight ? 'text-zinc-950' : 'text-white'
                      }`}
                    >
                      Zero Booking Fees
                    </span>
                    <span
                      className={`block text-[11px] sm:text-xs font-medium leading-tight mt-0.5 ${
                        isLight ? 'text-zinc-600' : 'text-zinc-300'
                      }`}
                    >
                      100% free reservations
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.35 }}
                className="mt-5 w-full flex flex-col items-center"
              >
                <div className="w-full flex items-center justify-between mb-1.5 px-1">
                  <span
                    className={`text-[11px] font-bold tracking-wider uppercase ${
                      isLight ? 'text-zinc-600' : 'text-zinc-300'
                    }`}
                  >
                    Choose Your Experience
                  </span>
                  <span
                    className="text-[11px] font-extrabold flex items-center gap-1"
                    style={{ color: currentThemeConfig.primaryHex }}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {selectedRole === 'customer' ? 'Customer Mode' : 'Partner Portal'}
                  </span>
                </div>

                <div
                  className={`w-full p-1.5 rounded-2xl border flex items-center gap-1.5 relative transition-colors ${
                    isLight
                      ? 'bg-zinc-100 border-zinc-300'
                      : 'bg-zinc-900 border-zinc-800'
                  }`}
                >
                  <button
                    id="splash-role-customer"
                    type="button"
                    onClick={() => setSelectedRole('customer')}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 flex items-center justify-center gap-2 relative z-10 ${
                      selectedRole === 'customer'
                        ? 'text-white shadow-md'
                        : isLight
                        ? 'text-zinc-700 hover:text-zinc-950'
                        : 'text-zinc-300 hover:text-white'
                    }`}
                    style={{
                      backgroundColor:
                        selectedRole === 'customer'
                          ? currentThemeConfig.primaryHex
                          : 'transparent',
                    }}
                  >
                    <Scissors className="w-4 h-4 shrink-0" />
                    <span>I'm a Customer</span>
                  </button>

                  <button
                    id="splash-role-business"
                    type="button"
                    onClick={() => setSelectedRole('business')}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 flex items-center justify-center gap-2 relative z-10 ${
                      selectedRole === 'business'
                        ? 'text-white shadow-md'
                        : isLight
                        ? 'text-zinc-700 hover:text-zinc-950'
                        : 'text-zinc-300 hover:text-white'
                    }`}
                    style={{
                      backgroundColor:
                        selectedRole === 'business'
                          ? currentThemeConfig.primaryHex
                          : 'transparent',
                    }}
                  >
                    <Store className="w-4 h-4 shrink-0" />
                    <span>Salon Partner</span>
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35, duration: 0.35 }}
                className="mt-4 w-full"
              >
                <button
                  id="splash-primary-cta-btn"
                  type="button"
                  onClick={handlePrimaryAction}
                  className="w-full py-4 px-6 rounded-2xl text-white font-extrabold text-base sm:text-lg tracking-tight transition-all duration-200 shadow-xl flex items-center justify-center gap-2.5 group active:scale-[0.99]"
                  style={{
                    backgroundColor: currentThemeConfig.primaryHex,
                    boxShadow: `0 12px 24px -4px ${currentThemeConfig.glowHex}`,
                  }}
                >
                  <span>
                    {selectedRole === 'customer'
                      ? 'Explore & Book Salons'
                      : 'Explore Business Portal'}
                  </span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.42, duration: 0.35 }}
                className="mt-3.5 flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold"
              >
                <span className={isLight ? 'text-zinc-600' : 'text-zinc-300'}>
                  Already registered?
                </span>
                <button
                  id="splash-signin-link"
                  type="button"
                  onClick={handleSignIn}
                  className="underline underline-offset-4 hover:opacity-80 transition-opacity font-bold flex items-center gap-1"
                  style={{ color: currentThemeConfig.primaryHex }}
                >
                  <LogIn className="w-3.5 h-3.5 inline" />
                  <span>
                    {selectedRole === 'customer'
                      ? 'Sign In as Customer'
                      : 'Sign In as Salon Partner'}
                  </span>
                </button>
              </motion.div>
            </motion.div>
          )}

          {activeFlow === 'location_permission' && (
            <motion.div
              key="location_permission_flow"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <LocationPermissionScreen
                targetRole={selectedRole}
                actionType={pendingAction}
                onAllow={handleLocationResolved}
                onSkip={handleLocationResolved}
              />
            </motion.div>
          )}

          {activeFlow === 'customer_auth' && (
            <motion.div
              key="customer_auth_flow"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className={`w-full p-5 sm:p-6 rounded-3xl border shadow-2xl transition-all ${
                isLight
                  ? 'bg-white border-zinc-200 text-zinc-950 shadow-zinc-300/50'
                  : 'bg-zinc-950 border-zinc-800 text-white shadow-black'
              }`}
            >
              <CustomerAuthFlow
                initialMode={flowInitialMode}
                onComplete={handleFlowComplete}
                onCancel={() => setActiveFlow('splash')}
              />
            </motion.div>
          )}

          {activeFlow === 'business_auth' && (
            <motion.div
              key="business_auth_flow"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className={`w-full p-5 sm:p-6 rounded-3xl border shadow-2xl transition-all ${
                isLight
                  ? 'bg-white border-zinc-200 text-zinc-950 shadow-zinc-300/50'
                  : 'bg-zinc-950 border-zinc-800 text-white shadow-black'
              }`}
            >
              <BusinessAuthFlow
                initialMode={flowInitialMode}
                onComplete={handleFlowComplete}
                onCancel={() => setActiveFlow('splash')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="w-full max-w-md mx-auto text-center z-10 pb-1">
        <div className="flex flex-col items-center justify-center gap-1">
          <p
            className={`text-xs font-semibold flex items-center justify-center gap-1.5 ${
              isLight ? 'text-zinc-700' : 'text-zinc-300'
            }`}
          >
            <ShieldCheck
              className="w-4 h-4 shrink-0"
              style={{ color: currentThemeConfig.primaryHex }}
            />
            <span>100% Verified Salons • Safe & Encrypted</span>
          </p>

          <p
            className={`text-[10px] font-medium tracking-wide ${
              isLight ? 'text-zinc-500' : 'text-zinc-400'
            }`}
          >
            © 2026 ALGO SALON by Spot-Pro • All Rights Reserved
          </p>
        </div>
      </footer>

      <ThemeSwitcherModal
        isOpen={themeModalOpen}
        onClose={() => setThemeModalOpen(false)}
      />
    </div>
  );
};

import React from 'react';
import { useApp } from '../../context/AppContext';
import { CustomerAuthFlow } from './CustomerAuthFlow';
import { BusinessAuthFlow } from './BusinessAuthFlow';
import { X, Scissors, Store } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    setAuthModalOpen,
    authMode,
    currentRole,
    setCurrentRole,
    currentThemeConfig,
    colorThemeMode,
  } = useApp();

  if (!authModalOpen) return null;

  const isCustomer = currentRole === 'customer';
  const isLight = colorThemeMode === 'light';

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={e => {
        if (e.target === e.currentTarget) {
          setAuthModalOpen(false);
        }
      }}
    >
      <div
        id="auth-modal-card"
        className={`relative w-full max-w-lg my-auto rounded-3xl border p-5 sm:p-7 shadow-2xl transition-all ${
          isLight
            ? 'bg-white border-zinc-200 text-zinc-950 shadow-zinc-400/50'
            : 'bg-zinc-950 border-zinc-800 text-white shadow-black'
        }`}
      >
        <button
          id="close-auth-modal"
          onClick={() => setAuthModalOpen(false)}
          aria-label="Close Authentication Modal"
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors z-20 ${
            isLight
              ? 'text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-full flex items-center justify-center mb-4">
          <div
            className={`p-1 rounded-2xl border flex items-center gap-1 text-xs font-extrabold ${
              isLight ? 'bg-zinc-100 border-zinc-300' : 'bg-zinc-900 border-zinc-800'
            }`}
          >
            <button
              type="button"
              id="auth-modal-switch-customer"
              onClick={() => setCurrentRole('customer')}
              className={`py-1.5 px-3.5 rounded-xl flex items-center gap-1.5 transition-all ${
                isCustomer
                  ? 'text-white shadow-sm'
                  : isLight
                  ? 'text-zinc-700 hover:text-zinc-950'
                  : 'text-zinc-400 hover:text-white'
              }`}
              style={{
                backgroundColor: isCustomer ? currentThemeConfig.primaryHex : 'transparent',
              }}
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>Customer Flow</span>
            </button>

            <button
              type="button"
              id="auth-modal-switch-business"
              onClick={() => setCurrentRole('business')}
              className={`py-1.5 px-3.5 rounded-xl flex items-center gap-1.5 transition-all ${
                !isCustomer
                  ? 'text-white shadow-sm'
                  : isLight
                  ? 'text-zinc-700 hover:text-zinc-950'
                  : 'text-zinc-400 hover:text-white'
              }`}
              style={{
                backgroundColor: !isCustomer ? currentThemeConfig.primaryHex : 'transparent',
              }}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Salon Partner Flow</span>
            </button>
          </div>
        </div>

        {isCustomer ? (
          <CustomerAuthFlow
            initialMode={authMode === 'login' ? 'existing' : 'new'}
            onComplete={() => setAuthModalOpen(false)}
            onCancel={() => setAuthModalOpen(false)}
          />
        ) : (
          <BusinessAuthFlow
            initialMode={authMode === 'login' ? 'existing' : 'new'}
            onComplete={() => setAuthModalOpen(false)}
            onCancel={() => setAuthModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

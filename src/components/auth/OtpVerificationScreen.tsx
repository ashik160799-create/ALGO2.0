import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, ArrowRight, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PinPad } from './PinPad';

interface OtpVerificationScreenProps {
  title: string;
  subtitle?: string;
  email: string;
  isGoogle?: boolean;
  onSuccess: () => void;
  onBack: () => void;
  targetRoleName?: string;
}

export const OtpVerificationScreen: React.FC<OtpVerificationScreenProps> = ({
  title,
  subtitle,
  email,
  isGoogle = false,
  onSuccess,
  onBack,
  targetRoleName = 'Account',
}) => {
  const { currentThemeConfig, colorThemeMode } = useApp();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [resendSeconds, setResendSeconds] = useState(45);
  const [isVerifying, setIsVerifying] = useState(false);
  const isLight = colorThemeMode === 'light';

  useEffect(() => {
    if (resendSeconds > 0) {
      const timer = setTimeout(() => setResendSeconds(s => s - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendSeconds]);

  const handleVerify = (codeToVerify = otp) => {
    if (codeToVerify.length !== 4) {
      setError('Please enter the complete 4-digit code.');
      return;
    }
    setError(null);
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      onSuccess();
    }, 600);
  };

  const handleResend = () => {
    if (resendSeconds === 0) {
      setResendSeconds(60);
      setError(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full flex flex-col items-center text-center"
    >
      <div className="w-full flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={onBack}
          className={`flex items-center gap-1.5 text-xs font-bold py-1.5 px-3 rounded-xl border transition-all ${
            isLight
              ? 'bg-zinc-100 hover:bg-zinc-200 border-zinc-300 text-zinc-800'
              : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-200'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <span
          className="text-[11px] font-extrabold px-2.5 py-1 rounded-lg"
          style={{
            backgroundColor: `${currentThemeConfig.primaryHex}15`,
            color: currentThemeConfig.primaryHex,
          }}
        >
          Security Step
        </span>
      </div>

      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-lg"
        style={{
          backgroundColor: `${currentThemeConfig.primaryHex}20`,
          color: currentThemeConfig.primaryHex,
          boxShadow: `0 8px 16px -4px ${currentThemeConfig.glowHex}`,
        }}
      >
        <Mail className="w-7 h-7" />
      </div>

      <h3 className="text-xl font-bold font-['Outfit',sans-serif]">
        {title}
      </h3>
      <p
        className={`mt-1.5 text-xs font-medium max-w-sm ${
          isLight ? 'text-zinc-600' : 'text-zinc-300'
        }`}
      >
        {subtitle || (
          <>
            We sent a 4-digit verification code to{' '}
            <span className="font-bold text-zinc-900 dark:text-white underline">
              {email}
            </span>
          </>
        )}
      </p>

      <div className="mt-4 w-full">
        <PinPad
          value={otp}
          onChange={val => {
            setOtp(val);
            if (error) setError(null);
          }}
          error={error}
          onComplete={handleVerify}
          showNumpad={true}
        />
      </div>

      <button
        type="button"
        id="otp-verify-submit-btn"
        disabled={isVerifying || otp.length !== 4}
        onClick={() => handleVerify()}
        className={`mt-4 w-full py-3.5 px-6 rounded-2xl text-white font-extrabold text-sm transition-all duration-200 shadow-lg flex items-center justify-center gap-2 active:scale-[0.99] ${
          otp.length === 4
            ? 'opacity-100 cursor-pointer'
            : 'opacity-50 cursor-not-allowed'
        }`}
        style={{
          backgroundColor: currentThemeConfig.primaryHex,
          boxShadow: `0 8px 20px -4px ${currentThemeConfig.glowHex}`,
        }}
      >
        {isVerifying ? (
          <RefreshCw className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <span>Verify & Continue</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      <div className="mt-4 text-xs font-medium">
        {resendSeconds > 0 ? (
          <span className={isLight ? 'text-zinc-500' : 'text-zinc-400'}>
            Resend verification code in{' '}
            <strong className="font-mono text-zinc-900 dark:text-white">
              0:{resendSeconds < 10 ? `0${resendSeconds}` : resendSeconds}
            </strong>
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            className="font-bold underline hover:opacity-80 transition-opacity"
            style={{ color: currentThemeConfig.primaryHex }}
          >
            Didn't receive code? Resend Now
          </button>
        )}
      </div>
    </motion.div>
  );
};

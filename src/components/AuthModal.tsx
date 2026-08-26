import React, { useState } from 'react';
import { X, UserCheck, Shield, Phone, Lock, KeyRound, Sparkles, CheckCircle2, ArrowRight, User } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { speechService } from '../services/speechService';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  onClose: () => void;
  onLoginSuccess?: (userName: string, role: 'farmer' | 'officer') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onLoginSuccess,
}) => {
  const { t } = useLanguage();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [role, setRole] = useState<'farmer' | 'officer'>('farmer');

  // Form fields
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('');
  const [officerId, setOfficerId] = useState('');
  const [password, setPassword] = useState('');

  const [otpSent, setOtpSent] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendOtp = () => {
    if (!phone || phone.length < 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }
    speechService.playChime('click');
    setOtpSent(true);
    setSuccessMessage(t('authOtpSent', 'OTP has been sent to your mobile number'));
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    speechService.playChime('success');

    const displayName =
      role === 'officer'
        ? officerId || 'Dr. R. Sen (KVK)'
        : name || (phone ? `Farmer (+91 ${phone.slice(-4)})` : 'Farmer Friend');

    setSuccessMessage(
      mode === 'login'
        ? t('authLoginSuccess', 'Logged in successfully!')
        : t('authRegisterSuccess', 'Registration completed successfully!')
    );

    setTimeout(() => {
      setSuccessMessage(null);
      if (onLoginSuccess) {
        onLoginSuccess(displayName, role);
      }
      onClose();
    }, 1200);
  };

  const handleContinueAsGuest = () => {
    speechService.playChime('click');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white border border-[#E1D9C4] rounded-3xl p-5 sm:p-6 text-[#20261F] shadow-2xl animate-in slide-in-from-bottom-6 duration-200 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#E1D9C4]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E4F3EA] border border-[#B7E4C7] flex items-center justify-center text-[#2B6E4F]">
              {role === 'farmer' ? <UserCheck className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-lg text-[#173C2D]">
                {mode === 'login'
                  ? t('authModalTitleLogin', 'Login to Account')
                  : t('authModalTitleRegister', 'Create New Account')}
              </h3>
              <p className="text-[11px] text-[#4C5548] font-medium">
                {role === 'farmer'
                  ? t('authTabFarmer', '🌾 Farmer Portal (Optional)')
                  : t('authTabOfficer', '🛡️ KVK / Officer Login')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              speechService.playChime('click');
              onClose();
            }}
            className="touch-target w-9 h-9 rounded-full bg-[#F3ECDA] hover:bg-[#E1D9C4] text-[#4C5548] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Role Selector Tabs (Farmer vs Officer) */}
        <div className="mt-4 grid grid-cols-2 gap-2 p-1 rounded-2xl bg-[#F3ECDA] border border-[#E1D9C4]">
          <button
            type="button"
            onClick={() => {
              speechService.playChime('click');
              setRole('farmer');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              role === 'farmer'
                ? 'bg-white text-[#173C2D] shadow-sm border border-[#E1D9C4]'
                : 'text-[#4C5548] hover:text-[#20261F]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-[#2B6E4F]" />
            <span>{t('authTabFarmer', 'Farmer')}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              speechService.playChime('click');
              setRole('officer');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              role === 'officer'
                ? 'bg-white text-[#173C2D] shadow-sm border border-[#E1D9C4]'
                : 'text-[#4C5548] hover:text-[#20261F]'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-[#E38A1C]" />
            <span>{t('authTabOfficer', 'KVK Officer')}</span>
          </button>
        </div>

        {/* Farmer Guest Notice Badge */}
        {role === 'farmer' && (
          <div className="mt-3 p-3 rounded-2xl bg-[#E4F3EA] border border-[#52B788]/40 text-xs text-[#173C2D] flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-[#2B6E4F] flex-shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              {t(
                'authFarmerGuestHint',
                '💡 Login is optional for farmers — enjoy unrestricted access to all features!'
              )}
            </p>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="mt-3 p-3 rounded-2xl bg-[#E4F3EA] border border-[#52B788] text-xs text-[#173C2D] font-bold flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-[#2B6E4F] flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {/* Farmer Flow */}
          {role === 'farmer' ? (
            <>
              {mode === 'register' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-[#173C2D] block mb-1 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-[#2B6E4F]" />
                      <span>{t('authFarmerNameLabel', 'Farmer Full Name')}</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('authFarmerNamePlaceholder', 'Enter your name')}
                      className="w-full h-11 px-3.5 rounded-xl bg-[#FBF7ED] border border-[#E1D9C4] text-xs text-[#20261F] focus:outline-none focus:border-[#2B6E4F]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-xs font-bold text-[#173C2D] block mb-1">
                        {t('authVillageLabel', 'Village / Block')}
                      </label>
                      <input
                        type="text"
                        value={village}
                        onChange={(e) => setVillage(e.target.value)}
                        placeholder={t('authVillagePlaceholder', 'Enter village')}
                        className="w-full h-11 px-3.5 rounded-xl bg-[#FBF7ED] border border-[#E1D9C4] text-xs text-[#20261F] focus:outline-none focus:border-[#2B6E4F]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#173C2D] block mb-1">
                        {t('authDistrictLabel', 'District')}
                      </label>
                      <input
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        placeholder={t('authDistrictPlaceholder', 'e.g. Burdwan')}
                        className="w-full h-11 px-3.5 rounded-xl bg-[#FBF7ED] border border-[#E1D9C4] text-xs text-[#20261F] focus:outline-none focus:border-[#2B6E4F]"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="text-xs font-bold text-[#173C2D] block mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#2B6E4F]" />
                  <span>{t('authFarmerPhoneLabel', 'Mobile Number')}</span>
                </label>
                <div className="flex gap-2">
                  <span className="h-11 px-3 bg-[#F3ECDA] border border-[#E1D9C4] rounded-xl flex items-center text-xs font-bold text-[#4C5548]">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder={t('authFarmerPhonePlaceholder', 'Enter 10-digit mobile number')}
                    className="flex-1 h-11 px-3.5 rounded-xl bg-[#FBF7ED] border border-[#E1D9C4] text-xs font-mono text-[#20261F] focus:outline-none focus:border-[#2B6E4F]"
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="px-3 rounded-xl bg-[#F3ECDA] hover:bg-[#E1D9C4] text-[#173C2D] font-bold text-xs border border-[#E1D9C4] transition-colors"
                  >
                    {t('authGetOtpBtn', 'Send OTP')}
                  </button>
                </div>
              </div>

              {otpSent && (
                <div className="animate-in fade-in duration-150">
                  <label className="text-xs font-bold text-[#173C2D] block mb-1 flex items-center gap-1">
                    <KeyRound className="w-3.5 h-3.5 text-[#2B6E4F]" />
                    <span>{t('authOtpLabel', 'OTP Code')}</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder={t('authOtpPlaceholder', 'Enter 4 or 6-digit OTP')}
                    className="w-full h-11 px-3.5 rounded-xl bg-[#FBF7ED] border border-[#E1D9C4] text-xs font-mono tracking-widest text-[#20261F] focus:outline-none focus:border-[#2B6E4F]"
                  />
                </div>
              )}
            </>
          ) : (
            /* Officer Flow */
            <>
              <div>
                <label className="text-xs font-bold text-[#173C2D] block mb-1 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-[#E38A1C]" />
                  <span>{t('authOfficerIdLabel', 'Officer ID / Government Email')}</span>
                </label>
                <input
                  type="text"
                  required
                  value={officerId}
                  onChange={(e) => setOfficerId(e.target.value)}
                  placeholder={t('authOfficerIdPlaceholder', 'e.g. WBD-KVK-2026')}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#FBF7ED] border border-[#E1D9C4] text-xs text-[#20261F] focus:outline-none focus:border-[#2B6E4F]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#173C2D] block mb-1 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-[#E38A1C]" />
                  <span>{t('authPasswordLabel', 'Password')}</span>
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('authPasswordPlaceholder', 'Enter your password')}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#FBF7ED] border border-[#E1D9C4] text-xs text-[#20261F] focus:outline-none focus:border-[#2B6E4F]"
                />
              </div>
            </>
          )}

          {/* Submit Action Button */}
          <button
            type="submit"
            className="w-full min-h-[48px] py-3 px-4 rounded-2xl bg-[#2B6E4F] hover:bg-[#173C2D] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all mt-2"
          >
            <span>
              {mode === 'login'
                ? t('authLoginBtn', 'Complete Login')
                : t('authRegisterBtn', 'Complete Registration')}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle Login/Register Mode */}
        <div className="mt-4 pt-3 border-t border-[#E1D9C4] text-center text-xs text-[#4C5548]">
          {mode === 'login' ? (
            <p>
              {t('authNoAccount', "Don't have an account? ")}
              <button
                type="button"
                onClick={() => {
                  speechService.playChime('click');
                  setMode('register');
                }}
                className="font-bold text-[#2B6E4F] hover:underline"
              >
                {t('authSignUp', 'Register now')}
              </button>
            </p>
          ) : (
            <p>
              {t('authHaveAccount', 'Already have an account? ')}
              <button
                type="button"
                onClick={() => {
                  speechService.playChime('click');
                  setMode('login');
                }}
                className="font-bold text-[#2B6E4F] hover:underline"
              >
                {t('authSignIn', 'Login here')}
              </button>
            </p>
          )}
        </div>

        {/* Farmer Guest Bypass Button (Explicit Guest Access) */}
        {role === 'farmer' && (
          <div className="mt-3">
            <button
              type="button"
              onClick={handleContinueAsGuest}
              className="w-full py-2.5 px-3 rounded-xl bg-[#F3ECDA] hover:bg-[#E1D9C4] text-[#173C2D] font-bold text-xs transition-colors text-center"
            >
              {t('authContinueAsGuest', 'Continue without Login (Guest Access)')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

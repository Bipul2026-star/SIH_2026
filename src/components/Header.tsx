import React, { useState } from 'react';
import { Volume2, Globe, Settings, ChevronDown, Check, ArrowLeft, Sun, LogIn, UserPlus, UserCheck, LogOut } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import type { Language } from '../types';
import { speechService } from '../services/speechService';

interface HeaderProps {
  onOpenSettings: () => void;
  onVoiceGuide?: () => void;
  onNavigateHome?: () => void;
  onOpenLogin?: () => void;
  onOpenRegister?: () => void;
  currentUser?: { name: string; role: 'farmer' | 'officer' } | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  onVoiceGuide,
  onNavigateHome,
  onOpenLogin,
  onOpenRegister,
  currentUser,
  onLogout,
}) => {
  const { language, setLanguage, languages, activeLanguageInfo, t } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const handleVoiceClick = () => {
    speechService.playChime('info');
    if (onVoiceGuide) {
      onVoiceGuide();
    } else {
      speechService.speak(t('voiceHomeGreeting'), language);
    }
  };

  const handleLanguageChange = (lang: Language) => {
    speechService.playChime('click');
    setLanguage(lang);
    setShowLangMenu(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FBF7ED]/95 backdrop-blur-md border-b border-[#E1D9C4] text-[#20261F] px-3 sm:px-8 py-2.5 sm:py-3 transition-colors">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Side: Back / Gateway & Brand */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onNavigateHome && (
            <button
              type="button"
              onClick={() => {
                speechService.playChime('click');
                onNavigateHome();
              }}
              className="touch-target px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#F3ECDA] hover:bg-[#E1D9C4] text-[#2B6E4F] font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{t('homeNavBack', '← Home')}</span>
            </button>
          )}

          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#2B6E4F] text-white flex items-center justify-center shadow-sm text-lg sm:text-xl flex-shrink-0">
              🌾
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-sm sm:text-lg leading-tight tracking-tight text-[#173C2D]">
                {t('appName', 'Crop Rakshak')}
              </h1>
              <p className="text-[10px] sm:text-[11px] text-[#4C5548] font-medium line-clamp-1">
                {t('appTagline', 'AI Guardian for Smallholder Farmers')}
              </p>
            </div>
          </div>
        </div>

        {/* Center / Weather Chip (Visible on Desktop) */}
        <div className="hidden lg:flex items-center gap-2 bg-[#F3ECDA] border border-[#E1D9C4] px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#20261F]">
          <Sun className="w-4 h-4 text-[#E38A1C]" />
          <span>{t('weatherChipText', '☀️ 28°C · Sunny & Warm')}</span>
        </div>

        {/* Right Actions: Login/Register, Voice, Language Selector, Settings */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Login & Register Buttons or User Badge */}
          {currentUser ? (
            <div className="flex items-center gap-1 sm:gap-1.5">
              <div className="hidden xs:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#E4F3EA] border border-[#52B788]/40 text-xs font-bold text-[#173C2D]">
                <UserCheck className="w-3.5 h-3.5 text-[#2B6E4F]" />
                <span className="max-w-[90px] sm:max-w-[120px] truncate">{currentUser.name}</span>
              </div>
              {onLogout && (
                <button
                  type="button"
                  onClick={() => {
                    speechService.playChime('click');
                    onLogout();
                  }}
                  title={t('logoutBtn', 'Logout')}
                  className="touch-target px-2.5 py-1.5 rounded-xl bg-[#F3ECDA] hover:bg-[#FBE1DC] text-[#C0431F] font-bold text-xs flex items-center gap-1 transition-colors border border-[#E1D9C4]"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t('logoutBtn', 'Logout')}</span>
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-1.5">
              {onOpenLogin && (
                <button
                  type="button"
                  onClick={() => {
                    speechService.playChime('click');
                    onOpenLogin();
                  }}
                  className="touch-target px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#F3ECDA] hover:bg-[#E1D9C4] text-[#173C2D] font-bold text-xs flex items-center gap-1.5 transition-colors border border-[#E1D9C4] active:scale-95 shadow-sm"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#2B6E4F]" />
                  <span>{t('loginBtn', 'Login')}</span>
                </button>
              )}

              {onOpenRegister && (
                <button
                  type="button"
                  onClick={() => {
                    speechService.playChime('click');
                    onOpenRegister();
                  }}
                  className="touch-target px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#2B6E4F] hover:bg-[#173C2D] text-white font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">{t('registerBtn', 'Register')}</span>
                </button>
              )}
            </div>
          )}

          {/* Voice Narrator Button */}
          <button
            type="button"
            onClick={handleVoiceClick}
            aria-label={t('voiceToggle', 'Voice Guide')}
            title={t('voiceToggle', 'Voice Guide')}
            className="touch-target w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#F3ECDA] hover:bg-[#E1D9C4] text-[#2B6E4F] border border-[#E1D9C4] shadow-sm flex items-center justify-center active:scale-95 transition-transform"
          >
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                speechService.playChime('click');
                setShowLangMenu(!showLangMenu);
              }}
              className="touch-target h-9 sm:h-10 px-2.5 sm:px-3 rounded-2xl bg-[#F3ECDA] hover:bg-[#E1D9C4] text-[#20261F] border border-[#E1D9C4] shadow-sm flex items-center gap-1 sm:gap-1.5 active:scale-95 transition-transform font-bold text-xs"
            >
              <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2B6E4F]" />
              <span>{activeLanguageInfo.nativeName}</span>
              <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#4C5548]" />
            </button>

            {/* Dropdown Menu */}
            {showLangMenu && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-black/30"
                  onClick={() => setShowLangMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E1D9C4] rounded-2xl shadow-xl z-50 overflow-hidden py-1.5 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-[#4C5548] uppercase tracking-wider border-b border-[#E1D9C4]">
                    {t('languageSelect', 'Select Language')}
                  </div>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLanguageChange(lang.code);
                      }}
                      className={`w-full px-3.5 py-2.5 text-left text-xs sm:text-sm flex items-center justify-between hover:bg-[#F3ECDA] transition-colors ${
                        language === lang.code
                          ? 'bg-[#E4F3EA] text-[#173C2D] font-bold border-l-4 border-[#2B6E4F]'
                          : 'text-[#20261F]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <div>
                          <div className="font-semibold">{lang.nativeName}</div>
                          <div className="text-[10px] text-[#4C5548]">{lang.label}</div>
                        </div>
                      </div>
                      {language === lang.code && (
                        <Check className="w-4 h-4 text-[#2B6E4F] flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Profile / Settings Button */}
          <button
            type="button"
            onClick={() => {
              speechService.playChime('click');
              onOpenSettings();
            }}
            aria-label={t('settings', 'Settings')}
            className="touch-target w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#F3ECDA] hover:bg-[#E1D9C4] text-[#4C5548] border border-[#E1D9C4] shadow-sm flex items-center justify-center active:scale-95 transition-transform"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

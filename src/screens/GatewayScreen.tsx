import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import type { ScreenType, Language } from '../types';
import { Globe, ArrowRight, Shield, UserCheck, ChevronDown, Check } from 'lucide-react';
import { speechService } from '../services/speechService';

interface GatewayScreenProps {
  onSelectDoor: (screen: ScreenType) => void;
}

export const GatewayScreen: React.FC<GatewayScreenProps> = ({ onSelectDoor }) => {
  const { t, language, setLanguage, languages, activeLanguageInfo } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const handleFarmerEntry = () => {
    speechService.playChime('click');
    onSelectDoor('home');
  };

  const handleKvkEntry = () => {
    speechService.playChime('click');
    onSelectDoor('kvk-dash');
  };

  const handleLanguageChange = (lang: Language) => {
    speechService.playChime('click');
    setLanguage(lang);
    setShowLangMenu(false);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#173C2D] to-[#2B6E4F] text-[#FBF7ED] flex flex-col justify-between selection:bg-[#52B788] selection:text-[#173C2D]">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-4 sm:px-8 py-5 border-b border-white/10 max-w-7xl w-full mx-auto">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#52B788] text-[#173C2D] flex items-center justify-center text-2xl font-bold shadow-md">
            🌾
          </div>
          <div>
            <div className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight text-white leading-tight">
              {t('appName', 'Crop Rakshak')}
            </div>
            <div className="text-xs text-[#CDE7D6] font-medium mt-0.5">
              ফসল রক্ষক · Regional Crop Health Network
            </div>
          </div>
        </div>

        {/* Language Selector Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              speechService.playChime('click');
              setShowLangMenu(!showLangMenu);
            }}
            aria-label="Select Language"
            className="touch-target px-3.5 py-2 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 text-[#FBF7ED] font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all active:scale-95 shadow-sm"
          >
            <Globe className="w-4 h-4 text-[#52B788]" />
            <span>{activeLanguageInfo.nativeName}</span>
            <ChevronDown className="w-3.5 h-3.5 text-white/70" />
          </button>

          {showLangMenu && (
            <>
              <div
                className="fixed inset-0 z-40 bg-black/40"
                onClick={() => setShowLangMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-[#173C2D] border border-white/20 rounded-2xl shadow-2xl z-50 overflow-hidden py-1.5 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[11px] font-bold text-[#8EE0B6] uppercase tracking-wider border-b border-white/10">
                  {t('languageSelect', 'Select Language')}
                </div>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full px-3.5 py-2.5 text-left text-sm flex items-center justify-between hover:bg-white/10 transition-colors ${
                      language === lang.code
                        ? 'bg-[#52B788]/20 text-[#8EE0B6] font-bold'
                        : 'text-[#FBF7ED]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.nativeName}</span>
                    </div>
                    {language === lang.code && (
                      <Check className="w-4 h-4 text-[#52B788]" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-8 sm:py-16 text-center max-w-5xl mx-auto w-full">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#52B788]/20 border border-[#52B788]/30 text-[#8EE0B6] text-xs font-bold uppercase tracking-widest mb-4">
          <span>{t('gwEyebrow', 'One field, two views')}</span>
        </div>

        {/* Title */}
        <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight max-w-4xl mb-4">
          Every farmer's photo <span className="text-[#52B788]">strengthens</span> the region's early warning
        </h1>

        {/* Description */}
        <p className="text-sm sm:text-base text-[#DCEDE1] max-w-2xl leading-relaxed mb-10 sm:mb-12 font-normal">
          {t(
            'gwDesc',
            'Farmers scan a leaf in seconds. Krishi Vigyan Kendra officers watch the same signal rise across the district. One platform, built so the two never lose sight of each other.'
          )}
        </p>

        {/* The Two Doors */}
        <div className="relative w-full grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 text-left">
          {/* DOOR 1: Farmer Portal */}
          <div
            onClick={handleFarmerEntry}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleFarmerEntry()}
            className="group relative bg-white/[0.07] hover:bg-white/[0.12] border border-white/20 hover:border-[#52B788]/60 rounded-3xl p-6 sm:p-8 transition-all duration-200 hover:-translate-y-1 shadow-agri cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#52B788]/20 text-[#8EE0B6] border border-[#52B788]/30 mb-4">
                <UserCheck className="w-3.5 h-3.5" />
                <span>{t('gwFarmerDoorTag', 'Public access')}</span>
              </div>
              <h3 className="font-heading text-2xl font-bold text-white mb-2 group-hover:text-[#8EE0B6] transition-colors">
                {t('gwFarmerDoorTitle', 'Farmer Portal')}
              </h3>
              <p className="text-xs sm:text-sm text-[#D7E7DC] leading-relaxed mb-6 font-normal">
                {t(
                  'gwFarmerDoorDesc',
                  'Scan your crop, get instant remedy steps, and see disease alerts for your area. No paperwork — just your phone number.'
                )}
              </p>
            </div>

            <div>
              <button
                type="button"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-bold text-sm text-[#173C2D] bg-[#52B788] hover:bg-[#74C69D] px-6 py-3.5 rounded-2xl shadow-md transition-transform active:scale-95"
              >
                <span>{t('gwFarmerDoorBtn', 'Open Farmer Portal →')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* DOOR 2: KVK Officer Dashboard */}
          <div
            onClick={handleKvkEntry}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleKvkEntry()}
            className="group relative bg-white/[0.07] hover:bg-white/[0.12] border border-white/20 hover:border-[#E38A1C]/60 rounded-3xl p-6 sm:p-8 transition-all duration-200 hover:-translate-y-1 shadow-agri cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#E38A1C]/20 text-[#F5B764] border border-[#E38A1C]/30 mb-4">
                <Shield className="w-3.5 h-3.5" />
                <span>{t('gwKvkDoorTag', 'Officer login')}</span>
              </div>
              <h3 className="font-heading text-2xl font-bold text-white mb-2 group-hover:text-[#F5B764] transition-colors">
                {t('gwKvkDoorTitle', 'KVK / Government Dashboard')}
              </h3>
              <p className="text-xs sm:text-sm text-[#D7E7DC] leading-relaxed mb-6 font-normal">
                {t(
                  'gwKvkDoorDesc',
                  'See scan reports aggregate into a live district risk map, verify farmer submissions, and push regional advisories.'
                )}
              </p>
            </div>

            <div>
              <button
                type="button"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-bold text-sm text-[#173C2D] bg-[#E38A1C] hover:bg-[#FACB77] text-white px-6 py-3.5 rounded-2xl shadow-md transition-transform active:scale-95"
              >
                <span>{t('gwKvkDoorBtn', 'Open Officer Dashboard →')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <p className="mt-8 text-xs text-[#B9D4C2] max-w-xl">
          {t(
            'gwNote',
            'Same login system as Family Level Data Collection style portals — one identity layer, two experiences built for who\'s using it.'
          )}
        </p>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-[#B9D4C2]/70 border-t border-white/10">
        Crop Rakshak · Krishi Vigyan Kendra & Department of Agriculture, Government of West Bengal Circle
      </footer>
    </div>
  );
};

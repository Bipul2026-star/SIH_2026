import React from 'react';
import { X, Globe, Volume2, Trash2, Info, ShieldCheck, Check } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import type { Language } from '../types';
import { speechService } from '../services/speechService';
import { storageService } from '../services/storageService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { language, setLanguage, languages, t } = useLanguage();

  if (!isOpen) return null;

  const handleLanguageSelect = (lang: Language) => {
    speechService.playChime('click');
    setLanguage(lang);
  };

  const handleClearHistory = () => {
    speechService.playChime('alert');
    if (window.confirm(t('confirmClearHistoryPrompt', 'Clear all past scan records from device storage?'))) {
      storageService.clearHistory();
      alert(t('clearHistorySuccess', 'Scan history records have been cleared.'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4">
      <div className="w-full max-w-md bg-white border border-[#E1D9C4] rounded-3xl p-5 sm:p-6 text-[#20261F] shadow-2xl animate-in slide-in-from-bottom-6 duration-200 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#E1D9C4]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E4F3EA] border border-[#B7E4C7] flex items-center justify-center text-[#2B6E4F]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-[#173C2D]">
                {t('settings', 'Settings')}
              </h3>
              <p className="text-xs text-[#4C5548]">Crop Rakshak v2.0 (PWA)</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              speechService.playChime('click');
              onClose();
            }}
            className="touch-target w-10 h-10 rounded-full bg-[#F3ECDA] hover:bg-[#E1D9C4] text-[#4C5548] flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section: Language Switcher */}
        <div className="mt-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#4C5548] uppercase tracking-wider mb-2">
            <Globe className="w-4 h-4 text-[#2B6E4F]" />
            <span>{t('languageSelect', 'Select Language')}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {languages.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLanguageSelect(lang.code)}
                  className={`touch-target p-3 rounded-2xl border text-left flex items-center justify-between transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-[#E4F3EA] border-[#2B6E4F] text-[#173C2D] font-bold shadow-sm'
                      : 'bg-[#FBF7ED] border-[#E1D9C4] hover:bg-[#F3ECDA] text-[#20261F]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{lang.flag}</span>
                    <div>
                      <div className="text-sm font-semibold">{lang.nativeName}</div>
                      <div className="text-[10px] text-[#4C5548]">{lang.label}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#2B6E4F]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section: Voice Guide */}
        <div className="mt-4 p-3.5 rounded-2xl bg-[#FBF7ED] border border-[#E1D9C4]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#E4F3EA] text-[#2B6E4F] flex items-center justify-center">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#173C2D]">
                  {t('voiceToggle', 'Voice Guide')}
                </div>
                <div className="text-xs text-[#4C5548]">
                  {t('voiceGuideSubtitle', 'Audio narration of guidance')}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => speechService.speak(t('voiceHomeGreeting'), language)}
              className="touch-target px-3.5 py-1.5 rounded-xl bg-[#2B6E4F] hover:bg-[#173C2D] text-white text-xs font-bold shadow-sm transition-colors"
            >
              {t('voiceTestBtn', 'Test Voice')}
            </button>
          </div>
        </div>

        {/* Section: Data & Storage */}
        <div className="mt-4">
          <button
            type="button"
            onClick={handleClearHistory}
            className="w-full min-h-[48px] p-3 rounded-2xl bg-[#FBF7ED] hover:bg-[#FBE1DC] border border-[#E1D9C4] hover:border-[#EFCE93] text-[#C0431F] font-bold flex items-center justify-center gap-2 text-xs transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t('clearHistory', 'Clear All Past Scan Records')}</span>
          </button>
        </div>

        {/* App Info Footer */}
        <div className="mt-5 pt-3 border-t border-[#E1D9C4] text-center text-xs text-[#4C5548]">
          <div className="flex items-center justify-center gap-1 font-semibold text-[#173C2D]">
            <Info className="w-3.5 h-3.5 text-[#2B6E4F]" />
            <span>{t('settingsInfoBrand', 'Crop Rakshak · Regional Crop Health Network')}</span>
          </div>
          <p className="mt-1 text-[11px]">{t('settingsInfoTagline', 'Empowering Indian Smallholder Farmers with Offline AI')}</p>
        </div>
      </div>
    </div>
  );
};

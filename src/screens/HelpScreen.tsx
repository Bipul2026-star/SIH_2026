import React, { useState } from 'react';
import {
  HelpCircle,
  Volume2,
  PhoneCall,
  MessageCircle,
  Building2,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { speechService } from '../services/speechService';

interface HelpScreenProps {
  onOpenExpertModal?: () => void;
}

export const HelpScreen: React.FC<HelpScreenProps> = () => {
  const { t, language } = useLanguage();
  const [showOfficesModal, setShowOfficesModal] = useState(false);

  const handleAudioTour = () => {
    speechService.playChime('info');
    const guideText = `${t('appName')}. ${t('helpAudioGuideDesc')}. ${t(
      'voiceHomeGreeting'
    )} ${t('voiceTreatmentRead')}`;
    speechService.speak(guideText, language);
  };

  const handleKvkCall = () => {
    speechService.playChime('click');
    window.location.href = 'tel:18001801551';
  };

  const handleWhatsApp = () => {
    speechService.playChime('click');
    const msg = encodeURIComponent(
      'নমস্কার, আমি ফসল রক্ষক অ্যাপ থেকে লিখছি। আমার ফসলে সমস্যা হয়েছে।'
    );
    window.open(`https://wa.me/919876543210?text=${msg}`, '_blank');
  };

  const localOffices = [
    {
      name: 'Krishi Vigyan Kendra (KVK) - Central Hub',
      dist: 'Burdwan / বর্ধমান',
      phone: '0342-2656789',
      address: 'ICAR-CRIJAF Research Campus, GT Road',
    },
    {
      name: 'Assistant Director of Agriculture (ADA) Office',
      dist: 'Nadia / নদীয়া',
      phone: '03472-252110',
      address: 'Krishi Bhavan, Krishnanagar Sadar',
    },
    {
      name: 'Sub-Divisional Krishi Suchana Kendra',
      dist: 'Hooghly / হুগলী',
      phone: '033-26802145',
      address: 'Chinsurah Agricultural Farm Complex',
    },
  ];

  return (
    <div className="flex flex-col gap-4 pb-28 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-2xl bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-extrabold text-white">{t('helpTitle', 'Farmer Support')}</h2>
          <p className="text-xs text-stone-400">
            {t('helpSub', 'Tap any option for instant voice or expert help')}
          </p>
        </div>
      </div>

      {/* 4 Large Action Buttons */}
      <div className="space-y-3">
        {/* 1. Voice Audio Instructions Walkthrough */}
        <button
          type="button"
          onClick={handleAudioTour}
          className="touch-target w-full min-h-[76px] p-4 rounded-3xl bg-gradient-to-r from-emerald-900/80 via-emerald-800/60 to-stone-900 border-2 border-emerald-500/60 hover:border-emerald-400 text-white font-bold flex items-center justify-between gap-3 shadow-xl active:scale-[0.98] transition-all text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">
              <Volume2 className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-sm font-black tracking-tight text-white">
                {t('helpAudioGuideTitle', '🔊 Listen to App Instructions')}
              </div>
              <div className="text-xs text-emerald-200/90 mt-0.5">
                {t('helpAudioGuideDesc', 'Audio walkthrough in your language')}
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-emerald-400 flex-shrink-0" />
        </button>

        {/* 2. Call KVK Helpline (Toll Free) */}
        <button
          type="button"
          onClick={handleKvkCall}
          className="touch-target w-full min-h-[76px] p-4 rounded-3xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 text-white font-bold flex items-center justify-between gap-3 shadow-xl active:scale-[0.98] transition-all text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center flex-shrink-0">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-black tracking-tight text-white">
                {t('helpKvkTitle', '📞 Kisan Helpline (KVK)')}
              </div>
              <div className="text-xs text-emerald-100 font-mono font-bold mt-0.5">
                1800-180-1551 (Toll-Free)
              </div>
            </div>
          </div>
          <span className="text-xs px-3 py-1.5 bg-white/20 rounded-full font-bold">কল করুন</span>
        </button>

        {/* 3. WhatsApp Help */}
        <button
          type="button"
          onClick={handleWhatsApp}
          className="touch-target w-full min-h-[72px] p-4 rounded-3xl bg-stone-900/95 hover:bg-stone-800 border-2 border-stone-700/90 text-white font-bold flex items-center justify-between gap-3 shadow-lg active:scale-[0.98] transition-all text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-stone-100">
                {t('helpWhatsappTitle', '💬 WhatsApp Krishi Mitra')}
              </div>
              <div className="text-xs text-stone-400 mt-0.5">
                {t('helpWhatsappDesc', 'Send crop photos to expert')}
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-stone-400 flex-shrink-0" />
        </button>

        {/* 4. Nearby Agriculture Office */}
        <button
          type="button"
          onClick={() => {
            speechService.playChime('click');
            setShowOfficesModal(true);
          }}
          className="touch-target w-full min-h-[72px] p-4 rounded-3xl bg-stone-900/95 hover:bg-stone-800 border-2 border-stone-700/90 text-white font-bold flex items-center justify-between gap-3 shadow-lg active:scale-[0.98] transition-all text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-stone-100">
                {t('helpOfficeTitle', '🏛️ Nearby Agriculture Office')}
              </div>
              <div className="text-xs text-stone-400 mt-0.5">
                {t('helpOfficeDesc', 'Locate local Krishi Bhavan')}
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-stone-400 flex-shrink-0" />
        </button>
      </div>

      {/* Nearby Offices Modal */}
      {showOfficesModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-3">
          <div className="w-full max-w-md bg-stone-900 border border-stone-700 rounded-3xl p-5 text-white shadow-2xl animate-in slide-in-from-bottom-6 duration-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-950 text-amber-400 border border-amber-700 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">
                    {t('helpOfficeTitle', 'Nearby Agriculture Offices')}
                  </h3>
                  <p className="text-xs text-stone-400">সরকারি কৃষি কেন্দ্র ও KVK শাখা</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowOfficesModal(false)}
                className="touch-target w-10 h-10 rounded-full bg-stone-800 text-stone-300 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {localOffices.map((office, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-stone-800/80 border border-stone-700 space-y-1.5"
                >
                  <div className="font-extrabold text-sm text-white">{office.name}</div>
                  <div className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{office.dist}</span>
                  </div>
                  <div className="text-xs text-stone-300">{office.address}</div>
                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-xs text-emerald-400 font-mono font-bold">
                      {office.phone}
                    </span>
                    <a
                      href={`tel:${office.phone.replace(/[^0-9]/g, '')}`}
                      className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                    >
                      ফোন করুন
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={() => setShowOfficesModal(false)}
                className="w-full min-h-[48px] rounded-2xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs"
              >
                {t('closeModal', 'Close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

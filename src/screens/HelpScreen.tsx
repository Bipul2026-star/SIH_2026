import React, { useState } from 'react';
import {
  HelpCircle,
  Volume2,
  PhoneCall,
  MessageCircle,
  Building2,
  MapPin,
  ChevronRight,
  X,
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
    <div className="w-full max-w-2xl mx-auto space-y-4 pb-24 sm:pb-16 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-[#E4F3EA] border border-[#B7E4C7] flex items-center justify-center text-[#2B6E4F] shadow-sm">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-heading text-lg sm:text-xl font-extrabold text-[#173C2D]">
            {t('helpTitle', 'Farmer Support')}
          </h2>
          <p className="text-xs text-[#4C5548]">
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
          className="touch-target w-full min-h-[76px] p-4 sm:p-5 rounded-3xl bg-white hover:bg-[#F3ECDA] border border-[#E1D9C4] hover:border-[#2B6E4F] text-[#20261F] font-bold flex items-center justify-between gap-3 shadow-sm hover:shadow-agri active:scale-[0.99] transition-all text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#E4F3EA] text-[#2B6E4F] border border-[#B7E4C7] flex items-center justify-center flex-shrink-0 shadow-sm">
              <Volume2 className="w-6 h-6" />
            </div>
            <div>
              <div className="font-heading text-sm sm:text-base font-bold text-[#173C2D]">
                {t('helpAudioGuideTitle', '🔊 Listen to App Instructions')}
              </div>
              <div className="text-xs text-[#4C5548] mt-0.5 font-medium">
                {t('helpAudioGuideDesc', 'Audio walkthrough in your language')}
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#4C5548] flex-shrink-0" />
        </button>

        {/* 2. Call KVK Helpline (Toll Free) */}
        <button
          type="button"
          onClick={handleKvkCall}
          className="touch-target w-full min-h-[76px] p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#2B6E4F] to-[#173C2D] hover:from-[#1F533E] hover:to-[#173C2D] text-white font-bold flex items-center justify-between gap-3 shadow-md active:scale-[0.99] transition-all text-left border border-[#52B788]/40"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center flex-shrink-0">
              <PhoneCall className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-heading text-sm sm:text-base font-extrabold text-white">
                {t('helpKvkTitle', '📞 Kisan Helpline (KVK)')}
              </div>
              <div className="text-xs text-[#DCEDE1] font-mono font-bold mt-0.5">
                1800-180-1551 (Toll-Free)
              </div>
            </div>
          </div>
          <span className="text-xs px-3.5 py-1.5 bg-white/20 rounded-full font-bold text-white shadow-sm">
            {t('callNowBadge', 'Call Now')}
          </span>
        </button>

        {/* 3. WhatsApp Help */}
        <button
          type="button"
          onClick={handleWhatsApp}
          className="touch-target w-full min-h-[72px] p-4 sm:p-5 rounded-3xl bg-white hover:bg-[#F3ECDA] border border-[#E1D9C4] hover:border-[#2B6E4F] text-[#20261F] font-bold flex items-center justify-between gap-3 shadow-sm hover:shadow-agri active:scale-[0.99] transition-all text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#E4F3EA] text-[#2B6E4F] border border-[#B7E4C7] flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="font-heading text-sm sm:text-base font-bold text-[#173C2D]">
                {t('helpWhatsappTitle', '💬 WhatsApp Krishi Mitra')}
              </div>
              <div className="text-xs text-[#4C5548] mt-0.5 font-medium">
                {t('helpWhatsappDesc', 'Send crop photos to expert')}
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#4C5548] flex-shrink-0" />
        </button>

        {/* 4. Nearby Agriculture Office */}
        <button
          type="button"
          onClick={() => {
            speechService.playChime('click');
            setShowOfficesModal(true);
          }}
          className="touch-target w-full min-h-[72px] p-4 sm:p-5 rounded-3xl bg-white hover:bg-[#F3ECDA] border border-[#E1D9C4] hover:border-[#E38A1C] text-[#20261F] font-bold flex items-center justify-between gap-3 shadow-sm hover:shadow-agri active:scale-[0.99] transition-all text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FBEFDC] text-[#E38A1C] border border-[#EFCE93] flex items-center justify-center flex-shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="font-heading text-sm sm:text-base font-bold text-[#173C2D]">
                {t('helpOfficeTitle', '🏛️ Nearby Agriculture Office')}
              </div>
              <div className="text-xs text-[#4C5548] mt-0.5 font-medium">
                {t('helpOfficeDesc', 'Locate local Krishi Bhavan')}
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#4C5548] flex-shrink-0" />
        </button>
      </div>

      {/* Nearby Offices Modal */}
      {showOfficesModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4">
          <div className="w-full max-w-md bg-white border border-[#E1D9C4] rounded-3xl p-5 sm:p-6 text-[#20261F] shadow-2xl animate-in slide-in-from-bottom-6 duration-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#E1D9C4]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#FBEFDC] text-[#E38A1C] border border-[#EFCE93] flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-[#173C2D]">
                    {t('helpOfficeTitle', 'Nearby Agriculture Offices')}
                  </h3>
                  <p className="text-xs text-[#4C5548]">
                    {t('helpOfficesModalSub', 'Government Agriculture Centers & KVK Branches')}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowOfficesModal(false)}
                className="touch-target w-10 h-10 rounded-full bg-[#F3ECDA] hover:bg-[#E1D9C4] text-[#4C5548] flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {localOffices.map((office, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#FBF7ED] border border-[#E1D9C4] space-y-1.5 text-xs"
                >
                  <div className="font-heading font-bold text-sm text-[#173C2D]">{office.name}</div>
                  <div className="text-xs text-[#8A5A34] font-semibold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#E38A1C]" />
                    <span>{office.dist}</span>
                  </div>
                  <div className="text-xs text-[#4C5548]">{office.address}</div>
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs text-[#2B6E4F] font-mono font-bold">
                      {office.phone}
                    </span>
                    <a
                      href={`tel:${office.phone.replace(/[^0-9]/g, '')}`}
                      className="px-3.5 py-1.5 rounded-xl bg-[#2B6E4F] hover:bg-[#173C2D] text-white font-bold text-xs shadow-sm transition-colors"
                    >
                      {t('callNowBadge', 'Call')}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={() => setShowOfficesModal(false)}
                className="w-full min-h-[48px] rounded-2xl bg-[#F3ECDA] hover:bg-[#E1D9C4] text-[#173C2D] font-bold text-xs flex items-center justify-center transition-colors"
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

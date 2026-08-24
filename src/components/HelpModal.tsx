import React from 'react';
import { PhoneCall, MessageCircle, MapPin, X, Clock, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { speechService } from '../services/speechService';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  const handleCall = () => {
    speechService.playChime('click');
    window.location.href = 'tel:18001801551';
  };

  const handleWhatsApp = () => {
    speechService.playChime('click');
    const message = encodeURIComponent(
      'নমস্কার, আমি ফসল রক্ষক অ্যাপ থেকে লিখছি। আমার ফসলে রোগ দেখা দিয়েছে, পরামর্শ প্রয়োজন।'
    );
    window.open(`https://wa.me/919876543210?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4">
      <div className="w-full max-w-md bg-white border border-[#E1D9C4] rounded-3xl p-5 sm:p-6 text-[#20261F] shadow-2xl animate-in slide-in-from-bottom-6 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#E1D9C4]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E4F3EA] border border-[#B7E4C7] flex items-center justify-center text-[#2B6E4F]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-[#173C2D]">
                {t('expertContactModalTitle', 'Connect with Agri Expert')}
              </h3>
              <p className="text-xs text-[#4C5548] flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-[#E38A1C]" />
                <span>{t('kvkTiming', '6:00 AM - 10:00 PM')}</span>
              </p>
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

        {/* Action Buttons */}
        <div className="mt-4 space-y-3">
          {/* Toll Free Call */}
          <button
            type="button"
            onClick={handleCall}
            className="w-full min-h-[60px] p-4 rounded-2xl bg-[#2B6E4F] hover:bg-[#173C2D] text-white font-bold flex items-center justify-between shadow-md transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <PhoneCall className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-white">
                  {t('callKvkAction', 'Call Kisan Helpline')}
                </div>
                <div className="text-xs text-[#DCEDE1] font-mono font-bold mt-0.5">
                  1800-180-1551 (Toll-Free)
                </div>
              </div>
            </div>
            <span className="text-xs px-3 py-1 bg-white/20 rounded-full font-bold">
              কল করুন
            </span>
          </button>

          {/* WhatsApp Action */}
          <button
            type="button"
            onClick={handleWhatsApp}
            className="w-full min-h-[56px] p-3.5 rounded-2xl bg-[#FBF7ED] hover:bg-[#F3ECDA] border border-[#E1D9C4] text-[#173C2D] font-bold flex items-center justify-between transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-[#E4F3EA] text-[#2B6E4F] flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#173C2D]">
                  {t('whatsappAction', 'Message on WhatsApp')}
                </div>
                <div className="text-xs text-[#4C5548]">ছবি পাঠিয়ে পরামর্শ নিন</div>
              </div>
            </div>
            <span className="text-xs text-[#2B6E4F] font-bold">চ্যাট শুরু</span>
          </button>

          {/* Nearby Office */}
          <div className="p-3.5 rounded-2xl bg-[#F3ECDA] border border-[#E1D9C4] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FBEFDC] text-[#8A5A34] flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="text-xs text-[#4C5548]">
              <div className="font-bold text-[#173C2D]">
                {t('helpOfficeTitle', 'Nearby Agri Office')}
              </div>
              <div>আপনার মহকুমা কৃষি তথ্য কেন্দ্র ও KVK শাখা</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

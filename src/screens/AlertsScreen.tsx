import React, { useState } from 'react';
import {
  BellRing,
  MapPin,
  Calendar,
  ChevronRight,
  ShieldCheck,
  X,
  Volume2,
} from 'lucide-react';
import type { RegionalAlert } from '../types';
import { REGIONAL_ALERTS } from '../services/diagnosisService';
import { useLanguage } from '../i18n/LanguageContext';
import { RiskBadge } from '../components/RiskBadge';
import { speechService } from '../services/speechService';

export const AlertsScreen: React.FC = () => {
  const { t, language } = useLanguage();
  const [selectedAlert, setSelectedAlert] = useState<RegionalAlert | null>(null);

  const handleOpenAdvisory = (alert: RegionalAlert) => {
    speechService.playChime('click');
    setSelectedAlert(alert);
  };

  const handleSpeakAlert = (alert: RegionalAlert) => {
    const text = `${t('alertsTitle')}: ${t(alert.cropKey)} ${t(alert.issueKey)}. ${t(
      alert.messageKey
    )}.`;
    speechService.speak(text, language);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 pb-24 sm:pb-16 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-[#FBEFDC] border border-[#EFCE93] flex items-center justify-center text-[#E38A1C] shadow-sm">
          <BellRing className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-heading text-lg sm:text-xl font-extrabold text-[#173C2D]">
            {t('alertsTitle', 'Regional Disease Alerts')}
          </h2>
          <p className="text-xs text-[#4C5548]">
            {t('alertsSub', 'Live advisories in your area')}
          </p>
        </div>
      </div>

      {/* Alert Feed */}
      <div className="space-y-3">
        {REGIONAL_ALERTS.map((alert) => (
          <div
            key={alert.id}
            className="bg-white border border-[#E1D9C4] hover:border-[#E38A1C]/70 rounded-3xl p-5 text-[#20261F] shadow-sm hover:shadow-agri space-y-3 transition-all"
          >
            {/* Top Bar with Badge and Date */}
            <div className="flex items-center justify-between">
              <RiskBadge level={alert.riskLevel} size="sm" />
              <div className="flex items-center gap-1 text-[11px] text-[#4C5548] font-medium">
                <Calendar className="w-3.5 h-3.5 text-[#8A5A34]" />
                <span>{alert.dateKey}</span>
              </div>
            </div>

            {/* Title & Disease */}
            <div>
              <div className="text-xs font-bold text-[#2B6E4F]">
                {t(alert.cropKey, 'Crop')}
              </div>
              <h3 className="font-heading text-base sm:text-lg font-extrabold text-[#173C2D] mt-0.5 leading-snug">
                {t(alert.issueKey, 'Rice Blast Outbreak')}
              </h3>
              <p className="text-xs sm:text-sm text-[#4C5548] mt-1.5 leading-relaxed font-medium">
                {t(alert.messageKey, 'Risk elevated due to high humidity.')}
              </p>
            </div>

            {/* Region Location Tag */}
            <div className="flex items-center gap-1.5 text-xs text-[#8A5A34] bg-[#F3ECDA] px-3.5 py-1.5 rounded-xl border border-[#E1D9C4] font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#E38A1C] flex-shrink-0" />
              <span className="truncate">{alert.areaKey}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleOpenAdvisory(alert)}
                className="touch-target flex-1 min-h-[48px] px-4 py-2 rounded-2xl bg-[#2B6E4F] hover:bg-[#173C2D] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <span>{t('preventiveStepsTitle', 'How do I prevent this?')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleSpeakAlert(alert)}
                aria-label="Listen Alert"
                className="touch-target w-12 h-12 rounded-2xl bg-[#F3ECDA] hover:bg-[#E1D9C4] text-[#2B6E4F] border border-[#E1D9C4] flex items-center justify-center active:scale-95 flex-shrink-0 transition-transform shadow-sm"
              >
                <Volume2 className="w-4 h-4 text-[#2B6E4F]" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Prevention Advisory Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4">
          <div className="w-full max-w-md bg-white border border-[#E1D9C4] rounded-3xl p-5 sm:p-6 text-[#20261F] shadow-2xl animate-in slide-in-from-bottom-6 duration-200">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#E1D9C4]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#E4F3EA] text-[#2B6E4F] border border-[#B7E4C7] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-[#173C2D]">
                    {t('preventiveStepsTitle', 'Preventive Measures')}
                  </h3>
                  <p className="text-xs text-[#4C5548]">{t(selectedAlert.issueKey)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  speechService.playChime('click');
                  setSelectedAlert(null);
                }}
                className="touch-target w-10 h-10 rounded-full bg-[#F3ECDA] hover:bg-[#E1D9C4] text-[#4C5548] flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {selectedAlert.advisorySteps.map((stepKey, i) => (
                <div
                  key={stepKey}
                  className="p-3.5 rounded-2xl bg-[#FBF7ED] border border-[#E1D9C4] flex items-start gap-3"
                >
                  <span className="w-6 h-6 rounded-full bg-[#2B6E4F] text-white font-mono font-bold text-xs flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-[#20261F] font-medium leading-relaxed">
                    {t(stepKey)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={() => setSelectedAlert(null)}
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

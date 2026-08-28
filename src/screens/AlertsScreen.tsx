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
    <div className="flex flex-col gap-4 pb-28 animate-in fade-in duration-200">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-red-950 border border-red-700/60 flex items-center justify-center text-red-400">
              <BellRing className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">
                {t('alertsTitle', 'Regional Disease Alerts')}
              </h2>
              <p className="text-xs text-stone-400">
                {t('alertsSub', 'Live advisories in your area')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Feed */}
      <div className="space-y-3">
        {REGIONAL_ALERTS.map((alert) => (
          <div
            key={alert.id}
            className="bg-stone-900/95 border-2 border-stone-800 hover:border-red-600/50 rounded-3xl p-4 text-white shadow-xl space-y-3 transition-all"
          >
            {/* Top Bar with Badge and Date */}
            <div className="flex items-center justify-between">
              <RiskBadge level={alert.riskLevel} size="sm" />
              <div className="flex items-center gap-1 text-[11px] text-stone-400">
                <Calendar className="w-3.5 h-3.5 text-stone-500" />
                <span>{alert.dateKey}</span>
              </div>
            </div>

            {/* Title & Disease */}
            <div>
              <div className="text-xs font-semibold text-emerald-400">
                {t(alert.cropKey, 'Crop')}
              </div>
              <h3 className="text-sm font-extrabold text-white mt-0.5 leading-snug">
                {t(alert.issueKey, 'Rice Blast Outbreak')}
              </h3>
              <p className="text-xs text-stone-300 mt-1.5 leading-relaxed">
                {t(alert.messageKey, 'Risk elevated due to high humidity.')}
              </p>
            </div>

            {/* Region Location Tag */}
            <div className="flex items-center gap-1.5 text-xs text-stone-400 bg-stone-800/60 px-3 py-1.5 rounded-xl border border-stone-700/50">
              <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span className="truncate">{alert.areaKey}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleOpenAdvisory(alert)}
                className="touch-target flex-1 min-h-[46px] px-4 py-2 rounded-2xl bg-emerald-700/80 hover:bg-emerald-600 border border-emerald-500/50 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <span>{t('preventiveStepsTitle', 'How do I prevent this?')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleSpeakAlert(alert)}
                aria-label="Listen Alert"
                className="touch-target w-11 h-11 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center justify-center active:scale-95 flex-shrink-0"
              >
                <Volume2 className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Prevention Advisory Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-3">
          <div className="w-full max-w-md bg-stone-900 border border-stone-700 rounded-3xl p-5 text-white shadow-2xl animate-in slide-in-from-bottom-6 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-700 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">
                    {t('preventiveStepsTitle', 'Preventive Measures')}
                  </h3>
                  <p className="text-xs text-stone-400">{t(selectedAlert.issueKey)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  speechService.playChime('click');
                  setSelectedAlert(null);
                }}
                className="touch-target w-10 h-10 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {selectedAlert.advisorySteps.map((stepKey, i) => (
                <div
                  key={stepKey}
                  className="p-3.5 rounded-2xl bg-stone-800/80 border border-stone-700 flex items-start gap-3"
                >
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-mono font-bold text-xs flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-xs text-stone-200 font-medium leading-relaxed">
                    {t(stepKey)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={() => setSelectedAlert(null)}
                className="w-full min-h-[48px] rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center"
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

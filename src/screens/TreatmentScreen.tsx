import React from 'react';
import {
  ArrowLeft,
  Scissors,
  SprayCan,
  Eye,
  PhoneCall,
  Droplet,
  Sun,
  Volume2,
  CheckCircle,
} from 'lucide-react';
import type { DiagnosisResult, ScreenType, TreatmentStep } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { RiskBadge } from '../components/RiskBadge';
import { speechService } from '../services/speechService';

interface TreatmentScreenProps {
  result: DiagnosisResult;
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
  onOpenExpertModal: () => void;
}

export const TreatmentScreen: React.FC<TreatmentScreenProps> = ({
  result,
  onBack,
  onOpenExpertModal,
}) => {
  const { t, language } = useLanguage();

  const getStepIcon = (iconName: TreatmentStep['iconName']) => {
    switch (iconName) {
      case 'scissors':
        return Scissors;
      case 'spray':
        return SprayCan;
      case 'eye':
        return Eye;
      case 'droplet':
        return Droplet;
      case 'sun':
        return Sun;
      default:
        return CheckCircle;
    }
  };

  const handleReadAllSteps = () => {
    const speechText = result.treatmentSteps
      .map(
        (s, i) =>
          `${t('stepNumber', 'Step')} ${i + 1}: ${t(s.titleKey)}. ${t(s.descKey)}.`
      )
      .join(' ');
    speechService.speak(speechText, language);
  };

  const handleSpeakSingleStep = (step: TreatmentStep, index: number) => {
    const text = `${t('stepNumber', 'Step')} ${index + 1}: ${t(step.titleKey)}. ${t(
      step.descKey
    )}.`;
    speechService.speak(text, language);
  };

  return (
    <div className="flex flex-col gap-4 pb-28 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            speechService.playChime('click');
            onBack();
          }}
          className="touch-target w-11 h-11 rounded-2xl bg-stone-900 border border-stone-700 text-stone-300 flex items-center justify-center active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h2 className="text-base font-extrabold text-white">
            {t('treatmentTitle', 'Treatment & Care')}
          </h2>
          <p className="text-[11px] text-emerald-400 font-semibold">{t(result.cropNameKey)} • {t(result.labelKey)}</p>
        </div>

        {/* Read All Audio Button */}
        <button
          type="button"
          onClick={handleReadAllSteps}
          aria-label={t('listenTreatment', 'Listen Steps')}
          className="touch-target w-11 h-11 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 flex items-center justify-center shadow-md active:scale-95"
        >
          <Volume2 className="w-5 h-5 text-emerald-400" />
        </button>
      </div>

      {/* Disease Summary Card */}
      <div className="bg-stone-900 border-2 border-stone-800 rounded-3xl p-4 text-white shadow-xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-600/40 flex items-center justify-center text-emerald-400 text-2xl flex-shrink-0">
            🌱
          </div>
          <div>
            <div className="text-xs text-stone-400 font-semibold">{t(result.cropNameKey)}</div>
            <div className="text-sm font-extrabold text-white leading-tight mt-0.5">
              {t(result.labelKey)}
            </div>
          </div>
        </div>

        <RiskBadge level={result.riskLevel} size="sm" />
      </div>

      {/* Subtitle */}
      <div className="px-1 text-xs text-stone-300 font-medium">
        {t('treatmentSub', 'Follow these 3 simple steps to treat your affected crop:')}
      </div>

      {/* 3 Action Cards (Numbered, Icon, Bold Title, 1-Line Instruction) */}
      <div className="space-y-3">
        {result.treatmentSteps.map((step, index) => {
          const StepIcon = getStepIcon(step.iconName);
          const stepNum = index + 1;

          return (
            <div
              key={step.stepNumber}
              className="bg-stone-900/95 border-2 border-stone-800 hover:border-emerald-500/50 rounded-3xl p-4 text-white shadow-xl flex items-start gap-3.5 transition-all relative overflow-hidden group"
            >
              {/* Step Number Badge & Icon */}
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border-2 border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-md">
                  <StepIcon className="w-6 h-6 text-emerald-400" />
                </div>
                <span className="text-[11px] font-black text-amber-400 font-mono">
                  #{stepNum}
                </span>
              </div>

              {/* Step Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold text-white leading-snug">
                    {t(step.titleKey)}
                  </h4>
                  {/* Read individual step button */}
                  <button
                    type="button"
                    onClick={() => handleSpeakSingleStep(step, index)}
                    aria-label="Listen step"
                    className="touch-target w-8 h-8 rounded-full bg-stone-800 text-stone-300 hover:text-emerald-400 flex items-center justify-center active:scale-95"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-stone-300 mt-1.5 leading-relaxed font-medium">
                  {t(step.descKey)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Direct Call KVK Help Center Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => {
            speechService.playChime('click');
            onOpenExpertModal();
          }}
          className="w-full min-h-[58px] p-4 rounded-3xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-xl active:scale-[0.98] transition-all"
        >
          <PhoneCall className="w-5 h-5" />
          <span>{t('callKvkBtn', '📞 Call Kisan Helpline (1800-180-1551)')}</span>
        </button>
      </div>
    </div>
  );
};

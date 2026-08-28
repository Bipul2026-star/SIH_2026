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
    <div className="w-full max-w-2xl mx-auto space-y-4 pb-24 sm:pb-16 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            speechService.playChime('click');
            onBack();
          }}
          className="touch-target px-3.5 py-1.5 rounded-2xl bg-[#F3ECDA] hover:bg-[#E1D9C4] border border-[#E1D9C4] text-[#173C2D] font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('homeNavBack', 'Back')}</span>
        </button>

        <div className="text-center">
          <h2 className="font-heading text-lg sm:text-xl font-extrabold text-[#173C2D]">
            {t('treatmentTitle', 'Treatment & Care')}
          </h2>
          <p className="text-[11px] text-[#2B6E4F] font-bold">
            {t(result.cropNameKey)} • {t(result.labelKey)}
          </p>
        </div>

        {/* Read All Audio Button */}
        <button
          type="button"
          onClick={handleReadAllSteps}
          aria-label={t('listenTreatment', 'Listen Steps')}
          className="touch-target px-3.5 py-1.5 rounded-2xl bg-[#F3ECDA] hover:bg-[#E1D9C4] border border-[#E1D9C4] text-[#173C2D] text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
        >
          <Volume2 className="w-4 h-4 text-[#2B6E4F]" />
          <span>{t('listenTreatment', 'Listen All')}</span>
        </button>
      </div>

      {/* Disease Summary Card */}
      <div className="bg-white border border-[#E1D9C4] rounded-3xl p-4 sm:p-5 text-[#20261F] shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#E4F3EA] border border-[#B7E4C7] flex items-center justify-center text-[#2B6E4F] text-2xl flex-shrink-0">
            🌱
          </div>
          <div>
            <div className="text-xs text-[#4C5548] font-semibold">{t(result.cropNameKey)}</div>
            <div className="font-heading text-base sm:text-lg font-extrabold text-[#173C2D] leading-tight mt-0.5">
              {t(result.labelKey)}
            </div>
          </div>
        </div>

        <RiskBadge level={result.riskLevel} size="sm" />
      </div>

      {/* Subtitle */}
      <div className="px-1 text-xs sm:text-sm text-[#4C5548] font-medium">
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
              className="bg-white border border-[#E1D9C4] hover:border-[#2B6E4F]/60 rounded-3xl p-4 sm:p-5 text-[#20261F] shadow-sm hover:shadow-agri flex items-start gap-4 transition-all relative overflow-hidden"
            >
              {/* Step Number Badge & Icon */}
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-[#E4F3EA] border border-[#52B788]/40 text-[#2B6E4F] flex items-center justify-center shadow-sm">
                  <StepIcon className="w-6 h-6 text-[#2B6E4F]" />
                </div>
                <span className="text-[11px] font-extrabold text-[#8A5A34] font-mono">
                  #{stepNum}
                </span>
              </div>

              {/* Step Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-heading text-sm sm:text-base font-extrabold text-[#173C2D] leading-snug">
                    {t(step.titleKey)}
                  </h4>
                  {/* Read individual step button */}
                  <button
                    type="button"
                    onClick={() => handleSpeakSingleStep(step, index)}
                    aria-label="Listen step"
                    className="touch-target w-8 h-8 rounded-full bg-[#F3ECDA] hover:bg-[#E1D9C4] text-[#2B6E4F] flex items-center justify-center active:scale-95 transition-transform"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-[#4C5548] mt-1.5 leading-relaxed font-medium">
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
          className="w-full min-h-[56px] p-4 rounded-2xl bg-gradient-to-r from-[#2B6E4F] to-[#173C2D] hover:from-[#1F533E] hover:to-[#173C2D] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-md active:scale-[0.98] transition-all border border-[#52B788]/40"
        >
          <PhoneCall className="w-5 h-5 text-[#8EE0B6]" />
          <span>{t('callKvkBtn', '📞 Call Kisan Helpline (1800-180-1551)')}</span>
        </button>
      </div>
    </div>
  );
};

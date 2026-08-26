import React, { useEffect } from 'react';
import {
  RotateCcw,
  Volume2,
  PhoneCall,
  ChevronRight,
  AlertTriangle,
  Camera,
  Lightbulb,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { DiagnosisResult, ScreenType } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { RiskBadge } from '../components/RiskBadge';
import { ConfidenceMeter } from '../components/ConfidenceMeter';
import { speechService } from '../services/speechService';

interface ResultScreenProps {
  result: DiagnosisResult;
  onNavigate: (screen: ScreenType) => void;
  onOpenExpertModal: () => void;
  onRetake: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  result,
  onNavigate,
  onOpenExpertModal,
  onRetake,
}) => {
  const { t, language } = useLanguage();

  const isUnclear = result.isUnclear || result.confidence < 60;
  const isHealthy = result.issueType === 'healthy' || result.riskLevel === 'healthy';

  // Trigger celebration confetti if crop is healthy or play acoustic chime
  useEffect(() => {
    if (isHealthy) {
      speechService.playChime('healthy');
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2B6E4F', '#52B788', '#E38A1C', '#ffffff'],
      });
    } else if (isUnclear) {
      speechService.playChime('alert');
    } else {
      speechService.playChime('success');
    }
  }, [isHealthy, isUnclear]);

  const handleSpeakResult = () => {
    if (isUnclear) {
      speechService.speak(t('voiceResultUnclear'), language);
    } else {
      const speechText = `${t(result.cropNameKey)} - ${t(result.labelKey)}. ${t(result.summaryKey)}.`;
      speechService.speak(speechText, language);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 pb-24 sm:pb-16 animate-in fade-in duration-300">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#173C2D] flex items-center gap-2">
          <span>{t('resultTitle', 'Diagnosis Result')}</span>
        </h2>
        <button
          type="button"
          onClick={handleSpeakResult}
          className="touch-target px-3.5 py-1.5 rounded-2xl bg-[#F3ECDA] hover:bg-[#E1D9C4] border border-[#E1D9C4] text-[#173C2D] text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform"
        >
          <Volume2 className="w-4 h-4 text-[#2B6E4F]" />
          <span>{t('listenDiagnosis', 'Listen Result')}</span>
        </button>
      </div>

      {/* Photo Preview Card */}
      <div className="relative w-full h-56 sm:h-72 rounded-3xl overflow-hidden border border-[#E1D9C4] bg-white shadow-sm">
        <img
          src={result.imageUrl}
          alt="Scanned Crop Leaf"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Floating Tags on Image */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between">
          <div className="px-3.5 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-white/40 text-[#173C2D] text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <span>🌱</span>
            <span>{t(result.cropNameKey, 'Paddy')}</span>
          </div>

          <RiskBadge level={result.riskLevel} size="md" />
        </div>
      </div>

      {/* ⚠️ FALLBACK STATE (< 60% Confidence / Unclear Image) */}
      {isUnclear ? (
        <div className="bg-[#FBEFDC] border border-[#EFCE93] rounded-3xl p-5 sm:p-6 text-[#5B3A21] shadow-sm space-y-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#E38A1C]/20 text-[#E38A1C] border border-[#E38A1C]/40 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-lg sm:text-xl text-[#8A5A34] leading-tight">
                {t('unclearTitle', '⚠️ Image Not Clear')}
              </h3>
              <p className="text-xs sm:text-sm text-[#5B3A21] mt-1 leading-relaxed">
                {t(
                  'unclearDesc',
                  'AI cannot confidently identify the issue. Please bring the leaf closer in good daylight and take another photo.'
                )}
              </p>
            </div>
          </div>

          {/* Low Confidence Meter (<60%) */}
          <ConfidenceMeter confidence={result.confidence} />

          {/* Photography Tips Card */}
          <div className="p-4 rounded-2xl bg-white/90 border border-[#EFCE93] space-y-2 text-xs">
            <div className="font-bold text-[#8A5A34] flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-[#E38A1C]" />
              <span>{t('unclearTipsTitle', 'Tips for a clear scan:')}</span>
            </div>
            <ul className="text-[#4C5548] space-y-1.5 pl-1">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2B6E4F]" />
                <span>{t('unclearTip1', 'Take photo in bright daylight or sunlight')}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2B6E4F]" />
                <span>{t('unclearTip2', 'Hold camera 3-4 inches close to the leaf')}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2B6E4F]" />
                <span>{t('unclearTip3', 'Hold your phone steady to prevent blur')}</span>
              </li>
            </ul>
          </div>

          {/* Fallback Action Buttons */}
          <div className="space-y-2.5 pt-1">
            {/* Take Another Photo Button */}
            <button
              type="button"
              onClick={() => {
                speechService.playChime('click');
                onRetake();
              }}
              className="w-full min-h-[56px] p-3.5 rounded-2xl bg-[#2B6E4F] hover:bg-[#173C2D] text-white font-extrabold text-sm flex items-center justify-center gap-2.5 shadow-md active:scale-95 transition-all"
            >
              <Camera className="w-5 h-5" />
              <span>{t('unclearActionRetake', '📷 Take Another Photo')}</span>
            </button>

            {/* Contact Expert Button */}
            <button
              type="button"
              onClick={() => {
                speechService.playChime('click');
                onOpenExpertModal();
              }}
              className="w-full min-h-[52px] p-3 rounded-2xl bg-white hover:bg-[#F3ECDA] border border-[#EFCE93] text-[#8A5A34] font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <PhoneCall className="w-4 h-4 text-[#E38A1C]" />
              <span>{t('unclearActionHelp', '👨‍🌾 Contact Agri Expert (KVK)')}</span>
            </button>
          </div>
        </div>
      ) : (
        /* ✅ CONFIDENT RESULT STATE (>= 60% Confidence) */
        <div className="space-y-4">
          {/* Main Diagnosis Card */}
          <div className="bg-white border border-[#E1D9C4] rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#2B6E4F] uppercase tracking-wider">
                  {result.issueType === 'disease'
                    ? t('issueTypeDisease', 'Disease Attack')
                    : result.issueType === 'pest'
                      ? t('issueTypePest', 'Pest Infestation')
                      : t('issueTypeHealthy', 'Healthy Crop')}
                </span>
                <span className="text-xs text-[#4C5548] font-mono font-bold bg-[#F3ECDA] px-2 py-0.5 rounded-full">
                  {t('aiDiagnosisBadge', 'AI DIAGNOSIS')}
                </span>
              </div>

              <h3 className="font-heading text-2xl font-extrabold text-[#173C2D] mt-1.5 leading-tight tracking-tight">
                {t(result.labelKey, 'Rice Blast')}
              </h3>

              <p className="text-xs sm:text-sm text-[#4C5548] mt-2 leading-relaxed font-medium">
                {t(result.summaryKey, 'Leaf lesions identified.')}
              </p>
            </div>

            {/* Confidence Bar Component */}
            <ConfidenceMeter confidence={result.confidence} />
          </div>

          {/* Action Cards */}
          <div className="space-y-3">
            {/* Card 1: What Should I Do? (Routes to Treatment) */}
            <button
              type="button"
              onClick={() => {
                speechService.playChime('click');
                onNavigate('treatment');
              }}
              className="w-full min-h-[76px] p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#2B6E4F] to-[#173C2D] hover:from-[#1F533E] hover:to-[#173C2D] text-white font-bold flex items-center justify-between gap-3 shadow-md active:scale-[0.98] transition-all border border-[#52B788]/40"
            >
              <div className="flex items-center gap-3.5 text-left">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                  <span className="text-2xl">🌱</span>
                </div>
                <div>
                  <div className="font-heading text-base sm:text-lg font-bold tracking-tight text-white">
                    {t('actionTreatmentTitle', '🌱 What should I do?')}
                  </div>
                  <div className="text-xs text-[#DCEDE1] font-medium mt-0.5">
                    {t('actionTreatmentDesc', '3 clear actionable steps to cure crop')}
                  </div>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <ChevronRight className="w-5 h-5 text-white" />
              </div>
            </button>

            {/* Card 2: Expert Help (Opens KVK / WhatsApp Modal) */}
            <button
              type="button"
              onClick={() => {
                speechService.playChime('click');
                onOpenExpertModal();
              }}
              className="w-full min-h-[68px] p-4 sm:p-5 rounded-3xl bg-white hover:bg-[#F3ECDA] text-[#20261F] font-bold flex items-center justify-between gap-3 shadow-sm active:scale-[0.98] transition-all border border-[#E1D9C4]"
            >
              <div className="flex items-center gap-3.5 text-left">
                <div className="w-12 h-12 rounded-2xl bg-[#FBEFDC] text-[#E38A1C] border border-[#EFCE93] flex items-center justify-center flex-shrink-0">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-heading text-sm sm:text-base font-bold text-[#173C2D]">
                    {t('actionExpertTitle', '👨‍🌾 Expert Help')}
                  </div>
                  <div className="text-xs text-[#4C5548] font-medium mt-0.5">
                    {t('actionExpertDesc', 'Call KVK Helpline / WhatsApp Krishi Mitra')}
                  </div>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#F3ECDA] flex items-center justify-center flex-shrink-0 text-[#4C5548]">
                <ChevronRight className="w-5 h-5" />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Scan Another Crop Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => {
            speechService.playChime('click');
            onRetake();
          }}
          className="touch-target w-full min-h-[50px] p-3 rounded-2xl bg-[#F3ECDA] hover:bg-[#E1D9C4] border border-[#E1D9C4] text-[#173C2D] font-bold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
        >
          <RotateCcw className="w-4 h-4 text-[#2B6E4F]" />
          <span>{t('scanAnother', '🔄 Scan Another Crop')}</span>
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Sparkles, AlertCircle } from 'lucide-react';

interface ConfidenceMeterProps {
  confidence: number; // 0 - 100
  showLabel?: boolean;
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({
  confidence,
  showLabel = true,
}) => {
  const { t } = useLanguage();

  const isHigh = confidence >= 80;
  const isMed = confidence >= 60 && confidence < 80;
  const isLow = confidence < 60;

  const barColor = isHigh
    ? 'bg-[#2B6E4F]'
    : isMed
    ? 'bg-[#E38A1C]'
    : 'bg-[#C0431F]';

  const textColor = isHigh
    ? 'text-[#173C2D]'
    : isMed
    ? 'text-[#E38A1C]'
    : 'text-[#C0431F]';

  return (
    <div className="w-full bg-[#FBF7ED] rounded-2xl p-3.5 border border-[#E1D9C4] shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#4C5548]">
          {isLow ? (
            <AlertCircle className="w-4 h-4 text-[#C0431F]" />
          ) : (
            <Sparkles className="w-4 h-4 text-[#2B6E4F]" />
          )}
          <span>{t('confidenceLabel', 'Confidence:')}</span>
        </div>
        <div className={`text-base font-extrabold tracking-tight font-mono ${textColor}`}>
          {confidence}%
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full h-3 bg-[#E1D9C4] rounded-full overflow-hidden p-0.5">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
          style={{ width: `${Math.max(5, Math.min(100, confidence))}%` }}
        />
      </div>

      {showLabel && (
        <div className="flex justify-between items-center text-[10px] font-semibold text-[#4C5548] mt-1.5 px-1">
          <span>0%</span>
          <span className="text-[#8A5A34] font-bold">60% (সীমা / Limit)</span>
          <span>100%</span>
        </div>
      )}
    </div>
  );
};

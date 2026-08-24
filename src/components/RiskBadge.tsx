import React from 'react';
import type { RiskLevel } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { AlertTriangle, CheckCircle, ShieldAlert, AlertCircle } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md', showIcon = true }) => {
  const { t } = useLanguage();

  const config = {
    high: {
      bg: 'bg-[#FBE1DC] border-[#EFCE93] text-[#C0431F]',
      label: t('riskHigh', 'High Risk'),
      icon: ShieldAlert,
      dotColor: 'bg-[#C0431F]',
    },
    medium: {
      bg: 'bg-[#FBEFDC] border-[#EFCE93] text-[#E38A1C]',
      label: t('riskMedium', 'Medium Risk'),
      icon: AlertTriangle,
      dotColor: 'bg-[#E38A1C]',
    },
    low: {
      bg: 'bg-[#FEF9EE] border-[#E1D9C4] text-[#8A5A34]',
      label: t('riskLow', 'Low Risk'),
      icon: AlertCircle,
      dotColor: 'bg-[#8A5A34]',
    },
    healthy: {
      bg: 'bg-[#E4F3EA] border-[#B7E4C7] text-[#173C2D]',
      label: t('riskHealthy', 'Healthy Crop'),
      icon: CheckCircle,
      dotColor: 'bg-[#2B6E4F]',
    },
    unknown: {
      bg: 'bg-[#F3ECDA] border-[#E1D9C4] text-[#4C5548]',
      label: t('issueTypeUnknown', 'Unknown'),
      icon: AlertCircle,
      dotColor: 'bg-[#4C5548]',
    },
  }[level] || {
    bg: 'bg-[#F3ECDA] border-[#E1D9C4] text-[#4C5548]',
    label: t('issueTypeUnknown', 'Unknown'),
    icon: AlertCircle,
    dotColor: 'bg-[#4C5548]',
  };

  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1 gap-1.5 font-bold',
    md: 'text-xs sm:text-sm px-3.5 py-1.5 gap-2 font-bold',
    lg: 'text-sm sm:text-base px-4 py-2 gap-2.5 font-extrabold shadow-sm',
  }[size];

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${sizeClasses} transition-all duration-200 shadow-sm`}
    >
      <span className={`w-2 h-2 rounded-full ${config.dotColor}`} />
      {showIcon && <Icon className={`${iconSizes} flex-shrink-0`} />}
      <span>{config.label}</span>
    </span>
  );
};

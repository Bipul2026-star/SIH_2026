import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { speechService } from '../services/speechService';
import { useLanguage } from '../i18n/LanguageContext';

interface VoiceButtonProps {
  text: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost' | 'pill';
  className?: string;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  text,
  label,
  size = 'md',
  variant = 'pill',
  className = '',
}) => {
  const { language } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const unsubscribe = speechService.addListener((speaking) => {
      setIsSpeaking(speaking);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    speechService.playChime('click');
    if (isSpeaking) {
      speechService.stop();
    } else {
      speechService.speak(text, language);
    }
  };

  const sizeClasses = {
    sm: 'min-h-[44px] min-w-[44px] text-xs px-2.5 py-1.5 gap-1.5',
    md: 'min-h-[48px] min-w-[48px] text-sm px-3.5 py-2 gap-2',
    lg: 'min-h-[52px] min-w-[52px] text-base px-4 py-2.5 gap-2.5 font-bold',
  }[size];

  const variantClasses = {
    pill: 'bg-[#E4F3EA] hover:bg-[#B7E4C7] text-[#173C2D] border border-[#52B788]/40 rounded-full shadow-sm',
    primary: 'bg-[#2B6E4F] hover:bg-[#173C2D] text-white rounded-2xl shadow-md active:scale-95',
    secondary: 'bg-[#F3ECDA] hover:bg-[#E1D9C4] text-[#173C2D] rounded-2xl border border-[#E1D9C4]',
    ghost: 'text-[#4C5548] hover:text-[#2B6E4F] rounded-full hover:bg-[#F3ECDA]',
  }[variant];

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label || 'Listen aloud'}
      className={`touch-target transition-all duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#2B6E4F] flex items-center justify-center font-medium ${sizeClasses} ${variantClasses} ${className}`}
    >
      {isSpeaking ? (
        <span className="flex items-center gap-1.5 text-[#173C2D]">
          <VolumeX className="w-5 h-5 text-[#2B6E4F]" />
          <span className="flex gap-0.5 items-end h-4">
            <span className="w-1 bg-[#2B6E4F] h-2 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1 bg-[#2B6E4F] h-4 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1 bg-[#2B6E4F] h-3 animate-bounce" style={{ animationDelay: '300ms' }} />
          </span>
          {label && <span>{label}</span>}
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <Volume2 className="w-5 h-5 flex-shrink-0 text-[#2B6E4F]" />
          {label && <span>{label}</span>}
        </span>
      )}
    </button>
  );
};

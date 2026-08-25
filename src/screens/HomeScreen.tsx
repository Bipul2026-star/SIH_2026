import React, { useRef, useState } from 'react';
import {
  Camera,
  Upload,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import type { ScreenType, QuickTestPreset, AgriFeatureType } from '../types';
import { QUICK_TEST_PRESETS } from '../services/diagnosisService';
import { speechService } from '../services/speechService';
import { AgriFeatureModal } from '../components/AgriFeatureModal';

interface HomeScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onSelectPreset: (preset: QuickTestPreset) => void;
  onImageUploaded: (imageDataUrl: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  onSelectPreset,
  onImageUploaded,
}) => {
  const { t, language } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeFeature, setActiveFeature] = useState<AgriFeatureType>(null);

  const handleStartCamera = () => {
    speechService.playChime('click');
    onNavigate('camera');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      speechService.playChime('click');
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onImageUploaded(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVoiceGreeting = () => {
    speechService.speak(t('voiceHomeGreeting'), language);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-24 sm:pb-16 animate-in fade-in duration-200">
      {/* Hidden File Input for Gallery Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#173C2D] tracking-tight flex items-center gap-2">
            <span>{t('greeting', 'Hello, Farmer 👋')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#4C5548] mt-0.5">
            {t('greetingSub', 'Protect your crops and get instant remedy steps.')}
          </p>
        </div>

        <button
          type="button"
          onClick={handleVoiceGreeting}
          aria-label="Listen Greeting"
          className="touch-target self-start sm:self-auto px-4 py-2 rounded-2xl bg-[#F3ECDA] hover:bg-[#E1D9C4] border border-[#E1D9C4] text-[#173C2D] font-bold text-xs flex items-center gap-2 shadow-sm active:scale-95 transition-transform"
        >
          <Volume2 className="w-4 h-4 text-[#2B6E4F]" />
          <span>{t('voiceToggle', 'Listen Guide')}</span>
        </button>
      </div>

      {/* 1. MEGA DOMINANT SCAN CTA */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#2B6E4F] via-[#1F533E] to-[#173C2D] text-white p-6 sm:p-8 shadow-agri overflow-hidden border border-[#52B788]/30">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-[#8EE0B6] text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Crop Doctor · Instant Diagnosis</span>
            </div>
            <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              {t('cameraCtaTitle', '📷 Take a Crop Photo')}
            </h3>
            <p className="text-xs sm:text-sm text-[#DCEDE1] leading-relaxed">
              {t(
                'cameraCtaDesc',
                'Point your camera at the leaf or affected part — you\'ll get a diagnosis and remedy in under a minute.'
              )}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="button"
              onClick={handleStartCamera}
              className="touch-target min-h-[56px] px-7 py-3.5 rounded-2xl bg-[#FBF7ED] hover:bg-white text-[#173C2D] font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-md active:scale-95 transition-transform"
            >
              <Camera className="w-5 h-5 text-[#2B6E4F]" />
              <span>{t('scanNowBtn', '📸 Scan Now')}</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="touch-target min-h-[56px] px-5 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-white/20 active:scale-95 transition-all"
            >
              <Upload className="w-4 h-4 text-[#F5B764]" />
              <span>{t('uploadBtn', 'Upload Photo')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. REGIONAL ALERT BANNER (Warm Amber-on-Wheat) */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          speechService.playChime('alert');
          onNavigate('alerts');
        }}
        onKeyDown={(e) => e.key === 'Enter' && onNavigate('alerts')}
        className="w-full p-4 sm:p-5 rounded-2xl bg-[#FBEFDC] border border-[#EFCE93] text-[#5B3A21] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:border-[#E38A1C] transition-all cursor-pointer active:scale-[0.99]"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#E38A1C]/20 border border-[#E38A1C]/30 text-[#E38A1C] flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#8A5A34] uppercase tracking-wider flex items-center gap-2">
              <span>{t('regionalAlertBannerTitle', '⚠️ Disease Alert')}</span>
              <span className="px-2 py-0.2 bg-[#E38A1C] text-white text-[10px] rounded-full font-mono font-bold">
                HIGH RISK
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#5B3A21] font-semibold mt-0.5">
              {t('regionalAlertBannerDesc', 'High risk — leaf blight spreading in nearby farms this week.')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 font-bold text-xs text-[#2B6E4F] self-end sm:self-center flex-shrink-0">
          <span>{t('viewAlertsBtn', 'View advisory →')}</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      {/* 3. 6-FEATURE AGRI SERVICES GRID (4 cols Desktop, 2 cols Tablet/Mobile) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-lg text-[#173C2D]">
            Agri Services & Farm Advisory
          </h3>
          <span className="text-xs text-[#4C5548]">Live Satellite & Weather Tools</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Card 1: Farm Health */}
          <div
            onClick={() => setActiveFeature('health')}
            className="agri-card p-5 flex flex-col gap-2.5 cursor-pointer"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#E4F3EA] text-[#2B6E4F] flex items-center justify-center text-xl">
              🩺
            </div>
            <h4 className="font-heading font-bold text-sm sm:text-base text-[#173C2D] m-0">
              {t('featureFarmHealthTitle', 'Farm Health')}
            </h4>
            <p className="text-xs text-[#4C5548] m-0 leading-relaxed">
              {t('featureFarmHealthDesc', 'Real-time insights from satellite data.')}
            </p>
          </div>

          {/* Card 2: Irrigation Advisory */}
          <div
            onClick={() => setActiveFeature('irrigation')}
            className="agri-card p-5 flex flex-col gap-2.5 cursor-pointer"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#E4EEFB] text-[#1D4ED8] flex items-center justify-center text-xl">
              💧
            </div>
            <h4 className="font-heading font-bold text-sm sm:text-base text-[#173C2D] m-0">
              {t('featureIrrigationTitle', 'Irrigation Advisory')}
            </h4>
            <p className="text-xs text-[#4C5548] m-0 leading-relaxed">
              {t('featureIrrigationDesc', 'Right time and quantity for watering.')}
            </p>
          </div>

          {/* Card 3: Weather Forecast */}
          <div
            onClick={() => setActiveFeature('weather')}
            className="agri-card p-5 flex flex-col gap-2.5 cursor-pointer"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#FBEFDC] text-[#E38A1C] flex items-center justify-center text-xl">
              ⛅
            </div>
            <h4 className="font-heading font-bold text-sm sm:text-base text-[#173C2D] m-0">
              {t('featureWeatherTitle', 'Weather Forecast')}
            </h4>
            <p className="text-xs text-[#4C5548] m-0 leading-relaxed">
              {t('featureWeatherDesc', 'Local updates for better planning.')}
            </p>
          </div>

          {/* Card 4: Farm Boundary */}
          <div
            onClick={() => setActiveFeature('boundary')}
            className="agri-card p-5 flex flex-col gap-2.5 cursor-pointer"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#F1E6DA] text-[#8A5A34] flex items-center justify-center text-xl">
              📍
            </div>
            <h4 className="font-heading font-bold text-sm sm:text-base text-[#173C2D] m-0">
              {t('featureBoundaryTitle', 'Farm Boundary')}
            </h4>
            <p className="text-xs text-[#4C5548] m-0 leading-relaxed">
              {t('featureBoundaryDesc', 'Mark and save your plot boundary.')}
            </p>
          </div>

          {/* Card 5: Soil Report (PDF) */}
          <div
            onClick={() => setActiveFeature('soil')}
            className="agri-card p-5 flex flex-col gap-2.5 cursor-pointer"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#FCE4E1] text-[#C0431F] flex items-center justify-center text-xl">
              📄
            </div>
            <h4 className="font-heading font-bold text-sm sm:text-base text-[#173C2D] m-0">
              {t('featureSoilTitle', 'Soil Report (PDF)')}
            </h4>
            <p className="text-xs text-[#4C5548] m-0 leading-relaxed">
              {t('featureSoilDesc', 'Download N-P-K nutrient details.')}
            </p>
          </div>

          {/* Card 6: Pest Forewarning */}
          <div
            onClick={() => setActiveFeature('pest')}
            className="agri-card p-5 flex flex-col gap-2.5 cursor-pointer"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#EAE4FB] text-[#7C3AED] flex items-center justify-center text-xl">
              🐛
            </div>
            <h4 className="font-heading font-bold text-sm sm:text-base text-[#173C2D] m-0">
              {t('featurePestTitle', 'Pest Forewarning')}
            </h4>
            <p className="text-xs text-[#4C5548] m-0 leading-relaxed">
              {t('featurePestDesc', 'Early alerts before damage spreads.')}
            </p>
          </div>

          {/* Card 7: Scan History Shortcut */}
          <div
            onClick={() => {
              speechService.playChime('click');
              onNavigate('history');
            }}
            className="agri-card p-5 flex flex-col gap-2.5 cursor-pointer"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#E4F3EA] text-[#2B6E4F] flex items-center justify-center text-xl">
              📋
            </div>
            <h4 className="font-heading font-bold text-sm sm:text-base text-[#173C2D] m-0">
              {t('historyBtn', 'Scan History')}
            </h4>
            <p className="text-xs text-[#4C5548] m-0 leading-relaxed">
              View your previous diagnoses & reports.
            </p>
          </div>

          {/* Card 8: Agri Help Center Shortcut */}
          <div
            onClick={() => {
              speechService.playChime('click');
              onNavigate('help');
            }}
            className="agri-card p-5 flex flex-col gap-2.5 cursor-pointer"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#FBEFDC] text-[#E38A1C] flex items-center justify-center text-xl">
              👨‍🌾
            </div>
            <h4 className="font-heading font-bold text-sm sm:text-base text-[#173C2D] m-0">
              {t('helpTitle', 'Farmer Support')}
            </h4>
            <p className="text-xs text-[#4C5548] m-0 leading-relaxed">
              Call KVK Helpline & WhatsApp expert.
            </p>
          </div>
        </div>
      </div>

      {/* 4. DEMO QUICK-TEST PRESET BAR (Instant Evaluation for Reviewers/Farmers) */}
      <div className="p-5 rounded-3xl bg-white border border-[#E1D9C4] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-[#2B6E4F] flex items-center gap-1.5 uppercase tracking-wide">
            <Sparkles className="w-4 h-4 text-[#2B6E4F]" />
            <span>{t('quickTestTitle', 'Quick test sample crops:')}</span>
          </div>
          <span className="text-[10px] text-[#4C5548] font-mono font-bold bg-[#F3ECDA] px-2 py-0.5 rounded-full">
            1-TAP DEMO
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {QUICK_TEST_PRESETS.map((preset) => {
            const isUnclear = preset.expectedConfidence < 60;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  speechService.playChime('click');
                  onSelectPreset(preset);
                }}
                className={`touch-target p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all active:scale-95 ${
                  isUnclear
                    ? 'bg-[#FBE1DC]/50 border-[#EFCE93] hover:bg-[#FBE1DC] text-[#20261F]'
                    : 'bg-[#FBF7ED] border-[#E1D9C4] hover:bg-[#F3ECDA] text-[#20261F]'
                }`}
              >
                <span className="text-2xl flex-shrink-0">{preset.icon}</span>
                <div className="overflow-hidden">
                  <div className="text-xs font-bold truncate leading-tight text-[#173C2D]">
                    {t(preset.titleKey, preset.diseaseKey)}
                  </div>
                  <div className="text-[10px] text-[#4C5548] truncate mt-0.5 flex items-center gap-1 font-mono">
                    <span>{preset.expectedConfidence}% Conf</span>
                    {isUnclear && (
                      <span className="text-[#C0431F] font-bold">(&lt;60%)</span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feature Details Modal */}
      <AgriFeatureModal
        featureType={activeFeature}
        onClose={() => setActiveFeature(null)}
      />
    </div>
  );
};

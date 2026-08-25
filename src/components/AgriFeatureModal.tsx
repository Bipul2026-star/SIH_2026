import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import type { AgriFeatureType } from '../types';
import {
  X,
  Activity,
  Droplets,
  CloudSun,
  MapPin,
  FileText,
  Bug,
  Download,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  Wind,
  Sparkles,
} from 'lucide-react';
import { speechService } from '../services/speechService';

interface AgriFeatureModalProps {
  featureType: AgriFeatureType;
  onClose: () => void;
}

export const AgriFeatureModal: React.FC<AgriFeatureModalProps> = ({ featureType, onClose }) => {
  const { t, language } = useLanguage();
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!featureType) return null;

  const handleSpeech = (text: string) => {
    speechService.playChime('info');
    speechService.speak(text, language);
  };

  const handleDownloadPDF = () => {
    speechService.playChime('success');
    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4">
      <div className="w-full max-w-lg bg-[#ffffff] border border-[#E1D9C4] rounded-3xl p-5 sm:p-6 text-[#20261F] shadow-2xl animate-in slide-in-from-bottom-6 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E1D9C4]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#F3ECDA] border border-[#E1D9C4] flex items-center justify-center text-xl text-[#2B6E4F]">
              {featureType === 'health' && <Activity className="w-6 h-6 text-[#2B6E4F]" />}
              {featureType === 'irrigation' && <Droplets className="w-6 h-6 text-[#2B6E4F]" />}
              {featureType === 'weather' && <CloudSun className="w-6 h-6 text-[#E38A1C]" />}
              {featureType === 'boundary' && <MapPin className="w-6 h-6 text-[#8A5A34]" />}
              {featureType === 'soil' && <FileText className="w-6 h-6 text-[#2B6E4F]" />}
              {featureType === 'pest' && <Bug className="w-6 h-6 text-[#E38A1C]" />}
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-[#173C2D]">
                {featureType === 'health' && t('featureFarmHealthTitle', 'Farm Health')}
                {featureType === 'irrigation' && t('featureIrrigationTitle', 'Irrigation Advisory')}
                {featureType === 'weather' && t('featureWeatherTitle', 'Weather Forecast')}
                {featureType === 'boundary' && t('featureBoundaryTitle', 'Farm Boundary')}
                {featureType === 'soil' && t('featureSoilTitle', 'Soil Report (PDF)')}
                {featureType === 'pest' && t('featurePestTitle', 'Pest Forewarning')}
              </h3>
              <p className="text-xs text-[#4C5548]">
                {featureType === 'health' && 'Satellite NDVI & Vegetation Monitoring'}
                {featureType === 'irrigation' && 'Soil Moisture & Water Schedule'}
                {featureType === 'weather' && '5-Day Hyperlocal Agro-Met Forecast'}
                {featureType === 'boundary' && 'Plot Plotting & Area Calculation'}
                {featureType === 'soil' && 'N-P-K Nutrient Card & Recommendations'}
                {featureType === 'pest' && 'Early Warning Climate Disease Radar'}
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

        {/* Dynamic Modal Content */}
        <div className="mt-4 space-y-4">
          {/* 1. FARM HEALTH */}
          {featureType === 'health' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-[#FBF7ED] border border-[#E1D9C4]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase text-[#2B6E4F]">Vegetative Vigor Score</span>
                  <span className="text-sm font-extrabold text-[#173C2D] bg-[#52B788]/20 text-[#173C2D] px-2.5 py-0.5 rounded-full">
                    0.78 (Good)
                  </span>
                </div>
                <div className="w-full bg-[#E1D9C4] h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#2B6E4F] h-full rounded-full" style={{ width: '78%' }} />
                </div>
                <p className="text-xs text-[#4C5548] mt-2">
                  Sentinel-2 imagery shows healthy crop canopy in your plot with minimal moisture stress.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-2xl bg-white border border-[#E1D9C4]">
                  <div className="text-[11px] text-[#4C5548]">Canopy Greenness</div>
                  <div className="font-heading font-extrabold text-base text-[#173C2D] mt-0.5">86% Normal</div>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-[#E1D9C4]">
                  <div className="text-[11px] text-[#4C5548]">Moisture Stress</div>
                  <div className="font-heading font-extrabold text-base text-[#2B6E4F] mt-0.5">Low (Normal)</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#E4F3EA] border border-[#52B788]/40 text-xs text-[#173C2D] flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#2B6E4F] flex-shrink-0 mt-0.5" />
                <div>
                  <b>Advisory:</b> Nitrogen absorption is optimal. Maintain current irrigation cycle for the next 4 days.
                </div>
              </div>
            </div>
          )}

          {/* 2. IRRIGATION ADVISORY */}
          {featureType === 'irrigation' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-[#E4EEFB] border border-[#BCD4F5]">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-[#1D4ED8] uppercase">Current Soil Moisture</div>
                  <span className="text-base font-extrabold text-[#1E3A8A]">64% (Adequate)</span>
                </div>
                <p className="text-xs text-[#1E40AF] mt-1.5">
                  Top 15cm root zone has sufficient moisture. Next watering is recommended in 36 hours.
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-[#173C2D] uppercase tracking-wide">3-Day Irrigation Plan</div>
                <div className="p-3 rounded-2xl bg-[#FBF7ED] border border-[#E1D9C4] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#173C2D]">Tomorrow (6:00 AM)</span>
                    <p className="text-[11px] text-[#4C5548]">Light watering: 20mm standing depth</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#2B6E4F] text-white font-bold text-[10px]">
                    Recommended
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-[#FBF7ED] border border-[#E1D9C4] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#173C2D]">Day After Tomorrow</span>
                    <p className="text-[11px] text-[#4C5548]">No watering needed (rain anticipated)</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#F3ECDA] text-[#4C5548] font-bold text-[10px]">
                    Pause
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 3. WEATHER FORECAST */}
          {featureType === 'weather' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-[#FBEFDC] border border-[#EFCE93] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#8A5A34] uppercase">Today's Spray Window</div>
                  <div className="text-sm font-extrabold text-[#5B3A21] mt-0.5">3:30 PM – 5:45 PM (Ideal)</div>
                </div>
                <div className="flex items-center gap-1 text-xs text-[#8A5A34] font-semibold">
                  <Wind className="w-4 h-4" />
                  <span>Wind: 6 km/h</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-3 rounded-2xl bg-[#FBF7ED] border border-[#E1D9C4]">
                  <div className="text-[10px] text-[#4C5548]">Today</div>
                  <div className="text-xl my-1">☀️</div>
                  <div className="font-bold text-[#173C2D]">28°C / 21°C</div>
                  <div className="text-[10px] text-[#2B6E4F]">0% Rain</div>
                </div>
                <div className="p-3 rounded-2xl bg-[#FBF7ED] border border-[#E1D9C4]">
                  <div className="text-[10px] text-[#4C5548]">Tomorrow</div>
                  <div className="text-xl my-1">⛅</div>
                  <div className="font-bold text-[#173C2D]">29°C / 22°C</div>
                  <div className="text-[10px] text-[#2B6E4F]">10% Rain</div>
                </div>
                <div className="p-3 rounded-2xl bg-[#FBF7ED] border border-[#E1D9C4]">
                  <div className="text-[10px] text-[#4C5548]">Thursday</div>
                  <div className="text-xl my-1">🌦️</div>
                  <div className="font-bold text-[#173C2D]">26°C / 20°C</div>
                  <div className="text-[10px] text-[#E38A1C]">45% Rain</div>
                </div>
              </div>
            </div>
          )}

          {/* 4. FARM BOUNDARY */}
          {featureType === 'boundary' && (
            <div className="space-y-3">
              <div className="relative h-44 rounded-2xl bg-[#F3ECDA] border border-[#E1D9C4] overflow-hidden flex items-center justify-center">
                {/* Simulated Polygon Drawing */}
                <svg className="w-full h-full" viewBox="0 0 300 160">
                  <polygon
                    points="60,30 240,40 210,130 80,120"
                    fill="rgba(82, 183, 136, 0.25)"
                    stroke="#2B6E4F"
                    strokeWidth="3"
                    strokeDasharray="4 2"
                  />
                  <circle cx="60" cy="30" r="5" fill="#173C2D" />
                  <circle cx="240" cy="40" r="5" fill="#173C2D" />
                  <circle cx="210" cy="130" r="5" fill="#173C2D" />
                  <circle cx="80" cy="120" r="5" fill="#173C2D" />
                  <text x="140" y="85" fill="#173C2D" fontSize="11" fontWeight="bold" textAnchor="middle">
                    Plot #14 · 2.4 Bigha
                  </text>
                </svg>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 rounded-2xl bg-[#FBF7ED] border border-[#E1D9C4]">
                  <div className="text-[10px] text-[#4C5548]">Total Plot Area</div>
                  <div className="font-bold text-sm text-[#173C2D] mt-0.5">2.4 Bigha (0.79 Acre)</div>
                </div>
                <div className="p-3 rounded-2xl bg-[#FBF7ED] border border-[#E1D9C4]">
                  <div className="text-[10px] text-[#4C5548]">Geo Location</div>
                  <div className="font-bold text-sm text-[#173C2D] mt-0.5">23.23° N, 87.86° E</div>
                </div>
              </div>
            </div>
          )}

          {/* 5. SOIL HEALTH REPORT PDF */}
          {featureType === 'soil' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-[#FBF7ED] border border-[#E1D9C4] space-y-2 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-[#E1D9C4]">
                  <span className="font-semibold text-[#4C5548]">Nitrogen (N)</span>
                  <span className="font-bold text-[#173C2D]">240 kg/ha (Medium)</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#E1D9C4]">
                  <span className="font-semibold text-[#4C5548]">Phosphorus (P)</span>
                  <span className="font-bold text-[#2B6E4F]">22 kg/ha (Optimum)</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#E1D9C4]">
                  <span className="font-semibold text-[#4C5548]">Potassium (K)</span>
                  <span className="font-bold text-[#173C2D]">290 kg/ha (High)</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#E1D9C4]">
                  <span className="font-semibold text-[#4C5548]">Soil pH</span>
                  <span className="font-bold text-[#2B6E4F]">6.5 (Ideal Neutral)</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="font-semibold text-[#4C5548]">Organic Carbon</span>
                  <span className="font-bold text-[#173C2D]">0.68% (Moderate)</span>
                </div>
              </div>

              {downloadSuccess ? (
                <div className="p-3 rounded-2xl bg-[#E4F3EA] border border-[#52B788] text-xs text-[#173C2D] font-bold flex items-center justify-center gap-2 animate-in fade-in duration-200">
                  <CheckCircle2 className="w-4 h-4 text-[#2B6E4F]" />
                  <span>Soil_Health_Card_Burdwan_Circle.pdf downloaded!</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  className="w-full py-3.5 rounded-2xl bg-[#2B6E4F] hover:bg-[#173C2D] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Official Soil Card (PDF)</span>
                </button>
              )}
            </div>
          )}

          {/* 6. PEST FOREWARNING */}
          {featureType === 'pest' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-[#FBEFDC] border border-[#EFCE93] text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#E38A1C] uppercase flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Active 14-Day Forewarning</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#E38A1C] text-white font-bold text-[10px]">
                    Alert Level 2
                  </span>
                </div>
                <p className="text-[#5B3A21] leading-relaxed">
                  High night humidity (85%+) and warm days favour Leaf Blight and Yellow Stem Borer across rice plots in Burdwan & Nadia.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="font-bold text-[#173C2D]">Recommended Preventive Actions:</div>
                <div className="p-3 rounded-2xl bg-[#FBF7ED] border border-[#E1D9C4] flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#2B6E4F] text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                    1
                  </span>
                  <span className="text-[#4C5548]">Apply prophylactic Neem seed kernel extract (5%) on leaf whorls.</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#FBF7ED] border border-[#E1D9C4] flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#2B6E4F] text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                    2
                  </span>
                  <span className="text-[#4C5548]">Install light and pheromone traps at field borders to catch emerging moths.</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Audio Recitation & Close Button */}
        <div className="mt-5 pt-3 border-t border-[#E1D9C4] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              const speakText =
                featureType === 'health'
                  ? 'Farm Health: Satellite vigor score is 78 percent good. Nitrogen is optimal.'
                  : featureType === 'irrigation'
                  ? 'Irrigation Advisory: Soil moisture is 64 percent adequate. Next watering recommended tomorrow morning.'
                  : featureType === 'weather'
                  ? 'Weather forecast: 28 degrees celsius. Ideal spray window between 3:30 PM to 5:45 PM.'
                  : featureType === 'boundary'
                  ? 'Farm boundary: Total area is 2.4 Bigha in Burdwan circle.'
                  : featureType === 'soil'
                  ? 'Soil Health Card: Nitrogen medium, Phosphorus optimum, Potassium high, pH is 6.5 ideal.'
                  : 'Pest forewarning: High humidity increases Leaf Blight risk. Apply prophylactic neem extract.';
              handleSpeech(speakText);
            }}
            className="touch-target px-3.5 py-2 rounded-2xl bg-[#F3ECDA] hover:bg-[#E1D9C4] text-[#173C2D] text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Volume2 className="w-4 h-4 text-[#2B6E4F]" />
            <span>{t('listenDiagnosis', 'Listen')}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-[#F3ECDA] hover:bg-[#E1D9C4] text-[#173C2D] font-bold text-xs transition-colors text-center"
          >
            {t('closeModal', 'Close')}
          </button>
        </div>
      </div>
    </div>
  );
};

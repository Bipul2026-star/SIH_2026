import React, { useState, useEffect } from 'react';
import { Search, History, Trash2, Calendar, ChevronRight, Camera } from 'lucide-react';
import type { DiagnosisResult, ScanHistoryItem, ScreenType } from '../types';
import { storageService } from '../services/storageService';
import { useLanguage } from '../i18n/LanguageContext';
import { RiskBadge } from '../components/RiskBadge';
import { speechService } from '../services/speechService';

interface HistoryScreenProps {
  onSelectHistoryItem: (result: DiagnosisResult) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  onSelectHistoryItem,
  onNavigate,
}) => {
  const { t } = useLanguage();
  const [historyItems, setHistoryItems] = useState<ScanHistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setHistoryItems(storageService.getHistory());
  }, []);

  const handleClear = () => {
    speechService.playChime('alert');
    if (window.confirm('সব ইতিহাস মুছতে চান? / Clear history?')) {
      storageService.clearHistory();
      setHistoryItems([]);
    }
  };

  const filteredItems = historyItems.filter((item) => {
    const crop = t(item.cropNameKey).toLowerCase();
    const label = t(item.labelKey).toLowerCase();
    const q = searchQuery.toLowerCase();
    return crop.includes(q) || label.includes(q);
  });

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 pb-24 sm:pb-16 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#E4F3EA] border border-[#B7E4C7] flex items-center justify-center text-[#2B6E4F] shadow-sm">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading text-lg sm:text-xl font-extrabold text-[#173C2D]">
              {t('historyTitle', 'Past Crop Scans')}
            </h2>
            <p className="text-xs text-[#4C5548]">
              {historyItems.length} টি সংরক্ষিত পরীক্ষা (Saved Scans)
            </p>
          </div>
        </div>

        {historyItems.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="touch-target w-10 h-10 rounded-2xl bg-[#F3ECDA] hover:bg-[#FBE1DC] border border-[#E1D9C4] text-[#4C5548] hover:text-[#C0431F] flex items-center justify-center transition-colors shadow-sm"
            title={t('clearHistory', 'Clear History')}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#4C5548] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('historySearchPlaceholder', 'Search crop or disease...')}
          className="w-full h-12 pl-10 pr-4 rounded-2xl bg-white border border-[#E1D9C4] text-[#20261F] placeholder-[#4C5548]/70 text-xs sm:text-sm focus:outline-none focus:border-[#2B6E4F] shadow-sm transition-colors"
        />
      </div>

      {/* List of History Items */}
      {filteredItems.length === 0 ? (
        <div className="py-12 px-4 text-center rounded-3xl bg-white border border-[#E1D9C4] shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-[#E4F3EA] border border-[#B7E4C7] text-[#2B6E4F] mx-auto flex items-center justify-center">
            <History className="w-8 h-8 opacity-80" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-base text-[#173C2D]">
              {t('noHistoryTitle', 'No scan records found')}
            </h3>
            <p className="text-xs text-[#4C5548] mt-1 max-w-xs mx-auto">
              {t('noHistoryDesc', 'Take a photo of your crop to start your first diagnosis!')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              speechService.playChime('click');
              onNavigate('camera');
            }}
            className="touch-target px-6 py-3 rounded-2xl bg-[#2B6E4F] hover:bg-[#173C2D] text-white font-bold text-xs sm:text-sm shadow-md inline-flex items-center gap-2 active:scale-95 transition-transform"
          >
            <Camera className="w-4 h-4" />
            <span>{t('cameraCtaTitle', 'Take Crop Photo')}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredItems.map((item) => {
            const dateStr = new Date(item.timestamp).toLocaleDateString('bn-BD', {
              day: 'numeric',
              month: 'short',
            });

            return (
              <div
                key={item.id}
                role="button"
                tabIndex={0}
                onClick={() => {
                  speechService.playChime('click');
                  onSelectHistoryItem(item.result);
                }}
                onKeyDown={(e) => e.key === 'Enter' && onSelectHistoryItem(item.result)}
                className="bg-white border border-[#E1D9C4] hover:border-[#2B6E4F]/60 rounded-3xl p-4 text-[#20261F] shadow-sm hover:shadow-agri flex items-center justify-between gap-3 cursor-pointer active:scale-[0.99] transition-all"
              >
                {/* Thumbnail & Info */}
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[#F3ECDA] border border-[#E1D9C4] flex-shrink-0">
                    <img
                      src={item.imageUrl}
                      alt="Crop thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-[#2B6E4F] font-bold">
                      <span>🌱 {t(item.cropNameKey)}</span>
                      <span className="text-[#E1D9C4]">•</span>
                      <span className="text-[#4C5548] font-mono text-[10px]">
                        {item.confidence}% Conf
                      </span>
                    </div>
                    <div className="font-heading text-sm sm:text-base font-extrabold text-[#173C2D] leading-tight mt-0.5">
                      {t(item.labelKey)}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-[#4C5548] mt-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-[#8A5A34]" />
                      <span>{dateStr}</span>
                    </div>
                  </div>
                </div>

                {/* Risk Badge and Arrow */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <RiskBadge level={item.riskLevel} size="sm" showIcon={false} />
                  <ChevronRight className="w-4 h-4 text-[#4C5548]" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

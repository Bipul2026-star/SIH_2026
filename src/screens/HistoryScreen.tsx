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
    <div className="flex flex-col gap-4 pb-28 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white">
              {t('historyTitle', 'Past Crop Scans')}
            </h2>
            <p className="text-xs text-stone-400">
              {historyItems.length} টি সংরক্ষিত পরীক্ষা
            </p>
          </div>
        </div>

        {historyItems.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="touch-target w-10 h-10 rounded-2xl bg-stone-900 border border-stone-800 text-stone-400 hover:text-red-400 flex items-center justify-center"
            title={t('clearHistory')}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('historySearchPlaceholder', 'Search crop or disease...')}
          className="w-full h-12 pl-10 pr-4 rounded-2xl bg-stone-900 border border-stone-800 text-white placeholder-stone-500 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
        />
      </div>

      {/* List of History Items */}
      {filteredItems.length === 0 ? (
        <div className="py-12 px-4 text-center rounded-3xl bg-stone-900/60 border border-stone-800 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-emerald-950/60 border border-emerald-700/40 text-emerald-400 mx-auto flex items-center justify-center">
            <History className="w-8 h-8 opacity-60" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">
              {t('noHistoryTitle', 'No scan records found')}
            </h3>
            <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
              {t('noHistoryDesc', 'Take a photo of your crop to start your first diagnosis!')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              speechService.playChime('click');
              onNavigate('camera');
            }}
            className="touch-target px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg inline-flex items-center gap-2"
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
                className="bg-stone-900/95 border-2 border-stone-800 hover:border-emerald-500/60 rounded-3xl p-3.5 text-white shadow-lg flex items-center justify-between gap-3 cursor-pointer active:scale-[0.98] transition-all"
              >
                {/* Thumbnail */}
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-stone-800 border border-stone-700 flex-shrink-0">
                    <img
                      src={item.imageUrl}
                      alt="Crop thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                      <span>🌱 {t(item.cropNameKey)}</span>
                      <span className="text-stone-500">•</span>
                      <span className="text-stone-400 font-mono text-[10px]">
                        {item.confidence}%
                      </span>
                    </div>
                    <div className="text-sm font-extrabold text-white leading-tight mt-0.5">
                      {t(item.labelKey)}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-stone-500 mt-1">
                      <Calendar className="w-3 h-3" />
                      <span>{dateStr}</span>
                    </div>
                  </div>
                </div>

                {/* Risk Badge and Arrow */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <RiskBadge level={item.riskLevel} size="sm" showIcon={false} />
                  <ChevronRight className="w-4 h-4 text-stone-500" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

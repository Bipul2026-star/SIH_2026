import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const OfflineBanner: React.FC = () => {
  const { t } = useLanguage();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 3500);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline && !showReconnected) return null;

  return (
    <div
      className={`w-full py-2 px-4 text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all duration-300 z-50 ${
        isOffline
          ? 'bg-[#FBEFDC] text-[#5B3A21] border-b border-[#EFCE93]'
          : 'bg-[#E4F3EA] text-[#173C2D] border-b border-[#52B788]'
      }`}
    >
      {isOffline ? (
        <>
          <WifiOff className="w-4 h-4 flex-shrink-0 text-[#E38A1C]" />
          <span>{t('offlineStatus', 'You are offline — cached data available')}</span>
        </>
      ) : (
        <>
          <Wifi className="w-4 h-4 flex-shrink-0 text-[#2B6E4F]" />
          <span>{t('onlineStatus', 'Internet connected')}</span>
        </>
      )}
    </div>
  );
};

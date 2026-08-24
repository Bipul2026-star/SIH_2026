import React from 'react';
import { Home, History, BellRing, HelpCircle } from 'lucide-react';
import type { ScreenType } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { speechService } from '../services/speechService';

interface BottomNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  hasUnreadAlerts?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onNavigate,
  hasUnreadAlerts = true,
}) => {
  const { t } = useLanguage();

  const handleTabClick = (screen: ScreenType) => {
    speechService.playChime('click');
    onNavigate(screen);
  };

  const navItems = [
    {
      id: 'home' as ScreenType,
      labelKey: 'navHome',
      fallback: 'Home',
      icon: Home,
    },
    {
      id: 'history' as ScreenType,
      labelKey: 'navHistory',
      fallback: 'History',
      icon: History,
    },
    {
      id: 'alerts' as ScreenType,
      labelKey: 'navAlerts',
      fallback: 'Alerts',
      icon: BellRing,
      hasBadge: hasUnreadAlerts,
    },
    {
      id: 'help' as ScreenType,
      labelKey: 'navHelp',
      fallback: 'Help',
      icon: HelpCircle,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#FBF7ED]/95 backdrop-blur-lg border-t border-[#E1D9C4] safe-bottom shadow-lg">
      <div className="max-w-xl mx-auto grid grid-cols-4 px-2 py-1.5">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleTabClick(item.id)}
              className={`touch-target flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition-all duration-150 active:scale-95 relative ${
                isActive
                  ? 'text-[#173C2D] font-bold bg-[#E4F3EA]'
                  : 'text-[#4C5548] hover:text-[#20261F] font-medium'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200 ${
                    isActive ? 'scale-105 text-[#2B6E4F]' : 'text-[#4C5548]'
                  }`}
                />
                {item.hasBadge && (
                  <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 bg-[#E38A1C] rounded-full ring-2 ring-[#FBF7ED]" />
                )}
              </div>
              <span
                className={`text-[11px] mt-0.5 line-clamp-1 tracking-tight ${
                  isActive ? 'font-bold text-[#173C2D]' : 'text-[#4C5548]'
                }`}
              >
                {t(item.labelKey, item.fallback)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

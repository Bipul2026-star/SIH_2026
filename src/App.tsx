import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import type { ScreenType, DiagnosisResult, QuickTestPreset } from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { OfflineBanner } from './components/OfflineBanner';
import { HelpModal } from './components/HelpModal';
import { SettingsModal } from './components/SettingsModal';
import { AuthModal } from './components/AuthModal';

import { GatewayScreen } from './screens/GatewayScreen';
import { HomeScreen } from './screens/HomeScreen';
import { CameraScreen } from './screens/CameraScreen';
import { ResultScreen } from './screens/ResultScreen';
import { TreatmentScreen } from './screens/TreatmentScreen';
import { AlertsScreen } from './screens/AlertsScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { HelpScreen } from './screens/HelpScreen';
import { KvkDashboardScreen } from './screens/KvkDashboardScreen';

import { submitScanForDiagnosis, MOCK_DIAGNOSES } from './services/diagnosisService';
import { storageService } from './services/storageService';
import { speechService } from './services/speechService';
import { Sparkles } from 'lucide-react';

const USER_STORAGE_KEY = 'crop_rakshak_user';

const MainApp: React.FC = () => {
  const { t, language } = useLanguage();

  const [currentScreen, setCurrentScreen] = useState<ScreenType>('gateway');
  const [currentResult, setCurrentResult] = useState<DiagnosisResult | null>(
    MOCK_DIAGNOSES.preset_rice_blast
  );
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analyzingImage, setAnalyzingImage] = useState<string | null>(null);

  // Modals
  const [isExpertModalOpen, setIsExpertModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Optional User Auth State (Guest access by default for farmers)
  const [currentUser, setCurrentUser] = useState<{ name: string; role: 'farmer' | 'officer' } | null>(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleLoginSuccess = (name: string, role: 'farmer' | 'officer') => {
    const user = { name, role };
    setCurrentUser(user);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    if (role === 'officer') {
      setCurrentScreen('kvk-dash');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  const handleOpenLogin = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  const handleOpenRegister = () => {
    setAuthMode('register');
    setIsAuthModalOpen(true);
  };

  // Handler for capturing or uploading photo
  const handleProcessScan = async (imageDataUrl: string, presetId?: string) => {
    setAnalyzingImage(imageDataUrl);
    setIsAnalyzing(true);
    setCurrentScreen('home'); // keep background clean

    try {
      const result = await submitScanForDiagnosis(imageDataUrl, presetId);
      setCurrentResult(result);
      storageService.saveScan(result);
      setIsAnalyzing(false);
      setCurrentScreen('result');
    } catch (err) {
      console.error('Scan error:', err);
      setIsAnalyzing(false);
      // Fallback to sample result
      const fallback = MOCK_DIAGNOSES.preset_rice_blast;
      setCurrentResult(fallback);
      setCurrentScreen('result');
    }
  };

  const handleSelectPreset = (preset: QuickTestPreset) => {
    handleProcessScan(preset.image, preset.id);
  };

  const handleSelectHistoryItem = (result: DiagnosisResult) => {
    setCurrentResult(result);
    setCurrentScreen('result');
  };

  // Full-screen standalone screens (Gateway, Camera, KVK Dashboard)
  if (currentScreen === 'gateway') {
    return (
      <div className="min-h-screen bg-[#173C2D] text-[#FBF7ED] font-sans antialiased selection:bg-[#52B788] selection:text-[#173C2D]">
        <OfflineBanner />
        <GatewayScreen
          onSelectDoor={(screen) => setCurrentScreen(screen)}
          onOpenLogin={handleOpenLogin}
          onOpenRegister={handleOpenRegister}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          initialMode={authMode}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    );
  }

  if (currentScreen === 'kvk-dash') {
    return (
      <div className="min-h-screen bg-[#F3ECDA] text-[#20261F] font-sans antialiased selection:bg-[#52B788] selection:text-[#173C2D]">
        <OfflineBanner />
        <KvkDashboardScreen onNavigate={(screen) => setCurrentScreen(screen)} />
      </div>
    );
  }

  if (currentScreen === 'camera') {
    return (
      <div className="min-h-screen bg-[#173C2D] text-white font-sans antialiased">
        <CameraScreen
          onBack={() => setCurrentScreen('home')}
          onCaptureImage={(dataUrl, presetId) => handleProcessScan(dataUrl, presetId)}
        />
      </div>
    );
  }

  const showBottomNav = ['home', 'history', 'alerts', 'help'].includes(currentScreen);

  return (
    <div className="min-h-screen bg-[#FBF7ED] text-[#20261F] flex flex-col justify-between font-sans relative antialiased selection:bg-[#52B788] selection:text-[#173C2D]">
      {/* Offline Status Alert Banner */}
      <OfflineBanner />

      {/* Top Header */}
      <Header
        onNavigateHome={() => setCurrentScreen('gateway')}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onVoiceGuide={() => speechService.speak(t('voiceHomeGreeting'), language)}
        onOpenLogin={handleOpenLogin}
        onOpenRegister={handleOpenRegister}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Responsive Content Area Container (full width on desktop up to max-w-6xl) */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 relative">
        {/* AI Scanning Loading Overlay */}
        {isAnalyzing && (
          <div className="fixed inset-0 z-50 bg-[#173C2D]/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-[#FBF7ED] animate-in fade-in duration-200">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden border-2 border-[#52B788] shadow-agri mb-6 bg-[#173C2D]">
              {analyzingImage && (
                <img
                  src={analyzingImage}
                  alt="Analyzing Crop"
                  className="w-full h-full object-cover"
                />
              )}
              {/* Scanning Radar Laser Line */}
              <div className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-[#52B788] to-transparent animate-laser-scan" />
              <div className="absolute inset-0 bg-[#173C2D]/20" />
            </div>

            <div className="space-y-2 max-w-xs">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-[#52B788]/50 text-[#8EE0B6] text-xs font-bold">
                <Sparkles className="w-4 h-4 text-[#52B788]" />
                <span>{t('aiModelActive', 'AI Model Active')}</span>
              </div>
              <h3 className="font-heading text-xl font-bold text-white">
                {t('analyzingImage', 'AI is analyzing your crop...')}
              </h3>
              <p className="text-xs text-[#DCEDE1]">
                {t('analyzingSub', 'Identifying leaves, symptoms and pests...')}
              </p>
            </div>
          </div>
        )}

        {/* Screen Router */}
        {currentScreen === 'home' && (
          <HomeScreen
            onNavigate={(screen) => setCurrentScreen(screen)}
            onSelectPreset={handleSelectPreset}
            onImageUploaded={(dataUrl) => handleProcessScan(dataUrl)}
          />
        )}

        {currentScreen === 'result' && currentResult && (
          <ResultScreen
            result={currentResult}
            onNavigate={(screen) => setCurrentScreen(screen)}
            onOpenExpertModal={() => setIsExpertModalOpen(true)}
            onRetake={() => setCurrentScreen('camera')}
          />
        )}

        {currentScreen === 'treatment' && currentResult && (
          <TreatmentScreen
            result={currentResult}
            onBack={() => setCurrentScreen('result')}
            onNavigate={(screen) => setCurrentScreen(screen)}
            onOpenExpertModal={() => setIsExpertModalOpen(true)}
          />
        )}

        {currentScreen === 'alerts' && <AlertsScreen />}

        {currentScreen === 'history' && (
          <HistoryScreen
            onSelectHistoryItem={handleSelectHistoryItem}
            onNavigate={(screen) => setCurrentScreen(screen)}
          />
        )}

        {currentScreen === 'help' && (
          <HelpScreen onOpenExpertModal={() => setIsExpertModalOpen(true)} />
        )}
      </main>

      {/* Bottom 4-Item Navigation for Farmer Portal Screens */}
      {showBottomNav && (
        <BottomNav
          currentScreen={currentScreen}
          onNavigate={(screen) => setCurrentScreen(screen)}
        />
      )}

      {/* Reusable Modals */}
      <HelpModal
        isOpen={isExpertModalOpen}
        onClose={() => setIsExpertModalOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authMode}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}

export default App;


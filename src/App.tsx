import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import type { ScreenType, DiagnosisResult, QuickTestPreset } from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { OfflineBanner } from './components/OfflineBanner';
import { HelpModal } from './components/HelpModal';
import { SettingsModal } from './components/SettingsModal';

import { HomeScreen } from './screens/HomeScreen';
import { CameraScreen } from './screens/CameraScreen';
import { ResultScreen } from './screens/ResultScreen';
import { TreatmentScreen } from './screens/TreatmentScreen';
import { AlertsScreen } from './screens/AlertsScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { HelpScreen } from './screens/HelpScreen';

import { submitScanForDiagnosis, MOCK_DIAGNOSES } from './services/diagnosisService';
import { storageService } from './services/storageService';
import { speechService } from './services/speechService';
import { Sparkles } from 'lucide-react';

const MainApp: React.FC = () => {
  const { t, language } = useLanguage();

  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [currentResult, setCurrentResult] = useState<DiagnosisResult | null>(
    MOCK_DIAGNOSES.preset_rice_blast
  );
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analyzingImage, setAnalyzingImage] = useState<string | null>(null);

  // Modals
  const [isExpertModalOpen, setIsExpertModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-between font-sans relative antialiased selection:bg-emerald-500 selection:text-white">
      {/* Offline Status Alert Banner */}
      <OfflineBanner />

      {/* Camera is full-screen standalone */}
      {currentScreen === 'camera' ? (
        <CameraScreen
          onBack={() => setCurrentScreen('home')}
          onCaptureImage={(dataUrl, presetId) => handleProcessScan(dataUrl, presetId)}
        />
      ) : (
        <>
          {/* Top Header */}
          <Header
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            onVoiceGuide={() => speechService.speak(t('voiceHomeGreeting'), language)}
          />

          {/* Main Mobile Content Area Container */}
          <main className="flex-1 w-full max-w-md mx-auto px-4 py-4 relative">
            {/* AI Scanning Loading Overlay */}
            {isAnalyzing && (
              <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white animate-in fade-in duration-200">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden border-2 border-emerald-400 shadow-[0_0_30px_rgba(34,197,94,0.6)] mb-6">
                  {analyzingImage && (
                    <img
                      src={analyzingImage}
                      alt="Analyzing Crop"
                      className="w-full h-full object-cover"
                    />
                  )}
                  {/* Scanning Radar Laser Line */}
                  <div className="absolute inset-x-0 h-2 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#22c55e] animate-laser-scan" />
                  <div className="absolute inset-0 bg-emerald-950/20" />
                </div>

                <div className="space-y-2 max-w-xs">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold animate-pulse">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>AI Model Active</span>
                  </div>
                  <h3 className="text-lg font-black text-white">
                    {t('analyzingImage', 'AI is analyzing your crop...')}
                  </h3>
                  <p className="text-xs text-stone-300">
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

          {/* Bottom 4-Item Navigation */}
          <BottomNav
            currentScreen={currentScreen}
            onNavigate={(screen) => setCurrentScreen(screen)}
          />
        </>
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

import React, { useRef, useState, useEffect } from 'react';
import { ArrowLeft, Camera, RefreshCw, Upload, Sparkles, Volume2, AlertCircle } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import type { QuickTestPreset } from '../types';
import { QUICK_TEST_PRESETS, SAMPLE_CROP_IMAGES } from '../services/diagnosisService';
import { speechService } from '../services/speechService';

interface CameraScreenProps {
  onBack: () => void;
  onCaptureImage: (imageDataUrl: string, presetId?: string) => void;
}

export const CameraScreen: React.FC<CameraScreenProps> = ({ onBack, onCaptureImage }) => {
  const { t, language } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [showPresetDrawer, setShowPresetDrawer] = useState(false);

  // Initialize Camera
  useEffect(() => {
    let activeStream: MediaStream | null = null;

    async function startCamera() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setHasCameraPermission(false);
          return;
        }

        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        };

        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        activeStream = mediaStream;
        setStream(mediaStream);
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.warn('Camera access error:', err);
        setHasCameraPermission(false);
      }
    }

    startCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  // Clean up stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const handleCapture = () => {
    speechService.playChime('camera');

    if (videoRef.current && canvasRef.current && hasCameraPermission) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        onCaptureImage(dataUrl);
        return;
      }
    }

    // If camera wasn't available or mock fallback, use sample image
    onCaptureImage(SAMPLE_CROP_IMAGES.riceBlast, 'preset_rice_blast');
  };

  const handleFlipCamera = () => {
    speechService.playChime('click');
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      speechService.playChime('click');
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onCaptureImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (preset: QuickTestPreset) => {
    speechService.playChime('click');
    onCaptureImage(preset.image, preset.id);
  };

  const handleVoiceGuide = () => {
    speechService.speak(t('voiceCameraGuide'), language);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#173C2D] flex flex-col justify-between select-none overflow-hidden text-white">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleGalleryUpload}
        accept="image/*"
        className="hidden"
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Top Floating Control Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 sm:p-6 flex items-center justify-between bg-gradient-to-b from-[#173C2D]/90 via-[#173C2D]/50 to-transparent">
        <button
          type="button"
          onClick={() => {
            speechService.playChime('click');
            onBack();
          }}
          aria-label={t('cameraClose', 'Back')}
          className="touch-target w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/30 flex items-center justify-center shadow-md active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="px-4 py-2 rounded-full bg-[#173C2D]/85 backdrop-blur-md border border-[#52B788]/40 text-[#8EE0B6] text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm">
          <Camera className="w-4 h-4 text-[#52B788]" />
          <span>{t('cameraTitle', 'Crop Viewfinder')}</span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Quick Presets Picker */}
          <button
            type="button"
            onClick={() => {
              speechService.playChime('click');
              setShowPresetDrawer(!showPresetDrawer);
            }}
            className="touch-target w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-[#FACB77] border border-white/30 flex items-center justify-center shadow-md active:scale-95"
            title="Sample Leaf Photos"
          >
            <Sparkles className="w-5 h-5" />
          </button>

          {/* Flip Camera */}
          <button
            type="button"
            onClick={handleFlipCamera}
            aria-label={t('cameraFlip', 'Flip Camera')}
            className="touch-target w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/30 flex items-center justify-center shadow-md active:scale-95"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Viewfinder / Camera Video Area */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center bg-[#173C2D] overflow-hidden">
        {hasCameraPermission === false ? (
          // Camera Fallback UI (e.g. permission denied or simulated preview)
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white relative">
            <div className="absolute inset-0 bg-gradient-to-b from-[#173C2D] via-[#2B6E4F]/60 to-[#173C2D]" />
            
            <div className="relative z-10 max-w-sm space-y-4 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl">
              <div className="w-14 h-14 rounded-2xl bg-[#E38A1C]/20 border border-[#E38A1C]/40 text-[#FACB77] mx-auto flex items-center justify-center">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h3 className="font-heading font-bold text-base text-white">
                {t('cameraError', 'Camera unavailable — upload or choose sample')}
              </h3>
              <div className="flex flex-col gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="touch-target w-full py-3.5 px-4 rounded-2xl bg-[#52B788] hover:bg-[#74C69D] text-[#173C2D] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md active:scale-95"
                >
                  <Upload className="w-5 h-5" />
                  <span>{t('uploadBtn', 'Upload from Gallery')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPresetDrawer(true)}
                  className="touch-target w-full py-3 px-4 rounded-2xl bg-white/15 hover:bg-white/25 text-[#FACB77] font-bold text-xs flex items-center justify-center gap-2 border border-white/20 active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>নমুনা পাতার ছবি দিয়ে পরীক্ষা (Sample)</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Real Video Stream
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* 🎯 Guide Overlay Box (Center Leaf Target Box) */}
        <div className="relative z-10 w-[270px] h-[270px] sm:w-[320px] sm:h-[320px] rounded-3xl border-2 border-[#52B788] shadow-[0_0_0_9999px_rgba(23,60,45,0.65)] flex flex-col justify-between p-3 pointer-events-none">
          {/* Animated Clean Laser Sweep */}
          <div className="absolute inset-x-2 h-1 bg-[#52B788] shadow-sm animate-laser-scan rounded-full opacity-80" />

          {/* Corner Target Reticles */}
          <div className="flex justify-between w-full">
            <div className="w-6 h-6 border-t-4 border-l-4 border-[#52B788] rounded-tl-xl" />
            <div className="w-6 h-6 border-t-4 border-r-4 border-[#52B788] rounded-tr-xl" />
          </div>

          <div className="flex items-center justify-center text-center opacity-70">
            <span className="text-4xl select-none">🍃</span>
          </div>

          <div className="flex justify-between w-full">
            <div className="w-6 h-6 border-b-4 border-l-4 border-[#52B788] rounded-bl-xl" />
            <div className="w-6 h-6 border-b-4 border-r-4 border-[#52B788] rounded-tr-xl" />
          </div>
        </div>

        {/* Guidance Text Below Box */}
        <div className="absolute bottom-28 sm:bottom-32 left-4 right-4 z-20 flex items-center justify-center">
          <div className="bg-[#173C2D]/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-[#52B788]/40 text-[#FBF7ED] flex items-center gap-3 shadow-lg max-w-sm text-center">
            <span className="text-xs font-bold leading-tight">
              {t('cameraGuide', 'Keep the affected area inside the box')}
            </span>
            <button
              type="button"
              onClick={handleVoiceGuide}
              aria-label="Listen Guide"
              className="touch-target w-8 h-8 rounded-xl bg-[#52B788] text-[#173C2D] flex items-center justify-center flex-shrink-0 active:scale-95"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Preset Drawer Overlay */}
      {showPresetDrawer && (
        <div className="absolute inset-x-0 bottom-0 z-30 bg-[#173C2D] border-t border-white/20 rounded-t-3xl p-5 text-white shadow-2xl animate-in slide-in-from-bottom-6 duration-200 max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-bold text-[#8EE0B6] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>নমুনা ছবি নির্বাচন করুন (Select Sample):</span>
            </div>
            <button
              type="button"
              onClick={() => setShowPresetDrawer(false)}
              className="text-xs text-[#DCEDE1] hover:text-white px-2 py-1 bg-white/10 rounded-lg"
            >
              {t('closeModal', 'Close')}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-52 overflow-y-auto">
            {QUICK_TEST_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className="p-2.5 rounded-2xl bg-white/10 border border-white/15 hover:border-[#52B788] text-left flex items-center gap-2.5 active:scale-95 transition-all"
              >
                <span className="text-2xl">{preset.icon}</span>
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-white truncate">
                    {t(preset.titleKey, preset.diseaseKey)}
                  </div>
                  <div className="text-[10px] text-[#8EE0B6] font-mono">{preset.expectedConfidence}% Conf</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Shutter & Gallery Controls */}
      <div className="relative z-20 pb-8 pt-4 px-6 bg-gradient-to-t from-[#173C2D] via-[#173C2D]/90 to-transparent flex items-center justify-around max-w-md mx-auto w-full">
        {/* Gallery Upload Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          aria-label={t('cameraGallery', 'Gallery')}
          className="touch-target w-14 h-14 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/20 text-[#FACB77] flex flex-col items-center justify-center shadow-md active:scale-95 transition-transform"
        >
          <Upload className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5 text-white">{t('cameraGallery', 'Gallery')}</span>
        </button>

        {/* Big Shutter Trigger Button (76px diameter) */}
        <div className="relative">
          <button
            type="button"
            onClick={handleCapture}
            aria-label={t('cameraSnap', 'Capture Photo')}
            className="touch-target w-20 h-20 rounded-full bg-white border-4 border-[#52B788] p-1 flex items-center justify-center shadow-2xl active:scale-90 transition-transform"
          >
            <div className="w-16 h-16 rounded-full bg-[#2B6E4F] hover:bg-[#1F533E] flex items-center justify-center text-white shadow-inner">
              <Camera className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
          </button>
        </div>

        {/* Demo Samples Button */}
        <button
          type="button"
          onClick={() => setShowPresetDrawer(!showPresetDrawer)}
          className="touch-target w-14 h-14 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/20 text-[#8EE0B6] flex flex-col items-center justify-center shadow-md active:scale-95 transition-transform"
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5 text-white">নমুনা / Test</span>
        </button>
      </div>
    </div>
  );
};

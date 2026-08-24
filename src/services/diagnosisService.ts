import type { DiagnosisResult, QuickTestPreset, RegionalAlert } from '../types';

// Pre-defined SVG/Canvas sample crop imagery for instant offline demonstration
export const SAMPLE_CROP_IMAGES = {
  riceBlast: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%232e7d32"/><path d="M120 40 Q200 150 220 280 Q250 150 160 40 Z" fill="%234caf50"/><ellipse cx="185" cy="130" rx="35" ry="18" fill="%23795548" stroke="%233e2723" stroke-width="3"/><ellipse cx="185" cy="130" rx="20" ry="8" fill="%23d7ccc8"/><ellipse cx="160" cy="190" rx="25" ry="12" fill="%23795548"/><ellipse cx="160" cy="190" rx="14" ry="5" fill="%23d7ccc8"/><circle cx="210" cy="90" r="10" fill="%238d6e63"/><text x="200" y="270" fill="%23ffffff" font-size="16" text-anchor="middle" font-family="sans-serif" font-weight="bold">🌾 Rice Blast (ধান ব্লাস্ট)</text></svg>',
  
  armyworm: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%231b5e20"/><path d="M100 280 Q180 120 280 40 Q230 180 150 280 Z" fill="%2366bb6a"/><circle cx="170" cy="120" r="18" fill="%231b5e20"/><circle cx="205" cy="150" r="14" fill="%231b5e20"/><circle cx="150" cy="180" r="12" fill="%231b5e20"/><ellipse cx="185" cy="140" rx="22" ry="7" fill="%23ffb300" stroke="%23e65100" stroke-width="2"/><circle cx="170" cy="138" r="3" fill="%23000"/><text x="200" y="270" fill="%23ffffff" font-size="16" text-anchor="middle" font-family="sans-serif" font-weight="bold">🐛 Armyworm (মাজরা পোকা)</text></svg>',
  
  tomatoBlight: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%2333691e"/><path d="M80 150 Q160 50 320 150 Q160 250 80 150 Z" fill="%237cb342"/><circle cx="160" cy="130" r="28" fill="%235d4037"/><circle cx="160" cy="130" r="20" fill="%238d6e63"/><circle cx="160" cy="130" r="10" fill="%23d7ccc8"/><circle cx="240" cy="160" r="22" fill="%235d4037"/><circle cx="240" cy="160" r="14" fill="%238d6e63"/><text x="200" y="270" fill="%23ffffff" font-size="16" text-anchor="middle" font-family="sans-serif" font-weight="bold">🍅 Tomato Blight (টমেটো ব্লাইট)</text></svg>',
  
  healthyPaddy: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23004d40"/><path d="M120 280 Q180 80 220 20 Q240 100 200 280 Z" fill="%2326a69a"/><path d="M180 280 Q230 110 310 50 Q280 150 220 280 Z" fill="%234db6ac"/><path d="M90 280 Q140 150 110 90 Q150 170 140 280 Z" fill="%2380cbc4"/><circle cx="210" cy="60" r="8" fill="%23e0f2f1" opacity="0.6"/><text x="200" y="270" fill="%23ffffff" font-size="16" text-anchor="middle" font-family="sans-serif" font-weight="bold">🌱 Healthy Crop (সুস্থ ফসল)</text></svg>',
  
  blurryLeaf: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><defs><filter id="blurEffect"><feGaussianBlur stdDeviation="14"/></filter></defs><rect width="400" height="300" fill="%23555555"/><g filter="url(%23blurEffect)"><circle cx="150" cy="150" r="90" fill="%234caf50"/><circle cx="240" cy="140" r="70" fill="%2381c784"/><rect x="80" y="80" width="220" height="140" fill="%23a1887f"/></g><text x="200" y="270" fill="%23ffffff" font-size="16" text-anchor="middle" font-family="sans-serif" font-weight="bold">🌫️ Blurry Image (অস্পষ্ট ছবি)</text></svg>',
};

export const QUICK_TEST_PRESETS: QuickTestPreset[] = [
  {
    id: 'preset_rice_blast',
    titleKey: 'testRiceBlast',
    cropKey: 'cropRice',
    diseaseKey: 'diseaseRiceBlast',
    icon: '🌾',
    image: SAMPLE_CROP_IMAGES.riceBlast,
    expectedConfidence: 94,
    riskLevel: 'high',
    type: 'disease',
  },
  {
    id: 'preset_armyworm',
    titleKey: 'testArmyworm',
    cropKey: 'cropRice',
    diseaseKey: 'pestArmyworm',
    icon: '🐛',
    image: SAMPLE_CROP_IMAGES.armyworm,
    expectedConfidence: 89,
    riskLevel: 'high',
    type: 'pest',
  },
  {
    id: 'preset_tomato_blight',
    titleKey: 'testTomatoBlight',
    cropKey: 'cropTomato',
    diseaseKey: 'diseaseTomatoBlight',
    icon: '🍅',
    image: SAMPLE_CROP_IMAGES.tomatoBlight,
    expectedConfidence: 82,
    riskLevel: 'medium',
    type: 'disease',
  },
  {
    id: 'preset_healthy',
    titleKey: 'testHealthy',
    cropKey: 'cropRice',
    diseaseKey: 'healthyPaddy',
    icon: '🌱',
    image: SAMPLE_CROP_IMAGES.healthyPaddy,
    expectedConfidence: 96,
    riskLevel: 'healthy',
    type: 'healthy',
  },
  {
    id: 'preset_blurry',
    titleKey: 'testBlurry',
    cropKey: 'cropRice',
    diseaseKey: 'unclearTitle',
    icon: '🌫️',
    image: SAMPLE_CROP_IMAGES.blurryLeaf,
    expectedConfidence: 45, // < 60% threshold to trigger fallback
    riskLevel: 'unknown',
    type: 'unknown',
  },
];

export const MOCK_DIAGNOSES: Record<string, DiagnosisResult> = {
  preset_rice_blast: {
    id: 'diag_rice_blast',
    cropNameKey: 'cropRice',
    labelKey: 'diseaseRiceBlast',
    issueType: 'disease',
    confidence: 94,
    riskLevel: 'high',
    summaryKey: 'diseaseRiceBlastDesc',
    treatmentSteps: [
      {
        stepNumber: 1,
        iconName: 'scissors',
        titleKey: 'diseaseRiceBlastStep1Title',
        descKey: 'diseaseRiceBlastStep1Desc',
      },
      {
        stepNumber: 2,
        iconName: 'spray',
        titleKey: 'diseaseRiceBlastStep2Title',
        descKey: 'diseaseRiceBlastStep2Desc',
      },
      {
        stepNumber: 3,
        iconName: 'eye',
        titleKey: 'diseaseRiceBlastStep3Title',
        descKey: 'diseaseRiceBlastStep3Desc',
      },
    ],
    timestamp: Date.now(),
    imageUrl: SAMPLE_CROP_IMAGES.riceBlast,
  },

  preset_armyworm: {
    id: 'diag_armyworm',
    cropNameKey: 'cropRice',
    labelKey: 'pestArmyworm',
    issueType: 'pest',
    confidence: 89,
    riskLevel: 'high',
    summaryKey: 'pestArmywormDesc',
    treatmentSteps: [
      {
        stepNumber: 1,
        iconName: 'scissors',
        titleKey: 'pestArmywormStep1Title',
        descKey: 'pestArmywormStep1Desc',
      },
      {
        stepNumber: 2,
        iconName: 'spray',
        titleKey: 'pestArmywormStep2Title',
        descKey: 'pestArmywormStep2Desc',
      },
      {
        stepNumber: 3,
        iconName: 'eye',
        titleKey: 'pestArmywormStep3Title',
        descKey: 'pestArmywormStep3Desc',
      },
    ],
    timestamp: Date.now(),
    imageUrl: SAMPLE_CROP_IMAGES.armyworm,
  },

  preset_tomato_blight: {
    id: 'diag_tomato_blight',
    cropNameKey: 'cropTomato',
    labelKey: 'diseaseTomatoBlight',
    issueType: 'disease',
    confidence: 82,
    riskLevel: 'medium',
    summaryKey: 'diseaseTomatoBlightDesc',
    treatmentSteps: [
      {
        stepNumber: 1,
        iconName: 'scissors',
        titleKey: 'diseaseTomatoBlightStep1Title',
        descKey: 'diseaseTomatoBlightStep1Desc',
      },
      {
        stepNumber: 2,
        iconName: 'spray',
        titleKey: 'diseaseTomatoBlightStep2Title',
        descKey: 'diseaseTomatoBlightStep2Desc',
      },
      {
        stepNumber: 3,
        iconName: 'droplet',
        titleKey: 'diseaseTomatoBlightStep3Title',
        descKey: 'diseaseTomatoBlightStep3Desc',
      },
    ],
    timestamp: Date.now(),
    imageUrl: SAMPLE_CROP_IMAGES.tomatoBlight,
  },

  preset_healthy: {
    id: 'diag_healthy',
    cropNameKey: 'cropRice',
    labelKey: 'healthyPaddy',
    issueType: 'healthy',
    confidence: 96,
    riskLevel: 'healthy',
    summaryKey: 'healthyPaddyDesc',
    treatmentSteps: [
      {
        stepNumber: 1,
        iconName: 'droplet',
        titleKey: 'healthyPaddyStep1Title',
        descKey: 'healthyPaddyStep1Desc',
      },
      {
        stepNumber: 2,
        iconName: 'shield',
        titleKey: 'healthyPaddyStep2Title',
        descKey: 'healthyPaddyStep2Desc',
      },
      {
        stepNumber: 3,
        iconName: 'eye',
        titleKey: 'healthyPaddyStep3Title',
        descKey: 'healthyPaddyStep3Desc',
      },
    ],
    timestamp: Date.now(),
    imageUrl: SAMPLE_CROP_IMAGES.healthyPaddy,
  },

  preset_blurry: {
    id: 'diag_blurry',
    cropNameKey: 'cropRice',
    labelKey: 'unclearTitle',
    issueType: 'unknown',
    confidence: 45, // < 60% confidence -> Triggers Fallback
    riskLevel: 'unknown',
    summaryKey: 'unclearDesc',
    treatmentSteps: [],
    timestamp: Date.now(),
    imageUrl: SAMPLE_CROP_IMAGES.blurryLeaf,
    isUnclear: true,
  },
};

export const REGIONAL_ALERTS: RegionalAlert[] = [
  {
    id: 'alert_1',
    cropKey: 'cropRice',
    issueKey: 'diseaseRiceBlast',
    riskLevel: 'high',
    messageKey: 'regionalAlertBannerDesc',
    preventionKey: 'diseaseRiceBlastStep2Desc',
    advisorySteps: [
      'diseaseRiceBlastStep1Desc',
      'diseaseRiceBlastStep2Desc',
      'diseaseRiceBlastStep3Desc',
    ],
    areaKey: 'Burdwan / Nadia / Hooghly',
    dateKey: 'Today, 24 Aug',
  },
  {
    id: 'alert_2',
    cropKey: 'cropTomato',
    issueKey: 'diseaseTomatoBlight',
    riskLevel: 'medium',
    messageKey: 'diseaseTomatoBlightDesc',
    preventionKey: 'diseaseTomatoBlightStep2Desc',
    advisorySteps: [
      'diseaseTomatoBlightStep1Desc',
      'diseaseTomatoBlightStep2Desc',
      'diseaseTomatoBlightStep3Desc',
    ],
    areaKey: 'North 24 Parganas / Murshidabad',
    dateKey: 'Yesterday',
  },
  {
    id: 'alert_3',
    cropKey: 'cropRice',
    issueKey: 'pestArmyworm',
    riskLevel: 'high',
    messageKey: 'pestArmywormDesc',
    preventionKey: 'pestArmywormStep2Desc',
    advisorySteps: [
      'pestArmywormStep1Desc',
      'pestArmywormStep2Desc',
      'pestArmywormStep3Desc',
    ],
    areaKey: 'Bankura / Midnapore',
    dateKey: '2 days ago',
  },
];

/**
 * Clean separated API interface for AI diagnosis.
 * Ready to connect with a real ML endpoint (e.g. Gemini Vision API / TensorFlow.js / Flask backend)
 */
export async function submitScanForDiagnosis(
  imageDataUrl: string,
  presetId?: string
): Promise<DiagnosisResult> {
  // Simulate network & AI model inference latency (1.4s)
  await new Promise((resolve) => setTimeout(resolve, 1400));

  // If a preset was selected, return corresponding diagnosis
  if (presetId && MOCK_DIAGNOSES[presetId]) {
    const result = {
      ...MOCK_DIAGNOSES[presetId],
      id: `diag_${Date.now()}`,
      imageUrl: imageDataUrl || MOCK_DIAGNOSES[presetId].imageUrl,
      timestamp: Date.now(),
    };
    return result;
  }

  // Fallback heuristic simulation for custom user camera photo or upload:
  const randomPreset = MOCK_DIAGNOSES['preset_rice_blast'];
  return {
    ...randomPreset,
    id: `diag_${Date.now()}`,
    imageUrl: imageDataUrl,
    timestamp: Date.now(),
  };
}

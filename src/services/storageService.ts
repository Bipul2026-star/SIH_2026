import type { DiagnosisResult, ScanHistoryItem } from '../types';
import { MOCK_DIAGNOSES } from './diagnosisService';

const HISTORY_KEY = 'crop_rakshak_history_v1';

export const storageService = {
  getHistory(): ScanHistoryItem[] {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      // Initialize with sample preloaded records if empty so the screen looks realistic immediately
      const initial: ScanHistoryItem[] = [
        {
          id: 'hist_1',
          timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
          cropNameKey: 'cropRice',
          labelKey: 'diseaseRiceBlast',
          issueType: 'disease',
          confidence: 94,
          riskLevel: 'high',
          imageUrl: MOCK_DIAGNOSES.preset_rice_blast.imageUrl,
          result: MOCK_DIAGNOSES.preset_rice_blast,
        },
        {
          id: 'hist_2',
          timestamp: Date.now() - 1000 * 60 * 60 * 24 * 5, // 5 days ago
          cropNameKey: 'cropTomato',
          labelKey: 'diseaseTomatoBlight',
          issueType: 'disease',
          confidence: 82,
          riskLevel: 'medium',
          imageUrl: MOCK_DIAGNOSES.preset_tomato_blight.imageUrl,
          result: MOCK_DIAGNOSES.preset_tomato_blight,
        },
        {
          id: 'hist_3',
          timestamp: Date.now() - 1000 * 60 * 60 * 24 * 8, // 8 days ago
          cropNameKey: 'cropRice',
          labelKey: 'healthyPaddy',
          issueType: 'healthy',
          confidence: 96,
          riskLevel: 'healthy',
          imageUrl: MOCK_DIAGNOSES.preset_healthy.imageUrl,
          result: MOCK_DIAGNOSES.preset_healthy,
        },
      ];
      localStorage.setItem(HISTORY_KEY, JSON.stringify(initial));
      return initial;
    } catch {
      return [];
    }
  },

  saveScan(result: DiagnosisResult): void {
    try {
      if (result.isUnclear || result.confidence < 60) {
        // Don't save unconfident unclear scans into history by default
        return;
      }
      const history = this.getHistory();
      const newItem: ScanHistoryItem = {
        id: result.id || `hist_${Date.now()}`,
        timestamp: result.timestamp || Date.now(),
        cropNameKey: result.cropNameKey,
        labelKey: result.labelKey,
        issueType: result.issueType,
        confidence: result.confidence,
        riskLevel: result.riskLevel,
        imageUrl: result.imageUrl,
        result: result,
      };
      const updated = [newItem, ...history.filter((h) => h.id !== newItem.id)];
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated.slice(0, 30)));
    } catch (e) {
      console.error('Failed to save scan to storage:', e);
    }
  },

  clearHistory(): void {
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (e) {
      console.error('Failed to clear storage:', e);
    }
  },
};

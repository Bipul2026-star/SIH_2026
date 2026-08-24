export type Language = 'bn' | 'hi' | 'mr' | 'en';

export type IssueType = 'disease' | 'pest' | 'healthy' | 'unknown';

export type RiskLevel = 'high' | 'medium' | 'low' | 'healthy' | 'unknown';

export interface TreatmentStep {
  stepNumber: number;
  iconName: 'scissors' | 'spray' | 'eye' | 'phone' | 'shield' | 'sun' | 'droplet';
  titleKey: string;
  descKey: string;
}

export interface DiagnosisResult {
  id: string;
  cropNameKey: string;
  labelKey: string;
  issueType: IssueType;
  confidence: number; // Percentage 0-100
  riskLevel: RiskLevel;
  summaryKey: string;
  causeKey?: string;
  treatmentSteps: TreatmentStep[];
  timestamp: number;
  imageUrl: string;
  isUnclear?: boolean;
}

export interface RegionalAlert {
  id: string;
  cropKey: string;
  issueKey: string;
  riskLevel: 'high' | 'medium' | 'low';
  messageKey: string;
  preventionKey: string;
  advisorySteps: string[];
  areaKey: string;
  dateKey: string;
}

export interface ScanHistoryItem {
  id: string;
  timestamp: number;
  cropNameKey: string;
  labelKey: string;
  issueType: IssueType;
  confidence: number;
  riskLevel: RiskLevel;
  imageUrl: string;
  result: DiagnosisResult;
}

export type ScreenType = 
  | 'gateway' 
  | 'home' 
  | 'camera' 
  | 'result' 
  | 'treatment' 
  | 'alerts' 
  | 'history' 
  | 'help' 
  | 'kvk-dash';

export type AgriFeatureType = 'health' | 'irrigation' | 'weather' | 'boundary' | 'soil' | 'pest' | null;

export interface QuickTestPreset {
  id: string;
  titleKey: string;
  cropKey: string;
  diseaseKey: string;
  icon: string;
  image: string;
  expectedConfidence: number;
  riskLevel: RiskLevel;
  type: IssueType;
}

export interface FarmerSubmission {
  id: string;
  farmerName: string;
  phone: string;
  village: string;
  block: string;
  district: string;
  crop: string;
  cropKey: string;
  issue: string;
  issueKey: string;
  severity: 'high' | 'medium' | 'low';
  date: string;
  timeAgo: string;
  imageUrl: string;
  confidence: number;
  status: 'pending' | 'verified' | 'advisory_sent';
  advisoryNote?: string;
}

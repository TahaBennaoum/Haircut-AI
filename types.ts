export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS',
  TRY_ON = 'TRY_ON',
  ERROR = 'ERROR'
}

export interface UserPreferences {
  gender: 'masculine' | 'feminine' | 'neutral';
  lengthPreference: 'short' | 'medium' | 'long' | 'any';
  styleCategory: 'professional' | 'casual' | 'trendy' | 'edgy' | 'classic';
  facialHair: 'clean_shave' | 'full_beard' | 'goatee' | 'mustache' | 'stubble' | 'none';
}

export interface FaceAnalysis {
  faceShape: string;
  faceShapeDescription: string;
  features: {
    jawline: string;
    forehead: string;
    cheekbones: string;
  };
  detectedHairType: string;
  skinTone: string;
  confidenceScore: number;
}

export interface HairstyleRecommendation {
  id: string;
  name: string;
  description: string;
  whyItSuits: string;
  maintenanceLevel: 'Low' | 'Medium' | 'High';
  stylingTips: string[];
  products: string[];
}

export interface AnalysisResult {
  analysis: FaceAnalysis;
  recommendations: HairstyleRecommendation[];
}

export interface GeneratedImage {
  originalStyleId: string;
  imageUrl: string;
}
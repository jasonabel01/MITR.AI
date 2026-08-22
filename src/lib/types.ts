export type Language = "Hinglish" | "Hindi" | "Tamil" | "Telugu" | "English";

export type IntentTag =
  | "Exam Burnout"
  | "Social Anxiety"
  | "Chronic Condition"
  | "Loneliness"
  | "Family Pressure"
  | "Career Uncertainty"
  | "Grief & Loss"
  | "General Support";

export interface PeerProfile {
  clientId: string;
  alias: string;
  nativeLang: Language;
  tags: IntentTag[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderAlias: string;
  isSelf: boolean;
  originalText: string;
  translatedText: string;
  sourceLang: Language;
  targetLang: Language;
  detectedEmotion?: string;
  valence?: "Positive-Healing" | "Negative-Distress" | "Neutral";
  latencyMs?: number;
  flag?: string | null;
  timestamp: number;
}

export interface HelplineInfo {
  name: string;
  number: string;
  description: string;
  action: string;
  primary?: boolean;
}

export interface CrisisAlert {
  isCrisis: boolean;
  detectedPhrase?: string;
  confidence?: number;
  helplines: HelplineInfo[];
  message?: string;
}

export interface SessionSummaryData {
  mutualEmpathyScore: number;
  listeningRatioScore: number;
  emotionalShift: string;
  totalMessages: number;
  keyTakeaways: string[];
  affirmation: string;
  purgeTimestamp: string;
}

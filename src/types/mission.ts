export type AnatomicalZone =
  | "CRANIAL_SANS"
  | "CARDIOVASCULAR"
  | "MUSCULOSKELETAL"
  | "IMMUNE_METABOLIC"
  | "NEURO_BEHAVIORAL";

export type HealthStatus = "NOMINAL" | "ATTENTION" | "CRITICAL";

export interface DailyHealthMetric {
  sol: number; // Sol 1 to 30
  systolicBP: number; // mmHg
  diastolicBP: number; // mmHg
  heartRate: number; // bpm
  bloodSugar: number; // mg/dL
  bodyTemp: number; // °C
  sleepHours: number; // hours
  moodScore: number; // 1 to 10 scale
  radiationDoseRate: number; // mSv/hr
  sensorConfidence: number; // % (0-100% signal quality)
  confidenceReason?: string; // e.g. "High SNR • Rhythm coherent" or "Motion artifact • Re-measure required"
  alertSuppressed: boolean; // True if sensor artifact / noise detected
  eventTag?: string; // Clinical event annotation
  injectedFault?: "NONE" | "SENSOR_GLITCH" | "BP_DRIFT" | "SLEEP_DECLINE";
}

export interface ZoneDetail {
  id: AnatomicalZone;
  name: string;
  hazard: string;
  status: HealthStatus;
  primaryMetric: string;
  currentValue: string;
  baseline: string;
  threshold: string;
  clinicalExplanation: string;
}

export type EscalationTier = 1 | 2 | 3;

export interface EscalationAction {
  tier: EscalationTier;
  label: string;
  targetHazard: string;
  description: string;
  protocol: string;
  requiresGroundAuth: boolean;
  guideline: string;
}

export type CrewMemberId = "CDR_MILLER" | "PLT_CHEN" | "ENG_KOWALSKI" | "SCI_VANCE";

export interface CrewBaseline {
  systolicBP: number;
  diastolicBP: number;
  heartRate: number;
  sleepHours: number;
  bloodSugar: number;
  bodyTemp: number;
  radiationBackground: number;
}

export interface DriftSignalDelta {
  name: string;
  key: keyof DailyHealthMetric;
  current: number;
  baseline: number;
  deltaStr: string;
  pctDelta: number;
  zScore: number;
  cusumStat: number;
  ewmaVal: number;
  isBreached: boolean;
}

export interface DriftAnalysis {
  zone: AnatomicalZone;
  status: HealthStatus;
  primarySignal: DriftSignalDelta;
  allSignals: DriftSignalDelta[];
  cusumPositive: number;
  cusumNegative: number;
  ewmaVal: number;
  isDriftDetected: boolean;
  primaryHazard: string;
  hazardCode: string;
  clinicalReasoning: string;
  conservativeEscalation: boolean;
  conservativeReason?: string;
}

export type CommsMode = "LEO_REALTIME" | "MARS_20M_DELAY" | "BLACKOUT";

export interface QueuedDossier {
  id: string;
  sol: number;
  crewId: CrewMemberId;
  timestamp: string;
  status: "QUEUED_LOCAL" | "TRANSMITTING" | "SYNCED";
  sizeKb: number;
  summary: string;
}

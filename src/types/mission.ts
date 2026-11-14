export type AnatomicalZone =
  | "CRANIAL_SANS"
  | "CARDIOVASCULAR"
  | "MUSCULOSKELETAL"
  | "IMMUNE_METABOLIC"
  | "NEURO_BEHAVIORAL";

export type HealthStatus = "NOMINAL" | "ATTENTION" | "CRITICAL";

export interface DailyHealthMetric {
  sol: number; // Sol 1 to 30
  systolicBP: number; // mmHg (Baseline ~118, Space threshold 140)
  diastolicBP: number; // mmHg (Baseline ~76, Space threshold 90)
  heartRate: number; // bpm (Baseline ~68)
  bloodSugar: number; // mg/dL (Baseline ~92)
  bodyTemp: number; // °C (Baseline ~36.8)
  sleepHours: number; // hours (Baseline ~7.4)
  moodScore: number; // 1 to 10 scale (Baseline ~8.5)
  radiationDoseRate: number; // mSv/hr
  sensorConfidence: number; // % (0-100% signal quality)
  alertSuppressed: boolean; // True if sensor glitch / noise detected
  eventTag?: string; // e.g. "Sensor Artifact", "Sleep Fragmentation", "BP Escalation"
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
}

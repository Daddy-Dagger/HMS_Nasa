export type HazardLevel = "NOMINAL" | "MODERATE_STRAIN" | "CRITICAL_DRIFT";

export interface TelemetryState {
  radiationDose: number; // mSv/hr
  cabinCO2: number; // mmHg
  sleepDebt: number; // Hours
  psychomotorJitter: number; // ms variance
  keystrokeLatency: number; // ms average
  circadianSpectrum: string; // K (Kelvin)
  scrubberDutyCycle: number; // %
  flightEnvelopeDamping: number; // % (Auto-assist level)
  taskAuthority: "SOLO_MANUAL" | "ASSISTED_DAMPED" | "DUAL_CONSENSUS";
}

export interface PVTResult {
  reactionTime: number; // ms
  isLapse: boolean; // > 350ms or premature
  timestamp: number;
}

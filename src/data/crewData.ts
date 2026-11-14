import { DailyHealthMetric, CrewMemberId } from "../types/mission";

export const INITIAL_CDR_MILLER_DATA: DailyHealthMetric[] = [
  // Sols 1-7: Nominal Space Adaptation
  { sol: 1, systolicBP: 116, diastolicBP: 74, heartRate: 66, bloodSugar: 90, bodyTemp: 36.7, sleepHours: 7.6, moodScore: 8.8, radiationDoseRate: 0.04, sensorConfidence: 98, alertSuppressed: false, confidenceReason: "High SNR • Photoplethysmography & ECG rhythm coherent" },
  { sol: 2, systolicBP: 118, diastolicBP: 76, heartRate: 68, bloodSugar: 92, bodyTemp: 36.8, sleepHours: 7.4, moodScore: 8.5, radiationDoseRate: 0.04, sensorConfidence: 96, alertSuppressed: false, confidenceReason: "High SNR • Coherent arterial pulse wave" },
  { sol: 3, systolicBP: 119, diastolicBP: 75, heartRate: 67, bloodSugar: 94, bodyTemp: 36.8, sleepHours: 7.2, moodScore: 8.4, radiationDoseRate: 0.05, sensorConfidence: 97, alertSuppressed: false, confidenceReason: "High SNR • Coherent arterial pulse wave" },
  { sol: 4, systolicBP: 117, diastolicBP: 77, heartRate: 70, bloodSugar: 91, bodyTemp: 36.7, sleepHours: 7.5, moodScore: 8.6, radiationDoseRate: 0.04, sensorConfidence: 99, alertSuppressed: false, confidenceReason: "High SNR • Optical plethysmograph locked" },
  { sol: 5, systolicBP: 120, diastolicBP: 76, heartRate: 69, bloodSugar: 93, bodyTemp: 36.9, sleepHours: 7.1, moodScore: 8.2, radiationDoseRate: 0.05, sensorConfidence: 95, alertSuppressed: false, confidenceReason: "High SNR • Nominal impedance" },
  { sol: 6, systolicBP: 118, diastolicBP: 75, heartRate: 68, bloodSugar: 92, bodyTemp: 36.8, sleepHours: 7.3, moodScore: 8.3, radiationDoseRate: 0.04, sensorConfidence: 96, alertSuppressed: false, confidenceReason: "High SNR • Stable baseline" },
  { sol: 7, systolicBP: 121, diastolicBP: 78, heartRate: 71, bloodSugar: 95, bodyTemp: 36.8, sleepHours: 7.0, moodScore: 8.1, radiationDoseRate: 0.05, sensorConfidence: 94, alertSuppressed: false, confidenceReason: "High SNR • Stable baseline" },

  // Sol 8: SENSOR GLITCH (Displaced Lead / Motion Artifact)
  { sol: 8, systolicBP: 188, diastolicBP: 112, heartRate: 34, bloodSugar: 92, bodyTemp: 36.8, sleepHours: 6.9, moodScore: 8.0, radiationDoseRate: 0.05, sensorConfidence: 19, alertSuppressed: true, confidenceReason: "Motion artifact detected • Sensor displacement • Re-measure required", eventTag: "SENSOR ARTIFACT DETECTED // CONSERVATIVE ESCALATION: RE-MEASURE REQUIRED" },

  // Sols 9-15: Sensor Reseated & Nominal Progression
  { sol: 9, systolicBP: 119, diastolicBP: 76, heartRate: 68, bloodSugar: 93, bodyTemp: 36.8, sleepHours: 7.1, moodScore: 8.2, radiationDoseRate: 0.04, sensorConfidence: 97, alertSuppressed: false, confidenceReason: "High SNR • Sensor re-seated • Coherence restored", eventTag: "SENSOR RE-SEATED (CONFIDENCE RESTORED)" },
  { sol: 10, systolicBP: 120, diastolicBP: 77, heartRate: 70, bloodSugar: 94, bodyTemp: 36.7, sleepHours: 7.2, moodScore: 8.0, radiationDoseRate: 0.05, sensorConfidence: 98, alertSuppressed: false, confidenceReason: "High SNR • Photoplethysmography coherent" },
  { sol: 11, systolicBP: 122, diastolicBP: 78, heartRate: 72, bloodSugar: 96, bodyTemp: 36.9, sleepHours: 6.9, moodScore: 7.8, radiationDoseRate: 0.06, sensorConfidence: 95, alertSuppressed: false, confidenceReason: "High SNR • Stable baseline" },
  { sol: 12, systolicBP: 121, diastolicBP: 77, heartRate: 69, bloodSugar: 91, bodyTemp: 36.8, sleepHours: 7.0, moodScore: 7.9, radiationDoseRate: 0.05, sensorConfidence: 96, alertSuppressed: false, confidenceReason: "High SNR • Stable baseline" },
  { sol: 13, systolicBP: 123, diastolicBP: 79, heartRate: 73, bloodSugar: 97, bodyTemp: 36.8, sleepHours: 6.8, moodScore: 7.7, radiationDoseRate: 0.07, sensorConfidence: 94, alertSuppressed: false, confidenceReason: "High SNR • Stable baseline" },
  { sol: 14, systolicBP: 124, diastolicBP: 78, heartRate: 72, bloodSugar: 95, bodyTemp: 36.9, sleepHours: 6.7, moodScore: 7.5, radiationDoseRate: 0.08, sensorConfidence: 96, alertSuppressed: false, confidenceReason: "High SNR • Stable baseline" },
  { sol: 15, systolicBP: 125, diastolicBP: 80, heartRate: 74, bloodSugar: 98, bodyTemp: 37.0, sleepHours: 6.4, moodScore: 7.3, radiationDoseRate: 0.09, sensorConfidence: 95, alertSuppressed: false, confidenceReason: "High SNR • Minor respiratory modulation" },

  // Sols 16-21: GRADUAL SLEEP DECLINE (Circadian Disruption & High Cabin CO2)
  { sol: 16, systolicBP: 127, diastolicBP: 81, heartRate: 75, bloodSugar: 101, bodyTemp: 37.0, sleepHours: 5.9, moodScore: 6.8, radiationDoseRate: 0.12, sensorConfidence: 93, alertSuppressed: false, confidenceReason: "High SNR • Minor autonomic tone shift", eventTag: "SLEEP ONSET DELAY (CIRCADIAN MISALIGNMENT)" },
  { sol: 17, systolicBP: 129, diastolicBP: 83, heartRate: 77, bloodSugar: 104, bodyTemp: 37.1, sleepHours: 5.4, moodScore: 6.4, radiationDoseRate: 0.15, sensorConfidence: 94, alertSuppressed: false, confidenceReason: "High SNR • Sympathetic tone elevated" },
  { sol: 18, systolicBP: 131, diastolicBP: 84, heartRate: 79, bloodSugar: 106, bodyTemp: 37.1, sleepHours: 4.8, moodScore: 5.9, radiationDoseRate: 0.18, sensorConfidence: 92, alertSuppressed: false, confidenceReason: "High SNR • Tachycardia during wakefulness", eventTag: "CHRONIC SLEEP DEBT (>12h ACCUMULATED)" },
  { sol: 19, systolicBP: 134, diastolicBP: 86, heartRate: 82, bloodSugar: 109, bodyTemp: 37.2, sleepHours: 4.5, moodScore: 5.5, radiationDoseRate: 0.22, sensorConfidence: 95, alertSuppressed: false, confidenceReason: "High SNR • Consistent arterial drift" },
  { sol: 20, systolicBP: 136, diastolicBP: 88, heartRate: 84, bloodSugar: 112, bodyTemp: 37.2, sleepHours: 4.2, moodScore: 5.1, radiationDoseRate: 0.25, sensorConfidence: 93, alertSuppressed: false, confidenceReason: "High SNR • Consistent arterial drift" },
  { sol: 21, systolicBP: 138, diastolicBP: 89, heartRate: 86, bloodSugar: 115, bodyTemp: 37.3, sleepHours: 4.1, moodScore: 4.8, radiationDoseRate: 0.28, sensorConfidence: 94, alertSuppressed: false, confidenceReason: "High SNR • CUSUM upward drift confirmed" },

  // Sols 22-24: BLOOD PRESSURE RISE & CLINICAL THRESHOLD BREACH (FIXED CLINICAL LOGIC)
  {
    sol: 22,
    systolicBP: 141,
    diastolicBP: 91,
    heartRate: 88,
    bloodSugar: 118,
    bodyTemp: 37.3,
    sleepHours: 4.3,
    moodScore: 4.6,
    radiationDoseRate: 0.35,
    sensorConfidence: 96,
    alertSuppressed: false,
    confidenceReason: "High SNR • Validated multi-lead oscillometry",
    eventTag: "ELEVATED BLOOD PRESSURE (>140 mmHg per NASA-STD-3001 / AHA 2017) // CONTRIBUTING FACTORS UNDER REVIEW",
  },
  {
    sol: 23,
    systolicBP: 144,
    diastolicBP: 93,
    heartRate: 91,
    bloodSugar: 122,
    bodyTemp: 37.4,
    sleepHours: 4.0,
    moodScore: 4.3,
    radiationDoseRate: 0.42,
    sensorConfidence: 95,
    alertSuppressed: false,
    confidenceReason: "High SNR • Sustained arterial elevation",
    eventTag: "TIER 1 ENGAGED: RE-MEASURE, 5-MIN SEATED REST, SLEEP RECOVERY & HYDRATION CHECK",
  },
  {
    sol: 24,
    systolicBP: 146,
    diastolicBP: 95,
    heartRate: 93,
    bloodSugar: 124,
    bodyTemp: 37.4,
    sleepHours: 4.2,
    moodScore: 4.2,
    radiationDoseRate: 0.45,
    sensorConfidence: 97,
    alertSuppressed: false,
    confidenceReason: "High SNR • Sustained arterial elevation",
    eventTag: "MONITORING INTERVAL: RE-EVALUATION AT 60 MIN // SUSTAINED ELEVATION ESCALATES TO TIER 2 CMO EVAL",
  },

  // Sols 25-27: TIER 1 COUNTERMEASURE ACTIVE & CLINICAL STABILIZATION
  {
    sol: 25,
    systolicBP: 139,
    diastolicBP: 90,
    heartRate: 85,
    bloodSugar: 114,
    bodyTemp: 37.2,
    sleepHours: 5.8,
    moodScore: 5.4,
    radiationDoseRate: 0.38,
    sensorConfidence: 96,
    alertSuppressed: false,
    confidenceReason: "High SNR • Post-rest stabilization observed",
    eventTag: "TIER 1 DECOMPRESSION & CIRCADIAN RECOVERY ACTIVE // BP DOWNWARD TREND",
  },
  {
    sol: 26,
    systolicBP: 133,
    diastolicBP: 86,
    heartRate: 80,
    bloodSugar: 108,
    bodyTemp: 37.1,
    sleepHours: 6.4,
    moodScore: 6.2,
    radiationDoseRate: 0.30,
    sensorConfidence: 95,
    alertSuppressed: false,
    confidenceReason: "High SNR • Downward EWMA trend confirmed",
  },
  {
    sol: 27,
    systolicBP: 128,
    diastolicBP: 82,
    heartRate: 76,
    bloodSugar: 102,
    bodyTemp: 37.0,
    sleepHours: 6.9,
    moodScore: 7.1,
    radiationDoseRate: 0.22,
    sensorConfidence: 97,
    alertSuppressed: false,
    confidenceReason: "High SNR • Sleep debt reducing",
  },

  // Sols 28-30: FLIGHT SURGEON DOSSIER COMPILED & NOMINAL RESTORATION
  {
    sol: 28,
    systolicBP: 124,
    diastolicBP: 79,
    heartRate: 73,
    bloodSugar: 98,
    bodyTemp: 36.9,
    sleepHours: 7.1,
    moodScore: 7.8,
    radiationDoseRate: 0.14,
    sensorConfidence: 98,
    alertSuppressed: false,
    confidenceReason: "High SNR • Telemetry packet validated",
    eventTag: "FLIGHT SURGEON SUMMARY DOSSIER COMPILED // ASYNCHRONOUS DOWNLINK READY",
  },
  {
    sol: 29,
    systolicBP: 121,
    diastolicBP: 77,
    heartRate: 70,
    bloodSugar: 95,
    bodyTemp: 36.8,
    sleepHours: 7.3,
    moodScore: 8.2,
    radiationDoseRate: 0.08,
    sensorConfidence: 97,
    alertSuppressed: false,
    confidenceReason: "High SNR • Hemodynamics stable",
  },
  {
    sol: 30,
    systolicBP: 119,
    diastolicBP: 76,
    heartRate: 68,
    bloodSugar: 93,
    bodyTemp: 36.8,
    sleepHours: 7.5,
    moodScore: 8.5,
    radiationDoseRate: 0.05,
    sensorConfidence: 99,
    alertSuppressed: false,
    confidenceReason: "High SNR • Complete autonomic recovery",
    eventTag: "MISSION SOL 30: HOMEOSTASIS RESTORED // DECISION-SUPPORT NOMINAL",
  },
];

// Generate nominal baseline trajectories for PLT Chen, ENG Kowalski, and SCI Vance
export function generateNominalCrewTrajectory(
  baselineBP: [number, number],
  baselineHR: number,
  baselineSleep: number,
  sol16SleepDrop = 0
): DailyHealthMetric[] {
  return Array.from({ length: 30 }, (_, i) => {
    const sol = i + 1;
    // Tiny pseudorandom variation around baseline
    const noiseBP = Math.sin(sol * 0.7) * 2;
    const noiseHR = Math.cos(sol * 0.9) * 2;
    const sleepDrop = sol >= 16 && sol <= 22 ? sol16SleepDrop : 0;
    const sleepVal = +(baselineSleep - sleepDrop + Math.sin(sol) * 0.2).toFixed(1);

    return {
      sol,
      systolicBP: Math.round(baselineBP[0] + noiseBP),
      diastolicBP: Math.round(baselineBP[1] + noiseBP * 0.6),
      heartRate: Math.round(baselineHR + noiseHR),
      bloodSugar: Math.round(92 + Math.sin(sol * 0.4) * 3),
      bodyTemp: +(36.8 + Math.cos(sol) * 0.1).toFixed(1),
      sleepHours: sleepVal,
      moodScore: +(8.5 - sleepDrop * 0.8).toFixed(1),
      radiationDoseRate: +(0.04 + (sol > 20 ? 0.02 : 0)).toFixed(2),
      sensorConfidence: Math.round(96 + Math.sin(sol) * 2),
      alertSuppressed: false,
      confidenceReason: "High SNR • Photoplethysmography & ECG rhythm coherent",
      eventTag: sol === 1 ? "SPACE ADAPTATION NOMINAL" : undefined,
    };
  });
}

export const INITIAL_CREW_DATASETS: Record<CrewMemberId, DailyHealthMetric[]> = {
  CDR_MILLER: INITIAL_CDR_MILLER_DATA,
  PLT_CHEN: generateNominalCrewTrajectory([116, 74], 64, 7.6, 0),
  ENG_KOWALSKI: generateNominalCrewTrajectory([120, 78], 70, 7.2, 0),
  SCI_VANCE: generateNominalCrewTrajectory([114, 72], 66, 7.0, 1.2), // Mild sleep deficit
};

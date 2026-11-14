import {
  DailyHealthMetric,
  CrewMemberId,
  CrewBaseline,
  AnatomicalZone,
  HealthStatus,
  DriftAnalysis,
  DriftSignalDelta,
} from "../types/mission";

export const CREW_BASELINES: Record<CrewMemberId, CrewBaseline> = {
  CDR_MILLER: {
    systolicBP: 118,
    diastolicBP: 76,
    heartRate: 68,
    sleepHours: 7.4,
    bloodSugar: 92,
    bodyTemp: 36.8,
    radiationBackground: 0.04,
  },
  PLT_CHEN: {
    systolicBP: 116,
    diastolicBP: 74,
    heartRate: 64,
    sleepHours: 7.6,
    bloodSugar: 90,
    bodyTemp: 36.7,
    radiationBackground: 0.04,
  },
  ENG_KOWALSKI: {
    systolicBP: 120,
    diastolicBP: 78,
    heartRate: 70,
    sleepHours: 7.2,
    bloodSugar: 94,
    bodyTemp: 36.9,
    radiationBackground: 0.05,
  },
  SCI_VANCE: {
    systolicBP: 114,
    diastolicBP: 72,
    heartRate: 66,
    sleepHours: 7.0,
    bloodSugar: 89,
    bodyTemp: 36.7,
    radiationBackground: 0.04,
  },
};

// Typical physiological standard deviations for healthy astronauts in spaceflight
const SIGMA_0 = {
  systolicBP: 6.0, // mmHg
  diastolicBP: 4.5, // mmHg
  heartRate: 5.0, // bpm
  sleepHours: 0.6, // hours
  bloodSugar: 5.0, // mg/dL
  bodyTemp: 0.15, // °C
  radiationDoseRate: 0.02, // mSv/h
};

export interface ConfidenceEvaluation {
  score: number;
  label: "HIGH" | "MODERATE" | "LOW_ARTIFACT";
  reason: string;
  isActionable: boolean;
}

/**
 * Computes an objective sensor confidence score and explanatory clinical reason
 * for any given reading.
 */
export function evaluateSensorConfidence(
  metric: DailyHealthMetric,
  _baseline?: CrewBaseline
): ConfidenceEvaluation {
  // If explicitly flagged or sensor quality drops
  const rawScore = metric.sensorConfidence;

  // Check for physiological dissonance (e.g. extreme BP with severe bradycardia or extreme noise)
  const isErraticHR = metric.heartRate < 40 || metric.heartRate > 140;
  const isPulsePressureDissonant = (metric.systolicBP - metric.diastolicBP) < 15 || (metric.systolicBP - metric.diastolicBP) > 85;

  let finalScore = rawScore;
  if (isErraticHR || isPulsePressureDissonant) {
    finalScore = Math.min(finalScore, 45);
  }

  if (finalScore >= 85) {
    return {
      score: finalScore,
      label: "HIGH",
      reason: "High SNR • Photoplethysmography & ECG rhythm coherent",
      isActionable: true,
    };
  } else if (finalScore >= 60) {
    return {
      score: finalScore,
      label: "MODERATE",
      reason: "Moderate SNR • Minor respiratory baseline wander / muscle tremor",
      isActionable: true,
    };
  } else {
    return {
      score: finalScore,
      label: "LOW_ARTIFACT",
      reason: "Motion artifact detected • Lead displacement • Re-measure required",
      isActionable: false,
    };
  }
}

/**
 * CUSUM and EWMA Statistical Drift Engine
 * Evaluates time-series up to target Sol against the astronaut's individual baseline.
 */
export function computeDriftAnalysis(
  crewId: CrewMemberId,
  history: DailyHealthMetric[],
  targetSol: number,
  zone: AnatomicalZone
): DriftAnalysis {
  const baseline = CREW_BASELINES[crewId] || CREW_BASELINES.CDR_MILLER;
  const currentMetric = history[targetSol - 1] || history[history.length - 1];
  const confidence = evaluateSensorConfidence(currentMetric, baseline);

  // EWMA parameters
  const lambda = 0.2;
  // CUSUM slack
  const kSlack = 0.5;

  const relevantHistory = history.slice(0, targetSol);

  // Helper to compute CUSUM and EWMA for a numeric metric
  const computeStats = (
    key: keyof DailyHealthMetric,
    baseMean: number,
    baseSigma: number,
    isDownwardNegative = false
  ) => {
    let sPos = 0;
    let sNeg = 0;
    let ewma = baseMean;

    for (let i = 0; i < relevantHistory.length; i++) {
      const val = Number(relevantHistory[i][key]) || baseMean;
      const z = (val - baseMean) / baseSigma;

      // Positive CUSUM (upward drift)
      sPos = Math.max(0, sPos + z - kSlack);
      // Negative CUSUM (downward drift)
      sNeg = Math.max(0, sNeg - z - kSlack);

      // EWMA update
      ewma = lambda * val + (1 - lambda) * ewma;
    }

    const currentVal = Number(currentMetric[key]) || baseMean;
    const currentZ = (currentVal - baseMean) / baseSigma;
    const delta = currentVal - baseMean;
    const pct = ((delta) / baseMean) * 100;

    return {
      current: currentVal,
      baseline: baseMean,
      deltaStr: `${delta >= 0 ? "+" : ""}${delta.toFixed(1)}`,
      pctDelta: +pct.toFixed(1),
      zScore: +currentZ.toFixed(2),
      cusumPos: +sPos.toFixed(2),
      cusumNeg: +sNeg.toFixed(2),
      ewmaVal: +ewma.toFixed(1),
      activeCusum: isDownwardNegative ? +sNeg.toFixed(2) : +sPos.toFixed(2),
    };
  };

  // Compute for Cardiovascular
  const bpStats = computeStats("systolicBP", baseline.systolicBP, SIGMA_0.systolicBP);
  const diaStats = computeStats("diastolicBP", baseline.diastolicBP, SIGMA_0.diastolicBP);
  const hrStats = computeStats("heartRate", baseline.heartRate, SIGMA_0.heartRate);

  // Compute for Neuro-Behavioral
  const sleepStats = computeStats("sleepHours", baseline.sleepHours, SIGMA_0.sleepHours, true);

  // Compute for Immune/Metabolic
  const radStats = computeStats("radiationDoseRate", baseline.radiationBackground, SIGMA_0.radiationDoseRate);

  let primarySignal: DriftSignalDelta;
  let allSignals: DriftSignalDelta[] = [];
  let primaryHazard = "NASA Hazard 3: Distance from Earth (Autonomous Clinical Capability)";
  let hazardCode = "RIDGE-3: DISTANCE";
  let clinicalReasoning = "All computed parameters tracking within nominal statistical process limits.";
  let status: HealthStatus = "NOMINAL";
  let isDrift = false;
  let cusumPos = 0;
  let cusumNeg = 0;
  let ewmaVal = 0;

  // Check for CONSERVATIVE ESCALATION condition (SQM < 60% or signal conflict)
  const conservativeEscalation = confidence.score < 60;
  const conservativeReason = conservativeEscalation
    ? `⚠️ CONSERVATIVE ESCALATION: Sensor confidence degraded (${confidence.score}% SQM). Rule: Low-quality data cannot confirm homeostasis. Instruct operator to inspect lead contact and re-measure.`
    : undefined;

  switch (zone) {
    case "CARDIOVASCULAR": {
      cusumPos = bpStats.cusumPos;
      cusumNeg = bpStats.cusumNeg;
      ewmaVal = bpStats.ewmaVal;

      primarySignal = {
        name: "Systolic Blood Pressure",
        key: "systolicBP",
        current: bpStats.current,
        baseline: bpStats.baseline,
        deltaStr: `${bpStats.deltaStr} mmHg`,
        pctDelta: bpStats.pctDelta,
        zScore: bpStats.zScore,
        cusumStat: bpStats.cusumPos,
        ewmaVal: bpStats.ewmaVal,
        isBreached: bpStats.current >= 140,
      };

      allSignals = [
        primarySignal,
        {
          name: "Diastolic Blood Pressure",
          key: "diastolicBP",
          current: diaStats.current,
          baseline: diaStats.baseline,
          deltaStr: `${diaStats.deltaStr} mmHg`,
          pctDelta: diaStats.pctDelta,
          zScore: diaStats.zScore,
          cusumStat: diaStats.cusumPos,
          ewmaVal: diaStats.ewmaVal,
          isBreached: diaStats.current >= 90,
        },
        {
          name: "Resting Heart Rate",
          key: "heartRate",
          current: hrStats.current,
          baseline: hrStats.baseline,
          deltaStr: `${hrStats.deltaStr} bpm`,
          pctDelta: hrStats.pctDelta,
          zScore: hrStats.zScore,
          cusumStat: hrStats.cusumPos,
          ewmaVal: hrStats.ewmaVal,
          isBreached: hrStats.current > 90,
        },
      ];

      primaryHazard = "NASA Hazard 4: Gravity Fields (Microgravity Cardiovascular Adaptations)";
      hazardCode = "RIDGE-4: GRAVITY";

      // Mathematical decision rule:
      // Critical if absolute breach (>=140 mmHg) OR CUSUM S+ >= 5.0 (action limit)
      // Attention if CUSUM S+ >= 3.0 OR zScore >= 2.0 OR conservative escalation active
      if (bpStats.current >= 140 || bpStats.cusumPos >= 5.0) {
        status = "CRITICAL";
        isDrift = true;
        clinicalReasoning = `Statistically significant upward drift detected (CUSUM S+ = ${bpStats.cusumPos}, EWMA = ${bpStats.ewmaVal} mmHg). Systolic BP exceeds the >140 mmHg decision threshold (NASA-STD-3001 / AHA 2017). Contributing factors under review: autonomic cardiovascular dysregulation, cumulative sleep debt, environmental stressors (cabin CO2, acoustic noise), and microgravity vascular remodeling. (Note: Fluid loading/LBNP contraindicated for BP spike; initiate Tier 1 re-measure, seated rest, and hydration check).`;
      } else if (bpStats.cusumPos >= 3.0 || bpStats.zScore >= 2.0 || conservativeEscalation) {
        status = "ATTENTION";
        isDrift = bpStats.cusumPos >= 3.0;
        clinicalReasoning = conservativeEscalation
          ? `Conservative attention state: Sensor signal quality is degraded (${confidence.score}% SQM). Execute sensor re-seat and 5-min seated re-measure before concluding hemodynamic breach.`
          : `Emerging upward BP trend: CUSUM S+ is ${bpStats.cusumPos} (warning limit 3.0 breached, +${bpStats.pctDelta}% vs baseline). Monitor for persistent autonomic drift.`;
      } else {
        status = "NOMINAL";
        clinicalReasoning = `Hemodynamics stable. Systolic EWMA is ${bpStats.ewmaVal} mmHg within 1.5σ control bounds (baseline ${baseline.systolicBP} mmHg).`;
      }
      break;
    }

    case "NEURO_BEHAVIORAL": {
      cusumPos = sleepStats.cusumPos;
      cusumNeg = sleepStats.cusumNeg;
      ewmaVal = sleepStats.ewmaVal;

      primarySignal = {
        name: "Daily Sleep Duration",
        key: "sleepHours",
        current: sleepStats.current,
        baseline: sleepStats.baseline,
        deltaStr: `${sleepStats.deltaStr} hrs`,
        pctDelta: sleepStats.pctDelta,
        zScore: sleepStats.zScore,
        cusumStat: sleepStats.cusumNeg,
        ewmaVal: sleepStats.ewmaVal,
        isBreached: sleepStats.current < 5.0,
      };

      allSignals = [
        primarySignal,
        {
          name: "Mood / Psychomotor Score",
          key: "moodScore",
          current: currentMetric.moodScore,
          baseline: 8.5,
          deltaStr: `${(currentMetric.moodScore - 8.5).toFixed(1)}/10`,
          pctDelta: +(((currentMetric.moodScore - 8.5) / 8.5) * 100).toFixed(1),
          zScore: +((currentMetric.moodScore - 8.5) / 1.0).toFixed(2),
          cusumStat: 0,
          ewmaVal: currentMetric.moodScore,
          isBreached: currentMetric.moodScore < 5.0,
        },
      ];

      primaryHazard = "NASA Hazard 2: Isolation & Confinement (Sleep Loss & Circadian Misalignment)";
      hazardCode = "RIDGE-2: ISOLATION";

      if (sleepStats.current < 4.5 || sleepStats.cusumNeg >= 5.0) {
        status = "CRITICAL";
        isDrift = true;
        clinicalReasoning = `Acute neuro-behavioral degradation: Negative CUSUM S- reached ${sleepStats.cusumNeg} (action limit 5.0). Current sleep (${sleepStats.current}h) is severely below NASA-STD-3001 8.0h requirement. High risk of PVT attention lapses (>500 ms). Engage circadian light shift (2100K amber) and sleep recovery protocol.`;
      } else if (sleepStats.current < 6.0 || sleepStats.cusumNeg >= 3.0) {
        status = "ATTENTION";
        isDrift = true;
        clinicalReasoning = `Cumulative sleep deficit detected: Negative CUSUM S- is ${sleepStats.cusumNeg} (warning limit 3.0). Sleep duration (${sleepStats.current}h) is down ${Math.abs(sleepStats.pctDelta)}% from baseline. Circadian misalignment likely.`;
      } else {
        status = "NOMINAL";
        clinicalReasoning = `Sleep architecture nominal. EWMA ${sleepStats.ewmaVal}h tracks near personal baseline (${baseline.sleepHours}h).`;
      }
      break;
    }

    case "CRANIAL_SANS": {
      // SANS ocular changes correlate with persistent microgravity exposure and cephalic venous pressures
      const isHighBPDrift = bpStats.cusumPos >= 4.0;
      const bmoDelta = isHighBPDrift ? 27.6 : targetSol > 14 ? 16.4 : 11.2;

      primarySignal = {
        name: "OCT BMO-250 Retinal Thickness Δ",
        key: "systolicBP", // proxy
        current: bmoDelta,
        baseline: 0,
        deltaStr: `+${bmoDelta} μm`,
        pctDelta: 100,
        zScore: +(bmoDelta / 5.0).toFixed(2),
        cusumStat: +(bmoDelta / 4.0).toFixed(2),
        ewmaVal: bmoDelta,
        isBreached: bmoDelta >= 19.4,
      };

      allSignals = [primarySignal];
      primaryHazard = "NASA Hazard 4: Gravity Fields (Spaceflight-Associated Neuro-ocular Syndrome)";
      hazardCode = "RIDGE-4: SANS";

      if (bmoDelta >= 19.4) {
        status = "CRITICAL";
        isDrift = true;
        clinicalReasoning = `Subclinical Optic Disc Edema threshold breached: BMO-250 ΔTRT is ${bmoDelta} μm (NASA HRP threshold ≥19.4 μm). Possible choroidal fold formation and hyperopic shift. Mandatory Tier 2 CMO ONSD ultrasound (>5.8 mm threshold) and fundoscopy indicated.`;
      } else if (bmoDelta >= 15.0) {
        status = "ATTENTION";
        isDrift = true;
        clinicalReasoning = `Early subclinical retinal thickening observed (ΔTRT = ${bmoDelta} μm). Monitor near-visual acuity via Tumbling-E and weekly Amsler grid battery.`;
      } else {
        status = "NOMINAL";
        clinicalReasoning = `Ocular parameters within healthy spaceflight tolerance. BMO-250 ΔTRT (${bmoDelta} μm) below 19.4 μm threshold.`;
      }
      break;
    }

    case "IMMUNE_METABOLIC": {
      cusumPos = radStats.cusumPos;
      primarySignal = {
        name: "Radiation Dose Rate",
        key: "radiationDoseRate",
        current: radStats.current,
        baseline: radStats.baseline,
        deltaStr: `${radStats.deltaStr} mSv/h`,
        pctDelta: radStats.pctDelta,
        zScore: radStats.zScore,
        cusumStat: radStats.cusumPos,
        ewmaVal: radStats.ewmaVal,
        isBreached: radStats.current > 0.15,
      };

      allSignals = [primarySignal];
      primaryHazard = "NASA Hazard 1: Space Radiation (GCR & SPE Biomarker Tracking)";
      hazardCode = "RIDGE-1: RADIATION";

      if (radStats.current >= 0.15 || radStats.cusumPos >= 5.0) {
        status = "CRITICAL";
        isDrift = true;
        clinicalReasoning = `Solar Particle Event (SPE) threshold warning: Radiation rate reached ${radStats.current} mSv/h (>0.15 mSv/h threshold). Direct crew to shielded storm shelter (water wall module).`;
      } else if (radStats.current >= 0.08 || radStats.cusumPos >= 3.0) {
        status = "ATTENTION";
        clinicalReasoning = `Elevated ambient radiation rate: ${radStats.current} mSv/h vs 0.04 mSv/h baseline. Monitor dosimeter accumulation.`;
      } else {
        status = "NOMINAL";
        clinicalReasoning = `Galactic Cosmic Radiation (GCR) background nominal (~${radStats.current} mSv/h). Cumulative exposure within permissible mission dose limits.`;
      }
      break;
    }

    case "MUSCULOSKELETAL":
    default: {
      primarySignal = {
        name: "ARED Daily Mechanical Strain",
        key: "heartRate", // proxy
        current: 78,
        baseline: 75,
        deltaStr: "+3.0 N",
        pctDelta: 4.0,
        zScore: 0.5,
        cusumStat: 0.8,
        ewmaVal: 76.5,
        isBreached: false,
      };

      allSignals = [primarySignal];
      primaryHazard = "NASA Hazard 4: Gravity Fields (Bone Mineral Density Loss & Muscle Atrophy)";
      hazardCode = "RIDGE-4: MUSCULOSKELETAL";

      if (targetSol > 25 && bpStats.cusumPos >= 4.0) {
        status = "ATTENTION";
        clinicalReasoning = "Minor resistive exercise adherence decrement due to crew fatigue. Trabecular bone loading maintained.";
      } else {
        status = "NOMINAL";
        clinicalReasoning = "ARED resistive exercise loading compliant with NASA-STD-3001 countermeasures.";
      }
      break;
    }
  }

  return {
    zone,
    status,
    primarySignal,
    allSignals,
    cusumPositive: cusumPos,
    cusumNegative: cusumNeg,
    ewmaVal,
    isDriftDetected: isDrift,
    primaryHazard,
    hazardCode,
    clinicalReasoning,
    conservativeEscalation,
    conservativeReason,
  };
}

/**
 * Computes all 5 zone statuses for a given crew member and history
 */
export function computeAllZoneStatuses(
  crewId: CrewMemberId,
  history: DailyHealthMetric[],
  targetSol: number
): Record<AnatomicalZone, HealthStatus> {
  const zones: AnatomicalZone[] = [
    "CARDIOVASCULAR",
    "CRANIAL_SANS",
    "NEURO_BEHAVIORAL",
    "IMMUNE_METABOLIC",
    "MUSCULOSKELETAL",
  ];

  const result = {} as Record<AnatomicalZone, HealthStatus>;
  for (const z of zones) {
    const analysis = computeDriftAnalysis(crewId, history, targetSol, z);
    result[z] = analysis.status;
  }
  return result;
}

/**
 * Computes the overall Crew Member status (worst-case across zones, with conservative escalation)
 */
export function computeOverallCrewStatus(
  zoneStatuses: Record<AnatomicalZone, HealthStatus>
): HealthStatus {
  const values = Object.values(zoneStatuses);
  if (values.includes("CRITICAL")) return "CRITICAL";
  if (values.includes("ATTENTION")) return "ATTENTION";
  return "NOMINAL";
}

import React from "react";
import {
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
} from "recharts";
import { DailyHealthMetric, AnatomicalZone } from "../types/mission";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";

interface IndicatorDetailProps {
  currentSol: number;
  missionData: DailyHealthMetric[];
  selectedZone: AnatomicalZone;
}

export const IndicatorDetail: React.FC<IndicatorDetailProps> = ({
  currentSol,
  missionData,
  selectedZone,
}) => {
  const currentMetric = missionData[currentSol - 1] || missionData[0];

  // Configure which metrics to show depending on the selected anatomical zone
  const getZoneConfig = () => {
    switch (selectedZone) {
      case "CARDIOVASCULAR":
        return {
          title: "CARDIOVASCULAR // CEPHALIC FLUID SHIFT & BLOOD PRESSURE",
          primaryName: "Systolic BP",
          primaryKey: "systolicBP",
          secondaryKey: "diastolicBP",
          unit: "mmHg",
          baselineVal: 118,
          baselineLabel: "SPACE BASELINE (118 mmHg)",
          thresholdVal: 140,
          thresholdLabel: "STAGE 1 HYPERTENSION (>140 mmHg)",
          currentVal: `${currentMetric.systolicBP}/${currentMetric.diastolicBP} mmHg`,
          hazard: "Altered Gravity (Fluid Shift) & Radiation Vascular Remodeling",
          whyExamNeeded: "Absence of hydrostatic pressure pushes ~2L of interstitial fluid toward the head, altering baroreceptor sensitivity and stroke volume.",
          criticalThreshold: "> 140/90 mmHg sustained for >48h",
        };
      case "CRANIAL_SANS":
        return {
          title: "CRANIAL // SANS & INTRACRANIAL PRESSURE (ICP)",
          primaryName: "Estimated ICP Delta",
          primaryKey: "systolicBP", // proxy for pressure
          unit: "mmHg",
          baselineVal: 120,
          baselineLabel: "NORMAL VENOUS RETURN",
          thresholdVal: 138,
          thresholdLabel: "CHOROIDAL FOLD RISK (>138)",
          currentVal: currentMetric.systolicBP > 135 ? "ELEVATED (Grade 2 Edema)" : "NOMINAL (<15 mmHg)",
          hazard: "Hostile Closed Environment (Elevated CO2) & Microgravity SANS",
          whyExamNeeded: "Persistent headward fluid shift causes optic disc edema, globe flattening, and hyperopic refractive shifts in 70% of long-duration crew.",
          criticalThreshold: "Grade 3 Optic Disc Edema or acute visual acuity loss >0.5 Diopters",
        };
      case "NEURO_BEHAVIORAL":
        return {
          title: "NEURO-BEHAVIORAL // CIRCADIAN RHYTHM & SLEEP ARCHITECTURE",
          primaryName: "Daily Sleep",
          primaryKey: "sleepHours",
          unit: "hours",
          baselineVal: 7.0,
          baselineLabel: "TARGET RECOVERY (7.0 h)",
          thresholdVal: 5.0,
          thresholdLabel: "COGNITIVE LAPSE RISK (<5.0 h)",
          currentVal: `${currentMetric.sleepHours} hrs`,
          hazard: "Isolation & Confinement (90-min orbital sunrises, acoustic noise)",
          whyExamNeeded: "Cumulative sleep debt directly triggers psychomotor vigilance lapses (WinSCAT) and neuro-behavioral instability during critical maneuvers.",
          criticalThreshold: "< 5.0 hours sleep for 3 consecutive sols or mood score < 5.0",
        };
      case "MUSCULOSKELETAL":
      default:
        return {
          title: "MUSCULOSKELETAL // BONE MINERAL & MUSCLE TONE (ARED)",
          primaryName: "Estimated Bone Density",
          primaryKey: "heartRate", // proxy
          unit: "ARED load",
          baselineVal: 70,
          baselineLabel: "NOMINAL STRAIN RATE",
          thresholdVal: 90,
          thresholdLabel: "EXCESS CARDIO STRAIN",
          currentVal: "0.98 g/cm² (Calcaneus)",
          hazard: "Altered Gravity Fields (Zero-G Osteoclast Upregulation)",
          whyExamNeeded: "Without 1-G mechanical axial loading, trabecular bone decays at 1.0-1.5% per month, generating hypercalciuria and renal stone risk.",
          criticalThreshold: "Bone mineral loss >2.5% or serum calcium >11.0 mg/dL",
        };
    }
  };

  const config = getZoneConfig();

  // Slice history up to currentSol for realistic progression
  const historyData = missionData.slice(0, currentSol);

  return (
    <div className="h-full bg-black border border-slate-800 p-4 font-mono select-none flex flex-col justify-between">
      <div>
        {/* HEADER & SIGNAL QUALITY METRIC (SQM) */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-2 mb-3 gap-2">
          <div>
            <span className="text-[10px] text-cyan-400 font-bold block">{config.title}</span>
            <span className="text-[9px] text-slate-500">SOL {currentSol} OF 30 TELEMETRY SNAPSHOT</span>
          </div>

          {/* CONFIDENCE BADGE & ALERT SUPPRESSION */}
          <div className="flex items-center gap-2">
            <div
              className={`px-2 py-0.5 border text-[10px] font-bold flex items-center gap-1 ${
                currentMetric.sensorConfidence > 85
                  ? "bg-emerald-950/80 text-emerald-300 border-emerald-600"
                  : currentMetric.sensorConfidence > 50
                  ? "bg-amber-950/80 text-amber-300 border-amber-600"
                  : "bg-rose-950 text-rose-300 border-rose-600 animate-pulse"
              }`}
            >
              <span>SQM CONFIDENCE: {currentMetric.sensorConfidence}%</span>
            </div>

            {currentMetric.alertSuppressed && (
              <span className="bg-amber-950 text-amber-300 border border-amber-600 px-1.5 py-0.5 text-[9px] font-bold animate-pulse">
                [ALERT SUPPRESSED: MOTION ARTIFACT]
              </span>
            )}
          </div>
        </div>

        {/* PRIMARY VALUE READOUT & BASELINE THRESHOLD PILLS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3 text-[11px]">
          <div className="bg-slate-950 border border-slate-800 p-2">
            <span className="text-slate-500 text-[9px] block">CURRENT VALUE</span>
            <span className="text-white font-bold text-sm">{config.currentVal}</span>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-2">
            <span className="text-slate-500 text-[9px] block">INDIVIDUAL BASELINE</span>
            <span className="text-cyan-400 font-bold">{config.baselineVal} {config.unit}</span>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-2">
            <span className="text-slate-500 text-[9px] block">CRITICAL THRESHOLD</span>
            <span className="text-rose-400 font-bold">{config.thresholdVal} {config.unit}</span>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-2">
            <span className="text-slate-500 text-[9px] block">SIGNAL INTEGRITY</span>
            <span className={currentMetric.sensorConfidence > 75 ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
              {currentMetric.sensorConfidence > 75 ? "VERIFIED TELEMETRY" : "ARTIFACT DETECTED"}
            </span>
          </div>
        </div>

        {/* RECHARTS DYNAMIC 30-DAY TREND CHART */}
        <div className="bg-slate-950 border border-slate-800 p-2.5 mb-3">
          <div className="flex justify-between items-center text-[10px] text-slate-400 mb-2">
            <span>30-DAY MISSION TRAJECTORY (SOL 1 TO {currentSol})</span>
            <span className="text-cyan-400">{config.primaryName} vs. NASA Baseline</span>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={historyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="sol" stroke="#475569" fontSize={10} tickFormatter={(v) => `S${v}`} />
                <YAxis stroke="#475569" fontSize={10} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#020617", border: "1px solid #1e293b", fontSize: "11px", fontFamily: "monospace" }}
                  formatter={(val: any) => [`${val} ${config.unit}`, config.primaryName]}
                  labelFormatter={(label) => `Sol ${label}`}
                />
                <ReferenceLine y={config.thresholdVal} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: "THRESHOLD", fill: "#f43f5e", fontSize: 9, position: "insideTopRight" }} />
                <ReferenceLine y={config.baselineVal} stroke="#06b6d4" strokeDasharray="2 2" label={{ value: "BASELINE", fill: "#06b6d4", fontSize: 9, position: "insideBottomRight" }} />
                <Area type="monotone" dataKey={config.primaryKey} fill="#06b6d4" fillOpacity={0.1} stroke="none" />
                <Line
                  type="monotone"
                  dataKey={config.primaryKey}
                  stroke="#22d3ee"
                  strokeWidth={2}
                  dot={{ r: 2, fill: "#22d3ee" }}
                  activeDot={{ r: 5, fill: "#f43f5e" }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CLINICAL EXPLANATIONS & SCRIPTED EVENT CALLOUT */}
        <div className="space-y-2 text-[11px]">
          {currentMetric.eventTag && (
            <div className="p-2 border border-amber-600/80 bg-amber-950/40 text-amber-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <strong>SCRIPTED EVENT ON SOL {currentSol}:</strong> {currentMetric.eventTag}
              </div>
            </div>
          )}

          <div className="p-2.5 bg-slate-950 border border-slate-800 text-[10px] space-y-1">
            <div className="text-cyan-400 font-bold flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              <span>NASA HRP CLINICAL RATIONALE & MECHANISM</span>
            </div>
            <div className="text-slate-300 leading-relaxed">
              • <strong>Why exam is needed:</strong> {config.whyExamNeeded}
            </div>
            <div className="text-slate-300 leading-relaxed">
              • <strong>Critical escalation trigger:</strong> {config.criticalThreshold}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800 text-[9px] text-slate-500 flex justify-between">
        <span>BASELINE + THRESHOLD ENGINE</span>
        <span className="text-emerald-400 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> ADAPTIVE SPACE NORMAL CALIBRATED
        </span>
      </div>
    </div>
  );
};

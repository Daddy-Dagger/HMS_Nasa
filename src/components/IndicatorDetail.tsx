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
import { AlertTriangle, CheckCircle2, Info, Activity } from "lucide-react";

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

  const getZoneConfig = () => {
    switch (selectedZone) {
      case "CARDIOVASCULAR":
        return {
          title: "CARDIOVASCULAR // CEPHALIC FLUID SHIFT & HEMODYNAMICS",
          primaryName: "Systolic BP",
          primaryKey: "systolicBP",
          unit: "mmHg",
          baselineVal: 118,
          baselineLabel: "SPACE BASELINE (118 mmHg)",
          thresholdVal: 140,
          thresholdLabel: "STAGE 1 HYPERTENSION (>140 mmHg)",
          currentVal: `${currentMetric.systolicBP}/${currentMetric.diastolicBP} mmHg`,
          nasaCitation: "NASA HRP Cardiovascular Evidence Report (Lee, Saha, Suresh, Lytle 2022)",
          fluidShiftDetail: "1.8 Liters cephalad tissue fluid displacement with reduced plasma volume (10-15%).",
          whyExamNeeded: "Loss of hydrostatic pressure gradients alters baroreceptor reflex buffering and induces Internal Jugular Vein (IJV) vascular stasis.",
          criticalThreshold: "> 140/90 mmHg sustained for >48h or IJV retrograde flow detected on ultrasound.",
        };
      case "CRANIAL_SANS":
        return {
          title: "CRANIAL // SANS & OPTIC RETINAL THICKNESS (TRT)",
          primaryName: "BMO-250 TRT Delta",
          primaryKey: "systolicBP", // coupled in demo
          unit: "μm",
          baselineVal: 0,
          baselineLabel: "NORMAL BASELINE (0 μm)",
          thresholdVal: 19.4,
          thresholdLabel: "SANS SUBCLINICAL ODE THRESHOLD (≥19.4 μm)",
          currentVal: currentMetric.systolicBP > 138 ? "27.6 μm (Grade 2 ODE)" : "11.2 μm (Subclinical)",
          nasaCitation: "NASA HRP SANS Evidence Report (Laurie, Macias, Pardon, Mader 2022)",
          fluidShiftDetail: "Cephalad venous congestion elevates retrobulbar CSF pressure, expanding optic sheath.",
          whyExamNeeded: "70% of long-duration crew exhibit ocular signs. BMO-250 TRT ≥19.4 μm defines early subclinical Optic Disc Edema (OCT standard).",
          criticalThreshold: "OCT ΔTRT ≥19.4 μm or Frisén Scale Grade ≥1 via portable fundoscopy.",
        };
      case "NEURO_BEHAVIORAL":
        return {
          title: "NEURO-BEHAVIORAL // SLEEP ARCHITECTURE & PVT VIGILANCE",
          primaryName: "Daily Sleep",
          primaryKey: "sleepHours",
          unit: "hours",
          baselineVal: 8.0,
          baselineLabel: "NASA-STD-3001 STANDARD (8.0 h)",
          thresholdVal: 5.0,
          thresholdLabel: "CRITICAL LAPSE RISK (<5.0 h)",
          currentVal: `${currentMetric.sleepHours} hrs (Avg ISS: 6.0-6.4h)`,
          nasaCitation: "NASA HRP Sleep Loss & Work Overload Report (Flynn-Evans, Gregory, Whitmire 2023)",
          fluidShiftDetail: "In-flight sleep deficit averages 1.6-2.0h/night. Sustained wakefulness >16h produces BAC 0.05% impairment equivalent.",
          whyExamNeeded: "Sleep fragmentation drives objective attention lapses (>500ms PVT latency) and impairs working memory.",
          criticalThreshold: "<5.0 hours sleep for 3 consecutive sols or PVT reaction latency >500 ms.",
        };
      case "MUSCULOSKELETAL":
      default:
        return {
          title: "MUSCULOSKELETAL // BONE MINERAL DENSITY & ARED RESISTIVE LOAD",
          primaryName: "ARED Axial Load",
          primaryKey: "heartRate",
          unit: "N-load",
          baselineVal: 70,
          baselineLabel: "NOMINAL RESISTIVE STRAIN",
          thresholdVal: 90,
          thresholdLabel: "EXCESS CARDIOVASCULAR STRAIN",
          currentVal: "0.98 g/cm² Calcaneus",
          nasaCitation: "NASA HRP Osteo & Sensorimotor Evidence Report (Sibonga, Wood 2021)",
          fluidShiftDetail: "Microgravity eliminates 1-G skeletal loading; trabecular bone decays at 1.0-1.5% per month.",
          whyExamNeeded: "Daily resistive countermeasure loading (ARED) prevents irreversible cortical bone demineralization and hypercalciuria.",
          criticalThreshold: "Trabecular bone loss >2.5% or urinary calcium excretion spike.",
        };
    }
  };

  const config = getZoneConfig();
  const historyData = missionData.slice(0, currentSol);

  return (
    <div className="h-full bg-slate-950/80 backdrop-blur-md border border-cyan-500/20 rounded-xl p-4 font-mono select-none flex flex-col justify-between shadow-[0_0_25px_rgba(6,182,212,0.06)] relative overflow-hidden">
      {/* CORNER ACCENTS */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />

      <div>
        {/* HEADER BAR */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800/80 pb-2 mb-3 gap-2">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-bold tracking-widest text-white uppercase">
              {config.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* SENSOR CONFIDENCE BADGE */}
            <span
              className={`text-[9px] px-2 py-0.5 rounded border font-bold flex items-center gap-1 ${
                currentMetric.sensorConfidence < 60
                  ? "bg-rose-950/80 text-rose-300 border-rose-500 animate-pulse"
                  : currentMetric.sensorConfidence < 85
                  ? "bg-amber-950/80 text-amber-300 border-amber-500"
                  : "bg-cyan-950/80 text-cyan-300 border-cyan-600"
              }`}
            >
              {currentMetric.sensorConfidence >= 85 ? (
                <CheckCircle2 className="w-3 h-3 text-cyan-400" />
              ) : (
                <AlertTriangle className="w-3 h-3 text-amber-400" />
              )}
              SQM CONFIDENCE: {currentMetric.sensorConfidence}%
            </span>

            {/* ALERT SUPPRESSION FLAG */}
            {currentMetric.alertSuppressed && (
              <span className="text-[9px] px-2 py-0.5 bg-amber-950/90 text-amber-300 border border-amber-500 font-bold animate-pulse rounded">
                [ALERT SUPPRESSED: MOTION ARTIFACT]
              </span>
            )}
          </div>
        </div>

        {/* CURRENT METRIC CALLOUT & STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          <div className="bg-black/70 border border-slate-800/80 p-2.5 rounded-lg">
            <span className="text-[9px] text-slate-400 block mb-0.5">CURRENT LEVEL</span>
            <span className="text-base font-bold text-white tracking-wide">{config.currentVal}</span>
          </div>
          <div className="bg-black/70 border border-slate-800/80 p-2.5 rounded-lg">
            <span className="text-[9px] text-slate-400 block mb-0.5">ASTRONAUT BASELINE</span>
            <span className="text-base font-bold text-cyan-400">{config.baselineVal} {config.unit}</span>
          </div>
          <div className="bg-black/70 border border-slate-800/80 p-2.5 rounded-lg">
            <span className="text-[9px] text-slate-400 block mb-0.5">CRITICAL THRESHOLD</span>
            <span className="text-base font-bold text-rose-400">{config.thresholdVal} {config.unit}</span>
          </div>
          <div className="bg-black/70 border border-slate-800/80 p-2.5 rounded-lg">
            <span className="text-[9px] text-slate-400 block mb-0.5">SAMPLING RATE</span>
            <span className="text-base font-bold text-emerald-400">100 Hz Bio-Bus</span>
          </div>
        </div>

        {/* RECHARTS TIME-SERIES CONTAINER */}
        <div className="h-44 sm:h-52 w-full bg-black/60 border border-slate-800/80 rounded-xl p-2 mb-3">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="curveGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="sol" stroke="#64748b" fontSize={9} tickLine={false} tickFormatter={(val) => `S${val}`} />
              <YAxis stroke="#64748b" fontSize={9} tickLine={false} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#030712",
                  borderColor: "#06b6d4",
                  fontSize: "10px",
                  fontFamily: "monospace",
                  borderRadius: "8px",
                  boxShadow: "0 0 15px rgba(6,182,212,0.2)",
                }}
              />
              {/* Shaded space baseline band */}
              <ReferenceLine y={config.baselineVal} stroke="#06b6d4" strokeDasharray="3 3" label={{ value: config.baselineLabel, fill: '#06b6d4', fontSize: 8, position: 'insideBottomRight' }} />
              {/* Critical clinical threshold breach line */}
              <ReferenceLine y={config.thresholdVal} stroke="#f43f5e" strokeWidth={1.5} label={{ value: config.thresholdLabel, fill: '#f43f5e', fontSize: 8, position: 'insideTopRight' }} />
              <Area type="monotone" dataKey={config.primaryKey} stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#curveGlow)" />
              <Line type="monotone" dataKey={config.primaryKey} stroke="#22d3ee" strokeWidth={2} dot={{ r: 2, fill: "#22d3ee" }} activeDot={{ r: 5, fill: "#f43f5e" }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* CLINICAL NASA HRP EVIDENCE BREAKDOWN */}
        <div className="bg-black/60 border border-slate-800/80 rounded-xl p-3 text-[10px] space-y-2">
          <div className="flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
            <div>
              <span className="text-white font-bold block">FLUID SHIFT & SANS MECHANISM:</span>
              <span className="text-slate-400">{config.fluidShiftDetail}</span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <span className="text-white font-bold block">CLINICAL ACTION TRIGGER:</span>
              <span className="text-slate-400">{config.criticalThreshold}</span>
            </div>
          </div>
        </div>
      </div>

      {/* NASA CITATION FOOTNOTE */}
      <div className="mt-3 pt-2 border-t border-slate-900 text-[9px] text-slate-500 flex items-center justify-between">
        <span>AUTHORITATIVE EVIDENCE BASE:</span>
        <span className="text-cyan-400 font-bold">{config.nasaCitation}</span>
      </div>
    </div>
  );
};

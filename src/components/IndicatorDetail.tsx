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
import { AlertCircle, CheckCircle2, Info, Heart, Eye, Moon, Shield } from "lucide-react";

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
          icon: Heart,
          title: "Cardiovascular Telemetry",
          subtitle: "Cephalic Fluid Shift & Hemodynamics",
          primaryName: "Systolic BP",
          primaryKey: "systolicBP",
          unit: "mmHg",
          baselineVal: 118,
          baselineLabel: "Space Baseline (118 mmHg)",
          thresholdVal: 140,
          thresholdLabel: "Stage 1 Hypertension (>140 mmHg)",
          currentVal: `${currentMetric.systolicBP}/${currentMetric.diastolicBP}`,
          nasaCitation: "NASA HRP Cardiovascular Evidence (Lee, Saha, Suresh, Lytle 2022)",
          fluidShiftDetail: "1.8L cephalad tissue fluid displacement with reduced plasma volume (10–15%).",
          clinicalTrigger: "Systolic >140 mmHg sustained or IJV retrograde flow detected on ultrasound.",
        };
      case "CRANIAL_SANS":
        return {
          icon: Eye,
          title: "Cranial & Ocular Telemetry",
          subtitle: "SANS & Retinal Thickness Delta",
          primaryName: "BMO-250 TRT",
          primaryKey: "systolicBP",
          unit: "μm",
          baselineVal: 0,
          baselineLabel: "Baseline (0 μm)",
          thresholdVal: 19.4,
          thresholdLabel: "Subclinical ODE (≥19.4 μm)",
          currentVal: currentMetric.systolicBP > 138 ? "27.6 μm (Grade 2)" : "11.2 μm (Subclinical)",
          nasaCitation: "NASA HRP SANS Evidence Report (Laurie, Macias, Pardon, Mader 2022)",
          fluidShiftDetail: "Cephalad venous congestion elevates retrobulbar CSF pressure, expanding optic sheath.",
          clinicalTrigger: "OCT ΔTRT ≥19.4 μm or Frisén Scale Grade ≥1 via portable fundoscopy.",
        };
      case "NEURO_BEHAVIORAL":
        return {
          icon: Moon,
          title: "Neuro-Behavioral Telemetry",
          subtitle: "Sleep Architecture & PVT Vigilance",
          primaryName: "Daily Sleep",
          primaryKey: "sleepHours",
          unit: "hours",
          baselineVal: 8.0,
          baselineLabel: "NASA-STD-3001 (8.0h)",
          thresholdVal: 5.0,
          thresholdLabel: "Critical Lapse Risk (<5.0h)",
          currentVal: `${currentMetric.sleepHours} hrs`,
          nasaCitation: "NASA HRP Sleep Loss & Work Overload (Flynn-Evans, Gregory, Whitmire 2023)",
          fluidShiftDetail: "In-flight sleep deficit averages 1.6–2.0h/night, producing cognitive latency lapses.",
          clinicalTrigger: "<5.0 hours sleep for 3 consecutive sols or PVT reaction latency >500 ms.",
        };
      case "IMMUNE_METABOLIC":
        return {
          icon: Shield,
          title: "Radiation & Immune Telemetry",
          subtitle: "Galactic Cosmic Radiation & T-Cell Biomarkers",
          primaryName: "Radiation Dose Rate",
          primaryKey: "radiationDoseRate",
          unit: "mSv/h",
          baselineVal: 0.02,
          baselineLabel: "GCR Background (0.02 mSv/h)",
          thresholdVal: 0.15,
          thresholdLabel: "SPE Storm Warning (0.15 mSv/h)",
          currentVal: `${currentMetric.radiationDoseRate} mSv/h (${(currentMetric.radiationDoseRate * 24 * currentSol).toFixed(1)} mSv total)`,
          nasaCitation: "NASA HRP Space Radiation Evidence Report (Crucian, Cucinotta, Sams 2022)",
          fluidShiftDetail: "GCR ion tracks induce DNA double-strand breaks and latent viral reactivation (EBV/VZV).",
          clinicalTrigger: "Solar particle event flux >0.15 mSv/h or absolute lymphocyte count <1000/μL.",
        };
      case "MUSCULOSKELETAL":
      default:
        return {
          icon: Shield,
          title: "Musculoskeletal Telemetry",
          subtitle: "Bone Mineral Density & ARED Resistive Load",
          primaryName: "ARED Load",
          primaryKey: "heartRate",
          unit: "N-load",
          baselineVal: 70,
          baselineLabel: "Nominal Resistive Strain",
          thresholdVal: 90,
          thresholdLabel: "Excess Strain",
          currentVal: "0.98 g/cm² Calcaneus",
          nasaCitation: "NASA HRP Osteo & Sensorimotor Evidence (Sibonga, Wood 2021)",
          fluidShiftDetail: "Microgravity eliminates 1-G skeletal loading; trabecular bone decays 1.0–1.5% per month.",
          clinicalTrigger: "Trabecular bone loss >2.5% or urinary calcium excretion spike.",
        };
    }
  };

  const config = getZoneConfig();
  const historyData = missionData.slice(0, currentSol);
  const isBreached = currentMetric.systolicBP >= 140;

  return (
    <div className="glass-card rounded-3xl p-5 flex flex-col justify-between h-full shadow-[0_10px_35px_rgba(15,23,42,0.04)]">
      <div>
        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
              <config.icon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900 tracking-tight">
                {config.title}
              </h2>
              <p className="text-xs text-slate-400 font-medium">{config.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* SENSOR CONFIDENCE PILL */}
            <span
              className={`text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1.5 border ${
                currentMetric.sensorConfidence < 60
                  ? "bg-rose-50 text-rose-700 border-rose-200"
                  : currentMetric.sensorConfidence < 85
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
              }`}
            >
              {currentMetric.sensorConfidence >= 85 ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              )}
              SQM {currentMetric.sensorConfidence}%
            </span>

            {/* ALERT SUPPRESSION PILL */}
            {currentMetric.alertSuppressed && (
              <span className="text-xs px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 font-medium rounded-full animate-pulse">
                Artifact Filtered
              </span>
            )}
          </div>
        </div>

        {/* 4 STAT CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
          <div className="bg-slate-50/80 border border-slate-100 p-3 rounded-2xl">
            <span className="text-[11px] text-slate-400 font-medium block mb-1">Current level</span>
            <span className={`text-xl font-bold tracking-tight ${isBreached ? "text-rose-600" : "text-slate-900"}`}>
              {config.currentVal}
            </span>
          </div>

          <div className="bg-slate-50/80 border border-slate-100 p-3 rounded-2xl">
            <span className="text-[11px] text-slate-400 font-medium block mb-1">Astronaut baseline</span>
            <span className="text-xl font-bold text-indigo-600 tracking-tight">
              {config.baselineVal} <span className="text-xs text-slate-400 font-normal">{config.unit}</span>
            </span>
          </div>

          <div className="bg-slate-50/80 border border-slate-100 p-3 rounded-2xl">
            <span className="text-[11px] text-slate-400 font-medium block mb-1">Clinical threshold</span>
            <span className="text-xl font-bold text-rose-500 tracking-tight">
              {config.thresholdVal} <span className="text-xs text-slate-400 font-normal">{config.unit}</span>
            </span>
          </div>

          <div className="bg-slate-50/80 border border-slate-100 p-3 rounded-2xl">
            <span className="text-[11px] text-slate-400 font-medium block mb-1">Sampling rate</span>
            <span className="text-xl font-bold text-emerald-600 tracking-tight">
              100 <span className="text-xs text-slate-400 font-normal">Hz bus</span>
            </span>
          </div>
        </div>

        {/* CLEAN RECHARTS TIME-SERIES CONTAINER */}
        <div className="h-48 sm:h-56 w-full bg-slate-50/50 border border-slate-100 rounded-2xl p-3 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={historyData} margin={{ top: 12, right: 12, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="cleanCurveGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="sol" stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(val) => `S${val}`} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderColor: "#e2e8f0",
                  borderRadius: "16px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#0f172a",
                }}
              />
              {/* Baseline reference */}
              <ReferenceLine
                y={config.baselineVal}
                stroke="#818cf8"
                strokeDasharray="4 4"
                label={{ value: config.baselineLabel, fill: '#6366f1', fontSize: 10, position: 'insideBottomRight' }}
              />
              {/* Critical clinical threshold breach line */}
              <ReferenceLine
                y={config.thresholdVal}
                stroke="#f43f5e"
                strokeWidth={1.5}
                label={{ value: config.thresholdLabel, fill: '#f43f5e', fontSize: 10, position: 'insideTopRight' }}
              />
              <Area type="monotone" dataKey={config.primaryKey} stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#cleanCurveGlow)" />
              <Line type="monotone" dataKey={config.primaryKey} stroke="#4f46e5" strokeWidth={2.5} dot={{ r: 2.5, fill: "#4f46e5" }} activeDot={{ r: 6, fill: "#f43f5e" }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* CLINICAL EVIDENCE NOTES */}
        <div className="space-y-2">
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-indigo-50/60 border border-indigo-100/80 text-xs">
            <Info className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
            <div>
              <span className="font-semibold text-slate-800 block">Fluid Shift Mechanism</span>
              <span className="text-slate-500 leading-relaxed">{config.fluidShiftDetail}</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-50/60 border border-amber-100/80 text-xs">
            <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
            <div>
              <span className="font-semibold text-slate-800 block">Clinical Action Trigger</span>
              <span className="text-slate-500 leading-relaxed">{config.clinicalTrigger}</span>
            </div>
          </div>
        </div>
      </div>

      {/* CITATION FOOTER */}
      <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium">NASA HRP Evidence Base:</span>
        <span className="font-semibold text-indigo-600">{config.nasaCitation}</span>
      </div>
    </div>
  );
};

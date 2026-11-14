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
import { DailyHealthMetric, AnatomicalZone, CrewMemberId } from "../types/mission";
import { AlertCircle, CheckCircle2, Info, Heart, Eye, Moon, Shield } from "lucide-react";
import { computeDriftAnalysis, evaluateSensorConfidence, CREW_BASELINES } from "../utils/driftEngine";
import { AlertReasoningPanel } from "./AlertReasoningPanel";

interface IndicatorDetailProps {
  currentSol: number;
  missionData: DailyHealthMetric[];
  selectedZone: AnatomicalZone;
  activeCrewId?: CrewMemberId;
  onExecuteRemeasure?: () => void;
}

export const IndicatorDetail: React.FC<IndicatorDetailProps> = ({
  currentSol,
  missionData,
  selectedZone,
  activeCrewId = "CDR_MILLER",
  onExecuteRemeasure,
}) => {
  const currentMetric = missionData[currentSol - 1] || missionData[0];
  const baseline = CREW_BASELINES[activeCrewId] || CREW_BASELINES.CDR_MILLER;
  const confidence = evaluateSensorConfidence(currentMetric, baseline);
  const driftAnalysis = computeDriftAnalysis(activeCrewId, missionData, currentSol, selectedZone);

  const getZoneConfig = () => {
    switch (selectedZone) {
      case "CARDIOVASCULAR":
        return {
          icon: Heart,
          title: "Cardiovascular Telemetry",
          subtitle: "Autonomic Tone & Arterial Pressure Dynamics",
          primaryName: "Systolic BP",
          primaryKey: "systolicBP",
          unit: "mmHg",
          baselineVal: baseline.systolicBP,
          baselineLabel: `Baseline (${baseline.systolicBP} mmHg)`,
          thresholdVal: 140,
          thresholdLabel: "NASA-STD-3001 / AHA Threshold (>140 mmHg)",
          currentVal: `${currentMetric.systolicBP}/${currentMetric.diastolicBP}`,
          nasaCitation: "NASA HRP Cardiovascular Evidence Report (Lee, Saha, Suresh, Lytle 2022)",
          contributingFactors: "Contributing factors under review: autonomic cardiovascular dysregulation, cumulative sleep debt, environmental stressors (cabin CO2, acoustic noise), and microgravity vascular remodeling.",
          clinicalTrigger: "Systolic >140 mmHg sustained on re-measure after 5 min rest, or CUSUM S+ >= 5.0.",
          countermeasureNote: "Note: Fluid loading & LBNP contraindicated for acute BP elevation. Engage Tier 1 re-measure, seated rest, and hydration check.",
        };
      case "CRANIAL_SANS":
        return {
          icon: Eye,
          title: "Cranial & Ocular Telemetry",
          subtitle: "SANS & Retinal Thickness Delta",
          primaryName: "BMO-250 TRT",
          primaryKey: "systolicBP", // proxy for chart trend
          unit: "μm",
          baselineVal: 0,
          baselineLabel: "Pre-Flight Baseline (0 μm)",
          thresholdVal: 19.4,
          thresholdLabel: "Subclinical ODE Threshold (≥19.4 μm)",
          currentVal: currentMetric.systolicBP > 138 ? "27.6 μm (Grade 2)" : "11.2 μm (Subclinical)",
          nasaCitation: "NASA HRP SANS Evidence Report (Laurie, Macias, Pardon, Stenger 2022)",
          contributingFactors: "Persistent microgravity cephalad fluid redistribution elevates retrobulbar optic nerve sheath pressure and promotes posterior globe flattening.",
          clinicalTrigger: "OCT ΔTRT ≥19.4 μm, ONSD >5.8 mm on ultrasound, or Frisén Scale Grade ≥1.",
          countermeasureNote: "LBNP chaps (-35 mmHg for 30m) and hyperopic Space Glasses (+1.00D to +1.50D) evaluated as SANS countermeasures.",
        };
      case "NEURO_BEHAVIORAL":
        return {
          icon: Moon,
          title: "Neuro-Behavioral Telemetry",
          subtitle: "Sleep Architecture & PVT Vigilance",
          primaryName: "Daily Sleep",
          primaryKey: "sleepHours",
          unit: "hours",
          baselineVal: baseline.sleepHours,
          baselineLabel: `Baseline (${baseline.sleepHours}h per NASA-STD-3001)`,
          thresholdVal: 5.0,
          thresholdLabel: "Critical Lapse Risk Threshold (<5.0h)",
          currentVal: `${currentMetric.sleepHours} hrs`,
          nasaCitation: "NASA HRP Sleep Loss & Work Overload (Flynn-Evans, Gregory, Whitmire 2023)",
          contributingFactors: "Cumulative spaceflight sleep deficit (average 1.6–2.0h/night loss) combined with circadian desynchrony and mission operational workload.",
          clinicalTrigger: "<5.0 hours sleep for 2+ consecutive sols or PVT reaction latency lapse >500 ms.",
          countermeasureNote: "SSLA luminaire 2100K blue-depleted shift (<10 lux) 120 min pre-sleep and timed 0.5 mg micro-melatonin.",
        };
      case "IMMUNE_METABOLIC":
        return {
          icon: Shield,
          title: "Radiation & Immune Telemetry",
          subtitle: "Galactic Cosmic Radiation & Dosimetry",
          primaryName: "Radiation Dose Rate",
          primaryKey: "radiationDoseRate",
          unit: "mSv/h",
          baselineVal: baseline.radiationBackground,
          baselineLabel: `GCR Background (${baseline.radiationBackground} mSv/h)`,
          thresholdVal: 0.15,
          thresholdLabel: "SPE Storm Warning Threshold (>0.15 mSv/h)",
          currentVal: `${currentMetric.radiationDoseRate} mSv/h (${(currentMetric.radiationDoseRate * 24 * currentSol).toFixed(1)} mSv cumulative)`,
          nasaCitation: "NASA HRP Space Radiation Evidence Report (NASA-STD-3001 / NCRP Report 186, 2020)",
          contributingFactors: "Interplanetary transit beyond Earth's magnetosphere exposes crew to unshielded GCR and potential Solar Particle Events.",
          clinicalTrigger: "Solar particle event flux >0.15 mSv/h or dosimeter career permissible limit breach.",
          countermeasureNote: "Crew retreat to storm shelter (water wall shielded core module) until solar particle flux normalizes.",
        };
      case "MUSCULOSKELETAL":
      default:
        return {
          icon: Shield,
          title: "Musculoskeletal Telemetry",
          subtitle: "Bone Mineral Density & ARED Resistive Load",
          primaryName: "ARED Strain",
          primaryKey: "heartRate",
          unit: "N",
          baselineVal: 75,
          baselineLabel: "Prescribed ARED Load (75 N)",
          thresholdVal: 90,
          thresholdLabel: "Excess Mechanical Strain Threshold (>90 N)",
          currentVal: "0.98 g/cm² Calcaneus",
          nasaCitation: "NASA HRP Early Onset Osteoporosis Report (Sibonga, Spector, Keyak 2020)",
          contributingFactors: "Absence of gravitational weight-bearing induces 1.0–1.5% monthly trabecular bone mineral density reduction in weight-bearing bones.",
          clinicalTrigger: "Trabecular BMD loss >2.5% on dual-energy X-ray absorptiometry / ultrasound.",
          countermeasureNote: "Daily 2.5-hour ARED resistive exercise session paired with T2 cycle ergometry.",
        };
    }
  };

  const config = getZoneConfig();
  const historyData = missionData.slice(0, currentSol);
  const isBreached = driftAnalysis.status === "CRITICAL";

  return (
    <div className="glass-card rounded-3xl p-5 flex flex-col justify-between h-full shadow-[0_10px_35px_rgba(15,23,42,0.04)] space-y-4">
      <div>
        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
              <config.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-slate-900 tracking-tight">
                  {config.title}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  Synthetic
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">{config.subtitle}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* SENSOR CONFIDENCE PILL WITH EXPLICIT REASON */}
            <div
              className={`text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1.5 border ${
                confidence.score < 60
                  ? "bg-rose-50 text-rose-700 border-rose-200"
                  : confidence.score < 85
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
              }`}
              title={confidence.reason}
            >
              {confidence.score >= 85 ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              )}
              <span>SQM {confidence.score}% ({confidence.label})</span>
            </div>

            {/* CUSUM STATUS PILL */}
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-mono font-semibold border ${
                driftAnalysis.status === "CRITICAL"
                  ? "bg-rose-50 text-rose-700 border-rose-200 animate-pulse"
                  : driftAnalysis.status === "ATTENTION"
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-indigo-50 text-indigo-700 border-indigo-200"
              }`}
            >
              CUSUM S: {driftAnalysis.cusumPositive > 0 ? `+${driftAnalysis.cusumPositive}` : `-${driftAnalysis.cusumNegative}`}
            </span>
          </div>
        </div>

        {/* CONFIDENCE DETAIL REASON BANNER */}
        <div className="bg-slate-50/90 border border-slate-200/80 px-3.5 py-2 rounded-xl text-[11px] flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Signal Quality:</span>
            <span className="text-slate-700 font-medium">{confidence.reason}</span>
          </div>
          {confidence.score < 60 && onExecuteRemeasure && (
            <button
              onClick={onExecuteRemeasure}
              className="text-[11px] text-indigo-600 font-bold hover:underline shrink-0"
            >
              Re-measure now →
            </button>
          )}
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
            <span className="text-[11px] text-slate-400 font-medium block mb-1">Decision threshold</span>
            <span className="text-xl font-bold text-rose-500 tracking-tight">
              {config.thresholdVal} <span className="text-xs text-slate-400 font-normal">{config.unit}</span>
            </span>
          </div>

          <div className="bg-slate-50/80 border border-slate-100 p-3 rounded-2xl">
            <span className="text-[11px] text-slate-400 font-medium block mb-1">EWMA filter</span>
            <span className="text-xl font-bold text-emerald-600 tracking-tight">
              {driftAnalysis.ewmaVal} <span className="text-xs text-slate-400 font-normal">{config.unit}</span>
            </span>
          </div>
        </div>

        {/* TIME-SERIES CHART */}
        <div className="h-44 sm:h-52 w-full bg-slate-50/50 border border-slate-100 rounded-2xl p-3 mb-4">
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
              <ReferenceLine
                y={config.baselineVal}
                stroke="#818cf8"
                strokeDasharray="4 4"
                label={{ value: config.baselineLabel, fill: '#6366f1', fontSize: 10, position: 'insideBottomRight' }}
              />
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

        {/* ALERT REASONING & DRIFT COMPONENT */}
        <AlertReasoningPanel
          analysis={driftAnalysis}
          onExecuteRemeasure={onExecuteRemeasure}
        />

        {/* CLINICAL EVIDENCE NOTES */}
        <div className="space-y-2 pt-3">
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-indigo-50/60 border border-indigo-100/80 text-xs">
            <Info className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
            <div>
              <span className="font-semibold text-slate-800 block">Etiology & Contributing Factors</span>
              <span className="text-slate-600 leading-relaxed">{config.contributingFactors}</span>
              {config.countermeasureNote && (
                <span className="text-indigo-700 font-medium block mt-1">{config.countermeasureNote}</span>
              )}
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-50/60 border border-amber-100/80 text-xs">
            <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
            <div>
              <span className="font-semibold text-slate-800 block">Decision-Support Clinical Trigger</span>
              <span className="text-slate-600 leading-relaxed">{config.clinicalTrigger}</span>
            </div>
          </div>
        </div>
      </div>

      {/* VERIFIED CITATION FOOTER */}
      <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium">Verified NASA HRP Reference:</span>
        <span className="font-semibold text-indigo-600">{config.nasaCitation}</span>
      </div>
    </div>
  );
};

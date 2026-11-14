import React from "react";
import { DriftAnalysis } from "../types/mission";
import { ShieldAlert, AlertTriangle, Activity, Info, CheckCircle2, RefreshCw } from "lucide-react";

interface AlertReasoningPanelProps {
  analysis: DriftAnalysis;
  onExecuteRemeasure?: () => void;
}

export const AlertReasoningPanel: React.FC<AlertReasoningPanelProps> = ({
  analysis,
  onExecuteRemeasure,
}) => {
  return (
    <div className="bg-white/90 border border-slate-200/80 rounded-2xl p-4 shadow-sm space-y-3 text-xs">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          {analysis.status === "CRITICAL" ? (
            <ShieldAlert className="w-4 h-4 text-rose-600 animate-pulse" />
          ) : analysis.status === "ATTENTION" ? (
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          )}
          <span className="font-bold text-slate-900 text-xs">
            Decision-Support Reasoning & Drift Analysis
          </span>
        </div>

        <span
          className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${
            analysis.status === "CRITICAL"
              ? "bg-rose-50 text-rose-700 border-rose-200"
              : analysis.status === "ATTENTION"
              ? "bg-amber-50 text-amber-700 border-amber-200"
              : "bg-emerald-50 text-emerald-700 border-emerald-200"
          }`}
        >
          {analysis.status} DRIFT
        </span>
      </div>

      {/* CONSERVATIVE ESCALATION NOTICE */}
      {analysis.conservativeEscalation && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-900 space-y-2">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold block text-xs mb-0.5">
                Conservative Escalation Active (Data Quality Degraded)
              </span>
              <p className="text-[11px] text-amber-800 leading-normal">
                {analysis.conservativeReason || "Signal quality does not meet clinical verification threshold. Rather than suppressing quietly, the system demands verified re-measurement."}
              </p>
            </div>
          </div>
          {onExecuteRemeasure && (
            <button
              onClick={onExecuteRemeasure}
              className="w-full py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold text-[11px] flex items-center justify-center gap-1.5 transition shadow-sm active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Initiate Verified Re-measure Protocol (5-min rest)</span>
            </button>
          )}
        </div>
      )}

      {/* SIGNALS CHANGED BREAKDOWN */}
      <div>
        <span className="text-[11px] font-semibold text-slate-700 block mb-1.5">
          Signals Changed vs Individual Baseline:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {analysis.allSignals.map((sig, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-xl border ${
                sig.isBreached
                  ? "bg-rose-50/70 border-rose-200 text-rose-950"
                  : Math.abs(sig.pctDelta) >= 10
                  ? "bg-amber-50/60 border-amber-200 text-amber-950"
                  : "bg-slate-50/80 border-slate-100 text-slate-800"
              }`}
            >
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="font-semibold">{sig.name}</span>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/80 border border-slate-200 text-slate-600">
                  z = {sig.zScore >= 0 ? `+${sig.zScore}` : sig.zScore}
                </span>
              </div>

              <div className="flex items-baseline justify-between text-xs">
                <span className="font-bold text-sm">
                  {sig.current} <span className="text-[10px] text-slate-400 font-normal">/ base {sig.baseline}</span>
                </span>
                <span className={`font-bold font-mono text-[11px] ${sig.pctDelta > 0 ? "text-rose-600" : sig.pctDelta < 0 ? "text-indigo-600" : "text-slate-500"}`}>
                  {sig.deltaStr} ({sig.pctDelta >= 0 ? `+${sig.pctDelta}` : sig.pctDelta}%)
                </span>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 pt-1 border-t border-slate-200/50">
                <span>CUSUM S: <strong className="text-slate-700">{sig.cusumStat}</strong></span>
                <span>EWMA: <strong className="text-slate-700">{sig.ewmaVal}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LINKED NASA HAZARD */}
      <div className="p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-indigo-950 space-y-1">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-indigo-900">
          <Activity className="w-3.5 h-3.5 text-indigo-600" />
          <span>Coupled NASA Hazard: {analysis.hazardCode}</span>
        </div>
        <p className="text-[11px] text-indigo-800 leading-relaxed">
          {analysis.primaryHazard}
        </p>
      </div>

      {/* CLINICAL REASONING NARRATIVE */}
      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700 space-y-1">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-800">
          <Info className="w-3.5 h-3.5 text-slate-500" />
          <span>Clinical Decision-Support Reasoning:</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          {analysis.clinicalReasoning}
        </p>
      </div>
    </div>
  );
};

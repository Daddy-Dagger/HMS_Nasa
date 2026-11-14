import React from "react";
import { Zap, TrendingUp, Moon, RotateCcw, AlertTriangle } from "lucide-react";

interface FaultInjectionBarProps {
  activeFault: "NONE" | "SENSOR_GLITCH" | "BP_DRIFT" | "SLEEP_DECLINE";
  onInject: (fault: "SENSOR_GLITCH" | "BP_DRIFT" | "SLEEP_DECLINE") => void;
  onReset: () => void;
  activeCrewName: string;
  currentSol: number;
}

export const FaultInjectionBar: React.FC<FaultInjectionBarProps> = ({
  activeFault,
  onInject,
  onReset,
  activeCrewName,
  currentSol,
}) => {
  return (
    <div className="glass-card px-4 py-2.5 mb-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs shadow-sm border border-slate-200/80">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 text-white font-semibold text-[11px]">
          <Zap className="w-3.5 h-3.5 text-amber-400 fill-current" />
          <span>Fault Injector</span>
        </div>
        <span className="text-slate-400 hidden sm:inline">•</span>
        <span className="text-slate-500 font-medium hidden sm:inline">
          Live perturbation against {activeCrewName}'s Sol {currentSol} baseline:
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* BUTTON: SENSOR GLITCH */}
        <button
          onClick={() => onInject("SENSOR_GLITCH")}
          className={`px-3 py-1.5 rounded-full font-medium transition flex items-center gap-1.5 border active:scale-95 ${
            activeFault === "SENSOR_GLITCH"
              ? "bg-amber-600 text-white border-amber-600 shadow-sm"
              : "bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200"
          }`}
          title="Simulate electrode displacement & motion artifact. SQM drops to 19%."
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          <span>Sensor Glitch</span>
        </button>

        {/* BUTTON: BP DRIFT */}
        <button
          onClick={() => onInject("BP_DRIFT")}
          className={`px-3 py-1.5 rounded-full font-medium transition flex items-center gap-1.5 border active:scale-95 ${
            activeFault === "BP_DRIFT"
              ? "bg-rose-600 text-white border-rose-600 shadow-sm"
              : "bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-200"
          }`}
          title="Inject acute blood pressure rise (+24 mmHg) to test CUSUM S+ drift reaction."
        >
          <TrendingUp className="w-3.5 h-3.5 text-rose-500" />
          <span>BP Drift (+24)</span>
        </button>

        {/* BUTTON: SLEEP DECLINE */}
        <button
          onClick={() => onInject("SLEEP_DECLINE")}
          className={`px-3 py-1.5 rounded-full font-medium transition flex items-center gap-1.5 border active:scale-95 ${
            activeFault === "SLEEP_DECLINE"
              ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
              : "bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border-indigo-200"
          }`}
          title="Simulate acute circadian sleep loss (drop to 3.8h) to test neuro-behavioral CUSUM."
        >
          <Moon className="w-3.5 h-3.5 text-indigo-500" />
          <span>Sleep Loss (3.8h)</span>
        </button>

        {/* BUTTON: RESET */}
        <button
          onClick={onReset}
          disabled={activeFault === "NONE"}
          className={`px-3 py-1.5 rounded-full font-medium transition flex items-center gap-1.5 border ${
            activeFault !== "NONE"
              ? "bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-sm active:scale-95 cursor-pointer"
              : "bg-slate-100/60 text-slate-300 border-slate-200 cursor-not-allowed"
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {activeFault !== "NONE" && (
        <div className="w-full sm:w-auto flex items-center gap-1.5 text-[11px] text-amber-700 font-medium bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
          <span>Perturbation active: CUSUM / EWMA drift recalculated live</span>
        </div>
      )}
    </div>
  );
};

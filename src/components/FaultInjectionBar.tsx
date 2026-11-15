import React, { useState, useRef, useEffect } from "react";
import { Zap, TrendingUp, Moon, RotateCcw, AlertTriangle, ChevronDown, Check } from "lucide-react";

export interface FaultInjectionBarProps {
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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const faultLabel =
    activeFault === "SENSOR_GLITCH"
      ? "Sensor Glitch (SQM 19%)"
      : activeFault === "BP_DRIFT"
      ? "BP Drift (+24)"
      : activeFault === "SLEEP_DECLINE"
      ? "Sleep Loss (3.8h)"
      : "Nominal";

  return (
    <div className={`relative inline-block ${menuOpen ? "z-50" : "z-10"}`} ref={menuRef}>
      {activeFault === "NONE" ? (
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 transition border border-slate-200/80 active:scale-95 shadow-sm"
          title={`Inject perturbation against ${activeCrewName}'s Sol ${currentSol} baseline`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>Inject Fault</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>
      ) : (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-amber-500 text-white shadow-sm border border-amber-600 active:scale-95 transition"
            title="Active perturbation - click to change"
          >
            <Zap className="w-3.5 h-3.5 fill-current animate-pulse text-amber-100" />
            <span>{faultLabel}</span>
            <ChevronDown className="w-3 h-3 text-amber-200" />
          </button>
          <button
            onClick={onReset}
            className="px-2.5 py-1 rounded-full bg-white hover:bg-slate-100 text-slate-600 border border-slate-300 text-xs font-medium flex items-center gap-1 shadow-sm transition active:scale-95"
            title="Reset to nominal baseline"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      )}

      {menuOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-[0_20px_50px_rgba(15,23,42,0.25)] border border-slate-200 z-50 p-2 text-xs animate-fadeIn ring-1 ring-slate-900/5">
          <div className="px-2.5 py-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400 border-b border-slate-100 mb-1 flex items-center justify-between">
            <span>Inject Drift / Glitch</span>
            <span className="text-indigo-600 font-semibold">
              {activeCrewName} (Sol {currentSol})
            </span>
          </div>

          <button
            onClick={() => {
              onInject("SENSOR_GLITCH");
              setMenuOpen(false);
            }}
            className={`w-full text-left px-2.5 py-2 rounded-xl flex items-start gap-2.5 transition ${
              activeFault === "SENSOR_GLITCH"
                ? "bg-amber-50 text-amber-900 font-semibold"
                : "hover:bg-slate-50 text-slate-700"
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-900">Sensor Glitch</span>
                {activeFault === "SENSOR_GLITCH" && <Check className="w-3.5 h-3.5 text-amber-600" />}
              </div>
              <p className="text-[11px] text-slate-500 font-normal leading-tight mt-0.5">
                Motion artifact drops SQM to 19%. Demands conservative re-measure.
              </p>
            </div>
          </button>

          <button
            onClick={() => {
              onInject("BP_DRIFT");
              setMenuOpen(false);
            }}
            className={`w-full text-left px-2.5 py-2 rounded-xl flex items-start gap-2.5 transition ${
              activeFault === "BP_DRIFT"
                ? "bg-rose-50 text-rose-900 font-semibold"
                : "hover:bg-slate-50 text-slate-700"
            }`}
          >
            <TrendingUp className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-900">BP Drift (+24 mmHg)</span>
                {activeFault === "BP_DRIFT" && <Check className="w-3.5 h-3.5 text-rose-600" />}
              </div>
              <p className="text-[11px] text-slate-500 font-normal leading-tight mt-0.5">
                Acute BP spike testing CUSUM S+ accumulator drift detection.
              </p>
            </div>
          </button>

          <button
            onClick={() => {
              onInject("SLEEP_DECLINE");
              setMenuOpen(false);
            }}
            className={`w-full text-left px-2.5 py-2 rounded-xl flex items-start gap-2.5 transition ${
              activeFault === "SLEEP_DECLINE"
                ? "bg-indigo-50 text-indigo-900 font-semibold"
                : "hover:bg-slate-50 text-slate-700"
            }`}
          >
            <Moon className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-900">Sleep Loss (3.8h)</span>
                {activeFault === "SLEEP_DECLINE" && <Check className="w-3.5 h-3.5 text-indigo-600" />}
              </div>
              <p className="text-[11px] text-slate-500 font-normal leading-tight mt-0.5">
                Circadian disruption triggering neuro-behavioral EWMA alert.
              </p>
            </div>
          </button>

          {activeFault !== "NONE" && (
            <div className="pt-1 mt-1 border-t border-slate-100">
              <button
                onClick={() => {
                  onReset();
                  setMenuOpen(false);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-xl flex items-center gap-2 text-slate-600 hover:bg-slate-100 transition"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium">Reset to Nominal Baseline</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

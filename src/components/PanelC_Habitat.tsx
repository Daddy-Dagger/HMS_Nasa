import React, { useState } from "react";
import { Wind, Sun, RotateCcw, CheckCircle2 } from "lucide-react";
import { TelemetryState, HazardLevel } from "../types/telemetry";

interface PanelCProps {
  telemetry: TelemetryState;
  setTelemetry: React.Dispatch<React.SetStateAction<TelemetryState>>;
  hazard: HazardLevel;
  setHazard: React.Dispatch<React.SetStateAction<HazardLevel>>;
  setActiveHazardName: React.Dispatch<React.SetStateAction<string>>;
}

export const PanelC_Habitat: React.FC<PanelCProps> = ({
  telemetry,
  setTelemetry,
  hazard,
  setHazard,
  setActiveHazardName,
}) => {
  const [recovering, setRecovering] = useState<boolean>(false);
  const [recoveryCountdown, setRecoveryCountdown] = useState<number>(0);

  // 10-Second Closed-Loop Recovery Arc
  const triggerRecoveryLoop = () => {
    if (recovering || hazard === "NOMINAL") return;

    setRecovering(true);
    setRecoveryCountdown(8);

    // Initial boost to scrubbers & recovery lighting
    setTelemetry((prev) => ({
      ...prev,
      scrubberDutyCycle: 100,
      circadianSpectrum: "2100K (Max Rest/Purge Cycle)",
    }));

    const interval = setInterval(() => {
      setRecoveryCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setRecovering(false);
          setHazard("NOMINAL");
          setActiveHazardName("Nominal Mars Transit (Rehabilitated)");
          setTelemetry({
            radiationDose: 0.04,
            cabinCO2: 2.1,
            sleepDebt: 1.2,
            psychomotorJitter: 14,
            keystrokeLatency: 142,
            circadianSpectrum: "6500K (Standard Alert)",
            scrubberDutyCycle: 42,
            flightEnvelopeDamping: 0,
            taskAuthority: "SOLO_MANUAL",
          });
          return 0;
        }

        // Incrementally lower CO2 & adjust damping
        setTelemetry((curr) => ({
          ...curr,
          cabinCO2: Math.max(2.1, Number((curr.cabinCO2 - 0.7).toFixed(1))),
          flightEnvelopeDamping: Math.max(0, curr.flightEnvelopeDamping - 12),
          psychomotorJitter: Math.max(14, curr.psychomotorJitter - 4),
        }));

        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
              Panel C: Habitat Actuators
            </h2>
          </div>
          <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
            ECLSS LOOP
          </span>
        </div>

        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          Physical habitat counters the deficit automatically. Environmental intervention replaces passive advice.
        </p>

        <div className="space-y-4">
          {/* CIRCADIAN LIGHTING */}
          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-400" /> Circadian Light Spectrum:
              </span>
            </div>
            <div className="text-xs font-bold text-white mb-2 font-mono">
              {telemetry.circadianSpectrum}
            </div>
            <div
              className={`h-2.5 rounded-full transition-all duration-700 ${
                hazard === "CRITICAL_DRIFT"
                  ? "bg-amber-600 shadow-[0_0_12px_rgba(217,119,6,0.8)]"
                  : hazard === "MODERATE_STRAIN"
                  ? "bg-yellow-400"
                  : "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]"
              }`}
            />
          </div>

          {/* CO2 SCRUBBER */}
          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-cyan-400" /> CO2 Scrubber Overdrive:
              </span>
              <span className="text-xs font-bold text-cyan-400 font-mono">
                {telemetry.scrubberDutyCycle}%
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mb-1.5">
              <div
                className="bg-cyan-400 h-full transition-all duration-500"
                style={{ width: `${telemetry.scrubberDutyCycle}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 block leading-tight">
              Purging localized CO2 dead-zones before brain fog manifests.
            </span>
          </div>

          {/* CLOSED-LOOP RECOVERY BUTTON */}
          <div className="pt-2">
            <button
              onClick={triggerRecoveryLoop}
              disabled={recovering || hazard === "NOMINAL"}
              className={`w-full py-2 px-3 rounded-md text-xs font-mono font-bold flex items-center justify-center gap-2 transition ${
                recovering
                  ? "bg-amber-950/60 border border-amber-500 text-amber-300 animate-pulse"
                  : hazard === "NOMINAL"
                  ? "bg-slate-950 border border-slate-800 text-slate-600 cursor-not-allowed"
                  : "bg-cyan-600 hover:bg-cyan-500 text-slate-950 shadow-md"
              }`}
            >
              <RotateCcw className={`w-3.5 h-3.5 ${recovering ? "animate-spin" : ""}`} />
              <span>
                {recovering
                  ? `Active Purge & Recovery (${recoveryCountdown}s)...`
                  : "Engage Closed-Loop Recovery Arc"}
              </span>
            </button>
            <span className="text-[10px] text-slate-500 mt-1 block text-center">
              Demonstrates automatic return to nominal baseline.
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
        <CheckCircle2 className="w-3 h-3 text-cyan-400" />
        <span>Hardware-in-the-loop ECLSS automation.</span>
      </div>
    </div>
  );
};

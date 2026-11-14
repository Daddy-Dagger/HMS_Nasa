import React, { useState } from "react";
import { Wind, Sun, RotateCcw } from "lucide-react";
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

  const triggerRecoveryLoop = () => {
    if (recovering || hazard === "NOMINAL") return;

    setRecovering(true);
    setRecoveryCountdown(8);

    setTelemetry((prev) => ({
      ...prev,
      scrubberDutyCycle: 100,
      circadianSpectrum: "2100K (MAX PURGE)",
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
            circadianSpectrum: "6500K (ALERT BLUE)",
            scrubberDutyCycle: 42,
            flightEnvelopeDamping: 0,
            taskAuthority: "SOLO_MANUAL",
          });
          return 0;
        }

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
    <div className="h-full flex flex-col justify-between bg-black border border-slate-800 p-4 font-mono select-none">
      <div>
        {/* PANEL HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
          <div className="flex items-center gap-2">
            <Wind className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-bold tracking-widest text-slate-300 uppercase">
              ECLSS HABITAT ACTUATORS
            </span>
          </div>
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-emerald-400">
            CLOSED-LOOP
          </span>
        </div>

        {/* ATMOSPHERIC PURGE SCRUBBERS */}
        <div className="mb-4">
          <div className="flex justify-between text-[10px] text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <Wind className="w-3 h-3 text-cyan-400" /> CO2 SCRUBBER OVERDRIVE
            </span>
            <span className="text-cyan-400 font-bold">{telemetry.scrubberDutyCycle}%</span>
          </div>
          <div className="w-full bg-slate-950 border border-slate-800 h-2 overflow-hidden mb-1">
            <div
              className="bg-cyan-500 h-full transition-all duration-300"
              style={{ width: `${telemetry.scrubberDutyCycle}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-slate-500">
            <span>40% NOMINAL</span>
            <span>100% PURGE</span>
          </div>
        </div>

        {/* CIRCADIAN SPECTRAL EMISSION */}
        <div className="mb-5">
          <div className="flex justify-between text-[10px] text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <Sun className="w-3 h-3 text-amber-400" /> CIRCADIAN EMISSION
            </span>
            <span className="text-white font-bold">{telemetry.circadianSpectrum}</span>
          </div>
          <div
            className={`w-full h-2 border transition-all duration-500 ${
              hazard === "CRITICAL_DRIFT"
                ? "bg-amber-600 border-amber-500 shadow-[0_0_10px_#d97706]"
                : hazard === "MODERATE_STRAIN"
                ? "bg-yellow-400 border-yellow-300"
                : "bg-cyan-400 border-cyan-300 shadow-[0_0_8px_#22d3ee]"
            }`}
          />
          <div className="flex justify-between text-[9px] text-slate-500 mt-1">
            <span>2100K RECOVERY</span>
            <span>6500K ALERT</span>
          </div>
        </div>

        {/* HARDWARE ACTUATION BUTTON */}
        <div className="pt-1">
          <button
            onClick={triggerRecoveryLoop}
            disabled={recovering || hazard === "NOMINAL"}
            className={`w-full py-2.5 px-3 border text-xs font-bold flex items-center justify-center gap-2 transition tracking-wider uppercase ${
              recovering
                ? "bg-amber-950/80 border-amber-500 text-amber-300 animate-pulse"
                : hazard === "NOMINAL"
                ? "bg-slate-950/60 border-slate-800/80 text-slate-600 cursor-not-allowed"
                : "bg-cyan-950 border-cyan-500 hover:bg-cyan-900 text-cyan-200"
            }`}
          >
            <RotateCcw className={`w-3.5 h-3.5 ${recovering ? "animate-spin" : ""}`} />
            <span>
              {recovering
                ? `PURGING // ${recoveryCountdown}S`
                : "INITIATE ECLSS RECOVERY"}
            </span>
          </button>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800 text-[9px] text-slate-500 flex justify-between">
        <span>PHYSICAL LOOP</span>
        <span className="text-slate-400">NO HUMAN COMPLIANCE REQUIRED</span>
      </div>
    </div>
  );
};

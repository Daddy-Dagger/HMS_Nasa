import React from "react";
import { Sliders, Cpu, CheckCircle2 } from "lucide-react";
import { TelemetryState, HazardLevel } from "../types/telemetry";

interface PanelBProps {
  telemetry: TelemetryState;
  hazard: HazardLevel;
  dockingOffset: { x: number; y: number };
}

export const PanelB_Reticle: React.FC<PanelBProps> = ({
  telemetry,
  hazard,
  dockingOffset,
}) => {
  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
              Panel B: Biometric Fly-by-Wire (Task Shunting)
            </h2>
          </div>
          <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-1.5 py-0.5 rounded font-mono">
            NON-DISQUALIFYING
          </span>
        </div>

        <p className="text-xs text-slate-400 mb-3 leading-relaxed">
          When biological degradation occurs, the vehicle dynamically filters control tremors and adjusts mission operational envelopes.
        </p>

        {/* DOCKING RETICLE / FLY-BY-WIRE VISUALIZATION */}
        <div className="relative aspect-video bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center overflow-hidden mb-4 shadow-inner">
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

          {/* RETICLE GRID */}
          <div className="w-32 h-32 border border-slate-700/60 rounded-full flex items-center justify-center relative">
            <div className="w-full h-[1px] bg-slate-800 absolute" />
            <div className="h-full w-[1px] bg-slate-800 absolute" />

            {/* TARGET CENTER */}
            <div className="w-3 h-3 border border-cyan-400 rounded-full flex items-center justify-center">
              <div className="w-1 h-1 bg-cyan-400 rounded-full" />
            </div>

            {/* ASTRONAUT MOTOR TRAJECTORY */}
            <div
              className="w-7 h-7 rounded-full border-2 transition-all duration-700 flex items-center justify-center shadow-lg"
              style={{
                transform: `translate(${dockingOffset.x}px, ${dockingOffset.y}px)`,
                borderColor:
                  hazard === "CRITICAL_DRIFT"
                    ? "#f43f5e"
                    : hazard === "MODERATE_STRAIN"
                    ? "#f59e0b"
                    : "#10b981",
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor:
                    hazard === "CRITICAL_DRIFT"
                      ? "#f43f5e"
                      : hazard === "MODERATE_STRAIN"
                      ? "#f59e0b"
                      : "#10b981",
                }}
              />
            </div>
          </div>

          {/* FLY-BY-WIRE STABILIZER OVERLAY */}
          {telemetry.flightEnvelopeDamping > 0 && (
            <div className="absolute bottom-3 left-3 right-3 bg-slate-900/95 border border-cyan-600/50 px-2.5 py-1.5 rounded text-[11px] flex justify-between items-center font-mono">
              <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                Bio-FbW Dynamic Damping:
              </span>
              <span className="text-white">+{telemetry.flightEnvelopeDamping}% Tremor Compensation</span>
            </div>
          )}
        </div>

        {/* AUTHORITY READOUT */}
        <div className="space-y-2 text-xs font-mono">
          <div className="flex justify-between items-center p-2 rounded bg-slate-950/70 border border-slate-800">
            <span className="text-slate-400">Flight Control Authority:</span>
            <span className="font-bold text-white px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
              {telemetry.taskAuthority}
            </span>
          </div>
          <div className="flex justify-between items-center p-2 rounded bg-slate-950/70 border border-slate-800">
            <span className="text-slate-400">Critical Task Shunting:</span>
            <span className="text-slate-300">
              {hazard === "CRITICAL_DRIFT"
                ? "Diverted to Autonomous Dual-Nav"
                : hazard === "MODERATE_STRAIN"
                ? "Assisted Envelope Active"
                : "Full Solo Pilot Clear"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-emerald-400 flex items-center gap-2">
        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
        <span>Mission envelope absorbs physiological deficit; operator never penalized.</span>
      </div>
    </div>
  );
};

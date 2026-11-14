import React, { useState, useRef } from "react";
import { Crosshair, ShieldCheck, Cpu } from "lucide-react";
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
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle interactive manual steering
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setMousePos({ x, y });
  };

  // Calculate tremor jitter vs. fly-by-wire filtered position
  const tremorMagnitude =
    hazard === "CRITICAL_DRIFT" ? 28 : hazard === "MODERATE_STRAIN" ? 14 : 2;

  // Raw position with biological tremor
  const rawX = (isHovering ? mousePos.x : dockingOffset.x) + (Math.sin(Date.now() / 80) * tremorMagnitude);
  const rawY = (isHovering ? mousePos.y : dockingOffset.y) + (Math.cos(Date.now() / 90) * tremorMagnitude);

  // Bio-FbW dynamic damping compensation
  const dampingFactor = telemetry.flightEnvelopeDamping / 100;
  const filteredX = rawX * (1 - dampingFactor);
  const filteredY = rawY * (1 - dampingFactor);

  // Distance / RMS error
  const rmsError = Math.round(Math.sqrt(filteredX * filteredX + filteredY * filteredY));

  return (
    <div className="h-full flex flex-col justify-between bg-black border border-slate-800 p-4 font-mono select-none">
      <div>
        {/* HUD HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
          <div className="flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-cyan-400" />
            <span className="text-[11px] font-bold tracking-widest text-slate-200 uppercase">
              PRIMARY FLIGHT DISPLAY // DOCKING AXIS
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400">AUTHORITY:</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 border font-bold ${
                telemetry.taskAuthority === "SOLO_MANUAL"
                  ? "bg-emerald-950/60 text-emerald-400 border-emerald-800"
                  : telemetry.taskAuthority === "ASSISTED_DAMPED"
                  ? "bg-amber-950/60 text-amber-300 border-amber-800"
                  : "bg-cyan-950 text-cyan-300 border-cyan-700"
              }`}
            >
              {telemetry.taskAuthority}
            </span>
          </div>
        </div>

        {/* DOMINANT INTERACTIVE RETICLE CANVASES */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="relative aspect-[16/10] bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden cursor-crosshair mb-3"
        >
          {/* AEROSPACE GRID & CROSS-TICKS */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-30" />
          <div className="absolute w-full h-[1px] bg-slate-800/80" />
          <div className="absolute h-full w-[1px] bg-slate-800/80" />

          {/* FLIGHT HORIZON CIRCLES */}
          <div className="w-56 h-56 border border-slate-800 rounded-full absolute pointer-events-none" />
          <div className="w-36 h-36 border border-slate-700/60 rounded-full absolute pointer-events-none" />
          <div className="w-16 h-16 border border-dashed border-cyan-500/40 rounded-full absolute pointer-events-none" />

          {/* TARGET LOCK HARBOR (CENTER) */}
          <div className="w-4 h-4 border border-cyan-400 rounded-none flex items-center justify-center relative pointer-events-none">
            <div className="w-1 h-1 bg-cyan-400" />
          </div>

          {/* RAW MOTOR VECTOR (TREMOR INJECTED) */}
          {telemetry.flightEnvelopeDamping > 0 && (
            <div
              className="absolute w-3 h-3 border border-rose-500/50 rounded-full transition-transform pointer-events-none opacity-40"
              style={{
                transform: `translate(${rawX}px, ${rawY}px)`,
              }}
            />
          )}

          {/* BIO-FbW STABILIZED FLIGHT RETICLE */}
          <div
            className="absolute transition-transform duration-75 flex items-center justify-center pointer-events-none"
            style={{
              transform: `translate(${filteredX}px, ${filteredY}px)`,
            }}
          >
            <div
              className={`w-8 h-8 border-2 transition-colors ${
                rmsError < 15
                  ? "border-emerald-400 shadow-[0_0_12px_#10b981]"
                  : rmsError < 35
                  ? "border-amber-400"
                  : "border-rose-400 shadow-[0_0_12px_#f43f5e]"
              }`}
            >
              <div className="w-full h-full flex items-center justify-center">
                <div
                  className={`w-1.5 h-1.5 ${
                    rmsError < 15 ? "bg-emerald-400" : "bg-white"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* LIVE HUD VECTOR READOUTS */}
          <div className="absolute top-2 left-2 text-[10px] text-slate-400 font-mono space-y-0.5 pointer-events-none">
            <div>AZIMUTH: <span className="text-white">{filteredX > 0 ? `+${filteredX.toFixed(1)}` : filteredX.toFixed(1)}°</span></div>
            <div>ELEVATION: <span className="text-white">{filteredY > 0 ? `+${filteredY.toFixed(1)}` : filteredY.toFixed(1)}°</span></div>
            <div>RMS DEVIATION: <span className={rmsError < 20 ? "text-emerald-400" : "text-amber-400"}>{rmsError} mm</span></div>
          </div>

          {/* HOVER HINT */}
          {!isHovering && (
            <div className="absolute bottom-2 text-[9px] text-slate-500 pointer-events-none uppercase tracking-widest">
              [MOVE CURSOR INSIDE TO FLY MANUALLY]
            </div>
          )}

          {/* DYNAMIC DAMPING INDICATOR */}
          {telemetry.flightEnvelopeDamping > 0 && (
            <div className="absolute bottom-2 right-2 bg-black/90 border border-cyan-500/60 px-2 py-0.5 text-[10px] text-cyan-300 font-bold flex items-center gap-1.5 pointer-events-none">
              <Cpu className="w-3 h-3 text-cyan-400" />
              <span>FbW DAMPING: +{telemetry.flightEnvelopeDamping}%</span>
            </div>
          )}
        </div>

        {/* FLIGHT ENVELOPE TELEMETRY BAR */}
        <div className="grid grid-cols-3 gap-2 text-[10px]">
          <div className="p-2 bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block">ENVELOPE BUFFER</span>
            <span className="text-white font-bold">{100 - telemetry.flightEnvelopeDamping}% FREE</span>
          </div>
          <div className="p-2 bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block">STABILIZATION</span>
            <span className="text-cyan-400 font-bold">
              {telemetry.flightEnvelopeDamping > 0 ? "FILTER ACTIVE" : "NOMINAL"}
            </span>
          </div>
          <div className="p-2 bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block">LOCK ACCURACY</span>
            <span className={rmsError < 20 ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
              {rmsError < 20 ? "OPTIMAL" : "DEGRADED"}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800 text-[9px] text-slate-500 flex justify-between">
        <span>BIOMETRIC FLY-BY-WIRE</span>
        <span className="text-emerald-500 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" /> FLIGHT INTEGRITY PRESERVED
        </span>
      </div>
    </div>
  );
};

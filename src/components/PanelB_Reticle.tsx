import React, { useState, useEffect, useRef, useCallback } from "react";
import { Crosshair, ShieldCheck, Cpu, Activity } from "lucide-react";
import { TelemetryState, HazardLevel } from "../types/telemetry";

interface PanelBProps {
  telemetry: TelemetryState;
  hazard: HazardLevel;
  dockingOffset: { x: number; y: number };
}

interface Point {
  x: number;
  y: number;
}

export const PanelB_Reticle: React.FC<PanelBProps> = ({
  telemetry,
  hazard,
  dockingOffset,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState<boolean>(false);

  // Position States for Real-Time HUD
  const [rawTremorPos, setRawTremorPos] = useState<Point>({ x: 0, y: 0 });
  const [filteredPos, setFilteredPos] = useState<Point>({ x: 0, y: 0 });

  // Aerospace HUD Telemetry States
  const [rmsErrorMm, setRmsErrorMm] = useState<number>(0);
  const [gForceStability, setGForceStability] = useState<string>("0.02 G (99.4%)");
  const [lockStatus, setLockStatus] = useState<string>("LOCK-ON READY");
  const [isLockedOn, setIsLockedOn] = useState<boolean>(true);

  // Kinematic & Filter Refs
  const mousePosRef = useRef<Point>({ x: 0, y: 0 });
  const smoothedPosRef = useRef<Point>({ x: 0, y: 0 });
  const lastTimeRef = useRef<number>(performance.now());
  const animFrameRef = useRef<number | null>(null);

  // Synchronize target when not actively steering with mouse
  useEffect(() => {
    if (!isHovering) {
      const defaultX = dockingOffset.x * 2.0;
      const defaultY = dockingOffset.y * 2.0;
      mousePosRef.current = { x: defaultX, y: defaultY };
    }
  }, [dockingOffset, isHovering]);

  // Handle interactive manual steering
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const maxBoundX = rect.width / 2 - 20;
    const maxBoundY = rect.height / 2 - 20;

    const rawX = e.clientX - centerX;
    const rawY = e.clientY - centerY;

    const boundedX = Math.max(-maxBoundX, Math.min(maxBoundX, rawX));
    const boundedY = Math.max(-maxBoundY, Math.min(maxBoundY, rawY));

    mousePosRef.current = { x: boundedX, y: boundedY };
  }, []);

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    const defaultX = dockingOffset.x * 2.0;
    const defaultY = dockingOffset.y * 2.0;
    mousePosRef.current = { x: defaultX, y: defaultY };
  };

  // 60FPS Aerospace Animation Loop: Tremor Injection + Bio-FbW Damping Filter
  useEffect(() => {
    const tick = (now: number) => {
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = now;
      const t = now / 1000;

      const target = mousePosRef.current;

      // 1. Biological Tremor Injection (Microgravity Neuro-Vestibular Ataxia)
      let tremorAmp = 0;
      let tremorX = 0;
      let tremorY = 0;

      if (hazard === "NOMINAL") {
        tremorAmp = 0; // Clean 1:1 mouse tracking
      } else if (hazard === "MODERATE_STRAIN") {
        tremorAmp = 16; // ±15px to ±20px tremor noise
        tremorX =
          tremorAmp *
          (0.55 * Math.sin(t * 58.0) +
            0.30 * Math.cos(t * 84.0 + 1.2) +
            (Math.random() - 0.5) * 0.4);
        tremorY =
          tremorAmp *
          (0.55 * Math.cos(t * 62.0) +
            0.30 * Math.sin(t * 76.0 + 0.8) +
            (Math.random() - 0.5) * 0.4);
      } else if (hazard === "CRITICAL_DRIFT") {
        tremorAmp = 32; // ±30px to ±35px acute tremor noise
        tremorX =
          tremorAmp *
          (0.50 * Math.sin(t * 66.0) +
            0.35 * Math.cos(t * 90.0 + 1.7) +
            (Math.random() - 0.5) * 0.55);
        tremorY =
          tremorAmp *
          (0.50 * Math.cos(t * 70.0) +
            0.35 * Math.sin(t * 86.0 + 0.5) +
            (Math.random() - 0.5) * 0.55);
      }

      const rawX = target.x + tremorX;
      const rawY = target.y + tremorY;
      setRawTremorPos({ x: rawX, y: rawY });

      // 2. Bio-FbW Dynamic Damping Filter:
      // Position_filtered = alpha * Target + (1 - alpha) * Raw_Tremor_Position
      const dampingFactor = telemetry.flightEnvelopeDamping; // 0 to 100%
      let finalX = rawX;
      let finalY = rawY;

      if (dampingFactor > 0) {
        const alpha = Math.min(0.92, (dampingFactor / 100) * 0.95);
        const instantFilteredX = alpha * target.x + (1 - alpha) * rawX;
        const instantFilteredY = alpha * target.y + (1 - alpha) * rawY;

        // Exponential low-pass temporal smoothing
        const temporalLag = 1 - Math.exp(-dt * (18 - alpha * 12));
        smoothedPosRef.current.x += (instantFilteredX - smoothedPosRef.current.x) * temporalLag;
        smoothedPosRef.current.y += (instantFilteredY - smoothedPosRef.current.y) * temporalLag;

        finalX = smoothedPosRef.current.x;
        finalY = smoothedPosRef.current.y;
      } else {
        smoothedPosRef.current = { x: rawX, y: rawY };
        finalX = rawX;
        finalY = rawY;
      }

      setFilteredPos({ x: finalX, y: finalY });

      // 3. Aerospace HUD Telemetry Readouts
      // RMS Target Deviation in mm (scale: ~0.85 mm/px)
      const distFromCenterPx = Math.sqrt(finalX * finalX + finalY * finalY);
      const rmsMm = distFromCenterPx * 0.85;
      setRmsErrorMm(parseFloat(rmsMm.toFixed(1)));

      // Dynamic lock-on tolerance collar
      const lockThresholdPx = dampingFactor > 50 ? 30 : dampingFactor > 0 ? 24 : 16;
      const locked = distFromCenterPx <= lockThresholdPx;
      setIsLockedOn(locked);

      // Thruster G-Force Stability
      if (dampingFactor >= 75) {
        setGForceStability("0.04 G (98.4% Clamped)");
      } else if (dampingFactor >= 30) {
        setGForceStability("0.12 G (94.2% Assisted)");
      } else if (hazard === "NOMINAL") {
        setGForceStability("0.02 G (99.6% Nominal)");
      } else {
        const erraticG = (0.35 + tremorAmp / 80).toFixed(2);
        setGForceStability(`${erraticG} G (68.4% Erratic)`);
      }

      // Lock-On Consensus Status
      if (locked) {
        if (dampingFactor > 70) {
          setLockStatus("AUTONOMOUS DUAL-CONSENSUS LOCK");
        } else if (dampingFactor > 0) {
          setLockStatus("BIO-FbW DAMPED LOCK ENGAGED");
        } else {
          setLockStatus("SOLO MANUAL LOCK-ON OPTIMAL");
        }
      } else {
        if (dampingFactor > 70) {
          setLockStatus("DYNAMIC VECTOR CORRECTION...");
        } else if (dampingFactor > 0) {
          setLockStatus("ASSISTED TRAJECTORY ALIGNMENT");
        } else {
          setLockStatus("MANUAL DRIFT // TRIM REQUIRED");
        }
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [hazard, telemetry.flightEnvelopeDamping]);

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

        {/* DOMINANT INTERACTIVE RETICLE CANVAS */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative aspect-[16/10] bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden cursor-crosshair mb-3 group shadow-inner"
        >
          {/* AEROSPACE RADAR GRID & CROSS-TICKS */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-30 pointer-events-none" />
          <div className="absolute w-full h-[1px] bg-slate-800/80 pointer-events-none" />
          <div className="absolute h-full w-[1px] bg-slate-800/80 pointer-events-none" />

          {/* FLIGHT HORIZON CIRCLES */}
          <div className="w-56 h-56 border border-slate-800 rounded-full absolute pointer-events-none" />
          <div className="w-36 h-36 border border-slate-700/60 rounded-full absolute pointer-events-none" />
          <div className="w-16 h-16 border border-dashed border-cyan-500/40 rounded-full absolute pointer-events-none" />

          {/* TARGET LOCK HARBOR (CENTER 0,0) */}
          <div className="w-4 h-4 border border-cyan-400 rounded-none flex items-center justify-center relative pointer-events-none z-10">
            <div className={`w-1 h-1 ${isLockedOn ? "bg-emerald-400 animate-ping" : "bg-cyan-400"}`} />
          </div>

          {/* GHOST RETICLE: RAW UNFILTERED PILOT TREMOR (Visible under strain when FBW is damping) */}
          {telemetry.flightEnvelopeDamping > 0 && hazard !== "NOMINAL" && (
            <div
              className="absolute pointer-events-none transition-none z-10 opacity-50"
              style={{
                transform: `translate(${rawTremorPos.x}px, ${rawTremorPos.y}px)`,
              }}
            >
              <div className="w-6 h-6 border border-rose-500/80 border-dashed rounded-full flex items-center justify-center">
                <div className="w-1 h-1 bg-rose-400 rounded-full" />
              </div>
              <span className="text-[7px] text-rose-400 font-mono absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 px-1 rounded border border-rose-900/60">
                RAW TREMOR
              </span>
            </div>
          )}

          {/* BIO-FbW STABILIZED FLIGHT RETICLE */}
          <div
            className="absolute transition-transform duration-75 flex items-center justify-center pointer-events-none z-20"
            style={{
              transform: `translate(${filteredPos.x}px, ${filteredPos.y}px)`,
            }}
          >
            <div
              className={`w-8 h-8 border-2 transition-colors flex items-center justify-center ${
                isLockedOn
                  ? "border-emerald-400 shadow-[0_0_12px_#10b981]"
                  : hazard === "CRITICAL_DRIFT" && telemetry.flightEnvelopeDamping === 0
                  ? "border-rose-400 shadow-[0_0_12px_#f43f5e]"
                  : hazard === "MODERATE_STRAIN" && telemetry.flightEnvelopeDamping === 0
                  ? "border-amber-400 shadow-[0_0_8px_#f59e0b]"
                  : "border-cyan-400 shadow-[0_0_8px_#22d3ee]"
              }`}
            >
              {/* Reticle Crosshair Ticks */}
              <div className="absolute w-2 h-[1px] bg-cyan-400 -left-1" />
              <div className="absolute w-2 h-[1px] bg-cyan-400 -right-1" />
              <div className="absolute h-2 w-[1px] bg-cyan-400 -top-1" />
              <div className="absolute h-2 w-[1px] bg-cyan-400 -bottom-1" />
              <div
                className={`w-1.5 h-1.5 ${
                  isLockedOn ? "bg-emerald-400" : "bg-cyan-300"
                }`}
              />
            </div>

            {/* In-Reticle Alignment Tag */}
            <div
              className={`text-[8px] font-mono px-1 py-0.5 rounded absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap shadow-md border ${
                isLockedOn
                  ? "bg-emerald-950/90 text-emerald-300 border-emerald-500/50"
                  : "bg-slate-950/90 text-cyan-300 border-slate-700"
              }`}
            >
              {isLockedOn ? "LOCK ACQUIRED" : `Δ ${rmsErrorMm.toFixed(1)}mm`}
            </div>
          </div>

          {/* LIVE HUD VECTOR READOUTS */}
          <div className="absolute top-2 left-2 text-[10px] text-slate-400 font-mono space-y-0.5 pointer-events-none bg-slate-950/70 p-1.5 rounded border border-slate-800">
            <div>
              AZIMUTH: <span className="text-white">{filteredPos.x >= 0 ? `+${filteredPos.x.toFixed(1)}` : filteredPos.x.toFixed(1)}°</span>
            </div>
            <div>
              ELEVATION: <span className="text-white">{filteredPos.y >= 0 ? `+${filteredPos.y.toFixed(1)}` : filteredPos.y.toFixed(1)}°</span>
            </div>
            <div>
              RMS DEVIATION: <span className={rmsErrorMm < 20 ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>{rmsErrorMm.toFixed(1)} mm</span>
            </div>
          </div>

          {/* HOVER HINT */}
          {!isHovering && (
            <div className="absolute bottom-2 text-[9px] text-slate-500 pointer-events-none uppercase tracking-widest bg-black/60 px-2 py-0.5 rounded">
              [MOVE CURSOR INSIDE TO FLY MANUALLY]
            </div>
          )}

          {/* DYNAMIC DAMPING INDICATOR */}
          {telemetry.flightEnvelopeDamping > 0 && (
            <div className="absolute bottom-2 right-2 bg-black/90 border border-cyan-500/60 px-2 py-0.5 text-[10px] text-cyan-300 font-bold flex items-center gap-1.5 pointer-events-none shadow-lg">
              <Cpu className="w-3 h-3 text-cyan-400 animate-spin" style={{ animationDuration: "6s" }} />
              <span>FbW DAMPING: +{telemetry.flightEnvelopeDamping}% CLAMPED</span>
            </div>
          )}
        </div>

        {/* FLIGHT ENVELOPE & TELEMETRY READOUT BAR */}
        <div className="grid grid-cols-3 gap-2 text-[10px] mb-2">
          {/* Target Deviation */}
          <div className="p-2 bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block uppercase tracking-tighter">Target Deviation</span>
            <span className={`text-xs font-bold ${rmsErrorMm <= 20 ? "text-emerald-400" : "text-amber-400"}`}>
              {rmsErrorMm.toFixed(1)} mm RMS
            </span>
          </div>

          {/* Thruster G-Force Stability */}
          <div className="p-2 bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block uppercase tracking-tighter">G-Force Stability</span>
            <span className="text-cyan-400 font-bold truncate block">
              {gForceStability}
            </span>
          </div>

          {/* Lock Consensus Status */}
          <div className="p-2 bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block uppercase tracking-tighter">Consensus Lock</span>
            <div className="flex items-center gap-1">
              {isLockedOn ? (
                <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
              ) : (
                <Activity className="w-3 h-3 text-amber-400 shrink-0" />
              )}
              <span className={`font-bold truncate ${isLockedOn ? "text-emerald-400" : "text-amber-400"}`}>
                {isLockedOn ? "OPTIMAL" : "TRIM REQ"}
              </span>
            </div>
          </div>
        </div>

        {/* CONSENSUS VECTOR SUBTEXT */}
        <div className="p-2 bg-slate-950/80 border border-slate-800 text-[10px] flex justify-between items-center">
          <span className="text-slate-400">Consensus Vector:</span>
          <span className={`font-bold ${isLockedOn ? "text-emerald-400" : "text-cyan-400"}`}>
            {lockStatus}
          </span>
        </div>
      </div>

      {/* FOOTER */}
      <div className="pt-2 border-t border-slate-800 text-[9px] text-slate-500 flex justify-between items-center">
        <span>BIOMETRIC FLY-BY-WIRE // ZERO PENALTY</span>
        <span className="text-emerald-500 flex items-center gap-1 font-semibold">
          <ShieldCheck className="w-3 h-3" /> FLIGHT INTEGRITY PRESERVED
        </span>
      </div>
    </div>
  );
};

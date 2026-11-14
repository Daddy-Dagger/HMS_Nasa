import React from "react";
import { AnatomicalZone, HealthStatus, DailyHealthMetric } from "../types/mission";
import { ConstellationGlyph } from "./ConstellationGlyph";
import { Activity, Heart, Moon, Eye } from "lucide-react";

interface WearableWatchHUDProps {
  currentSol: number;
  currentMetric: DailyHealthMetric;
  selectedZone: AnatomicalZone;
  onSelectZone: (zone: AnatomicalZone) => void;
  zoneStatuses: Record<AnatomicalZone, HealthStatus>;
  onOpenSANS: () => void;
  onOpenProcedure: () => void;
}

export const WearableWatchHUD: React.FC<WearableWatchHUDProps> = ({
  currentSol,
  currentMetric,
  selectedZone,
  onSelectZone,
  zoneStatuses,
  onOpenSANS,
  onOpenProcedure,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-4 select-none font-mono">
      {/* SMARTWATCH / SUIT-CUFF BEZEL CONTAINER */}
      <div className="relative w-80 sm:w-96 aspect-square rounded-[40px] bg-slate-950 border-4 border-slate-800 p-5 shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col justify-between overflow-hidden">
        {/* BEZEL GLOW RING */}
        <div className="absolute inset-0 rounded-[36px] border border-cyan-500/30 pointer-events-none" />

        {/* TOP STATUS BAR */}
        <div className="flex justify-between items-center text-[10px] text-slate-400 border-b border-slate-900 pb-1.5 z-10">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-bold text-white">xEMU SUIT HUD</span>
          </div>
          <span className="text-cyan-400 font-bold">SOL {currentSol}</span>
          <span className="text-slate-500">SQM: {currentMetric.sensorConfidence}%</span>
        </div>

        {/* CENTER STAGE: 7-DOT CONSTELLATION BODY GLYPH */}
        <div className="relative my-auto flex flex-col items-center justify-center">
          <ConstellationGlyph
            selectedZone={selectedZone}
            onSelectZone={onSelectZone}
            zoneStatuses={zoneStatuses}
            compact={true}
          />

          {/* ACTIVE CALLOUT PILL */}
          <div className="mt-1 flex items-center gap-2 text-[10px] px-2 py-0.5 bg-black border border-slate-800 rounded-full">
            <span className="text-slate-500 uppercase">SYS:</span>
            <span className="text-cyan-300 font-bold">{selectedZone.replace("_", " ")}</span>
          </div>
        </div>

        {/* BOTTOM METRIC RAIL */}
        <div className="grid grid-cols-2 gap-1.5 text-[10px] z-10">
          <div className="bg-black/90 border border-slate-800/80 p-2 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              <span>BP</span>
            </div>
            <span className={`font-bold ${currentMetric.systolicBP >= 140 ? "text-rose-400 animate-pulse" : "text-white"}`}>
              {currentMetric.systolicBP}/{currentMetric.diastolicBP}
            </span>
          </div>

          <div className="bg-black/90 border border-slate-800/80 p-2 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Moon className="w-3.5 h-3.5 text-cyan-400" />
              <span>SLEEP</span>
            </div>
            <span className={`font-bold ${currentMetric.sleepHours < 5.0 ? "text-amber-400" : "text-white"}`}>
              {currentMetric.sleepHours}h
            </span>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-1.5 mt-2 z-10">
          <button
            onClick={onOpenSANS}
            className="flex-1 py-1.5 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/80 text-cyan-200 rounded-lg text-[9px] font-bold flex items-center justify-center gap-1 transition"
          >
            <Eye className="w-3 h-3 text-cyan-400" />
            <span>SANS EXAM</span>
          </button>

          <button
            onClick={onOpenProcedure}
            className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-[9px] font-bold flex items-center justify-center gap-1 transition"
          >
            <Activity className="w-3 h-3 text-emerald-400" />
            <span>PROCEDURE</span>
          </button>
        </div>
      </div>
    </div>
  );
};

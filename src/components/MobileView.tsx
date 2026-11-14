import React, { useState } from "react";
import { AnatomicalZone, HealthStatus, EscalationTier, DailyHealthMetric } from "../types/mission";
import { ConstellationGlyph } from "./ConstellationGlyph";
import { IndicatorDetail } from "./IndicatorDetail";
import { EscalationLadder } from "./EscalationLadder";
import { BodyMap } from "./BodyMap";
import {
  Activity,
  Heart,
  Moon,
  Eye,
  FileText,
  Radio,
  Users,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface MobileViewProps {
  currentSol: number;
  onSelectSol: (sol: number) => void;
  missionData: DailyHealthMetric[];
  selectedZone: AnatomicalZone;
  onSelectZone: (zone: AnatomicalZone) => void;
  zoneStatuses: Record<AnatomicalZone, HealthStatus>;
  currentTier: EscalationTier;
  delayMode: "LEO_REALTIME" | "MARS_20M_DELAY";
  onToggleDelay: () => void;
  activeCrew: string;
  onSelectCrew: (crewId: string) => void;
  crewRoster: Array<{ id: string; name: string; status: HealthStatus; primaryAlert?: string }>;
  onOpenSANS: () => void;
  onOpenProcedure: () => void;
  onOpenGroundPacket: () => void;
}

export const MobileView: React.FC<MobileViewProps> = ({
  currentSol,
  onSelectSol,
  missionData,
  selectedZone,
  onSelectZone,
  zoneStatuses,
  currentTier,
  delayMode,
  onToggleDelay,
  activeCrew,
  onSelectCrew,
  crewRoster,
  onOpenSANS,
  onOpenProcedure,
  onOpenGroundPacket,
}) => {
  // Mobile active tab: "OVERVIEW" | "TELEMETRY" | "ESCALATION" | "BODY_MAP"
  const [activeTab, setActiveTab] = useState<"OVERVIEW" | "TELEMETRY" | "ESCALATION" | "BODY_MAP">("OVERVIEW");

  const currentMetric = missionData[currentSol - 1] || missionData[0];
  const isCriticalBP = currentMetric.systolicBP >= 140;

  return (
    <div className="flex flex-col w-full max-w-md mx-auto min-h-screen pb-24 font-mono select-none">
      {/* MOBILE TOP STATUS BAR */}
      <div className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-cyan-500/20 px-3 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#06b6d4]" />
          <span className="font-bold text-xs text-white tracking-wider">AEGIS MOBILE</span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {/* COMMS LAG BUTTON */}
          <button
            onClick={onToggleDelay}
            className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 transition ${
              delayMode === "MARS_20M_DELAY"
                ? "bg-amber-950/80 border-amber-500/60 text-amber-300"
                : "bg-cyan-950/80 border-cyan-500/60 text-cyan-300"
            }`}
          >
            <Radio className="w-2.5 h-2.5" />
            <span>{delayMode === "MARS_20M_DELAY" ? "20m LAG" : "LEO REAL"}</span>
          </button>

          {/* ACTIVE SOL PILL */}
          <div className="bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 px-2 py-0.5 rounded text-[10px] font-bold">
            SOL {currentSol}/30
          </div>
        </div>
      </div>

      {/* HORIZONTAL CREW SELECTOR SCROLLER */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-2 px-3 border-b border-slate-900 bg-black/60">
        <div className="flex items-center gap-1 text-[10px] text-slate-500 pr-1 shrink-0">
          <Users className="w-3 h-3 text-cyan-400" />
          <span>CREW:</span>
        </div>
        {crewRoster.map((crew) => (
          <button
            key={crew.id}
            onClick={() => onSelectCrew(crew.id)}
            className={`px-2.5 py-1 rounded text-[10px] shrink-0 border flex items-center gap-1.5 transition ${
              activeCrew === crew.id
                ? "bg-cyan-950 border-cyan-400 text-white font-bold shadow-[0_0_8px_rgba(6,182,212,0.3)]"
                : "bg-slate-950 border-slate-800 text-slate-400"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                crew.status === "CRITICAL"
                  ? "bg-rose-500 animate-pulse"
                  : crew.status === "ATTENTION"
                  ? "bg-amber-400"
                  : "bg-emerald-400"
              }`}
            />
            <span>{crew.name.replace("CDR ", "").replace("PLT ", "").replace("ENG ", "").replace("SCI ", "")}</span>
          </button>
        ))}
      </div>

      {/* TIMELINE SOL SCRUBBER STEPPER */}
      <div className="px-3 py-2 bg-slate-950/50 border-b border-slate-800/80 flex items-center justify-between text-xs">
        <button
          onClick={() => onSelectSol(Math.max(1, currentSol - 1))}
          disabled={currentSol <= 1}
          className="p-1 rounded bg-black border border-slate-800 text-slate-300 disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center">
          <span className="text-[11px] font-bold text-white">
            MISSION SOL <span className="text-cyan-400">{currentSol}</span>
          </span>
          <span className="text-[9px] text-slate-500">
            {currentSol <= 7 ? "Space Adaptation Baseline" : currentSol === 8 ? "Sensor Motion Glitch" : currentSol <= 21 ? "Sleep Fragmentation" : currentSol <= 24 ? "Critical BP Spike" : "Stabilization"}
          </span>
        </div>

        <button
          onClick={() => onSelectSol(Math.min(30, currentSol + 1))}
          disabled={currentSol >= 30}
          className="p-1 rounded bg-black border border-slate-800 text-slate-300 disabled:opacity-30"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* SENSOR INTEGRITY NOTIFICATION */}
      {currentMetric.alertSuppressed && (
        <div className="mx-3 mt-2 px-2.5 py-1.5 bg-amber-950/60 border border-amber-500/60 rounded-lg flex items-center gap-2 text-[10px] text-amber-200 animate-pulse">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>ALERT SUPPRESSED: Motion artifact detected (SQM: {currentMetric.sensorConfidence}%)</span>
        </div>
      )}

      {/* MOBILE SEGMENTED VIEW TAB SELECTOR */}
      <div className="grid grid-cols-4 gap-1 p-3 text-[10px]">
        <button
          onClick={() => setActiveTab("OVERVIEW")}
          className={`py-1.5 rounded border transition font-bold ${
            activeTab === "OVERVIEW"
              ? "bg-cyan-950 border-cyan-400 text-cyan-200"
              : "bg-black/60 border-slate-800 text-slate-400"
          }`}
        >
          GLYPH
        </button>
        <button
          onClick={() => setActiveTab("BODY_MAP")}
          className={`py-1.5 rounded border transition font-bold ${
            activeTab === "BODY_MAP"
              ? "bg-cyan-950 border-cyan-400 text-cyan-200"
              : "bg-black/60 border-slate-800 text-slate-400"
          }`}
        >
          ANATOMY
        </button>
        <button
          onClick={() => setActiveTab("TELEMETRY")}
          className={`py-1.5 rounded border transition font-bold ${
            activeTab === "TELEMETRY"
              ? "bg-cyan-950 border-cyan-400 text-cyan-200"
              : "bg-black/60 border-slate-800 text-slate-400"
          }`}
        >
          CHARTS
        </button>
        <button
          onClick={() => setActiveTab("ESCALATION")}
          className={`py-1.5 rounded border transition font-bold ${
            activeTab === "ESCALATION"
              ? "bg-cyan-950 border-cyan-400 text-cyan-200"
              : "bg-black/60 border-slate-800 text-slate-400"
          }`}
        >
          TIERS
        </button>
      </div>

      {/* MAIN TAB CONTENT */}
      <div className="px-3 flex-1">
        {/* TAB 1: OVERVIEW & 7-DOT CONSTELLATION */}
        {activeTab === "OVERVIEW" && (
          <div className="flex flex-col gap-3">
            {/* GLYPH CARD */}
            <div className="bg-slate-950 border border-cyan-500/20 rounded-2xl p-4 flex flex-col items-center relative shadow-[0_0_20px_rgba(6,182,212,0.08)]">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold self-start mb-2">
                7-DOT TELEMETRY GLYPH
              </span>
              <ConstellationGlyph
                selectedZone={selectedZone}
                onSelectZone={onSelectZone}
                zoneStatuses={zoneStatuses}
                compact={true}
              />
            </div>

            {/* QUICK STATS 2x2 GRID */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div
                onClick={() => onSelectZone("CARDIOVASCULAR")}
                className={`p-3 rounded-xl border cursor-pointer transition ${
                  isCriticalBP
                    ? "bg-rose-950/60 border-rose-500/80 animate-pulse"
                    : "bg-slate-950 border-slate-800"
                }`}
              >
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] mb-1">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  <span>BLOOD PRESSURE</span>
                </div>
                <div className="text-base font-bold text-white">
                  {currentMetric.systolicBP}/{currentMetric.diastolicBP} <span className="text-[10px] text-slate-400">mmHg</span>
                </div>
                <span className="text-[9px] text-slate-500">{isCriticalBP ? "Breached >140" : "Within bounds"}</span>
              </div>

              <div
                onClick={() => onSelectZone("NEURO_BEHAVIORAL")}
                className="p-3 rounded-xl border bg-slate-950 border-slate-800 cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] mb-1">
                  <Moon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>SLEEP</span>
                </div>
                <div className="text-base font-bold text-white">
                  {currentMetric.sleepHours} <span className="text-[10px] text-slate-400">hours</span>
                </div>
                <span className="text-[9px] text-slate-500">Standard: 8.0h</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ANATOMICAL BODY MAP */}
        {activeTab === "BODY_MAP" && (
          <div className="bg-slate-950 border border-cyan-500/20 rounded-2xl p-3">
            <BodyMap
              selectedZone={selectedZone}
              onSelectZone={onSelectZone}
              zoneStatuses={zoneStatuses}
            />
          </div>
        )}

        {/* TAB 3: TELEMETRY & CHARTS */}
        {activeTab === "TELEMETRY" && (
          <div className="bg-slate-950 border border-cyan-500/20 rounded-2xl p-3">
            <IndicatorDetail
              currentSol={currentSol}
              missionData={missionData}
              selectedZone={selectedZone}
            />
          </div>
        )}

        {/* TAB 4: ESCALATION LADDER */}
        {activeTab === "ESCALATION" && (
          <div className="bg-slate-950 border border-cyan-500/20 rounded-2xl p-3">
            <EscalationLadder
              currentTier={currentTier}
              delayMode={delayMode}
              onTriggerAction={() => {}}
              onOpenGroundPacket={onOpenGroundPacket}
            />
          </div>
        )}
      </div>

      {/* FLOATING MOBILE ACTION DOCK */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-cyan-500/30 p-2.5 flex items-center justify-center gap-2 max-w-md mx-auto">
        <button
          onClick={onOpenProcedure}
          className="flex-1 py-2 px-2 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/80 text-emerald-200 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 shadow-[0_0_12px_rgba(16,185,129,0.2)] transition active:scale-95"
        >
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>PROCEDURE</span>
        </button>

        <button
          onClick={onOpenSANS}
          className="flex-1 py-2 px-2 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/80 text-cyan-200 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 shadow-[0_0_12px_rgba(6,182,212,0.2)] transition active:scale-95"
        >
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span>SANS EXAM</span>
        </button>

        <button
          onClick={onOpenGroundPacket}
          className="py-2 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 transition active:scale-95"
        >
          <FileText className="w-3.5 h-3.5 text-cyan-400" />
          <span>DOSSIER</span>
        </button>
      </div>
    </div>
  );
};

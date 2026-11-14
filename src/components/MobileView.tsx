import React, { useState } from "react";
import { AnatomicalZone, HealthStatus, EscalationTier, DailyHealthMetric } from "../types/mission";
import { BodyScanView } from "./BodyScanView";
import { IndicatorDetail } from "./IndicatorDetail";
import { EscalationLadder } from "./EscalationLadder";
import {
  Activity,
  Heart,
  Moon,
  Eye,
  FileText,
  ChevronLeft,
  ChevronRight,
  Scan,
  BarChart3,
  Layers,
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
  const [activeTab, setActiveTab] = useState<"SCAN" | "DASHBOARD" | "CHARTS" | "TIERS">("SCAN");

  const currentMetric = missionData[currentSol - 1] || missionData[0];
  const isCriticalBP = currentMetric.systolicBP >= 140;
  const isWarnSleep = currentMetric.sleepHours < 5.0;

  const activeCrewInfo = crewRoster.find((c) => c.id === activeCrew);

  return (
    <div
      className="flex flex-col w-full max-w-md mx-auto min-h-screen pb-36 select-none"
      style={{
        background: "linear-gradient(180deg, #fafafa 0%, #f0eef8 30%, #f0f4fa 60%, #fdf0ee 100%)",
        fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* CLEAN TOP HEADER */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* Aurora icon */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm"
            style={{ background: "linear-gradient(135deg, #c4b5fd, #fda4af, #93c5fd)" }}
          >
            <span className="text-white text-xs font-bold">A</span>
          </div>
          <div>
            <span className="font-semibold text-gray-900 text-sm">AEGIS</span>
            <span className="text-xs text-gray-400 ml-1.5 font-medium">Sol {currentSol}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleDelay}
            className={`text-[10px] font-medium px-2.5 py-1 rounded-full border transition ${
              delayMode === "MARS_20M_DELAY"
                ? "bg-amber-50 border-amber-200 text-amber-700"
                : "bg-emerald-50 border-emerald-200 text-emerald-700"
            }`}
          >
            {delayMode === "MARS_20M_DELAY" ? "20m lag" : "Real-time"}
          </button>
          <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold shadow-sm">
            {activeCrewInfo?.name?.charAt(4) || "M"}
          </div>
        </div>
      </div>

      {/* CREW SELECTOR — horizontal pills */}
      <div className="flex items-center gap-2 overflow-x-auto py-2.5 px-4 scrollbar-hide">
        {crewRoster.map((crew) => (
          <button
            key={crew.id}
            onClick={() => onSelectCrew(crew.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap border transition ${
              activeCrew === crew.id
                ? "bg-gray-900 text-white border-gray-900 shadow-md font-medium"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                crew.status === "CRITICAL"
                  ? "bg-red-500 animate-pulse"
                  : crew.status === "ATTENTION"
                  ? "bg-amber-500"
                  : "bg-emerald-500"
              }`}
            />
            <span>{crew.name.split(" ")[1] || crew.name}</span>
          </button>
        ))}
      </div>

      {/* SOL STEPPER */}
      <div className="px-4 py-2 flex items-center justify-between">
        <button
          onClick={() => onSelectSol(Math.max(1, currentSol - 1))}
          disabled={currentSol <= 1}
          className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 disabled:opacity-30 hover:bg-gray-50 transition shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center">
          <span className="text-sm font-semibold text-gray-900">
            Mission Day <span className="text-indigo-600">{currentSol}</span>
          </span>
          <span className="text-[11px] text-gray-400 font-medium">
            {currentSol <= 7
              ? "Adaptation baseline"
              : currentSol === 8
              ? "Sensor glitch"
              : currentSol <= 21
              ? "Sleep fragmentation"
              : currentSol <= 24
              ? "Critical BP spike"
              : "Stabilization"}
          </span>
        </div>

        <button
          onClick={() => onSelectSol(Math.min(30, currentSol + 1))}
          disabled={currentSol >= 30}
          className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 disabled:opacity-30 hover:bg-gray-50 transition shadow-sm"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* TAB BAR — clean pills */}
      <div className="flex items-center gap-1.5 px-4 py-1.5">
        {(
          [
            { key: "SCAN", icon: Scan, label: "Body scan" },
            { key: "DASHBOARD", icon: Heart, label: "Vitals" },
            { key: "CHARTS", icon: BarChart3, label: "Trends" },
            { key: "TIERS", icon: Layers, label: "Escalation" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-medium transition ${
              activeTab === tab.key
                ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div className="px-2 flex-1 mt-1">
        {/* TAB 1: BODY SCAN — the hero view */}
        {activeTab === "SCAN" && (
          <BodyScanView
            currentMetric={currentMetric}
            currentSol={currentSol}
            zoneStatuses={zoneStatuses}
            onSelectZone={onSelectZone}
            selectedZone={selectedZone}
            activeCrewName={activeCrewInfo?.name}
          />
        )}

        {/* TAB 2: VITALS DASHBOARD — clean cards */}
        {activeTab === "DASHBOARD" && (
          <div className="px-2 space-y-3">
            <h2 className="text-lg font-semibold text-gray-900 pt-2">
              Today's vitals
              <span className="text-gray-400 font-normal text-sm ml-2">Sol {currentSol}</span>
            </h2>

            {/* RECOVERY SCORE CARD */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-gray-200/60 shadow-sm">
              <span className="text-xs text-gray-500 font-medium">Recovery score</span>
              <div className="flex items-center justify-between mt-1">
                <div>
                  <span className="text-4xl font-bold text-gray-900">
                    {Math.max(
                      20,
                      Math.round(
                        100 - (140 - currentMetric.systolicBP) * 0.5 - (8 - currentMetric.sleepHours) * 5
                      )
                    )}
                  </span>
                  <span className="text-lg text-gray-400 font-medium">/100</span>
                </div>
                <div className="w-14 h-14 relative">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={isCriticalBP ? "#ef4444" : "#818cf8"}
                      strokeWidth="3"
                      strokeDasharray={`${Math.max(
                        20,
                        Math.round(
                          100 - (140 - currentMetric.systolicBP) * 0.5 - (8 - currentMetric.sleepHours) * 5
                        )
                      )}, 100`}
                    />
                  </svg>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <span className={`w-1.5 h-1.5 rounded-full ${isCriticalBP ? "bg-red-500" : "bg-emerald-500"}`} />
                <span className={`text-xs font-medium ${isCriticalBP ? "text-red-600" : "text-emerald-600"}`}>
                  {isCriticalBP ? "Intervention needed" : "Ready for duty"}
                </span>
              </div>
            </div>

            {/* 2x1 VITAL CARDS */}
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => onSelectZone("CARDIOVASCULAR")}
                className="rounded-2xl p-3.5 border border-white/60 shadow-sm cursor-pointer hover:shadow-md transition"
                style={{
                  background: isCriticalBP
                    ? "linear-gradient(135deg, #fef2f2, #fce7f3)"
                    : "linear-gradient(135deg, #eff6ff, #f0f4ff, #fce7f3)",
                }}
              >
                <Heart className="w-5 h-5 text-rose-400 mb-2" />
                <span className="text-xs text-gray-500 block">Blood pressure</span>
                <span className={`text-2xl font-bold ${isCriticalBP ? "text-red-600" : "text-gray-900"}`}>
                  {currentMetric.systolicBP}
                  <span className="text-sm text-gray-400">/{currentMetric.diastolicBP}</span>
                </span>
                <span className="text-[10px] text-gray-400 block mt-0.5">mmHg</span>
              </div>

              <div
                onClick={() => onSelectZone("CARDIOVASCULAR")}
                className="bg-white/80 backdrop-blur-xl rounded-2xl p-3.5 border border-gray-200/60 shadow-sm cursor-pointer"
              >
                <Activity className="w-5 h-5 text-indigo-400 mb-2" />
                <span className="text-xs text-gray-500 block">Heart rate</span>
                <span className="text-2xl font-bold text-gray-900">{currentMetric.heartRate}</span>
                <span className="text-[10px] text-gray-400 block mt-0.5">bpm</span>
              </div>
            </div>

            {/* SLEEP CARD — wide */}
            <div
              onClick={() => onSelectZone("NEURO_BEHAVIORAL")}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-gray-200/60 shadow-sm cursor-pointer flex items-center justify-between"
            >
              <div>
                <Moon className="w-5 h-5 text-indigo-400 mb-1.5" />
                <span className="text-xs text-gray-500 block">Sleep duration</span>
                <div className="flex items-baseline gap-1">
                  <span className={`text-2xl font-bold ${isWarnSleep ? "text-amber-600" : "text-gray-900"}`}>
                    {currentMetric.sleepHours}h
                  </span>
                  {isWarnSleep && (
                    <span className="text-[10px] text-red-500 font-medium">
                      −{(8 - currentMetric.sleepHours).toFixed(1)}h vs std
                    </span>
                  )}
                </div>
              </div>
              <div className="w-24 h-10 flex items-end gap-0.5">
                {missionData.slice(Math.max(0, currentSol - 7), currentSol).map((d, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm transition-all"
                    style={{
                      height: `${(d.sleepHours / 8) * 100}%`,
                      background: d.sleepHours < 5 ? "#f59e0b" : "#818cf8",
                      opacity: 0.5 + (i / 7) * 0.5,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TELEMETRY CHARTS */}
        {activeTab === "CHARTS" && (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/60 shadow-sm p-3 mx-2">
            <IndicatorDetail
              currentSol={currentSol}
              missionData={missionData}
              selectedZone={selectedZone}
            />
          </div>
        )}

        {/* TAB 4: ESCALATION TIERS */}
        {activeTab === "TIERS" && (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/60 shadow-sm p-3 mx-2">
            <EscalationLadder
              currentTier={currentTier}
              delayMode={delayMode}
              onTriggerAction={() => {}}
              onOpenGroundPacket={onOpenGroundPacket}
            />
          </div>
        )}
      </div>

      {/* FLOATING ACTION DOCK */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-gray-200/60 p-3 flex items-center justify-center gap-2 max-w-md mx-auto shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <button
          onClick={onOpenProcedure}
          className="flex-1 py-2.5 bg-gray-900 text-white rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-gray-800 active:scale-[0.98] transition shadow-sm"
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Procedure</span>
        </button>

        <button
          onClick={onOpenSANS}
          className="flex-1 py-2.5 bg-indigo-600 text-white rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-indigo-500 active:scale-[0.98] transition shadow-sm"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>SANS exam</span>
        </button>

        <button
          onClick={onOpenGroundPacket}
          className="py-2.5 px-4 bg-white text-gray-700 border border-gray-200 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-gray-50 active:scale-[0.98] transition shadow-sm"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Dossier</span>
        </button>
      </div>
    </div>
  );
};

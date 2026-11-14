import React, { useState } from "react";
import { AnatomicalZone, HealthStatus, DailyHealthMetric, CommsMode } from "../types/mission";
import { ConstellationGlyph } from "./ConstellationGlyph";
import { Activity, Heart, Moon, Eye, ShieldAlert, Circle, Square, Radio, Thermometer, Wind } from "lucide-react";

interface WearableWatchHUDProps {
  currentSol: number;
  currentMetric: DailyHealthMetric;
  selectedZone: AnatomicalZone;
  onSelectZone: (zone: AnatomicalZone) => void;
  zoneStatuses: Record<AnatomicalZone, HealthStatus>;
  onOpenSANS: () => void;
  onOpenProcedure: () => void;
  onSelectSol?: (sol: number) => void;
  activeCrewName?: string;
  delayMode?: CommsMode;
}

export const WearableWatchHUD: React.FC<WearableWatchHUDProps> = ({
  currentSol,
  currentMetric,
  selectedZone,
  onSelectZone,
  zoneStatuses,
  onOpenSANS,
  onOpenProcedure,
  activeCrewName = "CDR Miller",
  delayMode = "MARS_20M_DELAY",
}) => {
  const [deviceShape, setDeviceShape] = useState<"CIRCULAR" | "RECTANGULAR">("RECTANGULAR");

  const isCriticalBP = currentMetric.systolicBP >= 140;
  const isWarnSleep = currentMetric.sleepHours < 5.0;

  return (
    <div className="flex flex-col items-center justify-center py-4 select-none font-sans">
      {/* SHAPE SELECTOR */}
      <div className="flex items-center gap-1.5 mb-5 bg-white/80 backdrop-blur-md border border-slate-200/80 p-1 rounded-full shadow-sm">
        <span className="text-xs text-slate-400 font-medium px-3">Form factor:</span>
        <button
          onClick={() => setDeviceShape("RECTANGULAR")}
          className={`px-3.5 py-1.5 text-xs rounded-full flex items-center gap-1.5 transition font-medium ${
            deviceShape === "RECTANGULAR"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <Square className="w-3.5 h-3.5" />
          <span>Rectangle cuff</span>
        </button>
        <button
          onClick={() => setDeviceShape("CIRCULAR")}
          className={`px-3.5 py-1.5 text-xs rounded-full flex items-center gap-1.5 transition font-medium ${
            deviceShape === "CIRCULAR"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <Circle className="w-3.5 h-3.5" />
          <span>Circular bezel</span>
        </button>
      </div>

      {/* 1. RECTANGULAR CUFF HUD */}
      {deviceShape === "RECTANGULAR" ? (
        <div className="relative w-[340px] sm:w-[380px] bg-slate-950 text-white rounded-[36px] p-5 shadow-[0_20px_50px_rgba(15,23,42,0.25)] border-[6px] border-slate-800 flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-[30px]" />

          {/* TOP MISSION BANNER */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-2.5 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              <span className="font-semibold text-white tracking-tight">{activeCrewName}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-indigo-400 font-bold bg-indigo-950/80 px-2.5 py-0.5 rounded-full border border-indigo-800 text-[11px]">
                Sol {currentSol}
              </span>
              <span className={`text-[10px] flex items-center gap-1 font-semibold ${
                delayMode === "BLACKOUT" ? "text-rose-400 animate-pulse" : "text-amber-400"
              }`}>
                <Radio className="w-2.5 h-2.5" />
                {delayMode === "BLACKOUT" ? "Blackout" : delayMode === "MARS_20M_DELAY" ? "20m Lag" : "Real"}
              </span>
            </div>
          </div>

          {/* SENSOR ALERT IF SUPPRESSED */}
          {currentMetric.alertSuppressed && (
            <div className="mb-2 px-2.5 py-1 bg-amber-950/60 border border-amber-500/60 rounded-xl flex items-center gap-1.5 text-[10px] text-amber-300 animate-pulse">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Motion noise filtered • SQM {currentMetric.sensorConfidence}%</span>
            </div>
          )}

          {/* DUAL COLUMN: GLYPH + GAUGES */}
          <div className="grid grid-cols-5 gap-2 items-center my-1">
            <div className="col-span-3 flex flex-col items-center justify-center bg-slate-900/80 border border-slate-800/80 rounded-2xl p-2">
              <div className="scale-90 transform -translate-y-1">
                <ConstellationGlyph
                  selectedZone={selectedZone}
                  onSelectZone={onSelectZone}
                  zoneStatuses={zoneStatuses}
                  compact={true}
                />
              </div>
            </div>

            <div className="col-span-2 flex flex-col gap-2">
              {/* BP GAUGE */}
              <div
                onClick={() => onSelectZone("CARDIOVASCULAR")}
                className={`p-2.5 rounded-2xl border cursor-pointer transition ${
                  isCriticalBP
                    ? "bg-rose-950/70 border-rose-500 animate-pulse"
                    : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3 text-rose-400" />
                    <span>BP</span>
                  </span>
                  <span className="text-[9px] text-slate-500">mmHg</span>
                </div>
                <div className="text-sm font-bold text-white tracking-tight">
                  {currentMetric.systolicBP}/{currentMetric.diastolicBP}
                </div>
                <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className={`h-full ${isCriticalBP ? "bg-rose-500" : "bg-indigo-400"}`}
                    style={{ width: `${Math.min(100, (currentMetric.systolicBP / 160) * 100)}%` }}
                  />
                </div>
              </div>

              {/* PULSE GAUGE */}
              <div
                onClick={() => onSelectZone("CARDIOVASCULAR")}
                className="p-2.5 rounded-2xl border bg-slate-900/80 border-slate-800 hover:border-slate-700 cursor-pointer"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                  <span className="flex items-center gap-1">
                    <Activity className="w-3 h-3 text-emerald-400" />
                    <span>Pulse</span>
                  </span>
                  <span className="text-[9px] text-slate-500">bpm</span>
                </div>
                <div className="text-sm font-bold text-white tracking-tight">
                  {currentMetric.heartRate}
                </div>
                <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="h-full bg-emerald-400"
                    style={{ width: `${Math.min(100, (currentMetric.heartRate / 140) * 100)}%` }}
                  />
                </div>
              </div>

              {/* SLEEP GAUGE */}
              <div
                onClick={() => onSelectZone("NEURO_BEHAVIORAL")}
                className={`p-2.5 rounded-2xl border cursor-pointer transition ${
                  isWarnSleep
                    ? "bg-amber-950/70 border-amber-500"
                    : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                  <span className="flex items-center gap-1">
                    <Moon className="w-3 h-3 text-indigo-400" />
                    <span>Sleep</span>
                  </span>
                  <span className="text-[9px] text-slate-500">hrs</span>
                </div>
                <div className="text-sm font-bold text-white tracking-tight">
                  {currentMetric.sleepHours}h
                </div>
                <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className={`h-full ${isWarnSleep ? "bg-amber-400" : "bg-indigo-400"}`}
                    style={{ width: `${Math.min(100, (currentMetric.sleepHours / 8.0) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* AUX ENVIRONMENTAL */}
          <div className="grid grid-cols-2 gap-2 my-2 text-[11px]">
            <div className="bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Wind className="w-3.5 h-3.5 text-indigo-400" />
                <span>ppO2</span>
              </span>
              <span className="font-semibold text-slate-200">21.0 kPa</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                <span>Core</span>
              </span>
              <span className="font-semibold text-slate-200">{currentMetric.bodyTemp}°C</span>
            </div>
          </div>

          {/* QUICK ACTION BUTTONS */}
          <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800">
            <button
              onClick={onOpenSANS}
              className="py-2 px-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-sm"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>SANS Exam</span>
            </button>
            <button
              onClick={onOpenProcedure}
              className="py-2 px-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-sm"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Protocol</span>
            </button>
          </div>

          <div className="text-[9px] text-slate-500 text-center mt-2">
            Synthetic Telemetry • Decision-Support Only
          </div>
        </div>
      ) : (
        /* 2. CIRCULAR BEZEL HUD */
        <div className="relative w-[340px] h-[340px] bg-slate-950 text-white rounded-full p-6 shadow-[0_25px_60px_rgba(15,23,42,0.35)] border-[8px] border-slate-800 flex flex-col items-center justify-between overflow-hidden">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-950/20 via-transparent to-rose-950/20 pointer-events-none" />

          {/* TOP TIME & CREW */}
          <div className="flex flex-col items-center pt-2 z-10">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">{activeCrewName}</span>
            <span className="text-xs font-bold text-indigo-400">Sol {currentSol} / 30</span>
          </div>

          {/* CENTER: CONSTELLATION GLYPH */}
          <div className="relative z-10 scale-95 transform -translate-y-1">
            <ConstellationGlyph
              selectedZone={selectedZone}
              onSelectZone={onSelectZone}
              zoneStatuses={zoneStatuses}
              compact={true}
            />
          </div>

          {/* BOTTOM VITALS SUMMARY */}
          <div className="flex items-center gap-4 pb-2 z-10 text-xs">
            <div className="text-center">
              <span className="text-[9px] text-slate-400 block">BP</span>
              <span className={`font-bold ${isCriticalBP ? "text-rose-400" : "text-white"}`}>
                {currentMetric.systolicBP}/{currentMetric.diastolicBP}
              </span>
            </div>
            <div className="w-px h-6 bg-slate-800" />
            <div className="text-center">
              <span className="text-[9px] text-slate-400 block">HR</span>
              <span className="font-bold text-emerald-400">{currentMetric.heartRate}</span>
            </div>
            <div className="w-px h-6 bg-slate-800" />
            <div className="text-center">
              <span className="text-[9px] text-slate-400 block">Sleep</span>
              <span className={`font-bold ${isWarnSleep ? "text-amber-400" : "text-indigo-400"}`}>
                {currentMetric.sleepHours}h
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

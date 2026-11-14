import React, { useState } from "react";
import { AnatomicalZone, HealthStatus, DailyHealthMetric } from "../types/mission";
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
  delayMode?: "LEO_REALTIME" | "MARS_20M_DELAY";
}

export const WearableWatchHUD: React.FC<WearableWatchHUDProps> = ({
  currentSol,
  currentMetric,
  selectedZone,
  onSelectZone,
  zoneStatuses,
  onOpenSANS,
  onOpenProcedure,
  onSelectSol,
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
          {/* Subtle glass reflection */}
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
              <span className="text-amber-400 text-[10px] flex items-center gap-1">
                <Radio className="w-2.5 h-2.5" />
                {delayMode === "MARS_20M_DELAY" ? "20m lag" : "Real"}
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
              <span className="font-semibold text-slate-200">37.1 °C</span>
            </div>
          </div>

          {/* SOL JUMPER */}
          {onSelectSol && (
            <div className="flex items-center justify-between gap-1 mb-2.5 text-[9px]">
              {[1, 8, 16, 23, 28].map((s) => (
                <button
                  key={s}
                  onClick={() => onSelectSol(s)}
                  className={`flex-1 py-1 rounded-lg border transition font-medium ${
                    currentSol === s
                      ? "bg-indigo-600 border-indigo-500 text-white"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  S{s}
                </button>
              ))}
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex gap-2">
            <button
              onClick={onOpenProcedure}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-md"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Procedure</span>
            </button>

            <button
              onClick={onOpenSANS}
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-md"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>SANS Exam</span>
            </button>
          </div>
        </div>
      ) : (
        /* 2. CIRCULAR BEZEL MODE */
        <div className="relative w-80 sm:w-96 aspect-square rounded-full bg-slate-950 text-white border-[8px] border-slate-800 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.25)] flex flex-col justify-between items-center overflow-hidden">
          <div className="absolute inset-3 rounded-full border border-slate-800 pointer-events-none" />

          {/* TOP CURVED STATUS */}
          <div className="flex flex-col items-center text-center pt-1 z-10">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-white">{activeCrewName}</span>
              <span className="text-slate-600">•</span>
              <span className="text-indigo-400 font-semibold">Sol {currentSol}</span>
            </div>
            {isCriticalBP && (
              <span className="text-[9px] text-rose-400 font-semibold mt-0.5 animate-pulse">
                Critical BP Drift
              </span>
            )}
          </div>

          {/* CENTER 7-DOT GLYPH */}
          <div className="relative my-auto flex flex-col items-center justify-center scale-90">
            <ConstellationGlyph
              selectedZone={selectedZone}
              onSelectZone={onSelectZone}
              zoneStatuses={zoneStatuses}
              compact={true}
            />
          </div>

          {/* BOTTOM QUICK VITALS & ACTION BUTTONS */}
          <div className="flex flex-col items-center w-full z-10 pb-1">
            <div className="flex items-center justify-center gap-3 text-xs mb-2.5 px-4 py-1.5 bg-slate-900 border border-slate-800 rounded-full">
              <span className="text-rose-400 font-semibold">
                {currentMetric.systolicBP}/{currentMetric.diastolicBP}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-semibold">{currentMetric.heartRate} bpm</span>
              <span className="text-slate-600">•</span>
              <span className="text-indigo-400 font-semibold">{currentMetric.sleepHours}h</span>
            </div>

            <div className="flex gap-2 w-full px-4">
              <button
                onClick={onOpenProcedure}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-semibold flex items-center justify-center gap-1 transition"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>LBNP</span>
              </button>
              <button
                onClick={onOpenSANS}
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-xs font-semibold flex items-center justify-center gap-1 transition"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>SANS</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

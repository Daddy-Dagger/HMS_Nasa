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
  activeCrewName = "CDR MILLER",
  delayMode = "MARS_20M_DELAY",
}) => {
  // Shape mode: Circular Bezel vs Rectangular Spacesuit Cuff HUD
  const [deviceShape, setDeviceShape] = useState<"CIRCULAR" | "RECTANGULAR">("RECTANGULAR");

  const isCriticalBP = currentMetric.systolicBP >= 140;
  const isWarnSleep = currentMetric.sleepHours < 5.0;

  return (
    <div className="flex flex-col items-center justify-center py-4 select-none font-mono">
      {/* DEVICE SHAPE SELECTOR SWITCH */}
      <div className="flex items-center gap-2 mb-4 bg-slate-950/80 border border-cyan-500/30 p-1 rounded-lg text-xs">
        <span className="text-[10px] text-slate-400 font-bold px-2 uppercase tracking-wider">HUD FORM FACTOR:</span>
        <button
          onClick={() => setDeviceShape("RECTANGULAR")}
          className={`px-3 py-1 text-[11px] rounded flex items-center gap-1.5 transition ${
            deviceShape === "RECTANGULAR"
              ? "bg-cyan-950 text-cyan-200 border border-cyan-500 font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          <Square className="w-3.5 h-3.5" />
          <span>RECTANGLE CUFF</span>
        </button>
        <button
          onClick={() => setDeviceShape("CIRCULAR")}
          className={`px-3 py-1 text-[11px] rounded flex items-center gap-1.5 transition ${
            deviceShape === "CIRCULAR"
              ? "bg-cyan-950 text-cyan-200 border border-cyan-500 font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          <Circle className="w-3.5 h-3.5" />
          <span>CIRCULAR BEZEL</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* 1. RECTANGULAR SPACESUIT FOREARM CUFF HUD (APPLE WATCH ULTRA / SUIT SLEEVE) */}
      {/* ========================================================= */}
      {deviceShape === "RECTANGULAR" ? (
        <div className="relative w-[340px] sm:w-[380px] bg-slate-950 border-4 border-slate-700/80 rounded-[32px] p-4 shadow-[0_0_40px_rgba(6,182,212,0.2)] flex flex-col justify-between overflow-hidden">
          {/* Subtle titanium frame chamfer & glass reflection */}
          <div className="absolute inset-0 rounded-[28px] border border-cyan-500/20 pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />

          {/* TOP MISSION BANNER */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2 text-[10px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#06b6d4]" />
              <span className="font-bold text-white tracking-wider">{activeCrewName}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40">
                SOL {currentSol}
              </span>
              <span className="text-amber-400 text-[9px] flex items-center gap-1">
                <Radio className="w-2.5 h-2.5" />
                {delayMode === "MARS_20M_DELAY" ? "20m LAG" : "REAL-TIME"}
              </span>
            </div>
          </div>

          {/* SENSOR INTEGRITY / MOTION ARTIFACT BANNER */}
          {currentMetric.alertSuppressed && (
            <div className="mb-2 px-2 py-1 bg-amber-950/60 border border-amber-500/60 rounded flex items-center gap-1.5 text-[9px] text-amber-300 animate-pulse">
              <ShieldAlert className="w-3 h-3 text-amber-400 shrink-0" />
              <span>SENSOR NOISE FILTERED // SQM: {currentMetric.sensorConfidence}%</span>
            </div>
          )}

          {/* MAIN DUAL-COLUMN BODY HUD: GLYPH + RADIAL BIOMETRICS */}
          <div className="grid grid-cols-5 gap-2 items-center my-1">
            {/* LEFT COLUMN: 7-DOT CONSTELLATION GLYPH (COL-SPAN 3) */}
            <div className="col-span-3 flex flex-col items-center justify-center bg-black/60 border border-slate-800/80 rounded-2xl p-2 relative">
              <div className="scale-90 transform -translate-y-1">
                <ConstellationGlyph
                  selectedZone={selectedZone}
                  onSelectZone={onSelectZone}
                  zoneStatuses={zoneStatuses}
                  compact={true}
                />
              </div>
            </div>

            {/* RIGHT COLUMN: RADIAL / GAUGE BIOMETRICS (COL-SPAN 2) */}
            <div className="col-span-2 flex flex-col gap-2">
              {/* BP GAUGE CARD */}
              <div
                onClick={() => onSelectZone("CARDIOVASCULAR")}
                className={`p-2 rounded-xl border cursor-pointer transition ${
                  isCriticalBP
                    ? "bg-rose-950/70 border-rose-500/80 shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-pulse"
                    : "bg-black/70 border-slate-800 hover:border-cyan-500/50"
                }`}
              >
                <div className="flex items-center justify-between text-[9px] text-slate-400 mb-0.5">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3 text-rose-400" />
                    <span>BP</span>
                  </span>
                  <span className="text-[8px] text-slate-500">mmHg</span>
                </div>
                <div className="text-sm font-bold tracking-tight text-white">
                  {currentMetric.systolicBP}/{currentMetric.diastolicBP}
                </div>
                <div className="w-full bg-slate-800 h-1 rounded-full mt-1 overflow-hidden">
                  <div
                    className={`h-full ${isCriticalBP ? "bg-rose-500" : "bg-cyan-400"}`}
                    style={{ width: `${Math.min(100, (currentMetric.systolicBP / 160) * 100)}%` }}
                  />
                </div>
              </div>

              {/* HEART RATE CARD */}
              <div
                onClick={() => onSelectZone("CARDIOVASCULAR")}
                className="p-2 rounded-xl border bg-black/70 border-slate-800 hover:border-cyan-500/50 cursor-pointer"
              >
                <div className="flex items-center justify-between text-[9px] text-slate-400 mb-0.5">
                  <span className="flex items-center gap-1">
                    <Activity className="w-3 h-3 text-emerald-400" />
                    <span>PULSE</span>
                  </span>
                  <span className="text-[8px] text-slate-500">BPM</span>
                </div>
                <div className="text-sm font-bold text-white">
                  {currentMetric.heartRate}
                </div>
                <div className="w-full bg-slate-800 h-1 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full bg-emerald-400"
                    style={{ width: `${Math.min(100, (currentMetric.heartRate / 140) * 100)}%` }}
                  />
                </div>
              </div>

              {/* SLEEP VIGILANCE CARD */}
              <div
                onClick={() => onSelectZone("NEURO_BEHAVIORAL")}
                className={`p-2 rounded-xl border cursor-pointer transition ${
                  isWarnSleep
                    ? "bg-amber-950/70 border-amber-500/80"
                    : "bg-black/70 border-slate-800 hover:border-cyan-500/50"
                }`}
              >
                <div className="flex items-center justify-between text-[9px] text-slate-400 mb-0.5">
                  <span className="flex items-center gap-1">
                    <Moon className="w-3 h-3 text-cyan-400" />
                    <span>SLEEP</span>
                  </span>
                  <span className="text-[8px] text-slate-500">HRS</span>
                </div>
                <div className="text-sm font-bold text-white">
                  {currentMetric.sleepHours}h
                </div>
                <div className="w-full bg-slate-800 h-1 rounded-full mt-1 overflow-hidden">
                  <div
                    className={`h-full ${isWarnSleep ? "bg-amber-400" : "bg-cyan-400"}`}
                    style={{ width: `${Math.min(100, (currentMetric.sleepHours / 8.0) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* AUXILIARY ENVIRONMENTAL / VITALS STRIP */}
          <div className="grid grid-cols-2 gap-2 my-2 text-[10px]">
            <div className="bg-black/50 border border-slate-800/80 px-2 py-1 rounded-lg flex items-center justify-between">
              <span className="flex items-center gap-1 text-slate-400">
                <Wind className="w-3 h-3 text-cyan-400" />
                <span>ppO2</span>
              </span>
              <span className="font-bold text-slate-200">21.0 kPa</span>
            </div>
            <div className="bg-black/50 border border-slate-800/80 px-2 py-1 rounded-lg flex items-center justify-between">
              <span className="flex items-center gap-1 text-slate-400">
                <Thermometer className="w-3 h-3 text-amber-400" />
                <span>CORE</span>
              </span>
              <span className="font-bold text-slate-200">37.1 °C</span>
            </div>
          </div>

          {/* MINI SOL QUICK-JUMP SCRUBBER */}
          {onSelectSol && (
            <div className="flex items-center justify-between gap-1 mb-2 text-[8px]">
              {[1, 8, 16, 23, 28].map((s) => (
                <button
                  key={s}
                  onClick={() => onSelectSol(s)}
                  className={`flex-1 py-0.5 rounded border transition ${
                    currentSol === s
                      ? "bg-cyan-950 border-cyan-400 text-cyan-200 font-bold"
                      : "bg-black/60 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  S{s}
                </button>
              ))}
            </div>
          )}

          {/* TACTICAL ACTION PILLS */}
          <div className="flex gap-2 z-10">
            <button
              onClick={onOpenProcedure}
              className="flex-1 py-2 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/80 text-emerald-200 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.2)] transition active:scale-95"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>LBNP COUNTERMEASURE</span>
            </button>

            <button
              onClick={onOpenSANS}
              className="flex-1 py-2 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/80 text-cyan-200 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.2)] transition active:scale-95"
            >
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>SANS EXAM</span>
            </button>
          </div>
        </div>
      ) : (
        /* ========================================================= */
        /* 2. CIRCULAR BEZEL MODE (AEROSPACE SMARTWATCH / WRIST RING) */
        /* ========================================================= */
        <div className="relative w-80 sm:w-96 aspect-square rounded-full bg-slate-950 border-[6px] border-slate-800 p-6 shadow-[0_0_50px_rgba(6,182,212,0.25)] flex flex-col justify-between items-center overflow-hidden">
          {/* BEZEL CONCENTRIC DIAL RINGS */}
          <div className="absolute inset-2 rounded-full border border-cyan-500/30 pointer-events-none" />
          <div className="absolute inset-5 rounded-full border border-slate-800/80 pointer-events-none" />

          {/* TOP CURVED STATUS */}
          <div className="flex flex-col items-center text-center z-10 pt-1">
            <div className="flex items-center gap-1.5 text-[9px] text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="font-bold text-white">{activeCrewName}</span>
              <span className="text-slate-600">|</span>
              <span className="text-cyan-400 font-bold">SOL {currentSol}</span>
            </div>
            {isCriticalBP && (
              <span className="text-[8px] text-rose-400 font-bold tracking-wider animate-pulse mt-0.5">
                CRITICAL HYPERTENSION DRIFT
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
            {/* MINI METRIC READOUT */}
            <div className="flex items-center justify-center gap-3 text-[10px] mb-2 px-3 py-1 bg-black/80 border border-slate-800 rounded-full">
              <span className="text-rose-400 font-bold">
                {currentMetric.systolicBP}/{currentMetric.diastolicBP}
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-emerald-400 font-bold">{currentMetric.heartRate} bpm</span>
              <span className="text-slate-600">|</span>
              <span className="text-cyan-400 font-bold">{currentMetric.sleepHours}h</span>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-2 w-full px-4">
              <button
                onClick={onOpenProcedure}
                className="flex-1 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/70 text-emerald-200 rounded-full text-[9px] font-bold flex items-center justify-center gap-1 transition"
              >
                <Activity className="w-3 h-3 text-emerald-400" />
                <span>LBNP</span>
              </button>
              <button
                onClick={onOpenSANS}
                className="flex-1 py-1.5 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/70 text-cyan-200 rounded-full text-[9px] font-bold flex items-center justify-center gap-1 transition"
              >
                <Eye className="w-3 h-3 text-cyan-400" />
                <span>SANS</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

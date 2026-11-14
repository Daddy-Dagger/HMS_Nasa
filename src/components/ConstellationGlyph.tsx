import React from "react";
import { AnatomicalZone, HealthStatus } from "../types/mission";

interface ConstellationGlyphProps {
  selectedZone: AnatomicalZone;
  onSelectZone: (zone: AnatomicalZone) => void;
  zoneStatuses: Record<AnatomicalZone, HealthStatus>;
  compact?: boolean;
}

export const ConstellationGlyph: React.FC<ConstellationGlyphProps> = ({
  selectedZone,
  onSelectZone,
  zoneStatuses,
  compact = false,
}) => {
  const getStatusColor = (status: HealthStatus) => {
    switch (status) {
      case "CRITICAL":
        return "#f43f5e"; // rose-500
      case "ATTENTION":
        return "#f59e0b"; // amber-500
      case "NOMINAL":
      default:
        return "#06b6d4"; // cyan-500
    }
  };

  const getStatusGlowClass = (status: HealthStatus) => {
    switch (status) {
      case "CRITICAL":
        return "glow-rose animate-pulse";
      case "ATTENTION":
        return "glow-amber";
      case "NOMINAL":
      default:
        return "glow-cyan";
    }
  };

  const sizeClass = compact ? "w-44 h-56" : "w-56 h-72";

  return (
    <div className="flex flex-col items-center justify-center select-none font-mono">
      <div className={`relative ${sizeClass} flex items-center justify-center`}>
        <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-[0_0_20px_rgba(6,182,212,0.2)]">
          <defs>
            {/* GRADIENT CONNECTORS */}
            <linearGradient id="glyph-trace-cranial" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={getStatusColor(zoneStatuses.CRANIAL_SANS)} stopOpacity="0.8" />
              <stop offset="100%" stopColor={getStatusColor(zoneStatuses.CARDIOVASCULAR)} stopOpacity="0.8" />
            </linearGradient>

            <linearGradient id="glyph-trace-core" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={getStatusColor(zoneStatuses.CARDIOVASCULAR)} stopOpacity="0.8" />
              <stop offset="100%" stopColor={getStatusColor(zoneStatuses.NEURO_BEHAVIORAL)} stopOpacity="0.8" />
            </linearGradient>

            <linearGradient id="glyph-trace-legs" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={getStatusColor(zoneStatuses.NEURO_BEHAVIORAL)} stopOpacity="0.8" />
              <stop offset="100%" stopColor={getStatusColor(zoneStatuses.MUSCULOSKELETAL)} stopOpacity="0.8" />
            </linearGradient>

            {/* RADIAL GLOW FOR NODES */}
            <radialGradient id="node-glow-cranial">
              <stop offset="0%" stopColor={getStatusColor(zoneStatuses.CRANIAL_SANS)} stopOpacity="0.9" />
              <stop offset="100%" stopColor="#030712" stopOpacity="0.1" />
            </radialGradient>
            <radialGradient id="node-glow-cardio">
              <stop offset="0%" stopColor={getStatusColor(zoneStatuses.CARDIOVASCULAR)} stopOpacity="0.9" />
              <stop offset="100%" stopColor="#030712" stopOpacity="0.1" />
            </radialGradient>
          </defs>

          {/* BACKGROUND TARGET HUD CIRCLES */}
          <circle cx="100" cy="115" r="95" stroke="#1e293b" strokeWidth="0.75" strokeDasharray="4 4" fill="none" opacity="0.4" />
          <circle cx="100" cy="115" r="65" stroke="#1e293b" strokeWidth="0.75" strokeDasharray="3 3" fill="none" opacity="0.3" />

          {/* CONSTELLATION BONES (CONNECTING GLOW LINES) */}
          {/* Head to Heart */}
          <line x1="100" y1="35" x2="100" y2="85" stroke="url(#glyph-trace-cranial)" strokeWidth="2" strokeDasharray="2 2" />
          {/* Heart to Left Arm */}
          <line x1="100" y1="85" x2="45" y2="85" stroke={getStatusColor(zoneStatuses.CARDIOVASCULAR)} strokeWidth="1.5" strokeOpacity="0.7" strokeDasharray="2 2" />
          {/* Heart to Right Arm */}
          <line x1="100" y1="85" x2="155" y2="85" stroke={getStatusColor(zoneStatuses.CARDIOVASCULAR)} strokeWidth="1.5" strokeOpacity="0.7" strokeDasharray="2 2" />
          {/* Heart to Core */}
          <line x1="100" y1="85" x2="100" y2="135" stroke="url(#glyph-trace-core)" strokeWidth="2" strokeDasharray="2 2" />
          {/* Core to Left Leg */}
          <line x1="100" y1="135" x2="65" y2="205" stroke="url(#glyph-trace-legs)" strokeWidth="1.5" strokeOpacity="0.7" strokeDasharray="2 2" />
          {/* Core to Right Leg */}
          <line x1="100" y1="135" x2="135" y2="205" stroke="url(#glyph-trace-legs)" strokeWidth="1.5" strokeOpacity="0.7" strokeDasharray="2 2" />

          {/* 1. HEAD / CRANIAL SANS (TOP DOT) */}
          <g onClick={() => onSelectZone("CRANIAL_SANS")} className="cursor-pointer group">
            {/* Outer halo */}
            <circle
              cx="100"
              cy="35"
              r={selectedZone === "CRANIAL_SANS" ? "16" : "12"}
              fill="none"
              stroke={getStatusColor(zoneStatuses.CRANIAL_SANS)}
              strokeWidth="1"
              strokeOpacity="0.4"
              className={getStatusGlowClass(zoneStatuses.CRANIAL_SANS)}
            />
            {/* Base node circle */}
            <circle
              cx="100"
              cy="35"
              r={selectedZone === "CRANIAL_SANS" ? "11" : "8"}
              fill="#030712"
              stroke={getStatusColor(zoneStatuses.CRANIAL_SANS)}
              strokeWidth={selectedZone === "CRANIAL_SANS" ? "2.5" : "1.75"}
            />
            {/* Center glowing dot */}
            <circle cx="100" cy="35" r="4" fill={getStatusColor(zoneStatuses.CRANIAL_SANS)} className="animate-pulse" />
            <text x="100" y="15" fill="#94a3b8" fontSize="8" textAnchor="middle" fontWeight="bold" letterSpacing="1">
              HEAD // SANS
            </text>
          </g>

          {/* 2. HEART / CARDIOVASCULAR (CHEST CENTER DOT) */}
          <g onClick={() => onSelectZone("CARDIOVASCULAR")} className="cursor-pointer group">
            {/* Pulsing alert ring */}
            <circle
              cx="100"
              cy="85"
              r={selectedZone === "CARDIOVASCULAR" ? "18" : "13"}
              fill="none"
              stroke={getStatusColor(zoneStatuses.CARDIOVASCULAR)}
              strokeWidth="1"
              strokeOpacity="0.5"
              className={getStatusGlowClass(zoneStatuses.CARDIOVASCULAR)}
            />
            <circle
              cx="100"
              cy="85"
              r={selectedZone === "CARDIOVASCULAR" ? "12" : "9"}
              fill="#030712"
              stroke={getStatusColor(zoneStatuses.CARDIOVASCULAR)}
              strokeWidth={selectedZone === "CARDIOVASCULAR" ? "2.5" : "1.75"}
            />
            <circle cx="100" cy="85" r="5" fill={getStatusColor(zoneStatuses.CARDIOVASCULAR)} className="animate-pulse" />
            <text x="100" y="70" fill="#94a3b8" fontSize="8" textAnchor="middle" fontWeight="bold" letterSpacing="1">
              HEART // BP
            </text>
          </g>

          {/* 3. LEFT ARM (VASCULAR / PERIPHERAL PULSE DOT) */}
          <g onClick={() => onSelectZone("CARDIOVASCULAR")} className="cursor-pointer group">
            <circle
              cx="45"
              cy="85"
              r="7"
              fill="#030712"
              stroke={getStatusColor(zoneStatuses.CARDIOVASCULAR)}
              strokeWidth="1.5"
            />
            <circle cx="45" cy="85" r="3" fill={getStatusColor(zoneStatuses.CARDIOVASCULAR)} />
            <text x="35" y="70" fill="#64748b" fontSize="7" textAnchor="middle">
              L-ARM
            </text>
          </g>

          {/* 4. RIGHT ARM (VASCULAR / PERIPHERAL PULSE DOT) */}
          <g onClick={() => onSelectZone("CARDIOVASCULAR")} className="cursor-pointer group">
            <circle
              cx="155"
              cy="85"
              r="7"
              fill="#030712"
              stroke={getStatusColor(zoneStatuses.CARDIOVASCULAR)}
              strokeWidth="1.5"
            />
            <circle cx="155" cy="85" r="3" fill={getStatusColor(zoneStatuses.CARDIOVASCULAR)} />
            <text x="165" y="70" fill="#64748b" fontSize="7" textAnchor="middle">
              R-ARM
            </text>
          </g>

          {/* 5. CORE / METABOLIC & SLEEP (ABDOMEN DOT) */}
          <g onClick={() => onSelectZone("NEURO_BEHAVIORAL")} className="cursor-pointer group">
            <circle
              cx="100"
              cy="135"
              r={selectedZone === "NEURO_BEHAVIORAL" ? "14" : "10"}
              fill="#030712"
              stroke={getStatusColor(zoneStatuses.NEURO_BEHAVIORAL)}
              strokeWidth={selectedZone === "NEURO_BEHAVIORAL" ? "2.5" : "1.5"}
            />
            <circle cx="100" cy="135" r="3.5" fill={getStatusColor(zoneStatuses.NEURO_BEHAVIORAL)} />
            <text x="100" y="152" fill="#94a3b8" fontSize="8" textAnchor="middle" fontWeight="bold" letterSpacing="1">
              CORE // SLEEP
            </text>
          </g>

          {/* 6. LEFT LEG (MUSCULOSKELETAL / BONE DENSITY / LBNP) */}
          <g onClick={() => onSelectZone("MUSCULOSKELETAL")} className="cursor-pointer group">
            <circle
              cx="65"
              cy="205"
              r={selectedZone === "MUSCULOSKELETAL" ? "12" : "8"}
              fill="#030712"
              stroke={getStatusColor(zoneStatuses.MUSCULOSKELETAL)}
              strokeWidth={selectedZone === "MUSCULOSKELETAL" ? "2.5" : "1.5"}
            />
            <circle cx="65" cy="205" r="3" fill={getStatusColor(zoneStatuses.MUSCULOSKELETAL)} />
            <text x="65" y="222" fill="#64748b" fontSize="7" textAnchor="middle">
              L-LEG
            </text>
          </g>

          {/* 7. RIGHT LEG (MUSCULOSKELETAL / BONE DENSITY / LBNP) */}
          <g onClick={() => onSelectZone("MUSCULOSKELETAL")} className="cursor-pointer group">
            <circle
              cx="135"
              cy="205"
              r={selectedZone === "MUSCULOSKELETAL" ? "12" : "8"}
              fill="#030712"
              stroke={getStatusColor(zoneStatuses.MUSCULOSKELETAL)}
              strokeWidth={selectedZone === "MUSCULOSKELETAL" ? "2.5" : "1.5"}
            />
            <circle cx="135" cy="205" r="3" fill={getStatusColor(zoneStatuses.MUSCULOSKELETAL)} />
            <text x="135" y="222" fill="#64748b" fontSize="7" textAnchor="middle">
              R-LEG
            </text>
          </g>
        </svg>
      </div>

      {/* SELECTED ZONE INDICATOR PILL */}
      <div className="mt-1 flex items-center gap-2 text-[10px] px-3 py-0.5 bg-slate-950/90 border border-cyan-500/30 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.1)]">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        <span className="text-slate-400 uppercase text-[9px]">FOCUS:</span>
        <span className="text-cyan-300 font-bold">{selectedZone.replace("_", " ")}</span>
      </div>
    </div>
  );
};

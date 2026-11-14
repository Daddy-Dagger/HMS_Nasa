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

  // Node coordinates for 7-Dot Constellation Body Figure
  // Top: Head (100, 30)
  // Chest/Heart: Center (100, 85)
  // Left Arm: (45, 85)
  // Right Arm: (155, 85)
  // Abdomen/Core: (100, 135)
  // Left Leg: (65, 205)
  // Right Leg: (135, 205)

  const sizeClass = compact ? "w-44 h-56" : "w-56 h-72";

  return (
    <div className="flex flex-col items-center justify-center select-none font-mono">
      <div className={`relative ${sizeClass} flex items-center justify-center`}>
        <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-[0_0_15px_rgba(6,182,212,0.15)]">
          {/* CONSTELLATION BONES (CONNECTING GLOW LINES) */}
          <line x1="100" y1="35" x2="100" y2="85" stroke="#334155" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="100" y1="85" x2="45" y2="85" stroke="#334155" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="100" y1="85" x2="155" y2="85" stroke="#334155" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="100" y1="85" x2="100" y2="135" stroke="#334155" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="100" y1="135" x2="65" y2="205" stroke="#334155" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="100" y1="135" x2="135" y2="205" stroke="#334155" strokeWidth="1.5" strokeDasharray="3 3" />

          {/* 1. HEAD / CRANIAL SANS (TOP DOT) */}
          <g onClick={() => onSelectZone("CRANIAL_SANS")} className="cursor-pointer group">
            <circle
              cx="100"
              cy="35"
              r={selectedZone === "CRANIAL_SANS" ? "12" : "9"}
              fill="#030712"
              stroke={getStatusColor(zoneStatuses.CRANIAL_SANS)}
              strokeWidth={selectedZone === "CRANIAL_SANS" ? "3" : "2"}
              className="transition-all"
            />
            <circle cx="100" cy="35" r="4" fill={getStatusColor(zoneStatuses.CRANIAL_SANS)} className="animate-pulse" />
            <text x="100" y="16" fill="#94a3b8" fontSize="8" textAnchor="middle" letterSpacing="1">
              HEAD // SANS
            </text>
          </g>

          {/* 2. HEART / CARDIOVASCULAR (CHEST CENTER DOT) */}
          <g onClick={() => onSelectZone("CARDIOVASCULAR")} className="cursor-pointer group">
            <circle
              cx="100"
              cy="85"
              r={selectedZone === "CARDIOVASCULAR" ? "14" : "10"}
              fill="#030712"
              stroke={getStatusColor(zoneStatuses.CARDIOVASCULAR)}
              strokeWidth={selectedZone === "CARDIOVASCULAR" ? "3" : "2"}
              className="transition-all"
            />
            <circle cx="100" cy="85" r="5" fill={getStatusColor(zoneStatuses.CARDIOVASCULAR)} className="animate-pulse" />
            <text x="100" y="70" fill="#94a3b8" fontSize="8" textAnchor="middle" letterSpacing="1">
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
              strokeWidth="2"
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
              strokeWidth="2"
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
              r={selectedZone === "NEURO_BEHAVIORAL" ? "12" : "8"}
              fill="#030712"
              stroke={getStatusColor(zoneStatuses.NEURO_BEHAVIORAL)}
              strokeWidth={selectedZone === "NEURO_BEHAVIORAL" ? "3" : "2"}
            />
            <circle cx="100" cy="135" r="3.5" fill={getStatusColor(zoneStatuses.NEURO_BEHAVIORAL)} />
            <text x="100" y="152" fill="#94a3b8" fontSize="8" textAnchor="middle" letterSpacing="1">
              CORE // SLEEP
            </text>
          </g>

          {/* 6. LEFT LEG (MUSCULOSKELETAL / BONE DENSITY / LBNP) */}
          <g onClick={() => onSelectZone("MUSCULOSKELETAL")} className="cursor-pointer group">
            <circle
              cx="65"
              cy="205"
              r={selectedZone === "MUSCULOSKELETAL" ? "11" : "8"}
              fill="#030712"
              stroke={getStatusColor(zoneStatuses.MUSCULOSKELETAL)}
              strokeWidth={selectedZone === "MUSCULOSKELETAL" ? "3" : "2"}
            />
            <circle cx="65" cy="205" r="3.5" fill={getStatusColor(zoneStatuses.MUSCULOSKELETAL)} />
            <text x="65" y="222" fill="#64748b" fontSize="7" textAnchor="middle">
              L-LEG
            </text>
          </g>

          {/* 7. RIGHT LEG (MUSCULOSKELETAL / BONE DENSITY / LBNP) */}
          <g onClick={() => onSelectZone("MUSCULOSKELETAL")} className="cursor-pointer group">
            <circle
              cx="135"
              cy="205"
              r={selectedZone === "MUSCULOSKELETAL" ? "11" : "8"}
              fill="#030712"
              stroke={getStatusColor(zoneStatuses.MUSCULOSKELETAL)}
              strokeWidth={selectedZone === "MUSCULOSKELETAL" ? "3" : "2"}
            />
            <circle cx="135" cy="205" r="3.5" fill={getStatusColor(zoneStatuses.MUSCULOSKELETAL)} />
            <text x="135" y="222" fill="#64748b" fontSize="7" textAnchor="middle">
              R-LEG
            </text>
          </g>
        </svg>
      </div>

      <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-2">
        <span>ACTIVE GLYPH:</span>
        <span className="text-cyan-400 font-bold uppercase">{selectedZone.replace("_", " ")}</span>
      </div>
    </div>
  );
};

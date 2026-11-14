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
        return "#6366f1"; // indigo-500
    }
  };

  const sizeClass = compact ? "w-44 h-56" : "w-56 h-72";

  return (
    <div className="flex flex-col items-center justify-center select-none font-sans">
      <div className={`relative ${sizeClass} flex items-center justify-center`}>
        <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-sm">
          {/* BACKGROUND TARGET HUD CIRCLES */}
          <circle cx="100" cy="115" r="95" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" fill="none" opacity="0.7" />
          <circle cx="100" cy="115" r="65" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.6" />

          {/* CONSTELLATION BONES (CONNECTING LINES) */}
          <line x1="100" y1="35" x2="100" y2="85" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="100" y1="85" x2="45" y2="85" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="100" y1="85" x2="155" y2="85" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="100" y1="85" x2="100" y2="135" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="100" y1="135" x2="65" y2="205" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="100" y1="135" x2="135" y2="205" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3 3" />

          {/* 1. HEAD / CRANIAL SANS (TOP DOT) */}
          <g onClick={() => onSelectZone("CRANIAL_SANS")} className="cursor-pointer group">
            <circle
              cx="100"
              cy="35"
              r={selectedZone === "CRANIAL_SANS" ? "14" : "10"}
              fill="#ffffff"
              stroke={getStatusColor(zoneStatuses.CRANIAL_SANS)}
              strokeWidth={selectedZone === "CRANIAL_SANS" ? "3" : "2"}
              className="transition-all"
            />
            <circle cx="100" cy="35" r="4" fill={getStatusColor(zoneStatuses.CRANIAL_SANS)} />
            <text x="100" y="15" fill="#64748b" fontSize="9" textAnchor="middle" fontWeight="600">
              Head / SANS
            </text>
          </g>

          {/* 2. HEART / CARDIOVASCULAR (CHEST CENTER DOT) */}
          <g onClick={() => onSelectZone("CARDIOVASCULAR")} className="cursor-pointer group">
            <circle
              cx="100"
              cy="85"
              r={selectedZone === "CARDIOVASCULAR" ? "16" : "11"}
              fill="#ffffff"
              stroke={getStatusColor(zoneStatuses.CARDIOVASCULAR)}
              strokeWidth={selectedZone === "CARDIOVASCULAR" ? "3" : "2"}
              className="transition-all"
            />
            <circle cx="100" cy="85" r="5" fill={getStatusColor(zoneStatuses.CARDIOVASCULAR)} />
            <text x="100" y="70" fill="#64748b" fontSize="9" textAnchor="middle" fontWeight="600">
              Heart / BP
            </text>
          </g>

          {/* 3. LEFT ARM */}
          <g onClick={() => onSelectZone("CARDIOVASCULAR")} className="cursor-pointer group">
            <circle
              cx="45"
              cy="85"
              r="7"
              fill="#ffffff"
              stroke={getStatusColor(zoneStatuses.CARDIOVASCULAR)}
              strokeWidth="2"
            />
            <circle cx="45" cy="85" r="3" fill={getStatusColor(zoneStatuses.CARDIOVASCULAR)} />
            <text x="35" y="70" fill="#94a3b8" fontSize="8" textAnchor="middle">
              L-Arm
            </text>
          </g>

          {/* 4. RIGHT ARM */}
          <g onClick={() => onSelectZone("CARDIOVASCULAR")} className="cursor-pointer group">
            <circle
              cx="155"
              cy="85"
              r="7"
              fill="#ffffff"
              stroke={getStatusColor(zoneStatuses.CARDIOVASCULAR)}
              strokeWidth="2"
            />
            <circle cx="155" cy="85" r="3" fill={getStatusColor(zoneStatuses.CARDIOVASCULAR)} />
            <text x="165" y="70" fill="#94a3b8" fontSize="8" textAnchor="middle">
              R-Arm
            </text>
          </g>

          {/* 5. CORE / METABOLIC & SLEEP */}
          <g onClick={() => onSelectZone("NEURO_BEHAVIORAL")} className="cursor-pointer group">
            <circle
              cx="100"
              cy="135"
              r={selectedZone === "NEURO_BEHAVIORAL" ? "14" : "10"}
              fill="#ffffff"
              stroke={getStatusColor(zoneStatuses.NEURO_BEHAVIORAL)}
              strokeWidth={selectedZone === "NEURO_BEHAVIORAL" ? "3" : "2"}
            />
            <circle cx="100" cy="135" r="3.5" fill={getStatusColor(zoneStatuses.NEURO_BEHAVIORAL)} />
            <text x="100" y="152" fill="#64748b" fontSize="9" textAnchor="middle" fontWeight="600">
              Core / Sleep
            </text>
          </g>

          {/* 6. LEFT LEG */}
          <g onClick={() => onSelectZone("MUSCULOSKELETAL")} className="cursor-pointer group">
            <circle
              cx="65"
              cy="205"
              r={selectedZone === "MUSCULOSKELETAL" ? "12" : "8"}
              fill="#ffffff"
              stroke={getStatusColor(zoneStatuses.MUSCULOSKELETAL)}
              strokeWidth={selectedZone === "MUSCULOSKELETAL" ? "3" : "2"}
            />
            <circle cx="65" cy="205" r="3" fill={getStatusColor(zoneStatuses.MUSCULOSKELETAL)} />
            <text x="65" y="222" fill="#94a3b8" fontSize="8" textAnchor="middle">
              L-Leg
            </text>
          </g>

          {/* 7. RIGHT LEG */}
          <g onClick={() => onSelectZone("MUSCULOSKELETAL")} className="cursor-pointer group">
            <circle
              cx="135"
              cy="205"
              r={selectedZone === "MUSCULOSKELETAL" ? "12" : "8"}
              fill="#ffffff"
              stroke={getStatusColor(zoneStatuses.MUSCULOSKELETAL)}
              strokeWidth={selectedZone === "MUSCULOSKELETAL" ? "3" : "2"}
            />
            <circle cx="135" cy="205" r="3" fill={getStatusColor(zoneStatuses.MUSCULOSKELETAL)} />
            <text x="135" y="222" fill="#94a3b8" fontSize="8" textAnchor="middle">
              R-Leg
            </text>
          </g>
        </svg>
      </div>

      {/* ACTIVE PILL */}
      <div className="mt-2 flex items-center gap-2 text-xs px-3 py-1 bg-white border border-slate-200/80 rounded-full shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
        <span className="text-slate-400 font-medium text-[11px]">Selected:</span>
        <span className="text-slate-800 font-semibold">{selectedZone.replace("_", " ")}</span>
      </div>
    </div>
  );
};

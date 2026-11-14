import React from "react";
import { AnatomicalZone, HealthStatus } from "../types/mission";
import { Eye, Heart, Activity, Shield, Brain } from "lucide-react";

interface BodyMapProps {
  selectedZone: AnatomicalZone;
  onSelectZone: (zone: AnatomicalZone) => void;
  zoneStatuses: Record<AnatomicalZone, HealthStatus>;
}

export const BodyMap: React.FC<BodyMapProps> = ({
  selectedZone,
  onSelectZone,
  zoneStatuses,
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

  const getStatusBadge = (status: HealthStatus) => {
    switch (status) {
      case "CRITICAL":
        return "bg-rose-950 text-rose-300 border-rose-600";
      case "ATTENTION":
        return "bg-amber-950 text-amber-300 border-amber-600";
      case "NOMINAL":
      default:
        return "bg-cyan-950 text-cyan-300 border-cyan-700";
    }
  };

  return (
    <div className="h-full bg-black border border-slate-800 p-4 font-mono select-none flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-bold tracking-widest text-white uppercase">
              ANATOMICAL BODY MAP
            </span>
          </div>
          <span className="text-[9px] px-1.5 py-0.5 bg-slate-900 border border-slate-800 text-slate-400">
            5 NASA HAZARD ZONES
          </span>
        </div>

        {/* SVG INTERACTIVE HUMAN VECTOR */}
        <div className="relative aspect-[3/4] bg-slate-950/60 border border-slate-800/80 flex items-center justify-center p-2 mb-3">
          <svg
            viewBox="0 0 200 320"
            className="w-full h-full max-h-[280px] drop-shadow-[0_0_15px_rgba(6,182,212,0.1)]"
          >
            {/* GRID LINES BACKGROUND */}
            <line x1="100" y1="0" x2="100" y2="320" stroke="#1e293b" strokeDasharray="2 2" />
            <line x1="0" y1="160" x2="200" y2="160" stroke="#1e293b" strokeDasharray="2 2" />

            {/* 1. CRANIAL / OCULAR / SANS (HEAD) */}
            <g
              onClick={() => onSelectZone("CRANIAL_SANS")}
              className="cursor-pointer transition-transform hover:scale-105"
            >
              <circle
                cx="100"
                cy="38"
                r="22"
                fill="#030712"
                stroke={getStatusColor(zoneStatuses.CRANIAL_SANS)}
                strokeWidth={selectedZone === "CRANIAL_SANS" ? "3" : "1.5"}
                className={selectedZone === "CRANIAL_SANS" ? "filter drop-shadow-[0_0_8px_#06b6d4]" : ""}
              />
              {/* Eye & Intracranial Icon */}
              <circle cx="92" cy="36" r="2.5" fill={getStatusColor(zoneStatuses.CRANIAL_SANS)} />
              <circle cx="108" cy="36" r="2.5" fill={getStatusColor(zoneStatuses.CRANIAL_SANS)} />
              <path d="M 94 45 Q 100 48 106 45" stroke={getStatusColor(zoneStatuses.CRANIAL_SANS)} strokeWidth="1.5" fill="none" />
            </g>

            {/* 2. CARDIOVASCULAR (CHEST / HEART) */}
            <g
              onClick={() => onSelectZone("CARDIOVASCULAR")}
              className="cursor-pointer transition-transform hover:scale-105"
            >
              <path
                d="M 72 65 L 128 65 L 120 125 L 80 125 Z"
                fill="#030712"
                stroke={getStatusColor(zoneStatuses.CARDIOVASCULAR)}
                strokeWidth={selectedZone === "CARDIOVASCULAR" ? "3" : "1.5"}
                className={selectedZone === "CARDIOVASCULAR" ? "filter drop-shadow-[0_0_8px_#06b6d4]" : ""}
              />
              {/* Heart Symbol */}
              <circle cx="94" cy="90" r="5" fill={getStatusColor(zoneStatuses.CARDIOVASCULAR)} opacity="0.8" />
              <path d="M 88 88 Q 94 80 100 88 T 100 98 L 94 104 L 88 98 Z" fill={getStatusColor(zoneStatuses.CARDIOVASCULAR)} opacity="0.3" />
            </g>

            {/* 3. IMMUNE & METABOLIC (ABDOMEN) */}
            <g
              onClick={() => onSelectZone("IMMUNE_METABOLIC")}
              className="cursor-pointer transition-transform hover:scale-105"
            >
              <path
                d="M 80 128 L 120 128 L 115 168 L 85 168 Z"
                fill="#030712"
                stroke={getStatusColor(zoneStatuses.IMMUNE_METABOLIC)}
                strokeWidth={selectedZone === "IMMUNE_METABOLIC" ? "3" : "1.5"}
                className={selectedZone === "IMMUNE_METABOLIC" ? "filter drop-shadow-[0_0_8px_#06b6d4]" : ""}
              />
              {/* Metabolic grid */}
              <circle cx="100" cy="148" r="3" fill={getStatusColor(zoneStatuses.IMMUNE_METABOLIC)} />
            </g>

            {/* 4. MUSCULOSKELETAL (ARMS, PELVIS & LEGS) */}
            <g
              onClick={() => onSelectZone("MUSCULOSKELETAL")}
              className="cursor-pointer transition-transform hover:scale-105"
            >
              {/* Arms */}
              <path d="M 68 70 L 45 130 L 40 170" stroke={getStatusColor(zoneStatuses.MUSCULOSKELETAL)} strokeWidth="5" strokeLinecap="round" fill="none" />
              <path d="M 132 70 L 155 130 L 160 170" stroke={getStatusColor(zoneStatuses.MUSCULOSKELETAL)} strokeWidth="5" strokeLinecap="round" fill="none" />
              {/* Pelvis & Legs */}
              <path d="M 85 170 L 78 240 L 75 305" stroke={getStatusColor(zoneStatuses.MUSCULOSKELETAL)} strokeWidth="7" strokeLinecap="round" fill="none" />
              <path d="M 115 170 L 122 240 L 125 305" stroke={getStatusColor(zoneStatuses.MUSCULOSKELETAL)} strokeWidth="7" strokeLinecap="round" fill="none" />
            </g>

            {/* 5. NEURO-BEHAVIORAL (SPINE & SYNAPSE OVERLAY) */}
            <g
              onClick={() => onSelectZone("NEURO_BEHAVIORAL")}
              className="cursor-pointer"
            >
              <line x1="100" y1="65" x2="100" y2="170" stroke={getStatusColor(zoneStatuses.NEURO_BEHAVIORAL)} strokeWidth="3" strokeDasharray="3 3" />
            </g>
          </svg>

          {/* ACTIVE SELECTION CALLOUT */}
          <div className="absolute bottom-2 left-2 right-2 bg-black/90 border border-slate-800 px-2 py-1 flex items-center justify-between text-[10px]">
            <span className="text-slate-400">ZONE:</span>
            <span className="text-cyan-400 font-bold">{selectedZone.replace("_", " ")}</span>
          </div>
        </div>

        {/* CLICKABLE ZONE QUICK-SELECT BADGES */}
        <div className="grid grid-cols-1 gap-1.5 text-[10px]">
          <button
            onClick={() => onSelectZone("CRANIAL_SANS")}
            className={`p-1.5 border flex items-center justify-between transition ${
              selectedZone === "CRANIAL_SANS"
                ? "bg-cyan-950/60 border-cyan-400 text-cyan-200"
                : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Eye className="w-3 h-3 text-cyan-400" /> Cranial / SANS (Vision & ICP)
            </span>
            <span className={`px-1 py-0.2 border text-[9px] ${getStatusBadge(zoneStatuses.CRANIAL_SANS)}`}>
              {zoneStatuses.CRANIAL_SANS}
            </span>
          </button>

          <button
            onClick={() => onSelectZone("CARDIOVASCULAR")}
            className={`p-1.5 border flex items-center justify-between transition ${
              selectedZone === "CARDIOVASCULAR"
                ? "bg-cyan-950/60 border-cyan-400 text-cyan-200"
                : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Heart className="w-3 h-3 text-rose-400" /> Cardiovascular (BP & Fluids)
            </span>
            <span className={`px-1 py-0.2 border text-[9px] ${getStatusBadge(zoneStatuses.CARDIOVASCULAR)}`}>
              {zoneStatuses.CARDIOVASCULAR}
            </span>
          </button>

          <button
            onClick={() => onSelectZone("NEURO_BEHAVIORAL")}
            className={`p-1.5 border flex items-center justify-between transition ${
              selectedZone === "NEURO_BEHAVIORAL"
                ? "bg-cyan-950/60 border-cyan-400 text-cyan-200"
                : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Brain className="w-3 h-3 text-amber-400" /> Behavioral (Sleep & Mood)
            </span>
            <span className={`px-1 py-0.2 border text-[9px] ${getStatusBadge(zoneStatuses.NEURO_BEHAVIORAL)}`}>
              {zoneStatuses.NEURO_BEHAVIORAL}
            </span>
          </button>

          <button
            onClick={() => onSelectZone("MUSCULOSKELETAL")}
            className={`p-1.5 border flex items-center justify-between transition ${
              selectedZone === "MUSCULOSKELETAL"
                ? "bg-cyan-950/60 border-cyan-400 text-cyan-200"
                : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-emerald-400" /> Musculoskeletal (ARED/Bone)
            </span>
            <span className={`px-1 py-0.2 border text-[9px] ${getStatusBadge(zoneStatuses.MUSCULOSKELETAL)}`}>
              {zoneStatuses.MUSCULOSKELETAL}
            </span>
          </button>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800 text-[9px] text-slate-500 flex justify-between">
        <span>CLICK ORGAN TO INSPECT</span>
        <span className="text-cyan-500">DYNAMIC TELEMETRY</span>
      </div>
    </div>
  );
};

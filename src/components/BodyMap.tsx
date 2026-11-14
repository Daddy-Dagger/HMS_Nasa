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
        return "bg-rose-950/80 text-rose-300 border-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.3)] animate-pulse";
      case "ATTENTION":
        return "bg-amber-950/80 text-amber-300 border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.2)]";
      case "NOMINAL":
      default:
        return "bg-cyan-950/80 text-cyan-300 border-cyan-600";
    }
  };

  return (
    <div className="h-full bg-slate-950/80 backdrop-blur-md border border-cyan-500/20 rounded-xl p-4 font-mono select-none flex flex-col justify-between shadow-[0_0_25px_rgba(6,182,212,0.06)] relative overflow-hidden">
      {/* CORNER ACCENT NOTCHES */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />

      <div>
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#06b6d4]" />
            <span className="text-[11px] font-bold tracking-widest text-white uppercase">
              ANATOMICAL BODY MAP
            </span>
          </div>
          <span className="text-[9px] px-2 py-0.5 bg-black/80 border border-cyan-500/30 text-cyan-300 rounded font-bold">
            5 NASA HAZARD ZONES
          </span>
        </div>

        {/* SVG INTERACTIVE HUMAN VECTOR */}
        <div className="relative aspect-[3/4] bg-black/60 border border-slate-800/80 rounded-xl flex items-center justify-center p-2 mb-3 overflow-hidden shadow-inner">
          {/* Subtle radar grid background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05)_0%,transparent_70%)] pointer-events-none" />

          <svg
            viewBox="0 0 200 320"
            className="w-full h-full max-h-[270px] drop-shadow-[0_0_15px_rgba(6,182,212,0.15)] z-10"
          >
            {/* GRID LINES BACKGROUND */}
            <line x1="100" y1="0" x2="100" y2="320" stroke="#1e293b" strokeDasharray="3 3" opacity="0.6" />
            <line x1="0" y1="160" x2="200" y2="160" stroke="#1e293b" strokeDasharray="3 3" opacity="0.6" />

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
                className={selectedZone === "CRANIAL_SANS" ? "filter drop-shadow-[0_0_10px_#06b6d4]" : ""}
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
                className={selectedZone === "CARDIOVASCULAR" ? "filter drop-shadow-[0_0_10px_#06b6d4]" : ""}
              />
              {/* Heart Symbol */}
              <circle cx="94" cy="90" r="5" fill={getStatusColor(zoneStatuses.CARDIOVASCULAR)} opacity="0.8" />
              <path d="M 88 88 Q 94 80 100 88 T 100 98 L 94 104 L 88 98 Z" fill={getStatusColor(zoneStatuses.CARDIOVASCULAR)} opacity="0.4" />
            </g>

            {/* 3. NEURO-BEHAVIORAL / SLEEP (CENTRAL CORE) */}
            <g
              onClick={() => onSelectZone("NEURO_BEHAVIORAL")}
              className="cursor-pointer transition-transform hover:scale-105"
            >
              <rect
                x="76"
                y="130"
                width="48"
                height="45"
                rx="4"
                fill="#030712"
                stroke={getStatusColor(zoneStatuses.NEURO_BEHAVIORAL)}
                strokeWidth={selectedZone === "NEURO_BEHAVIORAL" ? "3" : "1.5"}
                className={selectedZone === "NEURO_BEHAVIORAL" ? "filter drop-shadow-[0_0_10px_#06b6d4]" : ""}
              />
              <circle cx="100" cy="152" r="8" fill="none" stroke={getStatusColor(zoneStatuses.NEURO_BEHAVIORAL)} strokeWidth="1.5" strokeDasharray="2 2" />
            </g>

            {/* 4. IMMUNE / METABOLIC (UPPER LIMBS & PERIPHERY) */}
            <g
              onClick={() => onSelectZone("IMMUNE_METABOLIC")}
              className="cursor-pointer transition-transform hover:scale-105"
            >
              {/* Left Arm */}
              <line x1="72" y1="70" x2="35" y2="150" stroke={getStatusColor(zoneStatuses.IMMUNE_METABOLIC)} strokeWidth={selectedZone === "IMMUNE_METABOLIC" ? "4" : "2"} />
              {/* Right Arm */}
              <line x1="128" y1="70" x2="165" y2="150" stroke={getStatusColor(zoneStatuses.IMMUNE_METABOLIC)} strokeWidth={selectedZone === "IMMUNE_METABOLIC" ? "4" : "2"} />
            </g>

            {/* 5. MUSCULOSKELETAL / BONE DENSITY (LOWER LIMBS) */}
            <g
              onClick={() => onSelectZone("MUSCULOSKELETAL")}
              className="cursor-pointer transition-transform hover:scale-105"
            >
              {/* Left Leg */}
              <line x1="86" y1="175" x2="70" y2="300" stroke={getStatusColor(zoneStatuses.MUSCULOSKELETAL)} strokeWidth={selectedZone === "MUSCULOSKELETAL" ? "4" : "2.5"} />
              {/* Right Leg */}
              <line x1="114" y1="175" x2="130" y2="300" stroke={getStatusColor(zoneStatuses.MUSCULOSKELETAL)} strokeWidth={selectedZone === "MUSCULOSKELETAL" ? "4" : "2.5"} />
              {/* Joint Nodes */}
              <circle cx="78" cy="235" r="4" fill="#030712" stroke={getStatusColor(zoneStatuses.MUSCULOSKELETAL)} strokeWidth="1.5" />
              <circle cx="122" cy="235" r="4" fill="#030712" stroke={getStatusColor(zoneStatuses.MUSCULOSKELETAL)} strokeWidth="1.5" />
            </g>
          </svg>

          {/* ACTIVE SELECTION TAG */}
          <div className="absolute bottom-2 left-2 right-2 bg-slate-950/90 border border-slate-800 p-1.5 rounded text-[10px] flex items-center justify-between z-20">
            <span className="text-slate-400">ACTIVE:</span>
            <span className="font-bold text-cyan-300 tracking-wider">
              {selectedZone.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* 5-ZONE SELECTOR GRID */}
        <div className="grid grid-cols-1 gap-1.5 text-[10px]">
          <button
            onClick={() => onSelectZone("CARDIOVASCULAR")}
            className={`p-1.5 border rounded flex items-center justify-between transition ${
              selectedZone === "CARDIOVASCULAR"
                ? "bg-cyan-950 border-cyan-400 text-white font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                : "bg-black/60 border-slate-800 text-slate-400 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              <span>CARDIOVASCULAR (BP / IJV)</span>
            </div>
            <span className={`text-[8px] px-1.5 py-0.2 rounded border font-bold ${getStatusBadge(zoneStatuses.CARDIOVASCULAR)}`}>
              {zoneStatuses.CARDIOVASCULAR}
            </span>
          </button>

          <button
            onClick={() => onSelectZone("CRANIAL_SANS")}
            className={`p-1.5 border rounded flex items-center justify-between transition ${
              selectedZone === "CRANIAL_SANS"
                ? "bg-cyan-950 border-cyan-400 text-white font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                : "bg-black/60 border-slate-800 text-slate-400 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>CRANIAL / SANS (RETINA)</span>
            </div>
            <span className={`text-[8px] px-1.5 py-0.2 rounded border font-bold ${getStatusBadge(zoneStatuses.CRANIAL_SANS)}`}>
              {zoneStatuses.CRANIAL_SANS}
            </span>
          </button>

          <button
            onClick={() => onSelectZone("NEURO_BEHAVIORAL")}
            className={`p-1.5 border rounded flex items-center justify-between transition ${
              selectedZone === "NEURO_BEHAVIORAL"
                ? "bg-cyan-950 border-cyan-400 text-white font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                : "bg-black/60 border-slate-800 text-slate-400 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-purple-400" />
              <span>NEURO-BEHAVIORAL (SLEEP)</span>
            </div>
            <span className={`text-[8px] px-1.5 py-0.2 rounded border font-bold ${getStatusBadge(zoneStatuses.NEURO_BEHAVIORAL)}`}>
              {zoneStatuses.NEURO_BEHAVIORAL}
            </span>
          </button>

          <button
            onClick={() => onSelectZone("MUSCULOSKELETAL")}
            className={`p-1.5 border rounded flex items-center justify-between transition ${
              selectedZone === "MUSCULOSKELETAL"
                ? "bg-cyan-950 border-cyan-400 text-white font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                : "bg-black/60 border-slate-800 text-slate-400 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>MUSCULOSKELETAL (BONE)</span>
            </div>
            <span className={`text-[8px] px-1.5 py-0.2 rounded border font-bold ${getStatusBadge(zoneStatuses.MUSCULOSKELETAL)}`}>
              {zoneStatuses.MUSCULOSKELETAL}
            </span>
          </button>

          <button
            onClick={() => onSelectZone("IMMUNE_METABOLIC")}
            className={`p-1.5 border rounded flex items-center justify-between transition ${
              selectedZone === "IMMUNE_METABOLIC"
                ? "bg-cyan-950 border-cyan-400 text-white font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                : "bg-black/60 border-slate-800 text-slate-400 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span>IMMUNE & METABOLIC</span>
            </div>
            <span className={`text-[8px] px-1.5 py-0.2 rounded border font-bold ${getStatusBadge(zoneStatuses.IMMUNE_METABOLIC)}`}>
              {zoneStatuses.IMMUNE_METABOLIC}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

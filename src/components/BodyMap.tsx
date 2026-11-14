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
        return "#6366f1"; // indigo-500
    }
  };

  const getStatusBadge = (status: HealthStatus) => {
    switch (status) {
      case "CRITICAL":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "ATTENTION":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "NOMINAL":
      default:
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
  };

  return (
    <div className="glass-card rounded-3xl p-5 flex flex-col justify-between h-full shadow-[0_10px_35px_rgba(15,23,42,0.04)]">
      <div>
        {/* HEADER */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-semibold text-slate-900 block leading-tight">
                Anatomical Map
              </span>
              <span className="text-[11px] text-slate-400 font-medium">5 Hazard Zones</span>
            </div>
          </div>
          <span className="text-[11px] px-2.5 py-1 bg-slate-50 border border-slate-200/80 text-slate-600 rounded-full font-medium">
            NASA HRP
          </span>
        </div>

        {/* CLEAN SVG HUMAN VECTOR */}
        <div className="relative aspect-[3/4] bg-slate-50/60 border border-slate-100 rounded-2xl flex items-center justify-center p-2 mb-3 overflow-hidden">
          <svg
            viewBox="0 0 200 320"
            className="w-full h-full max-h-[260px] drop-shadow-sm z-10"
          >
            {/* Soft grid lines */}
            <line x1="100" y1="0" x2="100" y2="320" stroke="#e2e8f0" strokeDasharray="3 3" opacity="0.6" />
            <line x1="0" y1="160" x2="200" y2="160" stroke="#e2e8f0" strokeDasharray="3 3" opacity="0.6" />

            {/* 1. CRANIAL / OCULAR / SANS (HEAD) */}
            <g
              onClick={() => onSelectZone("CRANIAL_SANS")}
              className="cursor-pointer transition-transform hover:scale-105"
            >
              <circle
                cx="100"
                cy="38"
                r="22"
                fill="#ffffff"
                stroke={getStatusColor(zoneStatuses.CRANIAL_SANS)}
                strokeWidth={selectedZone === "CRANIAL_SANS" ? "3" : "2"}
                className={selectedZone === "CRANIAL_SANS" ? "filter drop-shadow-[0_0_8px_rgba(99,102,241,0.4)]" : ""}
              />
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
                fill="#ffffff"
                stroke={getStatusColor(zoneStatuses.CARDIOVASCULAR)}
                strokeWidth={selectedZone === "CARDIOVASCULAR" ? "3" : "2"}
                className={selectedZone === "CARDIOVASCULAR" ? "filter drop-shadow-[0_0_8px_rgba(99,102,241,0.4)]" : ""}
              />
              <circle cx="94" cy="90" r="5" fill={getStatusColor(zoneStatuses.CARDIOVASCULAR)} opacity="0.8" />
              <path d="M 88 88 Q 94 80 100 88 T 100 98 L 94 104 L 88 98 Z" fill={getStatusColor(zoneStatuses.CARDIOVASCULAR)} opacity="0.3" />
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
                rx="6"
                fill="#ffffff"
                stroke={getStatusColor(zoneStatuses.NEURO_BEHAVIORAL)}
                strokeWidth={selectedZone === "NEURO_BEHAVIORAL" ? "3" : "2"}
                className={selectedZone === "NEURO_BEHAVIORAL" ? "filter drop-shadow-[0_0_8px_rgba(99,102,241,0.4)]" : ""}
              />
              <circle cx="100" cy="152" r="8" fill="none" stroke={getStatusColor(zoneStatuses.NEURO_BEHAVIORAL)} strokeWidth="1.5" strokeDasharray="3 3" />
            </g>

            {/* 4. IMMUNE / METABOLIC (UPPER LIMBS) */}
            <g
              onClick={() => onSelectZone("IMMUNE_METABOLIC")}
              className="cursor-pointer transition-transform hover:scale-105"
            >
              <line x1="72" y1="70" x2="35" y2="150" stroke={getStatusColor(zoneStatuses.IMMUNE_METABOLIC)} strokeWidth={selectedZone === "IMMUNE_METABOLIC" ? "4" : "2.5"} />
              <line x1="128" y1="70" x2="165" y2="150" stroke={getStatusColor(zoneStatuses.IMMUNE_METABOLIC)} strokeWidth={selectedZone === "IMMUNE_METABOLIC" ? "4" : "2.5"} />
            </g>

            {/* 5. MUSCULOSKELETAL / BONE DENSITY (LOWER LIMBS) */}
            <g
              onClick={() => onSelectZone("MUSCULOSKELETAL")}
              className="cursor-pointer transition-transform hover:scale-105"
            >
              <line x1="86" y1="175" x2="70" y2="300" stroke={getStatusColor(zoneStatuses.MUSCULOSKELETAL)} strokeWidth={selectedZone === "MUSCULOSKELETAL" ? "4" : "2.5"} />
              <line x1="114" y1="175" x2="130" y2="300" stroke={getStatusColor(zoneStatuses.MUSCULOSKELETAL)} strokeWidth={selectedZone === "MUSCULOSKELETAL" ? "4" : "2.5"} />
              <circle cx="78" cy="235" r="4" fill="#ffffff" stroke={getStatusColor(zoneStatuses.MUSCULOSKELETAL)} strokeWidth="2" />
              <circle cx="122" cy="235" r="4" fill="#ffffff" stroke={getStatusColor(zoneStatuses.MUSCULOSKELETAL)} strokeWidth="2" />
            </g>
          </svg>

          {/* ACTIVE PILL */}
          <div className="absolute bottom-2 left-2 right-2 bg-white/95 border border-slate-200/80 p-2 rounded-xl text-xs flex items-center justify-between shadow-sm z-20">
            <span className="text-slate-400 font-medium">Focused:</span>
            <span className="font-bold text-slate-800">
              {selectedZone.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* 5-ZONE SELECTOR */}
        <div className="space-y-1.5 text-xs">
          {[
            { zone: "CARDIOVASCULAR" as AnatomicalZone, label: "Cardiovascular (BP / IJV)", icon: Heart },
            { zone: "CRANIAL_SANS" as AnatomicalZone, label: "Cranial / SANS (Retina)", icon: Eye },
            { zone: "NEURO_BEHAVIORAL" as AnatomicalZone, label: "Neuro-Behavioral (Sleep)", icon: Brain },
            { zone: "MUSCULOSKELETAL" as AnatomicalZone, label: "Musculoskeletal (Bone)", icon: Activity },
            { zone: "IMMUNE_METABOLIC" as AnatomicalZone, label: "Immune & Metabolic", icon: Shield },
          ].map((item) => (
            <button
              key={item.zone}
              onClick={() => onSelectZone(item.zone)}
              className={`w-full p-2 rounded-xl border flex items-center justify-between transition ${
                selectedZone === item.zone
                  ? "bg-indigo-50 border-indigo-200 text-indigo-900 font-semibold shadow-sm"
                  : "bg-white/60 border-slate-100 text-slate-600 hover:bg-white hover:border-slate-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <item.icon className="w-3.5 h-3.5 text-indigo-600" />
                <span>{item.label}</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${getStatusBadge(zoneStatuses[item.zone])}`}>
                {zoneStatuses[item.zone]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

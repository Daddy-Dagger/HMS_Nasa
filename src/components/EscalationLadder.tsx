import React from "react";
import { EscalationAction, EscalationTier } from "../types/mission";
import { ShieldCheck, UserCheck, Radio, ArrowUpRight, ShieldAlert } from "lucide-react";

interface EscalationLadderProps {
  currentTier: EscalationTier;
  delayMode: "LEO_REALTIME" | "MARS_20M_DELAY";
  onTriggerAction: (tier: EscalationTier) => void;
  onOpenGroundPacket: () => void;
}

export const EscalationLadder: React.FC<EscalationLadderProps> = ({
  currentTier,
  delayMode,
  onTriggerAction,
  onOpenGroundPacket,
}) => {
  const ladderActions: EscalationAction[] = [
    {
      tier: 1,
      label: "Tier 1: Autonomous Self-Care",
      targetHazard: "Cephalic Fluid Shift & Circadian Disruption",
      description: "Operator-managed physical & environmental countermeasures per NASA-STD-3001.",
      protocol: "1) Don Lower Body Negative Pressure (LBNP) chaps: -35 mmHg for 30 min. 2) 1.0L fluid loading (or 8x 1g NaCl salt tablets with 1L H2O). 3) SSLA Lighting: Switch to 2100K blue-depleted (<10 lux) 2h pre-sleep.",
      requiresGroundAuth: false,
    },
    {
      tier: 2,
      label: "Tier 2: CMO Clinical Protocol",
      targetHazard: "SANS Optic Edema & Sustained Hypertension / IJV Stasis",
      description: "Peer-assisted clinical diagnostics and pharmacotherapy inside habitat medical workstation.",
      protocol: "1) In-flight ultrasound: Measure Optic Nerve Sheath Diameter (threshold >5.8mm) & IJV flow stasis. 2) Ophthalmoscopy: Frisén Scale ODE check. 3) Administer 5.0mg melatonin (timed 5.75h pre-bedtime).",
      requiresGroundAuth: false,
    },
    {
      tier: 3,
      label: "Tier 3: Flight Surgeon Escalation",
      targetHazard: "Critical Multi-System Drift / Loss of Mission Risk",
      description: "Compilation and asynchronous downlink of compressed telemetry to Houston Flight Surgeon.",
      protocol:
        delayMode === "MARS_20M_DELAY"
          ? "Deep-space 20m round-trip lag active. Onboard autonomous AI executes stabilization protocol. Telemetry compressed and queued for asynchronous downlink."
          : "Direct real-time telemedicine consultation initiated with MCC-Houston Flight Surgeon.",
      requiresGroundAuth: true,
    },
  ];

  return (
    <div className="glass-card rounded-3xl p-5 flex flex-col justify-between h-full shadow-[0_10px_35px_rgba(15,23,42,0.04)]">
      <div>
        {/* HEADER */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900 tracking-tight">
                Escalation Ladder
              </h2>
              <p className="text-xs text-slate-400 font-medium">NASA 3-Tier Clinical Protocol</p>
            </div>
          </div>

          <span
            className={`text-xs px-3 py-1 rounded-full font-semibold border ${
              currentTier === 1
                ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                : currentTier === 2
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-rose-50 text-rose-700 border-rose-200 animate-pulse"
            }`}
          >
            Active: Tier {currentTier}
          </span>
        </div>

        {/* 3 TIER CARDS */}
        <div className="space-y-3">
          {ladderActions.map((action) => {
            const isActive = currentTier === action.tier;

            return (
              <div
                key={action.tier}
                className={`p-4 rounded-2xl border transition-all ${
                  isActive
                    ? action.tier === 3
                      ? "bg-rose-50/60 border-rose-200 shadow-sm"
                      : action.tier === 2
                      ? "bg-amber-50/60 border-amber-200 shadow-sm"
                      : "bg-indigo-50/60 border-indigo-200 shadow-sm"
                    : "bg-slate-50/50 border-slate-100 opacity-60 hover:opacity-100"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    {action.tier === 1 && <ShieldCheck className="w-4 h-4 text-indigo-600" />}
                    {action.tier === 2 && <UserCheck className="w-4 h-4 text-amber-600" />}
                    {action.tier === 3 && <Radio className="w-4 h-4 text-rose-600 animate-pulse" />}
                    <span className="text-sm font-semibold text-slate-900">
                      {action.label}
                    </span>
                  </div>

                  {isActive && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-white font-semibold">
                      Triggered
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 mb-2 leading-relaxed">
                  {action.description}
                </p>

                {/* PROTOCOL BOX */}
                <div className="bg-white/80 border border-slate-200/80 rounded-xl p-2.5 text-xs text-slate-600 mb-2.5">
                  <span className="font-semibold text-slate-800 block mb-0.5 text-[11px]">Exact Protocol:</span>
                  <p className="leading-relaxed text-[11px] text-slate-500">{action.protocol}</p>
                </div>

                {/* ACTION TRIGGER BUTTON */}
                <div className="flex justify-end">
                  {action.tier === 3 ? (
                    <button
                      onClick={onOpenGroundPacket}
                      className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs rounded-full font-medium flex items-center gap-1.5 transition shadow-sm active:scale-95"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>Dispatch Ground Dossier</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onTriggerAction(action.tier)}
                      className={`px-3.5 py-1.5 text-xs rounded-full font-medium flex items-center gap-1.5 transition ${
                        isActive
                          ? "bg-slate-900 hover:bg-slate-800 text-white shadow-sm active:scale-95"
                          : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span>Initiate Tier {action.tier} Countermeasure</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 text-indigo-500" />
          <span className="font-medium">Comms Latency:</span>
        </span>
        <span className="font-semibold text-slate-700">
          {delayMode === "MARS_20M_DELAY"
            ? "Asynchronous Downlink (20m Lag)"
            : "Synchronous Telemedicine (Real-time)"}
        </span>
      </div>
    </div>
  );
};

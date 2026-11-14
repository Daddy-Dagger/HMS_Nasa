import React from "react";
import { EscalationAction, EscalationTier } from "../types/mission";
import { ShieldCheck, UserCheck, Radio, AlertOctagon, ArrowUpRight } from "lucide-react";

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
      label: "TIER 1: AUTONOMOUS INDIVIDUAL ACTION",
      targetHazard: "Cephalic Fluid Shift & Circadian Disruption",
      description: "Non-pharmacological physical & environmental countermeasures managed directly by the operator (NASA-STD-3001).",
      protocol: "1) Don Lower Body Negative Pressure (LBNP) chaps: -35 mmHg for 30m. 2) Ingest 1.0L fluid loading (or 8x 1g NaCl salt tablets with 1L H2O). 3) SSLA Lighting: Switch to 2100K blue-minimized (<10 lux blue) 2h prior to sleep.",
      requiresGroundAuth: false,
    },
    {
      tier: 2,
      label: "TIER 2: CREW MEDICAL OFFICER (CMO) PROTOCOL",
      targetHazard: "SANS Optic Edema & Sustained Hypertension / IJV Stasis",
      description: "Peer-assisted clinical diagnostics and targeted pharmacotherapy inside the habitat medical workstation.",
      protocol: "1) CMO in-flight ultrasound: Assess Optic Nerve Sheath Diameter (ONSD threshold >5.8mm) & IJV flow stasis. 2) Ophthalmoscopy: Frisén Scale ODE check. 3) Administer 5.0mg melatonin (timed 5.75h pre-bedtime) or 5mg zolpidem.",
      requiresGroundAuth: false,
    },
    {
      tier: 3,
      label: "TIER 3: ASYNCHRONOUS FLIGHT-SURGEON ESCALATION",
      targetHazard: "Critical Multi-System Drift / Loss of Mission Risk",
      description: "Compilation and transmission of the condensed Ground Dossier.",
      protocol:
        delayMode === "MARS_20M_DELAY"
          ? "Deep-space 20m round-trip lag active (6-44m range). Onboard AI executes autonomous stabilization protocol. Diagnostic telemetry compressed and queued for asynchronous downlink to Houston Flight Surgeon."
          : "Direct real-time telemedicine session initiated with MCC-Houston Flight Surgeon.",
      requiresGroundAuth: true,
    },
  ];

  return (
    <div className="h-full bg-slate-950/80 backdrop-blur-md border border-cyan-500/20 rounded-xl p-4 font-mono select-none flex flex-col justify-between shadow-[0_0_25px_rgba(6,182,212,0.06)] relative overflow-hidden">
      {/* CORNER ACCENTS */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />

      <div>
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-3">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-bold tracking-widest text-white uppercase">
              THE ESCALATION LADDER
            </span>
          </div>
          <span
            className={`text-[9px] px-2 py-0.5 rounded border font-bold ${
              currentTier === 1
                ? "bg-cyan-950/80 text-cyan-300 border-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.2)]"
                : currentTier === 2
                ? "bg-amber-950/80 text-amber-300 border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.2)]"
                : "bg-rose-950/80 text-rose-300 border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)] animate-pulse"
            }`}
          >
            ACTIVE LEVEL: TIER {currentTier}
          </span>
        </div>

        {/* 3-TIER CLINICAL CARDS */}
        <div className="space-y-2.5">
          {ladderActions.map((action) => {
            const isActive = currentTier === action.tier;
            return (
              <div
                key={action.tier}
                className={`p-3 rounded-xl border transition-all ${
                  isActive
                    ? action.tier === 3
                      ? "bg-rose-950/40 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.15)]"
                      : action.tier === 2
                      ? "bg-amber-950/40 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                      : "bg-cyan-950/40 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                    : "bg-black/60 border-slate-800/80 opacity-60 hover:opacity-90"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    {action.tier === 1 && <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />}
                    {action.tier === 2 && <UserCheck className="w-3.5 h-3.5 text-amber-400" />}
                    {action.tier === 3 && <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />}
                    <span className="text-[11px] font-bold text-white tracking-wider">
                      {action.label}
                    </span>
                  </div>

                  {isActive && (
                    <span className="text-[8px] px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-400 text-cyan-200 font-bold">
                      ACTIVE TRIGGER
                    </span>
                  )}
                </div>

                <div className="text-[10px] text-slate-400 mb-2 leading-relaxed">
                  {action.description}
                </div>

                {/* PROTOCOL STEP-BY-STEP BOX */}
                <div className="bg-black/70 border border-slate-800/80 rounded-lg p-2 text-[9px] text-slate-300 font-mono">
                  <span className="text-cyan-400 font-bold block mb-0.5">EXACT PROTOCOL:</span>
                  {action.protocol}
                </div>

                {/* ACTION TRIGGER BUTTON */}
                <div className="mt-2 flex justify-end">
                  {action.tier === 3 ? (
                    <button
                      onClick={onOpenGroundPacket}
                      className="px-2.5 py-1 bg-rose-950/80 hover:bg-rose-900 border border-rose-500 text-rose-200 text-[9px] rounded font-bold flex items-center gap-1 transition shadow-[0_0_10px_rgba(244,63,94,0.3)]"
                    >
                      <ArrowUpRight className="w-3 h-3 text-rose-400" />
                      <span>COMPILE & DISPATCH GROUND DOSSIER</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onTriggerAction(action.tier)}
                      className={`px-2.5 py-1 text-[9px] rounded font-bold flex items-center gap-1 transition ${
                        isActive
                          ? "bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-400 text-cyan-200 shadow-[0_0_8px_rgba(6,182,212,0.2)]"
                          : "bg-slate-900 border border-slate-700 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span>INITIATE TIER {action.tier} COUNTERMEASURE</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DELAY MODE PROTOCOL FOOTER */}
      <div className="mt-3 pt-2 border-t border-slate-900 text-[9px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Radio className="w-3 h-3 text-amber-400" />
          <span>COMMS ARCHITECTURE:</span>
        </span>
        <span className="text-cyan-400 font-bold">
          {delayMode === "MARS_20M_DELAY"
            ? "ASYNCHRONOUS DOWNLINK // ONBOARD AUTONOMOUS DECISION TREE"
            : "SYNCHRONOUS REAL-TIME TELEMEDICINE (LEO)"}
        </span>
      </div>
    </div>
  );
};

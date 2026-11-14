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
    <div className="h-full bg-black border border-slate-800 p-4 font-mono select-none flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-bold tracking-widest text-white uppercase">
              THE ESCALATION LADDER
            </span>
          </div>
          <span
            className={`text-[9px] px-1.5 py-0.5 border font-bold ${
              currentTier === 1
                ? "bg-emerald-950 text-emerald-300 border-emerald-600"
                : currentTier === 2
                ? "bg-amber-950 text-amber-300 border-amber-600 animate-pulse"
                : "bg-rose-950 text-rose-300 border-rose-600 animate-pulse"
            }`}
          >
            ACTIVE TIER {currentTier}
          </span>
        </div>

        {/* 3-TIER ESCALATION CARDS */}
        <div className="space-y-2.5">
          {ladderActions.map((action) => {
            const isCurrent = currentTier === action.tier;
            return (
              <div
                key={action.tier}
                className={`p-2.5 border transition-all ${
                  isCurrent
                    ? action.tier === 1
                      ? "bg-emerald-950/40 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                      : action.tier === 2
                      ? "bg-amber-950/50 border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                      : "bg-rose-950/50 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                    : "bg-slate-950 border-slate-800/80 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold tracking-wider flex items-center gap-1.5 text-white">
                    {action.tier === 1 && <ShieldCheck className="w-3 h-3 text-emerald-400" />}
                    {action.tier === 2 && <UserCheck className="w-3 h-3 text-amber-400" />}
                    {action.tier === 3 && <Radio className="w-3 h-3 text-rose-400" />}
                    {action.label}
                  </span>
                  {isCurrent && (
                    <span className="text-[9px] px-1 bg-white text-black font-bold uppercase">
                      ACTIVE
                    </span>
                  )}
                </div>

                <p className="text-[10px] text-slate-400 mb-1.5 leading-tight">
                  {action.description}
                </p>

                <div className="bg-black/80 border border-slate-800 p-1.5 text-[9px] text-cyan-200 mb-2 font-mono leading-relaxed">
                  <span className="text-slate-500 block mb-0.5 font-bold uppercase">CLINICAL ACTION PROTOCOL:</span>
                  {action.protocol}
                </div>

                <div className="flex justify-between items-center pt-1 border-t border-slate-800/80">
                  <span className="text-[9px] text-slate-500">
                    {action.requiresGroundAuth
                      ? delayMode === "MARS_20M_DELAY"
                        ? "DELAY-CONTAINED (NO WAIT)"
                        : "MCC AUTH REQUIRED"
                      : "ZERO GROUND DEPENDENCY"}
                  </span>
                  <button
                    onClick={() => onTriggerAction(action.tier)}
                    className="text-[9px] px-2 py-0.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 flex items-center gap-1"
                  >
                    <span>ENGAGE PROTOCOL</span>
                    <ArrowUpRight className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* TIER 3 FLIGHT SURGEON PACKET CTA */}
        <div className="mt-3">
          <button
            onClick={onOpenGroundPacket}
            className="w-full py-2 px-3 bg-cyan-950 border border-cyan-500 hover:bg-cyan-900 text-cyan-200 text-[10px] font-bold flex items-center justify-center gap-2 transition"
          >
            <Radio className="w-3 h-3 text-cyan-400" />
            <span>EXPORT FLIGHT-SURGEON SUMMARY PACKET</span>
          </button>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800 text-[9px] text-slate-500 flex justify-between">
        <span>PREVENTATIVE ESCALATION</span>
        <span className="text-cyan-400">NASA STANDARD MEASURES COMPLIANT</span>
      </div>
    </div>
  );
};

import React from "react";
import { EscalationAction, EscalationTier, CommsMode } from "../types/mission";
import { ShieldCheck, UserCheck, Radio, ArrowUpRight, ShieldAlert, AlertTriangle, RefreshCw } from "lucide-react";

interface EscalationLadderProps {
  currentTier: EscalationTier;
  delayMode: CommsMode;
  onTriggerAction: (tier: EscalationTier) => void;
  onOpenGroundPacket: () => void;
  conservativeEscalationActive?: boolean;
  onExecuteRemeasure?: () => void;
  queuedPacketsCount?: number;
}

export const EscalationLadder: React.FC<EscalationLadderProps> = ({
  currentTier,
  delayMode,
  onTriggerAction,
  onOpenGroundPacket,
  conservativeEscalationActive = false,
  onExecuteRemeasure,
  queuedPacketsCount = 0,
}) => {
  const ladderActions: EscalationAction[] = [
    {
      tier: 1,
      label: "Tier 1: Autonomous Self-Care & Decompression",
      targetHazard: "Autonomic Dysregulation & Circadian Sleep Debt (Contributing factors under review)",
      guideline: "NASA-STD-3001 & AHA/ACC 2017 Guidelines",
      description: "Operator-managed non-pharmacological stabilization and protocol-driven re-measurement.",
      protocol: "1) Protocol Re-measure: Verify cuff placement, repeat reading after 5 min quiet seated rest. 2) Passive Decompression: 30 min rest in quiet crew quarters. 3) Circadian & Hydration Recovery: Shift SSLA lighting to 2100K amber, verify nominal hydration (avoid acute hypertonic loading). 4) Re-evaluate at 60 min. If systolic remains >140 mmHg, escalate to Tier 2 CMO protocol.",
      requiresGroundAuth: false,
    },
    {
      tier: 2,
      label: "Tier 2: CMO Clinical Diagnostic Protocol",
      targetHazard: "Sustained Arterial Elevation (>140 mmHg) & SANS Optic Edema",
      guideline: "Exploration Medical Capability (ExMC) Level IV Care Protocol",
      description: "Peer-assisted clinical diagnostics and non-invasive ultrasound inside habitat workstation.",
      protocol: "1) In-flight ultrasound: Measure Optic Nerve Sheath Diameter (ONSD threshold >5.8 mm) & IJV flow pattern. 2) Ophthalmoscopy: Modified Frisén Scale check for optic disc edema. 3) Circadian restoration: 0.5 mg micro-dose oral melatonin timed 120 min pre-bedtime; review crew workload.",
      requiresGroundAuth: false,
    },
    {
      tier: 3,
      label: "Tier 3: Flight Surgeon Asynchronous Escalation",
      targetHazard: "Multi-System Clinical Drift & Deep-Space Blackout Contingency",
      guideline: "NASA Deep-Space Operations Protocol (Gore, Vera, Marquez 2023)",
      description: "Compilation and asynchronous downlink of compressed telemetry dossier to MCC-Houston Flight Surgeon.",
      protocol:
        delayMode === "BLACKOUT"
          ? "Communications blackout active (0 kbps). Real-time ground consultation impossible. Autonomous decision-support executes onboard countermeasure. Telemetry dossier queued in onboard flash buffer; will auto-sync upon link restoration."
          : delayMode === "MARS_20M_DELAY"
          ? "Deep-space 20-minute signal delay active. Onboard autonomous decision-support executes stabilization. Telemetry dossier compressed and queued for asynchronous downlink."
          : "Direct real-time telemedicine consultation initiated with MCC-Houston Flight Surgeon.",
      requiresGroundAuth: true,
    },
  ];

  return (
    <div className="glass-card rounded-3xl p-5 flex flex-col justify-between h-full shadow-[0_10px_35px_rgba(15,23,42,0.04)] space-y-4">
      <div>
        {/* HEADER */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-slate-900 tracking-tight">
                  Escalation Ladder
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  Decision-Support
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">NASA 3-Tier Clinical Architecture</p>
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

        {/* CONSERVATIVE ESCALATION ALERT BANNER */}
        {conservativeEscalationActive && (
          <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs space-y-2">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-xs">Conservative Escalation: Sensor Unverified</span>
                <span className="text-[11px] text-amber-800 leading-relaxed block">
                  Sensor noise or lead artifact detected. To prevent false security or misdiagnosis, system mandates confirmed re-measurement.
                </span>
              </div>
            </div>
            {onExecuteRemeasure && (
              <button
                onClick={onExecuteRemeasure}
                className="w-full py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Execute 5-Minute Seated Re-Measure</span>
              </button>
            )}
          </div>
        )}

        {/* COMMS BLACKOUT BUFFER NOTICE */}
        {delayMode === "BLACKOUT" && (
          <div className="mb-3 p-2.5 bg-rose-50/90 border border-rose-200 rounded-2xl text-rose-900 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
              <span className="font-semibold text-[11px]">Comms Blackout: Downlink Paused</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">
              {queuedPacketsCount} Packets Buffered
            </span>
          </div>
        )}

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

                <div className="text-[10px] text-slate-400 font-medium mb-1">
                  Guideline: {action.guideline}
                </div>

                <p className="text-xs text-slate-500 mb-2 leading-relaxed">
                  {action.description}
                </p>

                {/* PROTOCOL BOX */}
                <div className="bg-white/80 border border-slate-200/80 rounded-xl p-2.5 text-xs text-slate-600 mb-2.5">
                  <span className="font-semibold text-slate-800 block mb-0.5 text-[11px]">Verified Protocol:</span>
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
                      <span>{delayMode === "BLACKOUT" ? "Queue Ground Dossier" : "Dispatch Ground Dossier"}</span>
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
                      <span>Initiate Tier {action.tier} Protocol</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-2 text-[10px] text-slate-400 text-center font-medium">
        NASA-STD-3001 Vol 1 Compliant • Clinical Decision-Support Only
      </div>
    </div>
  );
};

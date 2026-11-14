import React, { useState } from "react";
import { Radio, Download, Check, Copy, X, ShieldCheck, Database } from "lucide-react";
import { DailyHealthMetric, CrewMemberId, CommsMode, QueuedDossier } from "../types/mission";
import { CREW_BASELINES } from "../utils/driftEngine";

interface FlightSurgeonPacketModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSol: number;
  missionData: DailyHealthMetric[];
  activeCrewId?: CrewMemberId;
  delayMode?: CommsMode;
  onQueueDossier?: (dossier: QueuedDossier) => void;
}

export const FlightSurgeonPacketModal: React.FC<FlightSurgeonPacketModalProps> = ({
  isOpen,
  onClose,
  currentSol,
  missionData,
  activeCrewId = "CDR_MILLER",
  delayMode = "MARS_20M_DELAY",
  onQueueDossier,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [queuedSuccess, setQueuedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentMetric = missionData[currentSol - 1] || missionData[0];
  const baseline = CREW_BASELINES[activeCrewId] || CREW_BASELINES.CDR_MILLER;

  const isBlackout = delayMode === "BLACKOUT";

  const packetJson = {
    header: {
      mission: "ARTEMIS-MARS-TRANSIT // EXPEDITION 01",
      subject: activeCrewId,
      timestamp_sol: currentSol,
      data_classification: "SYNTHETIC_TELEMETRY // DECISION_SUPPORT_ONLY",
      comms_status: isBlackout ? "BLACKOUT_SOLAR_CONJUNCTION" : delayMode,
      earth_comms_latency_minutes: isBlackout ? "UNAVAILABLE_BLACKOUT" : delayMode === "MARS_20M_DELAY" ? 20.4 : 0.003,
      packet_id: `FS-DOSSIER-SOL${currentSol}-0x9B42`,
      clinical_disclaimer: "DECISION SUPPORT ONLY. NOT FOR AUTONOMOUS DIAGNOSIS. ALL INTERVENTIONS DEFERRED TO FLIGHT SURGEON.",
    },
    signal_integrity: {
      sqm_confidence_pct: currentMetric.sensorConfidence,
      confidence_reason: currentMetric.confidenceReason || "Photoplethysmography & ECG coherent",
      artifact_filtering_active: true,
      suppressed_events_count: missionData.slice(0, currentSol).filter((d) => d.alertSuppressed).length,
    },
    hemodynamics: {
      blood_pressure_current: `${currentMetric.systolicBP}/${currentMetric.diastolicBP} mmHg`,
      blood_pressure_baseline: `${baseline.systolicBP}/${baseline.diastolicBP} mmHg`,
      systolic_delta_pct: `+${(((currentMetric.systolicBP - baseline.systolicBP) / baseline.systolicBP) * 100).toFixed(1)}%`,
      heart_rate_resting: `${currentMetric.heartRate} bpm`,
      clinical_guideline_applied: "NASA-STD-3001 & AHA/ACC 2017 Guidelines",
      contributing_factors_note: "Contributing factors under review: autonomic cardiovascular dysregulation, cumulative sleep debt, environmental stressors, and microgravity vascular remodeling.",
    },
    neuro_behavioral: {
      daily_sleep_hours: currentMetric.sleepHours,
      sleep_baseline_hours: baseline.sleepHours,
      cumulative_sleep_debt_hours: Number((baseline.sleepHours * currentSol - missionData.slice(0, currentSol).reduce((acc, d) => acc + d.sleepHours, 0)).toFixed(1)),
      mood_score: currentMetric.moodScore,
      sans_optic_edema_risk_grade: currentMetric.systolicBP > 138 ? "GRADE_2" : "GRADE_0",
    },
    onboard_actions_taken: [
      "Tier 1: 5-minute seated rest check executed per protocol",
      "Tier 1: Cabin SSLA lighting shifted to 2100K recovery amber",
      "Tier 1: Nominal hydration balance verified (acute salt/fluid loading contraindicated for BP elevation)",
      "Tier 2: CMO In-Flight Ocular Ultrasound queued if elevation persists",
    ],
  };

  const jsonString = JSON.stringify(packetJson, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQueueOrTransmit = () => {
    if (onQueueDossier) {
      const dossier: QueuedDossier = {
        id: `DOSSIER-${currentSol}-${Date.now().toString().slice(-4)}`,
        sol: currentSol,
        crewId: activeCrewId,
        timestamp: new Date().toISOString(),
        status: isBlackout ? "QUEUED_LOCAL" : "TRANSMITTING",
        sizeKb: +(jsonString.length / 1024).toFixed(1),
        summary: `Sol ${currentSol} ${activeCrewId}: BP ${currentMetric.systolicBP}/${currentMetric.diastolicBP}, Sleep ${currentMetric.sleepHours}h`,
      };
      onQueueDossier(dossier);
      setQueuedSuccess(true);
      setTimeout(() => setQueuedSuccess(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 font-sans select-none animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 text-sm space-y-4 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900 text-sm">
                  Flight Surgeon Summary Dossier
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  Synthetic Telemetry
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Asynchronous Ground Downlink Packet</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* COMMS BLACKOUT WARNING IF ACTIVE */}
        {isBlackout ? (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-950">
            <Radio className="w-4 h-4 text-rose-600 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <span className="font-bold block">Solar Conjunction Blackout Active (Downlink Paused)</span>
              <p className="text-[11px] text-rose-800 leading-relaxed">
                Earth-Mars communications link is occluded. Real-time transmission is impossible. Dossier will be buffered in local NVRAM and auto-downlinked once DSN carrier lock is re-acquired.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex items-start gap-2.5 text-xs text-indigo-950">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">DSN Uplink Status: {delayMode === "MARS_20M_DELAY" ? "Deep-Space Asynchronous (20.4 min delay)" : "LEO Real-Time (0.2s delay)"}</span>
              <p className="text-[11px] text-indigo-800 leading-relaxed">
                NASA HRP Protocol: Diagnostic telemetry packet compiled for MCC-Houston Flight Surgeon. Ground consultation operates asynchronously under deep-space speed-of-light delay.
              </p>
            </div>
          </div>
        )}

        {/* PERSISTENT DISCLAIMER BANNER */}
        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600">
          <strong className="text-slate-800">Operational Disclaimer:</strong> Decision-support system only. Not for autonomous clinical diagnosis. Defer all final clinical interventions and pharmacotherapy to designated Flight Surgeon / CMO.
        </div>

        {/* CODE BLOCK PREVIEW */}
        <div className="bg-slate-900 rounded-2xl p-4 text-xs text-indigo-300 overflow-x-auto max-h-56 font-mono leading-relaxed border border-slate-800 shadow-inner">
          <pre>{jsonString}</pre>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-wrap gap-2.5 pt-1">
          <button
            onClick={handleCopy}
            className="flex-1 min-w-[140px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 text-xs rounded-full flex items-center justify-center gap-2 transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "Copied to clipboard" : "Copy Payload"}</span>
          </button>

          <button
            onClick={handleQueueOrTransmit}
            className={`flex-1 min-w-[180px] font-semibold py-2.5 text-xs rounded-full flex items-center justify-center gap-2 transition shadow-md active:scale-95 ${
              isBlackout
                ? "bg-amber-600 hover:bg-amber-700 text-white"
                : "bg-slate-900 hover:bg-slate-800 text-white"
            }`}
          >
            {queuedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{isBlackout ? "Buffered in Flash Memory!" : "Dispatched to DSN Queue!"}</span>
              </>
            ) : isBlackout ? (
              <>
                <Database className="w-4 h-4 text-amber-300" />
                <span>Buffer in Onboard NVRAM</span>
              </>
            ) : (
              <>
                <Radio className="w-4 h-4 text-indigo-400" />
                <span>Dispatch Asynchronous Downlink</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              const blob = new Blob([jsonString], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `FLIGHT_SURGEON_DOSSIER_SOL_${currentSol}_${activeCrewId}.json`;
              a.click();
            }}
            className="flex-1 min-w-[140px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 text-xs rounded-full flex items-center justify-center gap-2 transition"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Save .json</span>
          </button>
        </div>
      </div>
    </div>
  );
};

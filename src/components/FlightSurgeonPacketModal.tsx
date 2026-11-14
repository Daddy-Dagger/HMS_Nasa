import React, { useState } from "react";
import { Radio, Download, Check, Copy, X } from "lucide-react";
import { DailyHealthMetric } from "../types/mission";

interface FlightSurgeonPacketModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSol: number;
  missionData: DailyHealthMetric[];
}

export const FlightSurgeonPacketModal: React.FC<FlightSurgeonPacketModalProps> = ({
  isOpen,
  onClose,
  currentSol,
  missionData,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  if (!isOpen) return null;

  const currentMetric = missionData[currentSol - 1] || missionData[0];
  const baselineMetric = missionData[0];

  const packetJson = {
    header: {
      mission: "ARTEMIS-MARS-TRANSIT // VEHICLE 01",
      subject: "CDR_MILLER_A7",
      timestamp_sol: currentSol,
      earth_comms_latency_minutes: 20.4,
      packet_id: `FS-DOSSIER-SOL${currentSol}-0x9B42`,
    },
    signal_integrity: {
      sqm_confidence_pct: currentMetric.sensorConfidence,
      artifact_filtering_active: true,
      suppressed_events_count: missionData.slice(0, currentSol).filter((d) => d.alertSuppressed).length,
    },
    hemodynamics: {
      blood_pressure_current: `${currentMetric.systolicBP}/${currentMetric.diastolicBP} mmHg`,
      blood_pressure_baseline: `${baselineMetric.systolicBP}/${baselineMetric.diastolicBP} mmHg`,
      systolic_delta_pct: `+${(((currentMetric.systolicBP - baselineMetric.systolicBP) / baselineMetric.systolicBP) * 100).toFixed(1)}%`,
      heart_rate_resting: `${currentMetric.heartRate} bpm`,
      orthostatic_risk_index: currentMetric.systolicBP > 140 ? "HIGH" : "MODERATE",
    },
    neuro_behavioral: {
      daily_sleep_hours: currentMetric.sleepHours,
      cumulative_sleep_debt_hours: Number((7.5 * currentSol - missionData.slice(0, currentSol).reduce((acc, d) => acc + d.sleepHours, 0)).toFixed(1)),
      mood_score: currentMetric.moodScore,
      sans_optic_edema_risk_grade: currentMetric.systolicBP > 138 ? "GRADE_2" : "GRADE_0",
    },
    onboard_actions_taken: [
      "Tier 1: Lower Body Negative Pressure (LBNP) 30 min at -35 mmHg applied",
      "Tier 1: Cabin circadian lighting shifted to 2100K recovery amber",
      "Tier 2: CMO Ocular Ultrasound queued for Sol 26",
    ],
  };

  const jsonString = JSON.stringify(packetJson, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 font-sans select-none animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 text-sm space-y-4 shadow-2xl border border-slate-100">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">
                Flight Surgeon Summary Dossier
              </h3>
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

        <p className="text-slate-500 text-xs leading-relaxed">
          <strong>NASA HRP Protocol:</strong> Compressed diagnostic telemetry packet for MCC-Houston Flight Surgeons. Tracks deviation from individual baseline, sensor motion artifact suppression logs, and autonomous onboard countermeasure history.
        </p>

        {/* CODE BLOCK PREVIEW */}
        <div className="bg-slate-900 rounded-2xl p-4 text-xs text-indigo-300 overflow-x-auto max-h-60 font-mono leading-relaxed border border-slate-800 shadow-inner">
          <pre>{jsonString}</pre>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-2.5 pt-1">
          <button
            onClick={handleCopy}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 text-xs rounded-full flex items-center justify-center gap-2 transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "Copied to clipboard" : "Copy Payload"}</span>
          </button>

          <button
            onClick={() => {
              const blob = new Blob([jsonString], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `FLIGHT_SURGEON_DOSSIER_SOL_${currentSol}.json`;
              a.click();
            }}
            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 text-xs rounded-full flex items-center justify-center gap-2 transition shadow-md active:scale-95"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Download .json Dossier</span>
          </button>
        </div>
      </div>
    </div>
  );
};

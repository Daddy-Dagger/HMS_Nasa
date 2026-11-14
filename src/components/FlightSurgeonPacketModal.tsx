import React, { useState } from "react";
import { Radio, Download, Check, Copy } from "lucide-react";
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
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-mono select-none">
      <div className="bg-black border border-cyan-500/80 max-w-2xl w-full p-5 text-xs space-y-4 shadow-[0_0_35px_rgba(6,182,212,0.2)]">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs tracking-wider">
            <Radio className="w-3.5 h-3.5" />
            <span>FLIGHT-SURGEON SUMMARY DOSSIER // COMPRESSED DOWNLINK PACKET</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white text-xs px-2 py-0.5 border border-slate-800"
          >
            [CLOSE]
          </button>
        </div>

        <p className="text-slate-300 text-[11px] leading-relaxed">
          <strong>NASA HRP Downlink Protocol:</strong> Compressed diagnostic telemetry packet for MCC-Houston Flight Surgeons. Contains delta-from-baseline tracking, artifact filtering records, and onboard countermeasure logs.
        </p>

        {/* CODE BLOCK PREVIEW */}
        <div className="bg-slate-950 p-3 border border-slate-800 text-[10px] text-cyan-300 overflow-x-auto max-h-64 font-mono leading-relaxed">
          <pre>{jsonString}</pre>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold py-2 text-xs flex items-center justify-center gap-1.5 transition uppercase"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "COPIED TO CLIPBOARD" : "COPY PACKET PAYLOAD"}</span>
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
            className="flex-1 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500 text-cyan-200 font-bold py-2 text-xs flex items-center justify-center gap-1.5 transition uppercase"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>EXPORT .JSON DOSSIER</span>
          </button>
        </div>
      </div>
    </div>
  );
};

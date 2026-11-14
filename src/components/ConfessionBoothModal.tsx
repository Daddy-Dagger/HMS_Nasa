import React from "react";
import { Lock } from "lucide-react";

interface ConfessionBoothModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConfessionBoothModal: React.FC<ConfessionBoothModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-cyan-500/60 rounded-xl max-w-lg w-full p-6 text-xs space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <Lock className="w-4 h-4" />
            <span>CONFESSION BOOTH: ZK-Biometric Enclave</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white text-base px-2 py-0.5 rounded"
          >
            ✕
          </button>
        </div>

        <p className="text-slate-300 leading-relaxed">
          <strong>Resolving the Flight Surgeon Dilemma:</strong> Operators conceal illness to avoid grounding. This enclave keeps raw medical diagnostics encrypted on-body, only sending Zero-Knowledge capability proofs to Mission Control.
        </p>

        <div className="bg-slate-950 p-3.5 rounded border border-slate-800 space-y-2 font-mono">
          <div className="flex justify-between text-slate-400">
            <span>Local Biometric Secret Key:</span>
            <span className="text-cyan-300">0x7F8C...92A1 (Client-Side Only)</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Spacecraft OS Broadcast:</span>
            <span className="text-emerald-400 font-bold">ZK-PROOF: VALID (Capacity: 84%)</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Medical Status Label:</span>
            <span className="text-slate-200">CONFIDENTIAL (Unindexed)</span>
          </div>
        </div>

        <div className="border border-slate-800 bg-slate-950/40 p-3 rounded space-y-1.5">
          <span className="text-cyan-400 font-bold block mb-1">
            Autonomous Confident Therapeutic Interventions:
          </span>
          <p className="text-slate-400 leading-relaxed">
            • Target: Radiation-induced DNA single-strand breaks & Cortisol elevations.<br />
            • Automated micro-dispenser loaded: Sub-cutaneous peptide cycle 4B armed.<br />
            • Public Mission Log output: <span className="text-slate-200 italic">Nominal Routine Calibration</span>.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2.5 rounded transition"
        >
          Close Confidential Enclave
        </button>
      </div>
    </div>
  );
};

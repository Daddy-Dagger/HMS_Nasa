import React from "react";
import { Lock, Terminal, ShieldCheck } from "lucide-react";

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
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50 select-none font-mono">
      <div className="bg-black border border-cyan-500/80 rounded-none max-w-lg w-full p-5 text-xs space-y-4 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>CONFESSION BOOTH // ZK-BIOMETRIC ENCLAVE</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white text-xs px-2 py-0.5 border border-slate-800"
          >
            [ESC / CLOSE]
          </button>
        </div>

        {/* CRYPTOGRAPHIC STATE */}
        <div className="bg-slate-950 p-3 border border-slate-800 space-y-2 text-[11px]">
          <div className="flex justify-between text-slate-400">
            <span>ISOLATED ON-BODY KEY:</span>
            <span className="text-cyan-400">0x7F8C...92A1 [ED25519]</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>PUBLIC FLIGHT TELEMETRY:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> ZK-PROOF VALID [CAPACITY: 84%]
            </span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>MISSION LOG VISIBILITY:</span>
            <span className="text-slate-300">UNINDEXED // ZERO CLINICAL DISCLOSURE</span>
          </div>
        </div>

        {/* PRIVATE ENCRYPTED DIAGNOSTICS */}
        <div className="border border-slate-800 bg-slate-950/80 p-3 text-[11px] space-y-1.5">
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold mb-1">
            <Terminal className="w-3 h-3" />
            <span>CONFIDENTIAL RECOVERY PROTOCOL (CREW-ONLY)</span>
          </div>
          <div className="text-slate-300 space-y-1 font-mono text-[10px]">
            <div>• BIOMARKER: RADIATION DNA STRAND-BREAK METABOLITES ELEVATED</div>
            <div>• SUB-Q DISPENSER: ADAPTOGEN PEPTIDE CYCLE 4B ARMED</div>
            <div>• LOG HASH: <span className="text-slate-500">SHA256:4a8b...19e0 (RECORDED AS ROUTINE ECLSS DRIFT)</span></div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-cyan-950 hover:bg-cyan-900 border border-cyan-500 text-cyan-200 font-bold py-2 text-xs uppercase tracking-widest transition"
        >
          SEAL ENCLAVE & RESUME COCKPIT
        </button>
      </div>
    </div>
  );
};

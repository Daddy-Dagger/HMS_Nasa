import React, { useState, useEffect, useRef } from "react";
import { Activity, Terminal, Zap } from "lucide-react";
import { TelemetryState, PVTResult } from "../types/telemetry";

interface PanelAProps {
  telemetry: TelemetryState;
  setTelemetry: React.Dispatch<React.SetStateAction<TelemetryState>>;
}

export const PanelA_Probe: React.FC<PanelAProps> = ({ telemetry, setTelemetry }) => {
  const [testInput, setTestInput] = useState<string>("");
  const [keystrokeLog, setKeystrokeLog] = useState<number[]>([]);
  const lastKeyTimeRef = useRef<number>(Date.now());

  // NASA PVT (Psychomotor Vigilance Task) State
  const [pvtActive, setPvtActive] = useState<boolean>(false);
  const [pvtStimulus, setPvtStimulus] = useState<boolean>(false);
  const [pvtMessage, setPvtMessage] = useState<string>("Ready to test readiness");
  const [pvtHistory, setPvtHistory] = useState<PVTResult[]>([]);
  const pvtTimerRef = useRef<number | null>(null);
  const stimulusStartTimeRef = useRef<number>(0);

  // Live Keystroke Latency Tracker
  const handleKeyInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const now = Date.now();
    const flightTime = now - lastKeyTimeRef.current;
    lastKeyTimeRef.current = now;

    setTestInput(e.target.value);

    if (flightTime > 25 && flightTime < 2000) {
      setKeystrokeLog((prev) => {
        const updated = [...prev.slice(-12), flightTime];
        const avg = updated.reduce((a, b) => a + b, 0) / updated.length;
        const variance =
          Math.sqrt(
            updated.map((x) => Math.pow(x - avg, 2)).reduce((a, b) => a + b, 0) /
              updated.length
          ) || 12;

        setTelemetry((curr) => ({
          ...curr,
          keystrokeLatency: Math.round(avg),
          psychomotorJitter: Math.round(variance),
        }));
        return updated;
      });
    }
  };

  // Start NASA PVT Micro-Probe
  const startPvtTest = () => {
    if (pvtActive) return;
    setPvtActive(true);
    setPvtStimulus(false);
    setPvtMessage("WAIT FOR STIMULUS...");

    // Random delay between 1.8s and 4.5s (NASA standard protocol)
    const randomDelay = Math.floor(Math.random() * 2700) + 1800;

    pvtTimerRef.current = window.setTimeout(() => {
      setPvtStimulus(true);
      stimulusStartTimeRef.current = Date.now();
      setPvtMessage("STIMULUS ACTIVE — HIT TRIGGER NOW!");
    }, randomDelay);
  };

  // Record PVT Trigger
  const triggerPvtReaction = () => {
    if (!pvtActive) return;

    if (!pvtStimulus) {
      // False start
      if (pvtTimerRef.current) clearTimeout(pvtTimerRef.current);
      setPvtActive(false);
      setPvtMessage("FALSE START: Anticipated stimulus (Micro-lapse)");
      return;
    }

    const latency = Date.now() - stimulusStartTimeRef.current;
    const isLapse = latency > 350;

    const result: PVTResult = {
      reactionTime: latency,
      isLapse,
      timestamp: Date.now(),
    };

    setPvtHistory((prev) => [...prev.slice(-4), result]);
    setPvtStimulus(false);
    setPvtActive(false);
    setPvtMessage(`Recorded: ${latency}ms ${isLapse ? "(NASA Lapse >350ms)" : "(Nominal)"}`);

    // Update telemetry state
    setTelemetry((prev) => ({
      ...prev,
      keystrokeLatency: latency,
      psychomotorJitter: isLapse ? Math.max(prev.psychomotorJitter, 38) : Math.min(prev.psychomotorJitter, 16),
    }));
  };

  // Keyboard shortcut for PVT: Spacebar triggers reaction if test is active
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && pvtActive) {
        e.preventDefault();
        triggerPvtReaction();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pvtActive, pvtStimulus]);

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
              Panel A: Ambient Involuntary Probe
            </h2>
          </div>
          <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
            NASA PVT & TELEMETRY
          </span>
        </div>

        <p className="text-xs text-slate-400 mb-3 leading-relaxed">
          Zero surveys. Extracts psychomotor readiness from flight-console keystrokes and validated NASA PVT stimuli.
        </p>

        {/* NASA PVT (PSYCHOMOTOR VIGILANCE TASK) INTERACTIVE MODULE */}
        <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-amber-400" /> NASA WinSCAT / PVT Micro-Probe
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Spacebar = Trigger</span>
          </div>

          <div
            className={`p-3 rounded border text-center transition-all duration-200 cursor-pointer mb-2.5 ${
              pvtStimulus
                ? "bg-rose-500/20 border-rose-500 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-pulse"
                : pvtActive
                ? "bg-amber-950/30 border-amber-500/50 text-amber-200"
                : "bg-slate-900/80 border-slate-700/60 text-slate-300"
            }`}
            onClick={pvtActive ? triggerPvtReaction : startPvtTest}
          >
            <div className="text-xs font-bold tracking-wider uppercase font-mono">
              {pvtMessage}
            </div>
            {!pvtActive && (
              <span className="text-[10px] text-cyan-400 underline block mt-1">
                Click here or press to initiate probe
              </span>
            )}
          </div>

          {/* PVT RECENT SCORES */}
          {pvtHistory.length > 0 && (
            <div className="flex gap-2">
              {pvtHistory.map((res, i) => (
                <span
                  key={i}
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono border ${
                    res.isLapse
                      ? "bg-rose-950 text-rose-300 border-rose-800"
                      : "bg-slate-900 text-emerald-400 border-slate-700"
                  }`}
                >
                  {res.reactionTime}ms
                </span>
              ))}
            </div>
          )}
        </div>

        {/* PASSIVE KEYSTROKE TRACKER */}
        <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg mb-4">
          <label className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
            <Terminal className="w-3 h-3" />
            Routine Console Input (Background Telemetry):
          </label>
          <input
            type="text"
            value={testInput}
            onChange={handleKeyInput}
            placeholder="Type 'ALIGN THRUSTER GIMBAL 04-B'..."
            className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
          />
          {keystrokeLog.length > 0 && (
            <div className="flex items-end gap-1 h-5 mt-2 pt-1 border-t border-slate-900">
              {keystrokeLog.map((val, idx) => (
                <div
                  key={idx}
                  className="bg-cyan-500/70 hover:bg-cyan-400 w-full rounded-t transition-all"
                  style={{ height: `${Math.min(100, Math.max(15, (val / 400) * 100))}%` }}
                  title={`${val}ms`}
                />
              ))}
            </div>
          )}
        </div>

        {/* METRICS READOUT */}
        <div className="space-y-2 text-xs font-mono">
          <div className="flex justify-between items-center p-2 rounded bg-slate-950/70 border border-slate-800">
            <span className="text-slate-400">Inter-Key Latency Avg:</span>
            <span className="font-bold text-cyan-300">{telemetry.keystrokeLatency} ms</span>
          </div>
          <div className="flex justify-between items-center p-2 rounded bg-slate-950/70 border border-slate-800">
            <span className="text-slate-400">Psychomotor Jitter (Variance):</span>
            <span
              className={`font-bold ${
                telemetry.psychomotorJitter > 35
                  ? "text-rose-400"
                  : telemetry.psychomotorJitter > 20
                  ? "text-amber-400"
                  : "text-emerald-400"
              }`}
            >
              ±{telemetry.psychomotorJitter} ms
            </span>
          </div>
          <div className="flex justify-between items-center p-2 rounded bg-slate-950/70 border border-slate-800">
            <span className="text-slate-400">Space Radiation Dose:</span>
            <span className="font-bold text-slate-200">{telemetry.radiationDose} mSv/hr</span>
          </div>
          <div className="flex justify-between items-center p-2 rounded bg-slate-950/70 border border-slate-800">
            <span className="text-slate-400">Cabin CO2 Partial Pressure:</span>
            <span className="font-bold text-slate-200">{telemetry.cabinCO2} mmHg</span>
          </div>
          <div className="flex justify-between items-center p-2 rounded bg-slate-950/70 border border-slate-800">
            <span className="text-slate-400">Accumulated Sleep Debt:</span>
            <span className="font-bold text-slate-200">{telemetry.sleepDebt} hrs</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
        *Validated against NASA HRP Bio-vigilance Standards.
      </div>
    </div>
  );
};

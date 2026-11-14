import React, { useState, useEffect, useRef } from "react";
import { Activity, Zap, Terminal } from "lucide-react";
import { TelemetryState, PVTResult } from "../types/telemetry";

interface PanelAProps {
  telemetry: TelemetryState;
  setTelemetry: React.Dispatch<React.SetStateAction<TelemetryState>>;
}

export const PanelA_Probe: React.FC<PanelAProps> = ({ telemetry, setTelemetry }) => {
  const [testInput, setTestInput] = useState<string>("");
  const [keystrokeLog, setKeystrokeLog] = useState<number[]>([]);
  const lastKeyTimeRef = useRef<number>(Date.now());

  // NASA PVT State
  const [pvtActive, setPvtActive] = useState<boolean>(false);
  const [pvtStimulus, setPvtStimulus] = useState<boolean>(false);
  const [pvtStatusText, setPvtStatusText] = useState<string>("READY // STANDBY");
  const [pvtHistory, setPvtHistory] = useState<PVTResult[]>([]);
  const pvtTimerRef = useRef<number | null>(null);
  const stimulusStartTimeRef = useRef<number>(0);

  const handleKeyInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const now = Date.now();
    const flightTime = now - lastKeyTimeRef.current;
    lastKeyTimeRef.current = now;
    setTestInput(e.target.value);

    if (flightTime > 25 && flightTime < 2000) {
      setKeystrokeLog((prev) => {
        const updated = [...prev.slice(-14), flightTime];
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

  const startPvtTest = () => {
    if (pvtActive) return;
    setPvtActive(true);
    setPvtStimulus(false);
    setPvtStatusText("ARMED // SAMPLING...");

    const randomDelay = Math.floor(Math.random() * 2500) + 1500;
    pvtTimerRef.current = window.setTimeout(() => {
      setPvtStimulus(true);
      stimulusStartTimeRef.current = Date.now();
      setPvtStatusText("STIMULUS // HIT TRIGGER");
    }, randomDelay);
  };

  const triggerPvtReaction = () => {
    if (!pvtActive) return;

    if (!pvtStimulus) {
      if (pvtTimerRef.current) clearTimeout(pvtTimerRef.current);
      setPvtActive(false);
      setPvtStatusText("FALSE START // ANTICIPATION");
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
    setPvtStatusText(`${latency}ms ${isLapse ? "[LAPSE >350ms]" : "[NOMINAL]"}`);

    setTelemetry((prev) => ({
      ...prev,
      keystrokeLatency: latency,
      psychomotorJitter: isLapse
        ? Math.max(prev.psychomotorJitter, 38)
        : Math.min(prev.psychomotorJitter, 15),
    }));
  };

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
    <div className="h-full flex flex-col justify-between bg-black border border-slate-800 p-4 font-mono select-none">
      <div>
        {/* PANEL HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-bold tracking-widest text-slate-300 uppercase">
              BIOMETRIC TELEMETRY
            </span>
          </div>
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-cyan-400">
            PASSIVE
          </span>
        </div>

        {/* COMPACT NASA PVT HARVESTER */}
        <div className="mb-4">
          <div className="flex justify-between text-[10px] text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" /> WINSCAT / PVT
            </span>
            <span className="text-slate-500">[SPACE]</span>
          </div>

          <div
            onClick={pvtActive ? triggerPvtReaction : startPvtTest}
            className={`py-2 px-3 border text-center cursor-pointer transition-all ${
              pvtStimulus
                ? "bg-rose-500 text-black font-bold animate-pulse border-rose-400 shadow-[0_0_12px_#f43f5e]"
                : pvtActive
                ? "bg-amber-950/40 border-amber-500 text-amber-300"
                : "bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300"
            }`}
          >
            <div className="text-[11px] font-bold tracking-wider uppercase">
              {pvtStatusText}
            </div>
          </div>

          {pvtHistory.length > 0 && (
            <div className="flex gap-1.5 mt-1.5">
              {pvtHistory.map((res, i) => (
                <span
                  key={i}
                  className={`text-[9px] px-1 py-0.5 border ${
                    res.isLapse
                      ? "bg-rose-950/80 text-rose-300 border-rose-800"
                      : "bg-slate-950 text-emerald-400 border-slate-800"
                  }`}
                >
                  {res.reactionTime}ms
                </span>
              ))}
            </div>
          )}
        </div>

        {/* PASSIVE CONSOLE EXHAUST TRACKER */}
        <div className="mb-4">
          <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-1">
            <Terminal className="w-3 h-3 text-cyan-400" />
            <span>CONSOLE INPUT EXHAUST</span>
          </div>
          <input
            type="text"
            value={testInput}
            onChange={handleKeyInput}
            placeholder="CHECKLIST INPUT..."
            className="w-full bg-slate-950 border border-slate-800 px-2 py-1 text-[11px] text-white focus:outline-none focus:border-cyan-400 font-mono tracking-wider uppercase"
          />
          {keystrokeLog.length > 0 && (
            <div className="flex items-end gap-1 h-3 mt-1.5 px-0.5">
              {keystrokeLog.map((val, idx) => (
                <div
                  key={idx}
                  className="bg-cyan-500/80 w-full"
                  style={{ height: `${Math.min(100, Math.max(20, (val / 350) * 100))}%` }}
                />
              ))}
            </div>
          )}
        </div>

        {/* METRICS READOUT TABLE */}
        <div className="border border-slate-800 divide-y divide-slate-800/80 text-[11px]">
          <div className="flex justify-between px-2 py-1.5 bg-slate-950/50">
            <span className="text-slate-400">LATENCY (TAU)</span>
            <span className="font-bold text-cyan-400">{telemetry.keystrokeLatency} ms</span>
          </div>
          <div className="flex justify-between px-2 py-1.5 bg-slate-950/50">
            <span className="text-slate-400">JITTER (RMS)</span>
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
          <div className="flex justify-between px-2 py-1.5 bg-slate-950/50">
            <span className="text-slate-400">RAD DOSE RATE</span>
            <span className="text-slate-200">{telemetry.radiationDose} mSv/h</span>
          </div>
          <div className="flex justify-between px-2 py-1.5 bg-slate-950/50">
            <span className="text-slate-400">CABIN PCO2</span>
            <span className="text-slate-200">{telemetry.cabinCO2} mmHg</span>
          </div>
          <div className="flex justify-between px-2 py-1.5 bg-slate-950/50">
            <span className="text-slate-400">SLEEP DEFICIT</span>
            <span className="text-slate-200">{telemetry.sleepDebt} h</span>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800 text-[9px] text-slate-500 flex justify-between">
        <span>INVOLUNTARY HARVEST</span>
        <span className="text-cyan-600">ZERO SURVEYS</span>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from "react";
import {
  ShieldAlert,
  Zap,
  Activity,
  Lock,
  Wind,
  Sun,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Terminal,
} from "lucide-react";

type HazardLevel = "NOMINAL" | "MODERATE_STRAIN" | "CRITICAL_DRIFT";

interface TelemetryState {
  radiationDose: number; // mSv/hr
  cabinCO2: number; // mmHg
  sleepDebt: number; // Hours
  psychomotorJitter: number; // ms variance
  keystrokeLatency: number; // ms average
  circadianSpectrum: string; // K (Kelvin)
  scrubberDutyCycle: number; // %
  flightEnvelopeDamping: number; // % (Auto-assist level)
  taskAuthority: "SOLO_MANUAL" | "ASSISTED_DAMPED" | "DUAL_CONSENSUS";
}

export default function App() {
  const [hazard, setHazard] = useState<HazardLevel>("NOMINAL");
  const [telemetry, setTelemetry] = useState<TelemetryState>({
    radiationDose: 0.04,
    cabinCO2: 2.1,
    sleepDebt: 1.2,
    psychomotorJitter: 14,
    keystrokeLatency: 142,
    circadianSpectrum: "6500K (High-Efficiency Blue)",
    scrubberDutyCycle: 42,
    flightEnvelopeDamping: 0,
    taskAuthority: "SOLO_MANUAL",
  });

  const [activeHazardName, setActiveHazardName] = useState<string>("Standard Earth-Mars Cruise");
  const [keystrokeLog, setKeystrokeLog] = useState<number[]>([]);
  const [testInput, setTestInput] = useState<string>("");
  const [vaultOpen, setVaultOpen] = useState<boolean>(false);
  const [dockingOffset, setDockingOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastKeyTimeRef = useRef<number>(Date.now());

  // Handle live interactive keystroke latency & jitter calculation
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

  // State synchronization on hazard changes
  useEffect(() => {
    if (hazard === "NOMINAL") {
      setTelemetry((prev) => ({
        ...prev,
        radiationDose: 0.04,
        cabinCO2: 2.1,
        sleepDebt: 1.2,
        circadianSpectrum: "6500K (High-Efficiency Blue)",
        scrubberDutyCycle: 42,
        flightEnvelopeDamping: 0,
        taskAuthority: "SOLO_MANUAL",
      }));
      setDockingOffset({ x: 0, y: 0 });
    } else if (hazard === "MODERATE_STRAIN") {
      setTelemetry((prev) => ({
        ...prev,
        radiationDose: 0.58,
        cabinCO2: 4.9,
        sleepDebt: 6.2,
        circadianSpectrum: "4200K (Balanced Neutral)",
        scrubberDutyCycle: 86,
        flightEnvelopeDamping: 38,
        taskAuthority: "ASSISTED_DAMPED",
      }));
      setDockingOffset({ x: 12, y: -8 });
    } else if (hazard === "CRITICAL_DRIFT") {
      setTelemetry((prev) => ({
        ...prev,
        radiationDose: 2.45,
        cabinCO2: 7.8,
        sleepDebt: 13.5,
        circadianSpectrum: "2100K (Recovery Amber)",
        scrubberDutyCycle: 100,
        flightEnvelopeDamping: 82,
        taskAuthority: "DUAL_CONSENSUS",
      }));
      setDockingOffset({ x: 34, y: 22 });
    }
  }, [hazard]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 flex flex-col gap-5 selection:bg-cyan-500 selection:text-black">
      {/* AEROSPACE HEADER */}
      <header className="border-b border-slate-800 pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
            <h1 className="text-lg md:text-xl font-bold tracking-widest text-cyan-400 uppercase font-mono">
              PROJECT AEGIS // BIO-FbW FLIGHT DECK
            </h1>
            <span className="text-[11px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded font-mono">
              CLOSED-LOOP BIOMETRIC ENVELOPE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic load-balancing & involuntary ambient telemetry for deep-space missions. No punitive disqualifications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setVaultOpen(true)}
            className="flex items-center gap-2 bg-slate-900 border border-cyan-600/50 hover:border-cyan-400 text-cyan-300 px-3 py-1.5 rounded text-xs transition shadow-sm"
          >
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold">ZK Medical Vault</span>
          </button>

          <div className="bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded text-xs flex items-center gap-2 font-mono">
            <span className="text-slate-400">ENVELOPE:</span>
            <span
              className={`font-bold ${
                hazard === "NOMINAL"
                  ? "text-emerald-400"
                  : hazard === "MODERATE_STRAIN"
                  ? "text-amber-400"
                  : "text-rose-400 animate-pulse"
              }`}
            >
              {hazard}
            </span>
          </div>
        </div>
      </header>

      {/* NASA RIDGE HAZARDS INTERACTIVE INJECTOR */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
            <Zap className="w-4 h-4 text-amber-400" />
            NASA RIDGE Hazards Stress-Injector (Live Simulation)
          </div>
          <span className="text-xs text-slate-400">
            Active Hazard: <strong className="text-cyan-300">{activeHazardName}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => {
              setHazard("NOMINAL");
              setActiveHazardName("Nominal Mars Cruise (Baseline)");
            }}
            className={`p-3 rounded-md border text-left text-xs transition flex flex-col gap-1.5 ${
              hazard === "NOMINAL"
                ? "bg-cyan-950/40 border-cyan-500 text-cyan-100 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                : "bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-400"
            }`}
          >
            <div className="font-bold flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> 1. Nominal Envelope
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Baseline sleep entrainment. Normal microgravity adaptation. Full solo manual authority.
            </p>
          </button>

          <button
            onClick={() => {
              setHazard("MODERATE_STRAIN");
              setActiveHazardName("Solar Flare (Radiation) + Scrubbing Drift (Closed Env)");
            }}
            className={`p-3 rounded-md border text-left text-xs transition flex flex-col gap-1.5 ${
              hazard === "MODERATE_STRAIN"
                ? "bg-amber-950/40 border-amber-500 text-amber-100 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                : "bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-400"
            }`}
          >
            <div className="font-bold flex items-center gap-1.5 text-amber-400">
              <AlertTriangle className="w-3.5 h-3.5" /> 2. Environmental Strain
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              CO2 rises to 4.9 mmHg. Sleep deficit of 6.2h. Latency spikes; auto-damping kicks in.
            </p>
          </button>

          <button
            onClick={() => {
              setHazard("CRITICAL_DRIFT");
              setActiveHazardName("Acute SPE Storm + Multi-Day Sleep Fragmentation");
            }}
            className={`p-3 rounded-md border text-left text-xs transition flex flex-col gap-1.5 ${
              hazard === "CRITICAL_DRIFT"
                ? "bg-rose-950/40 border-rose-500 text-rose-100 shadow-[0_0_15px_rgba(244,63,94,0.15)]"
                : "bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-400"
            }`}
          >
            <div className="font-bold flex items-center gap-1.5 text-rose-400">
              <ShieldAlert className="w-3.5 h-3.5" /> 3. Critical Biological Drift
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Significant motor jitter. System shunts manual docking to dual-consensus auto-nav.
            </p>
          </button>
        </div>
      </section>

      {/* CORE 3-PANEL FLIGHT DECK */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1">
        {/* PANEL A: AMBIENT INVOLUNTARY PROBE */}
        <div className="lg:col-span-4 bg-slate-900/40 border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                  Panel A: Ambient Involuntary Probe
                </h2>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                PASSIVE HARVEST
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              No self-reporting surveys. Health telemetry is extracted directly from flight-console keystrokes and life support exhaust.
            </p>

            {/* LIVE KEYSTROKE TEST */}
            <div className="bg-slate-950 border border-slate-800 p-3 rounded mb-4">
              <label className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                <Terminal className="w-3 h-3" />
                Interactive Telemetry Probe (Type to test jitter):
              </label>
              <input
                type="text"
                value={testInput}
                onChange={handleKeyInput}
                placeholder="Type 'ALIGN THRUSTER GIMBAL 04-B'..."
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Calculates real ms variance between key-down events.
              </span>
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

            {/* TELEMETRY READOUTS */}
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
            *Involuntary telemetry cannot be gamed, masked, or faked by fatigued operators.
          </div>
        </div>

        {/* PANEL B: OPERATIONAL FLY-BY-WIRE LOAD BALANCER */}
        <div className="lg:col-span-5 bg-slate-900/40 border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                  Panel B: Biometric Fly-by-Wire (Task Shunting)
                </h2>
              </div>
              <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-1.5 py-0.5 rounded font-mono">
                NON-DISQUALIFYING
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              When biological degradation occurs, the system dynamically filters control tremors and adjusts mission operational envelopes.
            </p>

            {/* DOCKING TARGET RETICLE */}
            <div className="relative aspect-video bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center overflow-hidden mb-4 shadow-inner">
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

              {/* RETICLE GRID */}
              <div className="w-32 h-32 border border-slate-700/60 rounded-full flex items-center justify-center relative">
                <div className="w-full h-[1px] bg-slate-800 absolute" />
                <div className="h-full w-[1px] bg-slate-800 absolute" />

                {/* TARGET CENTER */}
                <div className="w-3 h-3 border border-cyan-400 rounded-full flex items-center justify-center">
                  <div className="w-1 h-1 bg-cyan-400 rounded-full" />
                </div>

                {/* ASTRONAUT MOTOR TRAJECTORY */}
                <div
                  className="w-7 h-7 rounded-full border-2 transition-all duration-700 flex items-center justify-center shadow-lg"
                  style={{
                    transform: `translate(${dockingOffset.x}px, ${dockingOffset.y}px)`,
                    borderColor:
                      hazard === "CRITICAL_DRIFT"
                        ? "#f43f5e"
                        : hazard === "MODERATE_STRAIN"
                        ? "#f59e0b"
                        : "#10b981",
                  }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor:
                        hazard === "CRITICAL_DRIFT"
                          ? "#f43f5e"
                          : hazard === "MODERATE_STRAIN"
                          ? "#f59e0b"
                          : "#10b981",
                    }}
                  />
                </div>
              </div>

              {/* FLY-BY-WIRE STABILIZER OVERLAY */}
              {telemetry.flightEnvelopeDamping > 0 && (
                <div className="absolute bottom-3 left-3 right-3 bg-slate-900/95 border border-cyan-600/50 px-2.5 py-1.5 rounded text-[11px] flex justify-between items-center font-mono">
                  <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" />
                    Bio-FbW Dynamic Damping:
                  </span>
                  <span className="text-white">+{telemetry.flightEnvelopeDamping}% Tremor Compensation</span>
                </div>
              )}
            </div>

            {/* AUTHORITY READOUT */}
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center p-2 rounded bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400">Flight Control Authority:</span>
                <span className="font-bold text-white px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                  {telemetry.taskAuthority}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400">Critical Task Shunting:</span>
                <span className="text-slate-300">
                  {hazard === "CRITICAL_DRIFT"
                    ? "Diverted to Autonomous Dual-Nav"
                    : hazard === "MODERATE_STRAIN"
                    ? "Assisted Envelope Active"
                    : "Full Solo Pilot Clear"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>Mission envelope absorbs physiological deficit; operator never penalized.</span>
          </div>
        </div>

        {/* PANEL C: CLOSED-LOOP HABITAT ACTUATION */}
        <div className="lg:col-span-3 bg-slate-900/40 border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-cyan-400" />
                <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                  Panel C: Habitat Actuators
                </h2>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                ECLSS LOOP
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Physical habitat counters the deficit automatically. Environmental intervention replaces passive advice.
            </p>

            <div className="space-y-4">
              {/* CIRCADIAN LIGHTING */}
              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-amber-400" /> Circadian Light Spectrum:
                  </span>
                </div>
                <div className="text-xs font-bold text-white mb-2 font-mono">
                  {telemetry.circadianSpectrum}
                </div>
                <div
                  className={`h-2.5 rounded-full transition-all duration-700 ${
                    hazard === "CRITICAL_DRIFT"
                      ? "bg-amber-600 shadow-[0_0_12px_rgba(217,119,6,0.8)]"
                      : hazard === "MODERATE_STRAIN"
                      ? "bg-yellow-400"
                      : "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                  }`}
                />
              </div>

              {/* CO2 SCRUBBER */}
              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Wind className="w-3.5 h-3.5 text-cyan-400" /> CO2 Scrubber Overdrive:
                  </span>
                  <span className="text-xs font-bold text-cyan-400 font-mono">
                    {telemetry.scrubberDutyCycle}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mb-1.5">
                  <div
                    className="bg-cyan-400 h-full transition-all duration-500"
                    style={{ width: `${telemetry.scrubberDutyCycle}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 block leading-tight">
                  Purging localized CO2 dead-zones before brain fog manifests.
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
            Automated Environmental Control and Life Support System (ECLSS) sync.
          </div>
        </div>
      </div>

      {/* CONFESSION BOOTH MODAL (ZERO-KNOWLEDGE PRIVACY) */}
      {vaultOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-cyan-500/60 rounded-xl max-w-lg w-full p-6 text-xs space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Lock className="w-4 h-4" />
                <span>CONFESSION BOOTH: ZK-Biometric Enclave</span>
              </div>
              <button
                onClick={() => setVaultOpen(false)}
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
              onClick={() => setVaultOpen(false)}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2.5 rounded transition"
            >
              Close Confidential Enclave
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

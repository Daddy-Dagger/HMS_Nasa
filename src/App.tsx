import { useState, useEffect } from "react";
import {
  Zap,
  Lock,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";
import { HazardLevel, TelemetryState } from "./types/telemetry";
import { PanelA_Probe } from "./components/PanelA_Probe";
import { PanelB_Reticle } from "./components/PanelB_Reticle";
import { PanelC_Habitat } from "./components/PanelC_Habitat";
import { ConfessionBoothModal } from "./components/ConfessionBoothModal";

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
  const [vaultOpen, setVaultOpen] = useState<boolean>(false);
  const [dockingOffset, setDockingOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

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
      setDockingOffset({ x: 14, y: -9 });
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
      setDockingOffset({ x: 36, y: 24 });
    }
  }, [hazard]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 flex flex-col gap-5 selection:bg-cyan-500 selection:text-black font-mono">
      {/* AEROSPACE HEADER */}
      <header className="border-b border-slate-800 pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
            <h1 className="text-lg md:text-xl font-bold tracking-widest text-cyan-400 uppercase">
              PROJECT AEGIS // BIO-FbW FLIGHT DECK
            </h1>
            <span className="text-[11px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded">
              CLOSED-LOOP BIOMETRIC ENVELOPE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Dynamic load-balancing & involuntary ambient telemetry for deep-space missions. No punitive disqualifications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setVaultOpen(true)}
            className="flex items-center gap-2 bg-slate-900 border border-cyan-600/50 hover:border-cyan-400 text-cyan-300 px-3 py-1.5 rounded text-xs transition shadow-sm font-sans"
          >
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold">ZK Medical Vault</span>
          </button>

          <div className="bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded text-xs flex items-center gap-2">
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
      <section className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 font-sans">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
            <Zap className="w-4 h-4 text-amber-400" />
            NASA RIDGE Hazards Stress-Injector (Live Simulation)
          </div>
          <span className="text-xs text-slate-400 font-mono">
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
            <div className="font-bold flex items-center gap-1.5 text-emerald-400 font-mono">
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
            <div className="font-bold flex items-center gap-1.5 text-amber-400 font-mono">
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
            <div className="font-bold flex items-center gap-1.5 text-rose-400 font-mono">
              <ShieldAlert className="w-3.5 h-3.5" /> 3. Critical Biological Drift
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Significant motor jitter. System shunts manual docking to dual-consensus auto-nav.
            </p>
          </button>
        </div>
      </section>

      {/* CORE 3-PANEL MODULAR FLIGHT DECK */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 font-sans">
        {/* PANEL A: INVOLUNTARY PROBE & NASA PVT (Track A) */}
        <div className="lg:col-span-4 flex flex-col">
          <PanelA_Probe telemetry={telemetry} setTelemetry={setTelemetry} />
        </div>

        {/* PANEL B: BIOMETRIC FLY-BY-WIRE & RETICLE (Track B - Friend's Domain) */}
        <div className="lg:col-span-5 flex flex-col">
          <PanelB_Reticle
            telemetry={telemetry}
            hazard={hazard}
            dockingOffset={dockingOffset}
          />
        </div>

        {/* PANEL C: HABITAT ACTUATORS & RECOVERY LOOP */}
        <div className="lg:col-span-3 flex flex-col">
          <PanelC_Habitat
            telemetry={telemetry}
            setTelemetry={setTelemetry}
            hazard={hazard}
            setHazard={setHazard}
            setActiveHazardName={setActiveHazardName}
          />
        </div>
      </div>

      {/* CONFESSION BOOTH (ZK ENCLAVE) */}
      <ConfessionBoothModal isOpen={vaultOpen} onClose={() => setVaultOpen(false)} />
    </div>
  );
}

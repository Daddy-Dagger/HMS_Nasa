import { useState, useEffect, useRef } from "react";
import {
  Lock,
  Play,
  Square,
  Radio,
  Clock,
  WifiOff,
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
    circadianSpectrum: "6500K (ALERT BLUE)",
    scrubberDutyCycle: 42,
    flightEnvelopeDamping: 0,
    taskAuthority: "SOLO_MANUAL",
  });

  const [activeHazardName, setActiveHazardName] = useState<string>("Nominal Cruise");
  const [vaultOpen, setVaultOpen] = useState<boolean>(false);
  const [dockingOffset, setDockingOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // 60s Guided Demo State
  const [guidedDemoActive, setGuidedDemoActive] = useState<boolean>(false);
  const [guidedStepMessage, setGuidedStepMessage] = useState<string>("");
  const guidedTimerRef = useRef<number[]>([]);

  // State synchronization on hazard changes
  useEffect(() => {
    if (hazard === "NOMINAL") {
      setTelemetry((prev) => ({
        ...prev,
        radiationDose: 0.04,
        cabinCO2: 2.1,
        sleepDebt: 1.2,
        circadianSpectrum: "6500K (ALERT BLUE)",
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
        circadianSpectrum: "4200K (NEUTRAL)",
        scrubberDutyCycle: 86,
        flightEnvelopeDamping: 38,
        taskAuthority: "ASSISTED_DAMPED",
      }));
      setDockingOffset({ x: 16, y: -12 });
    } else if (hazard === "CRITICAL_DRIFT") {
      setTelemetry((prev) => ({
        ...prev,
        radiationDose: 2.45,
        cabinCO2: 7.8,
        sleepDebt: 13.5,
        circadianSpectrum: "2100K (RECOVERY AMBER)",
        scrubberDutyCycle: 100,
        flightEnvelopeDamping: 82,
        taskAuthority: "DUAL_CONSENSUS",
      }));
      setDockingOffset({ x: 42, y: 28 });
    }
  }, [hazard]);

  // Guided Demo Tour Sequencer
  const stopGuidedDemo = () => {
    guidedTimerRef.current.forEach((t) => clearTimeout(t));
    guidedTimerRef.current = [];
    setGuidedDemoActive(false);
    setGuidedStepMessage("");
  };

  const startGuidedDemo = () => {
    stopGuidedDemo();
    setGuidedDemoActive(true);

    // ACT 1: Nominal
    setHazard("NOMINAL");
    setActiveHazardName("Nominal Mars Cruise");
    setGuidedStepMessage("ACT I: Baseline telemetry. Solo manual authority. Unconstrained envelope.");

    // ACT 2: SPE Hazard Flare at 12s
    const t1 = window.setTimeout(() => {
      setHazard("MODERATE_STRAIN");
      setActiveHazardName("SPE Solar Flare + CO2 Drift");
      setGuidedStepMessage("ACT II: Passive harvest detects elevated CO2 & latency jitter. Envelope dampens 38%.");
    }, 12000);

    // ACT 3: Critical Drift at 28s
    const t2 = window.setTimeout(() => {
      setHazard("CRITICAL_DRIFT");
      setActiveHazardName("Acute SPE Storm + Multi-Day Sleep Fragmentation");
      setGuidedStepMessage("ACT III: Bio-FbW auto-dampens 82% tremor. Task shunted to Dual-Nav without grounding operator.");
    }, 28000);

    // ACT 4: Closed-Loop Recovery at 44s
    const t3 = window.setTimeout(() => {
      setGuidedStepMessage("ACT IV: Closed-loop ECLSS purge & 2100K circadian entrainment initiated. Biometrics restoring.");
      setTelemetry((prev) => ({
        ...prev,
        scrubberDutyCycle: 100,
        circadianSpectrum: "2100K (MAX PURGE)",
      }));
    }, 44000);

    // End Demo at 58s
    const t4 = window.setTimeout(() => {
      setHazard("NOMINAL");
      setActiveHazardName("Nominal Mars Cruise (Rehabilitated)");
      setGuidedStepMessage("MISSION RESTORED: Biological baseline recovered. Full solo authority restored.");
      setGuidedDemoActive(false);
    }, 58000);

    guidedTimerRef.current = [t1, t2, t3, t4];
  };

  useEffect(() => {
    return () => {
      guidedTimerRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-slate-100 p-3 md:p-4 flex flex-col justify-between font-mono select-none antialiased">
      {/* COCKPIT STATUS APEX HEADER */}
      <header className="border border-slate-800 bg-slate-950 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs mb-3">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 bg-cyan-400 rounded-none shadow-[0_0_8px_#22d3ee]" />
          <span className="font-bold tracking-widest text-white uppercase">
            ORION-AEGIS // GLASS COCKPIT OS
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">MISSION: MARS-TRANSIT // SOL 142</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-400">
            <WifiOff className="w-3 h-3 text-amber-500" />
            <span>EARTH COMMS LAG: <strong className="text-white">+14m 22s</strong> (100% AUTONOMOUS)</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <Clock className="w-3 h-3 text-slate-500" />
            <span className="text-slate-300">MET: 3418:42:09</span>
          </div>

          <button
            onClick={() => setVaultOpen(true)}
            className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 hover:border-cyan-400 text-cyan-300 px-2 py-1 text-[10px] transition"
          >
            <Lock className="w-3 h-3 text-cyan-400" />
            <span>ZK ENCLAVE</span>
          </button>
        </div>
      </header>

      {/* GUIDED DEMO SUBTITLE HUD */}
      {guidedDemoActive && (
        <div className="bg-cyan-950/60 border border-cyan-500 px-3 py-1.5 mb-3 flex items-center gap-2.5 text-xs text-cyan-200">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse shrink-0" />
          <span className="font-bold text-cyan-400 tracking-wider">AUTONOMOUS FLIGHT SIMULATION:</span>
          <span>{guidedStepMessage}</span>
        </div>
      )}

      {/* MAIN COCKPIT DISPLAY GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 mb-3">
        {/* LEFT RAIL: BIOMETRIC TELEMETRY (PASSIVE) */}
        <div className="lg:col-span-3">
          <PanelA_Probe telemetry={telemetry} setTelemetry={setTelemetry} />
        </div>

        {/* CENTER STAGE: PRIMARY FLIGHT DISPLAY (DOMINANT RETICLE) */}
        <div className="lg:col-span-6">
          <PanelB_Reticle
            telemetry={telemetry}
            hazard={hazard}
            dockingOffset={dockingOffset}
          />
        </div>

        {/* RIGHT RAIL: ECLSS HABITAT ACTUATORS */}
        <div className="lg:col-span-3">
          <PanelC_Habitat
            telemetry={telemetry}
            setTelemetry={setTelemetry}
            hazard={hazard}
            setHazard={setHazard}
            setActiveHazardName={setActiveHazardName}
          />
        </div>
      </div>

      {/* BOTTOM CONTROL RAIL: SCENARIO STRESS-TESTER */}
      <footer className="border border-slate-800 bg-slate-950 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 uppercase text-[10px] tracking-widest">NASA RIDGE INJECTOR:</span>
          <div className="flex gap-1.5">
            <button
              onClick={() => {
                setHazard("NOMINAL");
                setActiveHazardName("Nominal Mars Cruise");
              }}
              className={`px-2.5 py-1 text-[10px] border transition ${
                hazard === "NOMINAL"
                  ? "bg-emerald-950 text-emerald-300 border-emerald-600"
                  : "bg-black border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              1. NOMINAL
            </button>
            <button
              onClick={() => {
                setHazard("MODERATE_STRAIN");
                setActiveHazardName("SPE Solar Flare + CO2 Drift");
              }}
              className={`px-2.5 py-1 text-[10px] border transition ${
                hazard === "MODERATE_STRAIN"
                  ? "bg-amber-950 text-amber-300 border-amber-600"
                  : "bg-black border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              2. SPE FLARE / CO2
            </button>
            <button
              onClick={() => {
                setHazard("CRITICAL_DRIFT");
                setActiveHazardName("Acute Radiation Storm + Multi-Day Sleep Fragmentation");
              }}
              className={`px-2.5 py-1 text-[10px] border transition ${
                hazard === "CRITICAL_DRIFT"
                  ? "bg-rose-950 text-rose-300 border-rose-600 animate-pulse"
                  : "bg-black border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              3. CRITICAL DRIFT
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-[10px] text-slate-400">
            ACTIVE ENVELOPE: <strong className="text-white uppercase">{activeHazardName}</strong>
          </div>

          <button
            onClick={guidedDemoActive ? stopGuidedDemo : startGuidedDemo}
            className={`px-3 py-1 text-[10px] font-bold border flex items-center gap-1.5 transition ${
              guidedDemoActive
                ? "bg-rose-950 border-rose-500 text-rose-300 animate-pulse"
                : "bg-cyan-950 border-cyan-500 hover:bg-cyan-900 text-cyan-200"
            }`}
          >
            {guidedDemoActive ? (
              <>
                <Square className="w-2.5 h-2.5 fill-current" />
                <span>HALT SIM</span>
              </>
            ) : (
              <>
                <Play className="w-2.5 h-2.5 fill-current" />
                <span>RUN 60S SIMULATION</span>
              </>
            )}
          </button>
        </div>
      </footer>

      {/* CONFESSION BOOTH (ZK ENCLAVE MODAL) */}
      <ConfessionBoothModal isOpen={vaultOpen} onClose={() => setVaultOpen(false)} />
    </div>
  );
}

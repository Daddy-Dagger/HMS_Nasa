import { useState, useEffect, useRef } from "react";
import {
  Play,
  Square,
  FileText,
  Eye,
  Watch,
  Monitor,
  Smartphone,
  Activity,
  Radio,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Target,
  Check,
} from "lucide-react";
import {
  AnatomicalZone,
  HealthStatus,
  EscalationTier,
  CrewMemberId,
  DailyHealthMetric,
  CommsMode,
  QueuedDossier,
} from "./types/mission";
import { INITIAL_CREW_DATASETS } from "./data/crewData";
import {
  computeAllZoneStatuses,
  computeOverallCrewStatus,
  CREW_BASELINES,
  evaluateSensorConfidence,
} from "./utils/driftEngine";
import { BodyMap } from "./components/BodyMap";
import { BodyScanView } from "./components/BodyScanView";
import { ConstellationGlyph } from "./components/ConstellationGlyph";
import { IndicatorDetail } from "./components/IndicatorDetail";
import { EscalationLadder } from "./components/EscalationLadder";
import { FlightSurgeonPacketModal } from "./components/FlightSurgeonPacketModal";
import { SANSExamModal, SANSExamResult } from "./components/SANSExamModal";
import { WearableWatchHUD } from "./components/WearableWatchHUD";
import { MobileView } from "./components/MobileView";
import { MedicalProcedureModal, ProcedureTypeId } from "./components/MedicalProcedureModal";
import { FaultInjectionBar } from "./components/FaultInjectionBar";

interface CrewMemberInfo {
  id: CrewMemberId;
  name: string;
  role: string;
}

const SCENARIO_PRESETS = [
  { sol: 1, label: "Sol 1: Baseline", desc: "All systems nominal across crew", shortLabel: "Sol 1 Baseline" },
  { sol: 8, label: "Sol 8: Motion Glitch", desc: "SQM drops to 19% (motion artifact)", shortLabel: "Sol 8 Glitch" },
  { sol: 18, label: "Sol 18: Sleep Loss", desc: "Circadian disruption (3.8h sleep)", shortLabel: "Sol 18 Sleep" },
  { sol: 23, label: "Sol 23: Elevated BP", desc: "Tier 1 rest & SSLA amber protocol", shortLabel: "Sol 23 BP Spike" },
  { sol: 28, label: "Sol 28: Ground Dossier", desc: "Flight Surgeon packet downlink & sync", shortLabel: "Sol 28 Dossier" },
];

export default function App() {
  // Current Sol (Day 1 to 30)
  const [currentSol, setCurrentSol] = useState<number>(23);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const playTimerRef = useRef<number | null>(null);
  const [scenarioMenuOpen, setScenarioMenuOpen] = useState<boolean>(false);
  const scenarioMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (scenarioMenuRef.current && !scenarioMenuRef.current.contains(e.target as Node)) {
        setScenarioMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Selected anatomical zone
  const [selectedZone, setSelectedZone] = useState<AnatomicalZone>("CARDIOVASCULAR");

  // Delay mode: LEO real-time vs Deep-Space Mars 20m lag vs Communications Blackout
  const [delayMode, setDelayMode] = useState<CommsMode>("MARS_20M_DELAY");

  // Queued dossiers during communications blackout
  const [queuedDossiers, setQueuedDossiers] = useState<QueuedDossier[]>([]);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  // View mode: Full PC console vs Mobile Handheld vs Minimalist Wearable HUD
  const [viewMode, setViewMode] = useState<"EXPEDITION_CONSOLE" | "MOBILE_PAD" | "WEARABLE_WATCH_HUD">("EXPEDITION_CONSOLE");

  // Console Left Panel Mode: Body Scan vs Vector Map vs 7-Dot Glyph
  const [consoleLeftMode, setConsoleLeftMode] = useState<"BODY_SCAN" | "BODY_MAP" | "GLYPH">("BODY_SCAN");

  // Active crew member selector
  const [activeCrew, setActiveCrew] = useState<CrewMemberId>("CDR_MILLER");

  // Telemetry datasets for all crew members (supports live fault injection)
  const [crewDatasets, setCrewDatasets] = useState<Record<CrewMemberId, DailyHealthMetric[]>>(() =>
    JSON.parse(JSON.stringify(INITIAL_CREW_DATASETS))
  );

  // Active injected fault tracking
  const [activeFault, setActiveFault] = useState<"NONE" | "SENSOR_GLITCH" | "BP_DRIFT" | "SLEEP_DECLINE">("NONE");

  // Modals state
  const [packetOpen, setPacketOpen] = useState<boolean>(false);
  const [sansExamOpen, setSansExamOpen] = useState<boolean>(false);
  const [sansExamResult, setSansExamResult] = useState<SANSExamResult | null>(null);
  const [procedureModalOpen, setProcedureModalOpen] = useState<boolean>(false);
  const [activeProcedure, setActiveProcedure] = useState<ProcedureTypeId>("TIER1_REST_RECOVERY");
  const [procedureCompletionLog, setProcedureCompletionLog] = useState<string | null>(null);

  // Crew roster metadata
  const crewRoster: CrewMemberInfo[] = [
    { id: "CDR_MILLER", name: "CDR MILLER", role: "Mission Commander" },
    { id: "PLT_CHEN", name: "PLT CHEN", role: "Lunar/Mars Pilot" },
    { id: "ENG_KOWALSKI", name: "ENG KOWALSKI", role: "Flight Engineer" },
    { id: "SCI_VANCE", name: "SCI VANCE", role: "Science Specialist" },
  ];

  // Active astronaut's 30-day mission telemetry
  const activeMissionData = crewDatasets[activeCrew] || crewDatasets.CDR_MILLER;
  const currentMetric = activeMissionData[currentSol - 1] || activeMissionData[0];
  const activeBaseline = CREW_BASELINES[activeCrew] || CREW_BASELINES.CDR_MILLER;
  const confidence = evaluateSensorConfidence(currentMetric, activeBaseline);

  // Dynamic zone statuses computed by CUSUM / EWMA drift engine for the active crew
  const zoneStatuses = computeAllZoneStatuses(activeCrew, activeMissionData, currentSol);

  // Factor in SANS exam result if logged for Cranial/SANS zone
  if (sansExamResult) {
    if (sansExamResult.sansStage === "STAGE_2_MODERATE") {
      zoneStatuses.CRANIAL_SANS = "CRITICAL";
    } else if (sansExamResult.sansStage === "STAGE_1_MILD") {
      zoneStatuses.CRANIAL_SANS = "ATTENTION";
    }
  }

  // Factor in conservative escalation if data quality is degraded
  const conservativeEscalationActive = confidence.score < 60;
  if (conservativeEscalationActive && zoneStatuses.CARDIOVASCULAR === "NOMINAL") {
    zoneStatuses.CARDIOVASCULAR = "ATTENTION";
  }

  // Dynamic overall crew statuses for the Crew Mesh bar
  const crewMeshStatusMap: Record<CrewMemberId, HealthStatus> = {
    CDR_MILLER: computeOverallCrewStatus(computeAllZoneStatuses("CDR_MILLER", crewDatasets.CDR_MILLER, currentSol)),
    PLT_CHEN: computeOverallCrewStatus(computeAllZoneStatuses("PLT_CHEN", crewDatasets.PLT_CHEN, currentSol)),
    ENG_KOWALSKI: computeOverallCrewStatus(computeAllZoneStatuses("ENG_KOWALSKI", crewDatasets.ENG_KOWALSKI, currentSol)),
    SCI_VANCE: computeOverallCrewStatus(computeAllZoneStatuses("SCI_VANCE", crewDatasets.SCI_VANCE, currentSol)),
  };

  // Active clinical escalation tier computed dynamically
  const currentTier: EscalationTier =
    zoneStatuses.CARDIOVASCULAR === "CRITICAL" || zoneStatuses.NEURO_BEHAVIORAL === "CRITICAL" || zoneStatuses.CRANIAL_SANS === "CRITICAL"
      ? 2
      : zoneStatuses.CARDIOVASCULAR === "ATTENTION" || zoneStatuses.NEURO_BEHAVIORAL === "ATTENTION" || conservativeEscalationActive
      ? 1
      : 1;

  // Timeline playback sequencer
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = window.setInterval(() => {
        setCurrentSol((prev) => {
          if (prev >= 30) {
            setIsPlaying(false);
            return 30;
          }
          return prev + 1;
        });
      }, 1200);
    } else {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    }
    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying]);

  // Handle delay mode toggle with blackout queue and sync
  const cycleDelayMode = () => {
    const nextMode: CommsMode =
      delayMode === "LEO_REALTIME"
        ? "MARS_20M_DELAY"
        : delayMode === "MARS_20M_DELAY"
        ? "BLACKOUT"
        : "LEO_REALTIME";

    // If returning from blackout with queued packets, trigger animated sync
    if (delayMode === "BLACKOUT" && queuedDossiers.length > 0) {
      const count = queuedDossiers.length;
      setSyncNotice(`🛰️ DSN CARRIER ACQUIRED: Syncing ${count} buffered dossiers to MCC-Houston... [Synced 100%]`);
      setQueuedDossiers((prev) => prev.map((d) => ({ ...d, status: "SYNCED" })));
      setTimeout(() => {
        setSyncNotice(null);
      }, 4000);
    }

    setDelayMode(nextMode);
  };

  // Live Fault Injection Handler
  const handleInjectFault = (fault: "SENSOR_GLITCH" | "BP_DRIFT" | "SLEEP_DECLINE") => {
    setActiveFault(fault);
    setCrewDatasets((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const targetCrewData = copy[activeCrew] as DailyHealthMetric[];
      const metricIndex = currentSol - 1;

      if (fault === "SENSOR_GLITCH") {
        targetCrewData[metricIndex] = {
          ...targetCrewData[metricIndex],
          sensorConfidence: 18,
          alertSuppressed: true,
          heartRate: 35,
          systolicBP: 186,
          diastolicBP: 110,
          confidenceReason: "Motion artifact detected • Lead displacement • Re-measure required",
          eventTag: "INJECTED PERTURBATION: SENSOR LEAD DISPLACED // CONSERVATIVE ESCALATION",
          injectedFault: "SENSOR_GLITCH",
        };
      } else if (fault === "BP_DRIFT") {
        targetCrewData[metricIndex] = {
          ...targetCrewData[metricIndex],
          systolicBP: 146,
          diastolicBP: 95,
          heartRate: 92,
          sensorConfidence: 96,
          alertSuppressed: false,
          confidenceReason: "High SNR • Sustained arterial elevation confirmed",
          eventTag: "INJECTED PERTURBATION: ACUTE ARTERIAL DRIFT (+24 mmHg) // CUSUM S+ >= 5.0",
          injectedFault: "BP_DRIFT",
        };
      } else if (fault === "SLEEP_DECLINE") {
        targetCrewData[metricIndex] = {
          ...targetCrewData[metricIndex],
          sleepHours: 3.8,
          moodScore: 4.1,
          sensorConfidence: 95,
          confidenceReason: "High SNR • Actigraphy sleep fragmentation confirmed",
          eventTag: "INJECTED PERTURBATION: ACUTE SLEEP LOSS (3.8h) // CIRCADIAN MISALIGNMENT",
          injectedFault: "SLEEP_DECLINE",
        };
      }

      return copy;
    });
  };

  // Reset injected fault back to baseline
  const handleResetFault = () => {
    setActiveFault("NONE");
    setCrewDatasets((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const original = INITIAL_CREW_DATASETS[activeCrew];
      copy[activeCrew] = JSON.parse(JSON.stringify(original));
      return copy;
    });
  };

  // Re-measure protocol handler (clears motion artifact & confirms clean vitals)
  const handleExecuteRemeasure = () => {
    setCrewDatasets((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const targetCrewData = copy[activeCrew] as DailyHealthMetric[];
      const metricIndex = currentSol - 1;
      targetCrewData[metricIndex] = {
        ...targetCrewData[metricIndex],
        sensorConfidence: 98,
        alertSuppressed: false,
        confidenceReason: "High SNR • Sensor re-seated • 5-min quiet rest verified",
        eventTag: "RE-MEASURE VERIFIED // CONFIDENCE RESTORED TO 98%",
        injectedFault: "NONE",
      };
      return copy;
    });
    setActiveFault("NONE");
  };

  const handleQueueDossier = (dossier: QueuedDossier) => {
    setQueuedDossiers((prev) => [...prev, dossier]);
  };

  return (
    <div className="min-h-screen text-slate-800 p-3 sm:p-5 flex flex-col justify-between font-sans select-none antialiased">
      {/* PERSISTENT CLINICAL DECISION SUPPORT DISCLAIMER BANNER */}
      <div className="bg-amber-500/10 border border-amber-300/50 rounded-xl px-3.5 py-1.5 mb-2.5 text-[11px] flex items-center justify-between gap-3 text-amber-900 shadow-sm">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span className="leading-tight">
            <strong>CLINICAL DECISION SUPPORT SYSTEM (CDS):</strong> Operational decision-support only. Not intended for autonomous clinical diagnosis. Defer all interventions to designated Flight Surgeon / CMO. Data is synthetic.
          </span>
        </div>
        <span className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-200/60 text-amber-800 uppercase shrink-0">
          Synthetic Telemetry
        </span>
      </div>

      {/* SYNC NOTICE BANNER WHEN COMMS RESTORED */}
      {syncNotice && (
        <div className="bg-emerald-600 text-white rounded-2xl px-4 py-2 mb-2.5 text-xs font-semibold flex items-center justify-between gap-2 shadow-md animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>{syncNotice}</span>
          </div>
          <span className="text-[10px] bg-emerald-700 px-2 py-0.5 rounded-full font-bold">DSN Lock</span>
        </div>
      )}

      {/* PROCEDURE COMPLETION TOAST */}
      {procedureCompletionLog && (
        <div className="bg-slate-900 text-white rounded-2xl px-4 py-2 mb-2.5 text-xs font-semibold flex items-center justify-between gap-2 shadow-lg border border-slate-700 animate-fadeIn">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>{procedureCompletionLog}</span>
          </div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
            Verified Log
          </span>
        </div>
      )}

      {/* APEX HEADER WITH MULTI-DISPLAY SELECTOR & ACTIONS TOOLBAR */}
      <header className="glass-card rounded-2xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 mb-2.5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
        <div className="flex items-center gap-3">
          {/* AURORA APP ICON */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm shrink-0"
            style={{ background: "linear-gradient(135deg, #c4b5fd, #fda4af, #93c5fd)" }}
          >
            <span className="text-white font-extrabold text-sm tracking-tight">A</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm tracking-tight">AEGIS</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                Artemis CDS • Synthetic
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">NASA Deep-Space Autonomous Health Deck</p>
          </div>

          <span className="hidden sm:inline text-slate-200 font-light mx-1">|</span>

          {/* COMPACT VIEW MODE TOGGLE */}
          <div className="flex items-center gap-0.5 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={() => setViewMode("EXPEDITION_CONSOLE")}
              className={`px-2.5 py-1 text-xs rounded-lg flex items-center gap-1.5 transition font-medium ${
                viewMode === "EXPEDITION_CONSOLE"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title="Desktop Expedition Console"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Console</span>
            </button>
            <button
              onClick={() => setViewMode("MOBILE_PAD")}
              className={`px-2.5 py-1 text-xs rounded-lg flex items-center gap-1.5 transition font-medium ${
                viewMode === "MOBILE_PAD"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title="Mobile Comm-Pad View"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile</span>
            </button>
            <button
              onClick={() => setViewMode("WEARABLE_WATCH_HUD")}
              className={`px-2.5 py-1 text-xs rounded-lg flex items-center gap-1.5 transition font-medium ${
                viewMode === "WEARABLE_WATCH_HUD"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title="Wearable HUD View"
            >
              <Watch className="w-3.5 h-3.5" />
              <span>HUD</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* 3-WAY DELAY / BLACKOUT COMMS STATUS BUTTON */}
          <button
            onClick={cycleDelayMode}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition border active:scale-95 ${
              delayMode === "BLACKOUT"
                ? "bg-rose-50 text-rose-700 border-rose-300 animate-pulse"
                : delayMode === "MARS_20M_DELAY"
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-emerald-50 text-emerald-700 border-emerald-200"
            }`}
            title="Click to cycle: LEO Real-Time -> Mars 20m Lag -> Blackout"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>
              {delayMode === "BLACKOUT"
                ? "Blackout (0 kbps)"
                : delayMode === "MARS_20M_DELAY"
                ? "Mars 20m Lag"
                : "LEO Real-time"}
            </span>
            {queuedDossiers.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] rounded-full bg-amber-200 text-amber-900 font-bold">
                {queuedDossiers.filter((d) => d.status === "QUEUED_LOCAL").length} buffered
              </span>
            )}
          </button>

          {/* UNIFIED CLINICAL SUITE ACTION BAR */}
          <div className="flex items-center bg-white/90 backdrop-blur-sm border border-slate-200 rounded-full shadow-sm divide-x divide-slate-100 overflow-hidden">
            <button
              onClick={() => setSansExamOpen(true)}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition flex items-center gap-1.5 active:scale-95"
              title="Calibrated SANS Visual Acuity Protocol"
            >
              <Eye className="w-3.5 h-3.5 text-indigo-500" />
              <span>SANS Exam</span>
            </button>

            <button
              onClick={() => {
                setActiveProcedure(
                  currentTier === 2
                    ? "OCULAR_ULTRASOUND"
                    : selectedZone === "NEURO_BEHAVIORAL"
                    ? "CIRCADIAN_LIGHTING"
                    : "TIER1_REST_RECOVERY"
                );
                setProcedureModalOpen(true);
              }}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition flex items-center gap-1.5 active:scale-95"
              title="Clinical Countermeasure Checklist & Protocols"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              <span>Procedures</span>
            </button>

            <button
              onClick={() => setPacketOpen(true)}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition flex items-center gap-1.5 relative active:scale-95"
              title="Ground Telemetry Dossier & Flight Surgeon Sync"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Ground Dossier</span>
              {queuedDossiers.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping absolute top-1.5 right-1.5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* VIEWPORT 1: MOBILE COMM-PAD VIEW */}
      {viewMode === "MOBILE_PAD" ? (
        <MobileView
          currentSol={currentSol}
          onSelectSol={setCurrentSol}
          missionData={activeMissionData}
          selectedZone={selectedZone}
          onSelectZone={setSelectedZone}
          zoneStatuses={zoneStatuses}
          currentTier={currentTier}
          delayMode={delayMode}
          onCycleDelay={cycleDelayMode}
          activeCrew={activeCrew}
          onSelectCrew={(id) => setActiveCrew(id)}
          crewRoster={crewRoster.map((c) => ({
            id: c.id,
            name: c.name,
            status: crewMeshStatusMap[c.id],
          }))}
          onOpenSANS={() => setSansExamOpen(true)}
          onOpenProcedure={() => {
            setActiveProcedure(currentTier === 2 ? "OCULAR_ULTRASOUND" : "TIER1_REST_RECOVERY");
            setProcedureModalOpen(true);
          }}
          onOpenGroundPacket={() => setPacketOpen(true)}
        />
      ) : viewMode === "WEARABLE_WATCH_HUD" ? (
        /* VIEWPORT 2: WEARABLE HUD */
        <div className="flex-1 flex flex-col items-center justify-center p-2 mb-3">
          <WearableWatchHUD
            currentSol={currentSol}
            currentMetric={currentMetric}
            selectedZone={selectedZone}
            onSelectZone={setSelectedZone}
            zoneStatuses={zoneStatuses}
            onOpenSANS={() => setSansExamOpen(true)}
            onOpenProcedure={() => {
              setActiveProcedure(currentTier === 2 ? "OCULAR_ULTRASOUND" : "TIER1_REST_RECOVERY");
              setProcedureModalOpen(true);
            }}
            onSelectSol={setCurrentSol}
            activeCrewName={crewRoster.find((c) => c.id === activeCrew)?.name}
            delayMode={delayMode}
          />
        </div>
      ) : (
        /* VIEWPORT 3: PC EXPEDITION CONSOLE */
        <div className="flex flex-col flex-1">
          {/* UNIFIED CREW MESH & SIMULATION PERTURBATION BAR */}
          <section className="glass-card px-4 py-2 mb-2.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs shadow-sm">
            <div className="flex items-center gap-2.5">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Crew Mesh:</span>
              <div className="flex flex-wrap gap-1.5">
                {crewRoster.map((crew) => {
                  const liveStatus = crewMeshStatusMap[crew.id];
                  return (
                    <button
                      key={crew.id}
                      onClick={() => setActiveCrew(crew.id)}
                      className={`px-3 py-1 rounded-full text-xs flex items-center gap-1.5 transition font-medium border ${
                        activeCrew === crew.id
                          ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                          : "bg-white/80 border-slate-200/80 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          liveStatus === "CRITICAL"
                            ? "bg-rose-500 animate-pulse"
                            : liveStatus === "ATTENTION"
                            ? "bg-amber-400"
                            : "bg-emerald-500"
                        }`}
                      />
                      <span>{crew.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* COMPACT FAULT INJECTION CONTROLLER */}
            <FaultInjectionBar
              activeFault={activeFault}
              onInject={handleInjectFault}
              onReset={handleResetFault}
              activeCrewName={crewRoster.find((c) => c.id === activeCrew)?.name || "CDR MILLER"}
              currentSol={currentSol}
            />
          </section>

          {/* 30-DAY MISSION TIMELINE SCRUBBER */}
          <section className="glass-card p-3 sm:px-4 sm:py-2.5 mb-3 rounded-2xl shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2.5 mb-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-3 py-1 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition flex items-center gap-1.5 text-xs font-semibold shadow-sm active:scale-95"
                >
                  {isPlaying ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                  <span>{isPlaying ? "Pause" : "Play"}</span>
                </button>

                <span className="text-xs font-semibold text-slate-800">
                  Mission Timeline: <span className="text-indigo-600 font-bold">Sol {currentSol}</span> / 30
                </span>
              </div>

              {/* SCENARIO MILESTONE PRESET DROPDOWN */}
              <div className="relative" ref={scenarioMenuRef}>
                <button
                  onClick={() => setScenarioMenuOpen(!scenarioMenuOpen)}
                  className="px-3 py-1 rounded-full text-xs font-medium border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 shadow-sm transition active:scale-95"
                >
                  <Target className="w-3.5 h-3.5 text-indigo-600" />
                  <span>
                    Scenario:{" "}
                    <strong className="text-slate-900">
                      {SCENARIO_PRESETS.find((p) => p.sol === currentSol)?.shortLabel || `Sol ${currentSol}`}
                    </strong>
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {scenarioMenuOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 z-40 p-1.5 text-xs animate-fadeIn">
                    <div className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                      Jump to Scenario Milestone
                    </div>
                    {SCENARIO_PRESETS.map((preset) => (
                      <button
                        key={preset.sol}
                        onClick={() => {
                          setIsPlaying(false);
                          setCurrentSol(preset.sol);
                          setScenarioMenuOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-xl flex items-center justify-between transition ${
                          currentSol === preset.sol
                            ? "bg-indigo-50 text-indigo-900 font-semibold"
                            : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <div>
                          <span className="font-medium">{preset.label}</span>
                          <p className="text-[10px] text-slate-400 font-normal">{preset.desc}</p>
                        </div>
                        {currentSol === preset.sol && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* TIMELINE SLIDER */}
            <input
              type="range"
              min="1"
              max="30"
              value={currentSol}
              onChange={(e) => {
                setIsPlaying(false);
                setCurrentSol(Number(e.target.value));
              }}
              className="w-full accent-indigo-600 bg-slate-200 cursor-pointer h-1.5 rounded-full"
            />
          </section>

          {/* MAIN 3-COLUMN CLINICAL WORKSTATION */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 mb-3">
            {/* COLUMN 1: ANATOMICAL DISPLAY (4 COLS) */}
            <div className="lg:col-span-4 flex flex-col">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Anatomy View:
                </span>
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 border border-slate-200 rounded-full">
                  <button
                    onClick={() => setConsoleLeftMode("BODY_SCAN")}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition ${
                      consoleLeftMode === "BODY_SCAN"
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Scan
                  </button>
                  <button
                    onClick={() => setConsoleLeftMode("BODY_MAP")}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition ${
                      consoleLeftMode === "BODY_MAP"
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Vector
                  </button>
                  <button
                    onClick={() => setConsoleLeftMode("GLYPH")}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition ${
                      consoleLeftMode === "GLYPH"
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    7-Dot
                  </button>
                </div>
              </div>

              {consoleLeftMode === "BODY_SCAN" ? (
                <BodyScanView
                  currentMetric={currentMetric}
                  currentSol={currentSol}
                  zoneStatuses={zoneStatuses}
                  onSelectZone={setSelectedZone}
                  selectedZone={selectedZone}
                  activeCrewName={crewRoster.find((c) => c.id === activeCrew)?.name}
                  activeCrewId={activeCrew}
                />
              ) : consoleLeftMode === "BODY_MAP" ? (
                <BodyMap
                  selectedZone={selectedZone}
                  onSelectZone={setSelectedZone}
                  zoneStatuses={zoneStatuses}
                />
              ) : (
                <div className="glass-card rounded-3xl p-5 flex flex-col items-center justify-center flex-1 shadow-sm">
                  <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-3">
                    7-Dot Constellation Glyph
                  </span>
                  <ConstellationGlyph
                    selectedZone={selectedZone}
                    onSelectZone={setSelectedZone}
                    zoneStatuses={zoneStatuses}
                  />
                </div>
              )}
            </div>

            {/* COLUMN 2: INDICATOR DETAIL & DRIFT REASONING (4 COLS) */}
            <div className="lg:col-span-4">
              <IndicatorDetail
                currentSol={currentSol}
                missionData={activeMissionData}
                selectedZone={selectedZone}
                activeCrewId={activeCrew}
                onExecuteRemeasure={handleExecuteRemeasure}
              />
            </div>

            {/* COLUMN 3: ESCALATION LADDER (4 COLS) */}
            <div className="lg:col-span-4">
              <EscalationLadder
                currentTier={currentTier}
                delayMode={delayMode}
                onTriggerAction={(tier) => {
                  setActiveProcedure(
                    tier === 2
                      ? "OCULAR_ULTRASOUND"
                      : selectedZone === "NEURO_BEHAVIORAL"
                      ? "CIRCADIAN_LIGHTING"
                      : "TIER1_REST_RECOVERY"
                  );
                  setProcedureModalOpen(true);
                }}
                onOpenGroundPacket={() => setPacketOpen(true)}
                conservativeEscalationActive={conservativeEscalationActive}
                onExecuteRemeasure={handleExecuteRemeasure}
                queuedPacketsCount={queuedDossiers.length}
              />
            </div>
          </div>
        </div>
      )}

      {/* FOOTER WITH COMPREHENSIVE DISCLAIMER */}
      <footer className="glass-card rounded-2xl px-5 py-3 flex flex-wrap items-center justify-between text-xs text-slate-400 shadow-sm mt-auto gap-2">
        <div className="flex items-center gap-3">
          <span>Active Operator: <strong className="text-slate-800 font-semibold">{activeCrew.replace("_", " ")}</strong></span>
          <span className="text-slate-200">|</span>
          <span>Display Profile: <strong className="text-indigo-600 font-semibold">{viewMode}</strong></span>
          <span className="text-slate-200">|</span>
          <span>Engine: <strong className="text-slate-700 font-semibold">CUSUM + EWMA Live Drift</strong></span>
        </div>
        <div>
          <span>NASA Human Research Program (HRP) Compliant • Decision-Support Only • Synthetic Data</span>
        </div>
      </footer>

      {/* MODALS */}
      <FlightSurgeonPacketModal
        isOpen={packetOpen}
        onClose={() => setPacketOpen(false)}
        currentSol={currentSol}
        missionData={activeMissionData}
        activeCrewId={activeCrew}
        delayMode={delayMode}
        onQueueDossier={handleQueueDossier}
      />

      <SANSExamModal
        isOpen={sansExamOpen}
        onClose={() => setSansExamOpen(false)}
        onExamComplete={(result) => {
          setSansExamResult(result);
          setSelectedZone("CRANIAL_SANS");
        }}
      />

      <MedicalProcedureModal
        isOpen={procedureModalOpen}
        onClose={() => setProcedureModalOpen(false)}
        procedureType={activeProcedure}
        onComplete={(title) => {
          setProcedureCompletionLog(`Logged: ${title} on Sol ${currentSol}`);
          setTimeout(() => setProcedureCompletionLog(null), 4000);
        }}
      />
    </div>
  );
}

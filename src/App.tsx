import { useState, useEffect, useRef } from "react";
import {
  Play,
  Square,
  FileText,
  Wifi,
  WifiOff,
  Eye,
  Watch,
  Monitor,
  Smartphone,
  Users,
  Activity,
} from "lucide-react";
import { AnatomicalZone, HealthStatus, EscalationTier } from "./types/mission";
import { MOCK_30_DAY_MISSION } from "./data/mock30DayMission";
import { BodyMap } from "./components/BodyMap";
import { ConstellationGlyph } from "./components/ConstellationGlyph";
import { IndicatorDetail } from "./components/IndicatorDetail";
import { EscalationLadder } from "./components/EscalationLadder";
import { FlightSurgeonPacketModal } from "./components/FlightSurgeonPacketModal";
import { SANSExamModal, SANSExamResult } from "./components/SANSExamModal";
import { WearableWatchHUD } from "./components/WearableWatchHUD";
import { MobileView } from "./components/MobileView";
import { MedicalProcedureModal } from "./components/MedicalProcedureModal";

type CrewMemberId = "CDR_MILLER" | "PLT_CHEN" | "ENG_KOWALSKI" | "SCI_VANCE";

interface CrewMemberInfo {
  id: CrewMemberId;
  name: string;
  role: string;
  status: HealthStatus;
  primaryAlert?: string;
}

export default function App() {
  // Current Sol (Day 1 to 30)
  const [currentSol, setCurrentSol] = useState<number>(18);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const playTimerRef = useRef<number | null>(null);

  // Selected anatomical zone
  const [selectedZone, setSelectedZone] = useState<AnatomicalZone>("CARDIOVASCULAR");

  // Delay mode: LEO real-time vs Deep-Space Mars 20m lag
  const [delayMode, setDelayMode] = useState<"LEO_REALTIME" | "MARS_20M_DELAY">("MARS_20M_DELAY");

  // View mode: Full PC console vs Mobile Handheld vs Minimalist Wearable HUD
  const [viewMode, setViewMode] = useState<"EXPEDITION_CONSOLE" | "MOBILE_PAD" | "WEARABLE_WATCH_HUD">("EXPEDITION_CONSOLE");

  // Console Left Panel Mode: Full Anatomical Map vs 7-Dot Glyph
  const [consoleLeftMode, setConsoleLeftMode] = useState<"BODY_MAP" | "GLYPH">("BODY_MAP");

  // Active crew member selector
  const [activeCrew, setActiveCrew] = useState<CrewMemberId>("CDR_MILLER");

  // Flight surgeon packet modal
  const [packetOpen, setPacketOpen] = useState<boolean>(false);

  // SANS Ocular Exam modal & result
  const [sansExamOpen, setSansExamOpen] = useState<boolean>(false);
  const [sansExamResult, setSansExamResult] = useState<SANSExamResult | null>(null);

  // Medical procedure step-by-step modal
  const [procedureModalOpen, setProcedureModalOpen] = useState<boolean>(false);
  const [activeProcedure, setActiveProcedure] = useState<"LBNP_CHAPS" | "OCULAR_ULTRASOUND" | "CIRCADIAN_LIGHTING">("LBNP_CHAPS");

  // Crew roster
  const crewRoster: CrewMemberInfo[] = [
    { id: "CDR_MILLER", name: "CDR MILLER", role: "Mission Commander", status: "CRITICAL", primaryAlert: "BP 142/92 // Sol 18 Drift" },
    { id: "PLT_CHEN", name: "PLT CHEN", role: "Lunar/Mars Pilot", status: "NOMINAL", primaryAlert: "Baseline 116/74 // Nominal" },
    { id: "ENG_KOWALSKI", name: "ENG KOWALSKI", role: "Flight Engineer", status: "NOMINAL", primaryAlert: "Sleep 7.1h // Nominal" },
    { id: "SCI_VANCE", name: "SCI VANCE", role: "Science Specialist", status: "ATTENTION", primaryAlert: "Sleep 5.8h // Mild Debt" },
  ];

  // Current metric for active Sol (Miller's profile)
  const currentMetric = MOCK_30_DAY_MISSION[currentSol - 1] || MOCK_30_DAY_MISSION[0];

  // Dynamic zone statuses computed from currentSol telemetry
  const computeZoneStatuses = (): Record<AnatomicalZone, HealthStatus> => {
    if (activeCrew !== "CDR_MILLER") {
      return {
        CARDIOVASCULAR: activeCrew === "SCI_VANCE" ? "ATTENTION" : "NOMINAL",
        CRANIAL_SANS: "NOMINAL",
        NEURO_BEHAVIORAL: activeCrew === "SCI_VANCE" ? "ATTENTION" : "NOMINAL",
        MUSCULOSKELETAL: "NOMINAL",
        IMMUNE_METABOLIC: "NOMINAL",
      };
    }

    const isCriticalBP = currentMetric.systolicBP >= 140;
    const isWarnBP = currentMetric.systolicBP >= 128;
    const isSevereSleep = currentMetric.sleepHours < 5.0;
    const isWarnSleep = currentMetric.sleepHours < 6.5;

    const sansStatus: HealthStatus = sansExamResult
      ? sansExamResult.sansStage === "STAGE_2_MODERATE"
        ? "CRITICAL"
        : sansExamResult.sansStage === "STAGE_1_MILD"
        ? "ATTENTION"
        : "NOMINAL"
      : isCriticalBP
      ? "ATTENTION"
      : "NOMINAL";

    return {
      CARDIOVASCULAR: isCriticalBP ? "CRITICAL" : isWarnBP ? "ATTENTION" : "NOMINAL",
      CRANIAL_SANS: sansStatus,
      NEURO_BEHAVIORAL: isSevereSleep ? "CRITICAL" : isWarnSleep ? "ATTENTION" : "NOMINAL",
      MUSCULOSKELETAL: currentSol > 20 ? "ATTENTION" : "NOMINAL",
      IMMUNE_METABOLIC: currentMetric.bloodSugar > 115 ? "ATTENTION" : "NOMINAL",
    };
  };

  const zoneStatuses = computeZoneStatuses();

  // Active escalation tier
  const currentTier: EscalationTier =
    currentMetric.systolicBP >= 140 || currentMetric.sleepHours < 4.5
      ? 2
      : currentMetric.systolicBP >= 128 || currentMetric.sleepHours < 6.0
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

  return (
    <div className="min-h-screen text-slate-100 p-2 sm:p-4 flex flex-col justify-between font-mono select-none antialiased">
      {/* APEX HEADER WITH MULTI-DISPLAY SELECTOR & DELAY-MODE TOGGLES */}
      <header className="glass-panel px-4 py-2.5 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs mb-3 shadow-[0_0_30px_rgba(6,182,212,0.08)]">
        <div className="flex items-center gap-3">
          <span className="h-2.5 w-2.5 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee] animate-pulse" />
          <span className="font-bold tracking-widest text-white uppercase text-sm">
            AEGIS // BIO-FBW
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>

          {/* VIEW MODE TOGGLE (PC CONSOLE vs MOBILE vs WEARABLE) */}
          <div className="flex items-center gap-1 bg-black/80 p-0.5 border border-cyan-500/30 rounded-lg">
            <button
              onClick={() => setViewMode("EXPEDITION_CONSOLE")}
              className={`px-2.5 py-1 text-[10px] rounded flex items-center gap-1 transition ${
                viewMode === "EXPEDITION_CONSOLE"
                  ? "bg-cyan-950 text-cyan-200 font-bold border border-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.3)]"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <Monitor className="w-3 h-3" />
              <span className="hidden md:inline">PC CONSOLE</span>
              <span className="md:hidden">PC</span>
            </button>
            <button
              onClick={() => setViewMode("MOBILE_PAD")}
              className={`px-2.5 py-1 text-[10px] rounded flex items-center gap-1 transition ${
                viewMode === "MOBILE_PAD"
                  ? "bg-cyan-950 text-cyan-200 font-bold border border-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.3)]"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <Smartphone className="w-3 h-3" />
              <span>MOBILE</span>
            </button>
            <button
              onClick={() => setViewMode("WEARABLE_WATCH_HUD")}
              className={`px-2.5 py-1 text-[10px] rounded flex items-center gap-1 transition ${
                viewMode === "WEARABLE_WATCH_HUD"
                  ? "bg-cyan-950 text-cyan-200 font-bold border border-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.3)]"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <Watch className="w-3 h-3" />
              <span className="hidden md:inline">WEARABLE HUD</span>
              <span className="md:hidden">WATCH</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-[11px]">
          {/* DELAY-MODE TOGGLE */}
          <button
            onClick={() =>
              setDelayMode(delayMode === "MARS_20M_DELAY" ? "LEO_REALTIME" : "MARS_20M_DELAY")
            }
            className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold flex items-center gap-1.5 transition ${
              delayMode === "MARS_20M_DELAY"
                ? "bg-amber-950/80 border-amber-500 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                : "bg-cyan-950/80 border-cyan-500 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
            }`}
          >
            {delayMode === "MARS_20M_DELAY" ? (
              <>
                <WifiOff className="w-3 h-3 text-amber-400" />
                <span>MARS 20m LAG</span>
              </>
            ) : (
              <>
                <Wifi className="w-3 h-3 text-cyan-400" />
                <span>LEO REAL-TIME</span>
              </>
            )}
          </button>

          {/* SANS OCULAR EXAM BUTTON */}
          <button
            onClick={() => setSansExamOpen(true)}
            className="flex items-center gap-1.5 bg-cyan-950/80 border border-cyan-500 hover:border-cyan-400 text-cyan-200 px-2.5 py-1 rounded-lg text-[10px] transition font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)]"
          >
            <Eye className="w-3 h-3 text-cyan-400" />
            <span className="hidden sm:inline">SANS EXAM</span>
          </button>

          {/* PROCEDURE GUIDE BUTTON */}
          <button
            onClick={() => {
              setActiveProcedure(currentTier === 2 ? "OCULAR_ULTRASOUND" : "LBNP_CHAPS");
              setProcedureModalOpen(true);
            }}
            className="flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-500 hover:border-emerald-400 text-emerald-200 px-2.5 py-1 rounded-lg text-[10px] transition font-bold shadow-[0_0_10px_rgba(16,185,129,0.2)]"
          >
            <Activity className="w-3 h-3 text-emerald-400" />
            <span className="hidden sm:inline">PROCEDURES</span>
          </button>

          {/* FLIGHT SURGEON DOSSIER BUTTON */}
          <button
            onClick={() => setPacketOpen(true)}
            className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 hover:border-cyan-400 text-cyan-300 px-2.5 py-1 rounded-lg text-[10px] transition"
          >
            <FileText className="w-3 h-3 text-cyan-400" />
            <span className="hidden sm:inline">GROUND DOSSIER</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* VIEWPORT 1: MOBILE COMM-PAD VIEW */}
      {/* ========================================================================= */}
      {viewMode === "MOBILE_PAD" ? (
        <MobileView
          currentSol={currentSol}
          onSelectSol={setCurrentSol}
          missionData={MOCK_30_DAY_MISSION}
          selectedZone={selectedZone}
          onSelectZone={setSelectedZone}
          zoneStatuses={zoneStatuses}
          currentTier={currentTier}
          delayMode={delayMode}
          onToggleDelay={() =>
            setDelayMode(delayMode === "MARS_20M_DELAY" ? "LEO_REALTIME" : "MARS_20M_DELAY")
          }
          activeCrew={activeCrew}
          onSelectCrew={(id) => setActiveCrew(id as CrewMemberId)}
          crewRoster={crewRoster}
          onOpenSANS={() => setSansExamOpen(true)}
          onOpenProcedure={() => {
            setActiveProcedure(currentTier === 2 ? "OCULAR_ULTRASOUND" : "LBNP_CHAPS");
            setProcedureModalOpen(true);
          }}
          onOpenGroundPacket={() => setPacketOpen(true)}
        />
      ) : viewMode === "WEARABLE_WATCH_HUD" ? (
        /* ========================================================================= */
        /* VIEWPORT 2: WEARABLE HUD (RECTANGULAR CUFF & CIRCULAR BEZEL MODES) */
        /* ========================================================================= */
        <div className="flex-1 flex flex-col items-center justify-center p-2 mb-3">
          <WearableWatchHUD
            currentSol={currentSol}
            currentMetric={currentMetric}
            selectedZone={selectedZone}
            onSelectZone={setSelectedZone}
            zoneStatuses={zoneStatuses}
            onOpenSANS={() => setSansExamOpen(true)}
            onOpenProcedure={() => {
              setActiveProcedure(currentTier === 2 ? "OCULAR_ULTRASOUND" : "LBNP_CHAPS");
              setProcedureModalOpen(true);
            }}
            onSelectSol={setCurrentSol}
            activeCrewName={crewRoster.find((c) => c.id === activeCrew)?.name}
            delayMode={delayMode}
          />
        </div>
      ) : (
        /* ========================================================================= */
        /* VIEWPORT 3: PC EXPEDITION CONSOLE (FULL 3-COLUMN GLASS COCKPIT) */
        /* ========================================================================= */
        <div className="flex flex-col flex-1">
          {/* MULTI-ASTRONAUT CREW MESH BAR */}
          <section className="glass-panel px-3.5 py-2 mb-3 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">CREW MESH:</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {crewRoster.map((crew) => (
                <button
                  key={crew.id}
                  onClick={() => setActiveCrew(crew.id)}
                  className={`px-2.5 py-1 rounded-lg border text-[10px] flex items-center gap-1.5 transition ${
                    activeCrew === crew.id
                      ? "bg-cyan-950 border-cyan-400 text-cyan-100 font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                      : "bg-black/60 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      crew.status === "CRITICAL"
                        ? "bg-rose-500 animate-pulse"
                        : crew.status === "ATTENTION"
                        ? "bg-amber-400"
                        : "bg-emerald-400"
                    }`}
                  />
                  <span>{crew.name}</span>
                  <span className="text-[9px] text-slate-500">({crew.primaryAlert})</span>
                </button>
              ))}
            </div>
          </section>

          {/* 30-DAY MISSION TIMELINE SCRUBBER (RUBRIC SCENARIO PRESETS) */}
          <section className="glass-panel p-3 mb-3 rounded-xl">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1 rounded border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 bg-black/80 flex items-center gap-1 text-[10px] px-2.5 shadow-[0_0_8px_rgba(6,182,212,0.2)]"
                >
                  {isPlaying ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                  <span>{isPlaying ? "HALT" : "PLAY TIMELINE"}</span>
                </button>

                <span className="text-xs font-bold text-white">
                  MISSION PROGRESSION: <span className="text-cyan-400">SOL {currentSol}</span> / 30
                </span>
              </div>

              {/* SCRIPTED EVENT JUMP BUTTONS */}
              <div className="flex flex-wrap gap-1.5 text-[9px]">
                <button
                  onClick={() => { setIsPlaying(false); setCurrentSol(1); }}
                  className={`px-2 py-0.5 rounded border transition ${currentSol === 1 ? "bg-cyan-950 text-cyan-300 border-cyan-500 font-bold shadow-[0_0_8px_rgba(6,182,212,0.3)]" : "bg-black/60 text-slate-400 border-slate-800"}`}
                >
                  SOL 1: BASELINE
                </button>
                <button
                  onClick={() => { setIsPlaying(false); setCurrentSol(8); }}
                  className={`px-2 py-0.5 rounded border transition ${currentSol === 8 ? "bg-amber-950 text-amber-300 border-amber-500 font-bold shadow-[0_0_8px_rgba(245,158,11,0.3)]" : "bg-black/60 text-slate-400 border-slate-800"}`}
                >
                  SOL 8: SENSOR GLITCH
                </button>
                <button
                  onClick={() => { setIsPlaying(false); setCurrentSol(18); }}
                  className={`px-2 py-0.5 rounded border transition ${currentSol === 18 ? "bg-amber-950 text-amber-300 border-amber-500 font-bold shadow-[0_0_8px_rgba(245,158,11,0.3)]" : "bg-black/60 text-slate-400 border-slate-800"}`}
                >
                  SOL 18: SLEEP DECLINE
                </button>
                <button
                  onClick={() => { setIsPlaying(false); setCurrentSol(23); }}
                  className={`px-2 py-0.5 rounded border transition ${currentSol === 23 ? "bg-rose-950 text-rose-300 border-rose-500 font-bold shadow-[0_0_10px_rgba(244,63,94,0.3)] animate-pulse" : "bg-black/60 text-slate-400 border-slate-800"}`}
                >
                  SOL 23: BP SPIKE & TIER 1
                </button>
                <button
                  onClick={() => { setIsPlaying(false); setCurrentSol(28); }}
                  className={`px-2 py-0.5 rounded border transition ${currentSol === 28 ? "bg-emerald-950 text-emerald-300 border-emerald-500 font-bold shadow-[0_0_8px_rgba(16,185,129,0.3)]" : "bg-black/60 text-slate-400 border-slate-800"}`}
                >
                  SOL 28: GROUND DOSSIER
                </button>
              </div>
            </div>

            {/* INTERACTIVE TIMELINE SLIDER */}
            <input
              type="range"
              min="1"
              max="30"
              value={currentSol}
              onChange={(e) => {
                setIsPlaying(false);
                setCurrentSol(Number(e.target.value));
              }}
              className="w-full accent-cyan-400 bg-slate-900 cursor-pointer h-1.5 rounded-lg"
            />
          </section>

          {/* MAIN 3-COLUMN CLINICAL HUD */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 mb-3">
            {/* COLUMN 1: INTERACTIVE BODY MAP & GLYPH TOGGLE (3 COLS) */}
            <div className="lg:col-span-3 flex flex-col">
              <div className="flex items-center justify-between mb-1.5 px-1 text-[10px]">
                <span className="text-slate-400 font-bold uppercase">ANATOMY DISPLAY:</span>
                <div className="flex items-center gap-1 bg-black/60 p-0.5 border border-slate-800 rounded">
                  <button
                    onClick={() => setConsoleLeftMode("BODY_MAP")}
                    className={`px-1.5 py-0.5 rounded text-[9px] transition ${
                      consoleLeftMode === "BODY_MAP"
                        ? "bg-cyan-950 text-cyan-300 font-bold"
                        : "text-slate-500"
                    }`}
                  >
                    VECTOR
                  </button>
                  <button
                    onClick={() => setConsoleLeftMode("GLYPH")}
                    className={`px-1.5 py-0.5 rounded text-[9px] transition ${
                      consoleLeftMode === "GLYPH"
                        ? "bg-cyan-950 text-cyan-300 font-bold"
                        : "text-slate-500"
                    }`}
                  >
                    7-DOT GLYPH
                  </button>
                </div>
              </div>

              {consoleLeftMode === "BODY_MAP" ? (
                <BodyMap
                  selectedZone={selectedZone}
                  onSelectZone={setSelectedZone}
                  zoneStatuses={zoneStatuses}
                />
              ) : (
                <div className="glass-panel rounded-xl p-4 flex flex-col items-center justify-center flex-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-3">
                    7-DOT CONSTELLATION GLYPH
                  </span>
                  <ConstellationGlyph
                    selectedZone={selectedZone}
                    onSelectZone={setSelectedZone}
                    zoneStatuses={zoneStatuses}
                  />
                </div>
              )}
            </div>

            {/* COLUMN 2: INDICATOR DETAIL & 30-DAY TREND CHARTS (5 COLS) */}
            <div className="lg:col-span-5">
              <IndicatorDetail
                currentSol={currentSol}
                missionData={MOCK_30_DAY_MISSION}
                selectedZone={selectedZone}
              />
            </div>

            {/* COLUMN 3: THE ESCALATION LADDER (4 COLS) */}
            <div className="lg:col-span-4">
              <EscalationLadder
                currentTier={currentTier}
                delayMode={delayMode}
                onTriggerAction={(tier) => {
                  setActiveProcedure(tier === 2 ? "OCULAR_ULTRASOUND" : "LBNP_CHAPS");
                  setProcedureModalOpen(true);
                }}
                onOpenGroundPacket={() => setPacketOpen(true)}
              />
            </div>
          </div>
        </div>
      )}

      {/* FOOTER AUDIT BANNER */}
      <footer className="glass-panel px-4 py-2 rounded-xl flex flex-wrap items-center justify-between text-[10px] text-slate-400 shadow-[0_0_20px_rgba(6,182,212,0.05)]">
        <div className="flex items-center gap-3">
          <span>ACTIVE CREW: <strong className="text-white">{activeCrew.replace("_", " ")}</strong></span>
          <span className="text-slate-600">|</span>
          <span>DISPLAY MODE: <strong className="text-cyan-400">{viewMode}</strong></span>
        </div>
        <div>
          <span>NASA HUMAN RESEARCH PROGRAM (HRP) COMPLIANT // ARTEMIS READY</span>
        </div>
      </footer>

      {/* FLIGHT SURGEON DOSSIER MODAL */}
      <FlightSurgeonPacketModal
        isOpen={packetOpen}
        onClose={() => setPacketOpen(false)}
        currentSol={currentSol}
        missionData={MOCK_30_DAY_MISSION}
      />

      {/* SANS OCULAR EXAM MODAL */}
      <SANSExamModal
        isOpen={sansExamOpen}
        onClose={() => setSansExamOpen(false)}
        onExamComplete={(result) => {
          setSansExamResult(result);
          setSelectedZone("CRANIAL_SANS");
        }}
      />

      {/* ANIMATED MEDICAL PROCEDURE GUIDE MODAL */}
      <MedicalProcedureModal
        isOpen={procedureModalOpen}
        onClose={() => setProcedureModalOpen(false)}
        procedureType={activeProcedure}
        onComplete={() => {
          alert("Procedure completed and logged to mission medical telemetry.");
        }}
      />
    </div>
  );
}

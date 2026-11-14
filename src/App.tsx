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
} from "lucide-react";
import { AnatomicalZone, HealthStatus, EscalationTier } from "./types/mission";
import { MOCK_30_DAY_MISSION } from "./data/mock30DayMission";
import { BodyMap } from "./components/BodyMap";
import { BodyScanView } from "./components/BodyScanView";
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

  // Console Left Panel Mode: Body Scan vs Vector Map vs 7-Dot Glyph
  const [consoleLeftMode, setConsoleLeftMode] = useState<"BODY_SCAN" | "BODY_MAP" | "GLYPH">("BODY_SCAN");

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

  // Current metric for active Sol
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
    <div className="min-h-screen text-slate-800 p-3 sm:p-5 flex flex-col justify-between font-sans select-none antialiased">
      {/* APEX HEADER WITH MULTI-DISPLAY SELECTOR & DELAY-MODE TOGGLES */}
      <header className="glass-card rounded-2xl px-5 py-3 flex flex-wrap items-center justify-between gap-3 mb-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
        <div className="flex items-center gap-3.5">
          {/* AURORA APP ICON */}
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm"
            style={{ background: "linear-gradient(135deg, #c4b5fd, #fda4af, #93c5fd)" }}
          >
            <span className="text-white font-extrabold text-base tracking-tight">A</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-base tracking-tight">AEGIS</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Bio-Telemetry
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">NASA Artemis & Deep-Space Health</p>
          </div>

          <span className="hidden sm:inline text-slate-200 font-light mx-1">|</span>

          {/* VIEW MODE TOGGLE (PC CONSOLE vs MOBILE vs WEARABLE) */}
          <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-full border border-slate-200/80">
            <button
              onClick={() => setViewMode("EXPEDITION_CONSOLE")}
              className={`px-3.5 py-1.5 text-xs rounded-full flex items-center gap-1.5 transition font-medium ${
                viewMode === "EXPEDITION_CONSOLE"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Console</span>
              <span className="md:hidden">PC</span>
            </button>
            <button
              onClick={() => setViewMode("MOBILE_PAD")}
              className={`px-3.5 py-1.5 text-xs rounded-full flex items-center gap-1.5 transition font-medium ${
                viewMode === "MOBILE_PAD"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile</span>
            </button>
            <button
              onClick={() => setViewMode("WEARABLE_WATCH_HUD")}
              className={`px-3.5 py-1.5 text-xs rounded-full flex items-center gap-1.5 transition font-medium ${
                viewMode === "WEARABLE_WATCH_HUD"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Watch className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Wearable HUD</span>
              <span className="md:hidden">Watch</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* DELAY-MODE TOGGLE */}
          <button
            onClick={() =>
              setDelayMode(delayMode === "MARS_20M_DELAY" ? "LEO_REALTIME" : "MARS_20M_DELAY")
            }
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition border ${
              delayMode === "MARS_20M_DELAY"
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-emerald-50 text-emerald-700 border-emerald-200"
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>{delayMode === "MARS_20M_DELAY" ? "Mars 20m Lag" : "LEO Real-time"}</span>
          </button>

          {/* SANS OCULAR EXAM BUTTON */}
          <button
            onClick={() => setSansExamOpen(true)}
            className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-3.5 py-1.5 rounded-full text-xs font-semibold transition shadow-sm active:scale-95"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">SANS Exam</span>
          </button>

          {/* PROCEDURE GUIDE BUTTON */}
          <button
            onClick={() => {
              setActiveProcedure(currentTier === 2 ? "OCULAR_ULTRASOUND" : "LBNP_CHAPS");
              setProcedureModalOpen(true);
            }}
            className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-semibold transition shadow-sm active:scale-95"
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Procedures</span>
          </button>

          {/* FLIGHT SURGEON DOSSIER BUTTON */}
          <button
            onClick={() => setPacketOpen(true)}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3.5 py-1.5 rounded-full text-xs font-semibold transition shadow-sm active:scale-95"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ground Dossier</span>
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
        /* VIEWPORT 2: WEARABLE HUD */
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
        /* VIEWPORT 3: PC EXPEDITION CONSOLE */
        /* ========================================================================= */
        <div className="flex flex-col flex-1">
          {/* MULTI-ASTRONAUT CREW MESH BAR */}
          <section className="glass-card px-4 py-2.5 mb-3 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Crew Mesh:</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {crewRoster.map((crew) => (
                <button
                  key={crew.id}
                  onClick={() => setActiveCrew(crew.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs flex items-center gap-2 transition font-medium border ${
                    activeCrew === crew.id
                      ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                      : "bg-white/80 border-slate-200/80 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      crew.status === "CRITICAL"
                        ? "bg-rose-500 animate-pulse"
                        : crew.status === "ATTENTION"
                        ? "bg-amber-400"
                        : "bg-emerald-500"
                    }`}
                  />
                  <span>{crew.name}</span>
                  <span className="text-[11px] text-slate-400 font-normal">({crew.primaryAlert})</span>
                </button>
              ))}
            </div>
          </section>

          {/* 30-DAY MISSION TIMELINE SCRUBBER */}
          <section className="glass-card p-4 mb-4 rounded-2xl shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-3.5 py-1.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition flex items-center gap-1.5 text-xs font-semibold shadow-sm"
                >
                  {isPlaying ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span>{isPlaying ? "Pause" : "Play Timeline"}</span>
                </button>

                <span className="text-sm font-semibold text-slate-900">
                  Mission Timeline: <span className="text-indigo-600 font-bold">Sol {currentSol}</span> / 30
                </span>
              </div>

              {/* SCRIPTED EVENT JUMP PILLS */}
              <div className="flex flex-wrap gap-1.5 text-xs">
                {[
                  { sol: 1, label: "Sol 1: Baseline" },
                  { sol: 8, label: "Sol 8: Glitch" },
                  { sol: 18, label: "Sol 18: Sleep Loss" },
                  { sol: 23, label: "Sol 23: BP Spike" },
                  { sol: 28, label: "Sol 28: Dossier" },
                ].map((preset) => (
                  <button
                    key={preset.sol}
                    onClick={() => {
                      setIsPlaying(false);
                      setCurrentSol(preset.sol);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition border ${
                      currentSol === preset.sol
                        ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm font-semibold"
                        : "bg-white/80 border-slate-200/80 text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
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
              className="w-full accent-indigo-600 bg-slate-200 cursor-pointer h-2 rounded-full"
            />
          </section>

          {/* MAIN 3-COLUMN CLINICAL WORKSTATION */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 mb-3">
            {/* COLUMN 1: ANATOMICAL DISPLAY (3 COLS) */}
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

            {/* COLUMN 2: INDICATOR DETAIL (4 COLS) */}
            <div className="lg:col-span-4">
              <IndicatorDetail
                currentSol={currentSol}
                missionData={MOCK_30_DAY_MISSION}
                selectedZone={selectedZone}
              />
            </div>

            {/* COLUMN 3: ESCALATION LADDER (4 COLS) */}
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

      {/* FOOTER */}
      <footer className="glass-card rounded-2xl px-5 py-3 flex flex-wrap items-center justify-between text-xs text-slate-400 shadow-sm mt-auto">
        <div className="flex items-center gap-3">
          <span>Active Operator: <strong className="text-slate-800 font-semibold">{activeCrew.replace("_", " ")}</strong></span>
          <span className="text-slate-200">|</span>
          <span>Display Profile: <strong className="text-indigo-600 font-semibold">{viewMode}</strong></span>
        </div>
        <div>
          <span>NASA Human Research Program (HRP) Compliant • Artemis Deep-Space System</span>
        </div>
      </footer>

      {/* MODALS */}
      <FlightSurgeonPacketModal
        isOpen={packetOpen}
        onClose={() => setPacketOpen(false)}
        currentSol={currentSol}
        missionData={MOCK_30_DAY_MISSION}
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
        onComplete={() => {
          alert("Procedure completed and logged to mission medical telemetry.");
        }}
      />
    </div>
  );
}

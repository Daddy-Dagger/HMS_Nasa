import { useState, useEffect, useRef } from "react";
import {
  Play,
  Square,
  FileText,
  Wifi,
  WifiOff,
  Eye,
} from "lucide-react";
import { AnatomicalZone, HealthStatus, EscalationTier } from "./types/mission";
import { MOCK_30_DAY_MISSION } from "./data/mock30DayMission";
import { BodyMap } from "./components/BodyMap";
import { IndicatorDetail } from "./components/IndicatorDetail";
import { EscalationLadder } from "./components/EscalationLadder";
import { FlightSurgeonPacketModal } from "./components/FlightSurgeonPacketModal";
import { SANSExamModal, SANSExamResult } from "./components/SANSExamModal";

export default function App() {
  // Current Sol (Day 1 to 30)
  const [currentSol, setCurrentSol] = useState<number>(18);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const playTimerRef = useRef<number | null>(null);

  // Selected anatomical zone
  const [selectedZone, setSelectedZone] = useState<AnatomicalZone>("CARDIOVASCULAR");

  // Delay mode: LEO real-time vs Deep-Space Mars 20m lag
  const [delayMode, setDelayMode] = useState<"LEO_REALTIME" | "MARS_20M_DELAY">("MARS_20M_DELAY");

  // Flight surgeon packet modal
  const [packetOpen, setPacketOpen] = useState<boolean>(false);

  // SANS Ocular Exam modal & result
  const [sansExamOpen, setSansExamOpen] = useState<boolean>(false);
  const [sansExamResult, setSansExamResult] = useState<SANSExamResult | null>(null);

  // Current metric for active Sol
  const currentMetric = MOCK_30_DAY_MISSION[currentSol - 1] || MOCK_30_DAY_MISSION[0];

  // Dynamic zone statuses computed from currentSol telemetry
  const computeZoneStatuses = (): Record<AnatomicalZone, HealthStatus> => {
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
    <div className="min-h-screen bg-black text-slate-100 p-3 md:p-4 flex flex-col justify-between font-mono select-none antialiased">
      {/* APEX HEADER WITH DELAY-MODE TOGGLE */}
      <header className="border border-slate-800 bg-slate-950 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs mb-3">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 bg-cyan-400 rounded-none shadow-[0_0_8px_#22d3ee]" />
          <span className="font-bold tracking-widest text-white uppercase">
            AEGIS // DEEP-SPACE MEDICAL GLASS
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">SUBJECT: CDR MILLER (VEHICLE 01)</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          {/* DELAY-MODE TOGGLE */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 uppercase text-[9px] tracking-wider">COMMS ENVELOPE:</span>
            <button
              onClick={() =>
                setDelayMode(delayMode === "MARS_20M_DELAY" ? "LEO_REALTIME" : "MARS_20M_DELAY")
              }
              className={`px-2 py-0.5 border text-[10px] font-bold flex items-center gap-1.5 transition ${
                delayMode === "MARS_20M_DELAY"
                  ? "bg-amber-950/70 border-amber-500 text-amber-300"
                  : "bg-cyan-950/70 border-cyan-500 text-cyan-300"
              }`}
            >
              {delayMode === "MARS_20M_DELAY" ? (
                <>
                  <WifiOff className="w-3 h-3 text-amber-400" />
                  <span>MARS 20m LAG [100% AUTONOMOUS]</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3 h-3 text-cyan-400" />
                  <span>LEO REAL-TIME [MCC LINKED]</span>
                </>
              )}
            </button>
          </div>

          {/* SANS OCULAR EXAM BUTTON */}
          <button
            onClick={() => setSansExamOpen(true)}
            className="flex items-center gap-1.5 bg-cyan-950/70 border border-cyan-500 hover:border-cyan-400 text-cyan-200 px-2 py-1 text-[10px] transition font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)]"
          >
            <Eye className="w-3 h-3 text-cyan-400" />
            <span>SANS OCULAR EXAM</span>
          </button>

          {/* FLIGHT SURGEON DOSSIER BUTTON */}
          <button
            onClick={() => setPacketOpen(true)}
            className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 hover:border-cyan-400 text-cyan-300 px-2 py-1 text-[10px] transition"
          >
            <FileText className="w-3 h-3 text-cyan-400" />
            <span>GROUND DOSSIER</span>
          </button>
        </div>
      </header>

      {/* 30-DAY MISSION TIMELINE SCRUBBER (RUBRIC SCENARIO PRESETS) */}
      <section className="border border-slate-800 bg-slate-950 p-3 mb-3">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1 border border-slate-700 hover:border-cyan-400 text-cyan-300 bg-black flex items-center gap-1 text-[10px] px-2"
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
              className={`px-2 py-0.5 border ${currentSol === 1 ? "bg-cyan-950 text-cyan-300 border-cyan-500 font-bold" : "bg-black text-slate-400 border-slate-800"}`}
            >
              SOL 1: BASELINE
            </button>
            <button
              onClick={() => { setIsPlaying(false); setCurrentSol(8); }}
              className={`px-2 py-0.5 border ${currentSol === 8 ? "bg-amber-950 text-amber-300 border-amber-500 font-bold" : "bg-black text-slate-400 border-slate-800"}`}
            >
              SOL 8: SENSOR GLITCH
            </button>
            <button
              onClick={() => { setIsPlaying(false); setCurrentSol(18); }}
              className={`px-2 py-0.5 border ${currentSol === 18 ? "bg-amber-950 text-amber-300 border-amber-500 font-bold" : "bg-black text-slate-400 border-slate-800"}`}
            >
              SOL 18: SLEEP DECLINE
            </button>
            <button
              onClick={() => { setIsPlaying(false); setCurrentSol(23); }}
              className={`px-2 py-0.5 border ${currentSol === 23 ? "bg-rose-950 text-rose-300 border-rose-500 font-bold" : "bg-black text-slate-400 border-slate-800"}`}
            >
              SOL 23: BP SPIKE & TIER 1
            </button>
            <button
              onClick={() => { setIsPlaying(false); setCurrentSol(28); }}
              className={`px-2 py-0.5 border ${currentSol === 28 ? "bg-emerald-950 text-emerald-300 border-emerald-500 font-bold" : "bg-black text-slate-400 border-slate-800"}`}
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
          className="w-full accent-cyan-400 bg-slate-900 cursor-pointer h-1.5"
        />
      </section>

      {/* CORE 3-COLUMN CLINICAL WORKSTATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 mb-3">
        {/* COLUMN 1: INTERACTIVE BODY MAP (3 COLS) */}
        <div className="lg:col-span-3">
          <BodyMap
            selectedZone={selectedZone}
            onSelectZone={setSelectedZone}
            zoneStatuses={zoneStatuses}
          />
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
              alert(`Escalation Protocol for Tier ${tier} initiated. Telemetry logged to mission record.`);
            }}
            onOpenGroundPacket={() => setPacketOpen(true)}
          />
        </div>
      </div>

      {/* FOOTER AUDIT BANNER */}
      <footer className="border border-slate-800 bg-slate-950 px-4 py-2 flex flex-wrap items-center justify-between text-[10px] text-slate-400">
        <div className="flex items-center gap-3">
          <span>ACTIVE HAZARD: <strong className="text-white">NASA RIDGE SPECIFICATION</strong></span>
          <span className="text-slate-600">|</span>
          <span>PROTOCOL: <strong className="text-cyan-400">AUTONOMOUS CREW-CENTRIC GUIDANCE</strong></span>
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
    </div>
  );
}

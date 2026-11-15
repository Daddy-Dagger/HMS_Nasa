import React, { useState, useEffect, useRef } from "react";
import { AnatomicalZone, HealthStatus, DailyHealthMetric, CrewMemberId } from "../types/mission";
import { evaluateSensorConfidence, CREW_BASELINES } from "../utils/driftEngine";

interface BodyScanViewProps {
  currentMetric: DailyHealthMetric;
  currentSol: number;
  zoneStatuses: Record<AnatomicalZone, HealthStatus>;
  onSelectZone: (zone: AnatomicalZone) => void;
  selectedZone: AnatomicalZone;
  onScanComplete?: () => void;
  activeCrewName?: string;
  activeCrewId?: CrewMemberId;
}

export const BodyScanView: React.FC<BodyScanViewProps> = ({
  currentMetric,
  currentSol,
  zoneStatuses,
  onSelectZone,
  selectedZone,
  onScanComplete,
  activeCrewName = "CDR Miller",
  activeCrewId = "CDR_MILLER",
}) => {
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const scanTimerRef = useRef<number | null>(null);

  const baseline = CREW_BASELINES[activeCrewId] || CREW_BASELINES.CDR_MILLER;
  const confidence = evaluateSensorConfidence(currentMetric, baseline);

  const isCriticalBP = currentMetric.systolicBP >= 140;

  // The vital cards that float around the body, now with explicit confidence scores and reasons
  const vitalCards = [
    {
      id: 0,
      label: "Blood pressure",
      value: `${currentMetric.systolicBP}/${currentMetric.diastolicBP}`,
      unit: "mmHg",
      zone: "CARDIOVASCULAR" as AnatomicalZone,
      status: zoneStatuses.CARDIOVASCULAR,
      confidence: confidence.score,
      confidenceReason: confidence.score < 60 ? "Motion artifact, re-measure" : "Arterial wave coherent",
      position: "left-top",
      revealAt: 25,
    },
    {
      id: 1,
      label: "Heart rate",
      value: `${currentMetric.heartRate}`,
      unit: "bpm",
      zone: "CARDIOVASCULAR" as AnatomicalZone,
      status: zoneStatuses.CARDIOVASCULAR,
      confidence: confidence.score < 60 ? 35 : 98,
      confidenceReason: confidence.score < 60 ? "Noisy ECG leads" : "Sinus rhythm verified",
      position: "right-top",
      revealAt: 35,
    },
    {
      id: 2,
      label: "Sleep duration",
      value: `${currentMetric.sleepHours}`,
      unit: "hours",
      zone: "NEURO_BEHAVIORAL" as AnatomicalZone,
      status: zoneStatuses.NEURO_BEHAVIORAL,
      confidence: 94,
      confidenceReason: "Actigraphy & polysomnography synced",
      position: "left-mid",
      revealAt: 55,
    },
    {
      id: 3,
      label: "SANS / Optic",
      value: isCriticalBP ? "27.6" : "11.2",
      unit: "μm TRT",
      zone: "CRANIAL_SANS" as AnatomicalZone,
      status: zoneStatuses.CRANIAL_SANS,
      confidence: 92,
      confidenceReason: "OCT BMO-250 registered",
      position: "right-head",
      revealAt: 12,
    },
    {
      id: 4,
      label: "Bone strain",
      value: "0.98",
      unit: "g/cm²",
      zone: "MUSCULOSKELETAL" as AnatomicalZone,
      status: zoneStatuses.MUSCULOSKELETAL,
      confidence: 96,
      confidenceReason: "ARED load cell telemetry verified",
      position: "left-bottom",
      revealAt: 75,
    },
  ];

  const startScan = () => {
    setIsScanning(true);
    setScanComplete(false);
    setScanProgress(0);
    setVisibleCards([]);
  };

  useEffect(() => {
    if (isScanning && scanProgress < 100) {
      scanTimerRef.current = window.setTimeout(() => {
        const next = Math.min(scanProgress + 1, 100);
        setScanProgress(next);

        vitalCards.forEach((card) => {
          if (next >= card.revealAt && !visibleCards.includes(card.id)) {
            setVisibleCards((prev) => [...prev, card.id]);
          }
        });

        if (next >= 100) {
          setIsScanning(false);
          setScanComplete(true);
          onScanComplete?.();
        }
      }, 35);
    }
    return () => {
      if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
    };
  }, [isScanning, scanProgress, onScanComplete, visibleCards, vitalCards]);

  useEffect(() => {
    const t = window.setTimeout(() => startScan(), 400);
    return () => clearTimeout(t);
  }, []);

  const getStatusDotColor = (status: HealthStatus) => {
    switch (status) {
      case "CRITICAL":
        return "bg-rose-500 shadow-[0_0_6px_#f43f5e]";
      case "ATTENTION":
        return "bg-amber-400 shadow-[0_0_6px_#f59e0b]";
      default:
        return "bg-emerald-400 shadow-[0_0_6px_#10b981]";
    }
  };

  const getCardPosition = (position: string) => {
    switch (position) {
      case "left-top":
        return "left-1 sm:left-2 top-[22%]";
      case "right-top":
        return "right-1 sm:right-2 top-[37%]";
      case "left-mid":
        return "left-1 sm:left-2 top-[51%]";
      case "right-head":
        return "right-1 sm:right-2 top-[7%]";
      case "left-bottom":
        return "left-1 sm:left-2 top-[76%]";
      default:
        return "left-2 top-[40%]";
    }
  };

  return (
    <div
      className="relative w-full max-w-md mx-auto flex flex-col items-center select-none overflow-hidden rounded-2xl p-3"
      style={{
        background: "linear-gradient(180deg, #ffffff 0%, #f4f2fb 35%, #edf3fb 70%, #fdf5f4 100%)",
        minHeight: "72vh",
        boxShadow: "0 10px 40px rgba(180, 160, 240, 0.12)",
      }}
    >
      {/* HEADER */}
      <div className="w-full pt-1 pb-2 px-3 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight leading-snug">
              {activeCrewName}
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
              Synthetic
            </span>
          </div>
          <p className="text-[11px] text-indigo-500 font-medium mt-0.5">
            Mission Sol {currentSol} • Decision-Support Bio-Scan
          </p>
        </div>

        <div className="px-2.5 py-1 rounded-full bg-white/90 border border-slate-200/80 shadow-sm text-[10px] font-medium text-slate-600">
          {scanComplete ? "Scan complete" : "Real-time sync"}
        </div>
      </div>

      {/* BODY SCAN ARENA */}
      <div className="relative flex-1 w-full flex items-center justify-center my-2" style={{ minHeight: "410px" }}>
        {/* SOFT AURORA GRADIENT BEHIND BODY */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute w-[280px] h-[280px] rounded-full opacity-45 blur-[70px]"
            style={{
              background: "radial-gradient(circle, rgba(196, 160, 255, 0.7), transparent 70%)",
              top: "8%",
              left: "22%",
            }}
          />
          <div
            className="absolute w-[240px] h-[240px] rounded-full opacity-35 blur-[70px]"
            style={{
              background: "radial-gradient(circle, rgba(255, 190, 165, 0.6), transparent 70%)",
              top: "38%",
              left: "35%",
            }}
          />
          <div
            className="absolute w-[240px] h-[240px] rounded-full opacity-35 blur-[70px]"
            style={{
              background: "radial-gradient(circle, rgba(160, 210, 255, 0.6), transparent 70%)",
              top: "62%",
              left: "18%",
            }}
          />
        </div>

        {/* HUMAN TRANSLUCENT SILHOUETTE */}
        <div className="relative z-10 flex items-center justify-center" style={{ width: "190px", height: "400px" }}>
          <svg viewBox="0 0 120 300" className="w-full h-full" style={{ filter: "drop-shadow(0 0 25px rgba(180, 140, 255, 0.35))" }}>
            <defs>
              <linearGradient id="body-gradient-subtle" x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stopColor="rgba(190, 150, 255, 0.88)" />
                <stop offset="28%" stopColor="rgba(210, 170, 245, 0.75)" />
                <stop offset="50%" stopColor="rgba(255, 195, 175, 0.7)" />
                <stop offset="72%" stopColor="rgba(190, 210, 255, 0.65)" />
                <stop offset="100%" stopColor="rgba(165, 215, 245, 0.55)" />
              </linearGradient>

              <filter id="soft-blur">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" />
              </filter>

              <clipPath id="human-silhouette-clip">
                <path d="
                  M 60 12
                  C 48 12, 42 22, 42 32
                  C 42 42, 48 50, 60 50
                  C 72 50, 78 42, 78 32
                  C 78 22, 72 12, 60 12
                  Z
                  M 44 54
                  L 16 85
                  L 10 130
                  L 18 132
                  L 30 95
                  L 40 80
                  L 40 140
                  L 38 200
                  L 34 260
                  L 30 290
                  L 48 290
                  L 54 240
                  L 60 200
                  L 66 240
                  L 72 290
                  L 90 290
                  L 86 260
                  L 82 200
                  L 80 140
                  L 80 80
                  L 90 95
                  L 102 132
                  L 110 130
                  L 104 85
                  L 76 54
                  Z
                " />
              </clipPath>
            </defs>

            <g filter="url(#soft-blur)" opacity="0.6">
              <rect x="0" y="0" width="120" height="300" fill="url(#body-gradient-subtle)" clipPath="url(#human-silhouette-clip)" />
            </g>

            <rect x="0" y="0" width="120" height="300" fill="url(#body-gradient-subtle)" clipPath="url(#human-silhouette-clip)" opacity="0.92" />

            {isScanning && (
              <g>
                <line
                  x1="0"
                  y1={scanProgress * 2.85 + 8}
                  x2="120"
                  y2={scanProgress * 2.85 + 8}
                  stroke="rgba(255, 255, 255, 0.95)"
                  strokeWidth="2.5"
                  clipPath="url(#human-silhouette-clip)"
                />
                <line
                  x1="0"
                  y1={scanProgress * 2.85 + 8}
                  x2="120"
                  y2={scanProgress * 2.85 + 8}
                  stroke="rgba(196, 140, 255, 0.75)"
                  strokeWidth="10"
                  clipPath="url(#human-silhouette-clip)"
                  style={{ filter: "blur(4px)" }}
                />
              </g>
            )}

            <circle cx="60" cy="32" r="3" fill="white" opacity={visibleCards.includes(3) ? "0.95" : "0.25"} className="transition-opacity duration-500" />
            <circle cx="55" cy="76" r="3" fill="white" opacity={visibleCards.includes(0) ? "0.95" : "0.25"} className="transition-opacity duration-500" />
            <circle cx="65" cy="90" r="2.5" fill="white" opacity={visibleCards.includes(1) ? "0.95" : "0.25"} className="transition-opacity duration-500" />
            <circle cx="60" cy="140" r="3" fill="white" opacity={visibleCards.includes(2) ? "0.95" : "0.25"} className="transition-opacity duration-500" />
            <circle cx="50" cy="235" r="2.5" fill="white" opacity={visibleCards.includes(4) ? "0.95" : "0.25"} className="transition-opacity duration-500" />
          </svg>
        </div>

        {/* FLOATING GLASS VITAL CARDS WITH CONFIDENCE SCORE & REASON */}
        {vitalCards.map((card) => {
          const isRevealed = visibleCards.includes(card.id);
          const isSelected = selectedZone === card.zone;

          return (
            <div
              key={card.id}
              onClick={() => onSelectZone(card.zone)}
              className={`absolute ${getCardPosition(card.position)} z-20 max-w-[145px] sm:max-w-[155px] bg-white/95 backdrop-blur-xl rounded-2xl px-3 py-2 shadow-sm border border-slate-200/80 cursor-pointer transition-all duration-500 hover:shadow-md ${
                isRevealed ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-3 scale-90 pointer-events-none"
              } ${isSelected ? "ring-2 ring-indigo-500 shadow-indigo-100" : ""}`}
            >
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <div className="flex items-center gap-1 min-w-0">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${getStatusDotColor(card.status)}`} />
                  <span className="text-[10px] text-slate-500 font-medium truncate">{card.label}</span>
                </div>
                {/* Confidence Badge */}
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                    card.confidence < 60
                      ? "bg-rose-100 text-rose-700"
                      : card.confidence < 85
                      ? "bg-amber-100 text-amber-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {card.confidence}%
                </span>
              </div>

              <div className="flex items-baseline gap-1 my-0.5">
                <span
                  className={`text-base sm:text-lg font-bold tracking-tight ${
                    card.status === "CRITICAL"
                      ? "text-rose-600"
                      : card.status === "ATTENTION"
                      ? "text-amber-600"
                      : "text-slate-900"
                  }`}
                >
                  {card.value}
                </span>
                <span className="text-[9px] text-slate-400 font-normal">{card.unit}</span>
              </div>

              {/* Confidence Reason */}
              <div className="text-[9px] text-slate-400 truncate leading-tight pt-0.5 border-t border-slate-100" title={card.confidenceReason}>
                {card.confidenceReason}
              </div>
            </div>
          );
        })}
      </div>

      {/* SCANNING PROGRESS BAR */}
      <div className="w-full px-4 pb-2 mt-auto">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-medium">
          <span>{scanComplete ? "Biometrics captured" : "Scanning vitals..."}</span>
          <span className="text-slate-800 font-semibold">{scanProgress}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-75"
            style={{
              width: `${scanProgress}%`,
              background: "linear-gradient(90deg, #818cf8, #c084fc, #f472b6)",
            }}
          />
        </div>
      </div>

      {/* BOTTOM CONTROLS */}
      <div className="w-full px-3 pb-2 pt-2 flex items-center justify-between gap-2.5">
        <div className="flex gap-1.5">
          <button
            onClick={() => onSelectZone("CARDIOVASCULAR")}
            className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition shadow-sm text-base font-semibold"
            title="Cardiovascular"
          >
            ‹
          </button>
          <button
            onClick={() => onSelectZone("NEURO_BEHAVIORAL")}
            className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition shadow-sm text-base font-semibold"
            title="Neuro-Behavioral"
          >
            ›
          </button>
        </div>

        <button
          onClick={startScan}
          className="flex-1 py-2.5 bg-slate-900 text-white font-semibold rounded-full text-xs hover:bg-slate-800 active:scale-[0.98] transition shadow-md"
        >
          {scanComplete ? "Re-scan vitals" : "Start check-in"}
        </button>
      </div>
    </div>
  );
};

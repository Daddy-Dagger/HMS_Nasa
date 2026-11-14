import React, { useState, useEffect } from "react";
import { Eye, CheckCircle2, ArrowRight, X } from "lucide-react";

interface SANSExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExamComplete: (result: SANSExamResult) => void;
}

export interface SANSExamResult {
  hyperopicShiftDiopters: number;
  choroidalFoldDistortions: number;
  sansStage: "STAGE_0_NOMINAL" | "STAGE_1_MILD" | "STAGE_2_MODERATE";
  acuityScore: string;
  recommendedAction: string;
}

export const SANSExamModal: React.FC<SANSExamModalProps> = ({
  isOpen,
  onClose,
  onExamComplete,
}) => {
  const [stage, setStage] = useState<number>(1);
  const [distortedCells, setDistortedCells] = useState<number[]>([]);
  const [acuityStep, setAcuityStep] = useState<number>(0);
  const [targetDirection, setTargetDirection] = useState<"UP" | "DOWN" | "LEFT" | "RIGHT">("RIGHT");
  const [acuityErrors, setAcuityErrors] = useState<number>(0);

  const directions: ("UP" | "DOWN" | "LEFT" | "RIGHT")[] = ["UP", "DOWN", "LEFT", "RIGHT"];

  const nextAcuityTarget = () => {
    const randomDir = directions[Math.floor(Math.random() * directions.length)];
    setTargetDirection(randomDir);
  };

  useEffect(() => {
    if (stage === 3) {
      nextAcuityTarget();
    }
  }, [stage]);

  if (!isOpen) return null;

  const toggleCell = (index: number) => {
    if (distortedCells.includes(index)) {
      setDistortedCells(distortedCells.filter((i) => i !== index));
    } else {
      setDistortedCells([...distortedCells, index]);
    }
  };

  const handleAcuityChoice = (chosen: "UP" | "DOWN" | "LEFT" | "RIGHT") => {
    if (chosen !== targetDirection) {
      setAcuityErrors((prev) => prev + 1);
    }

    if (acuityStep < 4) {
      setAcuityStep((prev) => prev + 1);
      nextAcuityTarget();
    } else {
      setStage(4);
    }
  };

  const calculateResults = (): SANSExamResult => {
    const hyperopicShift = +(0.5 + acuityErrors * 0.35).toFixed(2);
    const folds = distortedCells.length;

    let sansStage: "STAGE_0_NOMINAL" | "STAGE_1_MILD" | "STAGE_2_MODERATE" = "STAGE_0_NOMINAL";
    let acuityScore = "20/20";
    let recommendedAction = "Nominal refraction. Maintain daily aerobic countermeasures.";

    if (folds >= 3 || hyperopicShift >= 1.5) {
      sansStage = "STAGE_2_MODERATE";
      acuityScore = "20/40";
      recommendedAction =
        "Prescription: +1.50D Space Glasses issued. Daily LBNP chaps session (-35 mmHg for 30m) to alleviate retrobulbar CSF pressure. Queue fundus exam.";
    } else if (folds >= 1 || hyperopicShift >= 0.75) {
      sansStage = "STAGE_1_MILD";
      acuityScore = "20/25";
      recommendedAction =
        "Subclinical hyperopic drift detected. Issue +0.75D reading glasses. Monitor with weekly Amsler battery.";
    }

    return {
      hyperopicShiftDiopters: hyperopicShift,
      choroidalFoldDistortions: folds,
      sansStage,
      acuityScore,
      recommendedAction,
    };
  };

  const finalResult = calculateResults();

  const handleFinish = () => {
    onExamComplete(finalResult);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 font-sans select-none animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 text-sm space-y-4 shadow-2xl border border-slate-100">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">
                SANS Ocular Examination
              </h3>
              <p className="text-xs text-slate-400 font-medium">Autonomous Refraction & Grid Check</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STAGE 1: INTRO */}
        {stage === 1 && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
              <span className="font-semibold text-slate-800 block text-sm">
                NASA SANS Autonomous Protocol
              </span>
              <p className="text-slate-600 leading-relaxed">
                70% of long-duration spaceflight crew develop <strong>Spaceflight-Associated Neuro-ocular Syndrome (SANS)</strong>. In interplanetary transit, astronauts must test their own vision autonomously.
              </p>
              <div className="text-slate-500 space-y-1 pt-1">
                <div>• <strong>Phase A: Amsler Grid Test</strong> (Metamorphopsia & Choroidal Fold Undulations).</div>
                <div>• <strong>Phase B: Dynamic Tumbling-E Acuity</strong> (Near-Point Hyperopic Shift in Diopters).</div>
              </div>
            </div>

            <button
              onClick={() => setStage(2)}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-full flex items-center justify-center gap-2 transition shadow-md active:scale-95"
            >
              <span>Begin Phase A: Amsler Grid Check</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STAGE 2: AMSLER GRID */}
        {stage === 2 && (
          <div className="space-y-4 text-center">
            <div className="text-left text-xs text-slate-600">
              <span className="font-semibold text-slate-900 block mb-0.5 text-sm">Phase A: Amsler Grid</span>
              <span>Keep your eyes fixed on the center dot. Click any square where lines appear wavy, distorted, or missing.</span>
            </div>

            {/* 5x5 GRID */}
            <div className="inline-grid grid-cols-5 gap-1 bg-slate-200 p-2 rounded-2xl border border-slate-300 mx-auto shadow-inner">
              {Array.from({ length: 25 }).map((_, i) => {
                const isCenter = i === 12;
                const isSelected = distortedCells.includes(i);
                return (
                  <div
                    key={i}
                    onClick={() => !isCenter && toggleCell(i)}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                      isCenter
                        ? "bg-white cursor-default"
                        : isSelected
                        ? "bg-rose-100 border border-rose-300 text-rose-700 font-bold cursor-pointer"
                        : "bg-white hover:bg-slate-50 border border-slate-100 cursor-pointer shadow-sm"
                    }`}
                  >
                    {isCenter && <div className="w-3 h-3 bg-indigo-600 rounded-full animate-ping" />}
                    {isSelected && <span className="text-[10px] text-rose-600 font-bold">WAVY</span>}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center text-xs text-slate-500 pt-1">
              <span>Distortions Marked: <strong className="text-rose-600">{distortedCells.length}</strong></span>
              <button
                onClick={() => setStage(3)}
                className="py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-full flex items-center gap-1.5 transition shadow-sm active:scale-95"
              >
                <span>Proceed to Phase B (Acuity)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STAGE 3: TUMBLING E */}
        {stage === 3 && (
          <div className="space-y-4 text-center">
            <div className="text-left text-xs text-slate-600">
              <span className="font-semibold text-slate-900 block mb-0.5 text-sm">
                Phase B: Dynamic Tumbling-E [Trial {acuityStep + 1} of 5]
              </span>
              <span>Identify the opening direction of the letter "E". Click the matching directional button below.</span>
            </div>

            <div className="h-36 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-center">
              <div
                className={`font-black text-slate-900 transition-all ${
                  acuityStep === 0
                    ? "text-6xl"
                    : acuityStep === 1
                    ? "text-5xl"
                    : acuityStep === 2
                    ? "text-4xl"
                    : acuityStep === 3
                    ? "text-2xl"
                    : "text-lg"
                }`}
                style={{
                  transform:
                    targetDirection === "UP"
                      ? "rotate(-90deg)"
                      : targetDirection === "DOWN"
                      ? "rotate(90deg)"
                      : targetDirection === "LEFT"
                      ? "scaleX(-1)"
                      : "rotate(0deg)",
                }}
              >
                E
              </div>
            </div>

            {/* DIRECTIONAL BUTTONS */}
            <div className="grid grid-cols-4 gap-2">
              {(["UP", "DOWN", "LEFT", "RIGHT"] as const).map((dir) => (
                <button
                  key={dir}
                  onClick={() => handleAcuityChoice(dir)}
                  className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl transition text-xs shadow-sm active:scale-95"
                >
                  {dir === "UP" ? "▲ UP" : dir === "DOWN" ? "▼ DOWN" : dir === "LEFT" ? "◀ LEFT" : "▶ RIGHT"}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STAGE 4: RESULTS */}
        {stage === 4 && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-semibold text-slate-900 text-sm">Diagnostic Assessment</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    finalResult.sansStage === "STAGE_0_NOMINAL"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : finalResult.sansStage === "STAGE_1_MILD"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-rose-50 text-rose-700 border-rose-200"
                  }`}
                >
                  {finalResult.sansStage.replace(/_/g, " ")}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5 py-1">
                <div className="p-2.5 bg-white rounded-xl border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 font-medium block">Hyperopic Shift</span>
                  <span className="text-base font-bold text-indigo-600">+{finalResult.hyperopicShiftDiopters.toFixed(2)} D</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 font-medium block">Choroidal Folds</span>
                  <span className={`text-base font-bold ${finalResult.choroidalFoldDistortions > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                    {finalResult.choroidalFoldDistortions > 0 ? `${finalResult.choroidalFoldDistortions} Sectors` : "None"}
                  </span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 font-medium block">Near Acuity</span>
                  <span className="text-base font-bold text-slate-900">{finalResult.acuityScore}</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1">
                <div className="font-semibold text-slate-800 text-xs">Prescription Countermeasure:</div>
                <div className="text-slate-600 leading-relaxed text-xs">{finalResult.recommendedAction}</div>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-full flex items-center justify-center gap-2 transition shadow-md active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Log SANS Result to Mission Telemetry</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from "react";
import { Eye, CheckCircle2, ArrowRight } from "lucide-react";

interface SANSExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExamComplete: (result: SANSExamResult) => void;
}

export interface SANSExamResult {
  hyperopicShiftDiopters: number; // e.g. +1.25 D
  choroidalFoldDistortions: number; // Count of marked distortions
  sansStage: "STAGE_0_NOMINAL" | "STAGE_1_MILD" | "STAGE_2_MODERATE";
  acuityScore: string; // e.g. "20/40"
  recommendedAction: string;
}

export const SANSExamModal: React.FC<SANSExamModalProps> = ({
  isOpen,
  onClose,
  onExamComplete,
}) => {
  // Exam Stages: 1: Introduction, 2: Amsler Grid (Choroidal folds), 3: Tumbling E Acuity (Refraction), 4: Results
  const [stage, setStage] = useState<number>(1);

  // Amsler Grid Distortions (array of grid cell indices 0 to 24)
  const [distortedCells, setDistortedCells] = useState<number[]>([]);

  // Tumbling E Acuity Test State
  const [acuityStep, setAcuityStep] = useState<number>(0);
  const [targetDirection, setTargetDirection] = useState<"UP" | "DOWN" | "LEFT" | "RIGHT">("RIGHT");
  const [acuityErrors, setAcuityErrors] = useState<number>(0);

  // Directions array
  const directions: ("UP" | "DOWN" | "LEFT" | "RIGHT")[] = ["UP", "DOWN", "LEFT", "RIGHT"];

  // Randomize Tumbling E direction
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

  // Handle Amsler cell toggle
  const toggleCell = (index: number) => {
    if (distortedCells.includes(index)) {
      setDistortedCells(distortedCells.filter((i) => i !== index));
    } else {
      setDistortedCells([...distortedCells, index]);
    }
  };

  // Handle Tumbling E input
  const handleAcuityChoice = (chosen: "UP" | "DOWN" | "LEFT" | "RIGHT") => {
    let errors = acuityErrors;
    if (chosen !== targetDirection) {
      errors += 1;
      setAcuityErrors(errors);
    }

    if (acuityStep >= 4) {
      // Completed acuity steps (5 trials total)
      setStage(4);
    } else {
      setAcuityStep((prev) => prev + 1);
      nextAcuityTarget();
    }
  };

  // Calculate diagnostic result
  const calculateResult = (): SANSExamResult => {
    const shift = acuityErrors === 0 ? 0.25 : acuityErrors <= 2 ? 1.0 : 1.75;
    const hasFolds = distortedCells.length > 0;

    let sansStage: "STAGE_0_NOMINAL" | "STAGE_1_MILD" | "STAGE_2_MODERATE" = "STAGE_0_NOMINAL";
    if (shift >= 1.5 || distortedCells.length >= 3) {
      sansStage = "STAGE_2_MODERATE";
    } else if (shift >= 0.75 || hasFolds) {
      sansStage = "STAGE_1_MILD";
    }

    const acuityScore =
      acuityErrors === 0 ? "20/20" : acuityErrors <= 2 ? "20/40" : "20/60";

    const recommendedAction =
      sansStage === "STAGE_2_MODERATE"
        ? "Prescribe adjustable focal Space Glasses (+1.75 D) & initiate LBNP chaps -35 mmHg protocol."
        : sansStage === "STAGE_1_MILD"
        ? "Equip +0.75 D near-vision readers for checklist tasks; queue CMO fundoscopy."
        : "Visual acuity within nominal spaceflight envelope. No intervention required.";

    return {
      hyperopicShiftDiopters: shift,
      choroidalFoldDistortions: distortedCells.length,
      sansStage,
      acuityScore,
      recommendedAction,
    };
  };

  const finalResult = calculateResult();

  const handleFinish = () => {
    onExamComplete(finalResult);
    onClose();
    // Reset state
    setStage(1);
    setDistortedCells([]);
    setAcuityStep(0);
    setAcuityErrors(0);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-mono select-none">
      <div className="bg-black border border-cyan-500/80 max-w-xl w-full p-5 text-xs space-y-4 shadow-[0_0_35px_rgba(6,182,212,0.25)]">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs tracking-wider">
            <Eye className="w-4 h-4 text-cyan-400" />
            <span>IN-FLIGHT SANS OCULAR EXAM // AUTONOMOUS CLINICAL GAMIFICATION</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white text-xs px-2 py-0.5 border border-slate-800"
          >
            [ABORT / ESC]
          </button>
        </div>

        {/* STAGE 1: INTRO & RATIONALE */}
        {stage === 1 && (
          <div className="space-y-3">
            <div className="p-3 bg-slate-950 border border-slate-800 space-y-2 text-[11px]">
              <span className="text-cyan-400 font-bold block uppercase tracking-wider">
                NASA SANS Operational Evidence Protocol
              </span>
              <p className="text-slate-300 leading-relaxed">
                70% of long-duration spaceflight crew develop <strong>Spaceflight-Associated Neuro-ocular Syndrome (SANS)</strong>. In interplanetary transit, astronauts lack MRI machines and must test their own vision autonomously.
              </p>
              <div className="text-slate-400 text-[10px] space-y-1">
                <div>• <strong>Phase A: Amsler Grid Test</strong> (Metamorphopsia & Choroidal Fold Undulations).</div>
                <div>• <strong>Phase B: Dynamic Tumbling-E Acuity</strong> (Near-Point Hyperopic Refractive Shift in Diopters).</div>
              </div>
            </div>

            <button
              onClick={() => setStage(2)}
              className="w-full py-2.5 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500 text-cyan-200 font-bold text-xs flex items-center justify-center gap-2 transition tracking-wider uppercase"
            >
              <span>BEGIN PHASE A: AMSLER GRID CHECK</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* STAGE 2: AMSLER GRID TEST (CHOROIDAL FOLD DETECTION) */}
        {stage === 2 && (
          <div className="space-y-3 text-center">
            <div className="text-left text-[11px] text-slate-300">
              <span className="text-cyan-400 font-bold block mb-0.5">PHASE A: AMSLER GRID (METAMORPHOPSIA CHECK)</span>
              <span>Keep your eyes fixed on the center cyan dot. Click any grid square where lines appear wavy, distorted, or blurred.</span>
            </div>

            {/* 5x5 INTERACTIVE AMSLER GRID */}
            <div className="inline-grid grid-cols-5 gap-0.5 bg-slate-800 p-1 border border-slate-700 mx-auto">
              {Array.from({ length: 25 }).map((_, i) => {
                const isCenter = i === 12;
                const isSelected = distortedCells.includes(i);
                return (
                  <div
                    key={i}
                    onClick={() => !isCenter && toggleCell(i)}
                    className={`w-11 h-11 border border-slate-700/60 flex items-center justify-center transition-all ${
                      isCenter
                        ? "bg-slate-950 cursor-default"
                        : isSelected
                        ? "bg-rose-950 border-rose-500 text-rose-300 cursor-pointer"
                        : "bg-slate-950 hover:bg-slate-900 cursor-pointer"
                    }`}
                  >
                    {isCenter && <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping" />}
                    {isSelected && <span className="text-[10px] text-rose-400 font-bold">WAVY</span>}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-400">
              <span>Distortions Marked: <strong className="text-rose-400">{distortedCells.length}</strong></span>
              <button
                onClick={() => setStage(3)}
                className="py-1.5 px-3 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500 text-cyan-200 font-bold text-xs flex items-center gap-1.5 transition"
              >
                <span>PROCEED TO PHASE B (ACUITY)</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* STAGE 3: TUMBLING E DYNAMIC ACUITY TEST */}
        {stage === 3 && (
          <div className="space-y-4 text-center">
            <div className="text-left text-[11px] text-slate-300">
              <span className="text-cyan-400 font-bold block mb-0.5">
                PHASE B: DYNAMIC TUMBLING-E (REFRACTIVE SHIFT) [TRIAL {acuityStep + 1} OF 5]
              </span>
              <span>Identify the opening direction of the letter "E". Click the matching directional button below.</span>
            </div>

            {/* DYNAMIC SCALING TUMBLING E */}
            <div className="h-32 bg-slate-950 border border-slate-800 flex items-center justify-center">
              <div
                className={`font-black tracking-tighter text-cyan-300 transition-all ${
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

            {/* DIRECTIONAL INPUT BUTTONS */}
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => handleAcuityChoice("UP")}
                className="py-2 border border-slate-700 bg-slate-900 hover:border-cyan-400 text-white font-bold transition text-xs"
              >
                ▲ UP
              </button>
              <button
                onClick={() => handleAcuityChoice("DOWN")}
                className="py-2 border border-slate-700 bg-slate-900 hover:border-cyan-400 text-white font-bold transition text-xs"
              >
                ▼ DOWN
              </button>
              <button
                onClick={() => handleAcuityChoice("LEFT")}
                className="py-2 border border-slate-700 bg-slate-900 hover:border-cyan-400 text-white font-bold transition text-xs"
              >
                ◀ LEFT
              </button>
              <button
                onClick={() => handleAcuityChoice("RIGHT")}
                className="py-2 border border-slate-700 bg-slate-900 hover:border-cyan-400 text-white font-bold transition text-xs"
              >
                ▶ RIGHT
              </button>
            </div>
          </div>
        )}

        {/* STAGE 4: CLINICAL DIAGNOSTIC RESULTS */}
        {stage === 4 && (
          <div className="space-y-3">
            <div className="p-3 bg-slate-950 border border-slate-800 space-y-2 text-[11px]">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <span className="text-white font-bold uppercase">SANS DIAGNOSTIC EVALUATION</span>
                <span
                  className={`px-1.5 py-0.5 border text-[10px] font-bold ${
                    finalResult.sansStage === "STAGE_0_NOMINAL"
                      ? "bg-emerald-950 text-emerald-300 border-emerald-600"
                      : finalResult.sansStage === "STAGE_1_MILD"
                      ? "bg-amber-950 text-amber-300 border-amber-600"
                      : "bg-rose-950 text-rose-300 border-rose-600"
                  }`}
                >
                  {finalResult.sansStage.replace(/_/g, " ")}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[10px] py-1">
                <div className="p-1.5 bg-black border border-slate-800">
                  <span className="text-slate-500 block">HYPEROPIC SHIFT</span>
                  <span className="text-cyan-400 font-bold">+{finalResult.hyperopicShiftDiopters.toFixed(2)} D</span>
                </div>
                <div className="p-1.5 bg-black border border-slate-800">
                  <span className="text-slate-500 block">CHOROIDAL FOLDS</span>
                  <span className={finalResult.choroidalFoldDistortions > 0 ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>
                    {finalResult.choroidalFoldDistortions > 0 ? `${finalResult.choroidalFoldDistortions} SECTORS` : "NONE DETECTED"}
                  </span>
                </div>
                <div className="p-1.5 bg-black border border-slate-800">
                  <span className="text-slate-500 block">NEAR ACUITY</span>
                  <span className="text-white font-bold">{finalResult.acuityScore}</span>
                </div>
              </div>

              <div className="p-2 border border-slate-800 bg-black text-[10px] space-y-1">
                <div className="text-cyan-400 font-bold">PRESCRIPTION COUNTERMEASURE:</div>
                <div className="text-slate-300 leading-relaxed">{finalResult.recommendedAction}</div>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-2.5 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500 text-cyan-200 font-bold text-xs flex items-center justify-center gap-2 transition tracking-wider uppercase"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>LOG SANS EXAM RESULT TO MISSION TELEMETRY</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

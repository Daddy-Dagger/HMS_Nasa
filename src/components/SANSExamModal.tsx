import React, { useState, useEffect } from "react";
import { Eye, CheckCircle2, ArrowRight, X, ShieldAlert, Ruler } from "lucide-react";

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
  clinicalMeaning: string;
  escalationNotice: string;
}

export const SANSExamModal: React.FC<SANSExamModalProps> = ({
  isOpen,
  onClose,
  onExamComplete,
}) => {
  const [stage, setStage] = useState<number>(1);
  const [calibratedDistance, setCalibratedDistance] = useState<boolean>(false);
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
    let recommendedAction = "Nominal refraction. Maintain daily aerobic countermeasures and weekly surveillance.";
    let clinicalMeaning = "Optic nerve head morphology and near visual acuity within nominal spaceflight limits. No choroidal folding or posterior globe flattening detected.";
    let escalationNotice = "Routine surveillance: Repeat SANS exam in 7 sols. No escalation required.";

    if (folds >= 3 || hyperopicShift >= 1.5) {
      sansStage = "STAGE_2_MODERATE";
      acuityScore = "20/40";
      clinicalMeaning = `Significant hyperopic refractive shift (+${hyperopicShift}D) paired with multiple (${folds}) choroidal fold sectors. Indicates mechanical flattening of posterior sclera and elevated retrobulbar optic nerve sheath pressure.`;
      recommendedAction = "Prescription: Issue +1.50D Space Reading Glasses. Schedule CMO ocular ultrasound and LBNP chaps session (-35 mmHg for 30m) to alleviate cephalad fluid pooling.";
      escalationNotice = "⚠️ MANDATORY ESCALATION TO TIER 2 CMO PROTOCOL: Perform in-flight ocular ultrasound (ONSD threshold >5.8 mm) and fundoscopy. If visual field loss occurs, initiate Tier 3 Flight Surgeon downlink.";
    } else if (folds >= 1 || hyperopicShift >= 0.75) {
      sansStage = "STAGE_1_MILD";
      acuityScore = "20/25";
      clinicalMeaning = `Subclinical hyperopic drift (+${hyperopicShift}D) and early choroidal undulations detected. Reflects mild microgravity cephalad fluid redistribution and optic disc edema risk.`;
      recommendedAction = "Issue +0.75D Space Reading Glasses. Log daily vision symptoms and monitor with twice-weekly Amsler grid battery.";
      escalationNotice = "Watchful waiting (Tier 1): Re-test in 3 sols. Escalate to Tier 2 if hyperopic shift increases ≥0.50D or metamorphopsia worsens.";
    }

    return {
      hyperopicShiftDiopters: hyperopicShift,
      choroidalFoldDistortions: folds,
      sansStage,
      acuityScore,
      recommendedAction,
      clinicalMeaning,
      escalationNotice,
    };
  };

  const finalResult = calculateResults();

  const handleFinish = () => {
    onExamComplete(finalResult);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 font-sans select-none animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 text-sm space-y-4 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900 text-sm">
                  SANS Ocular Examination Battery
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  Decision-Support
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">NASA HRP Calibrated Visual Acuity & Amsler Grid</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STAGE 1: CALIBRATION & INTRO */}
        {stage === 1 && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 text-xs">
              <span className="font-semibold text-slate-900 block text-sm">
                Pre-Exam Sanity Check & Calibration
              </span>
              <p className="text-slate-600 leading-relaxed">
                70% of long-duration spaceflight crew develop <strong>Spaceflight-Associated Neuro-ocular Syndrome (SANS)</strong>. For accurate measurement, viewing geometry and optotype visual angles must be calibrated:
              </p>

              {/* CALIBRATION GUIDE BOX */}
              <div className="p-3 bg-white rounded-xl border border-indigo-100 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-indigo-950 text-xs">
                  <Ruler className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Viewing Distance & Optotype Scaling:</span>
                </div>
                <div className="space-y-1 text-[11px] text-slate-600 leading-relaxed">
                  <div>• <strong>Standard Near-Point Distance:</strong> Position screen exactly <strong>40 cm (16 inches)</strong> from eyes.</div>
                  <div>• <strong>Optotype Subtense:</strong> 20/20 Snellen optotype subtends exactly <strong>5 arcminutes (0.083°)</strong> at 40 cm.</div>
                  <div>• <strong>Display Scaling:</strong> Verify credit card / crew badge fits reference frame below:</div>
                </div>

                <div className="w-full py-2 px-3 border border-dashed border-indigo-300 rounded-lg flex items-center justify-between bg-indigo-50/40 text-[11px] text-indigo-900 font-mono">
                  <span>[◄ Standard ID / Flight Badge Width: 85.6 mm ►]</span>
                  <button
                    onClick={() => setCalibratedDistance(true)}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition ${
                      calibratedDistance
                        ? "bg-emerald-600 text-white"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                    }`}
                  >
                    {calibratedDistance ? "✓ Calibrated at 40 cm" : "Confirm 40 cm Distance"}
                  </button>
                </div>
              </div>

              <div className="text-slate-500 space-y-1 pt-1">
                <div>• <strong>Phase A: Amsler Grid Test</strong> (Metamorphopsia & Choroidal Fold Undulations).</div>
                <div>• <strong>Phase B: Tumbling-E Acuity</strong> (Hyperopic Refractive Shift in Diopters).</div>
              </div>
            </div>

            <button
              onClick={() => setStage(2)}
              disabled={!calibratedDistance}
              className={`w-full py-3 font-semibold text-xs rounded-full flex items-center justify-center gap-2 transition shadow-md active:scale-95 ${
                calibratedDistance
                  ? "bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              <span>{calibratedDistance ? "Begin Phase A: Amsler Grid Check" : "Please Confirm 40 cm Distance Above"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STAGE 2: AMSLER GRID */}
        {stage === 2 && (
          <div className="space-y-4 text-center">
            <div className="text-left text-xs text-slate-600">
              <span className="font-semibold text-slate-900 block mb-0.5 text-sm">Phase A: Amsler Grid Check</span>
              <span>Keep your gaze fixed on the center blinking dot. Click any square where grid lines appear wavy, distorted, or blurred (choroidal folds).</span>
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
                <span>Proceed to Phase B (Calibrated Acuity)</span>
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
              <span>Hold screen at 40 cm. Identify opening direction of letter "E". Click matching directional button below.</span>
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

        {/* STAGE 4: COMPREHENSIVE RESULTS & ESCALATION CRITERIA */}
        {stage === 4 && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-semibold text-slate-900 text-sm">Diagnostic Assessment & Sanity Check</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    finalResult.sansStage === "STAGE_0_NOMINAL"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : finalResult.sansStage === "STAGE_1_MILD"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-rose-50 text-rose-700 border-rose-200 animate-pulse"
                  }`}
                >
                  {finalResult.sansStage.replace(/_/g, " ")}
                </span>
              </div>

              {/* 3 STATS */}
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
                  <span className="text-[10px] text-slate-400 font-medium block">Near Acuity (40 cm)</span>
                  <span className="text-base font-bold text-slate-900">{finalResult.acuityScore}</span>
                </div>
              </div>

              {/* WHAT THE RESULT MEANS */}
              <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1">
                <div className="font-semibold text-slate-800 text-xs">What This Result Means:</div>
                <div className="text-slate-600 leading-relaxed text-xs">{finalResult.clinicalMeaning}</div>
              </div>

              {/* PRESCRIPTION COUNTERMEASURE */}
              <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1">
                <div className="font-semibold text-slate-800 text-xs">Prescription & Action:</div>
                <div className="text-slate-600 leading-relaxed text-xs">{finalResult.recommendedAction}</div>
              </div>

              {/* WHEN TO ESCALATE */}
              <div className={`p-3 rounded-xl border space-y-1 ${
                finalResult.sansStage === "STAGE_2_MODERATE"
                  ? "bg-rose-50 border-rose-200 text-rose-950"
                  : "bg-indigo-50 border-indigo-200 text-indigo-950"
              }`}>
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>Clinical Escalation Protocol:</span>
                </div>
                <div className="leading-relaxed text-xs">{finalResult.escalationNotice}</div>
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

import React, { useState, useEffect } from "react";
import { CheckCircle2, ChevronRight, ChevronLeft, ShieldCheck, Activity, Wind, Eye, X } from "lucide-react";

interface MedicalProcedureModalProps {
  isOpen: boolean;
  onClose: () => void;
  procedureType: "LBNP_CHAPS" | "OCULAR_ULTRASOUND" | "CIRCADIAN_LIGHTING";
  onComplete: () => void;
}

export const MedicalProcedureModal: React.FC<MedicalProcedureModalProps> = ({
  isOpen,
  onClose,
  procedureType,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(15);

  useEffect(() => {
    let interval: any = null;
    if (timerRunning && countdown > 0) {
      interval = setInterval(() => setCountdown((c) => c - 1), 1000);
    } else if (countdown === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, countdown]);

  if (!isOpen) return null;

  const getProcedureData = () => {
    switch (procedureType) {
      case "OCULAR_ULTRASOUND":
        return {
          title: "In-Flight Ocular Ultrasound (ONSD Protocol)",
          hazard: "Spaceflight-Associated Neuro-ocular Syndrome (SANS)",
          totalSteps: 3,
          steps: [
            {
              title: "Step 1: Probe Coupling & Eyelid Prep",
              graphic: "ULTRASOUND_GEL",
              instruction: "Apply sterile acoustic transmission gel to high-frequency linear probe (10–15 MHz). Instruct subject to maintain gentle downward gaze with closed eyelids.",
              check: "Acoustic contact confirmed • Zero ocular pressure exerted.",
            },
            {
              title: "Step 2: Retrobulbar Alignment",
              graphic: "AXIAL_SCAN",
              instruction: "Direct ultrasound beam through anterior globe along optical axis. Identify hypoechoic retrobulbar optic nerve sheath 3.0 mm posterior to the retinal surface.",
              check: "Dural sheath borders distinctly visualized in transverse plane.",
            },
            {
              title: "Step 3: Electronic Caliper Measurement",
              graphic: "CALIPER_MEASURE",
              instruction: "Place electronic calipers on internal hyperechoic margins of optic nerve sheath. Record three consecutive measurements.",
              check: "ONSD measured: 5.6 mm (Normal <5.8 mm). Retinal edema rule-out logged.",
            },
          ],
        };
      case "CIRCADIAN_LIGHTING":
        return {
          title: "Solid-State Light Assembly (SSLA) Circadian Shift",
          hazard: "Circadian Desynchrony & Melatonin Suppression",
          totalSteps: 2,
          steps: [
            {
              title: "Step 1: Spectrum Attenuation (2100K Amber)",
              graphic: "LIGHT_SPECTRUM",
              instruction: "Switch habitat module general luminaire from 6500K blue-enriched day-mode to 2100K blue-depleted recovery mode (<10 lux blue).",
              check: "SSLA controller telemetry confirmed at 2100K 120 min pre-bedtime.",
            },
            {
              title: "Step 2: Melatonin Pharmacotherapy Assist",
              graphic: "MELATONIN_DOSE",
              instruction: "Dispense 0.5 mg micro-dose oral melatonin. Verify crew member has removed blue-emitting wearable and personal display devices.",
              check: "Crew ingested dose • Optical displays locked in night-mode.",
            },
          ],
        };
      case "LBNP_CHAPS":
      default:
        return {
          title: "Lower Body Negative Pressure (LBNP Chaps)",
          hazard: "Cephalic Fluid Shift & Spaceflight Hypertension",
          totalSteps: 3,
          steps: [
            {
              title: "Step 1: Don LBNP Pneumatic Suit",
              graphic: "LBNP_DONNING",
              instruction: "Step into collapsible negative pressure chaps. Fasten waist seal clamp at level of iliac crest. Secure bilateral ankle air-tight cuffs.",
              check: "Acoustic vacuum seal intact • Zero pneumatic leak detected.",
            },
            {
              title: "Step 2: Engage Vacuum (-35 mmHg for 30m)",
              graphic: "PRESSURE_GAUGE",
              instruction: "Power on habitat vacuum regulator. Ramp negative pressure to -35 mmHg at 5 mmHg/sec. Monitor heart rate for vasovagal pre-syncope.",
              check: "Target pressure -35 mmHg reached • Venous blood pooled to lower extremities.",
            },
            {
              title: "Step 3: Oral Electrolyte Fluid Loading",
              graphic: "FLUID_PACK",
              instruction: "Consume 1.0L isotonic saline solution (or 8x 1g NaCl salt tablets with 1000 mL H2O) during final 10 minutes of suction.",
              check: "1.0L fluid loading complete • Plasma volume restored to nominal baseline.",
            },
          ],
        };
    }
  };

  const proc = getProcedureData();
  const currentStepData = proc.steps[currentStep - 1];

  const handleNext = () => {
    if (currentStep < proc.totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 font-sans select-none animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 text-sm space-y-4 shadow-2xl border border-slate-100">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">
                Clinical Procedure Guide
              </h3>
              <p className="text-xs text-slate-400 font-medium">Step-by-Step Countermeasure</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* PROGRESS */}
        <div>
          <div className="flex justify-between items-center text-xs text-slate-500 mb-1.5 font-medium">
            <span className="font-semibold text-slate-800">{proc.title}</span>
            <span className="text-indigo-600 font-semibold">Step {currentStep} of {proc.totalSteps}</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex gap-1 p-0.5">
            {Array.from({ length: proc.totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-full rounded-full transition-all ${
                  i + 1 <= currentStep ? "bg-indigo-600" : "bg-transparent"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ANIMATED STEP GRAPHIC */}
        <div className="aspect-[16/7] bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center p-4 relative overflow-hidden">
          {currentStepData.graphic === "LBNP_DONNING" && (
            <div className="relative flex flex-col items-center animate-pulse">
              <Wind className="w-10 h-10 text-indigo-600 mb-1" />
              <div className="px-3 py-1 bg-white border border-indigo-200 rounded-full text-xs text-indigo-700 font-semibold shadow-sm">
                Pneumatic Seal Locked
              </div>
            </div>
          )}

          {currentStepData.graphic === "PRESSURE_GAUGE" && (
            <div className="relative flex flex-col items-center">
              <div className="w-20 h-20 rounded-full border-4 border-dashed border-indigo-500 flex items-center justify-center animate-spin duration-1000 bg-white shadow-sm">
                <span className="text-xl font-bold text-slate-900">-35</span>
              </div>
              <span className="text-xs text-indigo-600 mt-2 font-semibold">mmHg Vacuum Active</span>
            </div>
          )}

          {currentStepData.graphic === "FLUID_PACK" && (
            <div className="flex items-center gap-3">
              <div className="w-14 h-20 bg-emerald-50 border-2 border-emerald-400 rounded-2xl flex flex-col items-center justify-center text-xs text-emerald-700 font-bold shadow-sm">
                <ShieldCheck className="w-6 h-6 text-emerald-600 mb-1" />
                <span>1.0L NaCl</span>
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                <div className="font-semibold text-slate-800">• 8x 1g Salt Tablets</div>
                <div>• Plasma Volume Restored</div>
              </div>
            </div>
          )}

          {currentStepData.graphic === "ULTRASOUND_GEL" && (
            <div className="flex flex-col items-center animate-pulse">
              <Eye className="w-10 h-10 text-indigo-600 mb-1" />
              <span className="text-xs text-indigo-700 font-semibold">Acoustic Probe Coupled</span>
            </div>
          )}

          {currentStepData.graphic === "AXIAL_SCAN" && (
            <div className="flex items-center gap-2">
              <div className="px-4 py-2 bg-white rounded-xl border border-indigo-200 text-xs text-indigo-700 font-bold shadow-sm">
                Depth: 3.0 mm
              </div>
              <span className="text-xs text-slate-500 font-medium">Retrobulbar Scan</span>
            </div>
          )}

          {currentStepData.graphic === "CALIPER_MEASURE" && (
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold text-slate-900">ONSD: 5.6 mm</div>
              <span className="text-xs text-emerald-600 font-semibold mt-1">Threshold: 5.8 mm (Nominal)</span>
            </div>
          )}

          {currentStepData.graphic === "LIGHT_SPECTRUM" && (
            <div className="flex flex-col items-center animate-pulse">
              <div className="w-12 h-12 rounded-full bg-amber-400/30 border-2 border-amber-500 flex items-center justify-center text-amber-700 font-bold text-sm mb-1">
                2100K
              </div>
              <span className="text-xs text-amber-700 font-semibold">Blue-Depleted Spectrum Active</span>
            </div>
          )}

          {currentStepData.graphic === "MELATONIN_DOSE" && (
            <div className="flex flex-col items-center">
              <div className="text-base font-bold text-slate-900">0.5 mg Melatonin Micro-Dose</div>
              <span className="text-xs text-slate-400 mt-1">Circadian phase advance initiated</span>
            </div>
          )}
        </div>

        {/* STEP INSTRUCTION BOX */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
          <span className="font-semibold text-slate-900 block text-sm">{currentStepData.title}</span>
          <p className="text-slate-600 leading-relaxed">{currentStepData.instruction}</p>
          <div className="pt-1.5 flex items-center gap-1.5 text-emerald-600 font-semibold text-xs border-t border-slate-200/60">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{currentStepData.check}</span>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex justify-between items-center pt-1">
          <button
            onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
            disabled={currentStep === 1}
            className="px-4 py-2 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            className="px-5 py-2.5 rounded-full text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-md active:scale-95 transition flex items-center gap-1.5"
          >
            <span>{currentStep === proc.totalSteps ? "Complete & Log Protocol" : "Next Step"}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

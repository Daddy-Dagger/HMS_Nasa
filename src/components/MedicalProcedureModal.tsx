import React, { useState, useEffect } from "react";
import { CheckCircle2, ChevronRight, ChevronLeft, Activity, X } from "lucide-react";

export type ProcedureTypeId = "TIER1_REST_RECOVERY" | "LBNP_CHAPS" | "OCULAR_ULTRASOUND" | "CIRCADIAN_LIGHTING";

interface MedicalProcedureModalProps {
  isOpen: boolean;
  onClose: () => void;
  procedureType: ProcedureTypeId;
  onComplete: (procedureTitle: string) => void;
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
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    setCurrentStep(1);
    setIsCompleted(false);
    setTimerRunning(false);
    setCountdown(15);
  }, [procedureType, isOpen]);

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
      case "TIER1_REST_RECOVERY":
        return {
          title: "Tier 1: Protocol Re-Measure & Decompression",
          hazard: "Autonomic Dysregulation (Contributing factors under review)",
          totalSteps: 3,
          steps: [
            {
              title: "Step 1: Protocol Re-Measure & Lead Verification",
              graphic: "RE_MEASURE",
              instruction: "Seat astronaut comfortably with arm supported at heart level. Check electrode contact impedance. Maintain 5 minutes of quiet rest before initiating verified oscillometric reading.",
              check: "Motion artifact cleared • 5-minute seated rest verified.",
            },
            {
              title: "Step 2: Passive Decompression & Environmental Shielding",
              graphic: "PASSIVE_REST",
              instruction: "Escort astronaut to individual crew quarters. Dim local lighting to 2100K recovery amber (<10 lux). Reduce communication chatter and eliminate non-essential work tasks.",
              check: "Quarters secured • 2100K circadian spectrum active.",
            },
            {
              title: "Step 3: Hydration Check & 60-Minute Follow-Up",
              graphic: "HYDRATION_CHECK",
              instruction: "Verify nominal oral hydration balance (Note: acute fluid loading and salt tablets are contraindicated for BP elevation). Schedule repeat BP check at T+60 min. If systolic remains >140 mmHg, escalate to Tier 2 CMO protocol.",
              check: "Hydration balance logged • T+60 min re-evaluation timer armed.",
            },
          ],
        };
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
              check: "ONSD measured: 5.6 mm (Threshold >5.8 mm). Retinal edema rule-out logged.",
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
          hazard: "Cephalic Fluid Shift & SANS Orthostatic Conditioning",
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
              instruction: "Power on habitat vacuum regulator. Ramp negative pressure to -35 mmHg at 5 mmHg/sec. Venous blood pools caudally to simulate 1-G gravity gradient. (Note: contraindicated for acute BP elevation).",
              check: "Target pressure -35 mmHg reached • Caudal fluid shift active.",
            },
            {
              title: "Step 3: Post-LBNP Orthostatic Assessment",
              graphic: "FLUID_PACK",
              instruction: "Following suction ramp-down, perform orthostatic vital check (heart rate and blood pressure). Log crew comfort and tolerance.",
              check: "LBNP countermeasure cycle complete • Orthostatic stability verified.",
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
      setIsCompleted(true);
      onComplete(proc.title);
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
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900 text-sm">
                  Clinical Procedure Guide
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  Decision-Support
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">NASA HRP Standard Operating Procedure</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* COMPLETED STATE */}
        {isCompleted ? (
          <div className="p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Procedure Logged Successfully</h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              <strong>{proc.title}</strong> has been executed according to NASA protocol and recorded in the mission medical telemetry log.
            </p>
            <div className="pt-2">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-full shadow-md transition active:scale-95"
              >
                Close & Return to Workstation
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* PROGRESS BAR */}
            <div>
              <div className="flex justify-between items-center text-xs text-slate-500 mb-1.5 font-medium">
                <span className="font-semibold text-slate-800">{proc.title}</span>
                <span>
                  Step {currentStep} of {proc.totalSteps}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / proc.totalSteps) * 100}%` }}
                />
              </div>
            </div>

            {/* TARGET HAZARD BADGE */}
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Targeted Hazard:</span>
              <span className="font-semibold text-indigo-700">{proc.hazard}</span>
            </div>

            {/* STEP CONTENT */}
            <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 space-y-3">
              <span className="font-bold text-slate-900 text-sm block">
                {currentStepData.title}
              </span>

              <p className="text-xs text-slate-600 leading-relaxed">
                {currentStepData.instruction}
              </p>

              {/* VERIFICATION CHECK */}
              <div className="p-2.5 bg-white rounded-xl border border-emerald-100 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium text-[11px]">{currentStepData.check}</span>
              </div>
            </div>

            {/* NAVIGATION BUTTONS */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
                disabled={currentStep === 1}
                className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition ${
                  currentStep === 1
                    ? "opacity-40 cursor-not-allowed text-slate-400"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={handleNext}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-semibold flex items-center gap-1.5 transition shadow-sm active:scale-95"
              >
                <span>{currentStep === proc.totalSteps ? "Complete & Log Procedure" : "Confirm & Proceed"}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from "react";
import { CheckCircle2, ChevronRight, ChevronLeft, ShieldCheck, Activity, Wind, Eye } from "lucide-react";

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
          title: "IN-FLIGHT PORTABLE OCULAR ULTRASOUND (ONSD PROTOCOL)",
          hazard: "Spaceflight-Associated Neuro-ocular Syndrome (SANS)",
          totalSteps: 3,
          steps: [
            {
              title: "STEP 1: PROBE COUPLING & EYELID PREPARATION",
              graphic: "ULTRASOUND_GEL",
              instruction: "Apply sterile acoustic transmission gel to Butterfly iQ high-frequency linear probe (10-15 MHz). Instruct subject to maintain gentle downward gaze with closed eyelids.",
              check: "Acoustic contact confirmed // Zero ocular pressure exerted.",
            },
            {
              title: "STEP 2: RETROBULBAR ACOUSTIC ALIGNMENT",
              graphic: "AXIAL_SCAN",
              instruction: "Direct ultrasound beam through anterior globe along optical axis. Identify hypoechoic retrobulbar optic nerve sheath 3.0 mm posterior to the retinal surface.",
              check: "Internal acoustic landmark locked at 3.0 mm depth.",
            },
            {
              title: "STEP 3: DIAMETER CALIPER & THRESHOLD CALIBRATION",
              graphic: "CALIPER_MEASURE",
              instruction: "Place electronic calipers across inner optic sheath borders. Record bilateral transverse diameter. Threshold of ≥5.8 mm indicates severe SANS CSF congestion.",
              check: "Measured ONSD: 5.6 mm [ATTENTION / GRADE 1 SANS ELEVATION].",
            },
          ],
        };
      case "CIRCADIAN_LIGHTING":
        return {
          title: "SSLA CIRCADIAN LIGHTING SPECTRAL RESET PROTOCOL",
          hazard: "Isolation & Sleep Desynchronization",
          totalSteps: 3,
          steps: [
            {
              title: "STEP 1: HABITAT SPECTRAL PROFILE OVERRIDE",
              graphic: "LIGHT_SPECTRUM",
              instruction: "Override nominal cabin fluorescent modules. Set Solid State Light Assemblies (SSLA) to pre-sleep blue-depleted mode (<10 lux short-wavelength).",
              check: "Photometric wavelength clamped to 2100K amber.",
            },
            {
              title: "STEP 2: CREW OPTICAL WIND-DOWN PERIOD",
              graphic: "CREW_SLEEP",
              instruction: "Maintain 1.5-hour scheduled photic restriction prior to sleep onset. Cease visual display terminal tasks or apply 480nm-blocking goggles.",
              check: "Endogenous melatonin secretion window uninhibited.",
            },
            {
              title: "STEP 3: SLEEP CYCLE INITIATION",
              graphic: "SLEEP_CHAMBER",
              instruction: "Enter personal crew quarters. Confirm acoustic dampening active (<45 dB) and zero-G restraint tether tension nominal.",
              check: "Sleep onset latency timer running.",
            },
          ],
        };
      case "LBNP_CHAPS":
      default:
        return {
          title: "LOWER BODY NEGATIVE PRESSURE (LBNP) & FLUID LOADING",
          hazard: "Cephalic Fluid Shift & Spaceflight Hypertension",
          totalSteps: 3,
          steps: [
            {
              title: "STEP 1: DONNING LBNP CHAPS & VACUUM SEAL",
              graphic: "LBNP_DONNING",
              instruction: "Step into LBNP mobile neoprene trousers. Pull pneumatic waist seal above iliac crests. Ensure airtight coupling to habitat vacuum bus connector.",
              check: "Pneumatic seal integrity verified (<0.5 mmHg/sec pressure loss).",
            },
            {
              title: "STEP 2: ACTIVE NEGATIVE PRESSURE PURGE (-35 mmHg)",
              graphic: "PRESSURE_GAUGE",
              instruction: "Engage vacuum pump to draw -35 mmHg sub-atmospheric pressure across lower extremities. This draws ~1.5L interstitial fluid from the head back to splanchnic and leg vascular beds.",
              check: "Target pressure locked: -35 mmHg. Real-time venous redistribution active.",
            },
            {
              title: "STEP 3: ISOTONIC FLUID LOADING & HYDRATION",
              graphic: "FLUID_PACK",
              instruction: "Ingest 1.0 Liter of isotonic electrolyte solution (or 8x 1g NaCl salt tablets with 1000 mL water) to restore circulating intravascular plasma volume.",
              check: "Fluid loading complete // Orthostatic baroreflex restored.",
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
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-mono select-none">
      <div className="bg-black border border-cyan-500/80 max-w-xl w-full p-5 text-xs space-y-4 shadow-[0_0_35px_rgba(6,182,212,0.25)]">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs tracking-wider">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>CLINICAL PROCEDURE GUIDE // STEP-BY-STEP VISUAL PROTOCOL</span>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-xs px-2 py-0.5 border border-slate-800">
            [CANCEL / ESC]
          </button>
        </div>

        {/* PROCEDURE TITLE & PROGRESS BAR */}
        <div>
          <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
            <span className="font-bold text-white uppercase">{proc.title}</span>
            <span className="text-cyan-400 font-bold">STEP {currentStep} OF {proc.totalSteps}</span>
          </div>
          <div className="w-full bg-slate-900 h-1.5 border border-slate-800 flex">
            {Array.from({ length: proc.totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 transition-all ${
                  i + 1 <= currentStep ? "bg-cyan-400 shadow-[0_0_8px_#22d3ee]" : "bg-transparent"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ANIMATED STEP GRAPHIC */}
        <div className="aspect-[16/7] bg-slate-950 border border-slate-800 flex flex-col items-center justify-center p-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />

          {/* SVG DYNAMIC ANIMATION FOR EACH PROCEDURE STEP */}
          {currentStepData.graphic === "LBNP_DONNING" && (
            <div className="relative flex flex-col items-center animate-pulse">
              <Wind className="w-10 h-10 text-cyan-400 mb-1" />
              <div className="w-24 h-6 border-2 border-cyan-400 bg-cyan-950/40 rounded flex items-center justify-center text-[9px] text-cyan-300 font-bold">
                PNEUMATIC SEAL LOCKED
              </div>
            </div>
          )}

          {currentStepData.graphic === "PRESSURE_GAUGE" && (
            <div className="relative flex flex-col items-center">
              <div className="w-20 h-20 rounded-full border-4 border-dashed border-cyan-400 flex items-center justify-center animate-spin duration-1000">
                <span className="text-sm font-bold text-white">-35</span>
              </div>
              <span className="text-[10px] text-cyan-300 mt-1 font-bold">mmHg VACUUM ACTIVE</span>
            </div>
          )}

          {currentStepData.graphic === "FLUID_PACK" && (
            <div className="flex items-center gap-3">
              <div className="w-12 h-16 border-2 border-emerald-400 bg-emerald-950/40 rounded flex flex-col items-center justify-center text-[9px] text-emerald-300 font-bold">
                <ShieldCheck className="w-5 h-5 text-emerald-400 mb-1" />
                <span>1.0L NaCl</span>
              </div>
              <div className="text-[10px] text-slate-300 space-y-0.5">
                <div>• 8x 1g Salt Tablets</div>
                <div>• Plasma Volume Restored</div>
              </div>
            </div>
          )}

          {currentStepData.graphic === "ULTRASOUND_GEL" && (
            <div className="flex flex-col items-center animate-pulse">
              <Eye className="w-10 h-10 text-cyan-400 mb-1" />
              <span className="text-[10px] text-cyan-300 font-bold">ACOUSTIC PROBE COUPLED</span>
            </div>
          )}

          {currentStepData.graphic === "AXIAL_SCAN" && (
            <div className="flex items-center gap-2">
              <div className="w-28 h-12 border border-cyan-400 bg-slate-900 flex items-center justify-center text-[10px] text-cyan-300 font-bold">
                DEPTH: 3.0 mm
              </div>
              <span className="text-[9px] text-slate-400">RETROBULBAR SCAN</span>
            </div>
          )}

          {currentStepData.graphic === "CALIPER_MEASURE" && (
            <div className="flex flex-col items-center">
              <div className="text-xl font-bold text-rose-400 animate-pulse">ONSD: 5.6 mm</div>
              <span className="text-[9px] text-slate-400">THRESHOLD: 5.8 mm</span>
            </div>
          )}

          {currentStepData.graphic === "LIGHT_SPECTRUM" && (
            <div className="flex flex-col items-center">
              <div className="w-32 h-6 bg-amber-600 shadow-[0_0_15px_#d97706] rounded flex items-center justify-center text-[10px] text-black font-bold">
                2100K AMBER ACTIVE
              </div>
            </div>
          )}

          {currentStepData.graphic === "CREW_SLEEP" && (
            <div className="text-[11px] text-amber-300 font-bold">
              PHOTIC RESTRICTION TIMER // 90 MIN TO SLEEP
            </div>
          )}

          {currentStepData.graphic === "SLEEP_CHAMBER" && (
            <div className="text-[11px] text-cyan-300 font-bold">
              ACOUSTIC DAMPING LOCKED // &lt;45 dB
            </div>
          )}
        </div>

        {/* STEP INSTRUCTION & VERIFICATION CHECK */}
        <div className="space-y-2">
          <div className="p-3 bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="text-cyan-400 font-bold text-[11px] block">{currentStepData.title}</span>
            <p className="text-slate-300 text-[11px] leading-relaxed">{currentStepData.instruction}</p>
          </div>

          <div className="p-2 border border-emerald-600/60 bg-emerald-950/30 text-emerald-300 text-[10px] flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span><strong>CRITICAL CHECK:</strong> {currentStepData.check}</span>
          </div>
        </div>

        {/* STEP CONTROLS */}
        <div className="flex justify-between items-center pt-2 border-t border-slate-800">
          <button
            onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
            disabled={currentStep === 1}
            className="px-3 py-1.5 border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 text-[10px]"
          >
            <ChevronLeft className="w-3 h-3" />
            <span>PREVIOUS</span>
          </button>

          <button
            onClick={handleNext}
            className="px-4 py-1.5 border border-cyan-500 bg-cyan-950 hover:bg-cyan-900 text-cyan-200 font-bold flex items-center gap-1.5 text-[10px] transition"
          >
            <span>{currentStep === proc.totalSteps ? "COMPLETE & LOG PROTOCOL" : "NEXT STEP"}</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

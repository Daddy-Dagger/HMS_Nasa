# AEGIS // Autonomous In-Flight Bio-Telemetry & Clinical Decision-Support (CDS) Workstation

> **NASA Human Research Program (HRP) Aligned Clinical Decision-Support System for Deep-Space Exploration (Artemis & Mars Transit)**
>
> ⚠️ **PERSISTENT OPERATIONAL DISCLAIMER**: This software is a clinical decision-support system engineered for operational guidance, triage, and countermeasure protocol navigation. It is **not** intended for autonomous clinical diagnosis. All final clinical interventions, invasive procedures, and pharmacotherapy must be deferred to a qualified Flight Surgeon or Crew Medical Officer (CMO). All patient telemetry streams displayed are **synthetic**.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)](https://vitejs.dev/)

---

## 🚀 Mission Overview

During long-duration deep-space transit to Mars, astronauts operate beyond the immediate protective envelope of Earth. With **round-trip communication latencies ranging between 6 and 44 minutes** (Mars 20-minute average delay) and periodic **solar conjunction communications blackouts (0 kbps)**, real-time telemedicine with MCC-Houston is physically impossible. 

**AEGIS** (Autonomous Expeditionary Guidance & In-flight System) is a decision-support bio-telemetry workstation engineered to address the **5 NASA Spaceflight Hazards (RIDGE)**:
1. **Space Radiation** (Cumulative biological dose tracking)
2. **Isolation & Confinement** (Neuro-behavioral vigilance & sleep fragmentation)
3. **Distance from Earth** (Autonomous clinical escalation ladders, delay-aware queues & asynchronous dossiers)
4. **Gravity Fields** (Cephalic fluid shifts, SANS optic edema, bone mineral density loss)
5. **Hostile Closed Environments** (Atmospheric $\text{ppO}_2$ and environmental coupling)

---

## ✨ Key Capabilities & Systems

### 1. Real Mathematical Drift Engine (CUSUM & EWMA)
- Replaces scripted static timelines with live statistical process control computed against each astronaut's individual baseline ($\mu_0, \sigma_0$).
- **CUSUM (Cumulative Sum Control Chart)**: Two-sided drift detection ($S^+_t = \max(0, S^+_{t-1} + z_t - k)$, $S^-_t = \max(0, S^-_{t-1} - z_t - k)$ with reference allowance $k = 0.5$, warning limit $h_{warn} = 3.0$, and critical action threshold $h_{action} = 5.0$).
- **EWMA (Exponentially Weighted Moving Average)**: Continuous filtering with smoothing constant $\lambda = 0.20$ to surface underlying clinical trajectory shifts beneath physiological noise.

### 2. Live Fault Injection & Perturbation Engine
- Interactive live fault controls to test engine sensitivity in real time:
  - **⚡ Sensor Glitch**: Injects electrode displacement, drops SQM to 18%, and tests conservative escalation logic.
  - **📈 BP Drift (+24 mmHg)**: Triggers acute arterial drift ($z > 3.4$), triggering CUSUM $S^+ \ge 5.0$ and Tier 1 decompression.
  - **📉 Sleep Loss (3.8h)**: Injects acute circadian sleep fragmentation ($z < -5.0$), triggering neuro-behavioral CUSUM alarms.
  - **🔄 Reset**: Restores nominal telemetry baselines instantly.

### 3. Clinically Grounded Sol 22–24 Logic
- **Corrected Clinical Mechanism**: Fluid loading (saline/salt tablets) and LBNP do **not** treat acute hypertension (fluid loading increases intravascular volume, while LBNP with fluid loading is an orthostatic/SANS countermeasure).
- **Tier 1 Protocol**: Initiates verified re-measurement (5-minute seated rest, eliminating motion artifacts), passive decompression in crew quarters, circadian lighting shift (2100K recovery amber), and hydration balance assessment, followed by scheduled re-evaluation at $T+60\text{ min}$ before escalating to Tier 2 CMO clinical exams.
- **Guideline-Specific Labeling**: Replaces bare "Stage 1" labels with formal reference to **NASA-STD-3001 & AHA/ACC 2017 Guidelines** ($>140\text{ mmHg}$ systolic).
- **Etiology Framing**: Attributes blood pressure elevations to *"Contributing factors under review: autonomic cardiovascular dysregulation, cumulative sleep debt, environmental stressors (cabin CO2, acoustic noise), and microgravity vascular remodeling"*, rather than falsely asserting acute fluid shift as the sole cause.

### 4. Objective Signal Quality Metrics (SQM) & Conservative Escalation
- Displays a confidence score (0–100%) and explanatory reason on **every reading** (e.g., *"High SNR • Photoplethysmography & ECG coherent"*, *"Motion artifact detected • Re-measure required"*).
- **Conservative Escalation**: When data quality is degraded ($\text{SQM} < 60\%$) or sensor dissonance occurs, the system does **not** stay silent. It elevates status to `ATTENTION` with a mandatory re-measure alert to prevent false security.

### 5. Delay-Aware & Blackout Queuing Simulation
- 3-way operational comms selector:
  - **LEO Real-Time (0.2s latency)**
  - **Mars 20m Lag (Deep-Space Asynchronous)**
  - **Blackout (0 kbps Solar Conjunction / Earth Occlusion)**
- During communications blackout, Flight Surgeon dossiers are automatically queued in onboard local NVRAM buffer (`QUEUED_LOCAL`). When ground link is restored, an automated synchronization protocol transmits buffered payloads to MCC-Houston.

### 6. SANS Exam Sanity Check & Calibration
- **40 cm Viewing Distance Calibration**: On-screen reference sizing tool calibrated to standard crew badge / credit card width ($85.6\text{ mm}$) to ensure exact visual angle subtense ($20/20$ optotype subtends $5\text{ arcmin}$).
- **Two-Phase Exam**: Phase A (Amsler Grid for metamorphopsia and choroidal folds) and Phase B (Tumbling-E dynamic near-point acuity).
- **Clear Interpretation & Escalation Rules**: Explicit guidance explaining what dioptric hyperopic shift ($+1.25\text{ D}$) and choroidal folds signify, with strict criteria for when mandatory Tier 2 CMO ocular ultrasound (ONSD threshold $>5.8\text{ mm}$) and fundoscopy must be engaged.

---

## 📚 Verified NASA Human Research Program (HRP) Evidence Base

All clinical protocols and threshold values are derived directly from published NASA Human Research Program Evidence Reports:
1. **Cardiovascular Adaptations**:
   - *Risk of Cardiovascular Adaptations Contributing to Adverse Mission Performance and Health Outcomes* (Lee, Saha, Charvat, Suresh, Lytle, Blattnig, Laurie, Macias 2022).
   - Clinical threshold: Systolic $\ge 140\text{ mmHg}$ sustained on 5-min seated re-measure (NASA-STD-3001 / AHA 2017).
2. **SANS (Neuro-Ocular)**:
   - *Risk of Spaceflight-Associated Neuro-ocular Syndrome (SANS)* (Laurie, Macias, Pardon, Stenger 2022).
   - Diagnostic thresholds: Subclinical Optic Disc Edema OCT $\Delta\text{TRT} \ge 19.4\ \mu\text{m}$; ONSD $>5.8\text{ mm}$ on ultrasound; Hyperopic shift $\ge +0.75\text{ D}$; Frisén Scale Grade $\ge 1$.
3. **Sleep & Fatigue**:
   - *Risk of Performance Decrements and Adverse Health Outcomes Resulting from Sleep Loss, Circadian Desynchronization, and Work Overload* (Flynn-Evans, Gregory, Arsintescu, Whitmire 2023).
   - Thresholds: Nominal sleep baseline $8.0\text{ h}$ (NASA-STD-3001); Critical lapse risk $<5.0\text{ h}$; PVT reaction time lapse cutoff $>500\text{ ms}$ (Chee et al. 2008).
4. **Earth-Independent Operations**:
   - *Risk of Inadequate Human-System Integration Architecture (HSIA)* / Exploration Medical Capability (ExMC) (Gore, Vera, Marquez, Holden, Amick, Dempsey, Munson 2023).
   - Earth-Mars signal latencies ($6\text{–}44\text{ min}$) and asynchronous telemetry queues.
5. **Radiation & Environmental**:
   - *Risk of Adverse Health Outcomes Due to Space Radiation Exposures* (NASA HRP 2020 & NCRP Report 186).
   - GCR background rate $\sim 0.04\text{ mSv/h}$; SPE storm warning threshold $>0.15\text{ mSv/h}$.

---

## 👥 Multi-Crew Mesh

- **CDR Miller**: Mission Commander (Exhibiting Sol 18–24 sleep loss & arterial drift)
- **PLT Chen**: Lunar/Mars Pilot (Nominal baseline: $116/74\text{ mmHg}$, $7.6\text{h}$ sleep)
- **ENG Kowalski**: Flight Engineer (Nominal baseline: $120/78\text{ mmHg}$, $7.2\text{h}$ sleep)
- **SCI Vance**: Science Specialist (Mild circadian debt: $5.8\text{h}$ sleep)

---

## 🛠️ Tech Stack & Architecture

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom glassmorphism utilities
- **Data Visualization**: Recharts (Composed time-series charts with area gradients, baseline bands, and decision lines)
- **Icons**: Lucide React
- **Build Tool**: Vite (Production build in $\sim 2.0\text{s}$)

---

## ⚡ Quick Start

```bash
# Clone repository
git clone https://github.com/Daddy-Dagger/HMS_Nasa.git
cd HMS_Nasa

# Install dependencies
npm install

# Start development server
npm run dev

# Build production bundle
npm run build
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📄 License

MIT License. Designed for deep-space autonomous clinical exploration and NASA Human Health & Performance Hackathons.

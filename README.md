# AEGIS // Autonomous In-Flight Bio-Telemetry & Clinical Support Workstation

> **NASA Human Research Program (HRP) Compliant Medical System for Deep-Space Exploration (Artemis & Mars Transit)**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)](https://vitejs.dev/)

---

## 🚀 Mission Overview

During long-duration deep-space transit to Mars, astronauts operate beyond the immediate protective envelope of Earth. With **round-trip communication latencies ranging between 6 and 44 minutes** (Mars 20-minute average delay), real-time telemedicine with MCC-Houston is physically impossible. 

**AEGIS** (Autonomous Expeditionary Guidance & In-flight System) is a clinical-grade bio-telemetry workstation engineered to address the **5 NASA Spaceflight Hazards (RIDGE)**:
1. **Space Radiation** (Cumulative biological dose tracking)
2. **Isolation & Confinement** (Neuro-behavioral vigilance & sleep fragmentation)
3. **Distance from Earth** (Autonomous clinical escalation ladders & asynchronous dossiers)
4. **Gravity Fields** (Cephalic fluid shifts, SANS optic edema, bone mineral density loss)
5. **Hostile Closed Environments** (Atmospheric $\text{ppO}_2$ and environmental coupling)

---

## ✨ Key Capabilities & Rubric Requirements

### 1. Translucent 3D Body Scan & Scanning Animation
- Soft-glowing human silhouette with pastel aurora gradients inspired by modern health aesthetics.
- **Dynamic horizontal laser beam sweep** executing autonomous head-to-toe checks.
- Progressive reveal of floating glass vital cards as the beam traverses cranial, cardiac, and musculoskeletal checkpoints.

### 2. Multi-Form Factor Responsive Engine
- **PC Expedition Console**: Full 3-column clinical workstation for habitat medical bays.
- **Mobile Comm-Pad**: Touch-optimized handheld layout with segmented tabs (`Scan`, `Vitals`, `Trends`, `Escalation`) and a floating thumb action dock.
- **Wearable HUD**: Adaptable spacesuit cuff display supporting **Rectangle Cuff** (forearm sleeve HUD) and **Circular Bezel** (smartwatch) modes with the **7-Dot Constellation Glyph**.

### 3. Clinically Grounded Indicator Detail & Recharts Trends
- Interactive time-series charts featuring **astronaut individual baseline bands** ($118\text{ mmHg}$) and **critical clinical threshold lines** ($>140\text{ mmHg}$).
- **Sensor Quality Metric (SQM)** confidence percentage badge.
- **Automated Alert Suppression Engine**: Suppresses false-positive alarms caused by physical motion artifacts (demonstrated on Sol 8).

### 4. 3-Tier Autonomous Clinical Escalation Ladder
- **Tier 1 (Autonomous Self-Care)**: Operator-managed non-pharmacological countermeasures (LBNP chaps at $-35\text{ mmHg}$ for $30\text{ min}$, $1.0\text{L}$ oral fluid loading, $2100\text{K}$ blue-depleted circadian lighting).
- **Tier 2 (Crew Medical Officer Protocol)**: In-flight ultrasound (Optic Nerve Sheath Diameter $>5.8\text{ mm}$), ophthalmoscopy Frisén Scale evaluation, and timed melatonin/hypnotic pharmacotherapy.
- **Tier 3 (Flight Surgeon Asynchronous Escalation)**: Automated compilation of a compressed JSON diagnostic packet queued for downlink.

### 5. Interactive In-Flight Diagnostic Batteries
- **SANS Ocular Exam**: A 2-phase gamified vision test:
  - *Phase A (Amsler Grid)*: Interactive metamorphopsia check detecting choroidal fold undulations.
  - *Phase B (Tumbling-E Acuity)*: Dynamic near-point visual acuity test measuring hyperopic refractive shift in diopters (+0.50D to +1.50D) with automated Space Glasses prescription.
- **Animated Procedure Guides**: Step-by-step visual protocols with dynamic SVG graphics (LBNP pneumatic seal, $-35\text{ mmHg}$ vacuum gauge, $1.0\text{L}$ saline pack, and retrobulbar ultrasound alignment).

---

## 📊 Scripted 30-Day Mission Trajectory

The telemetry engine simulates a rigorous 30-day Artemis deep-space transit profile calibrated to NASA HRP benchmarks:

| Timeline Segment | Telemetry Events & Clinical State | System Behavior |
| :--- | :--- | :--- |
| **Sol 1–7** | Space adaptation baseline ($118/76\text{ mmHg}$, $7.4\text{h}$ sleep, $11.2\ \mu\text{m}$ TRT). | Status: **NOMINAL** (All indicators green). |
| **Sol 8** | Sensor glitch event (SQM confidence drops to $19\%$). | **`[ALERT SUPPRESSED: MOTION ARTIFACT]`** triggers. Zero false alarms. |
| **Sol 16–21** | Cumulative sleep fragmentation ($7.2\text{h} \rightarrow 4.1\text{h}$, sleep debt accumulates). | Neuro-Behavioral status elevates to **ATTENTION** (Amber). |
| **Sol 22–24** | Cephalic fluid shift triggers acute hypertension spike ($144/93\text{ mmHg}$). | Status elevates to **CRITICAL** (Rose). Escalation Ladder ascends to **Tier 2**. |
| **Sol 25–27** | Intervention: Daily LBNP suction ($-35\text{ mmHg}$) and $1.0\text{L}$ fluid loading. | Blood pressure stabilizes ($131/84\text{ mmHg}$). |
| **Sol 28–30** | Ground dossier assembled for asynchronous transmission to Houston. | Full diagnostic summary export ready. |

---

## 📚 NASA Human Research Program (HRP) Evidence Base

All clinical protocols and threshold values are derived directly from published NASA Human Research Program Evidence Reports (included in `/docs`):
1. **Cardiovascular**: *Evidence Report on the Risk of Adverse Health and Performance Effects from Spaceflight-Induced Cardiovascular Adaptations* (Lee, Saha, Suresh, Lytle 2022).
2. **SANS**: *Risk of Spaceflight-Associated Neuro-ocular Syndrome* (Laurie, Macias, Pardon, Mader 2022).
3. **Sleep & Fatigue**: *Risk of Performance Decrements and Adverse Health Outcomes Resulting from Sleep Loss, Circadian Desynchronization, and Work Overload* (Flynn-Evans, Gregory, Whitmire 2023).
4. **Earth Independence**: *Risk of Adverse Health Outcomes Due to Inability to Provide Timely and Effective Medical Care in Deep Space* (Gore, Vera, Holden 2022).
5. **Long-Term Exposures**: *Exploration Medical Capability (ExMC) Clinical Operations Architecture*.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom glassmorphic utilities and Plus Jakarta Sans typography
- **Data Visualization**: Recharts (Composed time-series charts with area gradients and threshold lines)
- **Icons**: Lucide React
- **Build Tool**: Vite (Clean production builds in $\sim 2.0\text{s}$)

---

## ⚡ Quick Start

```bash
# Clone the repository
git clone https://github.com/Daddy-Dagger/HMS_Nasa.git
cd HMS_Nasa

# Install dependencies
npm install

# Start local development server
npm run dev

# Build production bundle
npm run build
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 👥 Multi-Crew Mesh

- **CDR Miller**: Mission Commander (Active clinical profile exhibiting Sol 18–24 drift)
- **PLT Chen**: Lunar/Mars Pilot (Nominal baseline)
- **ENG Kowalski**: Flight Engineer (Nominal sleep & cardiovascular metrics)
- **SCI Vance**: Science Specialist (Mild circadian debt)

---

## 📄 License

MIT License. Designed for NASA Human Health & Performance Hackathons and deep-space autonomous clinical exploration.

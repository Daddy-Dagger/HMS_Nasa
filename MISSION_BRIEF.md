# Project AEGIS // Biometric Fly-by-Wire (Bio-FbW) Flight Deck
**NASA Deep-Space Health Challenge 2026**

## 1. The Core Paradigm Shift
Standard space health proposals build a "patient portal" where an astronaut self-reports symptoms, looks at medical charts, and gets generic lifestyle advice.
**Why that fails:**
- **The Flight Surgeon Dilemma:** Astronauts conceal and game medical data to avoid being grounded or disqualified by mission logs.
- **The Introspection Fallacy:** Asking an astronaut with acute radiation strain, elevated intracranial pressure, and chronic sleep debt to "evaluate" their own cognitive decline is an epistemic failure.

**Our Solution (Bio-FbW):**
We treat human biology like an aircraft engine. The software is not a judge or executioner; it is a **Biometric Fly-by-Wire system**:
1. **Involuntary Ambient Telemetry:** Zero surveys. Health telemetry (keystroke flight times, psychomotor jitter, voice latency) is harvested passively from flight console use and life support exhaust.
2. **Graceful Operational Task Shunting:** When cognitive or motor degradation occurs, the spacecraft automatically dampens control tremors and silently load-balances high-risk tasks (e.g. dual-authorization autopilot for docking). Nobody is labeled "sick" or grounded.
3. **Closed-Loop Habitat Actuation:** The habitat acts physically on the body: auto-overdrives CO2 scrubbers to purge toxic pockets and shifts circadian lighting spectra (6500K blue alert -> 2100K recovery amber).
4. **Confession Booth (ZK-Vault):** Raw medical diagnoses stay encrypted locally on the astronaut's body. The spacecraft OS only receives Zero-Knowledge proofs of functional capability.

---

## 2. NASA RIDGE Hazards Mapped in the Demo
1. **Space Radiation:** Solar Particle Events (SPE) & Galactic Cosmic Rays -> Cellular damage, motor jitter.
2. **Isolation & Confinement:** Circadian disruption, sleep debt -> Psychomotor vigilance latency.
3. **Distance from Earth:** Earth-comms lag -> Requires 100% autonomous onboard closed-loop actuation without ground control.
4. **Gravity Fields:** Microgravity neuro-vestibular ataxia -> Tremors in manual docking crosshairs.
5. **Hostile Closed Environments:** Cabin CO2 spikes (>3 mmHg causes cognitive dulling) -> Automated ECLSS scrubber response.

---

## 3. Architecture & Tech Stack
- **Frontend / Framework:** Vite + React 18 + TypeScript + Tailwind CSS + Lucide Icons.
- **Key Modules in `src/App.tsx`:**
  - `Panel A`: Live Involuntary Psychomotor Probe (real-time key flight latency & variance in ms).
  - `Panel B`: Biometric Fly-by-Wire Docking Reticle (dynamic damping & task authority load balancing).
  - `Panel C`: Closed-Loop Habitat Actuators (Circadian spectrum shift & CO2 scrubber overdrive).
  - `ZK-Vault`: Zero-Knowledge Biometric Confession Booth modal.

---

## 4. Current Workstream & Next Steps for Collaborators
- **Branch/Workstream 1 (UI & Simulation Polish):**
  - Make Panel B reticle interactive (mouse/arrow tracking with artificial tremor injection).
  - Add NASA WinSCAT / PVT (Psychomotor Vigilance Task) visual pulse prompt.
- **Branch/Workstream 2 (Recovery Loop Engine):**
  - Build the 10-second "Closed-Loop Recovery Simulation" showing CO2 scrub down, lighting reset, and latency recovery curves.

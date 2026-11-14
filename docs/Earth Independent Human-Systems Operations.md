# Human Systems Integration for Deep Space Missions: Quantitative Data & Evidence Synthesis

The National Aeronautics and Space Administration (NASA) Human Research Program (HRP) Evidence Report, titled *Risk of Inadequate Human-System Integration Architecture (HSIA)* (approved June 2023; initial release April 2021 by Dr. Brian F. Gore, Dr. Alonso Vera, Dr. Jessica Marquez, Dr. Kritina Holden, Dr. Ryan Amick, Dr. Donna Dempsey, and Dr. Brandin Munson), establishes the empirical, statistical, and operational baseline for human spaceflight autonomy beyond Low Earth Orbit (LEO). This synthesis extracts all quantitative metrics, risk disposition scales, anomaly frequencies, habitability thresholds, physiological exposure limits, biomechanical injury data, and training retention parameters documented across spaceflight history, ground-based analogs, and aviation research.

---

## 1. Programmatic Risk Characterization & LxC Disposition

Risk assessment within NASA's Integrated Risk Management Application (IRMA) and Human System Risk Board (HSRB) relies on a $5 \times 5$ Likelihood and Consequence (LxC) matrix. Consequence is evaluated across four criteria—Safety, Schedule, Cost, and Technical—on an ordinal scale from 1 (Very Low) to 5 (Very High). Likelihood is similarly scaled from 1 (Occurrence is very low) to 5 (Occurrence is very likely and cannot be prevented by existing processes).

### 1.1 HSRB Consequence & Likelihood Scales

As defined in HRP Program Requirement Documents (PRD), consequence categories evaluate potential mission impacts before mitigation:

*   **Safety Consequence Scale**:
    *   **Level 1 (Very Low)**: No impact to personnel or facilities.
    *   **Level 2 (Low)**: Minor first aid; no adverse impact to personal safety or health. Hardware subject to no more than normal wear.
    *   **Level 3 (Moderate)**: Minor injury, occupational illness, or minor property/flight hardware damage.
    *   **Level 4 (High)**: Severe injury or occupational illness, or major property damage to facilities, systems, or hardware.
    *   **Level 5 (Very High)**: Death, permanent disabling injury, facility destruction, or loss of major systems.
*   **Likelihood Scale**:
    *   **Level 1 (Very Low)**: Existing processes, procedures, and plans are sufficient to prevent the event.
    *   **Level 2 (Low)**: Existing processes are usually sufficient to prevent this type of event.
    *   **Level 3 (Moderate)**: Existing processes may prevent event, but additional actions shall be required.
    *   **Level 4 (High)**: Existing processes cannot prevent event, but a different approach or process may prevent it.
    *   **Level 5 (Very High)**: Occurrence is very likely and cannot be prevented by existing processes; no alternative approaches available.

### 1.2 Design Reference Mission (DRM) Risk Dispositions

The HSRB baselined LxC risk dispositions across varying mission durations and operational distances (updated January 2021). As mission distance from Earth increases and ground resupply/evacuation options diminish, the HSIA risk transitions from "Accepted" to "Requires Mitigation."

| DRM Category | Mission Type & Duration | LxC Score (Ops) | Operational Risk Disposition | LxC Score (Long-Term Health) | Risk Disposition (LTH) |
| :--- | :--- | :---: | :--- | :---: | :--- |
| **Low Earth Orbit (LEO)** | Short (< 30 days) | **5 $\times$ 2** (Yellow) | **Accepted** (rapid evacuation, resupply, real-time MCC support) | N/A | N/A |
| **Low Earth Orbit (LEO)** | Long (30 days – 1 year) | **5 $\times$ 2** (Yellow) | **Accepted** | N/A | N/A |
| **Lunar Orbital** | Short (< 30 days) | **5 $\times$ 2** (Yellow) | **Requires Mitigation / Standard Refinement** | N/A | N/A |
| **Lunar Orbital** | Long (30 days – 1 year) | **5 $\times$ 2** (Yellow) | **Requires Mitigation / Standard Refinement** | N/A | N/A |
| **Lunar Orbital + Surface** | Short (< 30 days) | **5 $\times$ 3** (Red) | **Requires Mitigation** | N/A | N/A |
| **Lunar Orbital + Surface** | Long (30 days – 1 year) | **5 $\times$ 3** (Red) | **Requires Mitigation** | N/A | N/A |
| **Mars** | Preparatory (< 1 year) | **5 $\times$ 4** (Red) | **Requires Mitigation** | N/A | N/A |
| **Mars** | Planetary (730 – 1,224 days) | **5 $\times$ 5** (Red) | **Requires Mitigation** (maximum likelihood and maximum severity) | N/A | N/A |

---

## 2. Historical Anomaly Frequencies, System Malfunctions & Ground Support Capacity

Autonomous crew operations during Long-Duration Exploration Missions (LDEMs) represent a radical shift from Earth-reliant operations. Quantitative analysis of historical anomaly data highlights the high frequency of safety-critical events requiring immediate intervention.

### 2.1 Malfunction Rates across Spaceflight Programs

*   **Apollo Program Anomaly Rate**: During the Apollo Program, **10 out of 11 crewed missions** (90.9%) experienced significant technical anomalies that required real-time support and problem-solving from Mission Control Center (MCC) flight controllers.
*   **ISS Critical Malfunctions**: Critical hardware/software malfunctions requiring crew or MCC management have occurred at an average rate of **1.7 times per year** over the multi-decade lifespan of the International Space Station (ISS).
*   **Vehicle "Burn-In" Phase Anomaly Rate**: During the initial operational "burn-in" phase of a new space vehicle, critical malfunction rates escalate to **3 to 4 times per year** (excluding Extravehicular Activity [EVA] anomalies, which further elevate incident rates).
*   **Items for Investigation (IFI) Database Metrics**:
    *   Between 2002 and 2019, NASA recorded **67 high-priority IFIs** (events with potential Loss of Crew [LOC] or Loss of Mission [LOM]).
    *   During the first 2 years of ISS operations (2000–2002), high-priority IFIs occurred as frequently as **once every 2 months** (Wu & Vera, 2019).
    *   **35 out of 67 high-priority IFIs** (52.2%) were directly caused by vehicle subsystem malfunctions across active thermal control, electrical power, Environmental Control and Life Support Systems (ECLSS), Guidance, Navigation, and Control (GN&C), and structural subsystems (Panontin et al., 2021).
    *   **18 of these 35 subsystem anomalies** (51.4%) required urgent, time-critical responses, averaging approximately **1 urgent anomaly per year** (heavily concentrated in early operational years, e.g., 3 urgent anomalies in 2002 and 3 in 2004).
    *   Approximately **one-third (33.3%)** of all high-level IFIs required immediate real-time intervention from ground controllers.
*   **Probability Metric**: The baseline probability of encountering a high-consequence system problem of uncertain origin is estimated at **> 10% per 30-day mission segment**.

### 2.2 Ground Support Staffing vs. Onboard Autonomous Crew Capacity

Current Earth-reliant operations buffer human and system errors through massive real-time ground infrastructure. Long-duration Mars missions eliminate this safety net due to orbital geometry and light-speed transmission delays.

| Parameter | Earth-Reliant ISS Operations | Deep Space Mars Exploration (LDEM) |
| :--- | :--- | :--- |
| **Onboard Crew Size** | 6 to 7 crewmembers | **4 crewmembers** |
| **Ground Support Personnel** | **40+ specialists** (Front Room, Back Room, MER) | Minimal real-time support; asynchronous advisory |
| **Emergency "Team Four" Invocation** | Assembled in **3 to 4 hours** for complex anomalies | Unavailable / Infeasible |
| **Communication Round-Trip Latency** | Near instantaneous (< 1 second) | **6 to 44 minutes** (Earth-Mars orbital variation) |
| **Ground Resupply & Evacuation** | Resupply within weeks; rapid return in hours | **Zero resupply / No rapid evacuation** |

---

## 3. Environmental, Habitability & Biomechanical Quantitative Standards

Human-system integration requires precise alignment between spacecraft environment design and human physiological, biomechanical, and cognitive tolerances.

### 3.1 Environmental Exposures & Acceleration Limits

*   **Atmospheric Carbon Dioxide ($CO_2$) Exposure**:
    *   Ambient ISS $CO_2$ levels average approximately **2,500 parts per million (ppm)** (approx. **1.9 mmHg** to **2.5 mmHg**) due to power constraints on scrubber systems.
    *   $CO_2$ partial pressures exceeding **2.5 mmHg** correlate significantly with an increased incidence of crew headaches (Law et al., 2014) and alterations in mood and cognitive performance.
*   **Launch & Reentry Vibration Acceleration Limits**:
    *   Constellation / Orion program coupled loads analyses (CLA) established visual-manual performance-based requirements limiting narrow-band thrust oscillation vibration ($10\text{--}13\text{ Hz}$ band):
        *   **Instantaneous Peak Limit**: Must not exceed **$0.7\text{ }g_x$**.
        *   **Root-Mean-Square (RMS) Limit**: Must not exceed **$0.21\text{ }g_y$** averaged over a 5-second sliding window.
*   **Centrifuge Test Loadings**: High-fidelity human-in-the-loop (HITL) centrifuge evaluations tested display readability and manual control under a constant **$3.8\text{ }G_x$ bias load** combined with $12\text{ Hz}$ $g_x$ vibration.

### 3.2 Net Habitable Volume (NHV) Allocations

Habitability workshops and consensus panels established volume guidelines required to maintain crew performance and prevent psychological stress accumulation during 30-day to 1,000-day missions:

*   **2014 NASA NHV Consensus Recommendation**: **$25\text{ m}^3$ per crewmember** for a 6-person Mars mission (total net habitable volume of **$150\text{ m}^3$**).
    *   Includes **$5.4\text{ m}^3$ per individual** allocated specifically for private crew quarters.
*   **Human Integration Design Handbook (HIDH, 2014) Baseline**: **$26.85\text{ m}^3$ per person** baseline starting point for long-duration transit habitats.

### 3.3 Musculoskeletal Injuries & Biomechanical Constraints

Quantification of spaceflight medical records and suit-testing databases provides clear evidence of habitat and suit design limitations:

*   **In-Flight Musculoskeletal Injury Database**: Scheuring et al. (2009) identified **369 in-flight musculoskeletal injuries** across the U.S. space program. Hand, back, and shoulder contusions/abrasions were most prevalent.
    *   **Habitat/Vehicle Design-Attributable Injury Breakdown**:
        *   Impacting vehicle structures: **12 injuries**
        *   Stowing/unpacking equipment: **8 injuries**
        *   Translating through spacecraft: **8 injuries**
        *   Repairing onboard equipment: **7 injuries**
        *   Abnormal posture / awkward positioning: **6 injuries**
        *   Transferring equipment: **5 injuries**
        *   Restraint usage / lack of restraint: **5 injuries**
        *   Donning spacesuits: **3 injuries**
        *   Unspecified crew activity: **16+ injuries**
*   **Extravehicular Mobility Unit (EMU) Suit Injuries**: Williams & Johnson (2003) analyzed ground-based Neutral Buoyancy Laboratory (NBL) training injuries:
    *   Shoulder rotator cuff stress/strain injuries were directly linked to Planar Hard Upper Torso (HUT) bearing placement relative to the human shoulder joint.
    *   **11% of reported suit injuries** involved painful compression of the top of the foot and distal toe impingement due to improper boot fit.

---

## 4. Human Error Rates, Automation & Training Retention Parameters

Quantitative findings from spaceflight debriefs, military aviation safety data, and controlled psychological experiments emphasize the vulnerability of human memory and manual performance under stress and isolation.

### 4.1 Comparative Human Error Percentages

*   **NASA Spaceflight Mishaps**: Human error is cited as a direct causal factor in nearly **two-thirds (66.0%)** of all NASA spaceflight mishaps (Chandler, 2007).
*   **Aviation Accident Causal Rates**: In commercial and military aviation, **70% to 80%** of incidents directly involve human error, and **100%** involve human physical or cognitive limitations (Maurino et al., 1995).
*   **Training Deficiencies in Accidents**: Velazquez et al. (2015) found that training inadequacies were the single largest contributing factor in crew-error aviation accidents, present in **48.0%** of cases.
*   **Automation Knowledge Deficits**: Inadequate crew understanding of automated system flight modes contributed to over **40.0%** of commercial aviation accidents and **30.0%** of serious incidents between 2001 and 2009 (Abbott, 2010).
*   **Procedure Redesign Impact**: Systematic human-centered task analysis and cockpit procedure redesign reduced operational crew errors by **over 80.0%** in commercial airline evaluations (Loukopoulos et al., 2009).

### 4.2 Training Retention Decay & In-Flight Failure Rates

*   **ISS Preflight Training Duration**: Flight Operations Directorate (FOD) reduced ISS astronaut preflight training flows from **~30 months to ~24 months** (circa 2015) to mitigate severe knowledge decay caused by long lag times.
*   **Apollo Simulator Training Volume**: Apollo astronauts averaged nearly **1,000 hours of flight simulator time per crewmember** for a single mission.
*   **ISS Critical Power Loss Study**: During simulated and actual ISS operations, crewmembers responded incorrectly in **60.0% of critical power loss events** (3 out of 5 historical critical power failures) because operational failure modes differed from preflight simulator configurations.
*   **Skill Decay Timelines**:
    *   **Emergency Life Support / CPR**: Medical and emergency skills exhibit significant degradation within **6 to 12 months** post-training (Sanli & Carnahan, 2018).
    *   **Manual Rendezvous & Docking**: Teleoperated manual docking skills degrade significantly within **4 months** without active refresher training (e.g., Mir-Progress 234 collision on June 25, 1997).

### 4.3 Exploration Task Decomposition & Crew Specialties

To scope training requirements for Mars exploration, Stuster et al. (2018, 2019) conducted a comprehensive task decomposition:

*   **Total Identified Tasks**: **1,125 discrete crew tasks** required for a Mars surface mission.
*   **Summary Task Statements**: Condensed into **158 representative summary task statements** for SME rating and proficiency modeling.
*   **Primary Crew Specialty Roles (8 Domains)**:
    1.  *Mission Leader*
    2.  *Biologist*
    3.  *Geologist*
    4.  *Physician*
    5.  *Electrician*
    6.  *Pilot / Navigator*
    7.  *Mechanic / Engineer*
    8.  *Computer Specialist*

### 4.4 Function Allocation & Automation Formulation

Parasuraman, Sheridan, and Wickens (2000) defined a 10-level continuum of automation (LOA), ranging from fully manual execution to complete machine autonomy:

$$\text{LOA 1 (Manual)} \longrightarrow \text{LOA 5 (Executes upon approval)} \longrightarrow \text{LOA 7 (Automatic with notification)} \longrightarrow \text{LOA 10 (Autonomous)}$$

In human-robot interaction (HRI), Olsen and Goodrich (2003) quantified **Robot Attention Demand (RAD)** to measure operator control capacity:

$$\text{RAD} = \frac{\text{IE}}{\text{IE} + \text{NT}}$$

where $\text{IE}$ represents Interaction Effort (time spent actively commanding/monitoring the robot) and $\text{NT}$ represents Neglect Tolerance (the duration the robot can operate autonomously without performance degradation). Lower RAD values enable higher operator multi-tasking and fan-out capability.

---

## 5. Master Quantitative Summary Matrix

The following reference table consolidates all primary numerical data points, standards, statistical rates, and dimensional parameters from the NASA HSIA Evidence Report:

| Metric / Parameter | Value / Metric | Operational Context & Significance | Primary Source Citation |
| :--- | :--- | :--- | :--- |
| **Mars DRM Risk Disposition** | **5 $\times$ 5 (Red)** | Maximum Likelihood (5) & Consequence (5); Requires Mitigation | NASA HSRB (Updated 2021) |
| **Lunar Surface Risk Disposition** | **5 $\times$ 3 (Red)** | High Likelihood (5) & Moderate Consequence (3); Requires Mitigation | NASA HSRB (Updated 2021) |
| **LEO DRM Risk Disposition** | **5 $\times$ 2 (Yellow)** | High Likelihood (5) & Low Consequence (2); Accepted Disposition | NASA HSRB (Updated 2021) |
| **Apollo Anomaly Rate** | **10 of 11 missions (90.9%)** | Experienced major anomalies requiring real-time MCC support | Woodling (1973); Report §10 |
| **ISS Critical Malfunctions** | **1.7 per year** | Average rate over ISS lifespan requiring MCC/crew intervention | Report §10 (Executive Summary) |
| **Vehicle Burn-In Malfunction Rate** | **3 to 4 per year** | Malfunction rate during initial operational phase of new vehicle | Report §10 |
| **High-Priority IFIs (2002–2019)** | **67 total IFIs** | Events with potential LOC/LOM; 35 subsystem-related | Panontin et al. (2021) |
| **Urgent Subsystem Anomalies** | **~1 per year (18 total)** | Required immediate real-time response from ground controllers | Panontin et al. (2021) |
| **Ground Team vs. Flight Crew** | **40+ ground vs. 4 crew** | MCC staffing allocation needed to resolve complex anomalies | Dempsey et al. (2018); Vera (2019) |
| **Team Four Assembly Time** | **3 to 4 hours** | Time required to invoke specialized anomaly resolution team | Report §4.3 (Contextual Inquiry) |
| **High Consequence Probability** | **> 10% per 30 days** | Likelihood of high-consequence issue of uncertain origin | Report §4.3 |
| **Ambient ISS $CO_2$ Concentration** | **~2,500 ppm (1.9–2.5 mmHg)** | Elevated baseline due to scrubber power constraints | Simon et al. (2011); Law et al. (2014) |
| **Headache Threshold ($CO_2$)** | **> 2.5 mmHg** | Associated with increased crew headaches & cognitive impact | Law et al. (2014); Beard (2020) |
| **Net Habitable Volume (NHV)** | **25.0 $\text{m}^3$ per crewmember** | 2014 Consensus recommendation for 6-person Mars mission | Simon et al. (2011); Whitmire (2015) |
| **Private Quarters Volume** | **5.4 $\text{m}^3$ per person** | Allocated within $25\text{ m}^3$ total NHV for isolation protection | Whitmire et al. (2015) |
| **HIDH Baseline Volume** | **26.85 $\text{m}^3$ per person** | NASA Human Integration Design Handbook baseline starting point | NASA HIDH (2014) |
| **Vibration Instantaneous Peak** | **0.7 $g_x$** | Upper limit for narrow-band thrust oscillation ($10\text{--}13\text{ Hz}$) | Adelstein et al. (2009b); Report §7 |
| **Vibration 5-sec RMS Limit** | **0.21 $g_y$** | Root-mean-square limit averaged over 5-second window | Adelstein et al. (2009b); Report §7 |
| **In-Flight Musculoskeletal Injuries** | **369 total conditions** | Identified across U.S. spaceflight history | Scheuring et al. (2009) |
| **Suit Boot Impingement Rate** | **11% of foot complaints** | Impingement of distal toes/compression in EMU suit boots | Williams & Johnson (2003) |
| **ISS Training Flow Reduction** | **30 mos. $\rightarrow$ 24 mos.** | Circa 2015 FOD reduction to mitigate preflight decay | Sonoda (2016); Dempsey et al. (2018) |
| **Apollo Simulator Training** | **~1,000 hours / crew** | Simulator hours per astronaut per mission during Apollo | Woodling (1973) |
| **ISS Power Failure Error Rate** | **60.0% error rate** | Incorrect crew response during 3 of 5 critical power losses | Report §6 (Spaceflight Evidence) |
| **NASA Mishap Human Error Rate** | **66.0% of mishaps** | Human error implicated in NASA spaceflight mishaps | Chandler (2007) |
| **Aviation Human Error Rate** | **70% to 80% of accidents** | Human error causal factor in military & civil aviation | Maurino et al. (1995) |
| **Aviation Training Deficiencies** | **48.0% of crew errors** | Training inadequacy percentage in crew-error accidents | Velazquez et al. (2015) |
| **Procedure Redesign Error Reduction**| **> 80.0% reduction** | Error rate drop following human-centered procedure redesign | Loukopoulos et al. (2009) |
| **Mars Mission Task Breakdown** | **1,125 tasks / 158 summaries** | Decomposed across 8 primary crew specialties | Stuster et al. (2018, 2019) |
| **Mars Comm Delay Range** | **6 to 44 minutes** | One-way / round-trip light-time latency variability | Fong et al. (2013); Report §6 |
| **NASA-STD-3001 Standards Count** | **600+ distinct standards** | Vol 1 (Crew Health) & Vol 2 (Human Factors/Habitability) | NASA-STD-3001 (2015, 2019) |

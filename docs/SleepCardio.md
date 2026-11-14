# NASA Human Research Program (HRP) Clinical Decision-Support & Health Monitoring Specification

## 1. Quantitative Clinical Baselines and Physiological Thresholds

This section details the primary quantitative baselines, neurobehavioral failure thresholds, and operational limits extracted from the NASA Human Research Program (HRP) Evidence Book architecture and the Evidence Report on Sleep Loss, Circadian Desynchronization, and Work Overload (authored by Erin Flynn-Evans, Kevin Gregory, Lucia Arsintescu, and Alexandra Whitmire). These metrics provide the algorithmic foundation for long-duration deep-space clinical decision-support (CDS) software.

### 1.1 Sleep Architecture & Circadian Adaptation Baselines
* **Nominal Daily Sleep Allocation Standard**: NASA-STD-3001, Volume 1 (Crew Health) specifies a required nominal baseline of **8.0 continuous hours of scheduled sleep per night** for spaceflight crews.
* **In-Flight Average Sleep Duration**: Operational spaceflight data across Space Shuttle, Mir, and International Space Station (ISS) missions document an actual average sleep duration of **6.0 to 6.4 hours per night** across actigraphy, polysomnography (PSG), and subjective sleep log evaluations.
  * *Shuttle Missions (Actigraphy)*: Barger et al. (2014) recorded an average in-flight sleep duration of **6.0 hours per night** (compared to 6.3 hours pre-flight and 6.8 hours post-flight across 64 crewmembers).
  * *ISS Long-Duration Missions (Actigraphy)*: Barger et al. (2014) recorded an average in-flight sleep duration of **6.1 hours per night** (compared to 6.4 hours pre-flight and 7.0 hours post-flight across 21 crewmembers).
  * *ISS Sleep Logs*: Dinges et al. (2013) documented an average in-flight sleep duration of **6.4 hours per night** across 18 ISS crewmembers.
  * *Skylab PSG*: Frost et al. (1976) measured an average in-flight sleep duration of **6.0 hours per night**.
  * *Early Shuttle Debriefings*: Santy et al. (1988) reported an average in-flight sleep duration of **6.0 hours per night** across 58 crewmembers (compared to 7.9 hours on Earth), with sleep dropping to **5.6 to 5.7 hours per night** on the first and last mission days, and individual nights reaching **2.0 hours or less**.
* **Cumulative Mission Sleep Debt**: Long-duration crewmembers accumulate a continuous operational sleep deficit of **1.6 to 2.0 hours per night** relative to NASA-STD-3001 requirements.

### 1.2 Sustained Wakefulness & Neurobehavioral Degradation Limits
* **Maximum Sustained Wakefulness Limit**: As established by Klerman and Dijk (2005), the human biological homeostatic sleep drive maintains nominal sustained vigilance up to a strict limit of **16 continuous hours awake**. Wakefulness extended beyond 16 hours induces acute sleep deprivation and exponential neurobehavioral degradation.
* **Blood Alcohol Concentration (BAC) Performance Equivalents**:
  * **19 Hours Continuous Wakefulness**: Sustained wakefulness of 19 hours produces neurobehavioral vigilance decrements equivalent to a Blood Alcohol Concentration (BAC) of **0.05%** (Dawson and Reid, 1997).
  * **24 Hours Continuous Wakefulness**: Sustained wakefulness extending to 24 hours degrades simple reaction time and vigilance to an impairment level equivalent to a BAC of **0.10%** (Dawson and Reid, 1997).
* **Sleep Inertia Dissipation Window**: Jewett et al. (1999) established that abrupt awakening induces a state of impaired alertness and cognitive grogginess (sleep inertia) that dissipates asymptotically over **2 to 4 hours post-awakening**. Wickens et al. (2014) meta-analyzed an initial performance loss of **41% upon immediate awakening** (compared to a 30% decrement caused by 48 hours of total sleep deprivation).

### 1.3 Objective Psychomotor Vigilance Task (PVT) & Cognitive Degradation Cutoffs
* **PVT Attention Lapse Cutoff**: Any reaction time latency **greater than 500 milliseconds (>500 ms)** on the Psychomotor Vigilance Task (PVT) is classified as an objective lapse of attention (Chee et al., 2008).
* **Standard Test Battery Metrics**:
  * *Standard Laboratory PVT*: 10-minute visual task assessing reaction time, lapses (>500 ms), and false starts (errors of commission).
  * *Brief PVT (PVT-B)*: Basner et al. (2011) validated a 3-minute visual task utilizing inter-stimulus intervals (ISI) of **1 to 4 seconds** (reduced from the standard 2 to 10 seconds), preserving sensitivity to acute sleep loss while reducing crew time burden.
  * *Adaptive PVT (PVT-A)*: Basner and Dinges (2012) established an adaptive test averaging **6.5 minutes** that dynamically samples performance until a statistical confidence threshold categorizes the operator as high, medium, or low risk.
* **Cognitive Domain Sensitivity Hierarchy**: Lim and Dinges (2010) established through meta-analysis that sleep loss degrades cognitive domains in a specific order:
  1. *Simple Attention & Vigilance*: Highest effect size degradation (PVT lapses and speed).
  2. *Complex Attention & Working Memory*: Medium-to-large effect size degradation (Digit Symbol Substitution Test [DSST], Matrix Reasoning).
  3. *Processing Accuracy*: Accuracy metrics remain relatively intact, explaining why sleep-deprived crewmembers preserve task accuracy but exhibit significantly slowed processing speeds.

### 1.4 Workload & Duty Hour Operational Risk Boundaries
* **NASA Critical Work Overload Threshold**: Defined by NASA (2007) standard specifications as duty schedules exceeding **10-hour work days undertaken for more than 3 days per week**, or a cumulative total duty exceeding **60 hours per week**.
* **Nominal Daily Duty Guidelines**: NASA-STD-3001 limits daily crew operational work allocation to **6.5 hours per day** within a scheduled **48-hour work week**.
* **Schedule Creep & Slam Shifting**: Operational reporting by Whitmire et al. (2013) and Stuster (2010) identifies un-timelined procedure overruns causing **18-hour duty days**, forced "slam-shifts" (abrupt bedtime shifts of 6+ hours over a weekend), and displacement of pre-sleep wind-down periods.

### 1.5 Microgravity Fluid Redistribution and Neuro-Ocular Baselines (SANS & Hemodynamics)
* **Cephalic Fluid Shift Dynamics**: Microgravity removes hydrostatic pressure gradients, causing an immediate upward displacement of approximately **1.5 to 2.0 Liters of tissue fluid** from the lower limbs toward the head, neck, and torso.
* **Spaceflight-Associated Neuro-ocular Syndrome (SANS) Indicators**: As documented in HRR Risk Reports managed by Steve Laurie:
  * *Optic Nerve Sheath Diameter (ONSD)*: Microgravity cephalic fluid pressure elevation induces progressive swelling of the optic nerve sheath.
  * *Ocular Structural Alterations*: In-flight ultrasound and optical coherence tomography (OCT) document optic disc edema, posterior globe flattening, and choroidal folds (Mader et al., 2011).
  * *Refractive Errors*: Astronauts develop progressive hyperopic refractive shifts (hyperopic shift up to **+1.75 to +2.50 Diopters**), requiring in-flight corrective focus adjustments.
* **Cardiovascular Adaptations**: Managed by Jason Lytle under the HRP Cardiovascular Risk Report. Microgravity adaptation leads to decreased plasma volume (10–15% reduction within 24–48 hours), blunted baroreceptor reflex sensitivity, stroke volume reduction, and post-flight orthostatic intolerance upon gravity re-entry.

---

## 2. NASA In-Mission Clinical Countermeasures and Operational Escalation Ladder

NASA documents a multi-tiered countermeasure framework spanning lighting modifications, chronobiotic timing, wake-promoting agents, hypnotic medications, dynamic scheduling, and physical fluid management systems.

### 2.1 Dynamic Lighting Schedule (SSLA) Spectral Specifications
As established by Brainard et al. (2013), the ISS Solid State Light Assemblies (SSLAs) replace legacy fluorescent fixtures with a 3-mode Dynamic Lighting Schedule (DLS) designed around the spectral sensitivity of intrinsically photosensitive retinal ganglion cells (ipRGCs, peak sensitivity at **460 to 480 nm**):

| SSLA Lighting Mode | Spectral Composition & Wavelength | Illuminance & Irradiance | Operational Clinical Purpose |
| :--- | :--- | :--- | :--- |
| **General / Visual Acuity** | Broad-spectrum white light (4000 K color temperature equivalent) | Standard work illumination (25–50 foot-candles; ~250–500 lux) | Routine daytime nominal activities, maintenance, reading, and repair. |
| **High Alertness / Circadian Reset** | Blue-enriched white light (Peak output at **460–480 nm**) | High irradiance (>20 µW/cm² blue light component; West et al., 2011) | Morning phase-advance shifts, acute alertness enhancement during critical operations (EVAs, docking). |
| **Pre-Sleep / Melatonin Entrainment** | Blue-minimized white light (Filtered short-wavelength spectrum) | Low illuminance (~2–10 foot-candles; ~20–100 lux) | Scheduled 1.0 to 2.0 hours prior to bedtime to prevent ipRGC stimulation and allow endogenous melatonin onset. |

* **Short-Pulse & Narrowband Efficiency**:
  * *Blue Wavelength Shift*: Rüger et al. (2013) demonstrated that a 6.5-hour pulse of **480 nm short-wavelength blue light** produces **75% of the phase shift** of a 10,000 lux white light exposure while requiring only **4% of the energy**.
  * *Millisecond Flashes*: Zeitzer et al. (2014) proved that **2-millisecond light flashes delivered every 30 seconds** during sleep induce a **30-minute circadian phase shift** without disrupting sleep architecture or EEG power density.

### 2.2 Pharmacological Countermeasure Protocols (Dosage, Timing, & Efficacy)

Pharmacological administration follows a strict operational escalation ladder governed by mission phase, duty timing, and physician oversight.

#### A. Hypnotics (Sleep Inducing Agents)
* **Zolpidem**: Standard prescription dosage of **5 mg or 10 mg** (or 6.25 mg/12.5 mg extended-release). Survey data by Whitmire et al. (2013) shows 65% of hypnotic-using astronauts select zolpidem. Barger et al. (2014) reported hypnotic use on **52% of nights aboard Space Shuttle missions**.
* **Zaleplon**: Standard prescription dosage of **10 mg**. Used by 28% of hypnotic-using crewmembers, favored for mid-sleep awakenings due to its ultra-short half-life.
* **Operational Risk (Emergent Awakening)**: Dinges et al. (2016) demonstrated in a Category I trial that crewmembers awakened abruptly by an emergency ISS alarm 1.0 to 1.5 hours post-ingestion of zolpidem or zaleplon exhibited severe neurobehavioral impairment and sleep inertia degradation compared to placebo.

#### B. Chronobiotics (Phase Shifting Agents)
* **Exogenous Melatonin**: Administered in oral doses of **0.3 mg, 1.8 mg, or 5.0 mg** (Sharkey et al., 2001; Wyatt et al., 2006).
* **Combined Phase-Advance Protocol**: Burke et al. (2013) established that administering **5.0 mg of melatonin timed 5.75 hours prior to habitual bedtime**, combined with **1.0 hour of bright light prior to habitual wake time**, produces the maximum synergistic circadian phase advance.
* **Spaceflight Trial**: Dijk et al. (2001) demonstrated on STS-90/95 that melatonin significantly reduced sleep onset latency during in-flight circadian shift protocols.

#### C. Wake-Promoting Stimulants & Alertness Agents
* **Caffeine**:
  * *Low-Dose Repeated Protocol*: Wyatt et al. (2004) demonstrated that repeated hourly low-dose caffeine maintains vigilance during extended wakefulness.
  * *Acute High-Dose Protocol*: Wesensten et al. (2005) and Killgore et al. (2008) evaluated single doses of **600 mg caffeine** (or 200 mg caffeine gum; Newman et al., 2013) during 44–64 hours of total sleep deprivation, finding rapid onset of vigilance recovery (though associated with post-recovery sleep disruption and elevated heart rate).
  * *Circadian Phase Shift Side Effect*: Burke et al. (2015a) noted that a single evening dose of **2.9 mg/kg caffeine** induces a significant circadian phase delay.
* **Modafinil**: Prescribed in oral doses of **200 mg or 400 mg daily** (Walsh et al., 2004; Grady et al., 2010). Wesensten et al. (2005) established that 400 mg modafinil maintains PVT reaction time and executive function over extended wakefulness without the peripheral autonomic side effects of high-dose caffeine.
* **Dextroamphetamine**: Prescribed in oral doses of **20 mg** for severe operational sleep deprivation (Killgore et al., 2008; Wesensten et al., 2005). Demonstrates high vigilance maintenance but longer onset latency and significant disruption to subsequent recovery sleep.

### 2.3 Physical & Hemodynamic Countermeasure Framework
* **Lower Body Negative Pressure (LBNP)**:
  * *Mechanism*: Applies sub-atmospheric negative pressure to the lower extremities, drawing fluid from the cephalic and thoracic regions back into the leg vasculature.
  * *Target Parameters*: Operational protocols utilize pressures of **-35 mmHg to -50 mmHg** for durations of **30 to 60 minutes daily** to counteract microgravity cephalic fluid congestion, lower intraocular pressure, and mitigate optic nerve sheath expansion.
* **Isotonic Fluid & Electrolyte Loading**:
  * *Re-entry Protocol*: Prior to gravitational re-entry (Shuttle/Soyuz/Orion), crewmembers ingest **1.0 Liter of isotonic saline solution** (or 8 salt tablets [1 gram NaCl each] taken with 1.0 Liter of water) 1 to 2 hours before landing to restore intravascular plasma volume and prevent orthostatic collapse.

### 2.4 Diagnostic Exam & In-Flight Monitoring Battery
* **Polysomnography (PSG) & EEG**: Evaluates electroencephalographic brain wave activity (using standard 10-20 scalp electrode array), sleep latency, slow-wave sleep (SWS) duration, REM latency, and sleep efficiency.
* **Actigraphy**: Continuous wrist-worn tri-axial accelerometer monitoring rest-activity cycles and photic exposure.
* **Ocular Diagnostic Exam Battery**:
  * *In-Flight Ocular Ultrasound*: Measures optic nerve sheath diameter (ONSD) in millimeters and assesses posterior globe contour.
  * *Fundoscopy & Optical Coherence Tomography (OCT)*: Tracks optic disc edema (Frisén scale grading), retinal nerve fiber layer (RNFL) thickness, and choroidal folds.
  * *Tonometry (Tonopen)*: Measures intraocular pressure (IOP) in mmHg.

---

## 3. Sensor Artifacts, Signal Reliability, and Diagnostic Logic

Flight hardware deployed in microgravity faces environmental noise, body movement artifacts, and sensor disconnects. The clinical decision-support system must reliably distinguish sensor failure from true astronaut physiological collapse.

### 3.1 Common Sensor Artifacts and Signal Failure Modes in Microgravity
* **Electrode Displacement & Microgravity Contact Loss**: Zero-gravity body movements, sweat accumulation during exercise, and tether snagging frequently cause transient loss of contact in chest-worn ECG sensors, wrist actigraphs, and scalp EEG leads, manifesting as sudden flatlines or high-frequency step-function spikes.
* **Motion Artifacts during Rest-Activity Tracking**: In microgravity, passive limb floating during sleep can register as movement on wrist actigraphs, leading to false classifications of wakefulness (overestimating wake-after-sleep-onset [WASO]).
* **Optoelectronic Photoplethysmography (PPG) Noise**: Peripheral perfusion changes caused by cephalic fluid shifts and ambient cabin lighting changes induce baseline wander and signal dropouts in pulse oximetry readings.

### 3.2 Flight Surgeon Differential Diagnostic Logic Matrix

To prevent false emergency declarations, flight surgeons and automated CDS software apply a multi-parameter verification algorithm:

1. **Biometric Signal Anomaly Trigger**: System detects a sudden zero-reading or step-spike on a primary monitoring channel.
2. **Cross-Sensor Channel Check**:
   * *Scenario A (Single-Channel Drop)*: PPG displays zero pulse, but chest ECG waveform and impedance remain normal. -> **Diagnosis**: Local PPG Sensor Detachment / Motion Artifact.
   * *Scenario B (Multi-Channel Concurrent Drop)*: ECG flatline AND PPG pulse zero AND electrode contact impedance maxed out (>100 kΩ). -> **Diagnosis**: Lead Cable Snag or Harness Disconnection.
   * *Scenario C (Multi-System Physiological Failure)*: ECG displays ventricular fibrillation/asystole AND PPG pulse zero AND skin impedance normal AND chest wall motion zero. -> **Proceed to Secondary Environmental Verification**.
3. **Secondary Environmental & Voice Verification**:
   * *Voice / Activity Check*: Query crew member via intercom or check cabin optical video.
   * *If Voice / Movement Present*: -> **Diagnosis**: Telemetry Hardware Transmitter Failure.
   * *If Voice Absent & Movement Zero*: -> **Diagnosis**: TRUE ACUTE CLINICAL COLLAPSE (Trigger Emergency Medical Protocols).

---

## 4. Earth-Independent Medical Operations (High-Latency Protocols)

During deep-space missions (e.g., Mars transit and surface operations), light-time transmission delays reach **15 to 20 minutes each way** (a round-trip latency of 30 to 40 minutes). This delay renders real-time Ground Control flight surgeon consultation impossible during acute medical emergencies.

### 4.1 Autonomous Medical Decision Architecture
As detailed in the HRR Evidence Reports managed by Kristina Holden (Risk of Adverse Mission Outcomes Due to Earth Independent Human-Systems Operations) and Kris Lehnhardt (Exploration Medical Capability [ExMC]):

* **100% Autonomous Crew Execution Mandate**: The onboard crew and autonomous CDS software are delegated full authority to execute diagnostic exams, triage acute illnesses, perform surgical/resuscitative procedures, and administer controlled pharmaceuticals without prior Flight Director or Flight Surgeon clearance.
* **Onboard CDS Knowledge Base**: The software must embed self-contained decision trees, step-by-step procedure guides, interactive diagnostic checklists, and predictive biomathematical fatigue models (e.g., integrated Harvard/McCauley fatigue dashboard algorithms) operating entirely offline within the spacecraft local computing network.

### 4.2 Autonomous Clinical Intervention Rules
1. **Acute Neurobehavioral Failure Protocol**: If CDS software registers PVT attention lapses exceeding critical limits during high-risk operations (e.g., Mars lander descent or EVA), the software initiates an immediate autonomous operational override—re-assigning primary control to an alert crewmember or automated autopilot systems.
2. **Emergent Fatigue Intervention**: When acute operational demands force extended wakefulness (>16 hours) during critical tasks, crew autonomous protocols authorize self-administration of fast-acting alertness agents (200 mg caffeine gum or 200 mg modafinil) per pre-validated algorithmic rules.
3. **Severe Environmental Anomaly Response**: In the event of rapid vehicle depressurization, toxic atmospheric release, or acute trauma, crew execute pre-programmed medical emergency procedures (CPR, automated external defibrillation, advanced airway management, pressure suit donning) with automated post-event diagnostic logging transmitted asynchronously to Earth.

---

## 5. Spaceflight Cognitive Performance Evidence Matrix (NASA HRR Table 2 & Flight Studies)

The following matrix reproduces the exact findings from **Table 2** of the NASA HRP Evidence Report (Flynn-Evans et al., 2016), compiling all documented spaceflight cognitive performance studies across Space Shuttle, Mir, and ISS missions.

### 5.1 Primary Spaceflight Cognitive Performance Data (Flynn-Evans et al. Table 2)

| Study / Author | Year | Mission | Crew Size ($N$) | Measurement Battery & Metrics | Decrement Observed | Specific Type of Effect Found | Mission Duration (Days) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Schiflett et al.** | 1996 | STS-65, STS-78 | 7 | Performance Assessment Workstation (PAWS) battery; subjective cumulative fatigue assessments | Yes | Significant decrements in memory-search performance, directly correlated with self-assessed fatigue ratings. | 14 (STS-65)<br>15 (STS-78) |
| **Manzey and Lorenz** | 1998 | Mir 1 | 1 | Accuracy and response time across 4 AGARD-STRES tasks (GRT, MST, UTT, DT); mood & workload ratings | Yes | Pre-launch performance decrements associated with lowered mood; tracking performance decrements varied in flight during microgravity adaptation and Earth re-adaptation. | 438 |
| **Manzey et al.** | 1998 | Mir 1 | 1 | Accuracy and response time across 4 AGARD-STRES tasks (GRT, MS, UTT, DT) | Yes | Fine manual control decrements (Unstable Tracking Task [UTT]) due to microgravity adaptation; potential decrements in tracking/memory-search during Dual Task (DT). | 8 |
| **Monk et al.** | 1998 | STS-78 | 4 | Visual Analog Scale (VAS) alertness rating | No | No objective performance testing; subjective alertness ratings were higher early in flight and degraded later in flight. | 17 |
| **Newman and Lathan** | 1999 | STS-42 | 4 | Memory recall task | No | Memory recall task showed no significant decrement; tracking disruptions were observed. | 4 |
| **Dijk et al.** | 2001 | STS-90, STS-95 | 5 (STS-90)<br>1 (STS-95) | Psychomotor Vigilance Task (PVT), calculation, recall memory, VAS, Karolinska Sleepiness Scale (KSS) | PVT: Non-Significant | Most PVT attention lapses occurred in-flight; least lapses post-flight. Performance declined during the last pre-launch week and in-flight. | 16 (STS-90)<br>10 (STS-95) |
| **Dijk et al.** | 2001 | STS-90, STS-95 | 5 (STS-90)<br>1 (STS-95) | Self-assessment of subjective fatigue | Yes | Fatigue levels significantly worst in-flight; best post-flight. Subjective sleep quality rated significantly poorer in space. | 16 (STS-90)<br>10 (STS-95) |
| **Kelly et al.** | 2005 | STS-89 | 4 | Digit Symbol Substitution Test (DSST), Number Recognition (NR) | NR: No<br>DSST: Yes | Subjective fatigue significantly increased in-flight; small changes observed on DSST. | 10 |

*Acronym Definitions for Table 2*:
* PAWS = Performance Assessment Workstation
* AGARD = Advisory Group for Aerospace Research and Development (NATO)
* STRES = Simulated Training Requirements Effectiveness Report
* GRT = Grammatical Reasoning Test
* MST / MS = Memory Search Task
* UTT = Unstable Tracking Task
* DT = Dual Task (Unstable Tracking + Memory Search)
* VAS = Visual Analog Scale
* PVT = Psychomotor Vigilance Task
* KSS = Karolinska Sleepiness Scale
* DSST = Digit Symbol Substitution Test
* NR = Number Recognition

### 5.2 Key Ground Analog & High-Fidelity Simulation Findings
* **Mars 520-Day Isolation Simulation (Basner et al., 2013)**: 6 male subjects in 520 days of confined isolation. Sleep averaged 7.4 hours overall, but individual variations were severe: 1 participant developed a split-sleep diurnal pattern, 1 participant became free-running (circadian period ~25 hours), and 1 participant experienced severe hypokinesis, chronic partial sleep deprivation, and the vast majority of all crew PVT attention lapses.
* **Phoenix Mars Lander (PML) Ground Support (Barger et al., 2012)**: 15 flight controllers working a 24.65-hour Mars Sol schedule for 78 days averaged 6.2 hours sleep per Sol. Extended wakefulness (>21 hours) led to major performance declines. Controllers utilizing blue light boxes entrained significantly better (29% fatigue difficulty vs 50% in non-users).
* **105-Day Spaceflight Simulation (Barger et al., 2014)**: Crewmembers working an extended 24-hour shift every 6th day experienced severe cognitive performance degradation and mood deterioration during extended shifts despite utilizing naps, caffeine, and light countermeasures.

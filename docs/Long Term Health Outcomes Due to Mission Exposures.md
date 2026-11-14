# Medical Operations for Deep Space Exploration: Complete Evidence Synthesis and Technical Data Extraction

## 1. Executive Summary and Risk Definition

Human space exploration beyond Low Earth Orbit (LEO) introduces physiological, environmental, and operational challenges that exceed all prior spaceflight experience. To address these hazards, the National Aeronautics and Space Administration (NASA) established the Human Research Program (HRP). Within the HRP structure, the Exploration Medical Capabilities (ExMC) Element is specifically tasked with developing evidence-based methods, technologies, and system architectures to monitor, maintain, and treat astronaut health during long-duration exploration missions.

The formal Program Requirement Document (PRD) risk statement assigned to the ExMC Element states:
> *"Given that medical conditions/events will occur during human spaceflight missions, there is a possibility of adverse health outcomes and decrements in performance in mission and for long term health."*

Historical spaceflight medical operations (such as Mercury, Gemini, Apollo, Skylab, Space Shuttle, and the International Space Station [ISS]) operated under an Earth-centered healthcare paradigm. This paradigm relied upon three operational pillars:
1. **Real-time telemedical consultation** with ground-based flight surgeons and clinical specialists.
2. **Continuous consumable resupply** via routine logistics flights.
3. **Rapid medical evacuation** to terrestrial definitive medical care facilities when required.

For exploration-class missions—such as transit to a Near-Earth Asteroid, lunar outposts, or a human mission to Mars—none of these pillars will be available. Medical care must undergo a fundamental paradigm shift from Earth-dependent support to autonomous, self-contained, and integrated spacecraft healthcare systems.

---

## 2. Mission Architecture Constraints and Stressors

### 2.1 Habitat Design and Parametric Sizing Constraints
Vehicle and habitat design for deep space exploration is heavily constrained by mass, power, volume, and life support allocations. Parametric sizing models, such as EXAMINE, quantify trade-offs across mission architectures.

- **Healthcare Mass Allocations**: In a reference 380-day deep-space habitat mission with a crew of four, the total dry mass allocated to "Crew Healthcare" in the Mass Equipment List (MEL) was estimated at **250 kg**.
- **System Disconnects**: Historically, medical systems engineering was integrated late in vehicle design. Line items such as Crew Accommodations, Waste Collection, Personal Hygiene, and Operational Supplies contain resources that directly impact medical capability but are managed in separate engineering silos. Early integration of a dedicated Medical MEL, layout guidance, and volumetric scaling is required.

### 2.2 Communication, Telemetry, and Bandwidth Constraints
Distance from Earth creates significant signal latency and severe bandwidth limitations:
- **Mars Communication Delay**: Round-trip signal delays will reach up to **50 minutes** near Mars.
- **Bandwidth Restrictions**: Deep-space communications may restrict total crew-to-ground consultation time to as little as **1 hour within a 24-hour period**.
- **Telemetry Limits**: Ground flight surgeons will be unable to continuously monitor real-time physiological telemetry or execute live software updates, necessitating onboard autonomous decision-support architectures.

### 2.3 Evacuation Capability Constraints
Unlike LEO operations aboard the ISS where de-orbit and return to Earth can occur within hours, orbital mechanics and propulsion constraints render emergency evacuation impossible during interplanetary transit. 
- The onboard medical system must be capable of managing conditions in-situ.
- For medical events exceeding spacecraft therapeutic resources, the medical system must incorporate palliative care capabilities.

### 2.4 Deep Space Environmental Stressors
Illness and injury represent the leading historical causes of mission disruption. Deep space missions introduce severe environmental stressors:
- **Space Radiation**: Beyond the magnetosphere, exposure to Galactic Cosmic Rays (GCR) and Solar Energetic Particles (SEP) creates significantly higher risks of acute and deterministic tissue damage, carcinogenesis, and organ system degradation.
- **Isolation and Confinement**: Multi-year missions in confined volumes impose psychological stress, affecting group dynamics, cognitive performance, and behavioral health.

---

## 3. Concept of Operations (ConOps) and Ethical Framework

### 3.1 Mars Transit Concept of Operations Baseline
Systems engineering processes governed by NASA Procedural Requirements (NPR 7123.1B) require a Concept of Operations (ConOps) to define high-level operational workflows and stakeholder expectations. 

Historically, several sub-component ConOps documents were baselined:
- **Space Medicine Exploration Medical Condition List (EMCL, JSC-65722)**: Baselined in 2009, identifying medical conditions of concern for exploration.
- **Exploration Medical Conditions ConOps (JSC-65973)**: Baselined in 2010, focusing on lunar sorties and outposts.
- **Exploration Medical Capability (ExMC) ConOps (HRP-48002)**: Baselined in 2013 (updated 2014), defining ExMC research and gap management.
- **Telemedicine Operational Concepts for Near-Earth Asteroid Missions (2014)**: Defining end-to-end telemedicine architectures.

However, a validated, comprehensive ConOps specifically tailored for a Mars Transit Mission remains an unfulfilled operational requirement.

### 3.2 Ethical Framework for Exploration Care
Deep space exploration involves experimental flight architectures in uncharacterized environments. Ethical decision-making must extend beyond traditional terrestrial clinical ethics (individual patient advocacy) to encompass crew-level ethics and mission success principles.

NASA's bioethical policy is informed by the Belmont Report and the Institute of Medicine (IOM) guidelines:
1. **Avoidance of Harm & Beneficence**: Balancing the medical benefit of onboard intervention against vehicle mass/fuel penalties. For example, manifesting a complete surgical suite could draw mass/volume from life-support redundancy or fuel, increasing overall loss-of-crew (LOC) risk.
2. **Distributive Justice and Fairness**: Fair distribution of mission risks and benefits during crew selection.
3. **Respect for Autonomy & Informed Consent**: Ensuring crew members are thoroughly briefed on quantified health risks while balancing agency obligations regarding paternalism versus individual autonomy.
4. **Genetic Information Nondiscrimination Act (GINA)**: Federal regulations restrict NASA from using genetic/genomic data for crew selection or assignment; genetic data may only be collected for occupational health surveillance and countermeasure development.

---

## 4. Risk Scoping, Modeling, and Predictive Analytics

### 4.1 NASA Categories of Scientific Evidence
NASA classifies scientific evidence using four distinct categories (adapted from standard clinical evidence scales):
- **Category I**: Data based on at least one randomized controlled trial (RCT).
- **Category II**: Data based on at least one controlled study without randomization (cohort, case-control, subject as own control).
- **Category III**: Non-experimental observations, comparative/correlational studies, and case series.
- **Category IV**: Expert committee reports, authoritative opinions, clinical experience, or bench research from first principles.

*Note*: Interplanetary risk assessment frequently relies on Category III and IV data, as ground analogs and LEO experience cannot fully replicate deep-space microgravity and radiation environments.

### 4.2 Transition to Probabilistic Risk Analysis (PRA)
Historically, NASA relied on Failure Mode and Effects Analysis (FMEA) and hazard analysis (calculating Risk Priority Numbers). Following the 1986 *Challenger* mishap, NASA transitioned to quantitative **Probabilistic Risk Analysis (PRA)** utilizing event trees, fault trees, and Markov-Chain Monte Carlo simulations to quantify likelihoods and uncertainties.

### 4.3 Modeling Tools: EMCL, IMM, and MONSTR
1. **Exploration Medical Condition List (EMCL)**: Consists of **100 medical conditions** prioritized by occurrence probability and impact on crew survival and mission success.
2. **Integrated Medical Model (IMM)**: A Monte Carlo simulation tool that models event spaces for spaceflight reference missions. It draws from terrestrial and spaceflight incidence databases to output:
   - Condition probability of occurrence.
   - Event distribution.
   - Likelihood of meeting medical evacuation criteria.
   - Likelihood of Loss of Crew Life (LOCL).
   - Crew Health Index (CHI).
   - *Specialized IMM Modules*: 
     - **Bone Fracture Risk Module**: Calculates fracture risk based on skeletal loading, mission length, sex, body mass, and structural disuse.
     - **Head Injury Model**: Uses microgravity-adjusted head acceleration response models to predict traumatic head injury risks aboard spacecraft.
3. **Medical Optimization Network for Space Telemedicine Resources (MONSTR)**: Evaluates terrestrial standard-of-care call-spaces across the 100 EMCL conditions. MONSTR 2.0 ranks clinical actions, resources, and probabilities to allow mission planners to perform trade-space optimization between medical resource mass/volume and health outcome risk.
4. **Dynamic Probabilistic Risk Analysis**: Emerging dynamic PRA models track real-time resource depletion during a mission, recalculating risk posture as consumables are expended or mission parameters shift.

---

## 5. Exploration Medical Subsystems and Capabilities

### 5.1 Onboard Formulary and Pharmaceutical Stability
Provisioning a stable pharmacy for a 2.5 to 3-year Mars mission presents severe degradation challenges:

- **ISS vs. Exploration Baseline**: Currently, only **16% of the 107 medications** in the ISS formulary have an FDA-labeled shelf life exceeding 2.5 years when accounting for pre-launch procurement and integration lead times.
- **Federal Shelf Life Extension Program (SLEP)**: Administered by the DOD and FDA across 3,005 drug lots (122 products), SLEP demonstrated that **88% (2,650 lots)** could be extended past labeled expiration, with an average extension of **66 months**. However, only **12 active compounds** in SLEP overlap with the ISS operational flight formulary (*amoxicillin, atropine, ceftriaxone, clindamycin, diphenhydramine, doxycycline, epinephrine, diazepam, lidocaine, methylprednisolone, phenytoin, promethazine*).
- **Long-Term Expired Drug Potency (Cantrell et al., 2012)**: Analysis of 14 long-expired drug compounds (expired 28–40 years prior) revealed that **86% (12 of 14)** retained at least **90% of labeled potency**. Aspirin and amphetamine fell below 90%.
- **Spaceflight Exposure Degradation (Du et al., 2011)**: Pharmaceuticals flown on Space Shuttles/ISS for up to 880 days showed faster degradation of Active Pharmaceutical Ingredients (APIs) than ground controls, though API loss was generally under **20%**.
- **ISS Pilot Study (Wotring, 2016)**: Evaluated 9 ISS-stored drugs. Acetaminophen met USP specs 5 months post-expiration; loratadine, pseudoephedrine, zolpidem, and aspirin met USP specs 8 months post-expiration; melatonin failed at 11 months post-expiration.
- **Radiation Assessment (Kim & Plante, 2015)**: Calculated background space radiation radiolytic yields during a 3-year Mars journey. Concluded that space radiation doses are orders of magnitude lower than industrial sterilization doses and will not cause rapid chemical loss; degradation is primarily driven by temperature, moisture, and oxidation.
- **Stability Mitigation Techniques**:
  - *Cryogenic Storage*: Storing drug crystals at 50 K reduced radiation damage to disulfide bridges by 4x compared to 100 K (Meents et al., 2010). Freezing traps free radicals in ice matrices.
  - *Formulation Engineering*: Freeze-drying (lyophilization) and addition of free-radical scavengers/radioprotectants.
  - *Electronic Medicines Compendium (eMC)*: 63% of 40 evaluated prioritized flight drugs report terrestrial shelf lives of ≥3 years in original packaging.

#### Consumable Tracking & Personalization
- **Tracking Modalities**: Adaptation of the ISS Food Intake Tracker and deployment of Radio-Frequency Identification (RFID) tracking (*Medical Consumables Tracking project*) and the *Dose Tracker* application to automate medication inventory and usage logging.
- **Pharmacogenomics**: Utilizing genetic markers (e.g., Cytochrome P450 enzymes `CYP2D6`, `CYP2C9`, `N-acetyltransferase`) to predict individual drug metabolism variance, optimize dosing, and tailor sleep/alertness countermeasures (combining smart lighting with targeted melatonin/somnolics).

### 5.2 Musculoskeletal Rehabilitation Capabilities
Prolonged microgravity causes axial unloading, leading to skeletal muscle atrophy and bone mineral loss (~1% areal BMD loss per month). 
- **Exercise Hardware Lineage**:
  - *CEVIS* (Cycle Ergometer) & *T2* (Treadmill): Maintain cardiovascular reserve and orthostatic tolerance.
  - *iRED* (Interim Resistive Exercise Device): Elastomer-based resistance; activated muscle but failed to prevent bone density loss.
  - *ARED* (Advanced Resistive Exercise Device): Uses dual vacuum canisters providing up to **600 lbs (272 kg)** of inertial resistance. Successfully maintains bone mineral density and muscle mass, but its mass/volume is prohibitively large for exploration transit vehicles.
  - *ROCKY* (Resistive Overload Combined with Kinetic Yo-Yo): Compact exercise device developed for Orion, drastically reducing mass/volume footprints.
- **Telerehabilitation & LBNP**: Lower Body Negative Pressure (LBNP) combined with cardiovascular exercise mitigates orthostatic intolerance. Guided telerehabilitation protocols provide structured exercise therapy for injured or deconditioned crew members.

### 5.3 Clinical Decision Support and Knowledge Resources
- **Ultrasonic Guidance**: The *ADUM* (Advanced Diagnostic Ultrasound in Microgravity) and *COMFORT* projects demonstrated that non-physician crew members can perform high-yield diagnostic ultrasound exams using Just-In-Time Training (JITT) and virtual/robotic guidance.
- **Decision Support Tools**: Onboard searchable databases (*UpToDate*, *eMedicine*, *Wheeless*) combined with AI diagnostic algorithms to guide differential diagnosis, procedural execution, and resource allocation.

### 5.4 Physician Astronaut Selection and Training Architecture
- **Crew Medical Officer (CMO) Paradigm**: ISS CMOs receive **~40 hours** of total pre-flight medical training (4 hrs lecture, 5 hrs therapeutics, 10 hrs BLS/ACLS algorithms).
- **Physician Astronaut Requirement**: NASA standards mandate a fully trained **Physician Astronaut** for planetary missions exceeding **210 days**.
- **Training Maintenance & JITT**:
  - Specialized skill maintenance in high-incidence areas: dental procedures, behavioral health, musculoskeletal injury management, and diagnostic ultrasound.
  - High-fidelity simulation and Objective Structured Clinical Examinations (OSCEs) for in-flight competency verification.
  - Virtual Reality (VR) simulation to maintain procedural skills without consuming operational consumables.

---

## 6. Focused High-Risk Threats and Targeted Mitigations

### 6.1 Bone Fracture Risk
- **Pathophysiology**: Unloading induces uncoupled remodeling (increased osteoclast activity / bone resorption), reducing trabecular volume and cortical thickness.
- **Diagnostic Limitations of DXA**: Dual-energy X-ray Absorptiometry (DXA) measures 2D areal BMD (aBMD), failing to capture 3D structural, geometric, and compartmental (trabecular vs. cortical) distribution changes.
- **Quantitative Computed Tomography (QCT)**: 3D QCT imaging and finite element analysis reveal post-flight hip strength deficits that persist 2 years post-flight, which DXA fails to detect.
- **Targeted Mitigations**:
  - *Bisphosphonates*: Prophylactic administration (oral/IV) combined with resistive exercise effectively inhibits bone resorption.
  - *Quantitative Ultrasound (QUS)*: Transmission ultrasound technologies (SUNY Qin research) evaluate trabecular micro-architecture non-invasively without ionizing radiation and can stimulate localized bone healing.

### 6.2 Planetary Dust Exposure
- **Hazard Mechanics**: Extravehicular Activities (EVAs) on lunar or Martian surfaces introduce abrasive regolith into habitats via spacesuits. In microgravity, dust particles remain suspended in cabin air, creating severe ocular, dermal, and respiratory risks.
- **Apollo Operational Evidence**: Apollo 11–17 debriefings documented suit abrasion, skin irritation, upper respiratory inflammation, and suit seal failure due to dust contamination.
- **Permissible Exposure Limit (PEL)**: 
  - Benchmark toxicological studies established a 6-month episodic lunar dust exposure limit of **0.3 mg/m³** (James et al., 2014).
  - *Martian Dust Hazards*: Martian regolith contains toxic chemical species, including corrosive **perchlorates** ($\text{ClO}_4^-$), requiring distinct chemical toxicity PELs (Lam, 2015).

### 6.3 Renal Stone Formation
- **Pathophysiology**: Microgravity bone resorption releases massive calcium loads into the bloodstream (hypercalciuria). Combined with fluid shifts, operational dehydration, elevated ambient $\text{CO}_2$, and altered urinary pH/citrate levels, urinary supersaturation of calcium oxalate and calcium phosphate occurs.
- **Operational Evidence**:
  - *Cosmonaut Flight Incident*: A Soviet cosmonaut experienced severe, incapacitating renal colic aboard Salyut 7 (Lebedev, 1990), nearly forcing emergency mission de-orbit.
  - *NASA Cohort Statistics*: As of July 2015, NASA documented **37 symptomatic kidney stones in 23 astronauts** occurring pre-flight or post-flight.
- **Predictive Modeling**: The Kassemi & Thompson Population Balance Equation (PBE) analytic model demonstrates that microgravity urinary biochemistries shift astronauts into stone-forming risk profiles equivalent to recurrent terrestrial stone-formers.
- **Mitigation Framework**:
  - *Hydration Protocols*: Maintaining fluid intake to ensure high urinary volume.
  - *Pharmacological Countermeasures*: Potassium citrate administration increases urinary pH and citrate levels, complexing free calcium. Bisphosphonates reduce urinary calcium excretion.
  - *Therapeutic Ultrasound*: Development of transcutaneous ultrasonic propulsion (repositioning calculi) and Burst Wave Lithotripsy (BWL) for non-invasive stone fragmentation.

---

## 7. Technological Innovation, Medical Informatics, and Multipurpose Devices

### 7.1 In-Flight Data Architecture and Electronic Medical Records (EMR)
Current ISS medical data is fragmented across MatLab files, manual log entries, ground databases, and the Lifetime Surveillance of Astronaut Health (LSAH) repository. 
- Exploration missions require a unified, autonomous EMR hub.
- Open-source platforms (*FreeMED*, *OpenEMR*, *OpenMRS*) are being evaluated.
- NASA projects such as **EMSD** (Exploration Medical System Demonstration, tested in HERA) and **SpaceMED** prototype automated data capture from physiological sensors and diagnostic hardware, utilizing **IEEE 11073** medical device communication standards.

### 7.2 Multipurpose Diagnostic Modalities
- **Ultrasound Expansion**: Serves as the primary spaceflight imaging modality, validated for FAST (internal hemorrhage), ocular trauma, musculoskeletal injury, pneumothorax, and retroperitoneal imaging. Advanced modes incorporate therapeutic lithotripsy and bone density assessment.
- **Point-of-Care (POC) Blood Analyzers**:
  - *Abbott i-STAT*: Cartridge-based clinical chemistry; validated on orbit but limited by 1-year reagent shelf life.
  - *rHEALTH Cytometer*: Microfluidic flow cytometer developed by DNA Medicine Institute / NASA SBIR, performing complete blood counts (CBC) and white blood cell differentials in microgravity.

### 7.3 Wireless Biomonitoring
Next-generation biomonitoring replaces cumbersome multi-lead ECGs and manual cuffs with:
- Dry-cloth smart textile patches transmitting continuous wireless ECG.
- Non-invasive, cuffless continuous photoplethysmography (PPG) for blood pressure tracking.

---

## 8. NASA ExMC Research Knowledge Gaps

The ExMC Element formally identifies **13 research knowledge gaps** regarding in-flight medical risk:

1. **Med01**: We do not have a concept of operations for medical care during exploration missions.
2. **Med02**: We do not have the capability to provide a safe and effective pharmacy for exploration missions.
3. **Med03**: We do not know how to apply personalized medicine effectively to reduce health risk for a selected crew.
4. **Med04**: We do not have a defined rehabilitation capability for injured or deconditioned crewmembers during exploration missions.
5. **Med05**: We do not know how to define medical planning or operational needs for ethical issues that may arise during exploration missions.
6. **Med07**: We do not have the capability to comprehensively process medically relevant information to support medical operations during exploration missions.
7. **Med08**: We do not have quantified knowledge bases and modeling to estimate medical risk incurred on exploration missions.
8. **Med09**: We do not have the capability to predict estimated medical risk posture during exploration missions based on current crew health and resources.
9. **Med10**: We do not have the capability to provide computed medical decision support during exploration missions.
10. **Med11**: We do not have the capability to minimize medical system resource utilization during exploration missions.
11. **Med12**: We do not have the capability to mitigate select medical conditions.
12. **Med13**: We do not have the capability to implement medical resources that enhance operational innovation for medical needs.

*(Note: Gap Med06 was previously retired or merged into adjacent risk frameworks).*

---

## 9. Comprehensive Flight Evidence Tables

### Table 1: Medical Events and Symptoms Occurring During ISS Missions (Through ISS Expedition 40)
*Data Source: NASA Lifetime Surveillance of Astronaut Health (LSAH) Request #10912. Total Person-Years of Observation = 26.21.*

| Category | Complaint | N | Person-Year Incidence | EVA Attributed |
| :--- | :--- | :---: | :---: | :---: |
| **Orthopedics** | Arm | 2 | 0.14 | 2 |
| | General | 1 | 0.07 | 1 |
| | Groin | 2 | 0.14 | 1 |
| | Hamstring | 5 | 0.34 | 0 |
| | Hip | 6 | 0.41 | 0 |
| | Knee | 9 | 0.62 | 0 |
| | Leg | 3 | 0.21 | 0 |
| | Neck | 2 | 0.14 | 0 |
| | Shoulder | 8 | 0.55 | 2 |
| | Unknown | 2 | 0.14 | 0 |
| | Wrist | 3 | 0.21 | 0 |
| | **Orthopedics Total** | **43** | **2.96** | **6** |
| **Skin** | Abrasion | 9 | 0.62 | 3 |
| | Dry Skin | 4 | 0.28 | 0 |
| | Irritation | 10 | 0.69 | 2 |
| | Itch | 3 | 0.21 | 0 |
| | Laceration | 1 | 0.07 | 0 |
| | Rash | 10 | 0.69 | 0 |
| | **Skin Total** | **37** | **2.55** | **5** |
| **Headache** | Headache | 33 | 2.27 | 0 |
| | **Headache Total** | **33** | **2.27** | **0** |
| **Nasal** | Congestion | 28 | 1.93 | 1 |
| | Dry | 1 | 0.07 | 0 |
| | Irritation | 1 | 0.07 | 0 |
| | Nose Bleed | 2 | 0.14 | 0 |
| | **Nasal Total** | **32** | **2.20** | **1** |
| **Back Pain** | Back Pain | 29 | 1.99 | 2 |
| | **Back Pain Total** | **29** | **1.99** | **2** |
| **Eye** | Abnormality | 9 | 0.62 | 0 |
| | Debris | 4 | 0.28 | 0 |
| | Dry Eyes | 4 | 0.28 | 0 |
| | Irritation | 5 | 0.34 | 0 |
| | Puffy | 1 | 0.07 | 0 |
| | Watery | 4 | 0.28 | 0 |
| | **Eye Total** | **27** | **1.86** | **0** |
| **GI** | Constipation | 9 | 0.62 | 1 |
| | Diarrhea | 2 | 0.14 | 0 |
| | Hemorrhoid | 1 | 0.07 | 0 |
| | Indigestion | 8 | 0.55 | 0 |
| | Nausea | 1 | 0.07 | 0 |
| | Stomach | 1 | 0.07 | 0 |
| | **GI Total** | **22** | **1.51** | **1** |
| **Sleep** | Disruption | 1 | 0.07 | 0 |
| | Hypersomnia | 1 | 0.07 | 0 |
| | Insomnia | 19 | 1.31 | 0 |
| | Unspecified | 1 | 0.07 | 0 |
| | **Sleep Total** | **22** | **1.51** | **0** |
| **Systemic** | Fatigue | 21 | 1.44 | 5 |
| | **Systemic Total** | **21** | **1.44** | **5** |
| **SMS** | Space Motion Sickness | 16 | 1.10 | 0 |
| | **SMS Total** | **16** | **1.10** | **0** |
| **VIIP** | Visual Impairment / Intracranial Pressure | 14 | 0.96 | 0 |
| | **VIIP Total** | **14** | **0.96** | **0** |
| **Urinary** | Decreased Urination | 2 | 0.14 | 0 |
| | Dysuria | 2 | 0.14 | 0 |
| | Hematuria | 1 | 0.07 | 0 |
| | Incontinence | 1 | 0.07 | 0 |
| | Increased Urination | 2 | 0.14 | 0 |
| | Nocturia | 1 | 0.07 | 0 |
| | Retention | 1 | 0.07 | 1 |
| | Urine Reflux | 1 | 0.07 | 0 |
| | Unspecified | 1 | 0.07 | 0 |
| | **Urinary Total** | **12** | **0.83** | **1** |
| **Hand** | Hand Complaints | 9 | 0.62 | 7 |
| | **Hand Total** | **9** | **0.62** | **7** |
| **Psych** | Psychological Complaints | 9 | 0.62 | 0 |
| | **Psych Total** | **9** | **0.62** | **0** |
| **Elbow Pain** | Elbow Pain | 6 | 0.41 | 1 |
| | **Elbow Pain Total** | **6** | **0.41** | **1** |
| **Mouth Ulcer** | Mouth Ulcer | 6 | 0.41 | 0 |
| | **Mouth Ulcer Total** | **6** | **0.41** | **0** |
| **Vestibular** | Vestibular Complaints | 6 | 0.41 | 0 |
| | **Vestibular Total** | **6** | **0.41** | **0** |
| **Bruising (Blood Draw)**| Arm Bruising | 5 | 0.34 | 0 |
| | **Bruising Total** | **5** | **0.34** | **0** |
| **Ear** | Congestion | 5 | 0.34 | 1 |
| | **Ear Total** | **5** | **0.34** | **1** |
| **Neurologic** | Loss of Feeling | 5 | 0.34 | 2 |
| | **Neurologic Total** | **5** | **0.34** | **2** |
| **ENT** | Sneezing | 2 | 0.14 | 0 |
| | Sore Throat | 2 | 0.14 | 0 |
| | **ENT Total** | **4** | **0.28** | **0** |
| **Fingernail** | Delamination | 1 | 0.07 | 1 |
| | Pain | 3 | 0.21 | 3 |
| | **Fingernail Total** | **4** | **0.28** | **4** |
| **Fluid Shift** | Composition Change | 1 | 0.07 | 0 |
| | Facial Fullness | 3 | 0.21 | 0 |
| | **Fluid Shift Total** | **4** | **0.28** | **0** |
| **Thermal Comfort** | Feet | 1 | 0.07 | 1 |
| | Hands | 2 | 0.14 | 2 |
| | Unspecified | 1 | 0.07 | 1 |
| | **Thermal Comfort Total** | **4** | **0.28** | **4** |
| **Bruise** | Arm | 1 | 0.07 | 1 |
| | Hand | 1 | 0.07 | 1 |
| | Shoulder | 1 | 0.07 | 1 |
| | **Bruise Total** | **3** | **0.21** | **3** |
| **Dehydration** | Dehydration | 2 | 0.14 | 0 |
| | **Dehydration Total** | **2** | **0.14** | **0** |
| **Respiratory** | Bronchitis | 1 | 0.07 | 0 |
| | **Respiratory Total** | **1** | **0.07** | **0** |
| **GRAND TOTAL** | | **381** | **26.21** | **43** |

---

### Table 2: Occurrences of Medical Conditions Affecting NASA Astronauts (Shuttle, Mir, ISS Expedition 13)
*Data Source: NASA LSAH Historical Database (2017b).*

| Medical Condition | Event Count | Medical Condition | Event Count |
| :--- | :---: | :--- | :---: |
| Nasal congestion (space adaptation) | 389 | Skin abrasion | 94 |
| Back pain (space adaptation) | 382 | Skin rash | 94 |
| Space motion sickness (space adaptation) | 325 | Eye abrasion (foreign body) | 70 |
| Insomnia (space adaptation) | 299 | Headache (late) | 49 |
| Headache (space adaptation) | 233 | Diarrhea | 33 |
| Insomnia (late) | 133 | Respiratory infection | 33 |
| Constipation (space adaptation) | 113 | Back injury | 31 |
| Barotrauma (ear/sinus block) | 31 | Shoulder sprain/strain | 22 |
| Paresthesias | 26 | Headache ($\text{CO}_2$ induced) | 20 |
| Fingernail delamination (EVA) | 16 | Skin infection | 13 |
| Visual impairment / intracranial pressure (VIIP) | 15 | Elbow sprain/strain | 12 |
| Allergic reaction (mild to moderate) | 11 | Ankle sprain/strain | 11 |
| Pharyngitis | 11 | Mouth ulcer | 9 |
| Neck injury | 9 | Knee sprain/strain | 7 |
| Eye chemical burn | 6 | Nose bleed (space adaptation) | 6 |
| Sinusitis | 6 | Indigestion | 6 |
| Eye infection | 5 | Urinary incontinence (space adaptation) | 5 |
| Urinary retention (space adaptation) – female | 5 | Urinary tract infection – female | 5 |
| Wrist sprain/strain | 5 | Gastroenteritis | 4 |
| Urinary retention (space adaptation) – male | 4 | Urinary tract infection – male | 4 |
| Otitis externa | 3 | Otitis media | 3 |
| Choking / obstructed airway | 3 | Smoke inhalation | 3 |
| Hemorrhoids | 2 | Finger dislocation | 1 |
| Herpes Zoster reactivation (shingles) | 1 | Influenza | 1 |
| Skin laceration | 1 | | |

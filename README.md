# DNEM Scientific Platform v7.7

> **Deterministic Neurocognitive Experimental Measurement & Scientific Governance Platform**  
> *L0 → L8 Ontological Architecture • 170 Operational Specifications • Cryptographic Reproducibility Ledger*

[![Runtime: Node.js 22](https://img.shields.io/badge/Runtime-Node.js%2022-brightgreen.svg)](https://nodejs.org)
[![Frontend: React 18 + Vite](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-blue.svg)](https://vitejs.dev)
[![TypeScript: 5.7](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org)
[![Styling: Tailwind CSS 4](https://img.shields.io/badge/Styling-Tailwind%20CSS%204-38bdf8.svg)](https://tailwindcss.com)
[![Status: Implementation Baseline](https://img.shields.io/badge/Scientific%20Status-Implementation%20Baseline-amber.svg)](#scientific-boundary--epistemic-disclaimer)

---

## Table of Contents

1. [Executive Overview](#executive-overview)
2. [Scientific Boundary & Epistemic Disclaimer](#scientific-boundary--epistemic-disclaimer)
3. [Core Capabilities & Architectural Pillars](#core-capabilities--architectural-pillars)
4. [The 9-Level Ontological Hierarchy (L0 → L8)](#the-9-level-ontological-hierarchy-l0--l8)
5. [The 170 Operational Measurement Specifications](#the-170-operational-measurement-specifications)
6. [Interactive Application Modules (13 UI Tabs)](#interactive-application-modules-13-ui-tabs)
7. [Getting Started & Usage Instructions](#getting-started--usage-instructions)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Development Mode](#development-mode)
   - [Production Build & Run](#production-build--run)
   - [Type Checking & Linting](#type-checking--linting)
   - [Container Deployment (Docker)](#container-deployment-docker)
8. [Complete Technical Architecture](#complete-technical-architecture)
   - [Runtime Architecture](#runtime-architecture)
   - [Deterministic State Machine (12-State Lifecycle)](#deterministic-state-machine-12-state-lifecycle)
   - [Cryptographic Audit & Tamper-Detection Engine](#cryptographic-audit--tamper-detection-engine)
   - [Statistical Analysis Plan (SAP) Execution Pipeline](#statistical-analysis-plan-sap-execution-pipeline)
   - [Evidence & Claim Graph Engine (v2.0)](#evidence--claim-graph-engine-v20)
   - [L8 Model Revision Lineage Engine (v2.0)](#l8-model-revision-lineage-engine-v20)
9. [REST API Reference](#rest-api-reference)
10. [Repository Structure](#repository-structure)
11. [License](#license)

---

## Executive Overview

The **DNEM Scientific Platform v7.7** is a computational research environment designed to establish formal operational contracts, deterministic execution, and cryptographic provenance for cognitive science and neuroscience experimentation.

Traditional cognitive and psychological software often suffers from unstandardized trial timing, ad-hoc post-hoc outlier exclusions ("p-hacking"), hidden researcher degrees of freedom, and untracked model revisions. The DNEM Platform addresses these challenges by providing:

- **Sub-millisecond Deterministic Execution:** Hardware-synchronized event timers, strict trial-level data contracts, and reproducible pseudo-random seeding.
- **Formal Preregistration Protocol Locks:** Cryptographic freezing of study parameters, primary outcomes, and hypotheses prior to experimental data collection.
- **Automated Statistical Analysis Plans (SAP):** Effect size computation (Cohen's $d$), 95% confidence intervals, False Discovery Rate (Benjamini-Hochberg FDR) multiplicity corrections, and outlier perturbation sensitivity tests.
- **Cryptographic Provenance Blockchain:** A continuous SHA-256 hash chain covering the full pipeline:
  $$\text{Experiment} \longrightarrow \text{Dataset} \longrightarrow \text{Software Version} \longrightarrow \text{Analysis} \longrightarrow \text{Evidence} \longrightarrow \text{Claim} \longrightarrow \text{Decision}$$
- **Evidence & Claim Graph (v2.0):** Machine-readable directed acyclic graph binding empirical outcomes to theoretical claims without treating graph connectivity alone as empirical proof.
- **L8 Model Revision Lineage Engine (v2.0):** Explicit parameter diff contracts and successor research cycle descriptors that prevent unrecorded model drift.

---

## Scientific Boundary & Epistemic Disclaimer

> [!WARNING]
> **Formal Scientific & Methodological Boundary**
> 
> The DNEM Scientific Platform provides the **computational scaffold** for reproducible experimental psychology: deterministic event timing, formal data contracts, reproducible state machines, and cryptographic decision ledgers.
> 
> **It intentionally does not declare candidate constructs or computational tasks to be scientifically valid.**
> 
> Construct validity, ecological validity, population norming, and causal inference require empirical preregistered trials, independent peer replication, psychometric invariance testing, and external clinical or behavioral validation. Synthetic demo data generated within this package are strictly for software verification and pipeline testing.

---

## Core Capabilities & Architectural Pillars

| Pillar | Description | Implementation |
| :--- | :--- | :--- |
| **Deterministic Runtime** | Zero-jitter trial execution contracts with seed-based repeatable pseudo-random event streams. | `src/server/runtimeService.ts`, `src/server/resultsService.ts` |
| **170-Measurement Registry** | Complete library of 170 formal operational specifications across 34 cognitive and neurofunctional domains. | `src/server/registry.ts`, `OPERATIONAL_SPECIFICATIONS_170.md` |
| **Preregistration Locks** | SHA-256 protocol freezing with audited post-hoc amendment chaining. | `src/server/protocolService.ts` |
| **Dataset Governance** | Immutable dataset locks, blinded participant cohort assignment, and checksum enforcement. | `src/server/experimentService.ts` |
| **Statistical Rigor** | Automated SAP executor enforcing Benjamini-Hochberg FDR corrections and sensitivity tests. | `src/server/analysisService.ts` |
| **Audit Ledger** | Continuous SHA-256 parent-hash chain with real-time byte tamper detection. | `src/server/governanceRuntime.ts` |
| **Model Revision Lineage** | Explicit evidence-linked model updates with formal parameter diff contracts (`+`/`-`). | `src/server/modelRevisionService.ts` |

---

## The 9-Level Ontological Hierarchy (L0 → L8)

The platform models experimental human and computational cognition across nine hierarchical strata:

```
[L8] Model Revision / Meta-Level (Lineage diffs, successor cycle descriptors)
  ▲
[L7] Development (Ontogenetic trajectories, age curves, plasticity)
  ▲
[L6] Action / Social / Environment (Theory of mind, ecological action loops)
  ▲
[L5] Meaning / Future / Identity (Narrative coherence, prospective simulation)
  ▲
[L4] Self / Values / Goals (Sense of agency, intentional valuation)
  ▲
[L3] Regulation / Adaptation (Cognitive load, resilience, error recovery, active inference)
  ▲
[L2] Cognitive Processes (Fluid reasoning, working memory, attention, executive function)
  ▲
[L1] Biological / Neural (Autonomic, EEG ERPs, spectral powers, neuroendocrine)
  ▲
[L0] Reality / External World (Sensory physics, hardware photodiode sync, input display timing)
```

1. **L0 • Reality / External World**: Environmental physics, display refresh timing, input latency calibration, photodiode triggers.
2. **L1 • Biological / Neural**: Autonomic arousal, pupil dilation, EEG event-related potentials (P300, N200), resting power spectra.
3. **L2 • Cognitive Processes (Tier I)**: Core cognitive faculties validated through psychometric frameworks (CHC model): Fluid Intelligence ($G_f$), Working Memory Updating ($G_{wm}$), Processing Speed ($G_s$), Selective Attention, Inhibitory Control, Cognitive Flexibility.
4. **L3 • Regulation / Learning / Adaptation (Tier II)**: Dynamic regulatory processes: Cognitive Load capacity curves, error recovery latency, Bayesian active inference updating, strategy switching.
5. **L4 • Self / Values / Goals**: Subjective sense of agency, effort-reward trade-off valuation, value-directed memory.
6. **L5 • Meaning / Future / Identity**: Narrative coherence metrics, prospective episodic simulation, autobiographical continuity.
7. **L6 • Action / Social / Environment**: Interactive Theory of Mind (ToM), dyadic cooperation, ecologically valid visual search.
8. **L7 • Development**: Longitudinal growth trajectories, cognitive reserve modulation, lifespan plasticity parameters.
9. **L8 • Model Revision / Meta-Level**: Formal meta-scientific governance: immutable audit ledgers, evidence-linked model parameter diffs, and non-automated successor research cycle descriptors.

---

## The 170 Operational Measurement Specifications

The platform includes **170 operational neurocognitive measurement specifications** spanning **34 domain codes**, organized into three rigorous validation tiers:

- **Tier I: Foundational Cognitive & Sensory Architecture (Domains C01–C11)**  
  *Examples:* Matrix Reasoning (`C01-01`), 2-Back Updating (`C02-01`), Visual Search RT (`C03-01`), Stroop Inhibition (`C05-01`), Task Switching (`C06-01`).
- **Tier II: Dynamic Adaptation, Load & Regulation (Domains R01–R10)**  
  *Examples:* Baseline Load Titration (`R01-01`), Cognitive Fatigue Slope (`R02-01`), Error Correction Post-Error Slowing (`R03-01`), Bayesian Model Updating (`R09-01`).
- **Tier III: Higher-Order, Ecological & Integrative Functions (Domains H01–H13)**  
  *Examples:* Social Reading the Mind in the Eyes (`H01-01`), Sense of Agency Intentional Binding (`H02-01`), Narrative Coherence (`H04-01`), Spectral Power EEG Bands (`H10-01`), Cortisol Autonomic Index (`H11-01`).

Each specification defines explicit stimulus timing contracts, valid response intervals, exclusion criteria, photodiode triggers, and target metrics.

---

## How Tests Work in the Platform

The DNEM v7.7 platform provides **two distinct, complementary testing paradigms**: an **Interactive Participant Test Chamber** for empirical human participant testing, and an **Automated Synthetic Batch Engine** for computational simulation across all 170 operational specifications.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           DNEM v7.7 TESTING ENGINE                              │
├────────────────────────────────────────┬────────────────────────────────────────┤
│   Mode 1: Interactive Test Chamber     │   Mode 2: Synthetic Batch Engine       │
│   (Empirical Human Participant)        │   (Computational Protocol Simulation)  │
├────────────────────────────────────────┼────────────────────────────────────────┤
│ • Real-time participant interaction    │ • Batch simulation across 170 specs    │
│ • Sub-millisecond RT (performance.now) │ • Deterministic PRNG seeding           │
│ • Keyboard shortcuts & touch controls  │ • Full statistical pipeline dry-runs   │
│ • Trial-by-trial interference analysis │ • Synthetic protocol verification      │
│ • Cryptographic SHA-256 session lock   │ • Pre-registration baseline testing   │
└────────────────────────────────────────┴────────────────────────────────────────┘
```

### 1. Interactive Participant Test Chamber (Empirical Human Testing)

The **Interactive Test Chamber** allows researchers and participants to take real, live cognitive tests directly in the browser with laboratory-grade stimulus presentation and response timing.

#### Available Live Paradigms:
1. **Stroop Color-Word Interference (`C05-01`)**
   - **Domain:** Cognitive Control & Inhibitory Control
   - **Protocol:** Participants identify the font ink color while ignoring the semantic word meaning. Trials present congruent stimuli (e.g., "RED" in red ink) and incongruent stimuli (e.g., "BLUE" in yellow ink).
   - **Controls:** Keyboard shortcuts (`[R]` Red, `[G]` Green, `[B]` Blue, `[Y]` Yellow) or interactive on-screen color pads.
   - **Target Metric:** Stroop Interference Cost ($\Delta \text{RT}_{\text{incongruent}} - \text{RT}_{\text{congruent}}$) and inhibitory accuracy.

2. **2-Back Working Memory Buffer (`C02-01`)**
   - **Domain:** Working Memory & Executive Updating
   - **Protocol:** Rapid sequential presentation of letter stimuli (e.g., `K → M → K`). The participant must signal whether the current letter matches the stimulus presented exactly 2 steps prior.
   - **Controls:** Keyboard `[Space]` or click **"MATCH (Target)"** button; non-matches auto-advance.
   - **Target Metric:** Signal detection $d'$, hit rate, false alarm rate, and memory updating latency.

3. **Choice Reaction Time (`C03-01`)**
   - **Domain:** Sensorimotor Speed & Response Selection
   - **Protocol:** Central fixation crosshair with randomized foreperiod jitter (500–1200 ms) followed by a lateralized visual stimulus probe (`◄ LEFT` vs. `RIGHT ►`).
   - **Controls:** Left arrow `[←]` or `[A]`; Right arrow `[→]` or `[D]`.
   - **Target Metric:** Sensorimotor reaction time distribution (mean, median, standard deviation) and directional accuracy.

4. **Eriksen Flanker Task (`C04-01`)**
   - **Domain:** Selective Attention & Distractor Suppression
   - **Protocol:** Participants focus on a central target arrow flanked by congruently oriented arrows (`<<<<<`) or incongruently oriented distractors (`<<><<`).
   - **Controls:** Left arrow `[←]` / `[A]` vs. Right arrow `[→]` / `[D]`.
   - **Target Metric:** Flanker interference cost ($\Delta \text{RT}_{\text{incongruent}} - \text{RT}_{\text{congruent}}$) and distractor suppression rate.

5. **Matrix Reasoning (`C01-01`)**
   - **Domain:** Fluid Intelligence & Abstract Relational Reasoning
   - **Protocol:** 2×2 or 3×3 visual pattern matrix with a missing cell. Participants analyze geometric relationships (progression, rotation, set completion) and select the correct option among 4 alternatives.
   - **Controls:** Numeric keys `[1]`–`[4]` or option selection buttons.
   - **Target Metric:** Relational reasoning accuracy and problem-solving latency.

#### Laboratory Timing & Precision:
- **Timestamping:** High-resolution timers via `performance.now()` capture stimulus onset, keyboard event dispatch, and input registration at sub-millisecond precision.
- **Foreperiod & Fixation:** Inter-trial intervals (ITIs) and fixation crosshairs prevent anticipatory responding.
- **Trial Validation:** Anticipatory responses ($<150\text{ ms}$) or late responses ($>3000\text{ ms}$) are flagged and isolated in accordance with the 170 operational specifications.

#### Cryptographic Session Locking:
Upon test completion, empirical trial logs are submitted to the backend via `POST /api/v1/sessions/:id/submit-human-trials`:
- Computes mean RT, standard error, congruent/incongruent splits, and accuracy.
- Computes a canonical **SHA-256 dataset checksum** over all recorded trials and timestamps.
- Advances the session state machine to `LOCK` (preventing retrospective alteration).
- Emits cryptographic receipts to the immutable scientific audit ledger.

---

### 2. Automated Synthetic Batch Engine (Multi-Measurement Simulation)

For protocol pre-registration, pipeline validation, and power calculations prior to human recruitment, the platform provides a deterministic synthetic batch engine:
- **Registry Execution:** Researchers enter any combination of measurement IDs from the 170 specifications (e.g., `C01-01, C02-01, C03-01` or `R01-R03`).
- **Trial Scaling:** Configurable trial counts per measurement (1 to 100 trials).
- **Deterministic Seeding:** Controlled PRNG seed ensures 100% bitwise reproducible simulation runs.
- **Instant Governance Verification:** One-click evaluation of synthetic runs through the Scientific Governance engine and Audit Reproducibility suite.

---

### 3. How to Launch and Take Tests in the Interface

Tests can be initiated from multiple entry points across the application:

1. **Research Runtime Tab (`research-runtime`)**:
   - Click the **"Take Interactive Test (Human Participant)"** mode switch at the top.
   - Select your target paradigm from the interactive selector (Stroop, 2-Back, Choice RT, Flanker, Matrix Reasoning).
   - Review instructions and key bindings, click **"Begin Test"**, wait for the 3-second countdown, and complete the trial series.
   - Review live performance charts, accuracy breakdown, and cryptographic checksum.
2. **Measurement Registry Tab (`measurement-registry`)**:
   - Browse or filter the 170 measurement specifications.
   - Click the **"Test"** badge on any measurement row or the **"Take Live Test"** button in the specification detail drawer to immediately transition into the test chamber for that paradigm.
3. **Study Builder Tab (`study-builder`)**:
   - Design and freeze an experimental study protocol containing one or more domain batteries.
   - Click **"Take Live Test for this Study (Human Participant)"** to instantiate an empirical session tied directly to that study's preregistered protocol ID.
4. **Overview Tab (`/`)**:
   - Click the **"Take Live Cognitive Test"** button in the primary hero card to begin testing immediately.

---

## Interactive Application Modules (13 UI Tabs)

The user interface is structured into 13 specialized research modules accessible via the top navigation bar:

1. **Overview (`/`)**: High-level platform health, system status, quick navigation cards, and epistemic boundary disclosures.
2. **9-Level Architecture**: Deep dive into levels L0 through L8, listing theoretical foundations, constructs, associated domains, and input/output contracts.
3. **Study Builder**: Interactive creation of experimental batteries, custom domain selection (Tier I, II, III), pseudo-random seed configuration, and cryptographic protocol freezing (`FROZEN`).
4. **Measurement Registry**: Filterable catalog of all 170 operational specifications with search by ID, domain, tier, and paradigm type.
5. **Experiment Workspace**: Dataset cohort configuration, condition matrix setup, blinding enforcement, and cryptographic data locking (`LOCKED`).
6. **Research Runtime**: Interactive execution workbench for running compiled measurement batteries with custom trial counts, event stream logs, and instant session audit verification.
7. **Results & Analysis**: Preregistered Statistical Analysis Plan (SAP) executor computing Cohen's $d$, 95% CIs, Benjamini-Hochberg FDR $q$-values, and outlier exclusion stability audits.
8. **Evidence & Claim Graph**: Visual DAG inspector displaying nodes (Hypotheses, Results, Evidence, Claims, Contradictions) and directed relations (`SUPPORTS`, `CONTRADICTS`, `BINDS_TO`).
9. **Protocols & Preregistration**: Protocol lock manager enabling researchers to cryptographically lock experimental parameters and track post-hoc amendments with hash lineage.
10. **Scientific Governance**: Complete governance dashboard auditing Analysis Integrity Scores, gate thresholds, replication criteria, and decision ledgers.
11. **Audit & Reproducibility**: Cryptographic audit suite with live SHA-256 chain verification, interactive byte-tampering simulations, and canonical snapshot exports.
12. **L8 Model Revision**: Lineage engine for committing formal, evidence-linked model updates with parameter diffs and successor cycle descriptors.
13. **About**: Epistemic boundaries, software architecture specifications, mathematical paradigms, and theoretical influences (Popper, Lakatos, CHC, Friston).

---

## Getting Started & Usage Instructions

### Prerequisites

- **Node.js**: Version 22.x LTS (recommended: `v22.13.0` or higher)
- **Package Manager**: `npm` (v10+) or `bun`
- **Modern Web Browser**: Chrome, Firefox, Safari, or Edge

### Installation

Clone the repository and install all required dependencies:

```bash
# Clone the repository
git clone https://github.com/your-username/dnem-scientific-platform.git
cd dnem-scientific-platform

# Install dependencies
npm install
```

### Development Mode

Start the integrated development server (runs Express and Vite concurrently via `tsx` on port `3000`):

```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

> **Note on Port 3000:** The platform dev server binds to `0.0.0.0:3000`, making it directly accessible in local environments and containerized cloud setups (e.g. Google Cloud Run).

### Production Build & Run

To compile the frontend SPA and bundle the Express server for production:

```bash
# Compile Vite frontend to dist/ and bundle server.ts to dist/server.cjs
npm run build

# Start the compiled production server
npm run start
```

### Type Checking & Linting

Verify TypeScript types across the entire client and server codebase:

```bash
npm run lint
```

### Container Deployment (Docker)

Build and run the platform in a standard container:

```bash
# Build the Docker image
docker build -t dnem-scientific-platform:7.7 .

# Run container mapping port 3000
docker run -p 3000:3000 -e NODE_ENV=production dnem-scientific-platform:7.7
```

---

## Complete Technical Architecture

### Runtime Architecture

```
┌────────────────────────────────────────────────────────┐
│                   Vite / React 18 SPA                  │
│  (Tailwind CSS v4, Lucide Icons, Motion Animation)     │
└───────────────────────────┬────────────────────────────┘
                            │ REST / JSON (port 3000)
┌───────────────────────────▼────────────────────────────┐
│                  Express Backend Server                │
├────────────────────────────────────────────────────────┤
│  • Measurement Registry Service (170 Specs)            │
│  • Study Builder & Lifecycle Service                   │
│  • Deterministic Synthetic Runtime Service             │
│  • Statistical Analysis Plan (SAP) Executor            │
│  • Evidence & Claim Graph Service (v2.0)               │
│  • Preregistration Protocol Lock Service               │
│  • Cryptographic Governance & Audit Ledger             │
│  • L8 Model Revision Lineage Engine                    │
└────────────────────────────────────────────────────────┘
```

### Deterministic State Machine (12-State Lifecycle)

Every study and session moves strictly through an explicit 12-state deterministic state machine:

```
[01 PRE_INITIALIZATION]
         │
         ▼
[02 PROTOCOL_SPECIFIED] ──► [03 PREREGISTRATION_FROZEN]
                                     │
                                     ▼
[04 SESSION_INITIALIZED] ──► [05 HARDWARE_CALIBRATED]
                                     │
                                     ▼
[06 BLINDED_EXECUTION] ──► [07 TRIAL_STREAM_CAPTURED]
                                     │
                                     ▼
[08 DATASET_TAMPER_SEALED] ──► [09 PREREGISTERED_SAP_EXECUTED]
                                     │
                                     ▼
[10 EVIDENCE_GRAPH_BOUND] ──► [11 DECISION_GATE_EVALUATED]
                                     │
                                     ▼
                             [12 AUDITED_ARCHIVED]
```

State transitions are validated by `stateMachine.ts`. Any transition outside this explicit sequence triggers an invalid transition error.

### Cryptographic Audit & Tamper-Detection Engine

The governance ledger (`src/server/governanceRuntime.ts`) computes SHA-256 digests for each state transition:

$$\text{Block Hash}_i = \text{SHA-256}\left(\text{Parent Hash}_{i-1} \parallel \text{Timestamp} \parallel \text{Event Name} \parallel \text{Payload}\right)$$

If any event or data payload in the chain is modified post-hoc, verification immediately fails (`CHAIN MISMATCH`), preventing retrofitted analyses or undocumented exclusions.

### Statistical Analysis Plan (SAP) Execution Pipeline

The automated SAP pipeline (`src/server/analysisService.ts`) runs confirmatory analysis on frozen datasets:

1. **Effect Size Estimation:** Standardized Cohen's $d$:
   $$d = \frac{\bar{X}_1 - \bar{X}_2}{s_{\text{pooled}}}$$
2. **Confidence Intervals:** 95% analytical or bootstrapped CI bounds $[CI_{low}, CI_{high}]$.
3. **Multiplicity Correction:** Benjamini-Hochberg False Discovery Rate (FDR):
   $$P_{(i)} \le \frac{i}{m} Q$$
4. **Sensitivity Perturbation Test:** Re-evaluates effect sizes under ad-hoc exclusion shifts to ensure conclusions are immune to threshold adjustments.

### Evidence & Claim Graph Engine (v2.0)

Implements a machine-readable provenance DAG (`src/server/evidenceGraphService.ts`):
- **Nodes:** `HYPOTHESIS`, `MEASUREMENT`, `DATASET`, `RESULT`, `EVIDENCE`, `CLAIM`, `CONTRADICTION`.
- **Directed Edges:** `SUPPORTS`, `CONTRADICTS`, `BINDS_TO`, `DERIVED_FROM`.
- **Invariant:** A `CLAIM` cannot enter a `VALIDATED` state if an unmediated `CONTRADICTS` edge exists from a confirmatory replication test.

### L8 Model Revision Lineage Engine (v2.0)

Maintains formal records of scientific model updates (`src/server/modelRevisionService.ts`):
- Immutable ancestor references (`parent_model_id`).
- Cryptographic anchors to decision heads and evidence nodes.
- Explicit parameter diff contracts (specifying lines added, removed, or modified).
- Successor research cycle descriptor generation to guide subsequent investigations.

---

## REST API Reference

All endpoints return JSON and are prefixed with `/api/v1`.

### System & Health

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Health check, version status, and scientific status flag. |
| `GET` | `/api/v1/architecture/levels` | Returns descriptions and specifications for levels L0–L8. |

### Measurement Registry

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/measurements` | List all 170 registered measurement specifications. |
| `GET` | `/api/v1/measurements/:id` | Retrieve detailed operational specification for a measurement ID. |

### Studies & Sessions

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/studies` | Create a new study container (`title`, `measurement_ids`, `seed`). |
| `POST` | `/api/v1/studies/:id/freeze` | Cryptographically freeze study protocol into state `FROZEN`. |
| `POST` | `/api/v1/studies/:id/sessions` | Initialize a session for participant (`participant_id`, `seed`). |
| `POST` | `/api/v1/sessions/:id/submit-human-trials` | Submit empirical human participant trials, compute RT/accuracy metrics, and apply SHA-256 session lock. |
| `POST` | `/api/v1/sessions/:id/demo-run` | Execute synthetic trial stream for an active session. |
| `GET` | `/api/v1/demo-result` | Retrieve calculated result metrics for a completed session. |

### Research Runtime & Datasets

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/research/compile-run` | Compile and run measurement battery (`measurement_ids`, `trials`). |
| `GET` | `/api/v1/experiment/datasets` | List all registered experimental cohort datasets. |
| `POST` | `/api/v1/experiment/datasets` | Create new dataset (`name`, `condition_matrix`, `sample_size`). |
| `POST` | `/api/v1/experiment/datasets/:id/lock` | Cryptographically seal dataset with SHA-256 data lock. |

### Analysis & Preregistration

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/analysis/statistical-plan` | Execute preregistered SAP (`study_id`, `primary_outcome`, `sample_size`). |
| `GET` | `/api/v1/protocols/preregistration` | List all registered preregistration locks. |
| `POST` | `/api/v1/protocols/preregistration/lock` | Freeze new protocol lock (`study_id`, `title`, `hypotheses`). |
| `POST` | `/api/v1/protocols/preregistration/:id/amend` | Formally register an audited protocol amendment (`reason`). |

### Governance, Evidence & Model Lineage

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/evidence/graph` | Retrieve Evidence & Claim Graph nodes, edges, and canonical hash. |
| `GET` | `/api/v1/governance/snapshot` | Retrieve complete governance snapshot and verify ledger chain. |
| `POST` | `/api/v1/governance/session` | Run session-level governance checks. |
| `POST` | `/api/v1/governance/persisted` | Run full persisted governance evaluation. |
| `GET` | `/api/v1/model-revision/lineage` | List complete L8 model revision lineage history. |
| `POST` | `/api/v1/model-revision/create` | Commit a new L8 model revision record (`model_id`, `parent_id`, `reason`, `changes`). |

---

## Repository Structure

```
├── docs/                                  # Formal specifications and technical guides
│   ├── TECHNICAL_DOCUMENTATION.md         # In-depth architectural & math specification
│   ├── OPERATIONAL_SPECIFICATIONS_170.md  # All 170 neurocognitive specifications
│   ├── EVIDENCE_CLAIM_GRAPH_v2.0.md       # Graph schema and provenance rules
│   ├── STATISTICAL_ANALYSIS_PLAN_EXECUTOR_v1.0.md # SAP executor documentation
│   ├── BLINDING_DATA_LOCK_v1.0.md         # Blinding protocol guidelines
│   └── ...                                # Domain results and replication engines
├── src/
│   ├── components/                        # React UI component views
│   │   ├── Header.tsx                     # Top navigation and status bar
│   │   ├── OverviewTab.tsx                # Overview and system telemetry
│   │   ├── NineLevelArchitectureTab.tsx   # L0–L8 interactive explorer
│   │   ├── StudyBuilderTab.tsx            # Experimental battery builder
│   │   ├── MeasurementRegistryTab.tsx     # 170-specification catalog
│   │   ├── ExperimentWorkspaceTab.tsx     # Dataset blinding and locks
│   │   ├── ResearchRuntimeTab.tsx         # Battery compilation & trial runner
│   │   ├── ResultsAnalysisTab.tsx         # Preregistered SAP analysis
│   │   ├── EvidenceClaimGraphTab.tsx      # DAG evidence & claim inspector
│   │   ├── ProtocolsPreregistrationTab.tsx# Protocol freeze and amendments
│   │   ├── ScientificGovernanceTab.tsx    # Integrity gates and decision chain
│   │   ├── AuditReproducibilityTab.tsx    # SHA-256 ledger & tamper test
│   │   ├── ModelRevisionTab.tsx           # L8 revision diff lineage engine
│   │   └── AboutTab.tsx                   # Epistemic limits and theoretical roots
│   ├── server/                            # Backend services and business logic
│   │   ├── registry.ts                    # 170 operational specifications database
│   │   ├── architectureData.ts            # L0–L8 level definitions & contracts
│   │   ├── studyService.ts                # Study creation and protocol freeze
│   │   ├── runtimeService.ts              # Session and trial execution engine
│   │   ├── resultsService.ts              # Metric calculation and battery compilation
│   │   ├── experimentService.ts           # Cohort dataset governance & locks
│   │   ├── analysisService.ts             # SAP statistical analysis execution
│   │   ├── evidenceGraphService.ts        # Evidence & Claim DAG generator
│   │   ├── protocolService.ts             # Preregistration locks and amendments
│   │   ├── governanceRuntime.ts           # Cryptographic SHA-256 audit ledger
│   │   ├── modelRevisionService.ts        # L8 model revision lineage tracker
│   │   └── stateMachine.ts                # 12-state deterministic state machine
│   ├── types.ts                           # Global TypeScript interface declarations
│   ├── App.tsx                            # Primary UI state and tab router
│   ├── main.tsx                           # React entry point
│   └── index.css                          # Tailwind CSS v4 styling entry
├── index.html                             # Browser entry point
├── metadata.json                          # AI Studio application metadata
├── package.json                           # NPM dependencies and scripts
├── server.ts                              # Express server + Vite middleware
├── tsconfig.json                          # TypeScript configuration
└── vite.config.ts                         # Vite configuration
```

---

## License

This software is released under the **MIT License**. See [LICENSE](LICENSE) for details.

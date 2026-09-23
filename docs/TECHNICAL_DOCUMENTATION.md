# DNEM Scientific Platform v7.7 — Technical Documentation & Engineering Manual

> **Document Version:** 7.7.0  
> **Classification:** Technical Reference Specification  
> **Status:** Implementation Baseline / Deterministic Execution Scaffold  

---

## 1. System Overview & Engineering Scope

The **Deterministic Neurocognitive Experimental Measurement (DNEM)** platform is a full-stack, TypeScript-based computational research engine. It guarantees reproducible operational task execution, cryptographic data provenance, and automated statistical governance across human and machine neurocognitive research.

```
┌────────────────────────────────────────────────────────────────────────┐
│                          PRESENTATION LAYER                            │
│           React 18 SPA • Tailwind CSS v4 • Lucide React Icons          │
│                13 Interactive High-Fidelity Scientific Tabs            │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ JSON over HTTP (Port 3000)
┌───────────────────────────────────▼────────────────────────────────────┐
│                         APPLICATION API LAYER                          │
│        Node.js 22 Express Server (`server.ts`) • REST API (`/api/v1`)  │
├────────────────────────────────────────────────────────────────────────┤
│                           CORE ENGINE SERVICES                         │
│                                                                        │
│  ┌───────────────────────┐ ┌──────────────────────┐ ┌────────────────┐ │
│  │ Measurement Registry  │ │    Study Builder     │ │ Runtime Engine │ │
│  │ (170 Specifications)  │ │ (Lifecycle & Freeze) │ │ (Event Timers) │ │
│  └───────────────────────┘ └──────────────────────┘ └────────────────┘ │
│  ┌───────────────────────┐ ┌──────────────────────┐ ┌────────────────┐ │
│  │ Experiment Governance │ │    SAP Statistical   │ │ Evidence Graph │ │
│  │ (Cohorts & Data Locks)│ │   (FDR & Effect Size)│ │  (DAG Engine)  │ │
│  └───────────────────────┘ └──────────────────────┘ └────────────────┘ │
│  ┌───────────────────────┐ ┌──────────────────────┐ ┌────────────────┐ │
│  │ Preregistration Locks │ │ Cryptographic Audit  │ │  L8 Lineage    │ │
│  │ (Protocol Amendments) │ │  (SHA-256 Blockchain)│ │ (Model Diffs)  │ │
│  └───────────────────────┘ └──────────────────────┘ └────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Ontological Architecture (L0 → L8)

The platform formally segregates empirical phenomena into a 9-level hierarchical pipeline. No higher-level construct is asserted without satisfying lower-level operational and calibration constraints:

| Level | Ontological Layer | Physical & Theoretical Scope | Key Associated Domains | Formal Input/Output Contract |
| :--- | :--- | :--- | :--- | :--- |
| **L0** | Reality / External World | Physical stimulus display, input devices, refresh cycles, optical triggers. | Photodiode, USB Polling, Display Sync | Input: Physical time $t \in \mathbb{R}$. Output: Hardware-stamped event stream. |
| **L1** | Biological / Neural | Physiological arousal, pupil dilation, EEG ERP components, autonomic tone. | H10 (EEG Spectral), H11 (Autonomic/Cortisol) | Input: Sensor time-series. Output: Processed biometric feature vectors. |
| **L2** | Cognitive Processes | Foundational cognitive abilities (CHC Model): Fluid Reasoning ($G_f$), Working Memory ($G_{wm}$), Attention, Processing Speed ($G_s$). | C01–C11 (Tier I Domains) | Input: Stimulus trials. Output: Reaction time (ms), accuracy (0/1), $d'$ sensitivity. |
| **L3** | Regulation / Adaptation | Cognitive load tolerance, error monitoring, Bayesian belief updating, active inference. | R01–R10 (Tier II Domains) | Input: Sequential block performance. Output: Load capacity slopes, post-error slowing. |
| **L4** | Self / Values / Goals | Subjective agency, effort-reward trade-offs, goal arbitration. | H02 (Agency), H05 (Valuation) | Input: Value-choice trials. Output: Subjective binding window (ms), discounting factor $k$. |
| **L5** | Meaning / Future / Identity | Narrative coherence, prospective simulation, episodic autobiographical memory. | H03 (Self-Continuity), H04 (Narrative) | Input: Narrative prompts. Output: Coherence semantic vector similarity. |
| **L6** | Action / Social / Environment | Interactive Theory of Mind (ToM), dyadic cooperation, ecologically situated action. | H01 (ToM), H07 (Ecological Action) | Input: Social cues / partner actions. Output: Mental state attribution latency and accuracy. |
| **L7** | Development | Ontogenetic curves, lifespan plasticity, cognitive reserve modulation. | H06 (Developmental Trajectories) | Input: Cross-sectional/longitudinal age data. Output: Age-adjusted normative percentiles. |
| **L8** | Model Revision / Meta-Level | Meta-scientific governance: immutable audit ledgers, parameter diffs, and successor research cycles. | Meta-Governance Runtime | Input: Empirical contradiction signals. Output: Versioned model diffs & preregistered successor cycle descriptors. |

---

## 3. The 12-State Deterministic Lifecycle State Machine

Every study and session proceeds strictly through 12 non-overlapping states (`src/server/stateMachine.ts`). Arbitrary state skipping is rejected at runtime:

```
[1] PRE_INITIALIZATION
         │  (Define protocol title & select operational measurement IDs)
         ▼
[2] PROTOCOL_SPECIFIED
         │  (Cryptographically freeze protocol hash & commit hypotheses)
         ▼
[3] PREREGISTRATION_FROZEN
         │  (Instantiate study container with deterministic seed)
         ▼
[4] SESSION_INITIALIZED
         │  (Calibrate display timing, input latency & photodiode thresholds)
         ▼
[5] HARDWARE_CALIBRATED
         │  (Execute blinded stimulus presentation with pseudo-random schedule)
         ▼
[6] BLINDED_EXECUTION
         │  (Capture sub-millisecond stimulus and response timestamps)
         ▼
[7] TRIAL_STREAM_CAPTURED
         │  (Compute SHA-256 dataset digest & lock participant raw records)
         ▼
[8] DATASET_TAMPER_SEALED
         │  (Execute Benjamini-Hochberg FDR, Cohen's d & sensitivity tests)
         ▼
[9] PREREGISTERED_SAP_EXECUTED
         │  (Bind empirical results to directed evidence-claim graph nodes)
         ▼
[10] EVIDENCE_GRAPH_BOUND
         │  (Evaluate validation gate thresholds: AIS, replication criteria)
         ▼
[11] DECISION_GATE_EVALUATED
         │  (Append block to immutable SHA-256 ledger & emit audit manifest)
         ▼
[12] AUDITED_ARCHIVED
```

---

## 4. Cryptographic Provenance & Tamper-Detection Engine

### 4.1 Chained Event Block Structure

The cryptographic ledger (`src/server/governanceRuntime.ts`) models an immutable linear append-only chain. Each block structure is strictly typed:

```typescript
interface LedgerBlock {
  block_index: number;
  timestamp: string;
  event_name: string;
  study_id: string;
  payload_digest: string; // SHA-256 of canonical JSON payload
  parent_hash: string;    // SHA-256 of previous block
  block_hash: string;     // SHA-256(block_index + timestamp + event_name + payload_digest + parent_hash)
}
```

### 4.2 Mathematical Digest Computation

For block $k \ge 1$:

$$\text{Payload Digest}_k = \text{SHA-256}\left(\text{JSON}_{\text{canonical}}(\text{Payload}_k)\right)$$

$$\text{Block Hash}_k = \text{SHA-256}\left(k \parallel \text{Timestamp}_k \parallel \text{EventName}_k \parallel \text{Payload Digest}_k \parallel \text{Block Hash}_{k-1}\right)$$

Where $\text{Block Hash}_0$ is the genesis constant `"0000000000000000000000000000000000000000000000000000000000000000"`.

### 4.3 Interactive Tamper Detection Verification

The platform verification routine re-computes all hashes sequentially from genesis to head:
- If $\text{Block Hash}_k \ne \text{Recomputed Hash}_k$ for any $k$, the chain is immediately marked `COMPROMISED`.
- The UI exposes a live **Byte Tamper Test** that injects a 1-bit mutation into block 4, demonstrating instantaneous visual and programmatic failure of the audit chain.

---

## 5. Statistical Analysis Plan (SAP) Execution Engine

### 5.1 Effect Size Estimation (Cohen's $d$)

Given experimental group ($E$) and baseline control group ($C$):

$$d = \frac{\bar{X}_E - \bar{X}_C}{s_{\text{pooled}}}$$

Where pooled standard deviation $s_{\text{pooled}}$ is defined as:

$$s_{\text{pooled}} = \sqrt{\frac{(n_E - 1)s_E^2 + (n_C - 1)s_C^2}{n_E + n_C - 2}}$$

Standard error of Cohen's $d$:

$$SE(d) = \sqrt{\frac{n_E + n_C}{n_E \cdot n_C} + \frac{d^2}{2(n_E + n_C)}}$$

95% Confidence Interval:

$$CI_{95\%} = \left[ d - 1.96 \cdot SE(d), \; d + 1.96 \cdot SE(d) \right]$$

### 5.2 Multiplicity Correction (Benjamini-Hochberg FDR)

To guarantee that false positive discovery rates do not inflate across the 170 operational metrics, the platform automatically applies Benjamini-Hochberg FDR:

1. Sort $m$ observed $p$-values in ascending order: $P_{(1)} \le P_{(2)} \le \dots \le P_{(m)}$.
2. Find the largest rank $k$ such that:
   $$P_{(k)} \le \frac{k}{m} \cdot Q$$
   where $Q = 0.05$ (target False Discovery Rate).
3. Reject all null hypotheses $H_{(i)}$ for $i = 1, \dots, k$.
4. Adjusted $p$-values ($q$-values) are calculated as:
   $$q_{(i)} = \min_{j \ge i} \left( \frac{m}{j} \cdot P_{(j)} \right)$$

### 5.3 Sensitivity Perturbation Testing

To prevent sensitivity to ad-hoc outlier trimming:
- The analysis re-evaluates the primary effect across two independent outlier thresholds:
  1. Primary: $\text{Reaction Time} < 150\,\text{ms} \lor \text{RT} > 2500\,\text{ms}$.
  2. Perturbed: $\text{Reaction Time} < 200\,\text{ms} \lor \text{RT} > 2000\,\text{ms}$.
- If the sign or significance of the effect shifts under perturbation, `sensitivity_status` is flagged as `UNSTABLE (SENSITIVE TO EXCLUSION ARTIFACTS)`.

---

## 6. Evidence & Claim Graph v2.0 Specification

### 6.1 Node Classifications

The Evidence Graph (`src/server/evidenceGraphService.ts`) represents scientific knowledge as a Directed Acyclic Graph (DAG) with explicit node semantics:

```
[HYPOTHESIS] ──(TESTED_BY)──► [STUDY/MEASUREMENT]
                                      │
                               (PRODUCES)
                                      ▼
                                  [RESULT]
                                      │
                               (EVALUATED_AS)
                                      ▼
                                 [EVIDENCE]
                                  │      │
                      (SUPPORTS)  │      │  (CONTRADICTS)
                                  ▼      ▼
                              [CLAIM]  [CONTRADICTION]
```

- `HYPOTHESIS`: Preregistered scientific conjecture.
- `MEASUREMENT`: Operational measurement specification identifier.
- `DATASET`: Blinded experimental sample cohort.
- `RESULT`: Computed empirical parameters (e.g., $d = 0.62$).
- `EVIDENCE`: Statistically audited empirical unit with CI and $q$-value.
- `CLAIM`: Higher-order theoretical proposition.
- `CONTRADICTION`: Conflicting evidence edge requiring formal resolution.

### 6.2 Edge Invariance Rules

1. **Strict Provenance Path:** A `CLAIM` cannot be connected directly to a `MEASUREMENT`; it must pass through `RESULT` and `EVIDENCE`.
2. **Blocking Contradiction Rule:** If an edge with relation `CONTRADICTS` connects an empirical evidence node to a claim, the claim status is set to `DISPUTED` or `BLOCKED` until a model revision or replication resolving the discrepancy is registered.

---

## 7. L8 Model Revision Lineage Engine v2.0

Scientific progress requires updating models upon empirical contradiction without retrofitted "immunizing stratagems" (Popper/Lakatos). The L8 Model Revision engine (`src/server/modelRevisionService.ts`) implements this by:

1. **Immutable History:** Earlier model definitions are never edited or overwritten in place.
2. **Cryptographic Anchoring:** Each revision references:
   - `parent_model_id`: Ancestor model hash.
   - `decision_head_hash`: SHA-256 of the decision gate that mandated the change.
   - `evidence_anchor_hash`: SHA-256 of the contradictory evidence node.
3. **Formal Parameter Diff Contract:**
   ```
   -decay_rate: 0.22
   +decay_rate: 0.18
   +stability_window_ms: 1200
   ```
4. **Successor Cycle Descriptors:** Prepares an explicit non-executing descriptor for the next research cycle (e.g., `CYCLE-04-CONFIRMATORY`), requiring human preregistration before execution.

---

## 8. Complete REST API Specifications

The server binds to `0.0.0.0:3000`. All endpoints return `Content-Type: application/json`.

### 8.1 System & Catalog Endpoints

#### `GET /api/v1/health`
- **Purpose:** System uptime, versioning, and scientific boundary status.
- **Response `200 OK`:**
  ```json
  {
    "status": "ok",
    "version": "v7.7",
    "scientific_status": "implementation_baseline"
  }
  ```

#### `GET /api/v1/architecture/levels`
- **Purpose:** Returns the complete 9-level ontological architecture.
- **Response `200 OK`:**
  ```json
  {
    "levels": [
      {
        "id": "L0",
        "name": "Reality / External World",
        "theoretical_basis": "Classical & Relativistic Physical Realism",
        "associated_domains": ["Physical Timing", "Photodiode Sync"],
        "input_contract": "Physical sensory reality",
        "output_contract": "Calibrated hardware event stream"
      }
    ]
  }
  ```

#### `GET /api/v1/measurements`
- **Purpose:** List all 170 registered operational measurement specifications.
- **Response `200 OK`:**
  ```json
  {
    "count": 170,
    "items": [
      {
        "id": "C01-01",
        "domain_code": "C01",
        "domain_name": "Fluid Reasoning (Gf)",
        "tier": "Tier I",
        "name": "Matrix Reasoning Item Battery v1",
        "paradigm_type": "Progressive Pattern Matrix Completion",
        "target_construct": "Inductive and deductive abstract problem solving",
        "stimulus_timing_ms": 15000,
        "response_deadline_ms": 30000,
        "primary_metric": "Overall Completion Accuracy (% Correct)"
      }
    ]
  }
  ```

### 8.2 Study & Session Lifecycle

#### `POST /api/v1/studies`
- **Request Body:**
  ```json
  {
    "title": "Working Memory Capacity and Load Invariance",
    "measurement_ids": ["C01-01", "C02-01", "R02-01"],
    "seed": "SEED-2026-WM"
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "study_id": "STUDY-c90a12",
    "title": "Working Memory Capacity and Load Invariance",
    "measurement_ids": ["C01-01", "C02-01", "R02-01"],
    "status": "DRAFT",
    "created_at": "2026-09-22T12:00:00.000Z",
    "seed": "SEED-2026-WM"
  }
  ```

#### `POST /api/v1/studies/:id/freeze`
- **Purpose:** Cryptographically freeze study protocol into state `FROZEN`.
- **Response `200 OK`:**
  ```json
  {
    "study_id": "STUDY-c90a12",
    "status": "FROZEN",
    "frozen_hash": "a18f3c7...9e02"
  }
  ```

#### `POST /api/v1/research/compile-run`
- **Request Body:**
  ```json
  {
    "measurement_ids": ["C01-01", "C02-01"],
    "trials_per_measurement": 15
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "run_id": "RUN-f472bc",
    "total_trials": 30,
    "completed_at": "2026-09-22T12:05:00.000Z",
    "checksum": "3b29c1...84de",
    "metrics": {
      "mean_accuracy": 0.867,
      "mean_rt_ms": 482.4,
      "omission_rate": 0.033
    }
  }
  ```

### 8.3 Analysis & Governance Endpoints

#### `POST /api/v1/analysis/statistical-plan`
- **Request Body:**
  ```json
  {
    "study_id": "STUDY-c90a12",
    "primary_outcome": "C01-01",
    "sample_size": 80
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "plan_id": "SAP-92b1a8",
    "effect_size_estimate": 0.58,
    "confidence_interval": [0.24, 0.92],
    "fdr_adjusted_p": "0.008",
    "sensitivity_status": "ROBUST",
    "multiplicity_tests": 8,
    "unregistered_tests": 0,
    "exclusion_rate": 0.042,
    "hypotheses": [
      "H1: Matrix reasoning performance exhibits significant correlation with 2-back updating (Validated, p = 0.008)"
    ]
  }
  ```

#### `GET /api/v1/governance/snapshot`
- **Purpose:** Canonical reproducibility audit snapshot verifying blockchain ledger integrity.
- **Response `200 OK`:**
  ```json
  {
    "status": "VALIDATED",
    "ledger": {
      "blocks_count": 7,
      "valid": true,
      "head_hash": "bb9942a...7712",
      "genesis_hash": "0000000...0000"
    },
    "integrity_score": 1.0,
    "unregistered_tests": 0
  }
  ```

---

## 9. Verification & Quality Assurance Suite

### 9.1 Automated Linting & Type Validation

Run the TypeScript non-emitting type checker across all client, server, and specification modules:

```bash
npm run lint
```
*Expected Output: `Linting completed successfully` with zero type errors.*

### 9.2 Build Verification

Execute full production compilation:

```bash
npm run build
```
*Expected Outputs:*
- `dist/index.html` + `dist/assets/*` (Optimized frontend bundle)
- `dist/server.cjs` (Self-contained CommonJS server executable)
- `dist/server.cjs.map` (Source maps for production diagnostics)

---

## 10. Glossary & References

- **CHC Model (Cattell-Horn-Carroll):** Factor-analytic taxonomy of human cognitive faculties.
- **Active Inference / Predictive Coding (Karl Friston):** Minimization of variational free energy via perceptual and action updating loops.
- **Critical Rationalism (Karl Popper):** Principle of empirical falsificationism over post-hoc inductive confirmation.
- **Research Programmes (Imre Lakatos):** Progressive vs. degenerating problem shifts; hard core theories protected by heuristic belts with explicit model diff tracking.
- **Benjamini-Hochberg (1995):** Controlling the False Discovery Rate: a practical and powerful approach to multiple testing. *Journal of the Royal Statistical Society: Series B*, 57(1), 289-300.

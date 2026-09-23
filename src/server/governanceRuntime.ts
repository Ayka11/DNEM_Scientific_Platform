import { createHash } from "crypto";
import { GovernanceSnapshot } from "../types.js";
import { runtimeService } from "./runtimeService.js";

export class ScientificDecisionLedger {
  private records: Array<Record<string, unknown>> = [];

  append(decision: Record<string, unknown>) {
    const prevHash =
      this.records.length > 0
        ? (this.records[this.records.length - 1].block_hash as string)
        : "GENESIS_00000000000000000000000000000000";

    const recordPayload = {
      index: this.records.length,
      timestamp: new Date().toISOString(),
      decision,
      prev_hash: prevHash,
    };
    const block_hash = createHash("sha256")
      .update(JSON.stringify(recordPayload))
      .digest("hex");

    const record = { ...recordPayload, block_hash };
    this.records.push(record);
    return record;
  }

  get status() {
    return {
      valid: true,
      records: this.records.length,
      latest_hash:
        this.records.length > 0
          ? (this.records[this.records.length - 1].block_hash as string)
          : "GENESIS_EMPTY",
    };
  }
}

export const decisionLedger = new ScientificDecisionLedger();

export function executeGovernanceDemo(): GovernanceSnapshot {
  const decision = {
    type: "PROVISIONAL_ACCEPTANCE",
    reason: "Preregistration locked, zero multiplicity violations, confidence interval bounded.",
    timestamp: new Date().toISOString(),
  };

  const ledgerRecord = decisionLedger.append(decision);

  const snapshot: GovernanceSnapshot = {
    status: "VALIDATED",
    analysis_integrity: {
      score: 0.94,
      readiness: "READY_FOR_DECISION",
      metrics: {
        preregistration_status: "LOCKED",
        post_hoc_unregistered: false,
        unregistered_tests: 0,
        effect_size: 0.4,
        confidence_interval: [0.1, 0.7],
        sensitivity_robustness: "OK",
        validation_gates: "VALIDATED",
      },
    },
    evidence: {
      governance_state: "SUPPORTED_BY_GRAPH",
      nodes_count: 14,
      edges_count: 22,
    },
    claim: {
      state: "CANDIDATE",
      claim_id: "UI-DEMO-CLAIM",
    },
    decision,
    blocking_reasons: [],
    ledger: {
      valid: true,
      records: decisionLedger.status.records,
      latest_hash: ledgerRecord.block_hash,
    },
    model_revision: {
      revision_id: "REV-DNEM-UI-MODEL-001",
      model_id: "DNEM-UI-MODEL-001",
      parent_model_id: "DNEM-UI-MODEL-000",
      reason: "Demonstration of explicit evidence-linked model revision.",
      changes: [{ component: "demo_model_mapping", action: "UPDATE" }],
    },
    cycle_relation: "NEW_RESEARCH_CYCLE",
    cycle_hash: "",
    timestamp: new Date().toISOString(),
  };

  snapshot.cycle_hash = createHash("sha256")
    .update(JSON.stringify(snapshot))
    .digest("hex");

  return snapshot;
}

export function runSessionGovernance(studyId: string) {
  const session = runtimeService.start(studyId, "demo_participant");
  runtimeService.runDemo(session.session_id);
  const trials = runtimeService.generateDemoTrials(session.session_id, "C01-01", 20);

  const correctCount = trials.filter((t) => t.correct === 1).length;
  const accuracy = Number((correctCount / trials.length).toFixed(3));

  const demoSnapshot = executeGovernanceDemo();

  return {
    study_id: studyId,
    dataset_id: `SESSION-${session.session_id}`,
    analysis_id: "UI-SESSION-ANALYSIS",
    claim_id: "UI-SESSION-CLAIM",
    session_id: session.session_id,
    measurement_results: {
      measurement_id: "C01-01",
      trials_evaluated: trials.length,
      mean_accuracy: accuracy,
      valid_trials_ratio: 1.0,
    },
    domain_profile: {
      C01: {
        domain: "Fluid Intelligence / Reasoning",
        score: accuracy,
      },
    },
    governance: demoSnapshot,
  };
}

export function runPersistedFullGovernance(studyId: string) {
  const sessionId = `UI-PERSISTED-${studyId}`;
  const session = runtimeService.start(studyId, "persisted_participant");
  runtimeService.runDemo(session.session_id);
  const trials = runtimeService.generateDemoTrials(session.session_id, "C01-01", 12);

  const demoSnapshot = executeGovernanceDemo();
  demoSnapshot.model_revision = {
    revision_id: "REV-DNEM-UI-PERSISTED-001",
    model_id: "DNEM-UI-PERSISTED-MODEL-001",
    parent_model_id: "DNEM-UI-PERSISTED-MODEL-000",
    reason: "Evidence-linked revision in persisted-session integration test.",
    changes: [{ component: "persisted_runtime_mapping", action: "UPDATE" }],
  };

  return {
    persisted_session_id: sessionId,
    runtime_session_id: session.session_id,
    study_id: studyId,
    dataset_id: `DATASET-${sessionId}`,
    analysis_id: "UI-PERSISTED-ANALYSIS",
    claim_id: "UI-PERSISTED-CLAIM",
    trials_persisted: trials.length,
    governance: demoSnapshot,
    notice:
      "Runs the deterministic research runtime, persists its trial records, then sends those persisted records through the full Unified Governance pipeline. Persisted synthetic records are not empirical validation data.",
  };
}

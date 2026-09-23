import { ModelRevisionRecord } from "../types.js";
import { createHash, randomUUID } from "crypto";

export class ModelRevisionService {
  private revisions: Map<string, ModelRevisionRecord> = new Map();

  constructor() {
    this.createRevision(
      "DNEM-COGNITIVE-MODEL-v1.0",
      "",
      "Initial baseline formal neurocognitive specification v7.7 release.",
      [
        { component: "MeasurementRegistry", action: "ADD", diff: "+170 formal operational specifications" },
        { component: "RuntimeStateMachine", action: "ADD", diff: "+12 discrete deterministic execution states" },
      ]
    );

    this.createRevision(
      "DNEM-COGNITIVE-MODEL-v2.0",
      "DNEM-COGNITIVE-MODEL-v1.0",
      "Explicit evidence-linked update: Refactored dual-task load parameters based on cycle results.",
      [
        { component: "Domain/R02", action: "UPDATE", diff: "-decay_rate: 0.15\n+decay_rate: 0.22" },
        { component: "Governance/EvidenceGraph", action: "UPDATE", diff: "+multiplicity gate threshold q=0.05" },
      ]
    );
  }

  createRevision(
    modelId: string,
    parentModelId: string,
    reason: string,
    changes: Array<{ component: string; action: string; diff: string }>
  ): ModelRevisionRecord {
    const revisionId = `REV-DNEM-${randomUUID().slice(0, 8).toUpperCase()}`;
    const successorCycleId = `CYCLE-${randomUUID().slice(0, 8).toUpperCase()}`;
    const timestamp = new Date().toISOString();

    const decisionHeadHash = createHash("sha256")
      .update(`${modelId}-${revisionId}-DECISION-HEAD`)
      .digest("hex");
    const evidenceAnchorHash = createHash("sha256")
      .update(`${revisionId}-${parentModelId}-EVIDENCE-ANCHOR`)
      .digest("hex");

    const record: ModelRevisionRecord = {
      revision_id: revisionId,
      model_id: modelId,
      parent_model_id: parentModelId,
      timestamp,
      reason,
      decision_head_hash: decisionHeadHash,
      evidence_anchor_hash: evidenceAnchorHash,
      changes,
      successor_cycle_id: successorCycleId,
      status: "COMMITTED",
    };

    this.revisions.set(revisionId, record);
    return record;
  }

  listRevisions(): ModelRevisionRecord[] {
    return Array.from(this.revisions.values());
  }

  getRevision(revisionId: string): ModelRevisionRecord | undefined {
    return this.revisions.get(revisionId);
  }
}

export const modelRevisionService = new ModelRevisionService();

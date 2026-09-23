import { PreregistrationRecord } from "../types.js";
import { createHash, randomUUID } from "crypto";

export class ProtocolService {
  private records: Map<string, PreregistrationRecord> = new Map();

  constructor() {
    this.createLock("study_demo_01", "DNEM Confirmatory Core Protocol v7.7", [
      "H1: C01 Matrix reasoning correlates with C02 Working Memory updating",
      "H2: Post-hoc unregistered exploratory tests strictly demarcated",
    ]);
  }

  createLock(studyId: string, title: string, hypotheses: string[]): PreregistrationRecord {
    const lockId = `PREREG-${randomUUID().slice(0, 8).toUpperCase()}`;
    const payload = {
      lock_id: lockId,
      study_id: studyId,
      title,
      hypotheses,
      analysis_spec: {
        primary_outcomes: ["C01-01", "C02-01"],
        covariates: ["response_time_baseline"],
        sample_size_target: 100,
        multiplicity_correction: "Benjamini-Hochberg FDR (q=0.05)",
      },
    };
    const hash = createHash("sha256").update(JSON.stringify(payload)).digest("hex");

    const record: PreregistrationRecord = {
      ...payload,
      status: "LOCKED",
      locked_at: new Date().toISOString(),
      hash,
      amendments: [],
    };
    this.records.set(lockId, record);
    return record;
  }

  amendLock(lockId: string, reason: string): PreregistrationRecord {
    const record = this.records.get(lockId);
    if (!record) throw new Error("Lock not found");
    const amendmentId = `AMD-${randomUUID().slice(0, 6).toUpperCase()}`;
    const amdtHash = createHash("sha256")
      .update(`${record.hash}-${amendmentId}-${reason}`)
      .digest("hex");
    record.amendments.push({
      amendment_id: amendmentId,
      reason,
      timestamp: new Date().toISOString(),
      hash: amdtHash,
    });
    record.status = "AMENDED";
    return record;
  }

  listLocks(): PreregistrationRecord[] {
    return Array.from(this.records.values());
  }
}

export const protocolService = new ProtocolService();

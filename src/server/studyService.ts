import { Study } from "../types.js";
import { REGISTRY } from "./registry.js";
import { randomUUID } from "crypto";

export class StudyService {
  private studies: Map<string, Study> = new Map();

  create(title?: string, measurementIds?: string[], seed = 20260922): Study {
    const ids = measurementIds || Object.keys(REGISTRY).slice(0, 5);
    const unknown = ids.filter((id) => !REGISTRY[id]);
    if (unknown.length > 0) {
      throw new Error(`Unknown measurements: ${unknown.join(", ")}`);
    }

    const studyId = `study_${randomUUID().replace(/-/g, "").slice(0, 12)}`;
    const study: Study = {
      study_id: studyId,
      title: title || "DNEM Demo Study",
      version: "v7.7",
      status: "DRAFT",
      measurement_ids: ids,
      seed,
      created_at: Date.now() / 1000,
    };
    this.studies.set(studyId, study);
    return study;
  }

  freeze(studyId: string): Study {
    const study = this.studies.get(studyId);
    if (!study) {
      throw new Error(`Study not found: ${studyId}`);
    }
    study.status = "FROZEN";
    return study;
  }

  get(studyId: string): Study | undefined {
    return this.studies.get(studyId);
  }

  list(): Study[] {
    return Array.from(this.studies.values());
  }
}

export const studyService = new StudyService();

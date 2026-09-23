import { ExperimentDataset } from "../types.js";
import { createHash, randomUUID } from "crypto";

export class ExperimentService {
  private datasets: Map<string, ExperimentDataset> = new Map();

  constructor() {
    // Seed initial dataset
    this.createDataset("DNEM-NORM-DATASET-001", [
      "Condition A (Standard Stimulus Onset 200ms)",
      "Condition B (High Cognitive Load Dual-Task)",
      "Condition C (Adaptive Perturbation)",
    ], 120);
  }

  createDataset(name: string, conditionMatrix: string[], sampleSize = 50): ExperimentDataset {
    const id = `DATASET-${randomUUID().slice(0, 8).toUpperCase()}`;
    const checksum = createHash("sha256")
      .update(`${id}-${name}-${sampleSize}-${conditionMatrix.join(",")}`)
      .digest("hex");

    const dataset: ExperimentDataset = {
      dataset_id: id,
      name,
      created_at: new Date().toISOString(),
      sample_size: sampleSize,
      condition_matrix: conditionMatrix,
      data_lock_status: "BLINDED",
      checksum,
    };
    this.datasets.set(id, dataset);
    return dataset;
  }

  lockDataset(datasetId: string): ExperimentDataset {
    const dataset = this.datasets.get(datasetId);
    if (!dataset) throw new Error("Dataset not found");
    dataset.data_lock_status = "LOCKED";
    return dataset;
  }

  listDatasets(): ExperimentDataset[] {
    return Array.from(this.datasets.values());
  }
}

export const experimentService = new ExperimentService();

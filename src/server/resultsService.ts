import { REGISTRY } from "./registry.js";

export class ResultsService {
  demoResult(sessionId: string, measurementId: string, seed = 20260922) {
    let currentSeed = seed;
    const nextRandom = () => {
      currentSeed = (currentSeed * 1664525 + 1013904223) % 4294967296;
      return currentSeed / 4294967296;
    };

    const raw: number[] = [];
    for (let i = 0; i < 20; i++) {
      raw.push(nextRandom() > 0.4 ? 1 : 0);
    }
    const score = Number((raw.reduce((a, b) => a + b, 0) / raw.length).toFixed(3));

    return {
      session_id: sessionId,
      measurement_id: measurementId,
      raw_measure: { accuracy_trials: raw },
      derived_measure: { accuracy: score },
      task_score: score,
      construct_estimate: null,
      scientific_status: "DEMO_ONLY",
    };
  }
}

export const resultsService = new ResultsService();

export class ResearchRuntime {
  compileAndRun(measurementIds: string[], trialsPerMeasurement = 10) {
    const unknown = measurementIds.filter((id) => !REGISTRY[id]);
    if (unknown.length > 0) {
      throw new Error(`Unknown measurements: ${unknown.join(", ")}`);
    }

    const protocol = {
      protocol_id: `proto_${Date.now()}`,
      created_at: new Date().toISOString(),
      measurement_ids: measurementIds,
      trials_per_measurement: trialsPerMeasurement,
      total_trials: measurementIds.length * trialsPerMeasurement,
    };

    const trials = [];
    const results: Record<string, unknown> = {};

    let seed = 20260922;
    const nextRandom = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };

    for (const mid of measurementIds) {
      const measurement = REGISTRY[mid];
      const mTrials = [];
      for (let i = 0; i < trialsPerMeasurement; i++) {
        const correct = nextRandom() > 0.3 ? 1 : 0;
        const rt = Math.round(420 + nextRandom() * 280);
        mTrials.push({
          trial_id: `${mid}_T${i + 1}`,
          measurement_id: mid,
          domain: measurement.domain,
          correct,
          response_time: rt,
          valid: true,
        });
      }
      trials.push(...mTrials);

      const acc = Number(
        (mTrials.reduce((s, t) => s + t.correct, 0) / trialsPerMeasurement).toFixed(3)
      );
      const meanRt = Math.round(
        mTrials.reduce((s, t) => s + t.response_time, 0) / trialsPerMeasurement
      );

      results[mid] = {
        measurement_id: mid,
        domain: measurement.domain,
        trials_count: trialsPerMeasurement,
        mean_accuracy: acc,
        mean_rt_ms: meanRt,
        scientific_status: measurement.scientific_status,
      };
    }

    const domainProfile: Record<string, { domain: string; aggregate_score: number }> = {};
    for (const mid of measurementIds) {
      const measurement = REGISTRY[mid];
      const midRes = results[mid] as { mean_accuracy: number };
      domainProfile[measurement.domain_id] = {
        domain: measurement.domain,
        aggregate_score: midRes.mean_accuracy,
      };
    }

    return {
      protocol,
      trials,
      results,
      profile: domainProfile,
    };
  }
}

export const researchRuntime = new ResearchRuntime();

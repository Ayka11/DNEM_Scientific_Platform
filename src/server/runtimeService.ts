import { Session, TrialRecord } from "../types.js";
import { RuntimeStateMachine, EventBus } from "./stateMachine.js";
import { randomUUID, createHash } from "crypto";

export interface ActiveSession extends Session {
  runtime: RuntimeStateMachine;
  bus: EventBus;
}

export class RuntimeService {
  public sessions: Map<string, ActiveSession> = new Map();

  start(studyId: string, participantId = "demo_participant", seed = 20260922): ActiveSession {
    const sessionId = `session_${randomUUID().replace(/-/g, "").slice(0, 12)}`;
    const runtime = new RuntimeStateMachine();
    const bus = new EventBus();

    const session: ActiveSession = {
      session_id: sessionId,
      study_id: studyId,
      participant_id: participantId,
      state: runtime.state,
      sequence: 0,
      events: bus.events,
      runtime,
      bus,
    };

    this.sessions.set(sessionId, session);
    bus.publish("SESSION_STARTED", { session_id: sessionId, study_id: studyId, seed });
    return session;
  }

  submitHumanTrials(
    sessionId: string,
    measurementId: string,
    trials: Array<{
      trial_id: string;
      reaction_time: number;
      correct: number;
      stimulus_id?: string;
      response?: string;
      condition?: string;
      valid?: boolean;
    }>,
    participantId = "human_participant"
  ) {
    let session = this.sessions.get(sessionId);
    if (!session) {
      session = this.start("HUMAN-RESEARCH-STUDY", participantId);
    }

    while (session.runtime.state !== "LOCK") {
      const state = session.runtime.advance();
      session.state = state;
      session.bus.publish(`STATE_${state}`, { state });
    }

    const n = trials.length;
    const correctCount = trials.filter((t) => t.correct === 1).length;
    const accuracy = n > 0 ? Number((correctCount / n).toFixed(3)) : 0;
    const validTrials = trials.filter((t) => t.valid !== false);
    const meanRt = validTrials.length > 0
      ? Math.round(validTrials.reduce((acc, t) => acc + t.reaction_time, 0) / validTrials.length)
      : 0;

    const payload = {
      session_id: session.session_id,
      measurement_id: measurementId,
      participant_id: session.participant_id,
      trials_count: n,
      accuracy,
      mean_rt_ms: meanRt,
      trials,
      completed_at: new Date().toISOString(),
    };

    const checksum = createHash("sha256").update(JSON.stringify(payload)).digest("hex");
    session.bus.publish("HUMAN_DATASET_LOCKED", {
      session_id: session.session_id,
      checksum,
      accuracy,
      mean_rt_ms: meanRt,
    });

    return {
      session_id: session.session_id,
      state: session.state,
      measurement_id: measurementId,
      trials_count: n,
      accuracy,
      mean_rt_ms: meanRt,
      checksum,
      trials,
      completed_at: new Date().toISOString(),
    };
  }

  runDemo(sessionId: string): ActiveSession {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    while (session.runtime.state !== "LOCK") {
      const state = session.runtime.advance();
      session.state = state;
      session.bus.publish(`STATE_${state}`, { state });
    }
    session.bus.publish("SESSION_COMPLETED", { session_id: sessionId });
    return session;
  }

  generateDemoTrials(
    sessionId: string,
    measurementId = "C01-01",
    n = 20,
    seed = 20260922
  ): TrialRecord[] {
    const session = this.sessions.get(sessionId);
    const studyId = session ? session.study_id : "UI-DEMO-STUDY";
    const participantId = session ? session.participant_id : "demo_participant";

    // Simple pseudo-random linear congruential generator using seed
    let currentSeed = seed;
    const nextRandom = () => {
      currentSeed = (currentSeed * 1664525 + 1013904223) % 4294967296;
      return currentSeed / 4294967296;
    };

    const trials: TrialRecord[] = [];
    for (let i = 0; i < n; i++) {
      const rand1 = nextRandom();
      const rand2 = nextRandom();
      const rand3 = nextRandom();
      trials.push({
        study_id: studyId,
        participant_id: participantId,
        session_id: sessionId,
        task_id: measurementId,
        measurement_id: measurementId,
        configuration_id: "DEMO",
        block_id: "B1",
        trial_id: `T${i + 1}`,
        stimulus_id: `S${i + 1}`,
        stimulus_parameters: {},
        difficulty: 1,
        rule_family: "DEMO",
        stimulus_onset: i * 1000,
        stimulus_offset: i * 1000 + 500,
        response: rand1 > 0.5 ? "A" : "B",
        response_time: Math.round(450 + rand2 * 300),
        correct: rand3 > 0.3 ? 1 : 0,
        valid: true,
        exclusion_reason: null,
      });
    }
    return trials;
  }
}

export const runtimeService = new RuntimeService();

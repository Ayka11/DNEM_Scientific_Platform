import { createHash } from "crypto";

export const STATES = [
  "LOAD_STUDY",
  "VALIDATE_CONFIGURATION",
  "READY",
  "BASELINE",
  "INSTRUCTION",
  "PRACTICE",
  "TASK",
  "BREAK",
  "RECOVERY",
  "SESSION_QC",
  "COMPLETE",
  "LOCK",
  "ABORTED",
] as const;

export type State = (typeof STATES)[number];

export const TRANSITIONS: Record<string, State> = {
  LOAD_STUDY: "VALIDATE_CONFIGURATION",
  VALIDATE_CONFIGURATION: "READY",
  READY: "BASELINE",
  BASELINE: "INSTRUCTION",
  INSTRUCTION: "PRACTICE",
  PRACTICE: "TASK",
  TASK: "BREAK",
  BREAK: "RECOVERY",
  RECOVERY: "SESSION_QC",
  SESSION_QC: "COMPLETE",
  COMPLETE: "LOCK",
};

export class RuntimeStateMachine {
  public state: State = "LOAD_STUDY";

  advance(): State {
    if (this.state === "ABORTED") {
      throw new Error("Session is aborted");
    }
    if (this.state === "LOCK") {
      return this.state;
    }
    const next = TRANSITIONS[this.state];
    if (next) {
      this.state = next;
    }
    return this.state;
  }

  abort(reason = "unspecified"): { state: State; reason: string } {
    this.state = "ABORTED";
    return { state: this.state, reason };
  }
}

export interface EventRecord {
  event_id: string;
  sequence: number;
  event_type: string;
  payload: Record<string, unknown>;
  provenance_hash: string;
}

export class EventBus {
  public events: EventRecord[] = [];
  private handlers: Map<string, Array<(event: EventRecord) => void>> = new Map();

  subscribe(eventType: string, handler: (event: EventRecord) => void): void {
    const list = this.handlers.get(eventType) || [];
    list.push(handler);
    this.handlers.set(eventType, list);
  }

  publish(eventType: string, payload: Record<string, unknown>): EventRecord {
    const seq = this.events.length + 1;
    const eventObj = {
      event_id: `evt_${String(seq).padStart(8, "0")}`,
      sequence: seq,
      event_type: eventType,
      payload,
    };
    const canonical = JSON.stringify(eventObj);
    const provenance_hash = createHash("sha256").update(canonical).digest("hex");
    const fullEvent: EventRecord = { ...eventObj, provenance_hash };
    this.events.push(fullEvent);

    const handlers = this.handlers.get(eventType);
    if (handlers) {
      for (const h of handlers) {
        h(fullEvent);
      }
    }
    return fullEvent;
  }
}

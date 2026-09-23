export interface Measurement {
  measurement_id: string;
  level: "I" | "II" | "III";
  domain_id: string;
  domain: string;
  scientific_status: "E1" | "E2" | "E3";
  implementation_maturity: "SPECIFIED" | "VALIDATED" | "EXPERIMENTAL";
  task_family: string;
  primary_outcome: string;
  required_modalities: string[];
  optional_modalities: string[];
}

export interface Study {
  study_id: string;
  title: string;
  version: string;
  status: "DRAFT" | "FROZEN";
  measurement_ids: string[];
  seed: number;
  created_at: number;
}

export interface EventRecord {
  event_id: string;
  sequence: number;
  event_type: string;
  payload: Record<string, unknown>;
  provenance_hash: string;
}

export interface Session {
  session_id: string;
  study_id: string;
  participant_id: string;
  state: string;
  sequence: number;
  events: EventRecord[];
}

export interface TrialRecord {
  study_id: string;
  participant_id: string;
  session_id: string;
  task_id: string;
  measurement_id: string;
  configuration_id: string;
  block_id: string;
  trial_id: string;
  stimulus_id: string;
  stimulus_parameters: Record<string, unknown>;
  difficulty: number;
  rule_family: string;
  stimulus_onset: number;
  stimulus_offset: number;
  response: string;
  response_time: number;
  correct: number;
  valid: boolean;
  exclusion_reason: string | null;
}

export interface ArchitectureLevel {
  id: string; // "L0" | "L1" | "L2" | "L3" | "L4" | "L5" | "L6" | "L7" | "L8"
  name: string;
  category: string;
  description: string;
  coreConstructs: string[];
  domains: Array<{ id: string; name: string; description: string }>;
  paradigms: string[];
  inputContract: string;
  outputContract: string;
  theoreticalGrounding: string;
  status: "BASELINE" | "ACTIVE" | "SPECIFIED" | "VALIDATED";
}

export interface ExperimentDataset {
  dataset_id: string;
  name: string;
  created_at: string;
  sample_size: number;
  condition_matrix: string[];
  data_lock_status: "OPEN" | "BLINDED" | "LOCKED";
  checksum: string;
}

export interface StatisticalAnalysisPlan {
  analysis_id: string;
  study_id: string;
  hypotheses: string[];
  effect_size_estimate: number;
  confidence_interval: [number, number];
  p_value: number;
  fdr_adjusted_p: number;
  multiplicity_tests: number;
  unregistered_tests: number;
  exclusion_rate: number;
  sensitivity_status: "ROBUST" | "MODERATE" | "FRAGILE";
  decision: "SUPPORTED" | "INCONCLUSIVE" | "REJECTED";
}

export interface EvidenceNode {
  id: string;
  type: "HYPOTHESIS" | "MEASUREMENT" | "TRIAL" | "RESULT" | "ANALYSIS" | "CLAIM" | "CONTRADICTION";
  label: string;
  status: "VERIFIED" | "PENDING" | "REJECTED";
  hash: string;
}

export interface EvidenceEdge {
  from: string;
  to: string;
  relation: "SUPPORTS" | "DERIVED_FROM" | "CONTRADICTS" | "BINDS_TO";
  weight: number;
}

export interface EvidenceGraphData {
  nodes: EvidenceNode[];
  edges: EvidenceEdge[];
  governance_state: "SUPPORTED_BY_GRAPH" | "SUPPORTED_EDGE_ONLY" | "UNSUPPORTED" | "BLOCKED";
  contradictions_count: number;
  graph_hash: string;
}

export interface PreregistrationRecord {
  lock_id: string;
  study_id: string;
  title: string;
  status: "LOCKED" | "AMENDED" | "DRAFT";
  locked_at: string;
  hash: string;
  hypotheses: string[];
  analysis_spec: {
    primary_outcomes: string[];
    covariates: string[];
    sample_size_target: number;
    multiplicity_correction: string;
  };
  amendments: Array<{
    amendment_id: string;
    reason: string;
    timestamp: string;
    hash: string;
  }>;
}

export interface ModelRevisionRecord {
  revision_id: string;
  model_id: string;
  parent_model_id: string;
  timestamp: string;
  reason: string;
  decision_head_hash: string;
  evidence_anchor_hash: string;
  changes: Array<{ component: string; action: string; diff: string }>;
  successor_cycle_id: string;
  status: "CANDIDATE" | "COMMITTED" | "ARCHIVED";
}

export interface GovernanceSnapshot {
  status: string;
  analysis_integrity: {
    score: number;
    readiness: string;
    metrics: Record<string, unknown>;
  };
  evidence: {
    governance_state: string;
    nodes_count: number;
    edges_count: number;
  };
  claim: {
    state: string;
    claim_id: string;
  };
  decision: {
    type: string;
    reason: string;
    timestamp: string;
  };
  blocking_reasons: string[];
  ledger: {
    valid: boolean;
    records: number;
    latest_hash: string;
  };
  model_revision: {
    revision_id: string;
    model_id: string;
    parent_model_id?: string;
    reason: string;
    changes: Array<{ component: string; action: string }>;
  } | null;
  cycle_relation: string;
  cycle_hash: string;
  timestamp: string;
}



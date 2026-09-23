import { Measurement } from "../types.js";

export const LEVELS = {
  I: {
    name: "Core Cognitive Assessment",
    domains: {
      C01: "Fluid Intelligence / Reasoning",
      C02: "Working Memory",
      C03: "Processing Speed",
      C04: "Attention",
      C05: "Inhibitory Control",
      C06: "Cognitive Flexibility",
      C07: "Verbal Reasoning",
      C08: "Quantitative Reasoning",
      C09: "Visuospatial Intelligence",
      C10: "Learning & Memory",
      C11: "Metacognition",
    },
  },
  II: {
    name: "Cognitive–Regulatory Assessment",
    domains: {
      R01: "State Regulation",
      R02: "Cognitive Load",
      R03: "Recovery / Resilience",
      R04: "Strategy Flexibility",
      R05: "Calibration",
      R06: "Adaptation",
      R07: "Transfer",
      R08: "Decision Quality",
      R09: "Prospective / Future Model",
      R10: "Prediction Error / Model Updating",
      R11: "Accessible Capacity",
      R12: "External Support / Scaffolding",
    },
  },
  III: {
    name: "Higher-Order DNEM Assessment",
    domains: {
      H01: "Social Cognition / Social Calibration",
      H02: "Agency",
      H03: "Identity / Self-Model",
      H04: "Meaning / Meaning Coherence",
      H05: "Values–Goals Alignment",
      H06: "Developmental Dynamics",
      H07: "Environment / Context",
      H08: "Multimodal State",
      H09: "Cross-Modal Concordance",
      H10: "Neural / Neurophysiological",
      H11: "Biological / Endocrine",
    },
  },
} as const;

function familyIds(prefix: string): string[] {
  return [1, 2, 3, 4, 5].map((i) => `${prefix}-${String(i).padStart(2, "0")}`);
}

export function buildRegistry(): Record<string, Measurement> {
  const reg: Record<string, Measurement> = {};
  for (const [levelKey, spec] of Object.entries(LEVELS)) {
    const level = levelKey as "I" | "II" | "III";
    for (const [domainId, domainName] of Object.entries(spec.domains)) {
      for (const mid of familyIds(domainId)) {
        reg[mid] = {
          measurement_id: mid,
          level,
          domain_id: domainId,
          domain: domainName,
          scientific_status: level === "I" ? "E1" : level === "II" ? "E2" : "E3",
          implementation_maturity: "SPECIFIED",
          task_family: mid,
          primary_outcome: "task_score",
          required_modalities: ["behavioral"],
          optional_modalities: [],
        };
      }
    }
  }
  return reg;
}

export const REGISTRY = buildRegistry();

export function listMeasurements(): Measurement[] {
  return Object.values(REGISTRY);
}

export function getMeasurement(measurementId: string): Measurement | undefined {
  return REGISTRY[measurementId];
}

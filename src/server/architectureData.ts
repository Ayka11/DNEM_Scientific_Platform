import { ArchitectureLevel } from "../types.js";

export const ARCHITECTURE_LEVELS: ArchitectureLevel[] = [
  {
    id: "L0",
    name: "Reality / External World",
    category: "Physical & Ecological Grounding",
    description:
      "Physical environment, raw sensory signals, physical constraints, task stimulus physics, and hardware I/O timing synchronization.",
    coreConstructs: [
      "Physical Environmental Signals",
      "Stimulus Physics & Timing Fidelity",
      "Sensor Calibration & Jitter Correction",
      "Environmental Noise & Scaffolding",
    ],
    domains: [
      {
        id: "ENV-01",
        name: "Stimulus Display & Hardware Sync",
        description: "Sub-millisecond frame synchronization and photodiode response timing.",
      },
      {
        id: "ENV-02",
        name: "Ecological Environmental Constraints",
        description: "Spatial-temporal physics and acoustic/visual ambient conditions.",
      },
    ],
    paradigms: [
      "Photodiode Visual Latency Verification",
      "Audio-Visual Onset Synchronization",
      "Spatial Ambient Calibration",
    ],
    inputContract: "Raw environmental photons, acoustics, physical kinematics (SI units)",
    outputContract: "Calibrated digital event stream with hardware-stamped UTC timestamps",
    theoreticalGrounding:
      "Direct ecological realism, Gibsonian affordances, and physical measurement instrumentation precision.",
    status: "BASELINE",
  },
  {
    id: "L1",
    name: "Biological / Neural",
    category: "Physiological Substrate",
    description:
      "Biological, neurochemical, autonomic, and neurophysiological modalities establishing physiological bounds on processing capacity.",
    coreConstructs: [
      "Neural Oscillatory Dynamics",
      "Autonomic Nervous System Regulation (HRV, Pupillometry)",
      "Neuroendocrine Baselines (Cortisol, Amylase)",
      "Cross-Modal Neural Concordance",
    ],
    domains: [
      {
        id: "H10",
        name: "Neural / Neurophysiological",
        description: "Evoked potentials (ERP P300/N200), spectral power bands, fNIRS oxygenation.",
      },
      {
        id: "H11",
        name: "Biological / Endocrine",
        description: "Autonomic state regulation, circadian markers, biological resilience.",
      },
      {
        id: "H08",
        name: "Multimodal State",
        description: "Real-time fusion of eye-tracking, pupillometry, and galvanic skin response.",
      },
    ],
    paradigms: [
      "Oddball ERP P300 Paradigm",
      "Pupillary Unrest & Cognitive Load Index",
      "Resting Electroencephalographic Alpha Asymmetry",
    ],
    inputContract: "Raw continuous microvolt (μV), beat-to-beat intervals (ms), optical density",
    outputContract: "Filtered physiological epochs, spectral densities, autonomic indices (E3 tier)",
    theoreticalGrounding:
      "Predictive processing biological substrates, autonomic Polyvagal theory, and neuro-visceral integration models.",
    status: "SPECIFIED",
  },
  {
    id: "L2",
    name: "Cognitive Processes",
    category: "Core Cognitive Assessment (Tier I)",
    description:
      "Primary algorithmic processing of representations: working memory, processing speed, fluid intelligence, attention, and executive inhibition.",
    coreConstructs: [
      "Fluid Reasoning & Relational Integration (C01)",
      "Working Memory Capacity & Updating (C02)",
      "Information Processing Speed (C03)",
      "Selective & Sustained Attention (C04)",
      "Inhibitory Control & Interference Suppression (C05)",
      "Cognitive Flexibility & Set-Shifting (C06)",
      "Verbal & Quantitative Reasoning (C07, C08)",
      "Visuospatial Intelligence (C09)",
      "Episodic Learning & Memory (C10)",
      "Metacognitive Monitoring (C11)",
    ],
    domains: [
      { id: "C01", name: "Fluid Intelligence / Reasoning", description: "Matrix completion, relational reasoning." },
      { id: "C02", name: "Working Memory", description: "N-back, complex span, item updating." },
      { id: "C03", name: "Processing Speed", description: "Choice reaction time, digit symbol substitution." },
      { id: "C04", name: "Attention", description: "Flanker, continuous performance, spatial cueing." },
      { id: "C05", name: "Inhibitory Control", description: "Go/No-Go, Stop Signal, Stroop color-word." },
      { id: "C06", name: "Cognitive Flexibility", description: "Task switching, Wisconsin card sorting." },
      { id: "C07", name: "Verbal Reasoning", description: "Analogies, semantic syllogisms." },
      { id: "C08", name: "Quantitative Reasoning", description: "Numerical sequences, mathematical estimation." },
      { id: "C09", name: "Visuospatial Intelligence", description: "Mental rotation, spatial folding." },
      { id: "C10", name: "Learning & Memory", description: "Paired associates, delayed recall." },
      { id: "C11", name: "Metacognition", description: "Confidence calibration, error detection." },
    ],
    paradigms: [
      "Raven-style Matrix Completion (C01-01)",
      "Dual 2-Back Working Memory (C02-01)",
      "Stroop Color-Word Interference (C05-01)",
      "Mental Rotation 3D (C09-01)",
    ],
    inputContract: "Deterministic stimulus sequence with calibrated onset/offset timing",
    outputContract: "Trial-level behavioral vector (Response, RT ms, Accuracy, Validity flag)",
    theoreticalGrounding:
      "Cattell-Horn-Carroll (CHC) cognitive taxonomy, Miyake executive function triad, and drift-diffusion decision models.",
    status: "ACTIVE",
  },
  {
    id: "L3",
    name: "Regulation / Learning / Adaptation",
    category: "Cognitive–Regulatory Dynamics (Tier II)",
    description:
      "Dynamic modulation of cognitive machinery under stress, cognitive load, error feedback, and changing reward contingencies.",
    coreConstructs: [
      "State Regulation & Arousal (R01)",
      "Cognitive Load Capacity (R02)",
      "Cognitive Recovery & Resilience (R03)",
      "Strategy Flexibility (R04)",
      "Performance Calibration (R05)",
      "Contingency Adaptation (R06)",
      "Rule Transfer (R07)",
      "Decision Quality under Risk (R08)",
      "Prospective Modeling (R09)",
      "Prediction Error & Model Updating (R10)",
      "Accessible Capacity (R11)",
      "Scaffolding Integration (R12)",
    ],
    domains: [
      { id: "R01", name: "State Regulation", description: "Maintenance of cognitive stability under stress." },
      { id: "R02", name: "Cognitive Load", description: "Degradation curves under dual-task interference." },
      { id: "R03", name: "Recovery / Resilience", description: "Post-error recovery kinetics." },
      { id: "R04", name: "Strategy Flexibility", description: "Heuristic shifting upon environmental change." },
      { id: "R05", name: "Calibration", description: "Subjective confidence vs. objective accuracy." },
      { id: "R06", name: "Adaptation", description: "Dynamic learning rate parameter adjustments." },
      { id: "R07", name: "Transfer", description: "Generalization across structural task domains." },
      { id: "R08", name: "Decision Quality", description: "Value computation under risk and ambiguity." },
      { id: "R09", name: "Prospective Model", description: "Lookahead depth in multi-step trees." },
      { id: "R10", name: "Prediction Error Updating", description: "Bayesian belief revision upon surprise." },
      { id: "R11", name: "Accessible Capacity", description: "Peak vs. sustained cognitive throughput." },
      { id: "R12", name: "External Scaffolding", description: "Tool utilization and cognitive offloading." },
    ],
    paradigms: [
      "Dual-Task Load Degradation (R02-01)",
      "Probabilistic Reversal Learning (R10-01)",
      "Post-Error Slowing & Recovery (R03-01)",
    ],
    inputContract: "Multi-block trial dynamics, perturbation injections, difficulty ladders",
    outputContract: "Dynamic parameter tracks: learning rate α, exploration temperature β, resilience index",
    theoreticalGrounding:
      "Reinforcement learning, hierarchical predictive coding, and Cybernetic regulatory control loops.",
    status: "ACTIVE",
  },
  {
    id: "L4",
    name: "Self / Values / Goals",
    category: "Intentionality & Agency",
    description:
      "Endogenous goal selection, subjective agency, value hierarchy arbitration, and intentional effort allocation.",
    coreConstructs: [
      "Sense of Agency (H02)",
      "Values–Goals Alignment (H05)",
      "Effort-Reward Valuation",
      "Goal Conflict Resolution",
    ],
    domains: [
      { id: "H02", name: "Agency", description: "Intentional binding, locus of control in decision outcomes." },
      { id: "H05", name: "Values–Goals Alignment", description: "Coherence between intrinsic values and enacted decisions." },
    ],
    paradigms: [
      "Intentional Binding Clock Paradigm",
      "Effort-Expenditure for Rewards (EEfRT)",
      "Value-Driven Attentional Capture",
    ],
    inputContract: "Choice matrices balancing subjective effort, delay discounting, and moral/value framing",
    outputContract: "Agency binding intervals (ms), subjective utility weightings, value concordance indices",
    theoreticalGrounding:
      "Self-Determination Theory, Active Inference motor intention, and subjective utility theory.",
    status: "SPECIFIED",
  },
  {
    id: "L5",
    name: "Meaning / Future / Identity",
    category: "Narrative & Prospective Integration",
    description:
      "Autobiographical coherence, prospective mental simulation, identity stability, and existential meaning synthesis.",
    coreConstructs: [
      "Identity / Self-Model Continuity (H03)",
      "Meaning & Semantic Coherence (H04)",
      "Episodic Future Thinking",
      "Narrative Architecture",
    ],
    domains: [
      { id: "H03", name: "Identity / Self-Model", description: "Diachronic identity continuity, self-referential processing." },
      { id: "H04", name: "Meaning / Meaning Coherence", description: "Narrative framing, purpose integration under crisis." },
    ],
    paradigms: [
      "Self-Reference Memory Effect",
      "Prospective Scenario Simulation Paradigm",
      "Narrative Coherence Semantic Vector Analysis",
    ],
    inputContract: "Semantic self-referential prompts, prospective future timelines (months to decades)",
    outputContract: "Semantic identity embeddings, prospective clarity ratings, coherence coefficients",
    theoreticalGrounding:
      "Narrative Identity Theory (McAdams), mental time travel (Suddendorf), and autobiographical memory networks.",
    status: "SPECIFIED",
  },
  {
    id: "L6",
    name: "Action / Social / Environment",
    category: "Ecological Interaction",
    description:
      "Dyadic interaction, theory of mind, social calibration, communicative action, and ecological situatedness.",
    coreConstructs: [
      "Social Cognition & Calibration (H01)",
      "Ecological Situated Context (H07)",
      "Cross-Modal Concordance (H09)",
      "Empathic Accuracy & Mentalizing",
    ],
    domains: [
      { id: "H01", name: "Social Cognition / Social Calibration", description: "Theory of mind, social norm calibration, facial affect." },
      { id: "H07", name: "Environment / Context", description: "Ecological validity, real-world context interaction." },
      { id: "H09", name: "Cross-Modal Concordance", description: "Sensorimotor integration across vocal, facial, behavioral cues." },
    ],
    paradigms: [
      "Reading the Mind in the Eyes Test (RMET)",
      "Interactive Ultimatum Game with Dyadic Feedback",
      "Cross-Modal Audio-Visual Emotion Stroop",
    ],
    inputContract: "Multimodal social stimuli (faces, prosody, micro-expressions, multi-agent game states)",
    outputContract: "Mentalizing accuracy scores, strategic reciprocity vectors, multimodal alignment index",
    theoreticalGrounding:
      "Embodied cognition, enactivism (Varela), and social brain hypothesis (Frith & Frith).",
    status: "SPECIFIED",
  },
  {
    id: "L7",
    name: "Development",
    category: "Longitudinal & Ontogenetic Lineage",
    description:
      "Trajectories across ontogeny: maturation, aging, plasticity, structural skill consolidation, and developmental drift.",
    coreConstructs: [
      "Developmental Dynamics (H06)",
      "Critical Window Plasticity",
      "Cognitive Reserve & Age Deceleration",
      "Longitudinal Trajectory Mapping",
    ],
    domains: [
      { id: "H06", name: "Developmental Dynamics", description: "Longitudinal growth curves, maturation inflection points, senescence." },
    ],
    paradigms: [
      "Cross-Cohort Age Invariance Testing",
      "Skill Consolidation & Sleep Deprivation Recovery",
      "Longitudinal Re-Test Stability Tracking",
    ],
    inputContract: "Longitudinal multi-wave session timepoints (T0, T1, T2) with chronological age indices",
    outputContract: "Latent growth curve coefficients, individual difference trajectory slopes, invariance flags",
    theoreticalGrounding:
      "Life-span developmental psychology (Baltes), cognitive reserve hypothesis, and neuroplasticity dynamics.",
    status: "SPECIFIED",
  },
  {
    id: "L8",
    name: "Model Revision / Meta-Level",
    category: "Scientific Meta-Governance",
    description:
      "Meta-level governance: explicit evidence-linked model revision, formal protocol inheritance, Bayesian parameter refactoring, and reproducibility lineage.",
    coreConstructs: [
      "Explicit Evidence-Linked Revision",
      "Cryptographic Decision Ledger",
      "Preregistration Protocol Locks",
      "Model Lineage Versioning (v1.0 → v2.0)",
      "Successor Research Cycle Generation",
    ],
    domains: [
      { id: "GOV-01", name: "Scientific Decision Ledger", description: "SHA-256 tamper-evident decision ledger." },
      { id: "GOV-02", name: "Model Revision Engine", description: "Formal revision contracts with parent-child lineages." },
      { id: "GOV-03", name: "Preregistration Lock Integrator", description: "Pre-execution protocol freeze enforcement." },
    ],
    paradigms: [
      "Model Revision Verification Contract",
      "Ledger Chain Provenance Audit",
      "Contradiction-Triggered Model Updating",
    ],
    inputContract: "Validated Decision record + verified Audit Snapshot + Evidence Graph Hash",
    outputContract: "Immutable Model Revision Record (REV-...) with Successor Cycle Descriptor",
    theoreticalGrounding:
      "Popperian falsificationism, Lakatosian research programmes, and cryptographic transparency ledgers.",
    status: "ACTIVE",
  },
];

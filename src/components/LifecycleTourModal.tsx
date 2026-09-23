import React, { useState } from "react";
import {
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  X,
  Layers,
  Cpu,
  CheckCircle2,
  Lock,
  FileLock2,
  Clock,
  Sparkles,
  GitBranch,
} from "lucide-react";

interface LifecycleTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tabId: string) => void;
}

interface LifecycleStep {
  state: string;
  name: string;
  level: string;
  summary: string;
  contract: string;
  cryptography: string;
  tabTarget: string;
  color: string;
}

const LIFECYCLE_STEPS: LifecycleStep[] = [
  {
    state: "DRAFT",
    name: "Hypothesis & Protocol Formulation",
    level: "L1 Hypothesis Layer",
    summary: "The research investigator initiates experimental goals, operational variables, and candidate tasks.",
    contract: "Pre-validation schema draft; initial construct definition.",
    cryptography: "Provisional session nonce generated.",
    tabTarget: "study-builder",
    color: "slate",
  },
  {
    state: "SPECIFIED",
    name: "Measurement & Timing Contracts Formalized",
    level: "L2 Measurement Layer",
    summary: "Fixed stimulus sets, response key bindings, inter-stimulus intervals, and duration bounds are locked.",
    contract: "Validates against Measurement Registry (e.g. C05-01 Stroop timing window).",
    cryptography: "Specification schema hash computed.",
    tabTarget: "measurement-registry",
    color: "blue",
  },
  {
    state: "REGISTERED",
    name: "OSF Preregistration Freezing",
    level: "L7 Governance Layer",
    summary: "The protocol and analysis pipeline are cryptographically sealed before data acquisition begins to prevent HARKing.",
    contract: "Immutable hypothesis list, power calculation, and primary endpoints.",
    cryptography: "Pre-registration SHA-256 manifest committed to governance ledger.",
    tabTarget: "protocols-preregistration",
    color: "indigo",
  },
  {
    state: "PROVISIONED",
    name: "Hardware & Clock Synchronization",
    level: "L0 Physical & L3 Protocol Layer",
    summary: "Participant test chambers, display refresh timing, and audio drivers are probed and verified.",
    contract: "Jitter budget < 5ms; frame rate stability check passed.",
    cryptography: "Hardware environment fingerprint recorded.",
    tabTarget: "experiment-workspace",
    color: "cyan",
  },
  {
    state: "INITIALIZED",
    name: "Participant Calibration & Warmup",
    level: "L3 Protocol Layer",
    summary: "Baseline participant instructions are displayed and warmup demo trials are executed.",
    contract: "Participant consent verified; input devices validated.",
    cryptography: "Session execution token activated.",
    tabTarget: "research-runtime",
    color: "teal",
  },
  {
    state: "EXECUTING",
    name: "Deterministic Event Bus Runtime",
    level: "L3 Protocol & L4 Data Layer",
    summary: "Active trial execution. Millisecond-accurate reaction times and participant responses stream through the verified event bus.",
    contract: "Deterministic state transitions (INSTRUCTIONS -> COUNTDOWN -> FIXATION -> STIMULUS -> FEEDBACK).",
    cryptography: "High-resolution monotonic timestamps attached to every keystroke.",
    tabTarget: "research-runtime",
    color: "emerald",
  },
  {
    state: "RECORDED",
    name: "Raw Trial Telemetry Capture",
    level: "L4 Data & Provenance Layer",
    summary: "All trial inputs, latencies, stimulus IDs, and correctness metrics are gathered into the session buffer.",
    contract: "Zero trial omissions; all response payloads parsed without loss.",
    cryptography: "Sequential trial event merkle hash tree constructed.",
    tabTarget: "research-runtime",
    color: "amber",
  },
  {
    state: "VERIFYING",
    name: "Automated Contract & Quality Audit",
    level: "L4 Data Layer & L5 Statistical Layer",
    summary: "Audit filters scan for timeout anomalies, outlier reaction times, and contract violations.",
    contract: "Validates against empirical latency bounds [100ms - 3000ms].",
    cryptography: "Integrity verification check passes against expected constraints.",
    tabTarget: "audit-reproducibility",
    color: "violet",
  },
  {
    state: "LOCKED",
    name: "Cryptographic Provenance Lock",
    level: "L4 Data Layer",
    summary: "The entire empirical session is sealed with a SHA-256 digest and appended to the immutable platform audit ledger.",
    contract: "State machine enters read-only mode; data cannot be altered or retroactively deleted.",
    cryptography: "SHA-256 digest computed over trials, parameters, and timestamps.",
    tabTarget: "audit-reproducibility",
    color: "rose",
  },
  {
    state: "PUBLISHED",
    name: "Open-Science Evidence Linkage",
    level: "L6 Epistemic Claim Layer",
    summary: "Empirical aggregates are mapped into the Evidence & Claim Graph, confirming or challenging scientific claims.",
    contract: "Direct traceability from high-level paper assertion to raw trial data.",
    cryptography: "Cryptographic claim certificate and open data export manifest generated.",
    tabTarget: "evidence-claim-graph",
    color: "purple",
  },
  {
    state: "ARCHIVED",
    name: "Long-Term Reproducibility Storage",
    level: "L7 Governance Layer",
    summary: "Full experimental package, container specs, and raw data are preserved for 10+ year archival reproducibility.",
    contract: "BIDS-compatible structure with self-contained replay definitions.",
    cryptography: "Archival checksums verified periodically for bit-rot detection.",
    tabTarget: "audit-reproducibility",
    color: "slate",
  },
  {
    state: "SUPERSEDED",
    name: "L8 Model Revision & Prior Update",
    level: "L8 Model Revision Layer",
    summary: "When new empirical evidence warrants theory refinement, Bayesian priors are formally revised into a successor study.",
    contract: "Explicit lineage pointer to predecessor session with delta justifications.",
    cryptography: "Bidirectional hash pointers in the theoretical lineage graph.",
    tabTarget: "l8-model-revision",
    color: "amber",
  },
];

export const LifecycleTourModal: React.FC<LifecycleTourModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const current = LIFECYCLE_STEPS[currentStepIndex];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
              {currentStepIndex + 1}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                12-State Deterministic Research Lifecycle
              </h3>
              <p className="text-[11px] text-slate-500">
                Step {currentStepIndex + 1} of {LIFECYCLE_STEPS.length} &bull; State: {current.state}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* State Timeline Tracker */}
        <div className="px-6 pt-4 pb-2 overflow-x-auto border-b border-slate-100 flex items-center gap-1.5">
          {LIFECYCLE_STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <button
                key={step.state}
                onClick={() => setCurrentStepIndex(idx)}
                className={`px-2 py-1 rounded text-[10px] font-mono font-bold whitespace-nowrap transition-colors flex items-center gap-1 ${
                  isCurrent
                    ? "bg-blue-600 text-white shadow-2xs"
                    : isCompleted
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {isCompleted && <CheckCircle2 className="h-2.5 w-2.5" />}
                {step.state}
              </button>
            );
          })}
        </div>

        {/* Main Content Body */}
        <div className="p-6 space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                {current.state}
              </span>
              <span className="text-xs font-semibold text-slate-500">{current.level}</span>
            </div>
            <h4 className="text-xl font-bold text-slate-900">{current.name}</h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">{current.summary}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                Deterministic Verification Contract
              </div>
              <p className="text-xs text-slate-600">{current.contract}</p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-emerald-600" />
                Cryptographic Invariant
              </div>
              <p className="text-xs text-slate-600 font-mono text-[11px]">{current.cryptography}</p>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              if (onNavigateTab) onNavigateTab(current.tabTarget);
              onClose();
            }}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            Jump to {current.tabTarget} &rarr;
          </button>

          <div className="flex items-center gap-2">
            <button
              disabled={currentStepIndex === 0}
              onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
              className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 disabled:opacity-40 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Previous
            </button>
            {currentStepIndex < LIFECYCLE_STEPS.length - 1 ? (
              <button
                onClick={() => setCurrentStepIndex((prev) => Math.min(LIFECYCLE_STEPS.length - 1, prev + 1))}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs transition-colors"
              >
                Next State
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs transition-colors"
              >
                Complete Walkthrough
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

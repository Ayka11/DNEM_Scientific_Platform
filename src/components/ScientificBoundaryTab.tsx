import React from "react";
import { ShieldAlert, BookOpen, FileCheck, CheckCircle2 } from "lucide-react";

export const ScientificBoundaryTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl shadow-xs">
        <div className="flex items-start gap-4">
          <div className="p-2.5 bg-amber-100 rounded-lg text-amber-800 flex-shrink-0 mt-0.5">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h2 className="text-base font-bold text-amber-950">
              Operational Scientific Boundary & Disclaimer Notice
            </h2>
            <p className="text-sm text-amber-900 leading-relaxed">
              The DNEM scaffold implements formal data contracts, runtime state machines, measurement registries,
              result pipelines, and cryptographic audit ledgers. It does{" "}
              <strong>not</strong> establish reliability, construct validity, causal inference, population norms,
              diagnostic utility, or clinical/scientific conclusions.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
              E1
            </div>
            <h3 className="font-semibold text-slate-900 text-sm">Level I: Core Cognitive</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Covers 11 domains (Fluid Intelligence, Working Memory, Processing Speed, Attention, Inhibitory Control, etc.) across 55 task specifications. Implements deterministic stimulus onset/offset timing contracts.
          </p>
          <div className="pt-2 text-[11px] font-mono text-slate-500 border-t border-slate-100">
            Maturity: SPECIFIED | Baseline: Behavioral
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-xs">
              E2
            </div>
            <h3 className="font-semibold text-slate-900 text-sm">Level II: Regulatory</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Covers 12 regulatory assessment domains (State Regulation, Cognitive Load, Adaptation, Model Updating, Accessible Capacity) across 60 task specifications with dynamic feedback models.
          </p>
          <div className="pt-2 text-[11px] font-mono text-slate-500 border-t border-slate-100">
            Maturity: SPECIFIED | Baseline: Regulatory
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">
              E3
            </div>
            <h3 className="font-semibold text-slate-900 text-sm">Level III: Higher-Order</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Covers 11 higher-order assessment domains (Social Cognition, Agency, Identity / Self-Model, Meaning Coherence, Neural Concordance) across 55 task specifications.
          </p>
          <div className="pt-2 text-[11px] font-mono text-slate-500 border-t border-slate-100">
            Maturity: SPECIFIED | Baseline: Multimodal
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-blue-600" />
          Reproducibility & Governance Architecture
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Cryptographic Event Sequencing
            </div>
            <p>
              Every runtime transition and participant trial is hashed with SHA-256 in a forward-only sequence. This prevents post-hoc selective reporting and data alteration.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <FileCheck className="h-3.5 w-3.5 text-emerald-600" />
              Preregistration Lock Enforcer
            </div>
            <p>
              Studies require formal freezing before execution. Unregistered hypotheses or statistical models are marked as exploratory rather than confirmatory.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

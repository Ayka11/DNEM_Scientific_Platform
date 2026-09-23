import React from "react";
import { BookOpen, ShieldAlert, Cpu, Award, ExternalLink, Code2, Heart } from "lucide-react";

export const AboutTab: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Intro Header */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono">
          <span>DNEM v7.7 Platform Architecture &bull; Official Release</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          About the DNEM Scientific Platform
        </h2>

        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          The <strong>Deterministic Neurocognitive Experimental Measurement (DNEM)</strong> Platform is an open
          computational research environment designed to establish formal operational contracts, deterministic execution,
          and cryptographic provenance for cognitive science and neuroscience experimentation.
        </p>
      </div>

      {/* Epistemic Boundary Notice */}
      <div className="p-6 bg-amber-50/90 border border-amber-200 rounded-xl flex items-start gap-4 text-amber-950 shadow-2xs">
        <ShieldAlert className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1.5 text-xs leading-relaxed">
          <h3 className="font-bold text-amber-900 text-sm">Formal Scientific & Methodological Boundary</h3>
          <p>
            The platform provides the software scaffold for reproducible experimental psychology: deterministic event
            timing, data contracts, and cryptographic decision ledgers. It intentionally{" "}
            <strong>does not declare candidate constructs to be scientifically valid</strong>.
          </p>
          <p>
            Construct validity, generalizability, population norms, and causal inference require empirical preregistered
            trials, independent peer replication, and external psychometric validation.
          </p>
        </div>
      </div>

      {/* 9-Level Architecture Summary */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-blue-600" />
          The 9-Level Ontological Hierarchy
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {[
            { id: "L0", name: "Reality / External World", sub: "Physics, sensors, display timing" },
            { id: "L1", name: "Biological / Neural", sub: "Autonomic, EEG, neuroendocrine" },
            { id: "L2", name: "Cognitive Processes", sub: "Fluid reasoning, memory, speed, attention" },
            { id: "L3", name: "Regulation / Adaptation", sub: "Cognitive load, resilience, learning rate" },
            { id: "L4", name: "Self / Values / Goals", sub: "Sense of agency, intentional valuation" },
            { id: "L5", name: "Meaning / Future / Identity", sub: "Coherence, narrative continuity" },
            { id: "L6", name: "Action / Social / Environment", sub: "Theory of mind, ecological action" },
            { id: "L7", name: "Development", sub: "Ontogenetic curves, age trajectories" },
            { id: "L8", name: "Model Revision / Meta-Level", sub: "Explicit evidence-linked lineage" },
          ].map((item) => (
            <div key={item.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-blue-700">{item.id}</span>
                <span className="text-[10px] text-slate-400 font-mono">Tiers I-III</span>
              </div>
              <div className="font-semibold text-slate-900">{item.name}</div>
              <div className="text-[11px] text-slate-500 leading-normal">{item.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Runtime Specs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Cpu className="h-4 w-4 text-blue-600" />
            Software Runtime Architecture
          </h3>
          <ul className="text-xs text-slate-600 space-y-2">
            <li className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-500">Core Runtime:</span>
              <span className="font-mono font-semibold text-slate-900">Node.js 22 (LTS)</span>
            </li>
            <li className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-500">API Server:</span>
              <span className="font-mono font-semibold text-slate-900">Express REST /api/v1/*</span>
            </li>
            <li className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-500">UI Engine:</span>
              <span className="font-mono font-semibold text-slate-900">React 18 + Vite SPA</span>
            </li>
            <li className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-500">Cryptography:</span>
              <span className="font-mono font-semibold text-slate-900">SHA-256 Event & Graph Hashing</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-500">Styling:</span>
              <span className="font-mono font-semibold text-slate-900">Tailwind CSS</span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Award className="h-4 w-4 text-purple-600" />
            Theoretical Influences
          </h3>
          <ul className="text-xs text-slate-600 space-y-2">
            <li>
              <strong className="text-slate-900">Karl Popper & Imre Lakatos:</strong> Demarcation, bold conjectures,
              and protective belt heuristic revision without post-hoc immunizing stratagems.
            </li>
            <li>
              <strong className="text-slate-900">CHC Cognitive Framework:</strong> Factorially validated taxonomy of
              human cognitive abilities (Carroll, Horn, Cattell).
            </li>
            <li>
              <strong className="text-slate-900">Karl Friston & Active Inference:</strong> Hierarchical predictive
              coding across biological, cognitive, and communicative sensory-action loops.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

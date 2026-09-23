import React, { useEffect, useState } from "react";
import {
  Layers,
  ShieldCheck,
  FileCheck,
  Cpu,
  Database,
  GitBranch,
  ArrowRight,
  AlertTriangle,
  Activity,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import { useLanguage } from "../i18n.js";

interface OverviewTabProps {
  onNavigate: (tab: string) => void;
  onOpenTour?: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ onNavigate, onOpenTour }) => {
  const { t, isAz } = useLanguage();
  const [stats, setStats] = useState({
    measurementsCount: 170,
    domainsCount: 34,
    levelsCount: 9,
    status: "READY",
  });

  useEffect(() => {
    fetch("/api/v1/health")
      .then((res) => res.json())
      .then((data) => {
        setStats((prev) => ({ ...prev, status: data.status }));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero / Header Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden border border-slate-700">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-mono">
            <Activity className="h-3.5 w-3.5 text-blue-400 animate-pulse" />
            <span>{t("DNEM v7.7 Implementation Baseline • Deterministic Engine")}</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
            {t("Deterministic Neurocognitive Experimental Measurement Platform")}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {t(
              "A unified scientific research operating environment bridging physical signal acquisition (L0), neurobiology (L1), core cognition (L2), dynamic regulation (L3), intentional agency (L4), prospective meaning (L5), social-ecological systems (L6), ontogenetic development (L7), and cryptographic meta-governance (L8)."
            )}
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate("research-runtime")}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
            >
              <Activity className="h-4 w-4" />
              {t("Take Live Cognitive Test")}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onNavigate("nine-level-architecture")}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
            >
              <Layers className="h-4 w-4" />
              {t("Explore 9-Level Architecture")}
            </button>
            <button
              onClick={() => onNavigate("study-builder")}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg text-xs font-semibold border border-slate-600 transition-all"
            >
              <Cpu className="h-4 w-4 text-emerald-400" />
              {t("Launch Study Builder")}
            </button>
            <button
              onClick={() => onNavigate("scientific-governance")}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg text-xs font-semibold border border-slate-600 transition-all"
            >
              <ShieldCheck className="h-4 w-4 text-purple-400" />
              {t("Audit & Governance")}
            </button>
            {onOpenTour && (
              <button
                onClick={onOpenTour}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-950/80 hover:bg-blue-900 text-blue-200 rounded-lg text-xs font-semibold border border-blue-700/80 transition-all"
              >
                <BookOpen className="h-4 w-4 text-blue-300" />
                {t("12-State Lifecycle Tour")}
              </button>
            )}
          </div>
        </div>

        {/* Ambient subtle glow background */}
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Scientific Boundary Notice */}
      <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-xl flex items-start gap-3.5 text-amber-900 shadow-2xs">
        <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <strong>{t("Scientific Boundary & Methodological Contract:")}</strong>{" "}
          {t(
            "This platform implements formal data contracts, runtime state machines, 170 operational measurement specifications, and cryptographic audit ledgers. Synthetic runs are for software contract verification and reproducible protocol specification. It does not impute clinical validity or empirical norms without external preregistered trials."
          )}
          <button
            onClick={() => onNavigate("scientific-boundary")}
            className="ml-2 font-semibold underline hover:text-amber-950 inline-flex items-center gap-0.5 cursor-pointer text-amber-900 transition-colors"
          >
            {isAz ? "Tam Sərhəd Bəyannaməsini Oxuyun →" : "Read Full Boundary Declaration →"}
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t("Ontology Depth")}</div>
          <div className="text-2xl font-bold text-slate-900 font-mono">{t("9 Levels")}</div>
          <p className="text-xs text-slate-500">{t("L0 (Physical) to L8 (Meta-Revision)")}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t("Specifications")}</div>
          <div className="text-2xl font-bold text-slate-900 font-mono">{t("170 Tasks")}</div>
          <p className="text-xs text-slate-500">{t("Across 34 assessment domains")}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t("State Machine")}</div>
          <div className="text-2xl font-bold text-slate-900 font-mono">{t("12 Transitions")}</div>
          <p className="text-xs text-slate-500">{t("Deterministic LOAD → LOCK")}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t("Cryptographic Ledger")}</div>
          <div className="text-2xl font-bold text-emerald-600 font-mono">{t("SHA-256 Valid")}</div>
          <p className="text-xs text-slate-500">{t("Forward-only tamper-evident chain")}</p>
        </div>
      </div>

      {/* Core Workflow Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pillar 1 */}
        <div
          onClick={() => onNavigate("nine-level-architecture")}
          className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-400 hover:shadow-md cursor-pointer transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Layers className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center justify-between">
            <span>{t("9-Level Architecture")}</span>
            <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t(
              "Explore the complete ontology from physical environment signals (L0) up to meta-level scientific model revision (L8), with formal mathematical I/O contracts."
            )}
          </p>
          <div className="pt-2 text-[11px] font-mono text-blue-600 flex items-center gap-1">
            <span>{t("Inspect L0 → L8 taxonomy")}</span>
          </div>
        </div>

        {/* Pillar 2 */}
        <div
          onClick={() => onNavigate("study-builder")}
          className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs hover:border-emerald-400 hover:shadow-md cursor-pointer transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Cpu className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors flex items-center justify-between">
            <span>{t("Study Builder & Runtime")}</span>
            <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t(
              "Assemble multi-domain experimental batteries, freeze protocol hashes, and run synthetic participants through the discrete event bus."
            )}
          </p>
          <div className="pt-2 text-[11px] font-mono text-emerald-600 flex items-center gap-1">
            <span>{t("Configure & execute protocols")}</span>
          </div>
        </div>

        {/* Pillar 3 */}
        <div
          onClick={() => onNavigate("scientific-governance")}
          className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs hover:border-purple-400 hover:shadow-md cursor-pointer transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-slate-900 group-hover:text-purple-600 transition-colors flex items-center justify-between">
            <span>{t("Scientific Governance & Audit")}</span>
            <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t(
              "Monitor real-time analysis integrity, inspect the Evidence & Claim Graph, verify blockchain ledger hashes, and audit model revisions."
            )}
          </p>
          <div className="pt-2 text-[11px] font-mono text-purple-600 flex items-center gap-1">
            <span>{t("View audit ledger & claims")}</span>
          </div>
        </div>
      </div>

      {/* System Architecture Chain */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
          <Database className="h-4 w-4 text-blue-600" />
          {t("Platform Execution Pipeline")}
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 text-center text-xs">
          {[
            { step: "1. Study", desc: "Protocol Freeze" },
            { step: "2. Measurement", desc: "170 Registry" },
            { step: "3. Trial", desc: "Deterministic Run" },
            { step: "4. Result", desc: "Latency & Accuracy" },
            { step: "5. Analysis", desc: "SAP Multiplicity" },
            { step: "6. Evidence", desc: "Graph Binding" },
            { step: "7. Claim", desc: "Falsification Gate" },
            { step: "8. Revision", desc: "L8 Lineage" },
          ].map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <div className="font-semibold text-slate-800 text-[11px]">{t(item.step)}</div>
              <div className="text-[10px] text-slate-500">{t(item.desc)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

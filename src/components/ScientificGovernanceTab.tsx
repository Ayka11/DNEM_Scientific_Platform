import React, { useState, useEffect } from "react";
import { GovernanceSnapshot } from "../types.js";
import { ShieldCheck, RefreshCw, Copy, Check, FileCheck, Layers, GitBranch, Key } from "lucide-react";

export const ScientificGovernanceTab: React.FC = () => {
  const [snapshot, setSnapshot] = useState<GovernanceSnapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchSnapshot = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/governance/snapshot");
      if (res.ok) {
        const data = await res.json();
        setSnapshot(data);
      }
    } catch (err) {
      console.error("Failed to load governance snapshot", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSnapshot();
  }, []);

  const handleCopy = () => {
    if (!snapshot) return;
    navigator.clipboard.writeText(JSON.stringify(snapshot, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
              Scientific Governance & Reproducibility Ledger
            </h2>
            <p className="text-sm text-slate-600">
              Read-only governance audit console. It does not infer empirical clinical validity without external preregistered trials.
            </p>
          </div>
          <button
            id="refresh-governance-btn"
            onClick={fetchSnapshot}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors shadow-sm self-start sm:self-auto"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh Governance Snapshot
          </button>
        </div>
      </div>

      {snapshot && (
        <>
          {/* Main Indicators Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Governance Status</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-emerald-700">{snapshot.status}</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <p className="text-xs text-slate-500">Pipeline validation completed</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Analysis Integrity Score</span>
              <div className="text-lg font-bold text-slate-900 font-mono">
                {snapshot.analysis_integrity?.score ?? 0} / 1.00
              </div>
              <p className="text-xs text-slate-500">
                Readiness: <span className="font-semibold text-blue-600">{snapshot.analysis_integrity?.readiness}</span>
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Evidence Claim Graph</span>
              <div className="text-lg font-bold text-slate-900">
                {snapshot.evidence?.governance_state}
              </div>
              <p className="text-xs text-slate-500">
                {snapshot.evidence?.nodes_count} nodes, {snapshot.evidence?.edges_count} directed edges
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Claim State</span>
              <div className="text-lg font-bold text-slate-900 font-mono">
                {snapshot.claim?.state}
              </div>
              <p className="text-xs text-slate-500">ID: {snapshot.claim?.claim_id}</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Scientific Decision</span>
              <div className="text-lg font-bold text-slate-900">
                {snapshot.decision?.type}
              </div>
              <p className="text-xs text-slate-500 truncate" title={snapshot.decision?.reason}>
                {snapshot.decision?.reason}
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ledger Cryptographic Integrity</span>
              <div className="text-lg font-bold text-slate-900 font-mono">
                {snapshot.ledger?.valid ? "VALID" : "INVALID"}
              </div>
              <p className="text-xs text-slate-500 font-mono truncate" title={snapshot.ledger?.latest_hash}>
                Records: {snapshot.ledger?.records} | Hash: {snapshot.ledger?.latest_hash?.slice(0, 16)}...
              </p>
            </div>
          </div>

          {/* Model Revision & Blocking Reasons */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-purple-600" />
                <h3 className="text-sm font-semibold text-slate-900">Evidence-Linked Model Revision</h3>
              </div>
              {snapshot.model_revision ? (
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-xs space-y-1 font-mono">
                  <div className="flex justify-between">
                    <span className="text-purple-600 font-sans">Revision ID:</span>
                    <span className="font-bold text-purple-900">{snapshot.model_revision.revision_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-600 font-sans">Target Model:</span>
                    <span className="text-purple-900">{snapshot.model_revision.model_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-600 font-sans">Parent Model:</span>
                    <span className="text-purple-900">{snapshot.model_revision.parent_model_id || "None"}</span>
                  </div>
                  <div className="pt-1 font-sans text-purple-800">
                    <strong>Reason:</strong> {snapshot.model_revision.reason}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No model revision active for current cycle.</p>
              )}
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-slate-900">Blocking Reasons / Pre-Conditions</h3>
              </div>
              {snapshot.blocking_reasons.length === 0 ? (
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  No blocking governance conditions identified. Preregistration, multiplicity, and effect-uncertainty requirements satisfied.
                </div>
              ) : (
                <ul className="list-disc pl-5 text-xs text-rose-700 space-y-1">
                  {snapshot.blocking_reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Full Audit Snapshot Code Block */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Key className="h-4 w-4 text-slate-500" />
                Full Cryptographic Audit Record (JSON)
              </span>
              <button
                onClick={handleCopy}
                className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy Record"}
              </button>
            </div>
            <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-xs max-h-72 overflow-y-auto">
              <pre>{JSON.stringify(snapshot, null, 2)}</pre>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

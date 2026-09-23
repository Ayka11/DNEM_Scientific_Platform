import React, { useState, useEffect } from "react";
import { ModelRevisionRecord } from "../types.js";
import {
  GitBranch,
  GitCommit,
  Plus,
  CheckCircle2,
  AlertTriangle,
  History,
  FileCode,
  ArrowRight,
} from "lucide-react";

export const ModelRevisionTab: React.FC = () => {
  const [revisions, setRevisions] = useState<ModelRevisionRecord[]>([]);
  const [selectedRevision, setSelectedRevision] = useState<ModelRevisionRecord | null>(null);

  // Form states
  const [modelId, setModelId] = useState("DNEM-COGNITIVE-MODEL-v2.1");
  const [parentModelId, setParentModelId] = useState("DNEM-COGNITIVE-MODEL-v2.0");
  const [reason, setReason] = useState(
    "Cycle-03 empirical contradiction: Adjusted working memory decay parameter following cross-validation."
  );
  const [componentName, setComponentName] = useState("Domain/C02-Updating");
  const [action, setAction] = useState("UPDATE");
  const [diffText, setDiffText] = useState("-decay_rate: 0.22\n+decay_rate: 0.18\n+stability_window_ms: 1200");

  const fetchRevisions = async () => {
    try {
      const res = await fetch("/api/v1/model-revision/lineage");
      const data = await res.json();
      setRevisions(data.items || []);
      if (data.items?.length && !selectedRevision) {
        setSelectedRevision(data.items[data.items.length - 1]);
      }
    } catch (err) {
      console.error("Failed to load revisions", err);
    }
  };

  useEffect(() => {
    fetchRevisions();
  }, []);

  const handleCreateRevision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modelId.trim() || !reason.trim()) return;

    try {
      const res = await fetch("/api/v1/model-revision/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model_id: modelId,
          parent_model_id: parentModelId,
          reason,
          changes: [{ component: componentName, action, diff: diffText }],
        }),
      });
      const data = await res.json();
      setRevisions((prev) => [...prev, data]);
      setSelectedRevision(data);
      setModelId(`DNEM-COGNITIVE-MODEL-v${(Number(modelId.split("-v")[1] || 2) + 0.1).toFixed(1)}`);
    } catch (err) {
      console.error("Failed to create revision", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-blue-600" />
          L8 Model Revision Lineage Engine v2.0
        </h2>
        <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Connects the persisted research cycle to explicit evidence-linked model revision and prepares successor research
          cycles. Prior records are never overwritten. Model updates require explicit empirical reasons, diff contracts, and
          cryptographic provenance anchors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Commit Form & Lineage List */}
        <div className="space-y-6">
          {/* New Revision Form */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Plus className="h-4 w-4 text-blue-600" />
              Commit Formal Model Revision
            </h3>

            <form onSubmit={handleCreateRevision} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">New Model Identifier</label>
                <input
                  type="text"
                  required
                  value={modelId}
                  onChange={(e) => setModelId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Parent Model Identifier</label>
                <input
                  type="text"
                  value={parentModelId}
                  onChange={(e) => setParentModelId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Empirical Justification / Reason</label>
                <textarea
                  rows={2}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Target Component</label>
                  <input
                    type="text"
                    value={componentName}
                    onChange={(e) => setComponentName(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Action Type</label>
                  <select
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                  >
                    <option value="UPDATE">UPDATE</option>
                    <option value="ADD">ADD</option>
                    <option value="DEPRECATE">DEPRECATE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Parameter Diff (+ / -)</label>
                <textarea
                  rows={3}
                  value={diffText}
                  onChange={(e) => setDiffText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-lg border border-slate-800"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <GitCommit className="h-4 w-4" />
                Commit L8 Revision Record
              </button>
            </form>
          </div>

          {/* Lineage History List */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <History className="h-3.5 w-3.5 text-slate-400" />
              Lineage Chronology ({revisions.length})
            </h3>

            <div className="space-y-2">
              {revisions.map((rev) => {
                const isSelected = selectedRevision?.revision_id === rev.revision_id;
                return (
                  <div
                    key={rev.revision_id}
                    onClick={() => setSelectedRevision(rev)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-blue-50/90 border-blue-300"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold text-slate-900">{rev.model_id}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">
                        {rev.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 line-clamp-1">{rev.reason}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-1 flex justify-between">
                      <span>{rev.revision_id}</span>
                      <span>{rev.changes.length} change(s)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Revision Details & Diff Contract */}
        <div className="lg:col-span-2 space-y-6">
          {selectedRevision ? (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-slate-900 font-mono">{selectedRevision.model_id}</span>
                    <span className="text-xs font-mono px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                      {selectedRevision.revision_id}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {new Date(selectedRevision.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="text-xs text-purple-700 font-mono mt-1">
                  Parent Model: {selectedRevision.parent_model_id || "Root Baseline (None)"}
                </div>
                <p className="text-xs text-slate-700 mt-2 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <strong>Revision Justification:</strong> {selectedRevision.reason}
                </p>
              </div>

              {/* Provenance Cryptographic Anchors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-semibold">Decision Head Hash</span>
                  <div className="text-slate-900 break-all">{selectedRevision.decision_head_hash}</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-semibold">Evidence Anchor Hash</span>
                  <div className="text-slate-900 break-all">{selectedRevision.evidence_anchor_hash}</div>
                </div>
              </div>

              {/* Changes & Diffs */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <FileCode className="h-4 w-4 text-blue-600" />
                  Model Change Delta Contracts ({selectedRevision.changes.length})
                </h4>

                <div className="space-y-3">
                  {selectedRevision.changes.map((ch, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                      <div className="bg-slate-100 px-4 py-2 flex items-center justify-between border-b border-slate-200 font-mono">
                        <span className="font-bold text-slate-800">{ch.component}</span>
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">
                          {ch.action}
                        </span>
                      </div>
                      <div className="p-4 bg-slate-900 text-emerald-400 font-mono text-xs whitespace-pre-wrap">
                        {ch.diff}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Successor Cycle Descriptor */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-1.5 text-xs text-blue-950">
                <div className="font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  Successor Research Cycle Descriptor Prepared
                </div>
                <p className="text-blue-800 text-[11px] leading-relaxed">
                  Successor Cycle ID: <span className="font-mono font-bold">{selectedRevision.successor_cycle_id}</span>.
                  In accordance with the DNEM v7.7 governance guarantee, the successor research cycle is a descriptor only.
                  No new experiment is executed automatically without explicit human preregistration.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-xl border border-slate-200 text-center text-slate-400 text-xs italic">
              Select or commit a model revision to inspect its lineage diff.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

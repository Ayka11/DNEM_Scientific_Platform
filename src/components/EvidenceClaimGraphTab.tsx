import React, { useState, useEffect } from "react";
import { EvidenceGraphData, EvidenceNode } from "../types.js";
import {
  GitMerge,
  ShieldCheck,
  AlertOctagon,
  RefreshCw,
  Copy,
  Check,
  CheckCircle2,
  XCircle,
  Hash,
} from "lucide-react";

export const EvidenceClaimGraphTab: React.FC = () => {
  const [graphData, setGraphData] = useState<EvidenceGraphData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedNode, setSelectedNode] = useState<EvidenceNode | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchGraph = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/evidence/graph");
      const data = await res.json();
      setGraphData(data);
      if (data.nodes?.length && !selectedNode) {
        setSelectedNode(data.nodes[0]);
      }
    } catch (err) {
      console.error("Failed to load evidence graph", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraph();
  }, []);

  const handleCopy = () => {
    if (!graphData) return;
    navigator.clipboard.writeText(JSON.stringify(graphData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <GitMerge className="h-5 w-5 text-blue-600" />
              Evidence & Claim Graph v2.0
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Machine-readable provenance layer connecting scientific objects without treating graph connectivity itself
              as empirical proof. Enforces the strict provenance chain:{" "}
              <strong>Study &rarr; Measurement &rarr; Trial &rarr; Result &rarr; Analysis &rarr; Evidence &rarr; Claim</strong>.
            </p>
          </div>
          <button
            onClick={fetchGraph}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh Graph State
          </button>
        </div>
      </div>

      {graphData && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Status Indicators Banner */}
          <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Governance State</span>
              <div className="text-base font-bold text-emerald-600 font-mono">
                {graphData.governance_state}
              </div>
              <p className="text-[10px] text-slate-500">Fully Traceable & Bound</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Evidence Nodes</span>
              <div className="text-xl font-bold text-slate-900 font-mono">
                {graphData.nodes.length} Nodes
              </div>
              <p className="text-[10px] text-slate-500">From Hypotheses to Claims</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Directed Edges</span>
              <div className="text-xl font-bold text-slate-900 font-mono">
                {graphData.edges.length} Edges
              </div>
              <p className="text-[10px] text-slate-500">Supports & Binds relationships</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Contradictions</span>
              <div className="text-xl font-bold text-slate-900 font-mono">
                {graphData.contradictions_count} Active
              </div>
              <p className="text-[10px] text-emerald-600">No unresolved blocking edges</p>
            </div>
          </div>

          {/* Left Column: Visual Graph Canvas & Edge Table */}
          <div className="lg:col-span-8 space-y-6">
            {/* Visual Node Flow */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
                  Interactive Provenance Chain Visualizer
                </h3>
                <span className="text-[11px] text-slate-400">Click any node to inspect provenance hash</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {graphData.nodes.map((node) => {
                  const isSelected = selectedNode?.id === node.id;
                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-blue-50/90 border-blue-400 shadow-xs"
                          : "bg-slate-50/80 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                            node.type === "HYPOTHESIS"
                              ? "bg-blue-100 text-blue-800"
                              : node.type === "CLAIM"
                              ? "bg-purple-100 text-purple-800"
                              : node.type === "CONTRADICTION"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {node.type}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">{node.hash}</span>
                      </div>
                      <div className="text-xs font-semibold text-slate-900 line-clamp-2">{node.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Directed Edge Relationships */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
                Graph Directed Edge Table ({graphData.edges.length})
              </h3>

              <div className="overflow-x-auto max-h-56">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 text-slate-600 text-[10px] uppercase border-b border-slate-200">
                    <tr>
                      <th className="px-3 py-2">Source Node</th>
                      <th className="px-3 py-2">Relation</th>
                      <th className="px-3 py-2">Target Node</th>
                      <th className="px-3 py-2 text-right">Weight</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {graphData.edges.map((e, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-3 py-2 text-slate-800 font-semibold">{e.from}</td>
                        <td className="px-3 py-2">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              e.relation === "SUPPORTS"
                                ? "bg-emerald-100 text-emerald-800"
                                : e.relation === "CONTRADICTS"
                                ? "bg-rose-100 text-rose-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {e.relation}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-slate-800 font-semibold">{e.to}</td>
                        <td className="px-3 py-2 text-right text-slate-500 font-sans">{e.weight.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Node Details & Graph Hash */}
          <div className="lg:col-span-4 space-y-6">
            {/* Selected Node Details */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
              <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Hash className="h-4 w-4 text-blue-600" />
                Node Provenance Inspector
              </h3>

              {selectedNode ? (
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 font-mono">NODE IDENTIFIER</span>
                    <div className="font-mono font-bold text-slate-900">{selectedNode.id}</div>
                    <div className="text-slate-700 font-sans text-xs">{selectedNode.label}</div>
                  </div>

                  <div className="space-y-2 font-mono">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500 font-sans">Type:</span>
                      <span className="font-semibold text-slate-800">{selectedNode.type}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500 font-sans">Verification:</span>
                      <span className="text-emerald-600 font-semibold">{selectedNode.status}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500 font-sans">Integrity Digest:</span>
                      <span className="text-slate-800 truncate" title={selectedNode.hash}>
                        {selectedNode.hash}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">Select a node from the left to inspect its parameters.</p>
              )}
            </div>

            {/* Canonical Graph SHA-256 Hash */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800 uppercase tracking-wider">Canonical Graph Hash</span>
                <button
                  onClick={handleCopy}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-sans"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="p-3 bg-slate-900 text-slate-200 rounded-lg font-mono text-[11px] break-all leading-relaxed">
                {graphData.graph_hash}
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                Any change in node structure or edge weight produces an altered hash, ensuring total tamper evidence.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

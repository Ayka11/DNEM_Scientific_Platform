import React, { useState, useEffect } from "react";
import { ExperimentDataset } from "../types.js";
import {
  FlaskConical,
  Lock,
  Plus,
  Play,
  CheckCircle2,
  FileSpreadsheet,
  Layers,
  Clock,
  Shield,
} from "lucide-react";

export const ExperimentWorkspaceTab: React.FC = () => {
  const [datasets, setDatasets] = useState<ExperimentDataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDataset, setSelectedDataset] = useState<ExperimentDataset | null>(null);

  // New dataset form
  const [newTitle, setNewTitle] = useState("");
  const [sampleSize, setSampleSize] = useState(60);
  const [conditions, setConditions] = useState("Baseline Fixation, Standard Task Block, Dual-Task Interference");

  const fetchDatasets = async () => {
    try {
      const res = await fetch("/api/v1/experiment/datasets");
      const data = await res.json();
      setDatasets(data.items || []);
      if (data.items?.length && !selectedDataset) {
        setSelectedDataset(data.items[0]);
      }
    } catch (err) {
      console.error("Failed to load datasets", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  const handleCreateDataset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const conditionMatrix = conditions.split(",").map((c) => c.trim()).filter(Boolean);
      const res = await fetch("/api/v1/experiment/datasets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTitle,
          sample_size: sampleSize,
          condition_matrix: conditionMatrix,
        }),
      });
      const data = await res.json();
      setDatasets((prev) => [data, ...prev]);
      setSelectedDataset(data);
      setNewTitle("");
    } catch (err) {
      console.error("Failed to create dataset", err);
    }
  };

  const handleLockDataset = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/experiment/datasets/${id}/lock`, { method: "POST" });
      const data = await res.json();
      setDatasets((prev) => prev.map((d) => (d.dataset_id === id ? data : d)));
      if (selectedDataset?.dataset_id === id) {
        setSelectedDataset(data);
      }
    } catch (err) {
      console.error("Failed to lock dataset", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-blue-600" />
          Experiment Workspace & Dataset Governance
        </h2>
        <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Manage experimental condition matrices, trial timing contracts, blinded participant cohorts, and immutable
          data locks prior to unblinding and confirmatory hypothesis testing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Create & Dataset List */}
        <div className="space-y-6">
          {/* Create Dataset Box */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Plus className="h-4 w-4 text-blue-600" />
              Configure Experimental Cohort
            </h3>
            <form onSubmit={handleCreateDataset} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Dataset / Cohort Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DNEM Cohort Phase-II"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Target Sample Size (N)</label>
                <input
                  type="number"
                  min="10"
                  max="1000"
                  value={sampleSize}
                  onChange={(e) => setSampleSize(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Condition Matrix (comma-separated)
                </label>
                <textarea
                  rows={2}
                  value={conditions}
                  onChange={(e) => setConditions(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs transition-colors"
              >
                Instantiate Dataset Container
              </button>
            </form>
          </div>

          {/* Dataset Selector */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Experimental Datasets ({datasets.length})
            </h3>

            <div className="space-y-2">
              {datasets.map((ds) => {
                const isSelected = selectedDataset?.dataset_id === ds.dataset_id;
                return (
                  <div
                    key={ds.dataset_id}
                    onClick={() => setSelectedDataset(ds)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-blue-50/90 border-blue-300"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-900 truncate">{ds.name}</span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                          ds.data_lock_status === "LOCKED"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {ds.data_lock_status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
                      <span>N = {ds.sample_size} participants</span>
                      <span className="font-mono">{ds.dataset_id}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Columns: Dataset Inspector & Trial Schema Preview */}
        <div className="lg:col-span-2 space-y-6">
          {selectedDataset ? (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">{selectedDataset.name}</h3>
                    <span className="text-xs font-mono px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                      {selectedDataset.dataset_id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Created: {new Date(selectedDataset.created_at).toLocaleString()}
                  </p>
                </div>

                {selectedDataset.data_lock_status !== "LOCKED" ? (
                  <button
                    onClick={() => handleLockDataset(selectedDataset.dataset_id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
                  >
                    <Lock className="h-3.5 w-3.5" />
                    Enforce Cryptographic Data Lock
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-800 border border-purple-200 rounded-lg text-xs font-semibold">
                    <Lock className="h-3.5 w-3.5" />
                    Data Locked (Tamper-Sealed)
                  </span>
                )}
              </div>

              {/* Checksum and Integrity */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1 font-mono">
                <span className="text-slate-500 uppercase text-[10px] font-semibold">SHA-256 Checksum</span>
                <div className="text-slate-900 break-all">{selectedDataset.checksum}</div>
              </div>

              {/* Conditions Matrix */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-800">
                  Assigned Experimental Conditions ({selectedDataset.condition_matrix.length})
                </span>
                <div className="space-y-1.5">
                  {selectedDataset.condition_matrix.map((cond, i) => (
                    <div
                      key={i}
                      className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-blue-600">[{i + 1}]</span>
                        <span>{cond}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">Block {i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real-time Trial Stream Specification Contract */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-800 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  Trial-Level Data Contract Schema (Stimulus & Response Timing)
                </h4>
                <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-xs overflow-x-auto">
                  <pre>{JSON.stringify(
                    {
                      trial_schema: "DNEM-TRIAL-SPEC-v7.7",
                      timing_contracts: {
                        stimulus_onset_window_ms: [180, 220],
                        response_deadline_ms: 1500,
                        inter_stimulus_interval_ms: 500,
                        photodiode_sync: "HARDWARE_TRIGGER_ACTIVE",
                      },
                      exclusion_rules: [
                        "RT < 150ms (anticipatory fast guess)",
                        "RT > 2500ms (timeout omission)",
                        "Eye gaze off ROI > 30% of stimulus window",
                      ],
                    },
                    null,
                    2
                  )}</pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-xl border border-slate-200 text-center text-slate-400 text-xs italic">
              Select or create a dataset to view its configuration.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

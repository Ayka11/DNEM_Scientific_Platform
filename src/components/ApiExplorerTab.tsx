import React, { useState } from "react";
import { Terminal, Play, RefreshCw, Copy, Check } from "lucide-react";

interface Endpoint {
  method: "GET" | "POST";
  path: string;
  description: string;
  defaultBody?: string;
}

const ENDPOINTS: Endpoint[] = [
  {
    method: "GET",
    path: "/api/v1/health",
    description: "System health, version, and implementation status baseline.",
  },
  {
    method: "GET",
    path: "/api/v1/measurements",
    description: "Returns all 170 registered measurement specifications across Tier I, II, III.",
  },
  {
    method: "GET",
    path: "/api/v1/measurements/C01-01",
    description: "Lookup a single measurement specification contract.",
  },
  {
    method: "POST",
    path: "/api/v1/studies",
    description: "Create a new study specification container.",
    defaultBody: JSON.stringify(
      { title: "DNEM Interactive Study", measurement_ids: ["C01-01", "C02-01"], seed: 20260922 },
      null,
      2
    ),
  },
  {
    method: "GET",
    path: "/api/v1/demo-result",
    description: "Fetch a sample aggregated outcome contract for a trial session.",
  },
  {
    method: "POST",
    path: "/api/v1/research/compile-run",
    description: "Compile and execute deterministic trials for given measurement IDs.",
    defaultBody: JSON.stringify(
      { measurement_ids: ["C01-01", "C02-01"], trials_per_measurement: 5 },
      null,
      2
    ),
  },
  {
    method: "GET",
    path: "/api/v1/governance/snapshot",
    description: "Retrieve complete Unified Research Governance audit record.",
  },
];

export const ApiExplorerTab: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint>(ENDPOINTS[0]);
  const [requestBody, setRequestBody] = useState<string>(ENDPOINTS[0].defaultBody || "");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSelect = (ep: Endpoint) => {
    setSelectedEndpoint(ep);
    setRequestBody(ep.defaultBody || "");
    setResponse(null);
  };

  const handleExecute = async () => {
    setLoading(true);
    try {
      const options: RequestInit = {
        method: selectedEndpoint.method,
        headers: { "Content-Type": "application/json" },
      };
      if (selectedEndpoint.method === "POST" && requestBody) {
        options.body = requestBody;
      }
      const res = await fetch(selectedEndpoint.path, options);
      const data = await res.json();
      setResponse({ status: res.status, data });
    } catch (err: any) {
      setResponse({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-1 flex items-center gap-2">
          <Terminal className="h-5 w-5 text-blue-600" />
          Interactive API Explorer
        </h2>
        <p className="text-sm text-slate-600">
          Directly execute and test the migrated backend REST endpoints (`/api/v1/*`) in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Endpoint List */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">
            Available Endpoints
          </div>
          {ENDPOINTS.map((ep, idx) => {
            const isSelected = selectedEndpoint.path === ep.path && selectedEndpoint.method === ep.method;
            return (
              <button
                key={idx}
                onClick={() => handleSelect(ep)}
                className={`w-full text-left p-3 rounded-lg text-xs font-mono transition-colors flex items-center justify-between ${
                  isSelected
                    ? "bg-blue-50 border border-blue-200 text-blue-900 font-semibold"
                    : "hover:bg-slate-50 text-slate-700 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      ep.method === "GET" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {ep.method}
                  </span>
                  <span className="truncate">{ep.path}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Console / Request / Response */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2 font-mono text-sm">
                <span
                  className={`px-2 py-0.5 rounded font-bold text-xs ${
                    selectedEndpoint.method === "GET"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {selectedEndpoint.method}
                </span>
                <span className="text-slate-900 font-semibold">{selectedEndpoint.path}</span>
              </div>
              <button
                id="execute-api-btn"
                onClick={handleExecute}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors shadow-sm self-start sm:self-auto"
              >
                {loading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
                Send Request
              </button>
            </div>

            <p className="text-xs text-slate-600">{selectedEndpoint.description}</p>

            {selectedEndpoint.method === "POST" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Request Body (JSON)</label>
                <textarea
                  rows={5}
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  className="w-full p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-lg border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          {/* Response Output */}
          {response && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                  <span>Response</span>
                  {response.status && (
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        response.status === 200
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      Status: {response.status}
                    </span>
                  )}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(response.data, null, 2));
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>

              <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-xs max-h-72 overflow-y-auto">
                <pre>{JSON.stringify(response.data || response.error, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

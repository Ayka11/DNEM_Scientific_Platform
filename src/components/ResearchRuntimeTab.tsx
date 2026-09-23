import React, { useState, useEffect } from "react";
import { Play, ShieldCheck, Database, RefreshCw, Copy, Check, UserCheck, Cpu } from "lucide-react";
import { InteractiveTestChamber } from "./InteractiveTestChamber.js";
import { useLanguage } from "../i18n.js";

interface ResearchRuntimeTabProps {
  initialParadigm?: string;
}

export const ResearchRuntimeTab: React.FC<ResearchRuntimeTabProps> = ({ initialParadigm = "C05-01" }) => {
  const { isAz } = useLanguage();
  const [runtimeMode, setRuntimeMode] = useState<"interactive" | "batch">("interactive");

  useEffect(() => {
    if (initialParadigm) {
      setRuntimeMode("interactive");
    }
  }, [initialParadigm]);
  const [idsText, setIdsText] = useState("C01-01, C02-01, C03-01");
  const [trialsCount, setTrialsCount] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [runtimeOutput, setRuntimeOutput] = useState<any>(null);
  const [govSessionOutput, setGovSessionOutput] = useState<any>(null);
  const [persistedOutput, setPersistedOutput] = useState<any>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleCompileRun = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/research/compile-run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          measurement_ids: idsText,
          trials_per_measurement: trialsCount,
        }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Execution failed");
      }
      const data = await res.json();
      setRuntimeOutput(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRunSessionGov = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/governance/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ study_id: "UI-DEMO-STUDY" }),
      });
      if (!res.ok) throw new Error("Session governance execution failed");
      const data = await res.json();
      setGovSessionOutput(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRunPersistedGov = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/governance/persisted", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ study_id: "UI-PERSISTED-STUDY" }),
      });
      if (!res.ok) throw new Error("Persisted session governance execution failed");
      const data = await res.json();
      setPersistedOutput(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Primary Mode Selector */}
      <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        <div className="flex rounded-lg bg-slate-100 p-1 flex-1 sm:flex-initial">
          <button
            onClick={() => setRuntimeMode("interactive")}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              runtimeMode === "interactive"
                ? "bg-white text-blue-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <UserCheck className="h-4 w-4 text-emerald-600" />
            <span>{isAz ? "İnteraktiv Test Keç (İnsan İştirakçı)" : "Take Interactive Test (Human Participant)"}</span>
          </button>
          <button
            onClick={() => setRuntimeMode("batch")}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              runtimeMode === "batch"
                ? "bg-white text-blue-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Cpu className="h-4 w-4 text-slate-500" />
            <span>{isAz ? "Avtomatlaşdırılmış Sintetik Paket Mühərriki" : "Automated Synthetic Batch Engine"}</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-500 px-3 hidden md:block">
          {runtimeMode === "interactive" ? (
            <span className="text-emerald-700 font-medium">
              {isAz ? "● Real vaxt rejimində istifadəçi daxiletməsi və ms RT izləməsi aktivdir" : "● Real-time user input & ms RT tracking active"}
            </span>
          ) : (
            <span className="text-slate-500">
              {isAz ? "Sintetik deterministik işləmə mühiti strukturu" : "Synthetic deterministic runtime scaffold"}
            </span>
          )}
        </div>
      </div>

      {/* MODE 1: LIVE INTERACTIVE TEST CHAMBER */}
      {runtimeMode === "interactive" && (
        <InteractiveTestChamber
          initialParadigm={(initialParadigm as any) || "C05-01"}
        />
      )}

      {/* MODE 2: SYNTHETIC BATCH ENGINE */}
      {runtimeMode === "batch" && (
        <div className="space-y-6">
          {/* Configuration Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {isAz ? "Sintetik Paket İcra Mühərriki" : "Synthetic Batch Execution Engine"}
              </h2>
              <p className="text-sm text-slate-600">
                {isAz
                  ? "170 əməliyyat spesifikasiyasının istənilən alt çoxluğu üzrə sintetik sınaq batareyalarını tərtib edin və icra edin."
                  : "Compile and execute synthetic trial batteries across any subset of the 170 operational specifications."}
              </p>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  {isAz ? "Ölçmə İD-ləri (vergüllə ayrılmış)" : "Measurement IDs (comma-separated)"}
                </label>
                <input
                  type="text"
                  id="measurement-ids-input"
                  value={idsText}
                  onChange={(e) => setIdsText(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-xs text-slate-500 mr-1 self-center">
                    {isAz ? "Şablonlar:" : "Presets:"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIdsText("C01-01, C02-01, C03-01")}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs transition-colors"
                  >
                    {isAz ? "Əsas Koqnitiv (C01-C03)" : "Core Cognitive (C01-C03)"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIdsText("R01-01, R02-01, R03-01")}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs transition-colors"
                  >
                    {isAz ? "Tənzimləyici (R01-R03)" : "Regulatory (R01-R03)"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIdsText("H01-01, H02-01, H03-01")}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs transition-colors"
                  >
                    {isAz ? "Ali Səviyyə (H01-H03)" : "Higher-Order (H01-H03)"}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-700">
                    {isAz ? "Hər Ölçmə üzrə Sınaq Sayı" : "Trials per Measurement"}
                  </label>
                  <span className="text-xs font-mono font-bold text-blue-600">{trialsCount}</span>
                </div>
                <input
                  type="range"
                  id="trials-slider"
                  min="1"
                  max="100"
                  value={trialsCount}
                  onChange={(e) => setTrialsCount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>1</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                id="compile-run-btn"
                onClick={handleCompileRun}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
              >
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                {isAz ? "Tərtib et + Paketi Başlat" : "Compile + Run Batch"}
              </button>

              <button
                id="run-session-gov-btn"
                onClick={handleRunSessionGov}
                disabled={loading}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-800 text-xs font-medium rounded-lg transition-colors border border-slate-300"
              >
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                {isAz ? "Cari Sessiyanı Elmi İdarəetmədən Keçir" : "Run Current Session through Scientific Governance"}
              </button>

              <button
                id="run-persisted-gov-btn"
                onClick={handleRunPersistedGov}
                disabled={loading}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-800 text-xs font-medium rounded-lg transition-colors border border-slate-300"
              >
                <Database className="h-4 w-4 text-purple-600" />
                {isAz ? "Saxlanmış Sessiyanı Tam İdarəetmədən Keçir" : "Run Persisted Session through Full Governance"}
              </button>
            </div>
          </div>

          {/* Results View */}
          {runtimeOutput && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 text-sm">
                  {isAz
                    ? `İşləmə Nəticəsi (${runtimeOutput.protocol?.total_trials} ümumi sınaq yaradıldı)`
                    : `Runtime Output (${runtimeOutput.protocol?.total_trials} total trials generated)`}
                </h3>
                <button
                  onClick={() => handleCopy(JSON.stringify(runtimeOutput, null, 2), "runtime")}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-sans"
                >
                  {copiedSection === "runtime" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedSection === "runtime" ? (isAz ? "Kopyalandı" : "Copied") : (isAz ? "JSON Kopyala" : "Copy JSON")}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(runtimeOutput.results || {}).map(([mid, data]: [string, any]) => (
                  <div key={mid} className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-slate-900">{mid}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">
                        {data.scientific_status}
                      </span>
                    </div>
                    <div className="text-slate-600 truncate">{data.domain}</div>
                    <div className="pt-1 border-t border-slate-200 flex justify-between font-mono text-[11px]">
                      <span>{isAz ? "Orta Dəqiqlik:" : "Mean Accuracy:"}</span>
                      <span className="font-semibold text-slate-900">{(data.mean_accuracy * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between font-mono text-[11px]">
                      <span>{isAz ? "Orta RT:" : "Mean RT:"}</span>
                      <span className="font-semibold text-slate-900">{data.mean_rt_ms} ms</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-xs max-h-60 overflow-y-auto">
                <pre>{JSON.stringify(runtimeOutput, null, 2)}</pre>
              </div>
            </div>
          )}

          {/* Governance Session Output */}
          {govSessionOutput && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 text-sm">
                  {isAz ? "Sessiya İdarəetmə Nəticəsi" : "Session Governance Result"}
                </h3>
                <button
                  onClick={() => handleCopy(JSON.stringify(govSessionOutput, null, 2), "session-gov")}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
                >
                  {copiedSection === "session-gov" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedSection === "session-gov" ? (isAz ? "Kopyalandı" : "Copied") : (isAz ? "JSON Kopyala" : "Copy JSON")}
                </button>
              </div>
              <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-xs max-h-60 overflow-y-auto">
                <pre>{JSON.stringify(govSessionOutput, null, 2)}</pre>
              </div>
            </div>
          )}

          {/* Persisted Governance Output */}
          {persistedOutput && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 text-sm">
                  {isAz ? "Saxlanmış Tam İdarəetmə Nəticəsi" : "Persisted Full Governance Result"}
                </h3>
                <button
                  onClick={() => handleCopy(JSON.stringify(persistedOutput, null, 2), "persisted-gov")}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
                >
                  {copiedSection === "persisted-gov" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedSection === "persisted-gov" ? (isAz ? "Kopyalandı" : "Copied") : (isAz ? "JSON Kopyala" : "Copy JSON")}
                </button>
              </div>
              <div className="p-3 bg-purple-50 border border-purple-200 text-purple-900 text-xs rounded-lg">
                {persistedOutput.notice}
              </div>
              <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-xs max-h-60 overflow-y-auto">
                <pre>{JSON.stringify(persistedOutput, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

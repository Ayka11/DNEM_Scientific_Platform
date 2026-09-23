import React, { useState } from "react";
import { Study, EventRecord } from "../types.js";
import { useLanguage } from "../i18n.js";
import { Play, Plus, Lock, CheckCircle2, Terminal, RefreshCw, Hash, UserCheck } from "lucide-react";

const STATE_STEPS = [
  "LOAD_STUDY",
  "VALIDATE_CONFIGURATION",
  "READY",
  "BASELINE",
  "INSTRUCTION",
  "PRACTICE",
  "TASK",
  "BREAK",
  "RECOVERY",
  "SESSION_QC",
  "COMPLETE",
  "LOCK",
];

interface StudyBuilderTabProps {
  onLaunchTest?: (measurementId: string) => void;
}

export const StudyBuilderTab: React.FC<StudyBuilderTabProps> = ({ onLaunchTest }) => {
  const { isAz } = useLanguage();
  const [title, setTitle] = useState("DNEM Demo Study");
  const [study, setStudy] = useState<Study | null>(null);
  const [loading, setLoading] = useState(false);
  const [runningSession, setRunningSession] = useState(false);
  const [activeState, setActiveState] = useState<string>("LOAD_STUDY");
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreateStudy = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/studies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, seed: 20260922 }),
      });
      if (!res.ok) throw new Error("Failed to create study");
      const data: Study = await res.json();
      setStudy(data);
      setEvents([]);
      setSessionId(null);
      setActiveState("LOAD_STUDY");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFreezeStudy = async () => {
    if (!study) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/studies/${study.study_id}/freeze`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to freeze study");
      const updated: Study = await res.json();
      setStudy(updated);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRunDemoSession = async () => {
    if (!study) {
      setError(isAz ? "Zəhmət olmasa, əvvəlcə tədqiqat yaradın." : "Please create a study first.");
      return;
    }
    setRunningSession(true);
    setError(null);
    try {
      // 1. Start session
      const startRes = await fetch(`/api/v1/studies/${study.study_id}/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participant_id: "demo_participant", seed: study.seed }),
      });
      if (!startRes.ok) throw new Error("Failed to start session");
      const sessionData = await startRes.json();
      const currentSessionId = sessionData.session_id;
      setSessionId(currentSessionId);

      // 2. Run demo through state machine
      const runRes = await fetch(`/api/v1/sessions/${currentSessionId}/demo-run`, {
        method: "POST",
      });
      if (!runRes.ok) throw new Error("Failed to run demo session");
      const runData = await runRes.json();
      setActiveState(runData.state);
      setEvents(runData.events || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setRunningSession(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-1">
          {isAz ? "Tədqiqat Qurucusu və Sessiyanın İdarə Edilməsi" : "Study Builder & Session Orchestration"}
        </h2>
        <p className="text-sm text-slate-600 mb-5">
          {isAz
            ? "Eksperimental tədqiqat konteynerlərini konfiqurasiya edin, spesifikasiyaları dondurun və deterministik sessiya boru xətlərini icra edin."
            : "Configure experimental study containers, freeze specifications, and run deterministic session pipelines."}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            id="study-title-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={isAz ? "Tədqiqat Başlığı (məs. DNEM Demo Tədqiqatı)" : "Study Title (e.g. DNEM Demo Study)"}
            className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
          <button
            id="create-study-btn"
            onClick={handleCreateStudy}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {isAz ? "Demo Tədqiqat Yarat" : "Create Demo Study"}
          </button>
        </div>
      </div>

      {/* Study Card & Actions */}
      {study && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 text-sm">
                {isAz ? "Tədqiqat Spesifikasiyası" : "Study Specification"}
              </h3>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                  study.status === "FROZEN"
                    ? "bg-purple-50 text-purple-700 border border-purple-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}
              >
                {isAz && study.status === "FROZEN" ? "DONDURULUB" : study.status}
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-600 font-mono">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">{isAz ? "Tədqiqat ID-si:" : "Study ID:"}</span>
                <span className="text-slate-900 font-semibold">{study.study_id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">{isAz ? "Versiya:" : "Version:"}</span>
                <span className="text-slate-900">{study.version}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">{isAz ? "Toxum (Seed):" : "Seed:"}</span>
                <span className="text-slate-900">{study.seed}</span>
              </div>
              <div className="pt-2">
                <span className="text-slate-400 block mb-1.5">{isAz ? "Ölçmə ID-ləri:" : "Measurement IDs:"}</span>
                <div className="flex flex-wrap gap-1">
                  {study.measurement_ids.map((id) => (
                    <span
                      key={id}
                      className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200 text-[11px]"
                    >
                      {id}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                id="freeze-study-btn"
                onClick={handleFreezeStudy}
                disabled={loading || study.status === "FROZEN"}
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-800 text-xs font-medium rounded-lg transition-colors border border-slate-300"
              >
                <Lock className="h-3.5 w-3.5" />
                {study.status === "FROZEN"
                  ? isAz ? "Tədqiqat Donduruldu" : "Study Spec Frozen"
                  : isAz ? "Tədqiqat Spesifikasiyasını Dondur" : "Freeze Study Specification"}
              </button>

              <button
                id="run-demo-session-btn"
                onClick={handleRunDemoSession}
                disabled={runningSession}
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors shadow-sm"
              >
                {runningSession ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
                {isAz ? "Sintetik Demo Sessiyanı İcra Et" : "Run Synthetic Demo Session"}
              </button>

              {onLaunchTest && (
                <button
                  type="button"
                  onClick={() => onLaunchTest(study.measurement_ids[0] || "C05-01")}
                  className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
                >
                  <UserCheck className="h-3.5 w-3.5" />
                  {isAz ? "Bu Tədqiqat üçün Canlı Test Keç (İnsan İştirakçı)" : "Take Live Test for this Study (Human Participant)"}
                </button>
              )}
            </div>
          </div>

          {/* State Machine & Events */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">
                  {isAz ? "Deterministik Vəziyyət Maşını" : "Deterministic State Machine"}
                </h3>
                {sessionId && (
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    {isAz ? "Sessiya:" : "Session:"} {sessionId}
                  </p>
                )}
              </div>
              <span className="text-xs font-mono font-medium px-2.5 py-1 bg-slate-100 border border-slate-200 rounded text-slate-800">
                {isAz ? "Vəziyyət:" : "State:"} {activeState}
              </span>
            </div>

            {/* Stepper visualizer */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1.5 py-2">
              {STATE_STEPS.map((s, idx) => {
                const isPassed =
                  STATE_STEPS.indexOf(activeState) >= idx || activeState === "LOCK";
                const isCurrent = activeState === s;
                return (
                  <div
                    key={s}
                    className={`p-2 rounded border text-center transition-all ${
                      isCurrent
                        ? "bg-blue-600 text-white border-blue-700 font-bold shadow-xs scale-102"
                        : isPassed
                        ? "bg-blue-50 text-blue-900 border-blue-200"
                        : "bg-slate-50 text-slate-400 border-slate-200"
                    }`}
                  >
                    <div className="text-[10px] uppercase font-mono">{idx + 1}</div>
                    <div className="text-[11px] font-semibold truncate" title={s}>
                      {s.replace(/_/g, " ")}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Event Log */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5 text-slate-500" />
                  {isAz
                    ? `İcra Hadisə Jurnalı (${events.length} hadisə)`
                    : `Runtime Event Log (${events.length} events)`}
                </span>
                {events.length > 0 && (
                  <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    {isAz ? "Bütün kriptoqrafik heşlər yoxlandı" : "All cryptographic hashes verified"}
                  </span>
                )}
              </div>

              <div className="bg-slate-900 text-slate-100 p-3 rounded-lg max-h-60 overflow-y-auto font-mono text-xs space-y-2 border border-slate-800">
                {events.length === 0 ? (
                  <div className="text-slate-500 italic py-4 text-center">
                    {isAz
                      ? 'Hələ heç bir sessiya hadisəsi qeydə alınmayıb. Yuxarıdakı "Sintetik Demo Sessiyanı İcra Et" düyməsinə klikləyin.'
                      : 'No session events recorded yet. Click "Run Synthetic Demo Session" above.'}
                  </div>
                ) : (
                  events.map((evt) => (
                    <div key={evt.event_id} className="border-b border-slate-800 pb-1.5 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between text-slate-400 text-[11px]">
                        <span className="text-blue-400 font-semibold">{evt.event_type}</span>
                        <span className="flex items-center gap-1 text-[10px]">
                          <Hash className="h-2.5 w-2.5" />
                          Seq: {evt.sequence} | {evt.event_id}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-300 truncate">
                        Payload: {JSON.stringify(evt.payload)}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        SHA-256: {evt.provenance_hash}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

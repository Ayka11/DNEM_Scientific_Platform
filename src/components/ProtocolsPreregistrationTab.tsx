import React, { useState, useEffect } from "react";
import { PreregistrationRecord } from "../types.js";
import { useLanguage } from "../i18n.js";
import {
  FileLock2,
  Lock,
  Plus,
  GitBranch,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";

export const ProtocolsPreregistrationTab: React.FC = () => {
  const { isAz } = useLanguage();
  const [locks, setLocks] = useState<PreregistrationRecord[]>([]);
  const [selectedLock, setSelectedLock] = useState<PreregistrationRecord | null>(null);

  // New Preregistration Form
  const [studyId, setStudyId] = useState("STUDY-CONFIRMATORY-01");
  const [title, setTitle] = useState("Confirmatory Fluid Cognition & Working Memory Battery");
  const [hypothesisText, setHypothesisText] = useState(
    "H1: Matrix reasoning performance exhibits significant correlation with 2-back updating\nH2: Cognitive fatigue does not attenuate task switching latency"
  );

  // Amendment Form
  const [amendmentReason, setAmendmentReason] = useState("");
  const [amending, setAmending] = useState(false);

  const fetchLocks = async () => {
    try {
      const res = await fetch("/api/v1/protocols/preregistration");
      const data = await res.json();
      setLocks(data.items || []);
      if (data.items?.length && !selectedLock) {
        setSelectedLock(data.items[0]);
      }
    } catch (err) {
      console.error("Failed to load preregistrations", err);
    }
  };

  useEffect(() => {
    fetchLocks();
  }, []);

  const handleCreateLock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const hypotheses = hypothesisText.split("\n").map((h) => h.trim()).filter(Boolean);
      const res = await fetch("/api/v1/protocols/preregistration/lock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ study_id: studyId, title, hypotheses }),
      });
      const data = await res.json();
      setLocks((prev) => [data, ...prev]);
      setSelectedLock(data);
      setTitle("");
    } catch (err) {
      console.error("Failed to lock protocol", err);
    }
  };

  const handleAmendLock = async () => {
    if (!selectedLock || !amendmentReason.trim()) return;

    try {
      const res = await fetch(`/api/v1/protocols/preregistration/${selectedLock.lock_id}/amend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: amendmentReason }),
      });
      const data = await res.json();
      setLocks((prev) => prev.map((l) => (l.lock_id === data.lock_id ? data : l)));
      setSelectedLock(data);
      setAmendmentReason("");
      setAmending(false);
    } catch (err) {
      console.error("Failed to amend protocol", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <FileLock2 className="h-5 w-5 text-blue-600" />
          {isAz
            ? "Protokollar və Öncədən Qeydiyyat Protokol Kilidi Mühərriki"
            : "Protocols & Preregistration Protocol Lock Engine"}
        </h2>
        <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
          {isAz
            ? "Eksperiment icrasından əvvəl tədqiqat dizaynlarını, statistik planları və hipotezləri dəyişməz kriptoqrafik manifestlərdə dondurmaqla açıq elm dəqiqliyini təmin edir. Hər hansı sonrakı düzəlişlər formal olaraq post-hoc düzəliş kimi audit edilir."
            : "Guarantees open science rigor by freezing study designs, statistical plans, and hypotheses into immutable cryptographic manifests before experimental execution. Any subsequent adjustments are formally audited as post-hoc amendments."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Lock Form & Protocol List */}
        <div className="space-y-6">
          {/* Create Lock Box */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Lock className="h-4 w-4 text-blue-600" />
              {isAz ? "Yeni Öncədən Qeydiyyat Kilidini Dondurun" : "Freeze New Preregistration Lock"}
            </h3>

            <form onSubmit={handleCreateLock} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {isAz ? "Tədqiqat İdentifikatoru" : "Study Identifier"}
                </label>
                <input
                  type="text"
                  required
                  value={studyId}
                  onChange={(e) => setStudyId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {isAz ? "Protokol Başlığı" : "Protocol Title"}
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {isAz ? "Təsdiqləyici Hipotezlər (hər sətirə biri)" : "Confirmatory Hypotheses (one per line)"}
                </label>
                <textarea
                  rows={3}
                  value={hypothesisText}
                  onChange={(e) => setHypothesisText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono text-[11px]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Lock className="h-3.5 w-3.5" />
                {isAz ? "Protokolu Kriptoqrafik Dondurun" : "Cryptographically Freeze Protocol"}
              </button>
            </form>
          </div>

          {/* List of Registered Locks */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {isAz ? `Öncədən Qeydiyyatlı Protokollar (${locks.length})` : `Preregistered Protocols (${locks.length})`}
            </h3>

            <div className="space-y-2">
              {locks.map((lk) => {
                const isSelected = selectedLock?.lock_id === lk.lock_id;
                return (
                  <div
                    key={lk.lock_id}
                    onClick={() => setSelectedLock(lk)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-blue-50/90 border-blue-300"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold text-slate-900 truncate">{lk.lock_id}</span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                          lk.status === "LOCKED"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {lk.status === "LOCKED" && isAz ? "KİLİDLƏNİB" : lk.status}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-slate-700 truncate">{lk.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-1">
                      {isAz
                        ? `${lk.amendments?.length || 0} düzəliş qeydiyyatdan keçib`
                        : `${lk.amendments?.length || 0} amendments registered`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Preregistration Detail & Amendment Engine */}
        <div className="lg:col-span-2 space-y-6">
          {selectedLock ? (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">{selectedLock.title}</h3>
                    <span className="text-xs font-mono px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-semibold">
                      {selectedLock.lock_id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {isAz ? "Kilidləndi:" : "Locked At:"} {new Date(selectedLock.locked_at).toLocaleString()} &bull;{" "}
                    {isAz ? "Tədqiqat ID:" : "Study ID:"} {selectedLock.study_id}
                  </p>
                </div>

                <button
                  onClick={() => setAmending(!amending)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold border border-slate-300 transition-colors self-start sm:self-auto"
                >
                  <GitBranch className="h-3.5 w-3.5 text-purple-600" />
                  {isAz ? "Formal Düzəlişi Qeydiyyata Al" : "Register Formal Amendment"}
                </button>
              </div>

              {/* Amendment Box */}
              {amending && (
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl space-y-3 text-xs">
                  <span className="font-semibold text-purple-900 block">
                    {isAz ? "Kiliddən Sonrakı Formal Protokol Düzəlişi" : "Formal Post-Lock Protocol Amendment"}
                  </span>
                  <p className="text-purple-700 text-[11px]">
                    {isAz
                      ? "Seçmə, əsas nəticələr və ya istisna meyarlarına dair dəyişiklikləri sənədləşdirin. Düzəliş ana kilid heşinə kriptoqrafik olaraq zəncirlənəcəkdir."
                      : "Document changes to sampling, primary outcomes, or exclusion criteria. The amendment will be cryptographically chained to the parent lock hash."}
                  </p>
                  <textarea
                    rows={2}
                    placeholder={
                      isAz
                        ? "Düzəliş üçün metodoloji əsaslandırmanı daxil edin..."
                        : "Provide explicit methodological justification for amendment..."
                    }
                    value={amendmentReason}
                    onChange={(e) => setAmendmentReason(e.target.value)}
                    className="w-full p-2.5 bg-white border border-purple-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setAmending(false)}
                      className="px-3 py-1 bg-white text-slate-600 rounded-lg border border-slate-200"
                    >
                      {isAz ? "İmtina" : "Cancel"}
                    </button>
                    <button
                      onClick={handleAmendLock}
                      className="px-3 py-1 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700"
                    >
                      {isAz ? "Düzəliş Heşini Təsdiqlə" : "Commit Amendment Hash"}
                    </button>
                  </div>
                </div>
              )}

              {/* Checksum and Integrity */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1 font-mono">
                <span className="text-slate-500 uppercase text-[10px] font-semibold">
                  {isAz ? "Dəyişməz Protokol Xülasəsi" : "Immutable Protocol Digest"}
                </span>
                <div className="text-slate-900 break-all">{selectedLock.hash}</div>
              </div>

              {/* Hypotheses */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-800">
                  {isAz ? "Təsdiqləyici Hipotezlər" : "Confirmatory Hypotheses"}
                </span>
                <div className="space-y-1.5">
                  {selectedLock.hypotheses.map((h, i) => (
                    <div
                      key={i}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 flex items-start gap-2"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>{h}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Analysis Plan Specifications */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <span className="font-semibold text-slate-800 uppercase text-[10px] tracking-wider">
                  {isAz ? "Dondurulmuş Analiz Spesifikasiyaları" : "Frozen Analysis Specifications"}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-slate-500 block">{isAz ? "Əsas Nəticələr:" : "Primary Outcomes:"}</span>
                    <span className="font-mono font-semibold text-slate-900">
                      {selectedLock.analysis_spec.primary_outcomes.join(", ")}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">{isAz ? "Çoxluq Düzəlişi:" : "Multiplicity Correction:"}</span>
                    <span className="font-mono font-semibold text-slate-900">
                      {selectedLock.analysis_spec.multiplicity_correction}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">{isAz ? "Hədəf Nümunə Ölçüsü:" : "Sample Size Target:"}</span>
                    <span className="font-mono font-semibold text-slate-900">
                      N = {selectedLock.analysis_spec.sample_size_target}
                    </span>
                  </div>
                </div>
              </div>

              {/* Amendment History */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-800">
                  {isAz
                    ? `Qeydiyyata Alınmış Düzəliş Silsiləsi (${selectedLock.amendments?.length || 0})`
                    : `Registered Amendment Lineage (${selectedLock.amendments?.length || 0})`}
                </span>
                {selectedLock.amendments?.length ? (
                  <div className="space-y-2">
                    {selectedLock.amendments.map((am) => (
                      <div
                        key={am.amendment_id}
                        className="p-3 bg-purple-50/60 border border-purple-200 rounded-lg text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-purple-900">{am.amendment_id}</span>
                          <span className="text-[10px] text-purple-600">{new Date(am.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-slate-800 font-sans">{am.reason}</p>
                        <div className="text-[10px] font-mono text-purple-700 break-all">Hash: {am.hash}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 rounded-lg text-slate-400 text-xs italic text-center">
                    {isAz
                      ? "Heç bir düzəliş qeydə alınmayıb. Protokol 100% ilkin dondurulma dəqiqliyində qalır."
                      : "No amendments recorded. Protocol remains at 100% initial freeze fidelity."}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-xl border border-slate-200 text-center text-slate-400 text-xs italic">
              {isAz
                ? "Təfərrüatlara baxmaq üçün öncədən qeydiyyat protokolunu seçin və ya dondurun."
                : "Select or freeze a preregistration protocol to view details."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

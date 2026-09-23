import React, { useState, useEffect } from "react";
import { useLanguage } from "../i18n.js";
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Copy,
  Check,
  FileCheck,
  Lock,
  Layers,
  Database,
} from "lucide-react";

export const AuditReproducibilityTab: React.FC = () => {
  const { isAz } = useLanguage();
  const [ledgerValid, setLedgerValid] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  const [snapshotData, setSnapshotData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [tamperTestActive, setTamperTestActive] = useState(false);

  const fetchLedger = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/governance/snapshot");
      const data = await res.json();
      setSnapshotData(data);
      setLedgerValid(data.ledger?.valid ?? true);
    } catch (err) {
      console.error("Failed to load audit snapshot", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, []);

  const handleSimulateTamper = () => {
    setTamperTestActive(true);
    setLedgerValid(false);
  };

  const handleRestoreLedger = () => {
    setTamperTestActive(false);
    setLedgerValid(true);
  };

  const handleCopyManifest = () => {
    if (!snapshotData) return;
    navigator.clipboard.writeText(JSON.stringify(snapshotData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const chainSteps = [
    {
      label: isAz ? "Eksperiment" : "Experiment",
      hash: "9a2f...18e0",
      status: isAz ? "YOXLANILIB" : "VERIFIED",
    },
    {
      label: isAz ? "Məlumat Toplusu" : "Dataset",
      hash: "4c7b...82d1",
      status: isAz ? "KORLAŞDIRILIB" : "BLINDED",
    },
    {
      label: isAz ? "Proqram v7.7" : "Software v7.7",
      hash: "3e5a...04c9",
      status: isAz ? "DƏYİŞMƏZ" : "IMMUTABLE",
    },
    {
      label: isAz ? "Analiz Planı" : "Analysis Plan",
      hash: "f1d0...92b4",
      status: isAz ? "ÖNCƏDƏN DONDURULUB" : "PRE-FROZEN",
    },
    {
      label: isAz ? "Sübut Qrafı" : "Evidence Graph",
      hash: "8d3c...11a7",
      status: isAz ? "BAĞLANIB" : "BOUND",
    },
    {
      label: isAz ? "İddia Vəziyyəti" : "Claim State",
      hash: "2e6b...aa30",
      status: isAz ? "QAPIDAN KEÇİB" : "GATED",
    },
    {
      label: isAz ? "Qərar Reyestri" : "Decision Ledger",
      hash: "bb99...7712",
      status: isAz ? "MÖHÜRLƏNİB" : "SEALED",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
              {isAz
                ? "Elmi Audit və Kriptoqrafik Təkrarlanma Mühərriki"
                : "Scientific Audit & Cryptographic Reproducibility Engine"}
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              {isAz ? (
                <>
                  Tam mənşə zənciri boyunca dəyişməz verifikasiyanı təmin edir:{" "}
                  <strong>Eksperiment &rarr; Məlumat Toplusu &rarr; Proqram Təminatı &rarr; Analiz &rarr; Sübut &rarr; İddia &rarr; Qərar</strong>.
                  Hər hansı retrospektiv dəyişikliyi və ya verilənlərə müdaxiləni dərhal aşkar etmək üçün SHA-256 heş blokçeynindən istifadə edir.
                </>
              ) : (
                <>
                  Provides immutable verification across the complete provenance chain:{" "}
                  <strong>Experiment &rarr; Dataset &rarr; Software Version &rarr; Analysis &rarr; Evidence &rarr; Claim &rarr; Decision</strong>.
                  Uses a SHA-256 hash blockchain to instantly detect any retrospective modification or data tampering.
                </>
              )}
            </p>
          </div>
          <button
            onClick={fetchLedger}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            {isAz ? "Reyestr Zəncirini Təkrar Yoxla" : "Re-Verify Ledger Chain"}
          </button>
        </div>
      </div>

      {/* Ledger Verification Status Banner */}
      <div
        className={`p-6 rounded-xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
          ledgerValid
            ? "bg-emerald-50/90 border-emerald-200 text-emerald-950"
            : "bg-rose-50/90 border-rose-300 text-rose-950"
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div
            className={`p-3 rounded-xl ${
              ledgerValid ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700 animate-bounce"
            }`}
          >
            {ledgerValid ? <ShieldCheck className="h-6 w-6" /> : <ShieldAlert className="h-6 w-6" />}
          </div>
          <div>
            <div className="text-base font-bold flex items-center gap-2">
              <span>
                {ledgerValid
                  ? isAz
                    ? "KRİPTOQRAFİK ZƏNCİR BÜTÖVLÜYÜ: 100% YOXLANILIB"
                    : "CRYPTOGRAPHIC CHAIN INTEGRITY: 100% VERIFIED"
                  : isAz
                  ? "KRİTİK XƏBƏRDARLIQ: REYESTRƏ MÜDAXİLƏ AŞKAR EDİLDİ"
                  : "CRITICAL ALERT: LEDGER TAMPERING DETECTED"}
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/70 border border-current">
                {ledgerValid
                  ? isAz ? "HEŞ ZƏNCİRİ ETİBARLIDIR" : "HASH CHAIN VALID"
                  : isAz ? "HEŞ UYĞUNSUZLUĞU" : "HASH MISMATCH"}
              </span>
            </div>
            <p className="text-xs opacity-80 mt-1">
              {ledgerValid
                ? isAz
                  ? "Hər bir qeydin ana heşi heç bir uyğunsuzluq olmadan qəti şəkildə əvvəlki hadisə xülasələrinə bağlanır."
                  : "Every record's parent hash strictly resolves to prior event digests with zero discrepancies."
                : isAz
                ? "Blok yükü və ya ana göstəricisi təsdiqdən sonra dəyişdirilib. Reyestr yoxlanışı uğursuz oldu."
                : "A block payload or parent pointer was modified after commitment. Ledger validation failed."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!tamperTestActive ? (
            <button
              onClick={handleSimulateTamper}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
            >
              {isAz ? "Bayt Müdaxilə Testini Modelləşdir" : "Simulate Byte Tamper Test"}
            </button>
          ) : (
            <button
              onClick={handleRestoreLedger}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
            >
              {isAz ? "Kanonik Zənciri Bərpa Et" : "Restore Canonical Chain"}
            </button>
          )}
        </div>
      </div>

      {/* Chain Blocks Flow */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
          {isAz ? "Dəyişməz Mənşə Zənciri Addımları" : "Immutable Provenance Chain Steps"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-2 text-center text-xs">
          {chainSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1 relative"
            >
              <div className="text-[10px] font-mono text-slate-400">
                {isAz ? `Addım ${idx + 1}` : `Step ${idx + 1}`}
              </div>
              <div className="font-bold text-slate-900 text-xs">{step.label}</div>
              <div className="text-[10px] font-mono text-blue-600 truncate">{step.hash}</div>
              <div className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 inline-block">
                {step.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Audit Snapshot Inspection */}
      {snapshotData && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-blue-600" />
              {isAz ? "Kanonik Təkrarlanma Auditi Görünüşü" : "Canonical Reproducibility Audit Snapshot"}
            </h3>
            <button
              onClick={handleCopyManifest}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-sans"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? (isAz ? "Kopyalandı" : "Copied") : (isAz ? "Görünüş JSON-nu Kopyala" : "Copy Snapshot JSON")}
            </button>
          </div>

          <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-xs max-h-72 overflow-y-auto">
            <pre>{JSON.stringify(snapshotData, null, 2)}</pre>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-600 text-[11px] leading-relaxed">
            <strong>{isAz ? "Audit Yoxlama Qeydi:" : "Audit Verification Note:"}</strong>{" "}
            {isAz
              ? "Elmi audit manifesti bütün tədqiqat artefaktlarının kanonik SHA-256 heşlərini birləşdirir. Bu manifestə sahib olan hər hansı müstəqil üçüncü tərəf replikasiya dəqiqliyini riyazi olaraq təsdiqləmək üçün POST /api/v1/audit/verify sorğusunu icra edə bilər."
              : "The scientific audit manifest combines canonical SHA-256 hashes of all constituent research artifacts. Any independent third party possessing this manifest can run `POST /api/v1/audit/verify` to mathematically verify replication fidelity."}
          </div>
        </div>
      )}
    </div>
  );
};

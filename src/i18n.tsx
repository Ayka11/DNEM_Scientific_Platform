import React, { useEffect, useState } from "react";

export type LanguageCode = "en" | "az";

export const AZ: Record<string, string> = {
  "Overview": "Ümumi baxış",
  "9-Level Architecture": "9 Səviyyəli Arxitektura",
  "About": "Haqqında",
  "Study Builder": "Tədqiqat Qurucusu",
  "Measurement Registry": "Ölçmə Reyestri",
  "Protocols & Preregistration": "Protokollar və Öncədən Qeydiyyat",
  "Experiment Workspace": "Eksperiment İş Sahəsi",
  "Research Runtime": "Tədqiqat İcra Mühiti",
  "Results & Analysis": "Nəticələr və Analiz",
  "Evidence & Claim Graph": "Sübut və İddia Qrafı",
  "Scientific Governance": "Elmi İdarəetmə",
  "Audit & Reproducibility": "Audit və Təkrarlana Bilənlik",
  "L8 Model Revision": "L8 Model Reviziyası",
  "All Modules": "Bütün Modullar",
  "Foundations": "Əsaslar",
  "Design & Protocols": "Dizayn və Protokollar",
  "Execution & Runtime": "İcra və İş Mühiti",
  "Governance & Verification": "İdarəetmə və Verifikasiya",
  "Groups:": "Qruplar:",
  "Search": "Axtarış",
  "12-State Tour": "12 Mərhələli Tur",
  "API Ready": "API Hazırdır",
  "DNEM Scientific Platform": "DNEM Elmi Platforması",
  "Deterministic Research Scaffold • Operational Specifications • Verification Baseline": "Deterministik Tədqiqat Skeleti • Əməliyyat Spesifikasiyaları • Verifikasiya Bazası",
  "L0 → L8 Architecture": "L0 → L8 Arxitekturası",
  "L0 → L8 Deterministic Research Runtime": "L0 → L8 Deterministik Tədqiqat İcra Mühiti",
  "Switch to Laboratory Dark Mode": "Laboratoriya qaranlıq rejiminə keç",
  "Switch to Laboratory Light Mode": "Laboratoriya işıqlı rejiminə keç",
  "Quick search (Cmd+K / Ctrl+K)": "Sürətli axtarış (Cmd+K / Ctrl+K)",
  "Scientific Platform Navigation": "Elmi Platforma Naviqasiyası",
  "About the DNEM Scientific Platform": "DNEM Elmi Platforması haqqında",
  "Formal Scientific & Methodological Boundary": "Formal Elmi və Metodoloji Sərhəd",
  "does not declare candidate constructs to be scientifically valid": "namizəd konstruktların elmi cəhətdən etibarlı olduğunu elan etmir",
  "Study Builder & Session Orchestration": "Tədqiqat Qurucusu və Sessiya Orkestrasiya Sistemi",
  "Configure experimental study containers, freeze specifications, and run deterministic session pipelines.": "Eksperimental tədqiqat konteynerlərini konfiqurasiya edin, spesifikasiyaları dondurun və deterministik sessiya boru xətlərini icra edin.",
  "Study Title (e.g. DNEM Demo Study)": "Tədqiqat başlığı (məsələn, DNEM Demo Study)",
  "Create Demo Study": "Demo Tədqiqatı Yarat",
  "Study Specification": "Tədqiqat Spesifikasiyası",
  "Study Spec Frozen": "Tədqiqat spesifikasiyası dondurulub",
  "Freeze Study Specification": "Tədqiqat Spesifikasiyasını Dondur",
  "Run Synthetic Demo Session": "Sintetik Demo Sessiyasını İcra Et",
  "Take Live Test for this Study (Human Participant)": "Bu Tədqiqat üçün Canlı Testi Keç (İnsan İştirakçı)",
  "Deterministic State Machine": "Deterministik Vəziyyət Maşını",
  "Runtime Event Log": "İcra Mühiti Hadisə Jurnalı",
  "All cryptographic hashes verified": "Bütün kriptoqrafik heşlər yoxlanılıb",
  "Back to Task List": "Tapşırıq siyahısına qayıt",
  "Take Interactive Test (Human Participant)": "İnteraktiv Testi Keç (İnsan İştirakçı)",
  "Take Live Cognitive Test": "Canlı Koqnitiv Testi Keç",
  "I Am Ready — Start Test": "Hazıram — Testə Başla",
  "Proceed to Instructions": "Təlimatlara keç",
  "Retake Test": "Testi yenidən keç",
  "Exit Test": "Testdən çıx",
  "Start in Fullscreen Mode": "Tam ekran rejimində başla",
  "Exit Fullscreen (Esc)": "Tam ekrandan çıx (Esc)",
  "Interactive Cognitive Battery Execution": "İnteraktiv Koqnitiv Batareya İcrası",
  "Live Human Participant Testing Chamber": "Canlı İnsan İştirakçı Test Kamerası",
  "Keep fingers on response keys": "Barmaqlarınızı cavab düymələrinin üzərində saxlayın",
  "Focus on the MIDDLE arrow direction only": "Yalnız ORTA oxun istiqamətinə diqqət edin",
  "Select the tile that completes the pattern:": "Naxışı tamamlayan xanəni seçin:",
  "Does this match the letter from 2 steps back?": "Bu, iki addım əvvəlki hərflə uyğun gəlirmi?",
  "Platform Overview": "Platformaya ümumi baxış",
  "Explore 9-Level Architecture": "9 Səviyyəli Arxitekturanı araşdır",
  "Launch Study Builder": "Tədqiqat Qurucusunu işə sal",
  "Interactive API Explorer": "İnteraktiv API Araşdırıcısı",
  "Available Endpoints": "Mövcud Son Nöqtələr",
  "Request Body (JSON)": "Sorğu gövdəsi (JSON)",
  "Response": "Cavab",
  "Execute Preregistered SAP": "Öncədən qeydiyyatdan keçmiş SAP-ni icra et",
  "Results & Statistical Analysis Plan (SAP) Execution": "Nəticələr və Statistik Analiz Planının (SAP) İcrası",
  "Raw Statistical Output Record": "Xam Statistik Çıxış Qeydi",
  "Raw Trial Telemetry Capture": "Xam Sınaq Telemetriyasının Qeydiyyatı",
  "Mean Accuracy:": "Orta Dəqiqlik:",
  "Mean RT:": "Orta RT:",
  "Mean Reaction Time": "Orta Reaksiya Vaxtı",
  "Median:": "Median:",
  "Min:": "Min:",
  "Max:": "Maks:",
  "Accuracy Rate": "Dəqiqlik Faizi",
  "Latency (RT)": "Gecikmə (RT)",
  "Per-Trial Latency (ms)": "Sınaq başına gecikmə (ms)",
  "Trial Exclusion Rate:": "Sınaqların istisna faizi:",
  "Number of Experimental Trials": "Eksperimental sınaqların sayı",
  "Trials per Measurement": "Ölçmə üzrə sınaqlar",
  "Sample Size (N)": "Nümunə ölçüsü (N)",
  "Sample Size Target:": "Hədəf nümunə ölçüsü:",
  "Evidence Claim Graph": "Sübut və İddia Qrafı",
  "Evidence Graph": "Sübut Qrafı",
  "Evidence Nodes": "Sübut Düyünləri",
  "Directed Edges": "İstiqamətləndirilmiş kənarlar",
  "Canonical Graph Hash": "Kanonik Qraf Heşi",
  "Node Provenance Inspector": "Düyün Mənşə Müfəttişi",
  "Evidence Anchor Hash": "Sübut Anker Heşi",
  "Graph Binding": "Qraf Bağlanması",
  "From Hypotheses to Claims": "Hipotezlərdən İddialara",
  "Claim Graph": "İddia Qrafı",
  "Claim State": "İddianın Vəziyyəti",
  "Hypothesis Layer": "Hipotez Qatı",
  "Epistemic Claim Layer": "Epistemik İddia Qatı",
  "Falsification Gate": "Falsifikasiya Qapısı",
  "Scientific Decision": "Elmi Qərar",
  "Decision Ledger": "Qərar Reyestri",
  "Audit & Governance": "Audit və İdarəetmə",
  "Audit Verification Note:": "Audit Verifikasiya Qeydi:",
  "Analysis Integrity Score": "Analiz Bütövlüyü Balı",
  "Data Contract Adherence": "Məlumat Müqaviləsinə Uyğunluq",
  "Cryptographic Ledger": "Kriptoqrafik Reyestr",
  "Cryptographic Provenance Lock": "Kriptoqrafik Mənşə Kilidi",
  "SHA-256 Checksum": "SHA-256 Yoxlama Cəmi",
  "HASH CHAIN VALID": "HEŞ ZƏNCİRİ ETİBARLIDIR",
  "HASH MISMATCH": "HEŞ UYĞUNSUZLUĞU",
  "LEDGER TAMPERING DETECTED": "REYESTRƏ MÜDAXİLƏ AŞKARLANDI",
  "Ledger Cryptographic Integrity": "Reyestrin Kriptoqrafik Bütövlüyü",
  "Re-Verify Ledger Chain": "Reyestr Zəncirini Yenidən Yoxla",
  "Restore Canonical Chain": "Kanonik Zənciri Bərpa Et",
  "Simulate Byte Tamper Test": "Bayt Müdaxilə Testini Simulyasiya Et",
  "Scientific Governance & Audit": "Elmi İdarəetmə və Audit",
  "Governance Layer": "İdarəetmə Qatı",
  "Governance State": "İdarəetmə Vəziyyəti",
  "Governance Status": "İdarəetmə Statusu",
  "Scientific Audit & Cryptographic Reproducibility Engine": "Elmi Audit və Kriptoqrafik Təkrarlana Bilənlik Mühərriki",
  "Reproducibility Ledger": "Təkrarlana Bilənlik Reyestri",
  "Scientific Boundary & Methodological Contract:": "Elmi Sərhəd və Metodoloji Müqavilə:",
  "Theoretical & Empirical Grounding": "Nəzəri və Empirik Əsaslandırma",
  "Theoretical Influences": "Nəzəri Təsirlər",
  "Core Constructs": "Əsas Konstruktlar",
  "Cognitive Processes": "Koqnitiv Proseslər",
  "Core Cognitive (C01-C03)": "Əsas Koqnitiv (C01-C03)",
  "Regulatory (R01-R03)": "Tənzimləyici (R01-R03)",
  "Higher-Order (H01-H03)": "Yüksək Səviyyəli (H01-H03)",
  "Level Architecture": "Səviyyə Arxitekturası",
  "Level I: Core Cognitive": "Səviyyə I: Əsas Koqnitiv",
  "Level II: Regulatory": "Səviyyə II: Tənzimləyici",
  "Level III: Higher-Order": "Səviyyə III: Yüksək Səviyyəli",
  "The 9-Level Ontological Hierarchy": "9 Səviyyəli Ontoloji İyerarxiya",
  "L0 (Physical) to L8 (Meta-Revision)": "L0 (Fiziki) → L8 (Meta-Reviziya)",
  "Protocol Layer": "Protokol Qatı",
  "Protocol Formulation": "Protokol Formalaşdırılması",
  "Protocol Freeze": "Protokol Dondurulması",
  "Protocol Title": "Protokol Başlığı",
  "Preregistration Lock Enforcer": "Öncədən Qeydiyyat Kilidinin Təminatçısı",
  "Freeze New Preregistration Lock": "Yeni Öncədən Qeydiyyat Kilidini Dondur",
  "OSF Preregistration Freezing": "OSF Öncədən Qeydiyyat Dondurulması",
  "Register Formal Amendment": "Formal Dəyişikliyi Qeydiyyata Al",
  "Multiplicity Governance": "Çoxsaylılıq İdarəetməsi",
  "Multiplicity Correction:": "Çoxsaylılıq korreksiyası:",
  "Benjamini-Hochberg FDR": "Benjamini-Hochberg FDR",
  "Medium Effect Size": "Orta Effekt Ölçüsü",
  "Cohen's d": "Cohen d",
  "FDR-Adjusted p": "FDR ilə düzəldilmiş p",
  "Significant (q < 0.05)": "Əhəmiyyətli (q < 0.05)",
  "Sensitivity": "Həssaslıq",
  "Analysis Plan": "Analiz Planı",
  "Analysis Parameters": "Analiz Parametrləri",
  "Confirmatory Hypotheses": "Təsdiqləyici Hipotezlər",
  "Primary Outcome:": "Əsas Nəticə:",
  "Primary Outcome Variable": "Əsas Nəticə Dəyişəni",
  "Condition": "Şərt",
  "Configure Experimental Cohort": "Eksperimental Kohortu Konfiqurasiya Et",
  "Dataset / Cohort Name": "Məlumat Dəsti / Kohort Adı",
  "Instantiate Dataset Container": "Məlumat Dəsti Konteynerini Yarat",
  "Data Layer": "Məlumat Qatı",
  "Data Locked (Tamper-Sealed)": "Məlumat Kilidlənib (Müdaxilədən Mühafizə Olunub)",
  "Data Exclusion & Outlier Audit": "Məlumat İstisnası və Kənar Dəyər Auditi",
  "Measurement Layer": "Ölçmə Qatı",
  "Measurement IDs:": "Ölçmə ID-ləri:",
  "Measurement IDs (comma-separated)": "Ölçmə ID-ləri (vergüllə ayrılmış)",
  "MEASUREMENT ID": "ÖLÇMƏ ID-Sİ",
  "Maturity": "Yetkinlik",
  "Construct Maturity": "Konstrukt Yetkinliyi",
  "Specifications": "Spesifikasiyalar",
  "Specification Detail": "Spesifikasiya Detalı",
  "Loading measurement registry...": "Ölçmə reyestri yüklənir...",
  "No measurements matching criteria.": "Kriteriyalara uyğun ölçmə yoxdur.",
  "Processing Speed": "Emal Sürəti",
  "Working Memory Battery": "İşçi Yaddaş Batareyası",
  "Working Memory Score": "İşçi Yaddaş Skoru",
  "Pattern Completion": "Naxışın Tamamlanması",
  "Stroop Interference": "Stroop Müdaxiləsi",
  "Stroop Color-Word Interference": "Stroop Rəng-Söz Müdaxiləsi",
  "Flanker Conflict Cost": "Flanker Konflikt Xərci",
  "Spatial flanker delay": "Məkan Flanker Gecikməsi",
  "Congruent (Facilitation)": "Uyğun (Fasilitasiya)",
  "Incongruent (Interference)": "Uyğunsuz (Müdaxilə)",
  "Action": "Əməliyyat",
  "Action Type": "Əməliyyat Növü",
  "Status": "Status",
  "Level": "Səviyyə",
  "Domain": "Domen",
  "Domain ID:": "Domen ID-si:",
  "Relation": "Əlaqə",
  "Type:": "Növ:",
  "Weight": "Çəki",
  "Source Node": "Mənbə Düyün",
  "Target Node": "Hədəf Düyün",
  "Target Component": "Hədəf Komponent",
  "Target Model:": "Hədəf Model:",
  "Target Sample Size (N)": "Hədəf Nümunə Ölçüsü (N)",
  "New Model Identifier": "Yeni Model İdentifikatoru",
  "Parent Model:": "Valideyn Model:",
  "Parent Model Identifier": "Valideyn Model İdentifikatoru",
  "Revision ID:": "Reviziya ID-si:",
  "Revision Justification:": "Reviziya Əsaslandırması:",
  "Model Revision": "Model Reviziyası",
  "Model Revision Layer": "Model Reviziyası Qatı",
  "Evidence-Linked Model Revision": "Sübutla Əlaqəli Model Reviziyası",
  "Previous": "Əvvəlki",
  "Next State": "Növbəti Vəziyyət",
  "View": "Bax",
  "Result": "Nəticə",
  "Correct": "Düzgün",
  "Expected": "Gözlənilən",
  "Error / Misclick": "Səhv / Yanlış Klik",
  "Omission / Timeout": "Buraxma / Vaxt Aşımı",
  "Cancel": "Ləğv et",
  "Commit Session": "Sessiyanı Təsdiqlə",
  "Enforce Cryptographic Data Lock": "Kriptoqrafik Məlumat Kilidini Tətbiq Et",
  "Cryptographically Freeze Protocol": "Protokolu Kriptoqrafik Dondur",
  "Clock Synchronization": "Saat Sinxronizasiyası",
  "Timing Contracts Formalized": "Vaxtlama Müqavilələri Formalizə Edilib",
  "Platform Execution Pipeline": "Platforma İcra Boru Xətti",
  "Deterministic Run": "Deterministik İcra",
  "Deterministic LOAD → LOCK": "Deterministik LOAD → LOCK",
  "Deterministic Verification Contract": "Deterministik Verifikasiya Müqaviləsi",
  "Science Evidence Linkage": "Elmi Sübut Əlaqələndirilməsi",
  "Software Runtime Architecture": "Proqram İcra Mühiti Arxitekturası",
  "Search tabs, tests (Stroop, Flanker), lifecycle tour, or commands...": "Tabları, testləri (Stroop, Flanker), həyat dövrü turunu və ya əmrləri axtarın...",
  "Loading...": "Yüklənir...",
  "Processing...": "Emal olunur...",
  "No Match": "Uyğunluq yoxdur",
  "NO MATCH": "UYĞUNLUQ YOXDUR",
  "PASS": "KEÇDİ",
  "FAIL": "UĞURSUZ",
  "GREEN": "YAŞIL",
  "YELLOW": "SARI",
  "RED": "QIRMIZI",
  "BLUE": "MAVİ",
  "VERIFIED": "YOXLANILIB",
  "COMPLIANT (Pre-frozen)": "UYĞUNDUR (Əvvəlcədən dondurulub)",
  "DRAFT to LOCKED": "QARALAMADAN KİLİDLİYƏ",
  "View audit ledger & claims": "Audit reyestrinə və iddialara bax",
  "Copy JSON": "JSON-u Kopyala",
  "Copy Record": "Qeydi Kopyala",
  "Copy Snapshot JSON": "Snapshot JSON-u Kopyala",
  "Download BIDS-compatible JSON file": "BIDS-uyğun JSON faylını endir",
  "Download CSV of all recorded trials": "Bütün qeydə alınmış sınaqların CSV-sini endir",
  "Export CSV": "CSV-ni ixrac et",
  "Export JSON": "JSON-u ixrac et",
  "Refresh Governance Snapshot": "İdarəetmə Snapshot-ını yenilə",
  "Refresh Graph State": "Qraf vəziyyətini yenilə",
  "Choose Another Test": "Başqa Test Seç",
  "Fullscreen": "Tam ekran",
  "ESC to close": "Bağlamaq üçün ESC",
  "Complete Walkthrough": "Turu tamamla",
  "State Lifecycle Guided Tour": "Vəziyyət Həyat Dövrü üzrə Bələdçi Tur",
  "Karl Friston & Active Inference:": "Karl Friston və Aktiv İnferens:",
  "Karl Popper & Imre Lakatos:": "Karl Popper və İmre Lakatos:",
  "DNEM v7.7 Ontology": "DNEM v7.7 Ontologiyası",
  "DNEM v7.7 Implementation Baseline • Deterministic Engine": "DNEM v7.7 Tətbiq Bazası • Deterministik Mühərrik",
  "DNEM Interactive Study": "DNEM İnteraktiv Tədqiqatı",
  "DNEM Demo Study": "DNEM Demo Tədqiqatı",
  "DNEM Cohort Phase-II": "DNEM Kohort Faza-II",
  "External World": "Xarici Dünya"
};

const keys = Object.keys(AZ).sort((a, b) => b.length - a.length);
const originals = new WeakMap<Text, string>();

function translateText(source: string, lang: LanguageCode): string {
  if (lang === "en") return source;
  let out = source;
  for (const key of keys) {
    if (out.includes(key)) out = out.split(key).join(AZ[key]);
  }
  return out;
}

export function getLanguage(): LanguageCode {
  return localStorage.getItem("dnem_language") === "az" ? "az" : "en";
}

let isApplyingLanguage = false;

export function applyLanguage(lang: LanguageCode): void {
  if (isApplyingLanguage) return;
  isApplyingLanguage = true;

  // Prevent the MutationObserver from observing the DOM mutations caused by
  // this translation pass. Without this guard, characterData mutations can
  // trigger an endless observer -> applyLanguage -> observer loop.
  observer?.disconnect();

  try {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes: Text[] = [];
    let node: Node | null;

    while ((node = walker.nextNode())) nodes.push(node as Text);

    for (const textNode of nodes) {
      const parent = textNode.parentElement;
      if (!parent || ["SCRIPT", "STYLE", "PRE", "CODE"].includes(parent.tagName)) continue;

      if (!originals.has(textNode)) {
        originals.set(textNode, textNode.nodeValue ?? "");
      }

      const source = originals.get(textNode) ?? "";
      const translated = translateText(source, lang);
      if (textNode.nodeValue !== translated) {
        textNode.nodeValue = translated;
      }
    }

    const attrs = ["placeholder", "title", "aria-label"];

    document
      .querySelectorAll<HTMLElement>("input,textarea,button,[title],[aria-label]")
      .forEach((el) => {
        for (const attr of attrs) {
          const value = el.getAttribute(attr);
          if (!value) continue;

          const marker = "data-dnem-en-" + attr;
          if (!el.hasAttribute(marker)) el.setAttribute(marker, value);

          const source = el.getAttribute(marker) ?? value;
          const translated = translateText(source, lang);
          if (el.getAttribute(attr) !== translated) {
            el.setAttribute(attr, translated);
          }
        }
      });

    document.documentElement.lang = lang;
    localStorage.setItem("dnem_language", lang);
    window.dispatchEvent(new CustomEvent("dnem-language-change", { detail: lang }));
  } finally {
    isApplyingLanguage = false;
    if (observer) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }
  }
}

let observer: MutationObserver | null = null;

export function initLanguage(): void {
  if (!observer) {
    observer = new MutationObserver(() => {
      if (isApplyingLanguage) return;
      if (getLanguage() === "az") applyLanguage("az");
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  applyLanguage(getLanguage());
}

export function setLanguage(lang: LanguageCode): void {
  applyLanguage(lang);
}

export const LanguageSwitcher: React.FC = () => {
  const [lang, setLang] = useState<LanguageCode>(getLanguage());

  useEffect(() => {
    const onChange = (event: Event) => {
      setLang((event as CustomEvent<LanguageCode>).detail);
    };

    window.addEventListener("dnem-language-change", onChange);
    return () => window.removeEventListener("dnem-language-change", onChange);
  }, []);

  return (
    <div
      className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5"
      title="Language / Dil"
    >
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={
          "px-2 py-1 rounded-md text-[10px] font-bold " +
          (lang === "en"
            ? "bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-sm"
            : "text-slate-500 dark:text-slate-400")
        }
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage("az")}
        className={
          "px-2 py-1 rounded-md text-[10px] font-bold " +
          (lang === "az"
            ? "bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-sm"
            : "text-slate-500 dark:text-slate-400")
        }
      >
        AZ
      </button>
    </div>
  );
};

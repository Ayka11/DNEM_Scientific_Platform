import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { Globe, Check } from "lucide-react";

export type LanguageCode = "en" | "az";

export interface LanguageContextType {
  language: LanguageCode;
  lang: "EN" | "AZ";
  isAz: boolean;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
}

export const AZ: Record<string, string> = {
  // Navigation & Header
  "Overview": "Ümumi Baxış",
  "9-Level Architecture": "9 Səviyyəli Arxitektura",
  "Scientific Boundary": "Elmi Sərhəd",
  "About": "Haqqında",
  "Study Builder": "Tədqiqat Qurucusu",
  "Measurement Registry": "Ölçmə Reyestri",
  "Protocols & Preregistration": "Protokollar və Öncədən Qeydiyyat",
  "Experiment Workspace": "Eksperiment İş Sahəsi",
  "Research Runtime": "Tədqiqat İcra Mühiti",
  "Results & Analysis": "Nəticələr və Analiz",
  "API Explorer": "API Tədqiqatçısı",
  "Evidence & Claim Graph": "Sübut və İddia Qrafı",
  "Scientific Governance": "Elmi İdarəetmə",
  "Audit & Reproducibility": "Audit və Təkrarlanabilənlik",
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
  "Deterministic Research Scaffold • Operational Specifications • Verification Baseline": "Deterministik Tədqiqat Karkası • Əməliyyat Spesifikasiyaları • Verifikasiya Bazası",
  "Deterministic Research Scaffold &bull; Operational Specifications &bull; Verification Baseline": "Deterministik Tədqiqat Karkası • Əməliyyat Spesifikasiyaları • Verifikasiya Bazası",
  "L0 → L8 Architecture": "L0 → L8 Arxitekturası",
  "L0 → L8 Deterministic Research Runtime": "L0 → L8 Deterministik Tədqiqat İcra Mühiti",
  "Switch to Laboratory Dark Mode": "Laboratoriya Qaranlıq Rejiminə Keç",
  "Switch to Laboratory Light Mode": "Laboratoriya İşıqlı Rejiminə Keç",
  "Quick search (Cmd+K / Ctrl+K)": "Sürətli axtarış (Cmd+K / Ctrl+K)",
  "Scientific Platform Navigation": "Elmi Platforma Naviqasiyası",
  "Language / Dil": "Dil / Language",
  "Select Language": "Dili Seçin",
  "Azerbaijani": "Azərbaycan dili",
  "English": "İngilis dili",

  // Interactive Test Chamber & Cognitive Tests
  "Live Human Participant Testing Chamber": "Canlı İnsan İştirakçı Test Kamerası",
  "Interactive Cognitive Battery Execution": "İnteraktiv Koqnitiv Batareya İcrası",
  "Take real empirical cognitive tests with sub-millisecond reaction time capture, strict event timing contracts, and immediate cryptographic SHA-256 provenance locking.":
    "Milli-saniyə dəqiqliyində reaksiya vaxtı qeydiyyatı, sərt hadisə vaxtlama müqavilələri və ani kriptoqrafik SHA-256 mənşə kilidi ilə real empirik koqnitiv testləri keçin.",
  "Distraction-Free Fullscreen Mode": "Diqqəti Yayındırmayan Tam Ekran Rejimi",
  "Fullscreen": "Tam Ekran",
  "Exit Fullscreen (Esc)": "Tam Ekrandan Çıx (Esc)",
  "Exit Test": "Testdən Çıx",
  "Choose Another Test": "Başqa Test Seç",
  "Retake Test": "Testi Yenidən Keç",
  "Proceed to Instructions": "Təlimatlara Keç",
  "Back to Task List": "Tapşırıq Siyahısına Qayıt",
  "I Am Ready — Start Test": "Hazıram — Testə Başla",
  "Start in Fullscreen Mode": "Tam Ekran Rejimində Başla",
  "Insulate test from browser distractions": "Testi brauzerin kənar təsirlərindən təcrid edin",
  "Task Instructions:": "Tapşırıq Təlimatları:",
  "Response Controls:": "Cavab İdarəetmə Düymələri:",
  "You can respond using either physical keyboard hotkeys or on-screen click buttons during the trial.":
    "Sınaq zamanı həm fiziki klaviatura düymələrindən, həm də ekrandakı klik düymələrindən istifadə edə bilərsiniz.",
  "Try to respond as accurately and quickly as possible. The session consists of":
    "Mümkün qədər dəqiq və sürətli reaksiya verməyə çalışın. Sessiya bu sayda sınaqdan ibarətdir:",
  "Get Ready": "Hazırlaşın",
  "Keep fingers on response keys": "Barmaqlarınızı cavab düymələrinin üzərində saxlayın",
  "Configure Test Session:": "Test Sessiyasını Konfiqurasiya Et:",
  "Number of Experimental Trials": "Eksperimental Sınaqların Sayı",
  "(Quick Demo)": "(Qısa Demo)",
  "trials": "sınaq",
  "Participant Identification": "İştirakçı İdentifikasiyası",
  "Trial": "Sınaq",
  "of": "/",
  "Correct": "Düzgün",
  "Incorrect": "Səhv",
  "Correct (": "Düzgün (",
  "Incorrect (": "Səhv (",
  "Error / Misclick": "Səhv / Yanlış reaksiya",
  "Omission / Timeout": "Buraxma / Vaxt Aşımı",
  "Accuracy Rate": "Dəqiqlik Faizi",
  "Mean Reaction Time": "Orta Reaksiya Vaxtı",
  "Median:": "Median:",
  "Min:": "Min:",
  "Max:": "Maks:",
  "Stroop Interference": "Stroop Müdaxiləsi",
  "Flanker Conflict Cost": "Flanker Konflikt Dəyəri",
  "Spatial flanker delay": "Məkan flanker ləngiməsi",
  "Working Memory Score": "İşçi Yaddaş Skoru",
  "2-Back Buffer Stability": "2-Geri Bufer Sabitliyi",
  "Construct Maturity": "Konstrukt Yetkinliyi",
  "Data Contract Adherence": "Məlumat Müqaviləsinə Uyğunluq",
  "Reaction Time Latency Distribution & Trial Scatter": "Reaksiya Vaxtı Gecikmə Paylanması və Sınaq Qrafiki",
  "Per-Trial Latency (ms)": "Sınaq Başına Gecikmə (ms)",
  "Congruent (Facilitation)": "Uyğun (Fasilitasiya)",
  "Incongruent (Interference)": "Uyğunsuz (Müdaxilə)",
  "Commit Empirical Session to Platform Ledger": "Empirik Sessiyanı Platforma Reyestrinə Daxil Et",
  "Lock this human trial stream with a cryptographic SHA-256 digest and advance the study state machine to LOCKED.":
    "Bu insan sınağı axınını kriptoqrafik SHA-256 xülasəsi ilə kilidləyin və tədqiqat vəziyyət maşınını LOCKED statusuna keçirin.",
  "Lock & Commit Session": "Kilidlə və Sessiyanı Təsdiqlə",
  "Sealing SHA-256...": "SHA-256 ilə möhürlənir...",
  "SEALED (SHA-256):": "MÖHÜRLƏNDİ (SHA-256):",
  "Trial-by-Trial Empirical Event Log": "Sınaqlar üzrə Empirik Hadisə Jurnalı",
  "Session Complete • Empirical Human Data Captured": "Sessiya Tamamlandı • Empirik İnsan Məlumatları Qeydə Alındı",
  "Session Complete &bull; Empirical Human Data Captured": "Sessiya Tamamlandı • Empirik İnsan Məlumatları Qeydə Alındı",
  "Psychometric Summary": "Psixometrik İcmal",
  "Completed": "Tamamlandı",
  "operational trials under deterministic event bus observation.": "deterministik hadisə borusu müşahidəsi altında əməliyyat sınaqları.",
  "Export CSV": "CSV İxrac Et",
  "Export JSON": "JSON İxrac Et",
  "Download CSV of all recorded trials": "Bütün qeydə alınmış sınaqların CSV faylını endir",
  "Download BIDS-compatible JSON file": "BIDS standartına uyğun JSON faylını endir",
  "Test Language:": "Test Dili:",

  // Stroop Test Specifics
  "Stroop Color-Word Interference": "Stroop Rəng-Söz Müdaxiləsi",
  "Inhibitory Control & Executive Function (C05)": "İnhibitor Nəzarət və İcraedici Funksiya (C05)",
  "Measure semantic conflict suppression by naming the font color, not the written word.":
    "Yazılmış sözü deyil, şriftin rəngini adlandıraraq semantik konfliktin qarşısının alınmasını ölçün.",
  "A word will appear in colored text. Your goal is to identify the FONT COLOR of the word as fast as possible, ignoring the text itself. Press the corresponding key or click the button below.":
    "Rəngli mətndə bir söz görünəcək. Məqsədiniz sözün mənasına fikir vermədən ŞRİFTİN RƏNGİNİ mümkün qədər tez müəyyənləşdirməkdir. Müvafiq klaviatura düyməsinə basın və ya aşağıdakı düyməyə klikləyin.",
  "[R] Red • [G] Green • [B] Blue • [Y] Yellow": "[Q/R] Qırmızı • [Y/G] Yaşıl • [M/B] Mavi • [S/Y] Sarı",
  "RED": "QIRMIZI",
  "GREEN": "YAŞIL",
  "BLUE": "MAVİ",
  "YELLOW": "SARI",
  "Red": "Qırmızı",
  "Green": "Yaşıl",
  "Blue": "Mavi",
  "Yellow": "Sarı",

  // 2-Back Working Memory
  "2-Back Working Memory Updating": "2-Geri İşçi Yaddaş Yenilənməsi",
  "Working Memory Capacity (C02)": "İşçi Yaddaş Tutumu (C02)",
  "Track dynamic memory buffers by indicating if the current item matches 2 steps ago.":
    "Cari elementin 2 addım əvvəlki elementlə uyğun gəlib-gəlmədiyini göstərərək dinamik yaddaş buferlərini izləyin.",
  "A sequence of letters will appear one by one. Decide whether the CURRENT letter matches the letter presented EXACTLY TWO TRIALS AGO. Press MATCH if it matches, or NO MATCH if it does not.":
    "Hərflər bir-bir ekranda görünəcək. CARİ hərfin DƏQİQ İKİ SINAQ ƏVVƏL təqdim olunmuş hərflə eyni olub-olmadığını müəyyən edin. Uyğundursa UYĞUNDUR, deyilsə UYĞUN DEYİL düyməsinə basın.",
  "[M] Match • [N] No Match": "[M] Uyğundur • [N] Uyğun Deyil",
  "Does this match the letter from 2 steps back?": "Bu hərf 2 addım əvvəlki hərflə eynidirmi?",
  "MATCH (2-Back)": "UYĞUNDUR (2-Geri)",
  "NO MATCH": "UYĞUN DEYİL",
  "Match": "Uyğundur",
  "No Match": "Uyğun Deyil",

  // Choice Reaction Time
  "Choice Reaction Time & Processing Speed": "Seçim Reaksiyası Vaxtı və Emal Sürəti",
  "Processing Speed (C03)": "Emal Sürəti (C03)",
  "Sub-millisecond visual sensorimotor latency with variable foreperiod fixation.":
    "Dəyişkən fiksasiya intervalı ilə sub-millisaniyəlik vizual sensor-motor gecikməsi.",
  "Focus on the central crosshair. As soon as the target arrow appears on the LEFT or RIGHT, respond immediately in that direction. Speed and accuracy both count!":
    "Mərkəzi nişangaha fokuslanın. Hədəf oxu SOLDA və ya SAĞDA görünən kimi dərhal həmin istiqamətə reaksiya verin. Həm sürət, həm də dəqiqlik vacibdir!",
  "[←] or [A] Left • [→] or [D] Right": "[←] və ya [A] Sol • [→] və ya [D] Sağ",
  "LEFT": "SOL",
  "RIGHT": "SAĞ",
  "Left": "Sol",
  "Right": "Sağ",

  // Eriksen Flanker
  "Eriksen Flanker Task (Selective Attention)": "Eriksen Flanker Tapşırığı (Selektiv Diqqət)",
  "Selective Attention & Interference (C04)": "Selektiv Diqqət və Müdaxilə (C04)",
  "Measure spatial distractor suppression by focusing strictly on the central target arrow.":
    "Yalnız mərkəzi hədəf oxuna diqqət yetirərək məkan yayındırıcılarının yatırılmasını ölçün.",
  "You will see a row of 5 arrows. Identify the direction of the MIDDLE arrow only, while ignoring the surrounding flanking arrows. Some trials are congruent (same direction) and some are incongruent.":
    "5 oxdan ibarət sıra görəcəksiniz. Ətrafdakı kənar oxlara fikir vermədən yalnız ORTA oxun istiqamətini müəyyən edin. Bəzi sınaqlar uyğun (eyni istiqamət), bəziləri isə uyğunsuzdur.",
  "Focus on the MIDDLE arrow direction only": "Yalnız ORTA oxun istiqamətinə diqqət yetirin",

  // Matrix Reasoning
  "Matrix Reasoning / Pattern Completion": "Matris Məntiqi / Naxışın Tamamlanması",
  "Fluid Reasoning (C01)": "Çevik Mühakimə (C01)",
  "Abstract logical problem solving: deduce the missing geometric element.":
    "Mücərrəd məntiqi problem həlli: çatışmayan həndəsi elementi müəyyən edin.",
  "Examine the 2x2 or 3x3 pattern matrix to detect the governing rule (e.g. rotation, shape progression, quantity). Select the choice that logically completes the missing spot.":
    "İdarəedici qanunauyğunluğu (fırlanma, forma ardıcıllığı, say artımı) aşkar etmək üçün 2x2 və ya 3x3 matrisi araşdırın. Çatışmayan yeri məntiqi olaraq tamamlayan variantı seçin.",
  "Click choices [1], [2], [3], or [4]": "[1], [2], [3] və ya [4] variantına klikləyin",
  "Select the tile that completes the pattern:": "Naxışı tamamlayan xananı seçin:",
  "Option 1": "1-ci Variant",
  "Option 2": "2-ci Variant",
  "Option 3": "3-cü Variant",
  "Option 4": "4-cü Variant",
  "Row doubling: each subsequent column doubles the count of shapes.": "Sətir üzrə ikiqat artım: hər növbəti sütun fiqurların sayını iki dəfə artırır.",

  // Overview Tab
  "Deterministic Neurocognitive Experimental Measurement Platform":
    "Deterministik Neyrokoqnitiv Eksperimental Ölçmə Platforması",
  "A unified scientific research operating environment bridging physical signal acquisition (L0), neurobiology (L1), core cognition (L2), dynamic regulation (L3), intentional agency (L4), prospective meaning (L5), social-ecological systems (L6), ontogenetic development (L7), and cryptographic meta-governance (L8).":
    "Fiziki siqnal qəbulunu (L0), neyrobiologiyanı (L1), əsas koqnisiyanı (L2), dinamik tənzimləməni (L3), qəsdən agentliyi (L4), perspektiv mənanı (L5), sosial-ekoloji sistemləri (L6), ontogenetik inkişafı (L7) və kriptoqrafik meta-idarəetməni (L8) birləşdirən vahid elmi tədqiqat əməliyyat mühiti.",
  "Take Live Cognitive Test": "Canlı Koqnitiv Testi Keç",
  "Explore 9-Level Architecture": "9 Səviyyəli Arxitekturanı Araşdır",
  "Launch Study Builder": "Tədqiqat Qurucusunu İşə Sal",
  "Audit & Governance": "Audit və İdarəetmə",
  "12-State Lifecycle Tour": "12 Mərhələli Həyat Dövrü Turu",
  "Core Architectural Capabilities": "Əsas Arxitektur İmkanlar",
  "Formal Grounding & Invariance": "Formal Əsaslandırma və İnvariantlıq",
  "Sub-millisecond Timing Contract": "Sub-millisaniyəlik Vaxtlama Müqaviləsi",
  "Immutable Evidence Graph": "Dəyişməz Sübut Qrafı",
  "FDR Multiplicity Control": "FDR Çoxsaylılıq Nəzarəti",
  "Active Inference Framework": "Aktiv İnferens Çərçivəsi",
  "Meta-Theoretic Model Lineage": "Meta-Nəzəri Model Şəcərəsi",
  "Operational Specifications": "Əməliyyat Spesifikasiyaları",
  "Ontological Levels": "Ontoloji Səviyyələr",
  "Scientific Domains": "Elmi Domenlər",
  "Verified Constructs": "Yoxlanılmış Konstruktlar",
  "DNEM v7.7 Implementation Baseline • Deterministic Engine": "DNEM v7.7 Tətbiq Bazası • Deterministik Mühərrik",
  "Scientific Boundary & Methodological Contract:": "Elmi Sərhəd və Metodoloji Müqavilə:",
  "This platform implements formal data contracts, runtime state machines, 170 operational measurement specifications, and cryptographic audit ledgers. Synthetic runs are for software contract verification and reproducible protocol specification. It does not impute clinical validity or empirical norms without external preregistered trials.":
    "Bu platforma formal məlumat müqavilələrini, icra mühiti vəziyyət maşınlarını, 170 əməliyyat ölçmə spesifikasiyasını və kriptoqrafik audit reyestrlərini tətbiq edir. Sintetik icralar proqram təminatı müqaviləsinin yoxlanılması və təkrar istehsal oluna bilən protokol spesifikasiyası üçündür. Xarici öncədən qeydiyyatdan keçmiş sınaqlar olmadan klinik etibarlılıq və ya empirik normalar iddia etmir.",
  "Ontology Depth": "Ontologiya Dərinliyi",
  "9 Levels": "9 Səviyyə",
  "L0 (Physical) to L8 (Meta-Revision)": "L0 (Fiziki)-dən L8 (Meta-Reviziya)-dək",
  "Specifications": "Spesifikasiyalar",
  "170 Tasks": "170 Tapşırıq",
  "Across 34 assessment domains": "34 qiymətləndirmə domeni üzrə",
  "State Machine": "Vəziyyət Maşını",
  "12 Transitions": "12 Keçid",
  "Deterministic LOAD → LOCK": "Deterministik YÜKLƏMƏ → KİLİDLƏMƏ",
  "Cryptographic Ledger": "Kriptoqrafik Reyestr",
  "SHA-256 Valid": "SHA-256 Etibarlıdır",
  "Forward-only tamper-evident chain": "Müdaxiləyə davamlı yalnız irəli zəncir",
  "Explore the complete ontology from physical environment signals (L0) up to meta-level scientific model revision (L8), with formal mathematical I/O contracts.":
    "Fiziki mühit siqnallarından (L0) meta-səviyyəli elmi model reviziyasına (L8) qədər tam ontologiyanı formal riyazi G/Ç müqavilələri ilə araşdırın.",
  "Inspect L0 → L8 taxonomy": "L0 → L8 taksonomiyasını nəzərdən keçirin",
  "Study Builder & Runtime": "Tədqiqat Qurucusu və İcra Mühiti",
  "Assemble multi-domain experimental batteries, freeze protocol hashes, and run synthetic participants through the discrete event bus.":
    "Çoxdomenli eksperimental batareyaları toplayın, protokol heşlərini dondurun və sintetik iştirakçıları diskret hadisə şini vasitəsilə icra edin.",
  "Configure & execute protocols": "Protokolları tənzimləyin və icra edin",
  "Scientific Governance & Audit": "Elmi İdarəetmə və Audit",
  "Monitor real-time analysis integrity, inspect the Evidence & Claim Graph, verify blockchain ledger hashes, and audit model revisions.":
    "Real vaxt analiz bütövlüyünü izləyin, Sübut və İddia Qrafını araşdırın, blokçeyn reyestr heşlərini yoxlayın və model reviziyalarını audit edin.",
  "View audit ledger & claims": "Audit reyestrinə və iddialara baxın",
  "Platform Execution Pipeline": "Platformanın İcra Boru Kəməri",
  "1. Study": "1. Tədqiqat",
  "Protocol Freeze": "Protokol Dondurma",
  "2. Measurement": "2. Ölçmə",
  "170 Registry": "170 Reyestri",
  "3. Trial": "3. Sınaq",
  "Deterministic Run": "Deterministik İcra",
  "4. Result": "4. Nəticə",
  "Latency & Accuracy": "Gecikmə və Dəqiqlik",
  "5. Analysis": "5. Analiz",
  "SAP Multiplicity": "SAP Çoxsaylılığı",
  "6. Evidence": "6. Sübut",
  "Graph Binding": "Qraf Əlaqələndirməsi",
  "7. Claim": "7. İddia",
  "Falsification Gate": "Təkzib Qapısı",
  "8. Revision": "8. Reviziya",
  "L8 Lineage": "L8 Şəcərəsi",

  // 9-Level Architecture Tab
  "Ontological Specification & Formal Grounding": "Ontoloji Spesifikasiya və Formal Əsaslandırma",
  "Nine discrete, mathematically verifiable levels of abstraction ensuring construct validity from physical transducers up to meta-scientific model revisions.":
    "Fiziki çeviricilərdən tutmuş meta-elmi model reviziyalarına qədər konstrukt etibarlılığını təmin edən doqquz diskret, riyazi cəhətdən yoxlanıla bilən abstraksiya səviyyəsi.",
  "L0: Physical Substrate & Instrumentation": "L0: Fiziki Substrat və Cihazlaşdırma",
  "L1: Neurobiological Signatures": "L1: Neyrobioloji İmzalar",
  "L2: Core Cognitive Primitives": "L2: Əsas Koqnitiv Primitivlər",
  "L3: Dynamic Regulation & Control": "L3: Dinamik Tənzimləmə və Nəzarət",
  "L4: Intentional Agency & Action": "L4: Qəsdən Agentlik və Fəaliyyət",
  "L5: Prospective Meaning & Valuation": "L5: Perspektiv Məna və Dəyərləndirmə",
  "L6: Socio-Ecological Coupling": "L6: Sosial-Ekoloji Birləşmə",
  "L7: Ontogenetic Development": "L7: Ontogenetik İnkişaf",
  "L8: Meta-Scientific Governance & Revision": "L8: Meta-Elmi İdarəetmə və Reviziya",

  // Study Builder Tab
  "Study Builder & Session Orchestration": "Tədqiqat Qurucusu və Sessiya Orkestrasiyası",
  "Configure experimental study containers, freeze specifications, and run deterministic session pipelines.":
    "Eksperimental tədqiqat konteynerlərini konfiqurasiya edin, spesifikasiyaları dondurun və deterministik sessiya boru xətlərini icra edin.",
  "Study Title (e.g. DNEM Demo Study)": "Tədqiqat Başlığı (məs. DNEM Demo Tədqiqatı)",
  "Create Demo Study": "Demo Tədqiqat Yarat",
  "Study Specification": "Tədqiqat Spesifikasiyası",
  "Study Spec Frozen": "Tədqiqat Spesifikasiyası Dondurulub",
  "Freeze Study Specification": "Tədqiqat Spesifikasiyasını Dondur",
  "Run Synthetic Demo Session": "Sintetik Demo Sessiyanı İcra Et",
  "Take Live Test for this Study (Human Participant)": "Bu Tədqiqat Üçün Canlı Testi Keç (İnsan İştirakçı)",
  "Deterministic State Machine": "Deterministik Vəziyyət Maşını",
  "Runtime Event Log": "İcra Mühiti Hadisə Jurnalı",
  "All cryptographic hashes verified": "Bütün kriptoqrafik heşlər yoxlanılıb",

  // Measurement Registry Tab
  "Operational Measurement Registry (170 Specifications)": "Əməliyyat Ölçmə Reyestri (170 Spesifikasiya)",
  "Standardized, deterministic operationalization of cognitive, neurobiological, and behavioral constructs across 34 scientific domains.":
    "34 elmi domen üzrə koqnitiv, neyrobioloji və davranış konstruktlarının standartlaşdırılmış, deterministik əməliyyatlaşdırılması.",
  "Search constructs, domains, or measurement IDs...": "Konstruktları, domenləri və ya ölçmə ID-lərini axtarın...",
  "All Domains": "Bütün Domenlər",
  "All Tiers": "Bütün Tirlər",
  "MEASUREMENT ID": "ÖLÇMƏ ID-Sİ",
  "CONSTRUCT NAME": "KONSTRUKT ADI",
  "DOMAIN": "DOMEN",
  "MATURITY": "YETKİNLİK",
  "OPERATIONAL WINDOW": "ƏMƏLİYYAT PƏNCƏRƏSİ",
  "ACTIONS": "ƏMƏLİYYATLAR",
  "Launch Interactive Test": "İnteraktiv Testi İşə Sal",
  "Inspect Spec": "Spesifikasiyanı Nəzərdən Keçir",
  "Loading measurement registry...": "Ölçmə reyestri yüklənir...",
  "No measurements matching criteria.": "Kriteriyalara uyğun ölçmə tapılmadı.",

  // Protocols & Preregistration Tab
  "Preregistration Protocol Lock & Formal Amendment Engine":
    "Öncədən Qeydiyyat Protokol Kilidi və Formal Dəyişiklik Mühərriki",
  "Cryptographically freeze study hypotheses, experimental designs, and statistical analysis plans prior to data collection to prevent HARKing and p-hacking.":
    "HARKing və p-hacking-in qarşısını almaq üçün məlumatların toplanmasından əvvəl tədqiqat hipotezlərini, eksperimental dizaynları və statistik analiz planlarını kriptoqrafik olaraq dondurun.",
  "Freeze New Preregistration Lock": "Yeni Öncədən Qeydiyyat Kilidini Dondur",
  "Study Identifier": "Tədqiqat İdentifikatoru",
  "Protocol Title": "Protokol Başlığı",
  "Confirmatory Hypotheses (one per line)": "Təsdiqləyici Hipotezlər (hər sətirdə biri)",
  "Cryptographically Freeze Protocol": "Protokolu Kriptoqrafik Olaraq Dondur",
  "Register Formal Amendment": "Formal Dəyişikliyi Qeydiyyata Al",
  "Amendment Justification & Reason": "Dəyişikliyin Əsaslandırılması və Səbəbi",
  "Commit Immutable Amendment": "Dəyişməz Dəyişikliyi Təsdiqlə",

  // Experiment Workspace Tab
  "Experimental Cohort & Data Ingestion Workspace": "Eksperimental Kohort və Məlumat Qəbulu İş Sahəsi",
  "Configure experimental conditions, participant stratification, blinding envelopes, and automated exclusion filters with cryptographic verification.":
    "Kriptoqrafik verifikasiya ilə eksperimental şərtləri, iştirakçı təbəqələşməsini, korlaşdırma zərflərini və avtomatlaşdırılmış istisna filtrlərini konfiqurasiya edin.",
  "Configure Experimental Cohort": "Eksperimental Kohortu Konfiqurasiya Et",
  "Dataset / Cohort Name": "Məlumat Dəsti / Kohort Adı",
  "Sample Size Target (N)": "Hədəf Nümunə Ölçüsü (N)",
  "Condition Matrix (comma-separated)": "Şərt Matrisi (vergüllə ayrılmış)",
  "Instantiate Dataset Container": "Məlumat Dəsti Konteynerini Yarat",
  "Enforce Cryptographic Data Lock": "Kriptoqrafik Məlumat Kilidini Tətbiq Et",
  "Data Exclusion & Outlier Audit": "Məlumat İstisnası və Kənar Dəyər Auditi",

  // Research Runtime Tab
  "Deterministic Research Runtime & Test Chamber": "Deterministik Tədqiqat İcra Mühiti və Test Kamerası",
  "Select a paradigm to take an interactive live test as a human participant, or execute synthetic multi-session compilation runs.":
    "İnsan iştirakçı kimi interaktiv canlı test keçmək üçün bir paradiqma seçin və ya sintetik çoxsessiyalı kompilyasiya icralarını başladın.",
  "Run Synthetic Research Battery": "Sintetik Tədqiqat Batareyasını İcra Et",
  "Measurements to compile (comma-separated):": "Kompilyasiya olunacaq ölçmələr (vergüllə ayrılmış):",
  "Trials per measurement:": "Ölçmə başına sınaqlar:",
  "Compile & Execute Synthetic Run": "Kompilyasiya Et və Sintetik İcranı Başlat",

  // Results & Analysis Tab
  "Results & Statistical Analysis Plan (SAP) Execution": "Nəticələr və Statistik Analiz Planının (SAP) İcrası",
  "Execute preregistered confirmatory analysis pipelines with automated False Discovery Rate (FDR) multiplicity correction and effect size uncertainty modeling.":
    "Avtomatlaşdırılmış Yalan Kəşf Dərəcəsi (FDR) çoxsaylılıq korreksiyası və effekt ölçüsünün qeyri-müəyyənlik modelləşdirilməsi ilə öncədən qeydiyyatdan keçmiş təsdiqləyici analiz boru xətlərini icra edin.",
  "Execute Preregistered SAP": "Öncədən Qeydiyyatdan Keçmiş SAP-ni İcra Et",
  "Primary Outcome Variable": "Əsas Nəticə Dəyişəni",
  "Primary Outcome:": "Əsas Nəticə:",
  "Sample Size (N)": "Nümunə Ölçüsü (N)",
  "Multiplicity Correction:": "Çoxsaylılıq Korreksiyası:",
  "Benjamini-Hochberg FDR": "Benjamini-Hochberg FDR",
  "Medium Effect Size": "Orta Effekt Ölçüsü",
  "Cohen's d": "Cohen d",
  "FDR-Adjusted p": "FDR ilə Düzəldilmiş p",
  "Significant (q < 0.05)": "Statistik Əhəmiyyətli (q < 0.05)",
  "Raw Statistical Output Record": "Xam Statistik Çıxış Qeydi",

  // Evidence & Claim Graph Tab
  "Evidence & Claim Graph (Epistemic Grounding)": "Sübut və İddia Qrafı (Epistemik Əsaslandırma)",
  "Directed acyclic graph binding raw empirical measurements to formal hypotheses and falsifiable scientific claims with SHA-256 provenance hashes.":
    "Xam empirik ölçmələri SHA-256 mənşə heşləri ilə formal hipotezlərə və falsifikasiya edilə bilən elmi iddialara bağlayan istiqamətləndirilmiş asiklik qraf.",
  "Canonical Graph Hash": "Kanonik Qraf Heşi",
  "Evidence Nodes": "Sübut Düyünləri",
  "Directed Edges": "İstiqamətləndirilmiş Kənarlar",
  "From Hypotheses to Claims": "Hipotezlərdən İddialara",
  "Hypothesis Layer": "Hipotez Qatı",
  "Epistemic Claim Layer": "Epistemik İddia Qatı",
  "Refresh Graph State": "Qraf Vəziyyətini Yenilə",

  // Scientific Governance Tab
  "Scientific Governance & Decision Ledger": "Elmi İdarəetmə və Qərar Reyestri",
  "Real-time enforcement of preregistration compliance, sensitivity boundary checks, and reproducible scientific claim validation.":
    "Öncədən qeydiyyat uyğunluğunun, həssaslıq sərhəd yoxlamalarının və təkrar istehsal oluna bilən elmi iddia yoxlamasının real vaxt rejimində tətbiqi.",
  "Ledger Cryptographic Integrity": "Reyestrin Kriptoqrafik Bütövlüyü",
  "HASH CHAIN VALID": "HEŞ ZƏNCİRİ ETİBARLIDIR",
  "HASH MISMATCH": "HEŞ UYĞUNSUZLUĞU",
  "LEDGER TAMPERING DETECTED": "REYESTRƏ MÜDAXİLƏ AŞKARLANDI",
  "Re-Verify Ledger Chain": "Reyestr Zəncirini Yenidən Yoxla",
  "Restore Canonical Chain": "Kanonik Zənciri Bərpa Et",
  "Simulate Byte Tamper Test": "Bayt Manipulyasiyası Testini Simulyasiya Et",
  "Refresh Governance Snapshot": "İdarəetmə Snapshot-ını Yenilə",
  "Copy Snapshot JSON": "Snapshot JSON-u Kopyala",

  // Audit & Reproducibility Tab
  "Scientific Audit & Cryptographic Reproducibility Engine":
    "Elmi Audit və Kriptoqrafik Təkrarlanabilənlik Mühərriki",
  "End-to-end cryptographic audit trails: verify deterministic replay, inspect immutable hashes, and audit reproducible artifacts from L0 to L8.":
    "Bağlantıdan-bağlantıya kriptoqrafik audit izləri: deterministik təkrar icranı yoxlayın, dəyişməz heşləri nəzərdən keçirin və L0-dan L8-ə qədər təkrarlana bilən artefaktları yoxlayın.",
  "Analysis Integrity Score": "Analiz Bütövlüyü Balı",
  "Cryptographic Provenance Lock": "Kriptoqrafik Mənşə Kilidi",
  "Audit Verification Note:": "Audit Verifikasiya Qeydi:",
  "Re-Execute Deterministic Pipeline": "Deterministik Boru Xəttini Yenidən İcra Et",

  // Model Revision Tab
  "L8 Model Revision Lineage & Succession": "L8 Model Reviziyası Nəsil Xətti və Ardıcıllıq",
  "Formal Lakatosian model progression: track empirical falsifications, hypothesis refinements, and immutable theoretical version trees.":
    "Formal Lakatos model inkişafı: empirik falsifikasiyaları, hipotez təkmilləşdirmələrini və dəyişməz nəzəri versiya ağaclarını izləyin.",
  "Register Model Revision": "Model Reviziyasını Qeydiyyata Al",
  "Parent Model Identifier": "Valideyn Model İdentifikatoru",
  "New Model Identifier": "Yeni Model İdentifikatoru",
  "Revision Justification": "Reviziyanın Əsaslandırılması",
  "Commit Model Revision": "Model Reviziyasını Təsdiqlə",

  // About Tab & Scientific Boundary
  "About the DNEM Scientific Platform": "DNEM Elmi Platforması Haqqında",
  "Formal Scientific & Methodological Boundary": "Formal Elmi və Metodoloji Sərhəd",
  "The DNEM Scientific Platform provides operational specifications, deterministic research scaffolds, and formal verification baselines. It does not declare candidate constructs to be scientifically valid, nor does it certify commercial claims.":
    "DNEM Elmi Platforması əməliyyat spesifikasiyaları, deterministik tədqiqat karkasları və formal verifikasiya bazalarını təmin edir. O, namizəd konstruktların elmi cəhətdən mütləq etibarlı olduğunu elan etmir və kommersiya iddialarını təsdiqləmir.",
  "Theoretical Foundations": "Nəzəri Əsaslar",
  "Karl Popper & Imre Lakatos:": "Karl Popper və İmre Lakatos:",
  "Falsificationist epistemology and methodology of scientific research programmes.":
    "Falsifikasiyaçı epistemologiya və elmi tədqiqat proqramlarının metodologiyası.",
  "Karl Friston & Active Inference:": "Karl Friston və Aktiv İnferens:",
  "Free energy principle, generative models, and hierarchical predictive processing.":
    "Sərbəst enerji prinsipi, generativ modellər və iyerarxik prediktiv emal.",

  // Command Palette
  "Search tabs, tests (Stroop, Flanker), lifecycle tour, or commands...":
    "Tabları, testləri (Stroop, Flanker), həyat dövrü turunu və ya əmrləri axtarın...",
  "Navigation Tabs": "Naviqasiya Tabları",
  "Quick Actions": "Sürətli Əməliyyatlar",
  "Launch Test Paradigm": "Test Paradiqmasını İşə Sal",

  // Tour Steps
  "Hypothesis & Protocol Formulation": "Hipotez və Protokol Formalaşdırılması",
  "Measurement & Timing Contracts Formalized": "Ölçmə və Vaxtlama Müqavilələrinin Formalaşdırılması",
  "OSF Preregistration Freezing": "OSF Öncədən Qeydiyyatın Dondurulması",
  "Hardware & Clock Synchronization": "Avadanlıq və Saat Sinxronizasiyası",
  "Participant Calibration & Warmup": "İştirakçı Kalibrasiyası və İsinmə",
  "Deterministic Event Bus Runtime": "Deterministik Hadisə Borusu İcra Mühiti",
  "Data Integrity & Provenance Lock": "Məlumat Bütövlüyü və Mənşə Kilidi",
  "Dataset Ingestion & Exclusion Filter": "Məlumat Dəstinin Qəbulu və İstisna Filtri",
  "Preregistered SAP Execution": "Öncədən Qeydiyyatdan Keçmiş SAP-nin İcrası",
  "Evidence Graph Falsification Gate": "Sübut Qrafı Falsifikasiya Qapısı",
  "Scientific Decision Ledger Audit": "Elmi Qərar Reyestrinin Auditi",
  "L8 Meta-Theoretic Model Succession": "L8 Meta-Nəzəri Model Ardıcıllığı",
  "State Lifecycle Guided Tour": "Vəziyyət Həyat Dövrü Bələdçi Turu",
  "Previous": "Əvvəlki",
  "Next State": "Növbəti Vəziyyət",
  "Complete Walkthrough": "Turu Tamamla",
  "ESC to close": "Bağlamaq üçün ESC",

  // Common UI words
  "Loading...": "Yüklənir...",
  "Processing...": "Emal olunur...",
  "Cancel": "Ləğv Et",
  "Save": "Yadda Saxla",
  "Delete": "Sil",
  "Edit": "Redaktə Et",
  "View": "Bax",
  "Details": "Təfərrüatlar",
  "Close": "Bağla",
  "Status": "Status",
  "Active": "Aktiv",
  "Verified": "Yoxlanılmış",
  "VERIFIED": "YOXLANILIB",
  "PASS": "KEÇDİ",
  "FAIL": "UĞURSUZ",
  "NOMINAL": "NOMİNAL",
  "DRIFTING": "SÜRÜŞMƏ VAR",
  "CRITICAL": "KRİTİK",
  "HIGH": "YÜKSƏK",
  "NORMAL": "NORMAL",
  "SUB-OPTIMAL": "SUB-OPTİMAL",
  "Copy JSON": "JSON-u Kopyala",
  "Copy Record": "Qeydi Kopyala",
};

const keys = Object.keys(AZ).sort((a, b) => b.length - a.length);
const originals = new WeakMap<Text, string>();

export function translateText(source: string, lang: LanguageCode): string {
  if (lang === "en") return source;
  let out = source;
  for (const key of keys) {
    if (out.includes(key)) {
      out = out.split(key).join(AZ[key]);
    }
  }
  return out;
}

export function getLanguage(): LanguageCode {
  if (typeof window === "undefined") return "en";
  return (localStorage.getItem("dnem_language") as LanguageCode) === "az" ? "az" : "en";
}

let isApplyingLanguage = false;
let observer: MutationObserver | null = null;

export function applyLanguage(lang: LanguageCode): void {
  if (typeof document === "undefined") return;
  if (isApplyingLanguage) return;
  isApplyingLanguage = true;

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
    if (observer && typeof document !== "undefined") {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }
  }
}

export function initLanguage(): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;
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

// React Context for reactive components
const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  lang: "EN",
  isAz: false,
  setLanguage: () => {},
  t: (key: string, fallback?: string) => fallback || key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(getLanguage);

  useEffect(() => {
    initLanguage();

    const onChange = (event: Event) => {
      const newLang = (event as CustomEvent<LanguageCode>).detail;
      setLanguageState(newLang);
    };

    window.addEventListener("dnem-language-change", onChange);
    return () => window.removeEventListener("dnem-language-change", onChange);
  }, []);

  const changeLanguage = useCallback((newLang: LanguageCode) => {
    setLanguage(newLang);
    setLanguageState(newLang);
  }, []);

  const t = useCallback(
    (key: string, fallback?: string): string => {
      if (language === "en") return fallback || key;
      return AZ[key] || fallback || key;
    },
    [language]
  );

  const contextValue = useMemo(
    () => ({
      language,
      lang: (language === "az" ? "AZ" : "EN") as "EN" | "AZ",
      isAz: language === "az",
      setLanguage: changeLanguage,
      t,
    }),
    [language, changeLanguage, t]
  );

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  return useContext(LanguageContext);
};

export const LanguageSwitcher: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Language selection / Dil seçimi"
      className={`inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs ${className}`}
    >
      <div className="flex items-center gap-1 pl-1.5 pr-0.5 text-slate-400 dark:text-slate-500">
        <Globe className="h-3 w-3" aria-hidden="true" />
      </div>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
        title="Switch to English interface"
        className={`px-2 py-1 rounded-md text-[11px] font-bold font-mono transition-all flex items-center gap-1 ${
          language === "en"
            ? "bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-xs ring-1 ring-slate-200/60 dark:ring-slate-600/60"
            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
        }`}
      >
        <span>EN</span>
        {language === "en" && <Check className="h-2.5 w-2.5 text-blue-600 dark:text-blue-400" />}
      </button>
      <button
        type="button"
        onClick={() => setLanguage("az")}
        aria-pressed={language === "az"}
        title="Azərbaycan dili interfeysinə keçin"
        className={`px-2 py-1 rounded-md text-[11px] font-bold font-mono transition-all flex items-center gap-1 ${
          language === "az"
            ? "bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs ring-1 ring-slate-200/60 dark:ring-slate-600/60"
            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
        }`}
      >
        <span>AZ</span>
        {language === "az" && <Check className="h-2.5 w-2.5 text-emerald-600 dark:text-emerald-400" />}
      </button>
    </div>
  );
};

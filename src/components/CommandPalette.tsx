import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  LayoutDashboard,
  Layers,
  Cpu,
  SlidersHorizontal,
  FlaskConical,
  Play,
  BarChart3,
  GitMerge,
  FileLock2,
  ShieldCheck,
  History,
  GitBranch,
  Info,
  Brain,
  Zap,
  BookOpen,
  ArrowRight,
  X,
  Sparkles,
  ShieldAlert,
  Terminal,
} from "lucide-react";
import { useLanguage } from "../i18n.js";

export interface SearchItem {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  keywords?: string[];
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tabId: string) => void;
  onLaunchTest?: (paradigmId: string) => void;
  onOpenTour?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onLaunchTest,
  onOpenTour,
}) => {
  const { isAz } = useLanguage();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Reset query when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const catNav = isAz ? "Naviqasiya" : "Navigation";
  const catChamber = isAz ? "Test Kamerası" : "Testing Chamber";
  const catActions = isAz ? "Əməliyyatlar və İdarəetmə" : "Actions & Governance";

  const items: SearchItem[] = useMemo(
    () => [
      // Navigation Tabs
      {
        id: "nav-overview",
        title: isAz ? "Platformanın Ümumi Baxışı" : "Platform Overview",
        category: catNav,
        description: isAz
          ? "Elmi platforma paneli, əməliyyat statistikası və sürətli başlanğıc sahəsi"
          : "Scientific platform dashboard, operational statistics, and quick launch pad",
        icon: <LayoutDashboard className="h-4 w-4 text-blue-600" />,
        action: () => {
          onNavigate("overview");
          onClose();
        },
        keywords: ["dashboard", "home", "stats", "metrics", "ümumi", "baxış", "statistika"],
      },
      {
        id: "nav-nine-level",
        title: isAz ? "9 Səviyyəli Arxitektura (L0-L8)" : "9-Level Architecture (L0-L8)",
        category: catNav,
        description: isAz
          ? "Fizikadan (L0) model reviziyasına (L8) qədər 9 şaquli yoxlama səviyyəsini araşdırın"
          : "Explore the 9 vertical verification levels from physics (L0) to model revision (L8)",
        icon: <Layers className="h-4 w-4 text-indigo-600" />,
        action: () => {
          onNavigate("nine-level-architecture");
          onClose();
        },
        keywords: ["l0", "l1", "l2", "l3", "l4", "l5", "l6", "l7", "l8", "hierarchy", "spec", "arxitektura", "səviyyə"],
      },
      {
        id: "nav-study-builder",
        title: isAz ? "Tədqiqat Qurucusu" : "Study Builder",
        category: catNav,
        description: isAz
          ? "İnteraktiv eksperiment konfiqurasiyası, protokol parametrləri və batareya dizayneri"
          : "Interactive experiment configuration, protocol parameters, and battery designer",
        icon: <Cpu className="h-4 w-4 text-cyan-600" />,
        action: () => {
          onNavigate("study-builder");
          onClose();
        },
        keywords: ["design", "protocol", "parameters", "setup", "tədqiqat", "qurucu", "protokol"],
      },
      {
        id: "nav-registry",
        title: isAz ? "Ölçmə Reyestri" : "Measurement Registry",
        category: catNav,
        description: isAz
          ? "12 əməliyyat koqnitiv ölçmə spesifikasiyası və rəsmi hədlər reyestri"
          : "Registry of 12 operational cognitive measurement specifications and formal bounds",
        icon: <SlidersHorizontal className="h-4 w-4 text-teal-600" />,
        action: () => {
          onNavigate("measurement-registry");
          onClose();
        },
        keywords: ["constructs", "stroop", "flanker", "nback", "matrix", "c01", "c05", "ölçmə", "reyestr"],
      },
      {
        id: "nav-workspace",
        title: isAz ? "Eksperiment İş Sahəsi" : "Experiment Workspace",
        category: catNav,
        description: isAz
          ? "Paket icraları, sintetik iştirakçıları və icra mühitlərini konfiqurasiya edin"
          : "Configure batch executions, synthetic participants, and runtime environments",
        icon: <FlaskConical className="h-4 w-4 text-amber-600" />,
        action: () => {
          onNavigate("experiment-workspace");
          onClose();
        },
        keywords: ["batch", "synthetic", "trials", "session", "eksperiment", "iş sahəsi", "sınaqlar"],
      },
      {
        id: "nav-runtime",
        title: isAz ? "Tədqiqat İcra Mühiti və Test Kamerası" : "Research Runtime & Test Chamber",
        category: catNav,
        description: isAz
          ? "Canlı iştirakçı test kamerası və hadisə yoxlaması ilə sintetik icra mühərriki"
          : "Live participant test chamber and synthetic execution engine with event verification",
        icon: <Play className="h-4 w-4 text-emerald-600" />,
        action: () => {
          onNavigate("research-runtime");
          onClose();
        },
        keywords: ["interactive", "live test", "reaction time", "chamber", "participant", "canlı", "icra", "kamera"],
      },
      {
        id: "nav-results",
        title: isAz ? "Nəticələr və Analiz" : "Results & Analysis",
        category: catNav,
        description: isAz
          ? "Psixometrik statistik paylanmalar, etibarlılıq intervalları və təsir ölçüləri"
          : "Psychometric statistical distributions, confidence intervals, and effect sizes",
        icon: <BarChart3 className="h-4 w-4 text-purple-600" />,
        action: () => {
          onNavigate("results-analysis");
          onClose();
        },
        keywords: ["charts", "statistics", "data", "cohen", "distributions", "nəticələr", "analiz", "qrafik"],
      },
      {
        id: "nav-claim-graph",
        title: isAz ? "Sübut və İddia Qrafı" : "Evidence & Claim Graph",
        category: catNav,
        description: isAz
          ? "İlkin sınaq müşahidələrini elmi iddialara və təkzibedicilərə bağlayan rəsmi DAG"
          : "Formal DAG linking raw trial observations to scientific assertions and falsifiers",
        icon: <GitMerge className="h-4 w-4 text-pink-600" />,
        action: () => {
          onNavigate("evidence-claim-graph");
          onClose();
        },
        keywords: ["claims", "dag", "epistemology", "falsification", "graph", "sübut", "iddia", "qraf"],
      },
      {
        id: "nav-prereg",
        title: isAz ? "Protokollar və Öncədən Qeydiyyat" : "Protocols & Preregistration",
        category: catNav,
        description: isAz
          ? "OSF uyğun öncədən qeydiyyat sxemləri və dondurulmuş protokol manifestləri"
          : "OSF-compatible preregistration schemas and frozen protocol manifests",
        icon: <FileLock2 className="h-4 w-4 text-rose-600" />,
        action: () => {
          onNavigate("protocols-preregistration");
          onClose();
        },
        keywords: ["osf", "freeze", "provenance", "preregistration", "protokol", "qeydiyyat"],
      },
      {
        id: "nav-governance",
        title: isAz ? "Elmi İdarəetmə" : "Scientific Governance",
        category: catNav,
        description: isAz
          ? "Rəy auditi izləri, institusional IRB uyğunluğu və təkrarlanabilənlik qapıları"
          : "Peer-review audit trails, institutional IRB compliance, and reproducibility gates",
        icon: <ShieldCheck className="h-4 w-4 text-blue-700" />,
        action: () => {
          onNavigate("scientific-governance");
          onClose();
        },
        keywords: ["irb", "compliance", "ethics", "governance", "idarəetmə", "etika", "audit"],
      },
      {
        id: "nav-audit",
        title: isAz ? "Audit və Təkrarlanabilənlik Reyestri" : "Audit & Reproducibility Ledger",
        category: catNav,
        description: isAz
          ? "Kriptoqrafik SHA-256 heş zəncirləri, icra qəbzləri və deterministik təkrar icralar"
          : "Cryptographic SHA-256 hash chains, run-time receipts, and deterministic replays",
        icon: <History className="h-4 w-4 text-slate-700" />,
        action: () => {
          onNavigate("audit-reproducibility");
          onClose();
        },
        keywords: ["sha256", "ledger", "hashes", "replay", "immutable", "kriptoqrafiya", "heş"],
      },
      {
        id: "nav-model-revision",
        title: isAz ? "L8 Model Reviziyası" : "L8 Model Revision",
        category: catNav,
        description: isAz
          ? "Bayes ilkin ehtimallarının yenilənməsi, koqnitiv parametrlərin qiymətləndirilməsi və nəzəriyyə təkmilləşdirmələri"
          : "Bayesian prior updates, cognitive parameter estimation, and theory refinements",
        icon: <GitBranch className="h-4 w-4 text-amber-700" />,
        action: () => {
          onNavigate("l8-model-revision");
          onClose();
        },
        keywords: ["bayesian", "model", "revision", "theory", "bayes", "reviziya", "nəzəriyyə"],
      },
      {
        id: "nav-boundary",
        title: isAz ? "Elmi Sərhəd və Metodoloji Müqavilə" : "Scientific Boundary & Methodological Contract",
        category: catNav,
        description: isAz
          ? "Əməliyyat elmi sərhədləri, falsifikasiya meyarları və formal imtina bəyannaməsi"
          : "Operational scientific boundaries, falsification criteria, and formal disclaimer declaration",
        icon: <ShieldAlert className="h-4 w-4 text-amber-600" />,
        action: () => {
          onNavigate("scientific-boundary");
          onClose();
        },
        keywords: ["boundary", "disclaimer", "limits", "falsification", "sərhəd", "imtina", "bəyannamə"],
      },
      {
        id: "nav-api-explorer",
        title: isAz ? "İnteraktiv API Tədqiqatçısı" : "Interactive API Explorer",
        category: catNav,
        description: isAz
          ? "Miqrasiya edilmiş REST son nöqtələrini (/api/v1/*) birbaşa real vaxtda icra və test edin"
          : "Directly execute and test migrated backend REST endpoints (/api/v1/*) in real-time",
        icon: <Terminal className="h-4 w-4 text-blue-600" />,
        action: () => {
          onNavigate("api-explorer");
          onClose();
        },
        keywords: ["api", "rest", "endpoints", "curl", "health", "measurements", "server", "tədqiqatçı"],
      },
      {
        id: "nav-about",
        title: isAz ? "Haqqında və Sənədlər" : "About & Documentation",
        category: catNav,
        description: isAz
          ? "Elmi texniki sənədlər, API spesifikasiyaları və arxitektura sənədləri"
          : "Scientific whitepaper, API specifications, and architectural documentation",
        icon: <Info className="h-4 w-4 text-slate-600" />,
        action: () => {
          onNavigate("about");
          onClose();
        },
        keywords: ["docs", "help", "whitepaper", "specification", "haqqında", "sənədlər", "kömək"],
      },

      // Testing Chamber Direct Launches
      {
        id: "test-stroop",
        title: isAz
          ? "Stroop Rəng-Söz İnterferensiyasını Başlat (C05-01)"
          : "Launch Stroop Color-Word Interference (C05-01)",
        category: catChamber,
        description: isAz
          ? "Qadağanedici nəzarəti və koqnitiv münaqişə gecikməsini ölçən canlı interaktiv test"
          : "Live interactive test measuring inhibitory control and cognitive conflict latency",
        icon: <Brain className="h-4 w-4 text-red-500" />,
        action: () => {
          if (onLaunchTest) onLaunchTest("C05-01");
          else onNavigate("research-runtime");
          onClose();
        },
        keywords: ["stroop", "color", "word", "interference", "c05", "executive", "rəng", "söz", "münaqişə"],
      },
      {
        id: "test-nback",
        title: isAz
          ? "Vizual N-Back İş Yaddaşı Testini Başlat (C02-01)"
          : "Launch Visual N-Back Working Memory (C02-01)",
        category: catChamber,
        description: isAz
          ? "2-back iş yaddaşı buferini qiymətləndirən davamlı hərf axını tapşırığı"
          : "Continuous performance letter stream evaluating 2-back working memory buffer",
        icon: <Zap className="h-4 w-4 text-blue-500" />,
        action: () => {
          if (onLaunchTest) onLaunchTest("C02-01");
          else onNavigate("research-runtime");
          onClose();
        },
        keywords: ["nback", "working memory", "c02", "letters", "2-back", "yaddaş", "iş yaddaşı", "hərf"],
      },
      {
        id: "test-rt",
        title: isAz
          ? "Sadə və Seçimli Reaksiya Vaxtını Başlat (C03-01)"
          : "Launch Simple & Choice Reaction Time (C03-01)",
        category: catChamber,
        description: isAz
          ? "Qavrayış-motor emalı sürəti üçün sub-millisaniyəlik gecikmə ölçümü"
          : "Sub-millisecond latency measurement for perceptual-motor processing speed",
        icon: <Play className="h-4 w-4 text-amber-500" />,
        action: () => {
          if (onLaunchTest) onLaunchTest("C03-01");
          else onNavigate("research-runtime");
          onClose();
        },
        keywords: ["reaction time", "latency", "speed", "c03", "choice rt", "reaksiya", "sürət", "gecikmə"],
      },
      {
        id: "test-flanker",
        title: isAz
          ? "Eriksen Flanker Tapşırığını Başlat (C04-01)"
          : "Launch Eriksen Flanker Task (C04-01)",
        category: catChamber,
        description: isAz
          ? "Vizual selektiv diqqəti və fəza ox münaqişəsinin həllini ölçür"
          : "Measures visual selective attention and spatial flanker arrow conflict resolution",
        icon: <Brain className="h-4 w-4 text-emerald-500" />,
        action: () => {
          if (onLaunchTest) onLaunchTest("C04-01");
          else onNavigate("research-runtime");
          onClose();
        },
        keywords: ["flanker", "eriksen", "arrows", "attention", "c04", "oxlar", "diqqət", "fəza"],
      },
      {
        id: "test-matrix",
        title: isAz
          ? "Mütərəqqi Matris Mühakiməsini Başlat (C01-01)"
          : "Launch Progressive Matrix Reasoning (C01-01)",
        category: catChamber,
        description: isAz
          ? "Qeyri-verbal maye zəkanı qiymətləndirən vizual induktiv model tamamlama"
          : "Visual inductive pattern completion assessing non-verbal fluid intelligence",
        icon: <Brain className="h-4 w-4 text-purple-500" />,
        action: () => {
          if (onLaunchTest) onLaunchTest("C01-01");
          else onNavigate("research-runtime");
          onClose();
        },
        keywords: ["matrix", "fluid intelligence", "patterns", "c01", "raven", "matris", "zəka", "məntiq"],
      },

      // Guided Walkthrough & Actions
      {
        id: "action-tour",
        title: isAz
          ? "12 Mərhələli Həyat Dövrü Bələdçili Turunu Başlat"
          : "Start 12-State Lifecycle Guided Tour",
        category: catActions,
        description: isAz
          ? "DRAFT-dan LOCKED-a qədər deterministik tədqiqat həyat dövrü üzrə interaktiv bələdçi"
          : "Interactive walkthrough through the deterministic research lifecycle from DRAFT to LOCKED",
        icon: <BookOpen className="h-4 w-4 text-emerald-600" />,
        action: () => {
          if (onOpenTour) onOpenTour();
          onClose();
        },
        keywords: ["tour", "walkthrough", "lifecycle", "guide", "12 states", "tur", "bələdçi", "həyat dövrü"],
      },
    ],
    [onNavigate, onLaunchTest, onOpenTour, onClose, isAz, catNav, catChamber, catActions]
  );

  const filteredItems = useMemo(() => {
    if (!query.trim()) return items;
    const lower = query.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(lower) ||
        item.description.toLowerCase().includes(lower) ||
        item.category.toLowerCase().includes(lower) ||
        item.keywords?.some((k) => k.toLowerCase().includes(lower))
    );
  }, [items, query]);

  // Keyboard navigation within list
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action();
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, filteredItems, selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 p-4 animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 bg-slate-50/50">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={
              isAz
                ? "Bölmələri, testləri (Stroop, Flanker), həyat dövrü turunu və ya əmrləri axtarın..."
                : "Search tabs, tests (Stroop, Flanker), lifecycle tour, or commands..."
            }
            className="flex-1 bg-transparent border-none outline-hidden text-sm text-slate-900 placeholder:text-slate-400 font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600 text-xs"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <span className="hidden sm:inline-flex items-center text-[10px] font-mono text-slate-400 bg-slate-200/80 px-1.5 py-0.5 rounded">
            {isAz ? "Bağlamaq üçün ESC" : "ESC to close"}
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-100">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              <Search className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              {isAz ? `“${query}” üzrə heç bir nəticə tapılmadı` : `No results found for “${query}”`}
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => item.action()}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                    isSelected ? "bg-blue-50/80 text-blue-950" : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div
                    className={`mt-0.5 p-2 rounded-lg ${
                      isSelected ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-slate-900">{item.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{item.description}</p>
                  </div>
                  {isSelected && (
                    <ArrowRight className="h-4 w-4 text-blue-600 self-center flex-shrink-0" />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between font-mono">
          <div className="flex items-center gap-3">
            <span>{isAz ? "↑↓ Naviqasiya" : "↑↓ Navigate"}</span>
            <span>{isAz ? "↵ Seçin" : "↵ Select"}</span>
          </div>
          <span>DNEM Scientific Platform</span>
        </div>
      </div>
    </div>
  );
};

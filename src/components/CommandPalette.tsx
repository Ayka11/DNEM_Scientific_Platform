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
} from "lucide-react";

export interface SearchItem {
  id: string;
  title: string;
  category: "Navigation" | "Testing Chamber" | "Actions & Governance" | "Scientific Reference";
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

  const items: SearchItem[] = useMemo(
    () => [
      // Navigation Tabs
      {
        id: "nav-overview",
        title: "Platform Overview",
        category: "Navigation",
        description: "Scientific platform dashboard, operational statistics, and quick launch pad",
        icon: <LayoutDashboard className="h-4 w-4 text-blue-600" />,
        action: () => {
          onNavigate("overview");
          onClose();
        },
        keywords: ["dashboard", "home", "stats", "metrics"],
      },
      {
        id: "nav-nine-level",
        title: "9-Level Architecture (L0-L8)",
        category: "Navigation",
        description: "Explore the 9 vertical verification levels from physics (L0) to model revision (L8)",
        icon: <Layers className="h-4 w-4 text-indigo-600" />,
        action: () => {
          onNavigate("nine-level-architecture");
          onClose();
        },
        keywords: ["l0", "l1", "l2", "l3", "l4", "l5", "l6", "l7", "l8", "hierarchy", "spec"],
      },
      {
        id: "nav-study-builder",
        title: "Study Builder",
        category: "Navigation",
        description: "Interactive experiment configuration, protocol parameters, and battery designer",
        icon: <Cpu className="h-4 w-4 text-cyan-600" />,
        action: () => {
          onNavigate("study-builder");
          onClose();
        },
        keywords: ["design", "protocol", "parameters", "setup"],
      },
      {
        id: "nav-registry",
        title: "Measurement Registry",
        category: "Navigation",
        description: "Registry of 12 operational cognitive measurement specifications and formal bounds",
        icon: <SlidersHorizontal className="h-4 w-4 text-teal-600" />,
        action: () => {
          onNavigate("measurement-registry");
          onClose();
        },
        keywords: ["constructs", "stroop", "flanker", "nback", "matrix", "c01", "c05"],
      },
      {
        id: "nav-workspace",
        title: "Experiment Workspace",
        category: "Navigation",
        description: "Configure batch executions, synthetic participants, and runtime environments",
        icon: <FlaskConical className="h-4 w-4 text-amber-600" />,
        action: () => {
          onNavigate("experiment-workspace");
          onClose();
        },
        keywords: ["batch", "synthetic", "trials", "session"],
      },
      {
        id: "nav-runtime",
        title: "Research Runtime & Test Chamber",
        category: "Navigation",
        description: "Live participant test chamber and synthetic execution engine with event verification",
        icon: <Play className="h-4 w-4 text-emerald-600" />,
        action: () => {
          onNavigate("research-runtime");
          onClose();
        },
        keywords: ["interactive", "live test", "reaction time", "chamber", "participant"],
      },
      {
        id: "nav-results",
        title: "Results & Analysis",
        category: "Navigation",
        description: "Psychometric statistical distributions, confidence intervals, and effect sizes",
        icon: <BarChart3 className="h-4 w-4 text-purple-600" />,
        action: () => {
          onNavigate("results-analysis");
          onClose();
        },
        keywords: ["charts", "statistics", "data", "cohen", "distributions"],
      },
      {
        id: "nav-claim-graph",
        title: "Evidence & Claim Graph",
        category: "Navigation",
        description: "Formal DAG linking raw trial observations to scientific assertions and falsifiers",
        icon: <GitMerge className="h-4 w-4 text-pink-600" />,
        action: () => {
          onNavigate("evidence-claim-graph");
          onClose();
        },
        keywords: ["claims", "dag", "epistemology", "falsification", "graph"],
      },
      {
        id: "nav-prereg",
        title: "Protocols & Preregistration",
        category: "Navigation",
        description: "OSF-compatible preregistration schemas and frozen protocol manifests",
        icon: <FileLock2 className="h-4 w-4 text-rose-600" />,
        action: () => {
          onNavigate("protocols-preregistration");
          onClose();
        },
        keywords: ["osf", "freeze", "provenance", "preregistration"],
      },
      {
        id: "nav-governance",
        title: "Scientific Governance",
        category: "Navigation",
        description: "Peer-review audit trails, institutional IRB compliance, and reproducibility gates",
        icon: <ShieldCheck className="h-4 w-4 text-blue-700" />,
        action: () => {
          onNavigate("scientific-governance");
          onClose();
        },
        keywords: ["irb", "compliance", "ethics", "governance"],
      },
      {
        id: "nav-audit",
        title: "Audit & Reproducibility Ledger",
        category: "Navigation",
        description: "Cryptographic SHA-256 hash chains, run-time receipts, and deterministic replays",
        icon: <History className="h-4 w-4 text-slate-700" />,
        action: () => {
          onNavigate("audit-reproducibility");
          onClose();
        },
        keywords: ["sha256", "ledger", "hashes", "replay", "immutable"],
      },
      {
        id: "nav-model-revision",
        title: "L8 Model Revision",
        category: "Navigation",
        description: "Bayesian prior updates, cognitive parameter estimation, and theory refinements",
        icon: <GitBranch className="h-4 w-4 text-amber-700" />,
        action: () => {
          onNavigate("l8-model-revision");
          onClose();
        },
        keywords: ["bayesian", "model", "revision", "theory"],
      },
      {
        id: "nav-about",
        title: "About & Documentation",
        category: "Navigation",
        description: "Scientific whitepaper, API specifications, and architectural documentation",
        icon: <Info className="h-4 w-4 text-slate-600" />,
        action: () => {
          onNavigate("about");
          onClose();
        },
        keywords: ["docs", "help", "whitepaper", "specification"],
      },

      // Testing Chamber Direct Launches
      {
        id: "test-stroop",
        title: "Launch Stroop Color-Word Interference (C05-01)",
        category: "Testing Chamber",
        description: "Live interactive test measuring inhibitory control and cognitive conflict latency",
        icon: <Brain className="h-4 w-4 text-red-500" />,
        action: () => {
          if (onLaunchTest) onLaunchTest("C05-01");
          else onNavigate("research-runtime");
          onClose();
        },
        keywords: ["stroop", "color", "word", "interference", "c05", "executive"],
      },
      {
        id: "test-nback",
        title: "Launch Visual N-Back Working Memory (C02-01)",
        category: "Testing Chamber",
        description: "Continuous performance letter stream evaluating 2-back working memory buffer",
        icon: <Zap className="h-4 w-4 text-blue-500" />,
        action: () => {
          if (onLaunchTest) onLaunchTest("C02-01");
          else onNavigate("research-runtime");
          onClose();
        },
        keywords: ["nback", "working memory", "c02", "letters", "2-back"],
      },
      {
        id: "test-rt",
        title: "Launch Simple & Choice Reaction Time (C03-01)",
        category: "Testing Chamber",
        description: "Sub-millisecond latency measurement for perceptual-motor processing speed",
        icon: <Play className="h-4 w-4 text-amber-500" />,
        action: () => {
          if (onLaunchTest) onLaunchTest("C03-01");
          else onNavigate("research-runtime");
          onClose();
        },
        keywords: ["reaction time", "latency", "speed", "c03", "choice rt"],
      },
      {
        id: "test-flanker",
        title: "Launch Eriksen Flanker Task (C04-01)",
        category: "Testing Chamber",
        description: "Measures visual selective attention and spatial flanker arrow conflict resolution",
        icon: <Brain className="h-4 w-4 text-emerald-500" />,
        action: () => {
          if (onLaunchTest) onLaunchTest("C04-01");
          else onNavigate("research-runtime");
          onClose();
        },
        keywords: ["flanker", "eriksen", "arrows", "attention", "c04"],
      },
      {
        id: "test-matrix",
        title: "Launch Progressive Matrix Reasoning (C01-01)",
        category: "Testing Chamber",
        description: "Visual inductive pattern completion assessing non-verbal fluid intelligence",
        icon: <Brain className="h-4 w-4 text-purple-500" />,
        action: () => {
          if (onLaunchTest) onLaunchTest("C01-01");
          else onNavigate("research-runtime");
          onClose();
        },
        keywords: ["matrix", "fluid intelligence", "patterns", "c01", "raven"],
      },

      // Guided Walkthrough & Actions
      {
        id: "action-tour",
        title: "Start 12-State Lifecycle Guided Tour",
        category: "Actions & Governance",
        description: "Interactive walkthrough through the deterministic research lifecycle from DRAFT to LOCKED",
        icon: <BookOpen className="h-4 w-4 text-emerald-600" />,
        action: () => {
          if (onOpenTour) onOpenTour();
          onClose();
        },
        keywords: ["tour", "walkthrough", "lifecycle", "guide", "12 states"],
      },
    ],
    [onNavigate, onLaunchTest, onOpenTour, onClose]
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
            placeholder="Search tabs, tests (Stroop, Flanker), lifecycle tour, or commands..."
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
            ESC to close
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-100">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              <Search className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              No results found for &ldquo;{query}&rdquo;
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
            <span>&uarr;&darr; Navigate</span>
            <span>&crarr; Select</span>
          </div>
          <span>DNEM Scientific Platform</span>
        </div>
      </div>
    </div>
  );
};

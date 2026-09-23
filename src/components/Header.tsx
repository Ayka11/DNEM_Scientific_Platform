import React, { useState } from "react";
import {
  Activity,
  ShieldAlert,
  Cpu,
  Layers,
  LayoutDashboard,
  FlaskConical,
  Play,
  BarChart3,
  GitMerge,
  FileLock2,
  ShieldCheck,
  History,
  GitBranch,
  Info,
  SlidersHorizontal,
  Search,
  BookOpen,
  Sun,
  Moon,
  Filter,
} from "lucide-react";

export type TabCategory = "all" | "foundations" | "design" | "runtime" | "governance";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSearch?: () => void;
  onOpenTour?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSearch,
  onOpenTour,
  isDarkMode = false,
  onToggleDarkMode,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<TabCategory>("all");

  const tabs = [
    { id: "overview", label: "Overview", category: "foundations", icon: <LayoutDashboard className="h-3.5 w-3.5" /> },
    { id: "nine-level-architecture", label: "9-Level Architecture", category: "foundations", icon: <Layers className="h-3.5 w-3.5" /> },
    { id: "about", label: "About", category: "foundations", icon: <Info className="h-3.5 w-3.5" /> },
    { id: "study-builder", label: "Study Builder", category: "design", icon: <Cpu className="h-3.5 w-3.5" /> },
    { id: "measurement-registry", label: "Measurement Registry", category: "design", icon: <SlidersHorizontal className="h-3.5 w-3.5" /> },
    { id: "protocols-preregistration", label: "Protocols & Preregistration", category: "design", icon: <FileLock2 className="h-3.5 w-3.5" /> },
    { id: "experiment-workspace", label: "Experiment Workspace", category: "runtime", icon: <FlaskConical className="h-3.5 w-3.5" /> },
    { id: "research-runtime", label: "Research Runtime", category: "runtime", icon: <Play className="h-3.5 w-3.5" /> },
    { id: "results-analysis", label: "Results & Analysis", category: "runtime", icon: <BarChart3 className="h-3.5 w-3.5" /> },
    { id: "evidence-claim-graph", label: "Evidence & Claim Graph", category: "governance", icon: <GitMerge className="h-3.5 w-3.5" /> },
    { id: "scientific-governance", label: "Scientific Governance", category: "governance", icon: <ShieldCheck className="h-3.5 w-3.5" /> },
    { id: "audit-reproducibility", label: "Audit & Reproducibility", category: "governance", icon: <History className="h-3.5 w-3.5" /> },
    { id: "l8-model-revision", label: "L8 Model Revision", category: "governance", icon: <GitBranch className="h-3.5 w-3.5" /> },
  ];

  const categories: { id: TabCategory; label: string; count: number }[] = [
    { id: "all", label: "All Modules", count: tabs.length },
    { id: "foundations", label: "Foundations", count: 3 },
    { id: "design", label: "Design & Protocols", count: 3 },
    { id: "runtime", label: "Execution & Runtime", count: 3 },
    { id: "governance", label: "Governance & Verification", count: 4 },
  ];

  const visibleTabs =
    selectedCategory === "all" ? tabs : tabs.filter((t) => t.category === selectedCategory);

  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-30 shadow-2xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-3">
        {/* Brand Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  DNEM Scientific Platform
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  v7.7
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  L0 &rarr; L8 Architecture
                </span>
              </div>
              <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium flex items-center gap-1 mt-0.5">
                <ShieldAlert className="h-3.5 w-3.5 flex-shrink-0" />
                Deterministic Research Scaffold &bull; Operational Specifications &bull; Verification Baseline
              </p>
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 self-start lg:self-auto">
            {/* Command Palette Trigger */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 transition-colors"
              title="Quick search (Cmd+K / Ctrl+K)"
            >
              <Search className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="font-mono text-[10px] bg-white dark:bg-slate-900 px-1 py-0.5 rounded border border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                ⌘K
              </kbd>
            </button>

            {/* Lifecycle Tour Trigger */}
            <button
              onClick={onOpenTour}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 dark:bg-blue-950/80 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-semibold border border-blue-200 dark:border-blue-800 transition-colors"
              title="Take interactive tour of 12-state research lifecycle"
            >
              <BookOpen className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span>12-State Tour</span>
            </button>

            {/* Dark Mode / High-Contrast Laboratory Theme Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs border border-slate-200 dark:border-slate-700 transition-colors"
              title={isDarkMode ? "Switch to Laboratory Light Mode" : "Switch to Laboratory Dark Mode"}
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-slate-600" />
              )}
            </button>

            <span className="hidden xl:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-slate-600 dark:text-slate-400">
              <Cpu className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              Node.js 22
            </span>
            <span className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-md font-medium text-[11px]">
              API Ready
            </span>
          </div>
        </div>

        {/* Tab Grouping Category Filters */}
        <div className="mt-3.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 overflow-x-auto pb-1 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1 mr-1">
              <Filter className="h-3 w-3" /> Groups:
            </span>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                    isSelected
                      ? "bg-slate-800 text-white dark:bg-blue-600"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[9px] px-1 py-0.2 rounded-full font-mono ${
                      isSelected
                        ? "bg-slate-700 text-slate-200 dark:bg-blue-500"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Navigation Scrollbar */}
        <nav
          className="flex space-x-1.5 mt-2.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700"
          aria-label="Scientific Platform Navigation"
        >
          {visibleTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-2xs"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};


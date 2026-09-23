import React, { useState, useEffect } from "react";
import { Header } from "./components/Header.js";
import { OverviewTab } from "./components/OverviewTab.js";
import { NineLevelArchitectureTab } from "./components/NineLevelArchitectureTab.js";
import { StudyBuilderTab } from "./components/StudyBuilderTab.js";
import { MeasurementRegistryTab } from "./components/MeasurementRegistryTab.js";
import { ExperimentWorkspaceTab } from "./components/ExperimentWorkspaceTab.js";
import { ResearchRuntimeTab } from "./components/ResearchRuntimeTab.js";
import { ResultsAnalysisTab } from "./components/ResultsAnalysisTab.js";
import { EvidenceClaimGraphTab } from "./components/EvidenceClaimGraphTab.js";
import { ProtocolsPreregistrationTab } from "./components/ProtocolsPreregistrationTab.js";
import { ScientificGovernanceTab } from "./components/ScientificGovernanceTab.js";
import { AuditReproducibilityTab } from "./components/AuditReproducibilityTab.js";
import { ModelRevisionTab } from "./components/ModelRevisionTab.js";
import { AboutTab } from "./components/AboutTab.js";
import { CommandPalette } from "./components/CommandPalette.js";
import { LifecycleTourModal } from "./components/LifecycleTourModal.js";
import { initLanguage } from "./i18n.js";

export function App() {
  useEffect(() => {
    initLanguage();
  }, []);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [selectedTestParadigm, setSelectedTestParadigm] = useState<string>("C05-01");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("dnem_dark_mode") === "true";
  });

  // Toggle dark mode class on html/body root
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("dnem_dark_mode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("dnem_dark_mode", "false");
    }
  }, [isDarkMode]);

  // Global shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, []);

  const handleLaunchTest = (measurementId: string) => {
    if (measurementId.startsWith("C05")) {
      setSelectedTestParadigm("C05-01");
    } else if (measurementId.startsWith("C02")) {
      setSelectedTestParadigm("C02-01");
    } else if (measurementId.startsWith("C03")) {
      setSelectedTestParadigm("C03-01");
    } else if (measurementId.startsWith("C04")) {
      setSelectedTestParadigm("C04-01");
    } else if (measurementId.startsWith("C01")) {
      setSelectedTestParadigm("C01-01");
    } else {
      setSelectedTestParadigm("C05-01");
    }
    setActiveTab("research-runtime");
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans antialiased transition-colors ${
        isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
    >
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenTour={() => setIsTourOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <OverviewTab onNavigate={setActiveTab} onOpenTour={() => setIsTourOpen(true)} />
        )}
        {activeTab === "nine-level-architecture" && <NineLevelArchitectureTab />}
        {activeTab === "study-builder" && <StudyBuilderTab onLaunchTest={handleLaunchTest} />}
        {activeTab === "measurement-registry" && <MeasurementRegistryTab onLaunchTest={handleLaunchTest} />}
        {activeTab === "experiment-workspace" && <ExperimentWorkspaceTab />}
        {activeTab === "research-runtime" && <ResearchRuntimeTab initialParadigm={selectedTestParadigm} />}
        {activeTab === "results-analysis" && <ResultsAnalysisTab />}
        {activeTab === "evidence-claim-graph" && <EvidenceClaimGraphTab />}
        {activeTab === "protocols-preregistration" && <ProtocolsPreregistrationTab />}
        {activeTab === "scientific-governance" && <ScientificGovernanceTab />}
        {activeTab === "audit-reproducibility" && <AuditReproducibilityTab />}
        {activeTab === "l8-model-revision" && <ModelRevisionTab />}
        {activeTab === "about" && <AboutTab />}
      </main>

      {/* Global Command Palette (Cmd+K) */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={setActiveTab}
        onLaunchTest={handleLaunchTest}
        onOpenTour={() => setIsTourOpen(true)}
      />

      {/* 12-State Lifecycle Walkthrough Tour */}
      <LifecycleTourModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onNavigateTab={setActiveTab}
      />

      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-5 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">DNEM Scientific Platform v7.7</span>
            <span>&bull;</span>
            <span>L0 &rarr; L8 Deterministic Research Runtime</span>
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500">
            Node.js 22 Runtime &bull; Express API &bull; React Vite Frontend &bull; SHA-256 Provenance Ledger
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;


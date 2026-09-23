import React, { useState, useEffect } from "react";
import { ArchitectureLevel } from "../types.js";
import {
  Layers,
  Search,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Cpu,
  Brain,
  Sliders,
  Compass,
  Sparkles,
  Users,
  TrendingUp,
  GitBranch,
} from "lucide-react";

export const NineLevelArchitectureTab: React.FC = () => {
  const [levels, setLevels] = useState<ArchitectureLevel[]>([]);
  const [selectedLevelId, setSelectedLevelId] = useState<string>("L2");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/v1/architecture/levels")
      .then((res) => res.json())
      .then((data) => {
        setLevels(data.levels || []);
      })
      .catch((err) => console.error("Failed to load levels", err));
  }, []);

  const getLevelIcon = (id: string) => {
    switch (id) {
      case "L0": return <Cpu className="h-4 w-4" />;
      case "L1": return <Brain className="h-4 w-4" />;
      case "L2": return <Layers className="h-4 w-4" />;
      case "L3": return <Sliders className="h-4 w-4" />;
      case "L4": return <Compass className="h-4 w-4" />;
      case "L5": return <Sparkles className="h-4 w-4" />;
      case "L6": return <Users className="h-4 w-4" />;
      case "L7": return <TrendingUp className="h-4 w-4" />;
      case "L8": return <GitBranch className="h-4 w-4" />;
      default: return <Layers className="h-4 w-4" />;
    }
  };

  const filteredLevels = levels.filter((lvl) => {
    const q = search.toLowerCase();
    return (
      lvl.id.toLowerCase().includes(q) ||
      lvl.name.toLowerCase().includes(q) ||
      lvl.category.toLowerCase().includes(q) ||
      lvl.description.toLowerCase().includes(q) ||
      lvl.domains.some((d) => d.id.toLowerCase().includes(q) || d.name.toLowerCase().includes(q))
    );
  });

  const activeLevel = levels.find((l) => l.id === selectedLevelId) || levels[2];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Layers className="h-5 w-5 text-blue-600" />
              9-Level Scientific Architecture (L0 &rarr; L8)
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Hierarchical neurocognitive ontology spanning physical sensors and external stimuli (L0), biological substrates (L1),
              core cognition (L2), dynamic regulatory adaptation (L3), agency and value hierarchies (L4), narrative identity (L5),
              social ecology (L6), ontogenetic development (L7), to meta-governance and model revision (L8).
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-700 font-mono rounded-md font-semibold border border-slate-200">
              DNEM v7.7 Ontology
            </span>
          </div>
        </div>

        {/* Filter Input */}
        <div className="mt-4 relative">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            id="architecture-search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search constructs, domains (e.g. C01, R02, H04), paradigms, or level names..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 9-Level Stack List */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
            Ontological Hierarchy (Top: Meta &bull; Bottom: Physics)
          </div>

          <div className="space-y-2">
            {filteredLevels.map((lvl) => {
              const isSelected = lvl.id === selectedLevelId;
              return (
                <div
                  key={lvl.id}
                  id={`level-card-${lvl.id}`}
                  onClick={() => setSelectedLevelId(lvl.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "bg-blue-50/90 border-blue-300 shadow-xs"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`h-9 w-9 rounded-lg font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 ${
                        isSelected
                          ? "bg-blue-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {lvl.id}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 truncate">{lvl.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">{lvl.category}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] px-2 py-0.5 rounded-md font-mono font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                      {lvl.domains.length} domains
                    </span>
                    <ChevronRight
                      className={`h-4 w-4 transition-transform ${
                        isSelected ? "text-blue-600 translate-x-0.5" : "text-slate-400"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Comprehensive Level Inspector */}
        <div className="lg:col-span-7">
          {activeLevel && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-6">
              {/* Level Header */}
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-1 rounded-md bg-blue-600 text-white font-mono font-bold text-sm">
                      {activeLevel.id}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">{activeLevel.name}</h3>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold font-mono border ${
                      activeLevel.status === "ACTIVE"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : activeLevel.status === "SPECIFIED"
                        ? "bg-purple-50 text-purple-700 border-purple-200"
                        : "bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    STATUS: {activeLevel.status}
                  </span>
                </div>
                <p className="text-xs text-blue-600 font-semibold mt-1">{activeLevel.category}</p>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{activeLevel.description}</p>
              </div>

              {/* Theoretical Grounding Card */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                <span className="font-semibold text-slate-800 uppercase tracking-wider text-[10px]">
                  Theoretical & Empirical Grounding
                </span>
                <p className="text-slate-600 leading-relaxed">{activeLevel.theoreticalGrounding}</p>
              </div>

              {/* Core Constructs */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-800">Core Constructs</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeLevel.coreConstructs.map((construct, i) => (
                    <div
                      key={i}
                      className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 flex items-center gap-2"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-600 flex-shrink-0" />
                      <span className="truncate">{construct}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Associated Domains */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800">
                    Associated Assessment Domains ({activeLevel.domains.length})
                  </span>
                </div>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {activeLevel.domains.map((dom) => (
                    <div
                      key={dom.id}
                      className="p-3 bg-white border border-slate-200 rounded-lg text-xs hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono font-bold text-blue-700">{dom.id}</span>
                        <span className="font-semibold text-slate-900">{dom.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-normal">{dom.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Task Paradigms */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-800">Sample Task Paradigms</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeLevel.paradigms.map((p, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-blue-50 text-blue-800 rounded-md text-[11px] font-medium border border-blue-200/60"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Data Contracts: Input & Output */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <div className="font-semibold text-slate-700 text-[10px] uppercase font-mono">Input Contract</div>
                  <div className="text-slate-600 text-[11px] leading-relaxed">{activeLevel.inputContract}</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <div className="font-semibold text-slate-700 text-[10px] uppercase font-mono">Output Contract</div>
                  <div className="text-slate-600 text-[11px] leading-relaxed">{activeLevel.outputContract}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

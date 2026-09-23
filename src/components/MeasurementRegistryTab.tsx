import React, { useState, useEffect } from "react";
import { Measurement } from "../types.js";
import { useLanguage } from "../i18n.js";
import { Search, Filter, Layers, CheckCircle, Info, Play, Zap } from "lucide-react";

interface MeasurementRegistryTabProps {
  onLaunchTest?: (measurementId: string) => void;
}

export const MeasurementRegistryTab: React.FC<MeasurementRegistryTabProps> = ({ onLaunchTest }) => {
  const { isAz } = useLanguage();
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("ALL");
  const [selected, setSelected] = useState<Measurement | null>(null);

  useEffect(() => {
    fetch("/api/v1/measurements")
      .then((res) => res.json())
      .then((data) => {
        setMeasurements(data.items || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load measurements", err);
        setLoading(false);
      });
  }, []);

  const filtered = measurements.filter((m) => {
    const matchesLevel = levelFilter === "ALL" || m.level === levelFilter;
    const matchesSearch =
      m.measurement_id.toLowerCase().includes(search.toLowerCase()) ||
      m.domain.toLowerCase().includes(search.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {isAz
                ? `Ölçmə Reyestri (${measurements.length} Spesifikasiya)`
                : `Measurement Registry (${measurements.length} Specifications)`}
            </h2>
            <p className="text-sm text-slate-600">
              {isAz
                ? "I, II və III Tirlər üzrə formal neyrokoqnitiv ölçmə tapşırığı spesifikasiyaları."
                : "Formal neurocognitive measurement task specifications across Tier I, II, and III."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-200">
              {isAz ? "Səviyyə I: Əsas Koqnitiv" : "Level I: Core Cognitive"}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 rounded-md border border-amber-200">
              {isAz ? "Səviyyə II: Tənzimləyici" : "Level II: Regulatory"}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 bg-purple-50 text-purple-700 rounded-md border border-purple-200">
              {isAz ? "Səviyyə III: Yüksək Səviyyəli" : "Level III: Higher-Order"}
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              id="measurement-search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                isAz
                  ? "ID (məs. C01-01) və ya Domen adına görə axtarın..."
                  : "Search by ID (e.g. C01-01) or Domain name..."
              }
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <Filter className="h-4 w-4 text-slate-400 mr-1" />
            {["ALL", "I", "II", "III"].map((lvl) => (
              <button
                key={lvl}
                id={`filter-level-${lvl}`}
                onClick={() => setLevelFilter(lvl)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  levelFilter === lvl
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {lvl === "ALL" ? (isAz ? "Bütün Səviyyələr" : "All Levels") : `${isAz ? "Səviyyə" : "Level"} ${lvl}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table & Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto max-h-[560px]">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 text-[11px] uppercase tracking-wider border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 font-semibold">ID</th>
                  <th className="px-3 py-3 font-semibold">{isAz ? "Səviyyə" : "Level"}</th>
                  <th className="px-4 py-3 font-semibold">{isAz ? "Domen" : "Domain"}</th>
                  <th className="px-3 py-3 font-semibold">{isAz ? "Status" : "Status"}</th>
                  <th className="px-3 py-3 font-semibold">{isAz ? "Yetkinlik" : "Maturity"}</th>
                  <th className="px-3 py-3 font-semibold text-right">{isAz ? "Əməliyyat" : "Action"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500 font-sans">
                      {isAz ? "Ölçmə reyestri yüklənir..." : "Loading measurement registry..."}
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500 font-sans">
                      {isAz ? "Kriteriyalara uyğun ölçmə tapılmadı." : "No measurements matching criteria."}
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr
                      key={item.measurement_id}
                      onClick={() => setSelected(item)}
                      className={`hover:bg-blue-50/50 cursor-pointer transition-colors ${
                        selected?.measurement_id === item.measurement_id ? "bg-blue-50" : ""
                      }`}
                    >
                      <td className="px-4 py-2.5 font-bold text-slate-900">{item.measurement_id}</td>
                      <td className="px-3 py-2.5">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            item.level === "I"
                              ? "bg-blue-100 text-blue-800"
                              : item.level === "II"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          Level {item.level}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 font-sans text-slate-800">{item.domain}</td>
                      <td className="px-3 py-2.5">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px]">
                          {item.scientific_status}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-sans">
                          {item.implementation_maturity}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-right font-sans">
                        <div className="flex items-center justify-end gap-2">
                          {onLaunchTest && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onLaunchTest(item.measurement_id);
                              }}
                              title={isAz ? "Bu koqnitiv testi iştirakçı kimi keçin" : "Take this cognitive test as a participant"}
                              className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors"
                            >
                              <Play className="h-3 w-3" />
                              {isAz ? "Test" : "Test"}
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelected(item);
                            }}
                            className="text-blue-600 hover:text-blue-800 text-[11px] font-medium"
                          >
                            {isAz ? "Bax" : "View"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
            <span>
              {isAz
                ? `${measurements.length} spesifikasiyadan ${filtered.length} göstərilir`
                : `Showing ${filtered.length} of ${measurements.length} specifications`}
            </span>
            <span>
              {isAz
                ? "Tam müqaviləyə baxmaq üçün istənilən sətrə klikləyin"
                : "Click any row to inspect full contract"}
            </span>
          </div>
        </div>

        {/* Detail Panel */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-600" />
            {isAz ? "Spesifikasiya Təfərrüatları" : "Specification Detail"}
          </h3>

          {selected ? (
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <div className="text-[11px] font-bold text-slate-400 font-mono">
                  {isAz ? "ÖLÇMƏ ID-Sİ" : "MEASUREMENT ID"}
                </div>
                <div className="text-base font-bold text-slate-900 font-mono">{selected.measurement_id}</div>
                <div className="text-xs text-slate-600 font-sans">{selected.domain}</div>
              </div>

              {onLaunchTest && (
                <button
                  onClick={() => onLaunchTest(selected.measurement_id)}
                  className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <Play className="h-3.5 w-3.5" />
                  {isAz
                    ? `${selected.measurement_id} üçün Canlı Test Keç`
                    : `Take Live Test for ${selected.measurement_id}`}
                </button>
              )}

              <div className="space-y-2 font-mono">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-sans">{isAz ? "Səviyyə:" : "Level:"}</span>
                  <span className="font-semibold text-slate-800">{isAz ? `Tir ${selected.level}` : `Tier ${selected.level}`}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-sans">{isAz ? "Domen ID-si:" : "Domain ID:"}</span>
                  <span className="text-slate-800">{selected.domain_id}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-sans">{isAz ? "Elmi Status:" : "Scientific Status:"}</span>
                  <span className="text-slate-800">{selected.scientific_status}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-sans">{isAz ? "Tapşırıq Ailəsi:" : "Task Family:"}</span>
                  <span className="text-slate-800">{selected.task_family}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-sans">{isAz ? "Əsas Nəticə:" : "Primary Outcome:"}</span>
                  <span className="text-slate-800">{selected.primary_outcome}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-sans">{isAz ? "Tələb Olunan Modallıqlar:" : "Required Modalities:"}</span>
                  <span className="text-slate-800">{selected.required_modalities.join(", ")}</span>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-blue-900 text-xs font-sans">
                <strong>{isAz ? "Məlumat Müqaviləsi Qeydi:" : "Data Contract Note:"}</strong>{" "}
                {isAz
                  ? "Hər bir ölçmə deterministik sınaq strukturunu, reaksiya gecikməsinin qeydini və kriptoqrafik hadisə ardıcıllığını təmin edir."
                  : "Each measurement enforces deterministic trial structure, response latency recording, and cryptographic event sequencing."}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs italic">
              {isAz
                ? "Əməliyyat parametrləri və modallıqlarına baxmaq üçün cədvəldən hər hansı bir ölçmə seçin."
                : "Select any measurement from the table to view its operational parameters and modalities."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

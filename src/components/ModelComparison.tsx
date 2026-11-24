import { useState } from "react";
import { m } from "framer-motion";
import { Layers, RefreshCw, CheckCircle2, XCircle } from "lucide-react";
import { comparisonData, modelNotes } from "../data/comparisonData";
import { WaterfallVisualization } from "./comparison/WaterfallVisualization";
import { AgileVisualization } from "./comparison/AgileVisualization";
import { ModelMatcher } from "./comparison/ModelMatcher";

export default function ModelComparison() {
  const [activeModel, setActiveModel] = useState<"waterfall" | "agile">("waterfall");

  return (
    <section id="comparison" className="py-14 sm:py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <m.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-8 sm:mb-12"
        >
          <span className="inline-block text-[10px] font-black tracking-widest uppercase text-brand-dark bg-brand-yellow px-3 py-1 rounded-lg border-2 border-brand-dark mb-3">
            Komparasi Model SDLC
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-tight">
            Waterfall vs. Agile Scrum
          </h2>
          <p className="text-slate-500 max-w-md text-sm mt-2">
            Pahami kapan waktu yang pas untuk merekomendasikan masing-masing model kepada klien, atau gunakan Model Matcher untuk rekomendasi cepat.
          </p>
        </m.div>

        {/* Visualizations + Matcher: stack on mobile, side-by-side on lg */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8 sm:mb-10">
          {/* Visualizations col */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Waterfall card */}
            <m.button
              type="button"
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              onClick={() => setActiveModel("waterfall")}
              aria-label="Tampilkan penjelasan model Waterfall"
              aria-pressed={activeModel === "waterfall"}
              className={`w-full flex flex-col text-left rounded-2xl border-2 cursor-pointer transition-all duration-150 overflow-hidden
                ${
                  activeModel === "waterfall"
                    ? "border-blue-900 shadow-neo-blue"
                    : "border-slate-200 hover:border-slate-900 hover:shadow-neo-sm"
                }`}
            >
              <div
                className={`px-4 py-3 flex items-center gap-2 border-b-2 ${
                  activeModel === "waterfall"
                    ? "bg-blue-900 border-blue-900"
                    : "bg-slate-800 border-slate-800"
                }`}
              >
                <Layers className="w-4 h-4 text-white" aria-hidden="true" />
                <p className="font-black text-sm text-white">Waterfall</p>
                {activeModel === "waterfall" && (
                  <span className="ml-auto text-[10px] font-black bg-brand-yellow text-brand-dark px-2 py-0.5 rounded-md">
                    AKTIF
                  </span>
                )}
              </div>
              <div className="bg-white">
                <WaterfallVisualization />
              </div>
            </m.button>

            {/* Agile card */}
            <m.button
              type="button"
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              onClick={() => setActiveModel("agile")}
              aria-label="Tampilkan penjelasan model Agile Scrum"
              aria-pressed={activeModel === "agile"}
              className={`w-full flex flex-col text-left rounded-2xl border-2 cursor-pointer transition-all duration-150 overflow-hidden
                ${
                  activeModel === "agile"
                    ? "border-indigo-900 shadow-neo-blue"
                    : "border-slate-200 hover:border-slate-900 hover:shadow-neo-sm"
                }`}
            >
              <div
                className={`px-4 py-3 flex items-center gap-2 border-b-2 ${
                  activeModel === "agile"
                    ? "bg-indigo-900 border-indigo-900"
                    : "bg-slate-800 border-slate-800"
                }`}
              >
                <RefreshCw className="w-4 h-4 text-white" aria-hidden="true" />
                <p className="font-black text-sm text-white">Agile Scrum</p>
                {activeModel === "agile" && (
                  <span className="ml-auto text-[10px] font-black bg-brand-yellow text-brand-dark px-2 py-0.5 rounded-md">
                    AKTIF
                  </span>
                )}
              </div>
              <div className="bg-white">
                <AgileVisualization />
              </div>
            </m.button>
          </div>

          {/* Model Matcher col */}
          <div className="lg:col-span-2">
            <ModelMatcher />
          </div>
        </div>

        {/* Model notes: makes card selection meaningful */}
        <m.div
          key={activeModel}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="mb-6 sm:mb-8 rounded-2xl border-2 border-slate-900 bg-brand-yellow/10 p-4 sm:p-5"
        >
          <p className="text-[11px] font-black uppercase tracking-widest text-slate-700 mb-1">
            Catatan model aktif: {activeModel === "waterfall" ? "Waterfall" : "Agile Scrum"}
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">{modelNotes[activeModel]}</p>
        </m.div>

        {/* Comparison table: horizontal scroll on mobile */}
        <m.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border-2 border-slate-900 shadow-neo overflow-hidden"
        >
          <div className="overflow-x-auto">
            <div className="min-w-[560px]">
              <div className="bg-brand-dark text-white grid grid-cols-3 text-xs font-black border-b-2 border-slate-700">
                <div className="px-4 py-3 sm:px-5 sm:py-4 uppercase tracking-wider">Kriteria</div>
                <div className="px-4 py-3 sm:px-5 sm:py-4 text-blue-300 uppercase tracking-wider">
                  Waterfall
                </div>
                <div className="px-4 py-3 sm:px-5 sm:py-4 text-indigo-300 uppercase tracking-wider">
                  Agile Scrum
                </div>
              </div>
              {comparisonData.map((row, i) => {
                const RowIcon = row.icon;
                return (
                  <m.div
                    key={row.criterion}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    className={`grid grid-cols-3 text-sm border-t border-slate-100 ${
                      i % 2 === 0 ? "bg-white" : "bg-slate-50"
                    }`}
                  >
                    <div className="px-4 py-3 sm:px-5 sm:py-3.5 font-bold text-slate-800 flex items-center gap-2 text-xs">
                      <RowIcon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" aria-hidden="true" />
                      {row.criterion}
                    </div>
                    <div className="px-4 py-3 sm:px-5 sm:py-3.5 text-slate-600 flex items-start gap-2 text-xs">
                      {row.waterfall.positive ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      )}
                      {row.waterfall.text}
                    </div>
                    <div className="px-4 py-3 sm:px-5 sm:py-3.5 text-slate-600 flex items-start gap-2 text-xs">
                      {row.agile.positive ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      )}
                      {row.agile.text}
                    </div>
                  </m.div>
                );
              })}
            </div>
          </div>
        </m.div>
      </div>
    </section>
  );
}

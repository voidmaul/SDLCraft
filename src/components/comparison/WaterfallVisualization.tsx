import { m } from "framer-motion";
import { ArrowDown, Shield } from "lucide-react";
import { waterfallPhases } from "../../data/comparisonData";

export function WaterfallVisualization() {
  return (
    <div className="p-5 space-y-2">
      <p className="text-[11px] text-center text-slate-600 mb-3 font-black uppercase tracking-widest">
        Aliran Linear Berurutan tanpa bisa melompat mundur sebelum selesai
      </p>
      {waterfallPhases.map((phase, i) => (
        <m.div
          key={phase.name}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1, duration: 0.3 }}
          className="flex items-center gap-2"
        >
          <div
            className={`h-9 ${phase.color} border-2 rounded-lg flex items-center px-4 text-white text-xs font-black shadow-neo-sm flex-1`}
          >
            {phase.name}
          </div>
          {i < waterfallPhases.length - 1 && (
            <ArrowDown className="text-slate-400 flex-shrink-0 w-4 h-4" aria-hidden="true" />
          )}
        </m.div>
      ))}
      <div className="mt-3 flex items-center gap-2 text-xs text-slate-600 bg-slate-50 rounded-xl p-3 border-2 border-slate-200">
        <Shield className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" aria-hidden="true" />
        Tiap fase wajib selesai & sign-off sebelum fase berikutnya
      </div>
    </div>
  );
}

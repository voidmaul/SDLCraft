import { motion } from "framer-motion";
import { RotateCcw, Zap } from "lucide-react";
import { agileSprintCycle } from "../../data/comparisonData";

const AGILE_CX = 150;
const AGILE_CY = 150;
const AGILE_R = 95;

export function AgileVisualization() {
  return (
    <div className="p-4" aria-label="Visualisasi Model Agile Scrum">
      <p className="text-[10px] text-center text-slate-500 mb-3 font-black uppercase tracking-widest">
        Siklus Sprint Berkala yang terus berulang hingga kebutuhan terpenuhi
      </p>

      <svg
        viewBox="0 0 300 300"
        className="w-full max-w-[260px] mx-auto block"
        style={{ overflow: "visible" }}
        role="img"
        aria-label="Diagram siklus sprint berputar yang mencakup Planning, Daily Scrum, Review, Retrospective, Refinement, dan Execution"
      >
        <title>Siklus Sprint Agile Scrum</title>
        {/* Dashed orbit ring */}
        <motion.circle
          cx={AGILE_CX}
          cy={AGILE_CY}
          r={AGILE_R}
          fill="none"
          stroke="#818cf8"
          strokeWidth="2"
          strokeDasharray="6 4"
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          style={{ originX: "150px", originY: "150px" }}
        />

        {/* Centre hub background circle */}
        <circle cx={AGILE_CX} cy={AGILE_CY} r={30} fill="#eef2ff" stroke="#1e1b4b" strokeWidth="2" />

        {/* Orbit node pills via foreignObject */}
        {agileSprintCycle.map((item, i) => {
          const angle = (i * 60 - 90) * (Math.PI / 180);
          const nx = AGILE_CX + AGILE_R * Math.cos(angle);
          const ny = AGILE_CY + AGILE_R * Math.sin(angle);
          const pw = 56;
          const ph = 34;
          return (
            <foreignObject
              key={item.name}
              x={nx - pw / 2}
              y={ny - ph / 2}
              width={pw}
              height={ph}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.12, type: "spring" }}
                whileHover={{ scale: 1.1 }}
                className={`${item.color} text-white rounded-lg w-full h-full flex flex-col items-center justify-center border-2 shadow-neo-sm cursor-default`}
              >
                {item.name.split("\n").map((ln, li) => (
                  <p key={li} className="text-[8px] font-black leading-tight whitespace-nowrap">
                    {ln}
                  </p>
                ))}
              </motion.div>
            </foreignObject>
          );
        })}

        {/* Centre hub icon + label */}
        <foreignObject x={AGILE_CX - 28} y={AGILE_CY - 28} width={56} height={56}>
          <div className="w-full h-full rounded-full bg-indigo-50 border-2 border-indigo-900 flex flex-col items-center justify-center shadow-neo-sm">
            <RotateCcw className="w-3.5 h-3.5 text-indigo-600" aria-hidden="true" />
            <span className="text-[8px] text-indigo-700 font-black mt-0.5">Sprint</span>
          </div>
        </foreignObject>
      </svg>

      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 bg-slate-50 rounded-xl p-3 border-2 border-slate-200">
        <Zap className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" aria-hidden="true" />
        Setiap sprint dua sampai empat minggu menghasilkan fitur siap pakai yang dapat langsung diuji coba
      </div>
    </div>
  );
}

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowDown,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Layers,
  RotateCcw,
  Users,
  Clock,
  FileText,
  Zap,
  Shield,
  TrendingUp,
  HelpCircle,
  ChevronRight,
} from "lucide-react";

const waterfallPhases = [
  { name: "Planning", color: "bg-violet-600 border-violet-900" },
  { name: "Analysis", color: "bg-sky-600 border-sky-900" },
  { name: "Design", color: "bg-cyan-600 border-cyan-900" },
  { name: "Development", color: "bg-emerald-600 border-emerald-900" },
  { name: "Testing", color: "bg-amber-500 border-amber-900" },
  { name: "Deployment", color: "bg-orange-500 border-orange-900" },
  { name: "Maintenance", color: "bg-rose-600 border-rose-900" },
];

const agileSprintCycle = [
  { name: "Sprint\nPlanning", color: "bg-indigo-600 border-indigo-900", angle: 0 },
  { name: "Daily\nScrum", color: "bg-blue-600 border-blue-900", angle: 60 },
  { name: "Sprint\nReview", color: "bg-cyan-600 border-cyan-900", angle: 120 },
  { name: "Retro-\nspective", color: "bg-teal-600 border-teal-900", angle: 180 },
  { name: "Backlog\nRefine", color: "bg-green-600 border-green-900", angle: 240 },
  { name: "Sprint\nExecute", color: "bg-emerald-600 border-emerald-900", angle: 300 },
];

interface ComparisonRow {
  criterion: string;
  icon: React.ElementType;
  waterfall: { text: string; positive: boolean };
  agile: { text: string; positive: boolean };
}

const comparisonData: ComparisonRow[] = [
  {
    criterion: "Fleksibilitas Perubahan",
    icon: RefreshCw,
    waterfall: { text: "Sangat terbatas; perubahan mahal di fase lanjut", positive: false },
    agile: { text: "Tinggi; perubahan diakomodasi setiap sprint", positive: true },
  },
  {
    criterion: "Kejelasan Kebutuhan Awal",
    icon: FileText,
    waterfall: { text: "Harus lengkap & final; ideal untuk sistem stabil", positive: true },
    agile: { text: "Bisa berkembang; cocok saat kebutuhan belum jelas", positive: true },
  },
  {
    criterion: "Keterlibatan Klien",
    icon: Users,
    waterfall: { text: "Minim selama development; banyak di awal & akhir", positive: false },
    agile: { text: "Aktif setiap sprint review; feedback berkelanjutan", positive: true },
  },
  {
    criterion: "Waktu ke Produk Pertama",
    icon: Clock,
    waterfall: { text: "Lama; produk baru tersedia di akhir proyek", positive: false },
    agile: { text: "Cepat; increment fungsional tiap 2–4 minggu", positive: true },
  },
  {
    criterion: "Dokumentasi",
    icon: Layers,
    waterfall: { text: "Sangat lengkap & terstruktur; ideal untuk audit", positive: true },
    agile: { text: "Lebih minimal; fokus pada working software", positive: false },
  },
  {
    criterion: "Prediktabilitas Biaya",
    icon: TrendingUp,
    waterfall: { text: "Tinggi; scope, biaya, waktu terdefinisi di awal", positive: true },
    agile: { text: "Lebih sulit diprediksi; scope bisa berubah", positive: false },
  },
  {
    criterion: "Risiko Teknis",
    icon: Shield,
    waterfall: { text: "Tinggi; masalah baru terdeteksi di testing akhir", positive: false },
    agile: { text: "Rendah; risiko dideteksi lebih awal per sprint", positive: true },
  },
  {
    criterion: "Ukuran & Kompleksitas Tim",
    icon: Zap,
    waterfall: { text: "Cocok untuk tim besar dengan peran spesialis jelas", positive: true },
    agile: { text: "Optimal untuk tim kecil self-organizing (5–9 orang)", positive: true },
  },
];

// ─── Model Matcher ─────────────────────────────────────────────────────────

interface MatcherQuestion {
  id: string;
  question: string;
  options: { label: string; value: "waterfall" | "agile" | "both" }[];
}

const matcherQuestions: MatcherQuestion[] = [
  {
    id: "requirements",
    question: "Seberapa jelas & stabil kebutuhan proyek?",
    options: [
      { label: "Sangat jelas & tidak akan berubah", value: "waterfall" },
      { label: "Masih berkembang & berpotensi berubah", value: "agile" },
    ],
  },
  {
    id: "timeline",
    question: "Apakah klien butuh demo/prototype cepat?",
    options: [
      { label: "Ya, perlu hasil nyata dalam 1–2 bulan", value: "agile" },
      { label: "Tidak, klien bisa menunggu produk final", value: "waterfall" },
    ],
  },
  {
    id: "client",
    question: "Seberapa aktif klien bisa terlibat?",
    options: [
      { label: "Aktif, siap review setiap sprint", value: "agile" },
      { label: "Minim, hanya di awal dan akhir proyek", value: "waterfall" },
    ],
  },
  {
    id: "compliance",
    question: "Apakah ada regulasi ketat yang menuntut dokumentasi lengkap?",
    options: [
      { label: "Ya (misalnya: sistem keuangan, pemerintahan)", value: "waterfall" },
      { label: "Tidak, fleksibilitas lebih diutamakan", value: "agile" },
    ],
  },
  {
    id: "team",
    question: "Bagaimana ukuran & pengalaman tim?",
    options: [
      { label: "Tim kecil (< 10 orang), siap self-organize", value: "agile" },
      { label: "Tim besar dengan peran spesialis tersegmentasi", value: "waterfall" },
    ],
  },
];

function ModelMatcher() {
  const [answers, setAnswers] = useState<Record<string, "waterfall" | "agile" | "both">>({});
  const [showResult, setShowResult] = useState(false);

  const totalQ = matcherQuestions.length;
  const answeredCount = Object.keys(answers).length;

  const handleAnswer = (qId: string, val: "waterfall" | "agile" | "both") => {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const computeResult = (): { model: "waterfall" | "agile"; score: number } => {
    let waterfall = 0;
    let agile = 0;
    Object.values(answers).forEach((v) => {
      if (v === "waterfall") waterfall++;
      if (v === "agile") agile++;
      if (v === "both") { waterfall++; agile++; }
    });
    return waterfall >= agile
      ? { model: "waterfall", score: Math.round((waterfall / totalQ) * 100) }
      : { model: "agile", score: Math.round((agile / totalQ) * 100) };
  };

  const result = showResult && answeredCount === totalQ ? computeResult() : null;

  const handleReset = () => {
    setAnswers({});
    setShowResult(false);
  };

  return (
    <div className="bg-white border-2 border-slate-900 rounded-2xl shadow-neo overflow-hidden">
      {/* Header */}
      <div className="bg-brand-dark px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-brand-yellow" />
          <span className="font-black text-white text-sm">Interactive Model Matcher</span>
        </div>
        <span className="text-xs font-mono text-slate-400">{answeredCount}/{totalQ} dijawab</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-slate-200">
        <motion.div
          className="h-full bg-brand-yellow"
          animate={{ width: `${(answeredCount / totalQ) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Questions */}
      <div className="p-5 space-y-5">
        {matcherQuestions.map((q, qi) => (
          <div key={q.id}>
            <p className="text-sm font-bold text-slate-800 mb-2.5">
              <span className="text-brand-yellow font-black mr-1">{qi + 1}.</span>
              {q.question}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {q.options.map((opt) => {
                const isSelected = answers[q.id] === opt.value;
                return (
                  <motion.button
                    key={opt.label}
                    whileHover={{ y: -1 }}
                    whileTap={{ y: 1 }}
                    onClick={() => handleAnswer(q.id, opt.value)}
                    className={`text-left px-3 py-2.5 rounded-xl border-2 text-xs font-semibold transition-all
                      ${isSelected
                        ? "border-brand-dark bg-brand-yellow text-brand-dark shadow-neo-sm"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-900 hover:shadow-neo-sm"
                      }`}
                  >
                    <ChevronRight className={`inline w-3 h-3 mr-1 ${isSelected ? "text-brand-dark" : "text-slate-400"}`} />
                    {opt.label}
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Action / Result */}
      <div className="px-5 pb-5">
        {!showResult ? (
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ y: 1 }}
            disabled={answeredCount < totalQ}
            onClick={() => setShowResult(true)}
            className={`w-full py-3 rounded-xl border-2 font-black text-sm transition-all
              ${answeredCount === totalQ
                ? "bg-brand-dark text-brand-yellow border-brand-dark hover:shadow-neo-yellow cursor-pointer"
                : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
              }`}
          >
            Lihat Rekomendasi Model →
          </motion.button>
        ) : result ? (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`rounded-xl border-2 p-4 ${
                result.model === "waterfall"
                  ? "bg-blue-50 border-blue-900"
                  : "bg-indigo-50 border-indigo-900"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                {result.model === "waterfall" ? (
                  <Layers className="w-6 h-6 text-blue-700" />
                ) : (
                  <RefreshCw className="w-6 h-6 text-indigo-700" />
                )}
                <div>
                  <p className={`font-black text-base ${result.model === "waterfall" ? "text-blue-800" : "text-indigo-800"}`}>
                    Rekomendasi: {result.model === "waterfall" ? "Waterfall Model" : "Agile Scrum"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {result.score}% karakteristik proyek cocok dengan model ini
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {result.model === "waterfall"
                  ? "Proyek kamu memiliki kebutuhan yang stabil dengan proses formal. Waterfall memberikan dokumentasi lengkap dan prediktabilitas scope/biaya yang dibutuhkan."
                  : "Proyek kamu butuh adaptabilitas tinggi. Agile Scrum dengan sprint pendek memungkinkan perubahan cepat dan delivery incremental."}
              </p>
              <button
                onClick={handleReset}
                className="mt-3 flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Ulangi Matcher
              </button>
            </motion.div>
          </AnimatePresence>
        ) : null}
      </div>
    </div>
  );
}

function WaterfallVisualization() {
  return (
    <div className="p-5 space-y-2">
      <p className="text-[10px] text-center text-slate-500 mb-3 font-black uppercase tracking-widest">
        Aliran Linear Berurutan — Tidak Dapat Mundur Tanpa Revisi
      </p>
      {waterfallPhases.map((phase, i) => (
        <motion.div
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
            <ArrowDown className="text-slate-400 flex-shrink-0 w-4 h-4" />
          )}
        </motion.div>
      ))}
      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 bg-slate-50 rounded-xl p-3 border-2 border-slate-200">
        <Shield className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
        Tiap fase wajib selesai & sign-off sebelum fase berikutnya
      </div>
    </div>
  );
}

// SVG viewBox coords: 300×300, centre (150,150), orbit radius 95
const AGILE_CX = 150;
const AGILE_CY = 150;
const AGILE_R  = 95;

function AgileVisualization() {
  return (
    <div className="p-4">
      <p className="text-[10px] text-center text-slate-500 mb-3 font-black uppercase tracking-widest">
        Siklus Sprint Iteratif — Terus Berulang Hingga Backlog Habis
      </p>

      {/*
        SVG with viewBox="0 0 300 300" scales to 100% of its container
        and always keeps everything centred — no px arithmetic needed.
      */}
      <svg
        viewBox="0 0 300 300"
        className="w-full max-w-[260px] mx-auto block"
        style={{ overflow: "visible" }}
      >
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

        {/* Orbit node pills via foreignObject so we keep Tailwind classes */}
        {agileSprintCycle.map((item, i) => {
          const angle = (i * 60 - 90) * (Math.PI / 180);
          const nx = AGILE_CX + AGILE_R * Math.cos(angle);
          const ny = AGILE_CY + AGILE_R * Math.sin(angle);
          // pill size in SVG units: width 52, height 32, centred on (nx, ny)
          const pw = 52;
          const ph = 32;
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
                  <p key={li} className="text-[7px] font-black leading-tight whitespace-nowrap">{ln}</p>
                ))}
              </motion.div>
            </foreignObject>
          );
        })}

        {/* Centre hub icon + label — rendered on top via foreignObject */}
        <foreignObject x={AGILE_CX - 28} y={AGILE_CY - 28} width={56} height={56}>
          <div className="w-full h-full rounded-full bg-indigo-50 border-2 border-indigo-900 flex flex-col items-center justify-center shadow-neo-sm">
            <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-[7px] text-indigo-700 font-black mt-0.5">Sprint</span>
          </div>
        </foreignObject>
      </svg>

      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 bg-slate-50 rounded-xl p-3 border-2 border-slate-200">
        <Zap className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
        Tiap sprint (2–4 minggu) hasilkan increment fungsional yang bisa di-review klien
      </div>
    </div>
  );
}

export default function ModelComparison() {
  const [activeModel, setActiveModel] = useState<"waterfall" | "agile">("waterfall");

  return (
    <section id="comparison" className="py-14 sm:py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
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
            Pahami kapan harus merekomendasikan masing-masing model kepada klien — gunakan Model Matcher untuk mendapat rekomendasi instan.
          </p>
        </motion.div>

        {/* Visualizations + Matcher — stack on mobile, side-by-side on lg */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8 sm:mb-10">
          {/* Visualizations col */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Waterfall card */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              onClick={() => setActiveModel("waterfall")}
              className={`rounded-2xl border-2 cursor-pointer transition-all duration-150 overflow-hidden
                ${activeModel === "waterfall" ? "border-blue-900 shadow-neo-blue" : "border-slate-200 hover:border-slate-900 hover:shadow-neo-sm"}`}
            >
              <div className={`px-4 py-3 flex items-center gap-2 border-b-2 ${activeModel === "waterfall" ? "bg-blue-900 border-blue-900" : "bg-slate-800 border-slate-800"}`}>
                <Layers className="w-4 h-4 text-white" />
                <p className="font-black text-sm text-white">Waterfall</p>
                {activeModel === "waterfall" && (
                  <span className="ml-auto text-[10px] font-black bg-brand-yellow text-brand-dark px-2 py-0.5 rounded-md">AKTIF</span>
                )}
              </div>
              <div className="bg-white"><WaterfallVisualization /></div>
            </motion.div>

            {/* Agile card */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              onClick={() => setActiveModel("agile")}
              className={`rounded-2xl border-2 cursor-pointer transition-all duration-150 overflow-hidden
                ${activeModel === "agile" ? "border-indigo-900 shadow-neo-blue" : "border-slate-200 hover:border-slate-900 hover:shadow-neo-sm"}`}
            >
              <div className={`px-4 py-3 flex items-center gap-2 border-b-2 ${activeModel === "agile" ? "bg-indigo-900 border-indigo-900" : "bg-slate-800 border-slate-800"}`}>
                <RefreshCw className="w-4 h-4 text-white" />
                <p className="font-black text-sm text-white">Agile Scrum</p>
                {activeModel === "agile" && (
                  <span className="ml-auto text-[10px] font-black bg-brand-yellow text-brand-dark px-2 py-0.5 rounded-md">AKTIF</span>
                )}
              </div>
              <div className="bg-white"><AgileVisualization /></div>
            </motion.div>
          </div>

          {/* Model Matcher col */}
          <div className="lg:col-span-2">
            <ModelMatcher />
          </div>
        </div>

        {/* Comparison table — horizontal scroll on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border-2 border-slate-900 shadow-neo overflow-hidden"
        >
          <div className="overflow-x-auto">
            <div className="min-w-[560px]">
              <div className="bg-brand-dark text-white grid grid-cols-3 text-xs font-black border-b-2 border-slate-700">
                <div className="px-4 py-3 sm:px-5 sm:py-4 uppercase tracking-wider">Kriteria</div>
                <div className="px-4 py-3 sm:px-5 sm:py-4 text-blue-300 uppercase tracking-wider">Waterfall</div>
                <div className="px-4 py-3 sm:px-5 sm:py-4 text-indigo-300 uppercase tracking-wider">Agile Scrum</div>
              </div>
              {comparisonData.map((row, i) => {
                const RowIcon = row.icon;
                return (
                  <motion.div
                    key={row.criterion}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    className={`grid grid-cols-3 text-sm border-t border-slate-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50"}`}
                  >
                    <div className="px-4 py-3 sm:px-5 sm:py-3.5 font-bold text-slate-800 flex items-center gap-2 text-xs">
                      <RowIcon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      {row.criterion}
                    </div>
                    <div className="px-4 py-3 sm:px-5 sm:py-3.5 text-slate-600 flex items-start gap-2 text-xs">
                      {row.waterfall.positive ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                      )}
                      {row.waterfall.text}
                    </div>
                    <div className="px-4 py-3 sm:px-5 sm:py-3.5 text-slate-600 flex items-start gap-2 text-xs">
                      {row.agile.positive ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                      )}
                      {row.agile.text}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

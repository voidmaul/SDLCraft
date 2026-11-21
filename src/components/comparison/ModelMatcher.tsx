import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  ChevronRight,
  Layers,
  RefreshCw,
  RotateCcw,
} from "lucide-react";
import { matcherQuestions, calculateModelScore } from "../../data/comparisonData";

export function ModelMatcher() {
  const [answers, setAnswers] = useState<Record<string, "waterfall" | "agile" | "both">>({});
  const [showResult, setShowResult] = useState(false);

  const totalQ = matcherQuestions.length;
  const answeredCount = Object.keys(answers).length;

  const handleAnswer = (qId: string, val: "waterfall" | "agile" | "both") => {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const result = showResult && answeredCount === totalQ ? calculateModelScore(answers, totalQ) : null;

  const handleReset = () => {
    setAnswers({});
    setShowResult(false);
  };

  return (
    <div className="bg-white border-2 border-slate-900 rounded-2xl shadow-neo overflow-hidden">
      {/* Header */}
      <div className="bg-brand-dark px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-brand-yellow" aria-hidden="true" />
          <span className="font-black text-white text-sm">Interactive Model Matcher</span>
        </div>
        <span className="text-xs font-mono text-slate-400">
          {answeredCount}/{totalQ} dijawab
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-slate-200" role="progressbar" aria-valuenow={answeredCount} aria-valuemin={0} aria-valuemax={totalQ}>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" role="group" aria-label={q.question}>
              {q.options.map((opt) => {
                const isSelected = answers[q.id] === opt.value;
                return (
                  <motion.button
                    key={opt.label}
                    whileHover={{ y: -1 }}
                    whileTap={{ y: 1 }}
                    onClick={() => handleAnswer(q.id, opt.value)}
                    aria-pressed={isSelected}
                    className={`text-left px-3 py-2.5 rounded-xl border-2 text-xs font-semibold transition-all
                      ${
                        isSelected
                          ? "border-brand-dark bg-brand-yellow text-brand-dark shadow-neo-sm"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-900 hover:shadow-neo-sm"
                      }`}
                  >
                    <ChevronRight
                      className={`inline w-3 h-3 mr-1 ${
                        isSelected ? "text-brand-dark" : "text-slate-400"
                      }`}
                      aria-hidden="true"
                    />
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
              ${
                answeredCount === totalQ
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
                  <Layers className="w-6 h-6 text-blue-700" aria-hidden="true" />
                ) : (
                  <RefreshCw className="w-6 h-6 text-indigo-700" aria-hidden="true" />
                )}
                <div>
                  <p
                    className={`font-black text-base ${
                      result.model === "waterfall" ? "text-blue-800" : "text-indigo-800"
                    }`}
                  >
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
                <RotateCcw className="w-3 h-3" aria-hidden="true" /> Ulangi Matcher
              </button>
            </motion.div>
          </AnimatePresence>
        ) : null}
      </div>
    </div>
  );
}

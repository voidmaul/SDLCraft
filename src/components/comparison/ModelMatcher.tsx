import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  ChevronRight,
  Layers,
  RefreshCw,
  RotateCcw,
} from "lucide-react";
import { matcherQuestions, calculateModelScore } from "../../data/comparisonData";

export function ModelMatcher() {
  const [answers, setAnswers] = useState<Record<string, "waterfall" | "agile">>({});
  const [showResult, setShowResult] = useState(false);

  const totalQ = matcherQuestions.length;
  const answeredCount = matcherQuestions.filter((q) => answers[q.id]).length;

  const handleAnswer = (qId: string, val: "waterfall" | "agile") => {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const result = showResult && answeredCount === totalQ ? calculateModelScore(answers) : null;

  const handleReset = () => {
    setAnswers({});
    setShowResult(false);
  };

  const confidence = result
    ? result.margin >= 0.4
      ? "Tinggi"
      : result.margin >= 0.2
        ? "Sedang"
        : "Rendah"
    : "Rendah";

  return (
    <div className="bg-white border-2 border-slate-900 rounded-2xl shadow-neo overflow-hidden">
      {/* Header */}
      <div className="bg-brand-dark px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-brand-yellow" aria-hidden="true" />
          <span className="font-black text-white text-sm">Interactive Model Matcher</span>
        </div>
        <span className="text-xs font-mono text-slate-300">
          {answeredCount}/{totalQ} dijawab
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-slate-200" role="progressbar" aria-valuenow={answeredCount} aria-valuemin={0} aria-valuemax={totalQ}>
        <m.div
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
                  <m.button
                    key={opt.label}
                    type="button"
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
                        isSelected ? "text-brand-dark" : "text-slate-500"
                      }`}
                      aria-hidden="true"
                    />
                    {opt.label}
                  </m.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Action / Result */}
      <div className="px-5 pb-5">
        {!showResult ? (
          <m.button
            type="button"
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
          </m.button>
        ) : result ? (
          <AnimatePresence>
            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`rounded-xl border-2 p-4 ${
                result.model === "waterfall"
                  ? "bg-blue-50 border-blue-900"
                  : result.model === "agile"
                    ? "bg-indigo-50 border-indigo-900"
                    : "bg-slate-50 border-slate-900"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                {result.model === "waterfall" ? (
                  <Layers className="w-6 h-6 text-blue-700" aria-hidden="true" />
                ) : result.model === "agile" ? (
                  <RefreshCw className="w-6 h-6 text-indigo-700" aria-hidden="true" />
                ) : (
                  <HelpCircle className="w-6 h-6 text-slate-700" aria-hidden="true" />
                )}
                <div>
                  <p
                    className={`font-black text-base ${
                      result.model === "waterfall"
                        ? "text-blue-800"
                        : result.model === "agile"
                          ? "text-indigo-800"
                          : "text-slate-800"
                    }`}
                  >
                    Rekomendasi:{" "}
                    {result.model === "waterfall"
                      ? "Waterfall Model"
                      : result.model === "agile"
                        ? "Agile Scrum"
                        : "Pendekatan Hybrid"}
                  </p>
                  <p className="text-xs text-slate-600">
                    {result.score}% bobot kriteria mendukung model ini
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {result.model === "waterfall"
                  ? "Profil proyekmu memiliki kebutuhan yang stabil dengan proses formal. Waterfall memberikan dokumentasi lengkap dan prediktabilitas scope/biaya yang dibutuhkan."
                  : result.model === "agile"
                    ? "Profil proyekmu butuh adaptabilitas tinggi. Agile Scrum dengan sprint 2–4 minggu memungkinkan perubahan cepat dan delivery incremental."
                    : "Profil campuran — pertimbangkan pendekatan hybrid atau diskusi dengan stakeholder untuk memilih model per komponen proyek."}
              </p>

              {result.model === "agile" && (
                <p className="mt-2 text-[11px] text-indigo-800 bg-indigo-100/70 border border-indigo-300 rounded-lg px-2.5 py-2 leading-relaxed">
                  Catatan DoD: pastikan Definition of Done memuat dokumentasi dan review kepatuhan agar kebutuhan audit tetap terpenuhi.
                </p>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-bold text-slate-600">
                <span>Keyakinan: {confidence}</span>
                <span aria-hidden="true">·</span>
                <span>Margin bobot: {Math.round(result.margin * 100)}%</span>
                {result.margin < 0.2 && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>Selisih &lt; 20% → hybrid</span>
                  </>
                )}
              </div>

              <div className="mt-3 border-t-2 border-slate-200 pt-3">
                <p className="text-[11px] font-black uppercase tracking-wider text-slate-600 mb-2">
                  Kontribusi kriteria
                </p>
                <ul className="space-y-1.5">
                  {result.contributions.map((item) => (
                    <li key={item.id} className="flex items-start justify-between gap-2 text-[11px]">
                      <span className="text-slate-600 leading-snug">
                        <span className="font-black text-slate-800">{item.label}</span>
                        {" — "}
                        {item.choice}
                      </span>
                      <span
                        className={`flex-shrink-0 font-black px-1.5 py-0.5 rounded border-2 ${
                          item.supports === "waterfall"
                            ? "bg-blue-50 border-blue-900 text-blue-700"
                            : "bg-indigo-50 border-indigo-900 text-indigo-700"
                        }`}
                      >
                        {item.supports === "waterfall" ? "WF" : "AG"} · {item.weight}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-3 text-[11px] text-slate-600 leading-relaxed">
                Ubah jawaban mana pun untuk memperbarui rekomendasi secara langsung.
              </p>

              <button
                type="button"
                onClick={handleReset}
                className="mt-2 flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
              >
                <RotateCcw className="w-3 h-3" aria-hidden="true" /> Ulangi Matcher
              </button>
            </m.div>
          </AnimatePresence>
        ) : null}
      </div>
    </div>
  );
}

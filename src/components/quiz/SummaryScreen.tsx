import { useState, useEffect, useMemo } from "react";
import { m } from "framer-motion";
import {
  Trophy,
  RefreshCw,
  BookOpen,
  Medal,
  Download,
  Loader2,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { generateStoryBadge } from "../../utils/canvasBadge";
import { getScoreBadge, isPassingScore, PASS_SCORE, type AnswerRecord } from "../../utils/scoreBadge";
import { sdlcPhases } from "../../data/sdlcData";

// Confetti di-load secara dinamis hanya saat dibutuhkan (skor lulus),
// sehingga tidak membebani bundle awal.
async function launchConfetti() {
  // Hormati preferensi pengguna yang meminimalkan animasi.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  try {
    const { default: confetti } = await import("canvas-confetti");
    const duration = 3200;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#FFC908", "#0284C7", "#10B981"],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#FFC908", "#F97316", "#10B981"],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  } catch {
    // Gagal memuat modul confetti: selebrasi dilewati tanpa mengganggu UI.
  }
}

interface SummaryScreenProps {
  answers: AnswerRecord[];
  userName: string;
  onReview: () => void;
  onRetry: () => void;
  onFocusPhase?: (phaseId: string) => void;
}

interface PhaseMastery {
  phaseId: string;
  label: string;
  correct: number;
  total: number;
  pct: number;
}

export function SummaryScreen({
  answers,
  userName,
  onReview,
  onRetry,
  onFocusPhase,
}: SummaryScreenProps) {
  const correct = answers.filter((a) => a.isCorrect).length;
  // Hindari division-by-zero jika answers kosong (defensif)
  const score = answers.length > 0 ? Math.round((correct / answers.length) * 100) : 0;
  const badge = getScoreBadge(score);
  const BadgeIcon = badge.icon;
  const passed = isPassingScore(score);
  const [downloading, setDownloading] = useState(false);

  const today = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const mastery = useMemo<PhaseMastery[]>(() => {
    const grouped = new Map<string, { correct: number; total: number }>();
    answers.forEach((ans) => {
      const entry = grouped.get(ans.phaseId) ?? { correct: 0, total: 0 };
      entry.total += 1;
      if (ans.isCorrect) entry.correct += 1;
      grouped.set(ans.phaseId, entry);
    });
    return Array.from(grouped.entries()).map(([phaseId, value]) => {
      const phase = sdlcPhases.find((item) => item.id === phaseId);
      return {
        phaseId,
        label: phase?.name ?? phaseId,
        correct: value.correct,
        total: value.total,
        pct: Math.round((value.correct / value.total) * 100),
      };
    });
  }, [answers]);

  useEffect(() => {
    if (!passed) return;
    const timer = setTimeout(() => void launchConfetti(), 300);
    return () => clearTimeout(timer);
  }, [passed]);

  const handleDownloadBadge = () => {
    setDownloading(true);
    // Allow React to render loading state before synchronous canvas work
    setTimeout(() => {
      generateStoryBadge(userName, score, badge.label, correct, answers.length);
      setDownloading(false);
    }, 60);
  };

  const handleMapClick = (questionId: number) => {
    onReview();
    window.setTimeout(() => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document
        .getElementById(`review-soal-${questionId}`)
        ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }, 80);
  };

  return (
    <m.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
    >
      {/* Score ring */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-36 h-36 mb-4">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="#e2e8f0" strokeWidth="10" />
            <m.circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke={passed ? "#FFC908" : "#F97316"}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 52}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - score / 100) }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <m.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="text-4xl font-black text-slate-900"
            >
              {score}
            </m.span>
            <span className="text-xs text-slate-600 font-bold">/ 100</span>
          </div>
        </div>
        <p className="text-sm text-slate-500">
          <strong className="text-slate-800">{correct}</strong> benar dari {answers.length} soal
        </p>
      </div>

      {/* Badge / Certificate card */}
      <m.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`border-2 ${badge.border} ${badge.bg} rounded-2xl p-5 mb-6 text-center shadow-neo`}
      >
        <div
          className={`w-14 h-14 rounded-2xl ${badge.dark} flex items-center justify-center mx-auto mb-3 shadow-neo-sm border-2 border-brand-dark`}
        >
          <BadgeIcon className="w-7 h-7 text-brand-yellow" />
        </div>

        {/* Lencana label */}
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg ${badge.dark} mb-3`}>
          <Medal className="w-3.5 h-3.5 text-brand-yellow" />
          <span className="text-xs font-black text-brand-yellow uppercase tracking-widest">
            Lencana Kompetensi
          </span>
        </div>

        {/* Title */}
        <h3 className={`text-xl font-black ${badge.color} mb-1`}>{badge.label}</h3>
        <p className="text-sm text-slate-600 mb-4">{badge.subtitle}</p>

        {/* Personalised recipient */}
        <div className="bg-white/70 rounded-xl border-2 border-current/20 px-4 py-3 mb-3 text-left">
          <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest mb-0.5">
            Diberikan kepada
          </p>
          <p className={`text-base font-black ${badge.color} leading-tight`}>{userName}</p>
        </div>

        {/* Score & date row */}
        <div className="flex items-center justify-center gap-3 text-xs text-slate-500 flex-wrap">
          <span className="flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5" /> Skor {score}% &middot; {correct}/{answers.length} Benar
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> {today}
          </span>
        </div>

        {passed ? (
          <p className="text-xs text-emerald-600 font-bold mt-3">🎉 Selamat! Kamu telah lulus!</p>
        ) : score >= 60 ? (
          <p className="text-xs text-amber-700 font-bold mt-3">
            Lencana System Analyst tercapai. Untuk dinyatakan lulus, capai ≥{PASS_SCORE}%.
          </p>
        ) : (
          <p className="text-xs text-slate-600 mt-3">
            Tetap semangat, terus eksplorasi dan coba lagi kapan saja!
          </p>
        )}
      </m.div>

      {/* Penguasaan per fase */}
      <div className="mb-6">
        <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest mb-3">
          Penguasaan per Fase
        </p>
        <div className="space-y-2">
          {mastery.map((item) => {
            const strong = item.pct >= PASS_SCORE;
            const content = (
              <>
                <div className="text-left">
                  <p className="text-sm font-black text-slate-800">{item.label}</p>
                  <p className="text-xs text-slate-600">
                    {item.correct}/{item.total} benar &middot; {item.pct}%
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-black px-2 py-1 rounded-lg border-2 ${
                      strong
                        ? "bg-emerald-50 border-emerald-900 text-emerald-700"
                        : "bg-amber-50 border-amber-900 text-amber-700"
                    }`}
                  >
                    {strong ? "Kuat" : "Perlu penguatan"}
                  </span>
                  {onFocusPhase && (
                    <ChevronRight className="w-4 h-4 text-slate-500" aria-hidden="true" />
                  )}
                </div>
              </>
            );

            return onFocusPhase ? (
              <button
                key={item.phaseId}
                type="button"
                onClick={() => onFocusPhase(item.phaseId)}
                className="w-full flex items-center justify-between gap-3 rounded-xl border-2 border-slate-200 bg-white px-3 py-2.5 hover:border-slate-900 hover:shadow-neo-sm transition-all"
                aria-label={`Lihat materi fase ${item.label}`}
              >
                {content}
              </button>
            ) : (
              <div
                key={item.phaseId}
                className="w-full flex items-center justify-between gap-3 rounded-xl border-2 border-slate-200 bg-white px-3 py-2.5"
              >
                {content}
              </div>
            );
          })}
        </div>
      </div>

      {/* Answer map */}
      <div className="mb-6">
        <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest mb-3">Peta Jawaban</p>
        <div className="grid grid-cols-5 gap-2">
          {answers.map((ans) => (
            <button
              key={ans.questionId}
              type="button"
              onClick={() => handleMapClick(ans.questionId)}
              aria-label={`Soal ${ans.questionId}, ${ans.isCorrect ? "benar" : "salah"}. Lihat pembahasan.`}
              className={`aspect-square rounded-xl flex items-center justify-center text-sm font-black border-2 transition-transform hover:-translate-y-0.5
                ${
                  ans.isCorrect
                    ? "bg-emerald-50 border-emerald-900 text-emerald-700 shadow-neo-green"
                    : "bg-rose-50 border-rose-900 text-rose-700"
                }`}
            >
              {ans.questionId}
            </button>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap justify-center">
        <m.button
          whileHover={{ y: -2 }}
          whileTap={{ y: 1 }}
          onClick={onReview}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 bg-white border-2 border-slate-900 text-slate-800 font-black rounded-xl hover:shadow-neo text-sm transition-all"
        >
          <BookOpen className="w-4 h-4" />
          Review Pembahasan
        </m.button>
        <m.button
          whileHover={{ y: -2 }}
          whileTap={{ y: 1 }}
          onClick={onRetry}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 bg-white border-2 border-slate-900 text-slate-800 font-black rounded-xl hover:shadow-neo text-sm transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Coba Kuis Lagi
        </m.button>
        <m.button
          whileHover={{ y: -2 }}
          whileTap={{ y: 1 }}
          onClick={handleDownloadBadge}
          disabled={downloading}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 bg-brand-yellow border-2 border-brand-dark text-brand-dark font-black rounded-xl hover:shadow-neo text-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {downloading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Membuat Badge…
            </>
          ) : (
            <>
              <Download className="w-4 h-4" /> Unduh Badge IG Story (PNG)
            </>
          )}
        </m.button>
      </div>
    </m.div>
  );
}

import { useState, useEffect, useReducer } from "react";
import { m, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ChevronRight,
  Trophy,
  AlertCircle,
  ArrowRight,
  User,
} from "lucide-react";
import { quizQuestions } from "../data/quizData";
import { useAudio } from "../hooks/useAudio";
import { OptionButton } from "./quiz/OptionButton";
import { FeedbackCard } from "./quiz/FeedbackCard";
import { StreakBanner } from "./quiz/StreakBanner";
import { SummaryScreen } from "./quiz/SummaryScreen";
import { ReviewScreen } from "./quiz/ReviewScreen";
import {
  quizReducer,
  initialQuizState,
  restoreQuizSession,
} from "./quiz/quizReducer";

const SESSION_KEY = "sdlc_quiz_session";
const BEST_SCORE_KEY = "sdlc_best_score";

function loadBestScore(): number | null {
  try {
    const raw = localStorage.getItem(BEST_SCORE_KEY);
    if (raw === null) return null;
    const value = Number(raw);
    return Number.isInteger(value) && value >= 0 && value <= 100 ? value : null;
  } catch {
    return null;
  }
}

export default function QuizSection() {
  const { playPop, playCorrect, playWrong, playStreak } = useAudio();

  // Seluruh state kuis dikelola reducer murni; sesi dipulihkan dari
  // localStorage agar refresh halaman tidak menghilangkan progres.
  const [state, dispatch] = useReducer(quizReducer, null, () => {
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(SESSION_KEY);
    } catch {
      // ignore storage errors
    }
    return restoreQuizSession(raw, quizQuestions) ?? initialQuizState;
  });
  const { quizState, currentIndex, selectedOption, answered, answers, streak } = state;

  const [bestScore, setBestScore] = useState<number | null>(loadBestScore);

  // userName: persisted in localStorage
  const [userName, setUserName] = useState<string>(() => {
    try {
      return localStorage.getItem("sdlc_user_name") ?? "";
    } catch {
      return "";
    }
  });

  const handleUserNameChange = (val: string) => {
    setUserName(val);
    try {
      localStorage.setItem("sdlc_user_name", val);
    } catch {
      // ignore storage errors
    }
  };

  const isNameValid = userName.trim().length >= 2;

  const currentQuestion = quizQuestions[currentIndex];
  const totalQuestions = quizQuestions.length;
  // Hindari division-by-zero jika data kuis kosong (defensif)
  const progress =
    totalQuestions > 0
      ? ((currentIndex + (answered ? 1 : 0)) / totalQuestions) * 100
      : 0;

  // Persist sesi kuis setiap kali state berubah (idle = bersihkan sesi).
  useEffect(() => {
    try {
      if (quizState === "idle") {
        localStorage.removeItem(SESSION_KEY);
      } else {
        localStorage.setItem(SESSION_KEY, JSON.stringify(state));
      }
    } catch {
      // ignore storage errors
    }
  }, [state, quizState]);

  // Simpan skor terbaik saat mencapai layar hasil.
  useEffect(() => {
    if (quizState !== "summary" || answers.length === 0) return;
    const correct = answers.filter((a) => a.isCorrect).length;
    const score = Math.round((correct / answers.length) * 100);
    const nextBest = bestScore === null ? score : Math.max(bestScore, score);
    if (nextBest !== bestScore) {
      setBestScore(nextBest);
      try {
        localStorage.setItem(BEST_SCORE_KEY, String(nextBest));
      } catch {
        // ignore storage errors
      }
    }
  }, [quizState, answers, bestScore]);

  const handleStart = () => {
    if (!isNameValid) return;
    dispatch({ type: "START" });
  };

  const handleSelectOption = (optionId: string) => {
    if (answered) return;
    dispatch({ type: "SELECT", optionId });
    playPop();
  };

  const handleSubmit = () => {
    if (!selectedOption || answered || !currentQuestion) return;
    const isCorrect = selectedOption === currentQuestion.correctOptionId;
    if (isCorrect) {
      playCorrect();
      if (streak + 1 >= 3) playStreak();
    } else {
      playWrong();
    }
    dispatch({
      type: "SUBMIT",
      questionId: currentQuestion.id,
      correctOptionId: currentQuestion.correctOptionId,
    });
  };

  const handleNext = () => dispatch({ type: "NEXT", totalQuestions });
  const handleReview = () => dispatch({ type: "REVIEW" });
  const handleRetry = () => dispatch({ type: "RETRY" });

  return (
    <section id="quiz" className="py-14 sm:py-20 px-4 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        {/* Section header */}
        <m.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-8 sm:mb-12"
        >
          <span className="inline-block text-[10px] font-black tracking-widest uppercase text-brand-dark bg-brand-yellow px-3 py-1 rounded-lg border-2 border-brand-dark mb-3">
            Evaluasi Pemahaman
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-tight">
            Kuis Studi Kasus SDLC
          </h2>
          <p className="text-slate-500 max-w-md text-sm mt-2">
            Tersedia <strong>{totalQuestions} soal seru berbasis skenario nyata</strong> dan bukan sekadar hafalan teori.
            Raih lencana kompetensimu dan unduh badge IG Story!
          </p>
        </m.div>

        {/* Quiz container */}
        <div className="bg-white rounded-2xl border-2 border-slate-900 shadow-neo overflow-hidden">
          {/* ── IDLE ── */}
          {quizState === "idle" && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-5 sm:p-8 md:p-10 text-center"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-brand-yellow border-2 border-brand-dark flex items-center justify-center mx-auto mb-5 shadow-neo">
                <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-brand-dark" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-2">Siap Memulai Kuis?</h3>
              <p className="text-slate-500 text-sm mb-5 max-w-sm mx-auto leading-relaxed">
                {totalQuestions} skenario nyata dari berbagai fase SDLC. Jawab dengan benar dan raih
                streak combo!
              </p>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-xs sm:max-w-sm mx-auto mb-6">
                {[
                  { v: totalQuestions, l: "Soal", c: "text-sky-600" },
                  { v: "🔥", l: "Streak Combo", c: "text-orange-500" },
                  { v: "≥70", l: "Skor Lulus", c: "text-emerald-600" },
                ].map(({ v, l, c }) => (
                  <div key={l} className="bg-slate-50 rounded-xl p-3 border-2 border-slate-200">
                    <p className={`text-2xl font-black ${c}`}>{v}</p>
                    <p className="text-slate-500 text-[10px] mt-0.5 font-bold">{l}</p>
                  </div>
                ))}
              </div>

              {/* Best score pribadi (muncul setelah pernah menyelesaikan kuis) */}
              {bestScore !== null && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border-2 border-emerald-900 shadow-neo-green mb-6">
                  <Trophy className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                  <span className="text-xs font-black text-emerald-700">
                    Skor terbaikmu: {bestScore}%
                  </span>
                </div>
              )}

              {/* Badge tier info */}
              <div className="text-left bg-brand-yellow/10 rounded-xl border-2 border-brand-dark p-3 sm:p-4 mb-5 sm:mb-7 max-w-sm mx-auto">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-brand-dark flex-shrink-0" />
                  <span className="text-xs font-black text-brand-dark uppercase tracking-wider">
                    Lencana Kompetensi
                  </span>
                </div>
                <ul className="text-xs text-slate-700 space-y-1 font-semibold">
                  <li>
                    • Skor kurang dari 60% → <strong>Junior Analyst</strong>
                  </li>
                  <li>
                    • Skor 60 sampai 85% → <strong>System Analyst</strong>
                  </li>
                  <li>
                    • Skor di atas 85% → <strong>Lead Solution Architect</strong>
                  </li>
                </ul>
              </div>

              {/* ── Name Input ── */}
              <div className="max-w-sm mx-auto mb-5 sm:mb-7 text-left">
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                  Masukkan Nama Kamu untuk mendapatkan Badge!
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <User className="w-4 h-4 text-slate-400" />
                  </span>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => handleUserNameChange(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    maxLength={48}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-900 bg-white text-slate-900 font-semibold text-sm
                      placeholder:text-slate-400 placeholder:font-normal
                      focus:outline-none focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow/30
                      transition-all"
                  />
                </div>
                <AnimatePresence>
                  {userName.length > 0 && !isNameValid && (
                    <m.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-xs text-rose-600 font-semibold mt-1.5 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" />
                      Nama minimal 2 karakter ya!
                    </m.p>
                  )}
                  {isNameValid && (
                    <m.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-xs text-emerald-600 font-semibold mt-1.5 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      Siap! Badge akan dicetak atas nama <strong>{userName.trim()}</strong>.
                    </m.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Start button: full width on mobile */}
              <m.button
                whileHover={isNameValid ? { y: -2, boxShadow: "6px 6px 0px #FFC908" } : {}}
                whileTap={isNameValid ? { y: 1 } : {}}
                onClick={handleStart}
                disabled={!isNameValid}
                className={`flex items-center justify-center gap-2 w-full sm:w-auto sm:inline-flex px-8 py-4 font-black text-sm rounded-xl border-2 shadow-neo transition-all
                  ${
                    isNameValid
                      ? "bg-brand-dark text-brand-yellow border-brand-dark cursor-pointer"
                      : "bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed shadow-none"
                  }`}
              >
                Mulai Kuis Sekarang
                <ArrowRight className="w-5 h-5" />
              </m.button>
            </m.div>
          )}

          {/* ── ACTIVE ── */}
          {quizState === "active" && currentQuestion && (
            <div>
              {/* Top bar */}
              <div className="bg-slate-50 border-b-2 border-slate-200 px-5 py-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-800 font-mono">
                      {currentIndex + 1}
                      <span className="text-slate-400">/{totalQuestions}</span>
                    </span>
                    <AnimatePresence>
                      {streak >= 2 && <StreakBanner streak={streak} />}
                    </AnimatePresence>
                  </div>
                  <span className="text-[10px] font-black px-2 py-1 rounded-lg bg-brand-dark text-brand-yellow border-2 border-brand-dark">
                    {currentQuestion.phase}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden border border-slate-300">
                  <m.div
                    className="h-full bg-brand-yellow rounded-full"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>

              {/* Question content */}
              <AnimatePresence mode="wait">
                <m.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.25 }}
                  className="p-5"
                >
                  <div className="bg-brand-dark rounded-xl p-4 mb-4 border-2 border-brand-dark">
                    <span className="text-[10px] font-black text-brand-yellow uppercase tracking-widest font-mono block mb-2">
                      📋 Skenario
                    </span>
                    <p className="text-sm text-slate-300 leading-relaxed italic">
                      {currentQuestion.scenario}
                    </p>
                  </div>

                  <p className="font-black text-slate-900 text-base mb-4 leading-snug">
                    {currentQuestion.question}
                  </p>

                  <div className="space-y-2.5 mb-4" role="radiogroup" aria-label="Pilihan opsi jawaban">
                    {currentQuestion.options.map((opt) => (
                      <OptionButton
                        key={opt.id}
                        optionId={opt.id}
                        text={opt.text}
                        selected={selectedOption === opt.id}
                        answered={answered}
                        isCorrect={opt.id === currentQuestion.correctOptionId}
                        onClick={() => handleSelectOption(opt.id)}
                      />
                    ))}
                  </div>

                  {answered && selectedOption && (
                    <FeedbackCard
                      question={currentQuestion}
                      selectedOptionId={selectedOption}
                      isCorrect={selectedOption === currentQuestion.correctOptionId}
                    />
                  )}

                  <div className="mt-5 flex justify-end">
                    {!answered ? (
                      <m.button
                        whileHover={{ y: -1 }}
                        whileTap={{ y: 1 }}
                        onClick={handleSubmit}
                        disabled={!selectedOption}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm border-2 transition-all
                          ${
                            selectedOption
                              ? "bg-brand-dark text-brand-yellow border-brand-dark hover:shadow-neo-yellow cursor-pointer"
                              : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                          }`}
                      >
                        Konfirmasi Jawaban
                        <CheckCircle2 className="w-4 h-4" />
                      </m.button>
                    ) : (
                      <m.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -1 }}
                        whileTap={{ y: 1 }}
                        onClick={handleNext}
                        className="flex items-center gap-2 px-6 py-3 bg-brand-yellow text-brand-dark border-2 border-brand-dark rounded-xl font-black text-sm hover:shadow-neo transition-all"
                      >
                        {currentIndex < totalQuestions - 1 ? (
                          <>
                            Soal Berikutnya <ChevronRight className="w-4 h-4" />
                          </>
                        ) : (
                          <>
                            Lihat Hasil <Trophy className="w-4 h-4" />
                          </>
                        )}
                      </m.button>
                    )}
                  </div>
                </m.div>
              </AnimatePresence>
            </div>
          )}

          {/* ── SUMMARY ── */}
          {quizState === "summary" && (
            <div className="p-8">
              <SummaryScreen
                answers={answers}
                userName={userName.trim() || "Peserta"}
                onReview={handleReview}
                onRetry={handleRetry}
              />
            </div>
          )}

          {/* ── REVIEW ── */}
          {quizState === "review" && (
            <div className="p-6">
              <ReviewScreen answers={answers} onRetry={handleRetry} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

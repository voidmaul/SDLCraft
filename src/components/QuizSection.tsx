import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import type { AnswerRecord } from "../utils/scoreBadge";

type QuizState = "idle" | "active" | "review" | "summary";

export default function QuizSection() {
  const { playPop, playCorrect, playWrong, playStreak } = useAudio();
  const [quizState, setQuizState] = useState<QuizState>("idle");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [streak, setStreak] = useState(0);
  const streakRef = useRef(0);

  // userName — persisted in localStorage
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
  const progress = ((currentIndex + (answered ? 1 : 0)) / totalQuestions) * 100;

  const handleStart = () => {
    if (!isNameValid) return;
    setQuizState("active");
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswered(false);
    setAnswers([]);
    setStreak(0);
    streakRef.current = 0;
  };

  const handleSelectOption = (optionId: string) => {
    if (answered) return;
    setSelectedOption(optionId);
    playPop();
  };

  const handleSubmit = useCallback(() => {
    if (!selectedOption || answered) return;
    const isCorrect = selectedOption === currentQuestion.correctOptionId;
    if (isCorrect) {
      streakRef.current += 1;
      setStreak(streakRef.current);
      playCorrect();
      if (streakRef.current >= 3) playStreak();
    } else {
      streakRef.current = 0;
      setStreak(0);
      playWrong();
    }
    setAnswered(true);
    setAnswers((prev) => [
      ...prev,
      { questionId: currentQuestion.id, selectedOptionId: selectedOption, isCorrect },
    ]);
  }, [selectedOption, answered, currentQuestion, playCorrect, playStreak, playWrong]);

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setAnswered(false);
    } else {
      setQuizState("summary");
    }
  };

  const handleReview = () => setQuizState("review");
  const handleRetry = () => {
    setQuizState("idle");
    setAnswers([]);
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswered(false);
    setStreak(0);
    streakRef.current = 0;
  };

  return (
    <section id="quiz" className="py-14 sm:py-20 px-4 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        {/* Section header */}
        <motion.div
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
            <strong>{totalQuestions} soal berbasis skenario nyata</strong> — bukan sekadar hafalan.
            Raih lencana kompetensimu dan unduh badge IG Story!
          </p>
        </motion.div>

        {/* Quiz container */}
        <div className="bg-white rounded-2xl border-2 border-slate-900 shadow-neo overflow-hidden">
          {/* ── IDLE ── */}
          {quizState === "idle" && (
            <motion.div
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
                    • Skor &lt; 60% → <strong>Junior Analyst</strong>
                  </li>
                  <li>
                    • Skor 60–85% → <strong>System Analyst</strong>
                  </li>
                  <li>
                    • Skor &gt; 85% → <strong>Lead Solution Architect</strong>
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
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-xs text-rose-600 font-semibold mt-1.5 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" />
                      Nama minimal 2 karakter ya!
                    </motion.p>
                  )}
                  {isNameValid && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-xs text-emerald-600 font-semibold mt-1.5 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      Siap! Badge akan dicetak atas nama <strong>{userName.trim()}</strong>.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Start button — full width on mobile */}
              <motion.button
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
              </motion.button>
            </motion.div>
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
                  <motion.div
                    className="h-full bg-brand-yellow rounded-full"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>

              {/* Question content */}
              <AnimatePresence mode="wait">
                <motion.div
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
                      <motion.button
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
                      </motion.button>
                    ) : (
                      <motion.button
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
                      </motion.button>
                    )}
                  </div>
                </motion.div>
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

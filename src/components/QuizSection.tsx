import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  ChevronRight,
  Trophy,
  RefreshCw,
  BookOpen,
  AlertCircle,
  Star,
  Target,
  ArrowRight,
  Flame,
  Medal,
  User,
  Download,
  Loader2,
  Calendar,
} from "lucide-react";
import confetti from "canvas-confetti";
import { quizQuestions, type QuizQuestion } from "../data/quizData";
import { type AudioCtxRef, playCorrect, playWrong, playPop, playStreak } from "../utils/audio";

type QuizState = "idle" | "active" | "review" | "summary";

interface AnswerRecord {
  questionId: number;
  selectedOptionId: string;
  isCorrect: boolean;
}

// ─── Badge metadata ────────────────────────────────────────────────────────
function getScoreBadge(score: number): {
  label: string;
  subtitle: string;
  color: string;
  bg: string;
  border: string;
  dark: string;
  icon: React.ElementType;
} {
  if (score > 85) {
    return {
      label: "Lead Solution Architect",
      subtitle: "Pemahaman Sangat Matang",
      color: "text-violet-700",
      bg: "bg-violet-50",
      border: "border-violet-900",
      dark: "bg-violet-900",
      icon: Star,
    };
  } else if (score >= 60) {
    return {
      label: "System Analyst",
      subtitle: "Pemahaman Alur Baik",
      color: "text-sky-700",
      bg: "bg-sky-50",
      border: "border-sky-900",
      dark: "bg-sky-900",
      icon: Target,
    };
  } else {
    return {
      label: "Junior Analyst",
      subtitle: "Perlu Penguatan Konsep",
      color: "text-amber-700",
      bg: "bg-amber-50",
      border: "border-amber-900",
      dark: "bg-amber-900",
      icon: BookOpen,
    };
  }
}

// ─── Confetti ──────────────────────────────────────────────────────────────
function launchConfetti() {
  const duration = 3200;
  const end = Date.now() + duration;
  const frame = () => {
    confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors: ["#FFC908", "#0284C7", "#10B981"] });
    confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors: ["#FFC908", "#F97316", "#10B981"] });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}

// ─── Instagram Story Badge Generator (HTML5 Canvas 2D, 1080×1920) ─────────
function generateStoryBadge(
  userName: string,
  score: number,
  badgeTitle: string,
  correctCount: number,
  totalCount: number
): void {
  const W = 1080;
  const H = 1920;
  const YELLOW = "#FFC908";
  const DARK = "#0B0F19";
  const DARK2 = "#1E293B";
  const WHITE = "#FFFFFF";
  const SLATE = "#94A3B8";
  const FRAME = 40;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // ── Background ────────────────────────────────────────────────────────
  ctx.fillStyle = DARK;
  ctx.fillRect(0, 0, W, H);

  // Dot grid
  ctx.fillStyle = "rgba(255,255,255,0.045)";
  const STEP = 48;
  for (let x = STEP; x < W; x += STEP) {
    for (let y = STEP; y < H; y += STEP) {
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Outer frame
  ctx.strokeStyle = YELLOW;
  ctx.lineWidth = 4;
  ctx.strokeRect(FRAME, FRAME, W - FRAME * 2, H - FRAME * 2);

  // Inner frame accent line (thinner, inset)
  ctx.strokeStyle = "rgba(255,201,8,0.25)";
  ctx.lineWidth = 1;
  ctx.strokeRect(FRAME + 12, FRAME + 12, W - (FRAME + 12) * 2, H - (FRAME + 12) * 2);

  // ── Header ────────────────────────────────────────────────────────────
  // Brand bar pill
  ctx.fillStyle = YELLOW;
  const barW = 560;
  const barH = 52;
  const barX = (W - barW) / 2;
  const barY = 160;
  roundRect(ctx, barX, barY, barW, barH, 14);
  ctx.fill();

  ctx.fillStyle = DARK;
  ctx.font = "bold 22px 'Arial', sans-serif";
  ctx.textAlign = "center";
  ctx.letterSpacing = "3px";
  ctx.fillText("SDLCRAFT · INTERACTIVE LEARNING", W / 2, barY + 34);

  ctx.fillStyle = SLATE;
  ctx.font = "500 20px 'Arial', sans-serif";
  ctx.letterSpacing = "5px";
  ctx.fillText("OFFICIAL BADGE OF COMPETENCY", W / 2, barY + 90);

  // Thin divider under header
  ctx.fillStyle = "rgba(255,201,8,0.3)";
  ctx.fillRect(FRAME + 60, barY + 108, W - (FRAME + 60) * 2, 1);

  // ── Emblem (hexagon-style medal) ──────────────────────────────────────
  const cx = W / 2;
  const cy = 620;
  const outerR = 200;
  const innerR = 160;

  // Outer glow ring
  ctx.shadowColor = YELLOW;
  ctx.shadowBlur = 48;
  drawHexagon(ctx, cx, cy, outerR + 16);
  ctx.fillStyle = "rgba(255,201,8,0.12)";
  ctx.fill();
  ctx.shadowBlur = 0;

  // Hexagon outer ring (yellow stroke)
  drawHexagon(ctx, cx, cy, outerR);
  ctx.fillStyle = DARK2;
  ctx.fill();
  ctx.strokeStyle = YELLOW;
  ctx.lineWidth = 8;
  ctx.stroke();

  // Hexagon inner fill
  drawHexagon(ctx, cx, cy, innerR);
  ctx.fillStyle = "#111827";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,201,8,0.4)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Score number
  ctx.fillStyle = YELLOW;
  ctx.font = "900 108px 'Arial Black', 'Arial', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`${score}%`, cx, cy + 36);

  // "SCORE" label inside hex
  ctx.fillStyle = WHITE;
  ctx.font = "bold 28px 'Arial', sans-serif";
  ctx.letterSpacing = "6px";
  ctx.fillText("SCORE", cx, cy + 76);

  // correct / total below hex
  ctx.letterSpacing = "0px";
  ctx.fillStyle = SLATE;
  ctx.font = "500 26px 'Arial', sans-serif";
  ctx.fillText(`${correctCount} dari ${totalCount} Jawaban Benar`, cx, cy + outerR + 50);

  // ── Name section ──────────────────────────────────────────────────────
  const nameY = 1000;

  // Label
  ctx.letterSpacing = "5px";
  ctx.fillStyle = SLATE;
  ctx.font = "500 20px 'Arial', sans-serif";
  ctx.fillText("DIBERIKAN KEPADA", cx, nameY);

  // User name (auto-wrap at 900px wide, max 2 lines)
  ctx.letterSpacing = "1px";
  ctx.fillStyle = WHITE;
  ctx.font = "900 68px 'Arial Black', 'Arial', sans-serif";
  wrapText(ctx, userName.toUpperCase(), cx, nameY + 72, 900, 80, "center");

  // Name underline
  ctx.fillStyle = YELLOW;
  ctx.fillRect(cx - 220, nameY + 148, 440, 4);

  // ── Badge title ───────────────────────────────────────────────────────
  const titleY = 1210;

  // Badge box background
  const titleBoxW = 760;
  const titleBoxH = 76;
  const titleBoxX = (W - titleBoxW) / 2;
  ctx.fillStyle = YELLOW;
  roundRect(ctx, titleBoxX, titleY, titleBoxW, titleBoxH, 16);
  ctx.fill();
  ctx.strokeStyle = DARK;
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = DARK;
  ctx.font = "900 30px 'Arial Black', 'Arial', sans-serif";
  ctx.letterSpacing = "2px";
  ctx.fillText(badgeTitle.toUpperCase(), cx, titleY + 50);

  // Date
  const today = new Date();
  const dateStr = today.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  ctx.letterSpacing = "2px";
  ctx.fillStyle = SLATE;
  ctx.font = "500 22px 'Arial', sans-serif";
  ctx.fillText(dateStr, cx, titleY + 110);

  // ── Divider ───────────────────────────────────────────────────────────
  ctx.fillStyle = "rgba(255,201,8,0.2)";
  ctx.fillRect(FRAME + 60, titleY + 136, W - (FRAME + 60) * 2, 1);

  // ── Challenge box ─────────────────────────────────────────────────────
  const boxX = FRAME + 48;
  const boxY = 1380;
  const boxW = W - (FRAME + 48) * 2;
  const boxH = 460;

  ctx.fillStyle = DARK2;
  roundRect(ctx, boxX, boxY, boxW, boxH, 20);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,201,8,0.5)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Fire headline
  ctx.letterSpacing = "3px";
  ctx.fillStyle = YELLOW;
  ctx.font = "900 42px 'Arial Black', 'Arial', sans-serif";
  ctx.fillText("🔥 TANTANG TEMANMU!", cx, boxY + 70);

  // Challenge text (auto-wrap)
  ctx.letterSpacing = "0px";
  ctx.fillStyle = WHITE;
  ctx.font = "500 26px 'Arial', sans-serif";
  wrapText(ctx, "Aku berhasil menyelesaikan Studi Kasus SDLC.", cx, boxY + 128, boxW - 80, 36, "center");
  wrapText(ctx, "Bisakah kamu mengalahkan skorku?", cx, boxY + 170, boxW - 80, 36, "center");

  // URL pill
  const urlPillW = 620;
  const urlPillH = 52;
  const urlPillX = (W - urlPillW) / 2;
  const urlPillY = boxY + 212;
  ctx.fillStyle = "rgba(255,201,8,0.12)";
  roundRect(ctx, urlPillX, urlPillY, urlPillW, urlPillH, 12);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,201,8,0.4)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = YELLOW;
  ctx.font = "bold 22px 'Arial', sans-serif";
  ctx.letterSpacing = "0px";
  ctx.fillText("sdlc-craft.vercel.app", cx, urlPillY + 34);

  // CTA line
  ctx.fillStyle = SLATE;
  ctx.font = "500 22px 'Arial', sans-serif";
  ctx.fillText("Uji pemahamanmu sekarang →", cx, urlPillY + 76);

  // Hashtags
  ctx.fillStyle = "rgba(255,201,8,0.7)";
  ctx.font = "bold 24px 'Arial', sans-serif";
  ctx.letterSpacing = "1px";
  ctx.fillText("#BelajarSDLC   #SoftwareEngineering   #SDLCraft", cx, boxY + boxH - 36);

  // ── Bottom branding strip ──────────────────────────────────────────────
  ctx.letterSpacing = "4px";
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.font = "500 18px 'Arial', sans-serif";
  ctx.fillText("SDLCRAFT · INTERACTIVE LEARNING PLATFORM", cx, H - FRAME - 24);

  // ── Trigger download ──────────────────────────────────────────────────
  const dataUrl = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = `SDLC-Badge-${userName.replace(/\s+/g, "_")}.png`;
  link.click();
}

// ── Canvas helpers ────────────────────────────────────────────────────────
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawHexagon(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const px = cx + r * Math.cos(angle);
    const py = cy + r * Math.sin(angle);
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  align: CanvasTextAlign
) {
  ctx.textAlign = align;
  const words = text.split(" ");
  let line = "";
  let curY = y;
  for (const word of words) {
    const test = line + (line ? " " : "") + word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, curY);
      line = word;
      curY += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, curY);
}

// ─── Option Button ────────────────────────────────────────────────────────
interface OptionButtonProps {
  optionId: string;
  text: string;
  selected: boolean;
  answered: boolean;
  isCorrect: boolean;
  onClick: () => void;
}

function OptionButton({ optionId, text, selected, answered, isCorrect, onClick }: OptionButtonProps) {
  let containerClass = "bg-white border-slate-200 hover:border-slate-900 hover:shadow-neo-sm cursor-pointer";
  let labelClass = "bg-slate-100 text-slate-500 border-slate-200";
  let iconEl: React.ReactNode = null;

  if (answered) {
    if (isCorrect) {
      containerClass = "bg-emerald-50 border-emerald-900 shadow-neo-green cursor-default";
      labelClass = "bg-emerald-600 text-white border-emerald-700";
      iconEl = <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />;
    } else if (selected && !isCorrect) {
      containerClass = "bg-rose-50 border-rose-900 cursor-default";
      labelClass = "bg-rose-600 text-white border-rose-700";
      iconEl = <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />;
    } else {
      containerClass = "bg-white border-slate-100 opacity-50 cursor-default";
    }
  } else if (selected) {
    containerClass = "bg-brand-yellow/10 border-brand-dark shadow-neo-sm cursor-pointer";
    labelClass = "bg-brand-dark text-brand-yellow border-brand-dark";
  }

  return (
    <motion.button
      whileHover={!answered ? { y: -1 } : {}}
      whileTap={!answered ? { y: 1 } : {}}
      onClick={!answered ? onClick : undefined}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-left transition-all duration-150 ${containerClass}`}
    >
      <span className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center flex-shrink-0 uppercase border-2 ${labelClass}`}>
        {optionId}
      </span>
      <span className="text-sm text-slate-700 leading-relaxed flex-1">{text}</span>
      {iconEl}
    </motion.button>
  );
}

// ─── Feedback Card ────────────────────────────────────────────────────────
interface FeedbackCardProps {
  question: QuizQuestion;
  selectedOptionId: string;
  isCorrect: boolean;
}

function FeedbackCard({ question, selectedOptionId, isCorrect }: FeedbackCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`mt-4 rounded-xl border-2 p-4 ${isCorrect ? "bg-emerald-50 border-emerald-900" : "bg-rose-50 border-rose-900"}`}
    >
      <div className="flex items-center gap-2 mb-3">
        {isCorrect ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
        ) : (
          <XCircle className="w-4 h-4 text-rose-700" />
        )}
        <span className={`font-black text-sm ${isCorrect ? "text-emerald-700" : "text-rose-700"}`}>
          {isCorrect ? "Jawaban Benar! ✓" : "Jawaban Kurang Tepat"}
        </span>
      </div>
      {!isCorrect && (
        <div className="mb-3 p-3 bg-white rounded-xl border-2 border-rose-200">
          <p className="text-xs font-black text-rose-700 mb-1 uppercase tracking-wider">Mengapa opsi ini keliru:</p>
          <p className="text-sm text-slate-700">{question.wrongExplanations[selectedOptionId]}</p>
        </div>
      )}
      <div className={!isCorrect ? "p-3 bg-white rounded-xl border-2 border-emerald-200" : ""}>
        {!isCorrect && (
          <p className="text-xs font-black text-emerald-700 mb-1 uppercase tracking-wider">
            Pembahasan jawaban benar ({question.correctOptionId.toUpperCase()}):
          </p>
        )}
        <p className="text-sm text-slate-700 leading-relaxed">{question.explanation}</p>
      </div>
    </motion.div>
  );
}

// ─── Streak Banner ────────────────────────────────────────────────────────
interface StreakBannerProps {
  streak: number;
}

function StreakBanner({ streak }: StreakBannerProps) {
  if (streak < 2) return null;
  const label =
    streak >= 5
      ? `${streak}x Streak LEGENDARIS! 🔥🔥🔥`
      : streak >= 3
      ? `${streak}x Streak! 🔥`
      : `${streak}x Combo! ⚡`;
  return (
    <motion.div
      key={streak}
      initial={{ opacity: 0, scale: 0.5, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -10 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className="flex items-center justify-center gap-2 py-2 px-4 bg-brand-yellow border-2 border-brand-dark rounded-xl shadow-neo-sm mb-4 mx-auto w-fit"
    >
      <Flame className="w-4 h-4 text-orange-600" />
      <span className="text-xs font-black text-brand-dark uppercase tracking-wide">{label}</span>
    </motion.div>
  );
}

// ─── Summary Screen ───────────────────────────────────────────────────────
interface SummaryScreenProps {
  answers: AnswerRecord[];
  userName: string;
  onReview: () => void;
  onRetry: () => void;
}

function SummaryScreen({ answers, userName, onReview, onRetry }: SummaryScreenProps) {
  const correct = answers.filter((a) => a.isCorrect).length;
  const score = Math.round((correct / answers.length) * 100);
  const badge = getScoreBadge(score);
  const BadgeIcon = badge.icon;
  const [downloading, setDownloading] = useState(false);

  const today = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    if (score >= 70) setTimeout(launchConfetti, 300);
  }, [score]);

  const handleDownloadBadge = () => {
    setDownloading(true);
    // Allow React to render loading state before synchronous canvas work
    setTimeout(() => {
      generateStoryBadge(userName, score, badge.label, correct, answers.length);
      setDownloading(false);
    }, 60);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
    >
      {/* Score ring */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-36 h-36 mb-4">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="#e2e8f0" strokeWidth="10" />
            <motion.circle
              cx="60" cy="60" r="52" fill="none"
              stroke={score >= 70 ? "#FFC908" : "#F97316"}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 52}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - score / 100) }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="text-4xl font-black text-slate-900"
            >
              {score}
            </motion.span>
            <span className="text-xs text-slate-400 font-bold">/ 100</span>
          </div>
        </div>
        <p className="text-sm text-slate-500">
          <strong className="text-slate-800">{correct}</strong> benar dari {answers.length} soal
        </p>
      </div>

      {/* Badge / Certificate card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`border-2 ${badge.border} ${badge.bg} rounded-2xl p-5 mb-6 text-center shadow-neo`}
      >
        <div className={`w-14 h-14 rounded-2xl ${badge.dark} flex items-center justify-center mx-auto mb-3 shadow-neo-sm border-2 border-brand-dark`}>
          <BadgeIcon className="w-7 h-7 text-brand-yellow" />
        </div>

        {/* Lencana label */}
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg ${badge.dark} mb-3`}>
          <Medal className="w-3.5 h-3.5 text-brand-yellow" />
          <span className="text-xs font-black text-brand-yellow uppercase tracking-widest">Lencana Kompetensi</span>
        </div>

        {/* Title */}
        <h3 className={`text-xl font-black ${badge.color} mb-1`}>{badge.label}</h3>
        <p className="text-sm text-slate-500 mb-4">{badge.subtitle}</p>

        {/* Personalised recipient */}
        <div className="bg-white/70 rounded-xl border-2 border-current/20 px-4 py-3 mb-3 text-left">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Diberikan kepada</p>
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

        {score >= 70 ? (
          <p className="text-xs text-emerald-600 font-bold mt-3">🎉 Selamat! Kamu telah lulus!</p>
        ) : (
          <p className="text-xs text-slate-400 mt-3">Jangan menyerah — terus eksplorasi dan coba lagi!</p>
        )}
      </motion.div>

      {/* Answer map */}
      <div className="mb-6">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Peta Jawaban</p>
        <div className="grid grid-cols-5 gap-2">
          {answers.map((ans) => (
            <div
              key={ans.questionId}
              className={`aspect-square rounded-xl flex items-center justify-center text-sm font-black border-2
                ${ans.isCorrect
                  ? "bg-emerald-50 border-emerald-900 text-emerald-700 shadow-neo-green"
                  : "bg-rose-50 border-rose-900 text-rose-700"
                }`}
            >
              {ans.questionId}
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap justify-center">
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ y: 1 }}
          onClick={onReview}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 bg-white border-2 border-slate-900 text-slate-800 font-black rounded-xl hover:shadow-neo text-sm transition-all"
        >
          <BookOpen className="w-4 h-4" />
          Review Pembahasan
        </motion.button>
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ y: 1 }}
          onClick={onRetry}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 bg-white border-2 border-slate-900 text-slate-800 font-black rounded-xl hover:shadow-neo text-sm transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Coba Kuis Lagi
        </motion.button>
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ y: 1 }}
          onClick={handleDownloadBadge}
          disabled={downloading}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 bg-brand-yellow border-2 border-brand-dark text-brand-dark font-black rounded-xl hover:shadow-neo text-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {downloading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Membuat Badge…</>
          ) : (
            <><Download className="w-4 h-4" /> Unduh Badge IG Story (PNG)</>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Review Screen ────────────────────────────────────────────────────────
interface ReviewScreenProps {
  answers: AnswerRecord[];
  onRetry: () => void;
}

function ReviewScreen({ answers, onRetry }: ReviewScreenProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-black text-lg text-slate-900">Review Pembahasan</h3>
        <button
          onClick={onRetry}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 border border-slate-200 hover:border-slate-900 px-3 py-1.5 rounded-lg transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Coba Lagi
        </button>
      </div>
      {answers.map((record, i) => {
        const q = quizQuestions.find((q) => q.id === record.questionId)!;
        return (
          <motion.div
            key={record.questionId}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
            className="rounded-2xl border-2 border-slate-200 overflow-hidden"
          >
            <div className={`px-5 py-3 flex items-center gap-3 border-b border-slate-100 ${record.isCorrect ? "bg-emerald-50" : "bg-rose-50"}`}>
              {record.isCorrect ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-700 flex-shrink-0" />
              )}
              <span className="text-xs font-black text-slate-700 uppercase tracking-wide">
                Soal {q.id} · Fase {q.phase}
              </span>
            </div>
            <div className="p-5">
              <p className="text-xs text-slate-500 italic mb-2 leading-relaxed">{q.scenario}</p>
              <p className="font-black text-sm text-slate-900 mb-4">{q.question}</p>
              <div className="space-y-2 mb-4">
                {q.options.map((opt) => (
                  <OptionButton
                    key={opt.id}
                    optionId={opt.id}
                    text={opt.text}
                    selected={record.selectedOptionId === opt.id}
                    answered
                    isCorrect={opt.id === q.correctOptionId}
                    onClick={() => {}}
                  />
                ))}
              </div>
              <FeedbackCard question={q} selectedOptionId={record.selectedOptionId} isCorrect={record.isCorrect} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Main Quiz Section ────────────────────────────────────────────────────
interface QuizSectionProps {
  audioRef: AudioCtxRef;
}

export default function QuizSection({ audioRef }: QuizSectionProps) {
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
    playPop(audioRef);
  };

  const handleSubmit = useCallback(() => {
    if (!selectedOption || answered) return;
    const isCorrect = selectedOption === currentQuestion.correctOptionId;
    if (isCorrect) {
      streakRef.current += 1;
      setStreak(streakRef.current);
      playCorrect(audioRef);
      if (streakRef.current >= 3) playStreak(audioRef);
    } else {
      streakRef.current = 0;
      setStreak(0);
      playWrong(audioRef);
    }
    setAnswered(true);
    setAnswers((prev) => [
      ...prev,
      { questionId: currentQuestion.id, selectedOptionId: selectedOption, isCorrect },
    ]);
  }, [selectedOption, answered, currentQuestion, audioRef]);

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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5 sm:p-8 md:p-10 text-center">
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
                  <span className="text-xs font-black text-brand-dark uppercase tracking-wider">Lencana Kompetensi</span>
                </div>
                <ul className="text-xs text-slate-700 space-y-1 font-semibold">
                  <li>• Skor &lt; 60% → <strong>Junior Analyst</strong></li>
                  <li>• Skor 60–85% → <strong>System Analyst</strong></li>
                  <li>• Skor &gt; 85% → <strong>Lead Solution Architect</strong></li>
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
                  ${isNameValid
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
                      {currentIndex + 1}<span className="text-slate-400">/{totalQuestions}</span>
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
                    <p className="text-sm text-slate-300 leading-relaxed italic">{currentQuestion.scenario}</p>
                  </div>

                  <p className="font-black text-slate-900 text-base mb-4 leading-snug">
                    {currentQuestion.question}
                  </p>

                  <div className="space-y-2.5 mb-4">
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
                          ${selectedOption
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
                          <>Soal Berikutnya <ChevronRight className="w-4 h-4" /></>
                        ) : (
                          <>Lihat Hasil <Trophy className="w-4 h-4" /></>
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

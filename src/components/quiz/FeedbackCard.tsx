import { m } from "framer-motion";
import { ArrowRight, CheckCircle2, Lightbulb, XCircle } from "lucide-react";
import type { QuizQuestion } from "../../data/quizData";

interface FeedbackCardProps {
  question: QuizQuestion;
  selectedOptionId: string;
  isCorrect: boolean;
  phaseId?: string;
  hint?: string;
  onFocusPhase?: (phaseId: string) => void;
}

export function FeedbackCard({
  question,
  selectedOptionId,
  isCorrect,
  phaseId,
  hint,
  onFocusPhase,
}: FeedbackCardProps) {
  const hintText = hint ?? question.hint;
  const focusPhaseId = phaseId ?? question.phase;

  return (
    <m.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      role="status"
      aria-live="polite"
      className={`mt-4 rounded-xl border-2 p-4 ${
        isCorrect ? "bg-emerald-50 border-emerald-900" : "bg-rose-50 border-rose-900"
      }`}
    >
      <div className="flex items-center gap-2 mb-3">
        {isCorrect ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-700" aria-hidden="true" />
        ) : (
          <XCircle className="w-4 h-4 text-rose-700" aria-hidden="true" />
        )}
        <span className={`font-black text-sm ${isCorrect ? "text-emerald-700" : "text-rose-700"}`}>
          {isCorrect ? "Jawaban Benar! ✓" : "Jawaban Kurang Tepat"}
        </span>
      </div>

      {!isCorrect && hintText && (
        <div className="mb-3 p-3 bg-amber-50 rounded-xl border-2 border-amber-300">
          <p className="text-xs font-black text-amber-700 mb-1 uppercase tracking-wider flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5" aria-hidden="true" /> Petunjuk
          </p>
          <p className="text-sm text-slate-700">{hintText}</p>
        </div>
      )}

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

      {onFocusPhase && focusPhaseId && (
        <button
          type="button"
          onClick={() => onFocusPhase(focusPhaseId)}
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 underline underline-offset-2 transition-colors"
        >
          {focusPhaseId === "Model Selection" ? "Lihat komparasi model" : "Lihat materi fase ini"}
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      )}
    </m.div>
  );
}

import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import type { QuizQuestion } from "../../data/quizData";

interface FeedbackCardProps {
  question: QuizQuestion;
  selectedOptionId: string;
  isCorrect: boolean;
}

export function FeedbackCard({ question, selectedOptionId, isCorrect }: FeedbackCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`mt-4 rounded-xl border-2 p-4 ${
        isCorrect ? "bg-emerald-50 border-emerald-900" : "bg-rose-50 border-rose-900"
      }`}
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

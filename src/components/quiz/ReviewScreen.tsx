import { m } from "framer-motion";
import { CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { quizQuestions } from "../../data/quizData";
import { OptionButton } from "./OptionButton";
import { FeedbackCard } from "./FeedbackCard";
import type { AnswerRecord } from "../../utils/scoreBadge";

interface ReviewScreenProps {
  answers: AnswerRecord[];
  onRetry: () => void;
}

export function ReviewScreen({ answers, onRetry }: ReviewScreenProps) {
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
        const q = quizQuestions.find((item) => item.id === record.questionId);
        // Jika data soal tidak ditemukan (mis. data berubah), lewati rekaman tersebut
        if (!q) return null;
        return (
          <m.div
            key={record.questionId}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
            className="rounded-2xl border-2 border-slate-200 overflow-hidden"
          >
            <div
              className={`px-5 py-3 flex items-center gap-3 border-b border-slate-100 ${
                record.isCorrect ? "bg-emerald-50" : "bg-rose-50"
              }`}
            >
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
              <div className="space-y-2 mb-4" role="radiogroup" aria-label={`Pilihan jawaban soal ${q.id}`}>
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
              <FeedbackCard
                question={q}
                selectedOptionId={record.selectedOptionId}
                isCorrect={record.isCorrect}
              />
            </div>
          </m.div>
        );
      })}
    </div>
  );
}

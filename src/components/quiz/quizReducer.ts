import type { AnswerRecord } from "../../utils/scoreBadge";

export type QuizScreen = "idle" | "active" | "review" | "summary";

export interface QuizSessionState {
  quizState: QuizScreen;
  currentIndex: number;
  selectedOption: string | null;
  answered: boolean;
  answers: AnswerRecord[];
  streak: number;
}

export type QuizAction =
  | { type: "START" }
  | { type: "SELECT"; optionId: string }
  | { type: "SUBMIT"; questionId: number; correctOptionId: string }
  | { type: "NEXT"; totalQuestions: number }
  | { type: "REVIEW" }
  | { type: "RETRY" };

export const initialQuizState: QuizSessionState = {
  quizState: "idle",
  currentIndex: 0,
  selectedOption: null,
  answered: false,
  answers: [],
  streak: 0,
};

// Reducer murni: seluruh transisi state kuis terpusat di sini (tanpa ref,
// tanpa side effect). Efek suara dipicu terpisah di event handler komponen.
export function quizReducer(state: QuizSessionState, action: QuizAction): QuizSessionState {
  switch (action.type) {
    case "START":
      return { ...initialQuizState, quizState: "active" };

    case "SELECT":
      if (state.quizState !== "active" || state.answered) return state;
      return { ...state, selectedOption: action.optionId };

    case "SUBMIT": {
      if (state.quizState !== "active" || state.answered || !state.selectedOption) return state;
      const isCorrect = state.selectedOption === action.correctOptionId;
      return {
        ...state,
        answered: true,
        streak: isCorrect ? state.streak + 1 : 0,
        answers: [
          ...state.answers,
          {
            questionId: action.questionId,
            selectedOptionId: state.selectedOption,
            isCorrect,
          },
        ],
      };
    }

    case "NEXT":
      if (state.quizState !== "active" || !state.answered) return state;
      if (state.currentIndex < action.totalQuestions - 1) {
        return {
          ...state,
          currentIndex: state.currentIndex + 1,
          selectedOption: null,
          answered: false,
        };
      }
      return { ...state, quizState: "summary" };

    case "REVIEW":
      if (state.quizState !== "summary") return state;
      return { ...state, quizState: "review" };

    case "RETRY":
      return initialQuizState;

    default:
      return state;
  }
}

// ── Validasi & normalisasi sesi tersimpan (localStorage) ────────────────────
// Mengembalikan null bila data rusak / tidak cocok dengan bank soal saat ini,
// sehingga aplikasi selalu jatuh kembali ke state idle yang bersih.
interface QuestionShape {
  id: number;
  correctOptionId: string;
  options: { id: string }[];
}

export function restoreQuizSession(
  raw: string | null,
  questions: QuestionShape[]
): QuizSessionState | null {
  if (!raw || questions.length === 0) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<QuizSessionState>;
    const total = questions.length;

    if (
      parsed.quizState !== "active" &&
      parsed.quizState !== "review" &&
      parsed.quizState !== "summary"
    ) {
      return null;
    }
    if (!Array.isArray(parsed.answers)) return null;
    if (
      typeof parsed.currentIndex !== "number" ||
      !Number.isInteger(parsed.currentIndex) ||
      parsed.currentIndex < 0 ||
      parsed.currentIndex >= total
    ) {
      return null;
    }

    // Validasi tiap rekaman jawaban terhadap bank soal saat ini, dan hitung
    // ulang isCorrect dari kunci jawaban (self-healing terhadap data usang).
    const answers: AnswerRecord[] = [];
    for (let i = 0; i < parsed.answers.length; i++) {
      const record = parsed.answers[i] as Partial<AnswerRecord>;
      const question = questions[i];
      if (
        !question ||
        record.questionId !== question.id ||
        typeof record.selectedOptionId !== "string" ||
        !question.options.some((opt) => opt.id === record.selectedOptionId)
      ) {
        return null;
      }
      answers.push({
        questionId: question.id,
        selectedOptionId: record.selectedOptionId,
        isCorrect: record.selectedOptionId === question.correctOptionId,
      });
    }

    const currentIndex = parsed.currentIndex;
    let answered: boolean;
    let selectedOption: string | null;

    if (parsed.quizState === "active") {
      // Jawaban tersimpan harus persis sampai soal berjalan (± soal yang
      // sedang dijawab namun belum dikonfirmasi).
      if (answers.length !== currentIndex && answers.length !== currentIndex + 1) return null;
      answered = answers.length === currentIndex + 1;
      if (answered) {
        selectedOption = answers[currentIndex].selectedOptionId;
      } else {
        selectedOption =
          typeof parsed.selectedOption === "string" &&
          questions[currentIndex].options.some((opt) => opt.id === parsed.selectedOption)
            ? parsed.selectedOption
            : null;
      }
    } else {
      // summary / review hanya valid jika seluruh soal telah dijawab.
      if (answers.length !== total || currentIndex !== total - 1) return null;
      answered = true;
      selectedOption = answers[currentIndex].selectedOptionId;
    }

    // Hitung ulang streak dari ekor jawaban benar beruntun.
    let streak = 0;
    for (let i = answers.length - 1; i >= 0 && answers[i].isCorrect; i--) streak++;

    return {
      quizState: parsed.quizState,
      currentIndex,
      selectedOption,
      answered,
      answers,
      streak,
    };
  } catch {
    return null;
  }
}

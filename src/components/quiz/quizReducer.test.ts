import { describe, it, expect } from "vitest";
import {
  quizReducer,
  initialQuizState,
  restoreQuizSession,
  type QuizSessionState,
} from "./quizReducer";

const questions = [
  { id: 1, phase: "planning", correctOptionId: "b", options: [{ id: "a" }, { id: "b" }, { id: "c" }] },
  { id: 2, phase: "analysis", correctOptionId: "a", options: [{ id: "a" }, { id: "b" }, { id: "c" }] },
  { id: 3, phase: "testing", correctOptionId: "c", options: [{ id: "a" }, { id: "b" }, { id: "c" }] },
];

function startAndAnswer(
  state: QuizSessionState,
  optionId: string,
  question: (typeof questions)[number]
): QuizSessionState {
  let next = quizReducer(state, { type: "SELECT", optionId });
  next = quizReducer(next, {
    type: "SUBMIT",
    questionId: question.id,
    phaseId: question.phase,
    correctOptionId: question.correctOptionId,
  });
  return next;
}

describe("quizReducer", () => {
  it("START membuka sesi aktif dengan state bersih", () => {
    const state = quizReducer(initialQuizState, { type: "START" });
    expect(state.quizState).toBe("active");
    expect(state.currentIndex).toBe(0);
    expect(state.answers).toEqual([]);
    expect(state.streak).toBe(0);
  });

  it("SELECT memilih opsi, dan diabaikan setelah jawaban dikonfirmasi", () => {
    let state = quizReducer(initialQuizState, { type: "START" });
    state = quizReducer(state, { type: "SELECT", optionId: "b" });
    expect(state.selectedOption).toBe("b");
    state = quizReducer(state, {
      type: "SUBMIT",
      questionId: 1,
      phaseId: "planning",
      correctOptionId: "b",
    });
    const unchanged = quizReducer(state, { type: "SELECT", optionId: "a" });
    expect(unchanged).toBe(state);
  });

  it("SUBMIT tanpa pilihan diabaikan; submit ganda tidak menduplikasi jawaban", () => {
    let state = quizReducer(initialQuizState, { type: "START" });
    expect(quizReducer(state, { type: "SUBMIT", questionId: 1, phaseId: "planning", correctOptionId: "b" })).toBe(state);
    state = startAndAnswer(state, "b", questions[0]);
    expect(state.answers).toHaveLength(1);
    expect(state.answers[0].isCorrect).toBe(true);
    expect(state.answers[0].phaseId).toBe("planning");
    expect(state.streak).toBe(1);
    const again = quizReducer(state, { type: "SUBMIT", questionId: 1, phaseId: "planning", correctOptionId: "b" });
    expect(again).toBe(state);
  });

  it("streak bertambah saat benar beruntun dan reset saat salah", () => {
    let state = quizReducer(initialQuizState, { type: "START" });
    state = startAndAnswer(state, "b", questions[0]);
    state = quizReducer(state, { type: "NEXT", totalQuestions: 3 });
    state = startAndAnswer(state, "a", questions[1]);
    expect(state.streak).toBe(2);
    state = quizReducer(state, { type: "NEXT", totalQuestions: 3 });
    state = startAndAnswer(state, "a", questions[2]); // kunci: c → salah
    expect(state.streak).toBe(0);
    expect(state.answers[2].isCorrect).toBe(false);
  });

  it("NEXT maju ke soal berikut, dan di soal terakhir membuka summary", () => {
    let state = quizReducer(initialQuizState, { type: "START" });
    state = startAndAnswer(state, "b", questions[0]);
    state = quizReducer(state, { type: "NEXT", totalQuestions: 3 });
    expect(state.currentIndex).toBe(1);
    expect(state.selectedOption).toBeNull();
    expect(state.answered).toBe(false);
    state = startAndAnswer(state, "a", questions[1]);
    state = quizReducer(state, { type: "NEXT", totalQuestions: 3 });
    state = startAndAnswer(state, "c", questions[2]);
    state = quizReducer(state, { type: "NEXT", totalQuestions: 3 });
    expect(state.quizState).toBe("summary");
  });

  it("REVIEW hanya dari summary; RETRY kembali ke idle bersih", () => {
    const active = quizReducer(initialQuizState, { type: "START" });
    expect(quizReducer(active, { type: "REVIEW" })).toBe(active);
    const summary: QuizSessionState = { ...active, quizState: "summary" };
    const review = quizReducer(summary, { type: "REVIEW" });
    expect(review.quizState).toBe("review");
    expect(quizReducer(review, { type: "RETRY" })).toEqual(initialQuizState);
  });

  it("RETRY_CURRENT menghapus jawaban terakhir dan menghitung ulang streak", () => {
    let state = quizReducer(initialQuizState, { type: "START" });
    state = startAndAnswer(state, "b", questions[0]); // benar
    state = quizReducer(state, { type: "NEXT", totalQuestions: 3 });
    state = startAndAnswer(state, "b", questions[1]); // salah
    expect(state.answers).toHaveLength(2);
    expect(state.streak).toBe(0);

    const retried = quizReducer(state, { type: "RETRY_CURRENT" });
    expect(retried.answers).toHaveLength(1);
    expect(retried.answered).toBe(false);
    expect(retried.selectedOption).toBeNull();
    expect(retried.streak).toBe(1);
    expect(retried.currentIndex).toBe(1);

    // Diabaikan saat belum ada jawaban yang dikonfirmasi.
    const idle = quizReducer(quizReducer(initialQuizState, { type: "START" }), { type: "RETRY_CURRENT" });
    expect(idle.answered).toBe(false);
  });
});

describe("restoreQuizSession", () => {
  it("mengembalikan null untuk data kosong / rusak / state idle", () => {
    expect(restoreQuizSession(null, questions)).toBeNull();
    expect(restoreQuizSession("bukan-json", questions)).toBeNull();
    expect(restoreQuizSession(JSON.stringify(initialQuizState), questions)).toBeNull();
  });

  it("memulihkan sesi aktif di tengah kuis (round-trip)", () => {
    let state = quizReducer(initialQuizState, { type: "START" });
    state = startAndAnswer(state, "b", questions[0]);
    state = quizReducer(state, { type: "NEXT", totalQuestions: 3 });
    state = quizReducer(state, { type: "SELECT", optionId: "a" });
    const restored = restoreQuizSession(JSON.stringify(state), questions);
    expect(restored).toEqual(state);
  });

  it("menghitung ulang isCorrect dan streak dari kunci jawaban (self-healing)", () => {
    const tampered = {
      quizState: "active",
      currentIndex: 1,
      selectedOption: null,
      answered: false,
      answers: [
        // isCorrect sengaja dipalsukan false padahal jawaban benar
        { questionId: 1, selectedOptionId: "b", isCorrect: false },
      ],
      streak: 99,
    };
    const restored = restoreQuizSession(JSON.stringify(tampered), questions);
    expect(restored).not.toBeNull();
    expect(restored!.answers[0].isCorrect).toBe(true);
    expect(restored!.streak).toBe(1);
  });

  it("menolak sesi yang tidak cocok dengan bank soal", () => {
    const mismatch = {
      quizState: "active",
      currentIndex: 0,
      selectedOption: null,
      answered: false,
      answers: [{ questionId: 99, selectedOptionId: "b", isCorrect: true }],
      streak: 1,
    };
    expect(restoreQuizSession(JSON.stringify(mismatch), questions)).toBeNull();
  });

  it("menolak summary dengan jawaban belum lengkap", () => {
    const incomplete = {
      quizState: "summary",
      currentIndex: 2,
      selectedOption: "c",
      answered: true,
      answers: [{ questionId: 1, selectedOptionId: "b", isCorrect: true }],
      streak: 1,
    };
    expect(restoreQuizSession(JSON.stringify(incomplete), questions)).toBeNull();
  });

  it("memulihkan sesi summary lengkap dengan streak terhitung ulang", () => {
    let state = quizReducer(initialQuizState, { type: "START" });
    state = startAndAnswer(state, "a", questions[0]); // salah
    state = quizReducer(state, { type: "NEXT", totalQuestions: 3 });
    state = startAndAnswer(state, "a", questions[1]); // benar
    state = quizReducer(state, { type: "NEXT", totalQuestions: 3 });
    state = startAndAnswer(state, "c", questions[2]); // benar
    state = quizReducer(state, { type: "NEXT", totalQuestions: 3 });
    const restored = restoreQuizSession(JSON.stringify(state), questions);
    expect(restored).toEqual(state);
    expect(restored!.streak).toBe(2);
  });
});

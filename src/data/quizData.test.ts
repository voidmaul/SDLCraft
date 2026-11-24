import { describe, it, expect } from "vitest";
import { quizQuestions, getQuizPhaseLabel, type QuizPhase } from "./quizData";
import { matcherQuestions } from "./comparisonData";

const SDLC_PHASES: QuizPhase[] = [
  "planning",
  "analysis",
  "design",
  "development",
  "testing",
  "deployment",
  "maintenance",
];

const ALLOWED_PHASES = new Set<QuizPhase>([...SDLC_PHASES, "Model Selection"]);

describe("integritas bank soal kuis", () => {
  it("memiliki 11 soal dengan id unik", () => {
    expect(quizQuestions).toHaveLength(11);
    const ids = quizQuestions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("setiap soal memiliki skenario, pertanyaan, dan pembahasan yang tidak kosong", () => {
    quizQuestions.forEach((q) => {
      expect(q.scenario.trim().length).toBeGreaterThan(0);
      expect(q.question.trim().length).toBeGreaterThan(0);
      expect(q.explanation.trim().length).toBeGreaterThan(0);
      expect(q.options.length).toBeGreaterThanOrEqual(2);
    });
  });

  it("correctOptionId selalu ada di dalam options", () => {
    quizQuestions.forEach((q) => {
      expect(q.options.some((opt) => opt.id === q.correctOptionId)).toBe(true);
    });
  });

  it("wrongExplanations hanya memuat opsi yang salah, bukan kunci jawaban", () => {
    quizQuestions.forEach((q) => {
      const wrongIds = q.options
        .filter((opt) => opt.id !== q.correctOptionId)
        .map((opt) => opt.id)
        .sort();
      const explainedIds = Object.keys(q.wrongExplanations).sort();
      expect(explainedIds).toEqual(wrongIds);
      expect(q.wrongExplanations[q.correctOptionId]).toBeUndefined();
    });
  });

  it("phase setiap soal termasuk himpunan yang diizinkan", () => {
    quizQuestions.forEach((q) => {
      expect(ALLOWED_PHASES.has(q.phase)).toBe(true);
    });
  });

  it("setiap phase memiliki label tampilan yang tidak kosong", () => {
    quizQuestions.forEach((q) => {
      expect(getQuizPhaseLabel(q.phase).trim().length).toBeGreaterThan(0);
    });
    expect(getQuizPhaseLabel("Model Selection")).toBe("Model Selection");
  });

  it("ketujuh fase SDLC tercakup, termasuk Development", () => {
    const covered = new Set(quizQuestions.map((q) => q.phase));
    SDLC_PHASES.forEach((phase) => {
      expect(covered.has(phase)).toBe(true);
    });
  });

  it("matcherQuestions memakai value valid dan id unik", () => {
    const ids = matcherQuestions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    matcherQuestions.forEach((q) => {
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      q.options.forEach((opt) => {
        expect(["waterfall", "agile"]).toContain(opt.value);
      });
    });
  });
});

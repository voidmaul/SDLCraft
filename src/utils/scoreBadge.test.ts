import { describe, it, expect } from "vitest";
import { getScoreBadge, isPassingScore, PASS_SCORE } from "./scoreBadge";
import { calculateModelScore, matcherQuestions } from "../data/comparisonData";

describe("scoreBadge & certification tiers", () => {
  it("Lead Solution Architect untuk skor > 85 dan lulus", () => {
    const badge = getScoreBadge(90);
    expect(badge.label).toBe("Lead Solution Architect");
    expect(badge.subtitle).toBe("Pemahaman Sangat Matang");
    expect(badge.passed).toBe(true);
  });

  it("System Analyst lulus untuk skor 70–85", () => {
    [70, 75, 85].forEach((score) => {
      const badge = getScoreBadge(score);
      expect(badge.label).toBe("System Analyst");
      expect(badge.subtitle).toBe("Lulus / Pemahaman alur matang");
      expect(badge.passed).toBe(true);
    });
  });

  it("System Analyst belum lulus untuk skor 60–69", () => {
    [60, 65, 69].forEach((score) => {
      const badge = getScoreBadge(score);
      expect(badge.label).toBe("System Analyst");
      expect(badge.subtitle).toBe("Progres baik — belum lulus");
      expect(badge.passed).toBe(false);
    });
  });

  it("Junior Analyst untuk skor < 60", () => {
    [0, 40, 59].forEach((score) => {
      expect(getScoreBadge(score).label).toBe("Junior Analyst");
      expect(getScoreBadge(score).passed).toBe(false);
    });
  });

  it("isPassingScore konsisten dengan PASS_SCORE", () => {
    expect(PASS_SCORE).toBe(70);
    expect(isPassingScore(69)).toBe(false);
    expect(isPassingScore(70)).toBe(true);
    expect(isPassingScore(100)).toBe(true);
  });
});

describe("calculateModelScore logic", () => {
  it("merekomendasikan Waterfall saat seluruh kriteria mendukung Waterfall", () => {
    const answers = Object.fromEntries(
      matcherQuestions.map((q) => [q.id, "waterfall" as const])
    );
    const result = calculateModelScore(answers);
    expect(result.model).toBe("waterfall");
    expect(result.score).toBe(100);
    expect(result.margin).toBe(1);
    expect(result.contributions).toHaveLength(matcherQuestions.length);
  });

  it("merekomendasikan Agile saat seluruh kriteria mendukung Agile", () => {
    const answers = Object.fromEntries(
      matcherQuestions.map((q) => [q.id, "agile" as const])
    );
    const result = calculateModelScore(answers);
    expect(result.model).toBe("agile");
    expect(result.score).toBe(100);
    expect(result.margin).toBe(1);
    expect(result.contributions).toHaveLength(matcherQuestions.length);
  });

  it("menghasilkan hybrid saat margin bobot < 0.2", () => {
    const answers: Record<string, "waterfall" | "agile"> = {
      requirements: "waterfall", // 3
      timeline: "waterfall", // 2
      compliance: "agile", // 3
      client: "agile", // 1
      team: "agile", // 1
    };
    const result = calculateModelScore(answers);
    expect(result.model).toBe("hybrid");
    expect(result.margin).toBeLessThan(0.2);
    expect(result.score).toBe(50);
  });

  it("mengabaikan kunci asing di luar matcherQuestions", () => {
    const valid = Object.fromEntries(
      matcherQuestions.map((q) => [q.id, "waterfall" as const])
    );
    const withForeign = { ...valid, tidakDikenal: "agile" as const };
    const result = calculateModelScore(withForeign);
    expect(result.model).toBe("waterfall");
    expect(result.score).toBe(100);
    expect(result.contributions).toHaveLength(matcherQuestions.length);
    expect(result.contributions.some((c) => c.id === "tidakDikenal")).toBe(false);
  });

  it("kontribusi memuat label, pilihan, bobot, dan dukungan yang sesuai", () => {
    const answers: Record<string, "waterfall" | "agile"> = {
      requirements: "agile",
      timeline: "waterfall",
    };
    const result = calculateModelScore(answers);
    expect(result.contributions).toHaveLength(2);
    result.contributions.forEach((contribution) => {
      const question = matcherQuestions.find((q) => q.id === contribution.id);
      expect(question).toBeDefined();
      expect(contribution.weight).toBe(question!.weight);
      expect(contribution.supports).toBe(answers[contribution.id]);
      expect(contribution.label).toBe(question!.label);
      expect(contribution.choice.length).toBeGreaterThan(0);
    });
  });
});

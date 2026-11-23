import { describe, it, expect } from "vitest";
import { getScoreBadge } from "./scoreBadge";
import { calculateModelScore } from "../data/comparisonData";

describe("scoreBadge & certification tiers", () => {
  it("should return Lead Solution Architect for score > 85", () => {
    const badge = getScoreBadge(90);
    expect(badge.label).toBe("Lead Solution Architect");
    expect(badge.subtitle).toBe("Pemahaman Sangat Matang");
  });

  it("should return System Analyst for score between 60 and 85", () => {
    const badge85 = getScoreBadge(85);
    const badge60 = getScoreBadge(60);
    expect(badge85.label).toBe("System Analyst");
    expect(badge60.label).toBe("System Analyst");
  });

  it("should return Junior Analyst for score < 60", () => {
    const badge59 = getScoreBadge(59);
    const badge0 = getScoreBadge(0);
    expect(badge59.label).toBe("Junior Analyst");
    expect(badge0.label).toBe("Junior Analyst");
  });
});

describe("calculateModelScore logic", () => {
  it("should recommend Waterfall when waterfall answers dominate", () => {
    const answers: Record<string, "waterfall" | "agile"> = {
      q1: "waterfall",
      q2: "waterfall",
      q3: "waterfall",
      q4: "agile",
      q5: "agile",
    };
    const result = calculateModelScore(answers, 5);
    expect(result.model).toBe("waterfall");
    expect(result.score).toBe(60);
  });

  it("should recommend Agile when agile answers dominate", () => {
    const answers: Record<string, "waterfall" | "agile"> = {
      q1: "agile",
      q2: "agile",
      q3: "agile",
      q4: "agile",
      q5: "waterfall",
    };
    const result = calculateModelScore(answers, 5);
    expect(result.model).toBe("agile");
    expect(result.score).toBe(80);
  });

  it("should handle tie by defaulting to waterfall with equal score calculation", () => {
    const answers: Record<string, "waterfall" | "agile"> = {
      q1: "waterfall",
      q2: "agile",
    };
    const result = calculateModelScore(answers, 2);
    expect(result.model).toBe("waterfall");
    expect(result.score).toBe(50);
  });
});

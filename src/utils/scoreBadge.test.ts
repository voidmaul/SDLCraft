import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getScoreBadge } from "./scoreBadge.ts";
import { calculateModelScore } from "../data/comparisonData.ts";

describe("scoreBadge & certification tiers", () => {
  it("should return Lead Solution Architect for score > 85", () => {
    const badge = getScoreBadge(90);
    assert.equal(badge.label, "Lead Solution Architect");
    assert.equal(badge.subtitle, "Pemahaman Sangat Matang");
  });

  it("should return System Analyst for score between 60 and 85", () => {
    const badge85 = getScoreBadge(85);
    const badge60 = getScoreBadge(60);
    assert.equal(badge85.label, "System Analyst");
    assert.equal(badge60.label, "System Analyst");
  });

  it("should return Junior Analyst for score < 60", () => {
    const badge59 = getScoreBadge(59);
    const badge0 = getScoreBadge(0);
    assert.equal(badge59.label, "Junior Analyst");
    assert.equal(badge0.label, "Junior Analyst");
  });
});

describe("calculateModelScore logic", () => {
  it("should recommend Waterfall when waterfall answers dominate", () => {
    const answers: Record<string, "waterfall" | "agile" | "both"> = {
      q1: "waterfall",
      q2: "waterfall",
      q3: "waterfall",
      q4: "agile",
      q5: "agile",
    };
    const result = calculateModelScore(answers, 5);
    assert.equal(result.model, "waterfall");
    assert.equal(result.score, 60);
  });

  it("should recommend Agile when agile answers dominate", () => {
    const answers: Record<string, "waterfall" | "agile" | "both"> = {
      q1: "agile",
      q2: "agile",
      q3: "agile",
      q4: "agile",
      q5: "waterfall",
    };
    const result = calculateModelScore(answers, 5);
    assert.equal(result.model, "agile");
    assert.equal(result.score, 80);
  });

  it("should handle tie by defaulting to waterfall with equal score calculation", () => {
    const answers: Record<string, "waterfall" | "agile" | "both"> = {
      q1: "waterfall",
      q2: "agile",
    };
    const result = calculateModelScore(answers, 2);
    assert.equal(result.model, "waterfall");
    assert.equal(result.score, 50);
  });
});

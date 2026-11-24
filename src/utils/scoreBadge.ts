import { Star, Target, BookOpen } from "lucide-react";

/** Ambang kelulusan tunggal yang dipakai kuis, confetti, dan lencana. */
export const PASS_SCORE = 70;

export interface AnswerRecord {
  questionId: number;
  phaseId: string;
  selectedOptionId: string;
  isCorrect: boolean;
}

export interface ScoreBadge {
  label: string;
  subtitle: string;
  color: string;
  bg: string;
  border: string;
  dark: string;
  icon: React.ElementType;
  /** True bila skor memenuhi ambang kelulusan (PASS_SCORE). */
  passed: boolean;
}

export function isPassingScore(score: number): boolean {
  return score >= PASS_SCORE;
}

export function getScoreBadge(score: number): ScoreBadge {
  if (score > 85) {
    return {
      label: "Lead Solution Architect",
      subtitle: "Pemahaman Sangat Matang",
      color: "text-violet-700",
      bg: "bg-violet-50",
      border: "border-violet-900",
      dark: "bg-violet-900",
      icon: Star,
      passed: true,
    };
  }

  if (score >= PASS_SCORE) {
    return {
      label: "System Analyst",
      subtitle: "Lulus / Pemahaman alur matang",
      color: "text-sky-700",
      bg: "bg-sky-50",
      border: "border-sky-900",
      dark: "bg-sky-900",
      icon: Target,
      passed: true,
    };
  }

  if (score >= 60) {
    return {
      label: "System Analyst",
      subtitle: "Progres baik — belum lulus",
      color: "text-sky-700",
      bg: "bg-sky-50",
      border: "border-sky-900",
      dark: "bg-sky-900",
      icon: Target,
      passed: false,
    };
  }

  return {
    label: "Junior Analyst",
    subtitle: "Perlu penguatan konsep dasar",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-900",
    dark: "bg-amber-900",
    icon: BookOpen,
    passed: false,
  };
}

import { Star, Target, BookOpen } from "lucide-react";

export interface AnswerRecord {
  questionId: number;
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
    };
  } else if (score >= 60) {
    return {
      label: "System Analyst",
      subtitle: "Pemahaman Alur Baik",
      color: "text-sky-700",
      bg: "bg-sky-50",
      border: "border-sky-900",
      dark: "bg-sky-900",
      icon: Target,
    };
  } else {
    return {
      label: "Junior Analyst",
      subtitle: "Perlu Penguatan Konsep",
      color: "text-amber-700",
      bg: "bg-amber-50",
      border: "border-amber-900",
      dark: "bg-amber-900",
      icon: BookOpen,
    };
  }
}

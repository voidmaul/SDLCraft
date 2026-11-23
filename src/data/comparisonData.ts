import type { ElementType } from "react";
import {
  RefreshCw,
  Users,
  Clock,
  FileText,
  Zap,
  Shield,
  TrendingUp,
  Layers,
} from "lucide-react";

export interface WaterfallPhaseItem {
  name: string;
  color: string;
}

export const waterfallPhases: WaterfallPhaseItem[] = [
  { name: "Planning", color: "bg-violet-600 border-violet-900" },
  { name: "Analysis", color: "bg-sky-600 border-sky-900" },
  { name: "Design", color: "bg-cyan-600 border-cyan-900" },
  { name: "Development", color: "bg-emerald-600 border-emerald-900" },
  { name: "Testing", color: "bg-amber-500 border-amber-900" },
  { name: "Deployment", color: "bg-orange-500 border-orange-900" },
  { name: "Maintenance", color: "bg-rose-600 border-rose-900" },
];

export interface AgileSprintItem {
  name: string;
  color: string;
}

export const agileSprintCycle: AgileSprintItem[] = [
  { name: "Sprint\nPlanning", color: "bg-indigo-600 border-indigo-900" },
  { name: "Daily\nScrum", color: "bg-blue-600 border-blue-900" },
  { name: "Sprint\nReview", color: "bg-cyan-600 border-cyan-900" },
  { name: "Retro-\nspective", color: "bg-teal-600 border-teal-900" },
  { name: "Backlog\nRefine", color: "bg-green-600 border-green-900" },
  { name: "Sprint\nExecute", color: "bg-emerald-600 border-emerald-900" },
];

export interface ComparisonRow {
  criterion: string;
  icon: ElementType;
  waterfall: { text: string; positive: boolean };
  agile: { text: string; positive: boolean };
}

export const comparisonData: ComparisonRow[] = [
  {
    criterion: "Fleksibilitas Perubahan",
    icon: RefreshCw,
    waterfall: { text: "Sangat terbatas; perubahan mahal di fase lanjut", positive: false },
    agile: { text: "Tinggi; perubahan diakomodasi setiap sprint", positive: true },
  },
  {
    criterion: "Kejelasan Kebutuhan Awal",
    icon: FileText,
    waterfall: { text: "Harus lengkap & final; ideal untuk sistem stabil", positive: true },
    agile: { text: "Bisa berkembang; cocok saat kebutuhan belum jelas", positive: true },
  },
  {
    criterion: "Keterlibatan Klien",
    icon: Users,
    waterfall: { text: "Minim selama development; banyak di awal & akhir", positive: false },
    agile: { text: "Aktif setiap sprint review; feedback berkelanjutan", positive: true },
  },
  {
    criterion: "Waktu ke Produk Pertama",
    icon: Clock,
    waterfall: { text: "Lama; produk baru tersedia di akhir proyek", positive: false },
    agile: { text: "Cepat; ada hasil fungsional tiap dua sampai empat minggu", positive: true },
  },
  {
    criterion: "Dokumentasi",
    icon: Layers,
    waterfall: { text: "Sangat lengkap & terstruktur; ideal untuk audit", positive: true },
    agile: { text: "Lebih minimal; fokus pada working software", positive: false },
  },
  {
    criterion: "Prediktabilitas Biaya",
    icon: TrendingUp,
    waterfall: { text: "Tinggi; scope, biaya, waktu terdefinisi di awal", positive: true },
    agile: { text: "Lebih sulit diprediksi; scope bisa berubah", positive: false },
  },
  {
    criterion: "Risiko Teknis",
    icon: Shield,
    waterfall: { text: "Tinggi; masalah baru terdeteksi di testing akhir", positive: false },
    agile: { text: "Rendah; risiko dideteksi lebih awal per sprint", positive: true },
  },
  {
    criterion: "Ukuran & Kompleksitas Tim",
    icon: Zap,
    waterfall: { text: "Cocok untuk tim besar dengan peran spesialis jelas", positive: true },
    agile: { text: "Optimal untuk tim mandiri beranggotakan 5 sampai 9 orang", positive: true },
  },
];

export interface MatcherQuestion {
  id: string;
  question: string;
  options: { label: string; value: "waterfall" | "agile" }[];
}

export const matcherQuestions: MatcherQuestion[] = [
  {
    id: "requirements",
    question: "Seberapa jelas & stabil kebutuhan proyek?",
    options: [
      { label: "Sangat jelas & tidak akan berubah", value: "waterfall" },
      { label: "Masih berkembang & berpotensi berubah", value: "agile" },
    ],
  },
  {
    id: "timeline",
    question: "Apakah klien butuh demo/prototype cepat?",
    options: [
      { label: "Ya, perlu hasil nyata dalam 1 atau 2 bulan", value: "agile" },
      { label: "Tidak, klien bisa menunggu produk final", value: "waterfall" },
    ],
  },
  {
    id: "client",
    question: "Seberapa aktif klien bisa terlibat?",
    options: [
      { label: "Aktif, siap review setiap sprint", value: "agile" },
      { label: "Minim, hanya di awal dan akhir proyek", value: "waterfall" },
    ],
  },
  {
    id: "compliance",
    question: "Apakah ada regulasi ketat yang menuntut dokumentasi lengkap?",
    options: [
      { label: "Ya (misalnya: sistem keuangan, pemerintahan)", value: "waterfall" },
      { label: "Tidak, fleksibilitas lebih diutamakan", value: "agile" },
    ],
  },
  {
    id: "team",
    question: "Bagaimana ukuran & pengalaman tim?",
    options: [
      { label: "Tim kecil (< 10 orang), siap self-organize", value: "agile" },
      { label: "Tim besar dengan peran spesialis tersegmentasi", value: "waterfall" },
    ],
  },
];

export function calculateModelScore(
  answers: Record<string, "waterfall" | "agile">,
  totalQuestions: number
): { model: "waterfall" | "agile"; score: number } {
  let waterfall = 0;
  let agile = 0;
  Object.values(answers).forEach((v) => {
    if (v === "waterfall") waterfall++;
    if (v === "agile") agile++;
  });

  return waterfall >= agile
    ? { model: "waterfall", score: Math.round((waterfall / totalQuestions) * 100) }
    : { model: "agile", score: Math.round((agile / totalQuestions) * 100) };
}

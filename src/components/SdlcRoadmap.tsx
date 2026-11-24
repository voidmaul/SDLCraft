import { useEffect, useRef, useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  Search,
  Palette,
  Code2,
  TestTube2,
  Rocket,
  Wrench,
  ChevronRight,
  FileText,
  Users,
  BookOpen,
  X,
  ArrowRight,
  CheckCircle2,
  Trophy,
  HelpCircle,
  Target,
  Lightbulb,
} from "lucide-react";
import { sdlcPhases, type SdlcPhase } from "../data/sdlcData";
import { useAudio } from "../hooks/useAudio";

const iconMap: Record<string, React.ElementType> = {
  ClipboardList,
  Search,
  Palette,
  Code2,
  TestTube2,
  Rocket,
  Wrench,
};

const STORAGE_KEY = "sdlc_learned_phases";

interface PhaseCardProps {
  phase: SdlcPhase;
  index: number;
  isSelected: boolean;
  isLearned: boolean;
  onClick: () => void;
}

function PhaseCard({ phase, index, isSelected, isLearned, onClick }: PhaseCardProps) {
  // Fallback agar tidak render crash jika ikon belum terdaftar di iconMap
  const Icon: React.ElementType = iconMap[phase.icon] || HelpCircle;
  const colors = phase.theme;

  return (
    <m.button
      type="button"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35 }}
      whileHover={{ y: -4 }}
      whileTap={{ y: 1 }}
      onClick={onClick}
      aria-pressed={isSelected}
      aria-label={`Fase ${phase.number}: ${phase.name}${isLearned ? " (sudah dipahami)" : ""}`}
      className={`relative flex flex-col items-center gap-2 p-2 sm:p-3 rounded-2xl border-2 cursor-pointer transition-all duration-150 w-full
        ${
          isSelected
            ? `${colors.bg} ${colors.border} shadow-neo`
            : "bg-white border-slate-200 hover:border-slate-900 hover:shadow-neo-sm"
        }`}
    >
      {/* Number tag */}
      <span
        className={`absolute -top-3 -left-3 w-6 h-6 rounded-lg text-[10px] font-black flex items-center justify-center border-2 border-brand-dark
          ${isSelected ? colors.tag : "bg-brand-dark text-brand-yellow"}`}
      >
        {phase.number}
      </span>

      {/* Learned check */}
      {isLearned && (
        <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-sm">
          <CheckCircle2 className="w-3 h-3 text-white" strokeWidth={3} />
        </span>
      )}

      <div
        className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center border-2
          ${isSelected ? "bg-white border-current" : "bg-slate-100 border-slate-200"}`}
      >
        <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isSelected ? colors.accent : "text-slate-600"}`} strokeWidth={2} />
      </div>

      <div className="text-center">
        <p className="text-[10px] sm:text-xs font-black text-slate-900 leading-tight">{phase.name}</p>
        <p className={`text-[11px] sm:text-xs font-semibold mt-0.5 ${isSelected ? colors.accent : "text-slate-600"}`}>
          Fase {phase.number}
        </p>
      </div>
    </m.button>
  );
}

type DetailTab = "overview" | "roles" | "artifacts" | "casestudy" | "practice";

interface DetailPanelProps {
  phase: SdlcPhase;
  isLearned: boolean;
  nextPhase?: SdlcPhase;
  onClose: () => void;
  onToggleLearned: () => void;
  onNextPhase?: () => void;
}

function DetailPanel({
  phase,
  isLearned,
  nextPhase,
  onClose,
  onToggleLearned,
  onNextPhase,
}: DetailPanelProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");
  const [showPracticeAnswer, setShowPracticeAnswer] = useState(false);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  // Fallback agar tidak render crash jika ikon belum terdaftar di iconMap
  const Icon: React.ElementType = iconMap[phase.icon] || HelpCircle;
  const colors = phase.theme;

  const tabs: { id: DetailTab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Tujuan", icon: BookOpen },
    { id: "roles", label: "Peran SI", icon: Users },
    { id: "artifacts", label: "Artefak", icon: FileText },
    { id: "casestudy", label: "Studi Kasus", icon: Search },
    { id: "practice", label: "Latihan", icon: Target },
  ];

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;
    setActiveTab(tabs[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <m.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.98 }}
      transition={{ duration: 0.25 }}
      className={`mt-6 rounded-2xl border-2 ${colors.border} bg-white overflow-hidden shadow-neo`}
    >
      {/* Panel header */}
      <div className={`${colors.bg} border-b-2 ${colors.border} px-4 py-3 sm:px-5 sm:py-4`}>
        {/* Top row: icon + title + close */}
        <div className="flex items-start justify-between gap-2 mb-2 sm:mb-0">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border-2 ${colors.border} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${colors.accent}`} strokeWidth={2} />
            </div>
            <div>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${colors.tag} uppercase tracking-wider`}>
                FASE {phase.number}
              </span>
              <h3 className="text-sm sm:text-base font-black text-slate-900 mt-0.5">{phase.name}</h3>
              <p className="text-xs text-slate-600 font-medium hidden sm:block">{phase.nameId}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup detail fase"
            className="w-8 h-8 rounded-xl bg-white border-2 border-slate-200 hover:border-slate-900 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors flex-shrink-0"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
        {/* Bottom row: Tandai Paham toggle */}
        <div className="mt-2">
          <m.button
            type="button"
            whileHover={{ y: -1 }}
            whileTap={{ y: 1 }}
            onClick={onToggleLearned}
            aria-pressed={isLearned}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border-2 transition-all w-full sm:w-auto justify-center sm:justify-start
              ${
                isLearned
                  ? "bg-emerald-500 text-white border-emerald-700"
                  : "bg-brand-dark text-brand-yellow border-brand-dark hover:shadow-neo-yellow"
              }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
            {isLearned ? "Batalkan Tandai Paham" : "Tandai Paham"}
          </m.button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b-2 border-slate-200 bg-slate-50 overflow-x-auto" role="tablist" aria-label="Detail Fase SDLC">
        {tabs.map((tab, index) => {
          const TabIcon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isSelected}
              aria-controls={`tabpanel-${tab.id}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
              className={`flex items-center gap-1.5 px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-colors -mb-0.5
                ${
                  isSelected
                    ? `${colors.accent} border-current bg-white`
                    : "text-slate-500 border-transparent hover:text-slate-700 hover:bg-white/60"
                }`}
            >
              <TabIcon className="w-3.5 h-3.5" aria-hidden="true" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <m.div
          key={activeTab}
          role="tabpanel"
          id={`tabpanel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
          tabIndex={0}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.18 }}
          className="p-4 sm:p-6"
        >
          {activeTab === "overview" && (
            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-black text-slate-700 mb-2 uppercase tracking-wider flex items-center gap-2">
                  <span className={`w-1 h-4 rounded-full ${colors.solid} inline-block`} />
                  Tujuan Utama (Objective)
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-xl p-4 border-2 border-slate-200">
                  {phase.objective}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-black text-slate-700 mb-3 uppercase tracking-wider flex items-center gap-2">
                  <span className={`w-1 h-4 rounded-full ${colors.solid} inline-block`} />
                  Capaian Pembelajaran
                </h4>
                <ul className="space-y-2">
                  {phase.learningOutcomes.map((outcome, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700 bg-white rounded-lg px-3 py-2 border-2 border-slate-200">
                      <Target className={`w-4 h-4 mt-0.5 flex-shrink-0 ${colors.accent}`} aria-hidden="true" />
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-black text-slate-700 mb-3 uppercase tracking-wider flex items-center gap-2">
                  <span className={`w-1 h-4 rounded-full ${colors.solid} inline-block`} />
                  Aktivitas Kunci
                </h4>
                <ul className="space-y-2">
                  {phase.keyActivities.map((activity, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <ArrowRight className={`w-4 h-4 mt-0.5 flex-shrink-0 ${colors.accent}`} aria-hidden="true" />
                      {activity}
                    </li>
                  ))}
                </ul>
              </div>

              <details className={`rounded-xl border-2 ${colors.border} ${colors.bg} p-4`}>
                <summary className={`text-xs font-black ${colors.accent} uppercase tracking-wider cursor-pointer select-none`}>
                  Glosarium fase ini ({phase.glossary.length} istilah)
                </summary>
                <dl className="mt-3 space-y-2">
                  {phase.glossary.map((entry) => (
                    <div key={entry.term} className="bg-white rounded-lg px-3 py-2 border-2 border-slate-200">
                      <dt className="text-xs font-black text-slate-800">{entry.term}</dt>
                      <dd className="text-xs text-slate-600 leading-relaxed mt-0.5">{entry.definition}</dd>
                    </div>
                  ))}
                </dl>
              </details>
            </div>
          )}

          {activeTab === "roles" && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 font-medium italic mb-4">
                Peran profesional yang terlibat aktif di fase ini:
              </p>
              {phase.roles.map((role, i) => (
                <m.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`rounded-xl border-2 ${colors.border} ${colors.bg} p-4`}
                >
                  <p className={`text-sm font-black ${colors.accent} mb-1`}>{role.title}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{role.description}</p>
                </m.div>
              ))}
            </div>
          )}

          {activeTab === "artifacts" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <h4 className="text-xs font-black text-slate-600 mb-3 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-sm bg-slate-400 inline-block" />
                  Input Dokumen
                </h4>
                <ul className="space-y-2">
                  {phase.artifacts.inputs.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2 border-2 border-slate-200">
                      <ChevronRight className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-slate-500" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className={`text-xs font-black ${colors.accent} mb-3 uppercase tracking-wider flex items-center gap-2`}>
                  <span className={`w-2 h-2 rounded-sm ${colors.solid} inline-block`} />
                  Output Artefak
                </h4>
                <ul className="space-y-2">
                  {phase.artifacts.outputs.map((item, i) => (
                    <li key={i} className={`flex items-start gap-2 text-sm text-slate-700 ${colors.bg} rounded-lg px-3 py-2 border-2 ${colors.border}`}>
                      <ChevronRight className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${colors.accent}`} aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === "casestudy" && (
            <div>
              <div className={`rounded-xl border-l-4 border-current ${colors.accent} ${colors.bg} border-2 ${colors.border} p-5`}>
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className={`w-4 h-4 ${colors.accent}`} aria-hidden="true" />
                  <span className={`text-xs font-black ${colors.accent} uppercase tracking-wider`}>
                    Studi Kasus Ilustratif
                  </span>
                </div>
                <p className="text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-1">Proyek</p>
                <p className="text-sm font-black text-slate-900 mb-3">{phase.caseStudy.projectName}</p>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">{phase.caseStudy.description}</p>
                <div className="bg-white rounded-xl p-3 border-2 border-slate-200">
                  <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest mb-1">Output Kunci</p>
                  <p className="text-sm text-slate-700 font-semibold">{phase.caseStudy.highlight}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "practice" && (
            <div className="space-y-4">
              <div className={`rounded-xl border-2 ${colors.border} ${colors.bg} p-4`}>
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className={`w-4 h-4 ${colors.accent}`} aria-hidden="true" />
                  <span className={`text-xs font-black ${colors.accent} uppercase tracking-wider`}>
                    Latihan Aplikasi
                  </span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{phase.practice.prompt}</p>
              </div>

              <button
                type="button"
                onClick={() => setShowPracticeAnswer((value) => !value)}
                aria-expanded={showPracticeAnswer}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-slate-900 bg-white text-slate-800 text-xs font-black hover:shadow-neo-sm transition-all"
              >
                <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                {showPracticeAnswer ? "Sembunyikan contoh jawaban" : "Lihat contoh jawaban"}
              </button>

              {showPracticeAnswer && (
                <m.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border-2 border-emerald-900 bg-emerald-50 p-4"
                >
                  <p className="text-[11px] font-black text-emerald-700 uppercase tracking-wider mb-1">
                    Contoh jawaban
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">{phase.practice.expectedAnswer}</p>
                </m.div>
              )}
            </div>
          )}
        </m.div>
      </AnimatePresence>

      {/* Next phase navigation */}
      {nextPhase && onNextPhase && (
        <div className="border-t-2 border-slate-200 bg-slate-50 px-4 py-3 sm:px-6 flex items-center justify-between gap-3">
          <p className="text-[11px] font-bold text-slate-600">
            Berikutnya: <span className="font-black text-slate-800">{nextPhase.name}</span>
          </p>
          <button
            type="button"
            onClick={onNextPhase}
            className="flex items-center gap-1.5 text-xs font-black px-3 py-2 rounded-xl bg-brand-dark text-brand-yellow border-2 border-brand-dark hover:shadow-neo-yellow transition-all"
          >
            Fase berikutnya
            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      )}
    </m.div>
  );
}

interface SdlcRoadmapProps {
  focusedPhaseId?: string | null;
  onFocusHandled?: () => void;
}

export default function SdlcRoadmap({ focusedPhaseId, onFocusHandled }: SdlcRoadmapProps) {
  const { playChime, playPop } = useAudio();
  const [selectedPhase, setSelectedPhase] = useState<SdlcPhase | null>(null);
  const [learnedPhases, setLearnedPhases] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return new Set();
      const parsed: unknown = JSON.parse(saved);
      if (!Array.isArray(parsed)) return new Set();
      const validIds = new Set(sdlcPhases.map((phase) => phase.id));
      return new Set(
        parsed.filter((id): id is string => typeof id === "string" && validIds.has(id as SdlcPhase["id"]))
      );
    } catch {
      return new Set();
    }
  });

  // Deep-link dari kuis: pilih fase yang diminta lalu bersihkan sinyalnya.
  useEffect(() => {
    if (!focusedPhaseId) return;
    const phase = sdlcPhases.find((item) => item.id === focusedPhaseId);
    if (phase) {
      setSelectedPhase(phase);
      onFocusHandled?.();
    }
  }, [focusedPhaseId, onFocusHandled]);

  const handlePhaseClick = (phase: SdlcPhase) => {
    setSelectedPhase((prev) => (prev?.id === phase.id ? null : phase));
    playChime();
  };

  const persistLearned = (next: Set<string>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
    } catch {
      // ignore storage errors
    }
  };

  const handleToggleLearned = (phaseId: string) => {
    setLearnedPhases((prev) => {
      const next = new Set(prev);
      if (next.has(phaseId)) {
        next.delete(phaseId);
        playPop();
      } else {
        next.add(phaseId);
        playChime();
      }
      persistLearned(next);
      return next;
    });
  };

  const handleNextPhase = () => {
    if (!selectedPhase) return;
    const index = sdlcPhases.findIndex((phase) => phase.id === selectedPhase.id);
    const next = sdlcPhases[index + 1];
    if (next) {
      setSelectedPhase(next);
      playChime();
    }
  };

  const selectedIndex = selectedPhase
    ? sdlcPhases.findIndex((phase) => phase.id === selectedPhase.id)
    : -1;
  const nextPhase = selectedIndex >= 0 ? sdlcPhases[selectedIndex + 1] : undefined;

  const learnedCount = learnedPhases.size;
  const progressPct = Math.round((learnedCount / sdlcPhases.length) * 100);

  return (
    <section id="roadmap" className="py-14 sm:py-20 px-4 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <m.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-8 sm:mb-12"
        >
          <div className="flex flex-col gap-5">
            <div>
              <span className="inline-block text-[10px] font-black tracking-widest uppercase text-brand-dark bg-brand-yellow px-3 py-1 rounded-lg border-2 border-brand-dark mb-3">
                Visualisasi Interaktif
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                7 Fase SDLC Pipeline
              </h2>
              <p className="text-slate-500 max-w-md text-sm mt-2 leading-relaxed">
                Klik setiap fase untuk menjelajahi tujuan, peran, artefak, dan studi kasus ilustratif.
                Tandai fase yang sudah kamu pahami.
              </p>
            </div>

            {/* Learning Tracker: compact horizontal on mobile */}
            <div className="bg-white border-2 border-slate-900 rounded-2xl p-3 sm:p-4 shadow-neo">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Progress Belajar</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg sm:text-3xl font-black text-slate-900">{learnedCount}</span>
                  <span className="text-xs text-slate-600 font-bold">/ {sdlcPhases.length}</span>
                  <Trophy className="w-4 h-4 text-brand-yellow" aria-hidden="true" />
                </div>
              </div>
              <div
                className="w-full bg-slate-200 rounded-full h-2 overflow-hidden border border-slate-300"
                role="progressbar"
                aria-valuenow={progressPct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Progress belajar fase SDLC"
              >
                <m.div
                  className="h-full bg-brand-yellow rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-[11px] text-slate-600 mt-1 font-mono">{progressPct}% dipelajari</p>
            </div>
          </div>
        </m.div>

        {/* Phase grid: 4 col on mobile, 7 col on lg */}
        <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-4 relative">
          {sdlcPhases.map((phase, index) => (
            <PhaseCard
              key={phase.id}
              phase={phase}
              index={index}
              isSelected={selectedPhase?.id === phase.id}
              isLearned={learnedPhases.has(phase.id)}
              onClick={() => handlePhaseClick(phase)}
            />
          ))}
        </div>

        {/* Detail panel */}
        <AnimatePresence>
          {selectedPhase && (
            <DetailPanel
              key={selectedPhase.id}
              phase={selectedPhase}
              isLearned={learnedPhases.has(selectedPhase.id)}
              nextPhase={nextPhase}
              onClose={() => setSelectedPhase(null)}
              onToggleLearned={() => handleToggleLearned(selectedPhase.id)}
              onNextPhase={handleNextPhase}
            />
          )}
        </AnimatePresence>

        {!selectedPhase && (
          <m.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-sm text-slate-600 mt-5 font-mono"
          >
            ☝️ Klik fase di atas untuk membuka detail
          </m.p>
        )}
      </div>
    </section>
  );
}

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

interface PhaseCardProps {
  phase: SdlcPhase;
  index: number;
  isSelected: boolean;
  isLearned: boolean;
  onClick: () => void;
}

function PhaseCard({ phase, index, isSelected, isLearned, onClick }: PhaseCardProps) {
  const Icon = iconMap[phase.icon];
  const colors = phase.theme;

  return (
    <motion.button
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35 }}
      whileHover={{ y: -4 }}
      whileTap={{ y: 1 }}
      onClick={onClick}
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
        <p className={`text-[9px] sm:text-[10px] font-semibold mt-0.5 ${isSelected ? colors.accent : "text-slate-400"}`}>
          Fase {phase.number}
        </p>
      </div>
    </motion.button>
  );
}

interface DetailPanelProps {
  phase: SdlcPhase;
  isLearned: boolean;
  onClose: () => void;
  onMarkLearned: () => void;
}

function DetailPanel({ phase, isLearned, onClose, onMarkLearned }: DetailPanelProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "roles" | "artifacts" | "casestudy">("overview");
  const Icon = iconMap[phase.icon];
  const colors = phase.theme;

  const tabs = [
    { id: "overview" as const, label: "Tujuan", icon: BookOpen },
    { id: "roles" as const, label: "Peran SI", icon: Users },
    { id: "artifacts" as const, label: "Artefak", icon: FileText },
    { id: "casestudy" as const, label: "Studi Kasus", icon: Search },
  ];

  return (
    <motion.div
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
              <p className="text-xs text-slate-500 font-medium hidden sm:block">{phase.nameId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white border-2 border-slate-200 hover:border-slate-900 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors flex-shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
        {/* Bottom row: Tandai Paham button */}
        <div className="mt-2">
          {!isLearned ? (
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ y: 1 }}
              onClick={onMarkLearned}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-brand-dark text-brand-yellow border-2 border-brand-dark hover:shadow-neo-yellow transition-all w-full sm:w-auto justify-center sm:justify-start"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Tandai Paham
            </motion.button>
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-500 text-white border-2 border-emerald-700 w-full sm:w-auto justify-center sm:justify-start">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Sudah Paham ✓
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b-2 border-slate-200 bg-slate-50 overflow-x-auto" role="tablist" aria-label="Detail Fase SDLC">
        {tabs.map((tab) => {
          const TabIcon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isSelected}
              aria-controls={`tabpanel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
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
        <motion.div
          key={activeTab}
          role="tabpanel"
          id={`tabpanel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
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
                  <span className={`w-1 h-4 rounded-full ${colors.tag.split(" ")[0]} inline-block`} />
                  Tujuan Utama (Objective)
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-xl p-4 border-2 border-slate-200">
                  {phase.objective}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-700 mb-3 uppercase tracking-wider flex items-center gap-2">
                  <span className={`w-1 h-4 rounded-full ${colors.tag.split(" ")[0]} inline-block`} />
                  Aktivitas Kunci
                </h4>
                <ul className="space-y-2">
                  {phase.keyActivities.map((activity, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <ArrowRight className={`w-4 h-4 mt-0.5 flex-shrink-0 ${colors.accent}`} />
                      {activity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === "roles" && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400 font-medium italic mb-4">
                Peran profesional yang terlibat aktif di fase ini:
              </p>
              {phase.roles.map((role, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`rounded-xl border-2 ${colors.border} ${colors.bg} p-4`}
                >
                  <p className={`text-sm font-black ${colors.accent} mb-1`}>{role.title}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{role.description}</p>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === "artifacts" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <h4 className="text-xs font-black text-slate-500 mb-3 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-sm bg-slate-400 inline-block" />
                  Input Dokumen
                </h4>
                <ul className="space-y-2">
                  {phase.artifacts.inputs.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2 border-2 border-slate-200">
                      <ChevronRight className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-slate-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className={`text-xs font-black ${colors.accent} mb-3 uppercase tracking-wider flex items-center gap-2`}>
                  <span className={`w-2 h-2 rounded-sm ${colors.tag.split(" ")[0]} inline-block`} />
                  Output Artefak
                </h4>
                <ul className="space-y-2">
                  {phase.artifacts.outputs.map((item, i) => (
                    <li key={i} className={`flex items-start gap-2 text-sm text-slate-700 ${colors.bg} rounded-lg px-3 py-2 border-2 ${colors.border}`}>
                      <ChevronRight className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${colors.accent}`} />
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
                  <BookOpen className={`w-4 h-4 ${colors.accent}`} />
                  <span className={`text-xs font-black ${colors.accent} uppercase tracking-wider`}>
                    Studi Kasus Nyata
                  </span>
                </div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Proyek</p>
                <p className="text-sm font-black text-slate-900 mb-3">{phase.caseStudy.projectName}</p>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">{phase.caseStudy.description}</p>
                <div className="bg-white rounded-xl p-3 border-2 border-slate-200">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Output Kunci</p>
                  <p className="text-sm text-slate-700 font-semibold">{phase.caseStudy.highlight}</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

export default function SdlcRoadmap() {
  const { playChime } = useAudio();
  const [selectedPhase, setSelectedPhase] = useState<SdlcPhase | null>(null);
  const [learnedPhases, setLearnedPhases] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem("sdlc_learned_phases");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const handlePhaseClick = (phase: SdlcPhase) => {
    setSelectedPhase((prev) => (prev?.id === phase.id ? null : phase));
    playChime();
  };

  const handleMarkLearned = (phaseId: string) => {
    setLearnedPhases((prev) => {
      const next = new Set(prev);
      next.add(phaseId);
      try {
        localStorage.setItem("sdlc_learned_phases", JSON.stringify(Array.from(next)));
      } catch {
        // ignore storage errors
      }
      return next;
    });
    playChime();
  };

  const learnedCount = learnedPhases.size;
  const progressPct = Math.round((learnedCount / sdlcPhases.length) * 100);

  return (
    <section id="roadmap" className="py-14 sm:py-20 px-4 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
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
                Klik setiap fase untuk menjelajahi tujuan, peran, artefak, dan studi kasus nyata.
                Tandai fase yang sudah kamu pahami.
              </p>
            </div>

            {/* Learning Tracker — compact horizontal on mobile */}
            <div className="bg-white border-2 border-slate-900 rounded-2xl p-3 sm:p-4 shadow-neo">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Progress Belajar</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg sm:text-3xl font-black text-slate-900">{learnedCount}</span>
                  <span className="text-xs text-slate-400 font-bold">/ {sdlcPhases.length}</span>
                  <Trophy className="w-4 h-4 text-brand-yellow" />
                </div>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden border border-slate-300">
                <motion.div
                  className="h-full bg-brand-yellow rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1 font-mono">{progressPct}% dipelajari</p>
            </div>
          </div>
        </motion.div>

        {/* Phase grid — 4 col on mobile, 7 col on lg */}
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
              phase={selectedPhase}
              isLearned={learnedPhases.has(selectedPhase.id)}
              onClose={() => setSelectedPhase(null)}
              onMarkLearned={() => handleMarkLearned(selectedPhase.id)}
            />
          )}
        </AnimatePresence>

        {!selectedPhase && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-sm text-slate-400 mt-5 font-mono"
          >
            ☝️ Klik fase di atas untuk membuka detail
          </motion.p>
        )}
      </div>
    </section>
  );
}

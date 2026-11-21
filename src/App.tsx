import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  HelpCircle,
  Menu,
  X,
  GraduationCap,
  ChevronDown,
  ArrowRight,
  BookOpen,
  Terminal,
  Zap,
  Users,
  Volume2,
  VolumeX,
} from "lucide-react";
import SdlcRoadmap from "./components/SdlcRoadmap";
import ModelComparison from "./components/ModelComparison";
import QuizSection from "./components/QuizSection";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AudioProvider } from "./context/AudioContext";
import { useAudio } from "./hooks/useAudio";

type NavSection = "roadmap" | "comparison" | "quiz";

const navItems: { id: NavSection; label: string; icon: React.ElementType }[] = [
  { id: "roadmap", label: "SDLC Roadmap", icon: Layers },
  { id: "comparison", label: "Waterfall vs Agile", icon: BookOpen },
  { id: "quiz", label: "Kuis Studi Kasus", icon: HelpCircle },
];

function Navbar() {
  const { muted, toggleMute } = useAudio();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<NavSection>("roadmap");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id as NavSection);
          }
        });
      },
      {
        rootMargin: "-20% 0px -60% 0px",
      }
    );

    const sections: NavSection[] = ["roadmap", "comparison", "quiz"];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const scrollTo = (id: NavSection) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-brand-dark/95 backdrop-blur-sm border-b-2 border-brand-yellow/30"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-yellow flex items-center justify-center shadow-neo-sm">
            <GraduationCap className="w-4 h-4 text-brand-dark" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-extrabold text-white leading-tight tracking-tight">SDLCraft</p>
            <p className="text-[10px] text-slate-400 leading-tight font-mono">Interactive SDLC Explorer</p>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 border
                ${
                  activeSection === id
                    ? "bg-brand-yellow text-brand-dark border-brand-yellow shadow-neo-sm"
                    : "text-slate-300 border-transparent hover:text-white hover:border-slate-600 hover:bg-white/5"
                }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleMute}
            className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
            title={muted ? "Aktifkan Audio" : "Matikan Audio"}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </motion.button>
          <button
            className="md:hidden p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="md:hidden bg-brand-dark border-t-2 border-slate-800 px-4 pb-4 pt-2"
          >
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="w-full flex items-center gap-3 px-4 py-4 rounded-xl text-base font-bold text-slate-200 active:bg-white/10 text-left mt-1 border border-transparent"
              >
                <span className="w-8 h-8 rounded-lg bg-brand-yellow/10 border border-brand-yellow/30 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-brand-yellow" />
                </span>
                {label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function HeroSection() {
  const scrollToRoadmap = () =>
    document.getElementById("roadmap")?.scrollIntoView({ behavior: "smooth" });

  const features = [
    { icon: Layers, label: "7 Fase SDLC", sub: "Visual & Interaktif" },
    { icon: Terminal, label: "Studi Kasus Nyata", sub: "Berbasis Skenario" },
    { icon: Zap, label: "Kuis Gamifikasi", sub: "Streak & Badge" },
    { icon: Users, label: "Multi Peran", sub: "BA, SA, PO, QA" },
  ];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-16 bg-brand-dark overflow-hidden">
      {/* Dot grid background */}
      <div
        className="absolute inset-0 opacity-100"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      {/* Top horizontal rule accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-brand-yellow" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative text-center w-full max-w-4xl mx-auto"
      >

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-[1.05] mb-5 tracking-tight">
          Kuasai{" "}
          <span className="relative inline-block">
            <span className="text-brand-yellow">SDLC</span>
            <motion.span
              className="absolute -bottom-1 left-0 right-0 h-1.5 bg-brand-yellow rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            />
          </span>
          <br />
          Seperti Pro.
        </h1>

        <p className="text-slate-400 text-base sm:text-lg mb-4 max-w-2xl mx-auto leading-relaxed">
          Platform interaktif belajar SDLC & Software Engineering untuk
          <strong className="text-slate-200"> pelajar, mahasiswa</strong>, career shifter, dan siapa saja yang ingin
          memahami cara kerja<strong className="text-brand-yellow"> rekayasa perangkat lunak</strong> secara profesional.
        </p>

        <p className="text-slate-500 text-sm mb-8 max-w-xl mx-auto hidden sm:block">
          Bukan hafalan teori — eksplorasi 7 fase alur pengembangan software secara visual,
          komparasi model SDLC, dan uji dirimu dengan kuis berbasis skenario nyata di lapangan.
        </p>

        {/* Feature cards — 2 col on mobile, 4 col on sm+ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 w-full max-w-2xl mx-auto mb-8">
          {features.map(({ icon: Icon, label, sub }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className="bg-white/5 border border-white/10 rounded-xl p-2.5 sm:p-3 text-left hover:border-brand-yellow/40 transition-colors"
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-brand-yellow mb-1.5" strokeWidth={2} />
              <p className="text-white text-[11px] sm:text-xs font-bold">{label}</p>
              <p className="text-slate-500 text-[9px] sm:text-[10px] mt-0.5">{sub}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA — stack on mobile */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center w-full sm:w-auto">
          <motion.button
            whileHover={{ y: -2, boxShadow: "6px 6px 0px #FFC908" }}
            whileTap={{ y: 1 }}
            onClick={scrollToRoadmap}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 bg-brand-yellow text-brand-dark font-black text-sm rounded-xl border-2 border-brand-dark shadow-neo transition-all"
          >
            Mulai Eksplorasi
            <ArrowRight className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ y: 1 }}
            onClick={() => document.getElementById("quiz")?.scrollIntoView({ behavior: "smooth" })}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 bg-transparent text-white font-bold text-sm rounded-xl border-2 border-slate-600 hover:border-slate-400 transition-all"
          >
            Langsung Kuis
            <HelpCircle className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-px h-8 bg-gradient-to-b from-transparent to-slate-600" />
        <ChevronDown className="w-4 h-4 text-slate-600" />
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-brand-dark border-t-2 border-brand-yellow/30 text-slate-400 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-brand-yellow flex items-center justify-center shadow-neo">
                <GraduationCap className="w-5 h-5 text-brand-dark" />
              </div>
              <div>
                <p className="font-black text-white text-base tracking-tight">SDLCraft</p>
                <p className="text-xs text-slate-500 font-mono">SDLC Interactive Explorer</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              Media belajar interaktif untuk siapa saja — pelajar, mahasiswa, career shifter,
              maupun junior professional — yang ingin memahami alur rekayasa perangkat lunak secara mendalam.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-xs">
            <div>
              <p className="font-bold text-slate-300 mb-2 uppercase tracking-wider text-[10px]">Navigasi</p>
              {navItems.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
                  className="block text-slate-500 hover:text-brand-yellow transition-colors mb-1 text-left"
                >
                  {label}
                </button>
              ))}
            </div>
            <div>
              <p className="font-bold text-slate-300 mb-2 uppercase tracking-wider text-[10px]">Peran SI</p>
              {["Business Analyst", "System Analyst", "Product Owner", "QA Engineer", "DevOps"].map((r) => (
                <p key={r} className="text-slate-600 mb-1">{r}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 text-xs">
          <p className="text-slate-600 font-mono text-center sm:text-left">
            © 2026 SDLCraft · Interactive SDLC Learning Platform
          </p>
        </div>
      </div>
    </footer>
  );
}

function MainContent() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased">
      <Navbar />
      <main>
        <HeroSection />
        <SdlcRoadmap />
        <ModelComparison />
        <QuizSection />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AudioProvider>
        <MainContent />
      </AudioProvider>
    </ErrorBoundary>
  );
}

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
          ? "bg-white/95 backdrop-blur-md border-b-2 border-slate-900 shadow-neo-sm"
          : "bg-slate-50/90 backdrop-blur-sm border-b-2 border-slate-200"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-yellow flex items-center justify-center border-2 border-slate-900 shadow-neo-sm">
            <GraduationCap className="w-4 h-4 text-slate-900" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-black text-slate-900 leading-tight tracking-tight">SDLCraft</p>
            <p className="text-[10px] text-slate-500 leading-tight font-mono">Belajar SDLC Interaktif</p>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1.5" aria-label="Navigasi Utama">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 border-2
                ${
                  activeSection === id
                    ? "bg-brand-yellow text-slate-900 border-slate-900 shadow-neo-sm"
                    : "text-slate-600 border-transparent hover:text-slate-900 hover:border-slate-900 hover:bg-white"
                }`}
            >
              <Icon className="w-3.5 h-3.5" aria-hidden="true" />
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
            className="p-2 rounded-lg border-2 border-slate-900 bg-white text-slate-700 hover:bg-brand-yellow hover:text-slate-900 transition-colors shadow-neo-sm"
            title={muted ? "Aktifkan Audio" : "Matikan Audio"}
            aria-label={muted ? "Aktifkan Audio" : "Matikan Audio"}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </motion.button>
          <button
            className="md:hidden p-2 rounded-lg border-2 border-slate-900 bg-white text-slate-700 hover:bg-brand-yellow hover:text-slate-900 transition-colors shadow-neo-sm"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu navigasi"
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
            className="md:hidden bg-white border-t-2 border-slate-900 px-4 pb-4 pt-2 shadow-neo"
          >
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-100 text-left mt-1 border-2 border-transparent hover:border-slate-900 transition-all"
              >
                <span className="w-8 h-8 rounded-lg bg-brand-yellow border-2 border-slate-900 flex items-center justify-center flex-shrink-0 shadow-neo-sm">
                  <Icon className="w-4 h-4 text-slate-900" />
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
    { icon: Layers, label: "7 Alur Terarah", sub: "Pahami alur kerja tim dari nol sampai rilis" },
    { icon: Terminal, label: "Studi Kasus Nyata", sub: "Kupas tuntas contoh proyek lapangan" },
    { icon: Zap, label: "Simulator Model Kerja", sub: "Temukan kecocokan Waterfall dan Agile" },
    { icon: Users, label: "Kuis Praktis Interaktif", sub: "Asah insting analis dan raih lencana kamu" },
  ];

  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 pt-28 pb-16 bg-slate-50 overflow-hidden">
      {/* Dot grid background - light neobrutalism pattern */}
      <div
        className="absolute inset-0 opacity-100 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(15, 23, 42, 0.08) 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      />
      {/* Top horizontal rule accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-yellow border-b border-slate-900/10" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative text-center w-full max-w-4xl mx-auto"
      >
        {/* Pill highlight */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-yellow border-2 border-slate-900 shadow-neo-sm mb-5">
          <Zap className="w-3.5 h-3.5 text-slate-900 fill-slate-900" />
          <span className="text-xs font-black text-slate-900 tracking-wide">
            Eksplorasi Rekayasa Perangkat Lunak Jadi Lebih Menyenangkan
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 leading-[1.08] mb-5 tracking-tight">
          Paham Alur{" "}
          <span className="relative inline-block mx-1">
            <span className="relative z-10 px-2.5 py-0.5 text-slate-900 bg-brand-yellow rounded-xl border-2 border-slate-900 shadow-neo-sm">
              SDLC
            </span>
          </span>
          <br />
          Lebih Nyata dan Seru.
        </h1>

        <p className="text-slate-700 text-base sm:text-lg mb-3 max-w-2xl mx-auto leading-relaxed font-medium">
          Tempat belajar santai untuk kamu yang penasaran bagaimana aplikasi digital dibangun oleh tim profesional.
          Mulai dari obrolan kebutuhan bareng klien, perancangan sistem, pengujian menyeluruh, hingga aplikasi sukses digunakan banyak orang.
        </p>

        <p className="text-slate-500 text-sm mb-8 max-w-xl mx-auto hidden sm:block">
          Mari eksplorasi setiap tahapan secara visual, coba simulasi pemilihan model kerja, dan uji insting kamu lewat skenario nyata di dunia kerja.
        </p>

        {/* Feature cards: 2 col on mobile, 4 col on sm+ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 w-full max-w-3xl mx-auto mb-9">
          {features.map(({ icon: Icon, label, sub }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className="bg-white border-2 border-slate-900 rounded-2xl p-3 sm:p-3.5 text-left shadow-neo-sm hover:shadow-neo hover:-translate-y-0.5 transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-100 border-2 border-slate-900 flex items-center justify-center mb-2 shadow-neo-sm">
                <Icon className="w-4 h-4 text-slate-900" strokeWidth={2.5} />
              </div>
              <p className="text-slate-900 text-xs sm:text-sm font-black leading-snug">{label}</p>
              <p className="text-slate-500 text-[10px] sm:text-xs mt-1 leading-relaxed">{sub}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA: stack on mobile */}
        <div className="flex flex-col sm:flex-row gap-3.5 justify-center w-full sm:w-auto items-center">
          <motion.button
            whileHover={{ y: -2, boxShadow: "6px 6px 0px #0F172A" }}
            whileTap={{ y: 1 }}
            onClick={scrollToRoadmap}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 bg-brand-yellow text-slate-900 font-black text-sm rounded-xl border-2 border-slate-900 shadow-neo transition-all cursor-pointer"
          >
            Mulai Jelajahi Alur
            <ArrowRight className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ y: -2, boxShadow: "4px 4px 0px #0F172A" }}
            whileTap={{ y: 1 }}
            onClick={() => document.getElementById("quiz")?.scrollIntoView({ behavior: "smooth" })}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 bg-white text-slate-900 font-bold text-sm rounded-xl border-2 border-slate-900 shadow-neo-sm hover:bg-slate-50 transition-all cursor-pointer"
          >
            Langsung Coba Kuis
            <HelpCircle className="w-4 h-4 text-slate-700" />
          </motion.button>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-[10px] font-mono text-slate-400 font-bold">Scroll ke bawah</span>
        <ChevronDown className="w-4 h-4 text-slate-500" />
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-white border-t-2 border-slate-900 text-slate-700 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-brand-yellow border-2 border-slate-900 flex items-center justify-center shadow-neo-sm">
                <GraduationCap className="w-5 h-5 text-slate-900" />
              </div>
              <div>
                <p className="font-black text-slate-900 text-base tracking-tight">SDLCraft</p>
                <p className="text-xs text-slate-500 font-mono">Belajar Rekayasa Perangkat Lunak</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 max-w-sm leading-relaxed">
              Ruang belajar interaktif bagi siapa saja yang ingin memahami alur kerja tim teknologi dengan cara yang seru dan mudah dipahami.
              Sangat cocok untuk rekan mahasiswa, pemula, maupun kamu yang sedang bersiap melangkah ke industri perangkat lunak.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-xs">
            <div>
              <p className="font-black text-slate-900 mb-3 uppercase tracking-wider text-[11px]">Navigasi Cepat</p>
              {navItems.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
                  className="block text-slate-600 hover:text-slate-900 font-bold transition-colors mb-2 text-left"
                >
                  {label}
                </button>
              ))}
            </div>
            <div>
              <p className="font-black text-slate-900 mb-3 uppercase tracking-wider text-[11px]">Peran di Industri</p>
              {["Business Analyst", "System Analyst", "Product Owner", "QA Engineer", "DevOps Engineer"].map((r) => (
                <p key={r} className="text-slate-600 mb-2 font-medium">{r}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t-2 border-slate-100 pt-6 text-xs flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-500 font-mono">
          <p className="text-center sm:text-left">
            © 2026 SDLCraft. Bersama memahami cara membangun aplikasi yang berkualitas.
          </p>
          <p className="text-[11px] text-slate-400">
            Dibuat dengan semangat belajar teknologi
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

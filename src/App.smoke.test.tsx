import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { LazyMotion, domAnimation, MotionConfig } from "framer-motion";
import App from "./App";
import ModelComparison from "./components/ModelComparison";
import QuizSection from "./components/QuizSection";
import { AudioProvider } from "./context/AudioContext";

// Smoke test: memastikan seluruh pohon komponen (Navbar, Hero, Roadmap,
// fallback section lazy, Footer + AudioProvider & ErrorBoundary) dapat
// dirender tanpa melempar error. Efek browser (localStorage,
// IntersectionObserver, AudioContext) tidak dijalankan saat SSR sehingga
// aman di environment node. Section lazy (Comparison & Quiz) menampilkan
// fallback Suspense saat SSR; label navigasinya tetap dirender oleh Navbar.
describe("App render smoke test", () => {
  it("renders the full component tree without crashing", () => {
    const html = renderToString(<App />);
    expect(html).toContain("SDLCraft");
    expect(html).toContain("7 Fase SDLC Pipeline");
    expect(html).toContain("Waterfall vs Agile");
    expect(html).toContain("Kuis Studi Kasus");
    expect(html).toContain("Memuat");
  });

  it("renders lazy sections (Comparison & Quiz) within the motion/audio providers", () => {
    const html = renderToString(
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion="user">
          <AudioProvider>
            <ModelComparison />
            <QuizSection />
          </AudioProvider>
        </MotionConfig>
      </LazyMotion>
    );
    expect(html).toContain("Waterfall vs. Agile Scrum");
    expect(html).toContain("Interactive Model Matcher");
    expect(html).toContain("Kuis Studi Kasus SDLC");
    expect(html).toContain("Siap Memulai Kuis?");
  });
});

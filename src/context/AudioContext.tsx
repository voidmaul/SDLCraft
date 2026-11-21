import { useState, useEffect, useRef } from "react";
import {
  createAudioContext,
  playCorrect as playCorrectFn,
  playWrong as playWrongFn,
  playPop as playPopFn,
  playChime as playChimeFn,
  playStreak as playStreakFn,
  type AudioCtxRef,
} from "../utils/audio";
import { AudioContext } from "./audioContextDef";

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMuted] = useState<boolean>(() => {
    try {
      return localStorage.getItem("sdlc_audio_muted") === "true";
    } catch {
      return false;
    }
  });

  const ctxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const init = () => {
      if (!ctxRef.current) {
        ctxRef.current = createAudioContext();
      }
    };
    window.addEventListener("pointerdown", init, { once: true });
    return () => window.removeEventListener("pointerdown", init);
  }, []);

  const toggleMute = () => {
    setMuted((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("sdlc_audio_muted", String(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  };

  const getRef = (): AudioCtxRef => ({
    ctx: ctxRef.current,
    muted,
  });

  const playCorrect = () => playCorrectFn(getRef());
  const playWrong = () => playWrongFn(getRef());
  const playPop = () => playPopFn(getRef());
  const playChime = () => playChimeFn(getRef());
  const playStreak = () => playStreakFn(getRef());

  return (
    <AudioContext.Provider
      value={{
        muted,
        toggleMute,
        playCorrect,
        playWrong,
        playPop,
        playChime,
        playStreak,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

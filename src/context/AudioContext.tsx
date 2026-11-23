import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  createAudioContext,
  playCorrect as playCorrectFn,
  playWrong as playWrongFn,
  playPop as playPopFn,
  playChime as playChimeFn,
  playStreak as playStreakFn,
  type AudioCtxRef,
} from "../utils/audio";
import { AudioContext, type AudioContextType } from "./audioContextDef";

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMuted] = useState<boolean>(() => {
    try {
      return localStorage.getItem("sdlc_audio_muted") === "true";
    } catch {
      return false;
    }
  });

  const ctxRef = useRef<AudioContext | null>(null);
  // Ref menjadi sumber kebenaran saat pemutaran audio, sehingga fungsi play
  // tetap stabil (tidak dibuat ulang setiap kali state `muted` berubah).
  const mutedRef = useRef(muted);

  useEffect(() => {
    const init = () => {
      if (!ctxRef.current) {
        try {
          ctxRef.current = createAudioContext();
        } catch {
          // Browser tanpa dukungan Web Audio: biarkan audio nonaktif.
        }
      }
    };
    window.addEventListener("pointerdown", init, { once: true });
    return () => window.removeEventListener("pointerdown", init);
  }, []);

  const toggleMute = useCallback(() => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    try {
      localStorage.setItem("sdlc_audio_muted", String(next));
    } catch {
      // ignore storage errors
    }
    setMuted(next);
  }, []);

  const getRef = useCallback(
    (): AudioCtxRef => ({
      ctx: ctxRef.current,
      muted: mutedRef.current,
    }),
    []
  );

  const playCorrect = useCallback(() => playCorrectFn(getRef()), [getRef]);
  const playWrong = useCallback(() => playWrongFn(getRef()), [getRef]);
  const playPop = useCallback(() => playPopFn(getRef()), [getRef]);
  const playChime = useCallback(() => playChimeFn(getRef()), [getRef]);
  const playStreak = useCallback(() => playStreakFn(getRef()), [getRef]);

  // Hanya `muted` yang berubah seiring render; fungsi play tetap referensi sama,
  // sehingga konsumen (mis. useCallback di QuizSection) tidak ikut invalidasi.
  const value = useMemo<AudioContextType>(
    () => ({
      muted,
      toggleMute,
      playCorrect,
      playWrong,
      playPop,
      playChime,
      playStreak,
    }),
    [muted, toggleMute, playCorrect, playWrong, playPop, playChime, playStreak]
  );

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}

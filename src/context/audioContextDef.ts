import { createContext } from "react";

export interface AudioContextType {
  muted: boolean;
  toggleMute: () => void;
  playCorrect: () => void;
  playWrong: () => void;
  playPop: () => void;
  playChime: () => void;
  playStreak: () => void;
}

export const AudioContext = createContext<AudioContextType | null>(null);

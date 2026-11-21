import { useContext } from "react";
import { AudioContext, type AudioContextType } from "../context/audioContextDef";

export function useAudio(): AudioContextType {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}

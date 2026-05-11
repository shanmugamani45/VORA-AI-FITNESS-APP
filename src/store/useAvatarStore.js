import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAvatarStore = create(
  persist(
    (set) => ({
      visualGender: "female",
      voiceURI: "",
      themeColor: "#00d2ff", // Default Blue
      personality: "supportive", // supportive, drill_sergeant, analytical
      verbosity: "chatty", // chatty, quiet
      
      setVisualGender: (gender) => set({ visualGender: gender }),
      setVoiceURI: (uri) => set({ voiceURI: uri }),
      setThemeColor: (color) => set({ themeColor: color }),
      setPersonality: (style) => set({ personality: style }),
      setVerbosity: (level) => set({ verbosity: level }),
    }),
    {
      name: "avatar-settings-storage", // local storage key
    }
  )
);

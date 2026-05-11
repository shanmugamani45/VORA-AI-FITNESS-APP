import { create } from "zustand";

export const useWorkoutStore = create(() => ({
  dangerScore: 0,
}));

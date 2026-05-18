import { create } from 'zustand';
import type { CycleDay } from '../types';
import { cycleData } from '../data/mock/cycleData';

interface CycleState {
  cycleHistory: CycleDay[];
  selectedDay: CycleDay | null;
  setSelectedDay: (day: CycleDay | null) => void;
}

export const useCycleStore = create<CycleState>((set) => ({
  cycleHistory: cycleData,
  selectedDay: null,
  setSelectedDay: (day) => set({ selectedDay: day }),
}));

import { create } from 'zustand';
import type { WearableDay } from '../types';
import { wearableData } from '../data/mock/wearableData';

interface WearableState {
  wearableHistory: WearableDay[];
  selectedDay: WearableDay | null;
  setSelectedDay: (day: WearableDay | null) => void;
  devices: {
    id: string;
    name: string;
    connected: boolean;
    lastSync: string;
  }[];
}

export const useWearableStore = create<WearableState>(() => ({
  wearableHistory: wearableData,
  selectedDay: null,
  setSelectedDay: (day) => ({ selectedDay: day }),
  devices: [
    { id: 'oura', name: 'Oura Ring Gen 3', connected: true, lastSync: '2026-05-18T07:42:00' },
    { id: 'apple-watch', name: 'Apple Watch Series 9', connected: false, lastSync: '' },
    { id: 'garmin', name: 'Garmin Forerunner 265', connected: false, lastSync: '' },
  ],
}));

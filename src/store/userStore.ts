import { create } from 'zustand';
import type { UserProfile } from '../types';
import { sarahProfile } from '../data/mock/profiles';

interface UserState {
  profile: UserProfile;
  isPartnerView: boolean;
  demoMode: boolean;
  familyPlanningMode: 'contraception' | 'conception';
  setIsPartnerView: (v: boolean) => void;
  setFamilyPlanningMode: (mode: 'contraception' | 'conception') => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: sarahProfile,
  isPartnerView: false,
  demoMode: true,
  familyPlanningMode: 'contraception',
  setIsPartnerView: (v) => set({ isPartnerView: v }),
  setFamilyPlanningMode: (mode) => set({ familyPlanningMode: mode }),
}));

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile } from '../types';
import { sarahProfile } from '../data/mock/profiles';

export type AuthState = 'guest' | 'demo' | 'authenticated';

interface UserState {
  authState: AuthState;
  profile: UserProfile;
  isPartnerView: boolean;
  familyPlanningMode: 'contraception' | 'conception';

  enterDemo: () => void;
  switchToAccount: () => void;
  signup: (data: {
    name: string;
    email: string;
    password: string;
    cycleLength: number;
    periodLength: number;
  }) => void;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setIsPartnerView: (v: boolean) => void;
  setFamilyPlanningMode: (mode: 'contraception' | 'conception') => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      authState: 'guest',
      profile: sarahProfile,
      isPartnerView: false,
      familyPlanningMode: 'contraception',

      enterDemo: () =>
        set({ authState: 'demo', profile: sarahProfile }),

      switchToAccount: () => {
        const stored = localStorage.getItem('mycycle-account');
        if (stored) {
          const { profile } = JSON.parse(stored);
          set({ authState: 'authenticated', profile });
        }
      },

      signup: ({ name, email, password, cycleLength, periodLength }) => {
        const profile: UserProfile = {
          id: `user-${Date.now()}`,
          name,
          email,
          cycleLength,
          periodLength,
          partnerConnected: false,
        };
        localStorage.setItem(
          'mycycle-account',
          JSON.stringify({ email, password, profile }),
        );
        set({ authState: 'authenticated', profile });
      },

      login: (email, password) => {
        const stored = localStorage.getItem('mycycle-account');
        if (stored) {
          const account = JSON.parse(stored);
          if (email === account.email && password === account.password) {
            set({ authState: 'authenticated', profile: account.profile });
            return true;
          }
        }
        if (email === 'sarah@demo.mycycle.app' && password === 'demo2026') {
          set({ authState: 'demo', profile: sarahProfile });
          return true;
        }
        return false;
      },

      logout: () =>
        set({
          authState: 'guest',
          profile: sarahProfile,
          isPartnerView: false,
        }),

      updateProfile: (updates) => {
        const newProfile = { ...get().profile, ...updates };
        set({ profile: newProfile });
        // Persist to account storage so login restores updated profile
        const stored = localStorage.getItem('mycycle-account');
        if (stored) {
          const account = JSON.parse(stored);
          account.profile = newProfile;
          localStorage.setItem('mycycle-account', JSON.stringify(account));
        }
      },

      setIsPartnerView: (v) => set({ isPartnerView: v }),
      setFamilyPlanningMode: (mode) => set({ familyPlanningMode: mode }),
    }),
    {
      name: 'mycycle-auth',
      partialize: (state) => ({
        authState: state.authState,
        profile: state.profile,
      }),
    },
  ),
);

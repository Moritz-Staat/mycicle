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
  signup: (data: {
    name: string;
    email: string;
    password: string;
    cycleLength: number;
    periodLength: number;
  }) => void;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  setIsPartnerView: (v: boolean) => void;
  setFamilyPlanningMode: (mode: 'contraception' | 'conception') => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      authState: 'guest',
      profile: sarahProfile,
      isPartnerView: false,
      familyPlanningMode: 'contraception',

      enterDemo: () =>
        set({ authState: 'demo', profile: sarahProfile }),

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
          'mycicle-account',
          JSON.stringify({ email, password, profile }),
        );
        set({ authState: 'authenticated', profile });
      },

      login: (email, password) => {
        // Check stored signup credentials
        const stored = localStorage.getItem('mycicle-account');
        if (stored) {
          const account = JSON.parse(stored);
          if (email === account.email && password === account.password) {
            set({ authState: 'authenticated', profile: account.profile });
            return true;
          }
        }
        // Check demo credentials
        if (email === 'sarah@demo.mycicle.app' && password === 'demo2026') {
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

      setIsPartnerView: (v) => set({ isPartnerView: v }),
      setFamilyPlanningMode: (mode) => set({ familyPlanningMode: mode }),
    }),
    {
      name: 'mycicle-auth',
      partialize: (state) => ({
        authState: state.authState,
        profile: state.profile,
      }),
    },
  ),
);

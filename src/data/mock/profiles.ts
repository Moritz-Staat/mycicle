import type { UserProfile } from '../../types';

export const sarahProfile: UserProfile = {
  id: 'sarah-001',
  name: 'Sarah Müller',
  email: 'sarah@demo.mycycle.app',
  cycleLength: 29,
  periodLength: 5,
  partnerConnected: true,
};

export const tomProfile: UserProfile = {
  id: 'tom-001',
  name: 'Tom Müller',
  email: 'tom@demo.mycycle.app',
  cycleLength: 0,
  periodLength: 0,
  partnerConnected: true,
  isPartner: true,
};

export const DEMO_CREDENTIALS = {
  sarah: { email: 'sarah@demo.mycycle.app', password: 'demo2026' },
  tom: { email: 'tom@demo.mycycle.app', password: 'partner2026' },
};

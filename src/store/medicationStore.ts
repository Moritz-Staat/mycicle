import { create } from 'zustand';
import type { Medication } from '../types';

interface MedicationLog {
  date: string;
  medicationId: string;
  taken: boolean;
}

interface MedicationState {
  medications: Medication[];
  log: MedicationLog[];
  addMedication: (med: Omit<Medication, 'id'>) => void;
  removeMedication: (id: string) => void;
  toggleMedication: (id: string) => void;
  logIntake: (date: string, medicationId: string, taken: boolean) => void;
  getIntakeForDate: (date: string) => MedicationLog[];
  isTakenOnDate: (date: string, medicationId: string) => boolean;
  hasAnyIntakeOnDate: (date: string) => boolean;
  getMissedForDate: (date: string) => Medication[];
}

/* ─── Demo medications ─── */
const DEMO_MEDICATIONS: Medication[] = [
  { id: 'pill', name: 'Pille (Mikropille)', dosage: '1 Tablette', frequency: 'daily', time: '08:00', active: true },
  { id: 'iron', name: 'Eisenpräparat', dosage: '14mg', frequency: 'daily', time: '10:00', active: true },
  { id: 'magnesium', name: 'Magnesium', dosage: '400mg', frequency: 'as-needed', time: '21:00', active: true },
];

/* ─── Generate demo log: most days taken, some missed ─── */
function generateDemoLog(): MedicationLog[] {
  const log: MedicationLog[] = [];
  const start = new Date('2026-04-20');
  const end = new Date('2026-05-18');

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().slice(0, 10);
    // Pill: taken most days, missed on day 8 and 15 of month
    log.push({ date: dateStr, medicationId: 'pill', taken: d.getDate() !== 8 && d.getDate() !== 15 });
    // Iron: taken most days
    log.push({ date: dateStr, medicationId: 'iron', taken: d.getDate() % 5 !== 0 });
  }
  // Today not yet logged
  return log;
}

export const useMedicationStore = create<MedicationState>((set, get) => ({
  medications: DEMO_MEDICATIONS,
  log: generateDemoLog(),

  addMedication: (med) =>
    set((state) => ({
      medications: [...state.medications, { ...med, id: `med-${Date.now()}` }],
    })),

  removeMedication: (id) =>
    set((state) => ({
      medications: state.medications.filter((m) => m.id !== id),
      log: state.log.filter((l) => l.medicationId !== id),
    })),

  toggleMedication: (id) =>
    set((state) => ({
      medications: state.medications.map((m) =>
        m.id === id ? { ...m, active: !m.active } : m,
      ),
    })),

  logIntake: (date, medicationId, taken) =>
    set((state) => {
      const existing = state.log.findIndex(
        (l) => l.date === date && l.medicationId === medicationId,
      );
      if (existing >= 0) {
        const updated = [...state.log];
        updated[existing] = { date, medicationId, taken };
        return { log: updated };
      }
      return { log: [...state.log, { date, medicationId, taken }] };
    }),

  getIntakeForDate: (date) => get().log.filter((l) => l.date === date),

  isTakenOnDate: (date, medicationId) =>
    get().log.some((l) => l.date === date && l.medicationId === medicationId && l.taken),

  hasAnyIntakeOnDate: (date) =>
    get().log.some((l) => l.date === date && l.taken),

  getMissedForDate: (date) => {
    const { medications, log } = get();
    return medications
      .filter((m) => m.active && m.frequency === 'daily')
      .filter((m) => {
        const entry = log.find((l) => l.date === date && l.medicationId === m.id);
        return !entry || !entry.taken;
      });
  },
}));

import type { CycleDay, CyclePhase } from '../types';

const TODAY = '2026-05-18';

export function getCurrentCycleDay(cycleHistory: CycleDay[]): CycleDay | undefined {
  return cycleHistory.find((d) => d.date === TODAY);
}

export function getCyclePhase(dayOfCycle: number): CyclePhase {
  if (dayOfCycle <= 5) return 'menstruation';
  if (dayOfCycle <= 13) return 'follicular';
  if (dayOfCycle <= 16) return 'ovulation';
  return 'luteal';
}

export function getFertileWindow(cycleHistory: CycleDay[]): CycleDay[] {
  // Find ovulation day(s) in current cycle
  const currentCycle = getCurrentCycle(cycleHistory);
  return currentCycle.filter(
    (d) => d.dayOfCycle >= 11 && d.dayOfCycle <= 16
  );
}

export function getCurrentCycle(cycleHistory: CycleDay[]): CycleDay[] {
  // Current cycle: days with dayOfCycle starting from 1 in the latest cycle
  const sorted = [...cycleHistory].sort((a, b) => b.date.localeCompare(a.date));
  if (sorted.length === 0) return [];

  const result: CycleDay[] = [];
  let lastDay = sorted[0].dayOfCycle;

  for (const day of sorted) {
    if (day.dayOfCycle <= lastDay) {
      result.push(day);
      lastDay = day.dayOfCycle;
      if (day.dayOfCycle === 1) break;
    }
  }

  return result.reverse();
}

export function getDeckline(cycleHistory: CycleDay[]): number | undefined {
  // Sensiplan: highest temperature of 6 days before the temperature rise
  const withTemp = cycleHistory
    .filter((d) => d.temperature !== undefined && d.dayOfCycle >= 6 && d.dayOfCycle <= 13)
    .sort((a, b) => a.dayOfCycle - b.dayOfCycle);

  if (withTemp.length < 6) return undefined;

  const last6 = withTemp.slice(-6);
  const maxTemp = Math.max(...last6.map((d) => d.temperature!));
  return parseFloat((maxTemp + 0.05).toFixed(2)); // Decklinie = höchste Temp + 0.05°C Buffer
}

export function predictNextPeriod(cycleHistory: CycleDay[]): string {
  const stats = calculateCycleStats(cycleHistory);
  // Find start of current cycle
  const sorted = [...cycleHistory].sort((a, b) => a.date.localeCompare(b.date));
  const lastCycleStart = sorted.filter((d) => d.dayOfCycle === 1).pop();

  if (!lastCycleStart) return '';

  const startDate = new Date(lastCycleStart.date);
  startDate.setDate(startDate.getDate() + stats.avgLength);
  return startDate.toISOString().split('T')[0];
}

export function calculateCycleStats(cycleHistory: CycleDay[]): {
  avgLength: number;
  avgPeriodLength: number;
  lastCycleLength: number;
} {
  const cycleDays1 = cycleHistory.filter((d) => d.dayOfCycle === 1).sort((a, b) => a.date.localeCompare(b.date));

  if (cycleDays1.length < 2) {
    return { avgLength: 29, avgPeriodLength: 5, lastCycleLength: 29 };
  }

  const lengths: number[] = [];
  for (let i = 1; i < cycleDays1.length; i++) {
    const prev = new Date(cycleDays1[i - 1].date);
    const curr = new Date(cycleDays1[i].date);
    const diff = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
    if (diff > 0 && diff < 50) lengths.push(diff);
  }

  const avgLength = lengths.length > 0
    ? Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length)
    : 29;

  const lastCycleLength = lengths[lengths.length - 1] || 29;

  // Period length: count consecutive menstruation days
  const mensDays = cycleHistory.filter((d) => d.phase === 'menstruation');
  const avgPeriodLength = mensDays.length > 0
    ? Math.round(mensDays.length / Math.max(1, cycleDays1.length))
    : 5;

  return { avgLength, avgPeriodLength, lastCycleLength };
}

export function getPhaseLabel(phase: CyclePhase): string {
  const labels: Record<CyclePhase, string> = {
    menstruation: 'Menstruation',
    follicular: 'Follikelphase',
    ovulation: 'Ovulation',
    luteal: 'Lutealphase',
  };
  return labels[phase];
}

export function getPhaseColor(phase: CyclePhase): string {
  const colors: Record<CyclePhase, string> = {
    menstruation: '#E57373',
    follicular: '#BA68C8',
    ovulation: '#FFD54F',
    luteal: '#4DB6AC',
  };
  return colors[phase];
}

export function getPhaseTailwindBg(phase: CyclePhase): string {
  const classes: Record<CyclePhase, string> = {
    menstruation: 'bg-rose-200 border-rose-400 text-rose-800',
    follicular: 'bg-purple-100 border-purple-300 text-purple-800',
    ovulation: 'bg-amber-200 border-amber-400 text-amber-800',
    luteal: 'bg-teal-100 border-teal-300 text-teal-800',
  };
  return classes[phase];
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('de-DE', { day: 'numeric', month: 'short' });
}

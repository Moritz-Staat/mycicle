import type { CycleDay, CyclePhase, WearableDay } from '../types';

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

// ============================================================
// V2 additions: Multi-cycle overlay + confidence band
// ============================================================


export interface OverlayDataPoint {
  day: number;
  avg: number | null;
  [key: string]: number | null;
}

export interface ConfidenceBandPoint {
  label: string;
  median: number | null;
  band: number | null;
}

/**
 * Split cycleHistory into individual cycles.
 * A new cycle starts when dayOfCycle === 1.
 */
export function splitIntoCycles(data: CycleDay[]): CycleDay[][] {
  const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date));
  const cycles: CycleDay[][] = [];
  let current: CycleDay[] = [];

  for (const day of sorted) {
    if (day.dayOfCycle === 1 && current.length > 0) {
      cycles.push(current);
      current = [];
    }
    current.push(day);
  }
  if (current.length > 0) cycles.push(current);
  return cycles;
}

/**
 * Build overlay data for recharts.
 * Returns array of { day, cycle0, cycle1, ..., avg }
 */
export function buildOverlayData(
  cycles: CycleDay[][],
  metric: 'temperature' | 'hrv',
  wearableHistory?: WearableDay[]
): OverlayDataPoint[] {
  const maxLen = 30;
  const wearMap = new Map((wearableHistory ?? []).map((d) => [d.date, d]));

  const result: OverlayDataPoint[] = [];

  for (let day = 1; day <= maxLen; day++) {
    const point: OverlayDataPoint = { day, avg: null };

    const values: number[] = [];
    cycles.forEach((cycle, i) => {
      const cycleDay = cycle.find((d) => d.dayOfCycle === day);
      let val: number | null = null;

      if (metric === 'temperature' && cycleDay?.temperature !== undefined) {
        val = cycleDay.temperature;
      } else if (metric === 'hrv' && cycleDay) {
        const wear = wearMap.get(cycleDay.date);
        if (wear) val = wear.hrv;
      }

      point[`cycle${i}`] = val;
      if (val !== null) values.push(val);
    });

    point.avg = values.length > 0
      ? parseFloat((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2))
      : null;

    result.push(point);
  }

  return result;
}

export function normalPDF(x: number, mean: number, std: number): number {
  const exp = -0.5 * Math.pow((x - mean) / std, 2);
  return (1 / (std * Math.sqrt(2 * Math.PI))) * Math.exp(exp);
}

/**
 * Build confidence band for the next 20 days.
 * Returns array of { label, median, band } where band is probability density (normalized 0-1).
 */
export function calculateConfidenceBand(cycleHistory: CycleDay[]): ConfidenceBandPoint[] {
  // Find start dates of each cycle
  const sorted = [...cycleHistory].sort((a, b) => a.date.localeCompare(b.date));
  const startDates = sorted.filter((d) => d.dayOfCycle === 1).map((d) => new Date(d.date));

  // Calculate cycle lengths
  const lengths: number[] = [];
  for (let i = 1; i < startDates.length; i++) {
    const diff = Math.round(
      (startDates[i].getTime() - startDates[i - 1].getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diff > 20 && diff < 50) lengths.push(diff);
  }

  const mean = lengths.length > 0
    ? lengths.reduce((a, b) => a + b, 0) / lengths.length
    : 29;
  const std = lengths.length > 1
    ? Math.sqrt(lengths.map((l) => Math.pow(l - mean, 2)).reduce((a, b) => a + b, 0) / lengths.length)
    : 1.5;

  const lastStart = startDates[startDates.length - 1] ?? new Date('2026-05-05');
  const today = new Date('2026-05-18');
  const daysInCycle = Math.round((today.getTime() - lastStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  const result: ConfidenceBandPoint[] = [];

  for (let offset = 0; offset <= 20; offset++) {
    const futureDay = new Date(today);
    futureDay.setDate(futureDay.getDate() + offset);

    const label = offset === 0
      ? 'Heute'
      : futureDay.toLocaleDateString('de-DE', { day: 'numeric', month: 'short' });

    const dayOfCycleAtPoint = daysInCycle + offset;

    const rawPdf = normalPDF(dayOfCycleAtPoint, mean, std);
    // Normalize to 0-1 range using max possible value
    const maxPdf = normalPDF(mean, mean, std);
    const normalized = parseFloat((rawPdf / maxPdf).toFixed(3));

    result.push({
      label,
      median: normalized > 0.05 ? normalized : null,
      band: normalized > 0.01 ? normalized : null,
    });
  }

  return result;
}

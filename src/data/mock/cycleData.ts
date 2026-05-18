import type { CycleDay, CyclePhase } from '../../types';

function dateStr(daysAgo: number): string {
  const d = new Date('2026-05-18');
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

type CervicalMucus = 'dry' | 'moist' | 'creamy' | 'egg-white';

function getPhase(dayOfCycle: number): CyclePhase {
  if (dayOfCycle <= 5) return 'menstruation';
  if (dayOfCycle <= 13) return 'follicular';
  if (dayOfCycle <= 16) return 'ovulation';
  return 'luteal';
}

function getTemperature(dayOfCycle: number, cycleIndex: number): number {
  // Biphasic pattern: lower pre-ovulation, higher post-ovulation
  const base = dayOfCycle <= 13 ? 36.25 : 36.78;
  // Small variations
  const variation = (Math.sin(dayOfCycle * 1.3 + cycleIndex) * 0.12);
  // Dip at ovulation
  const dip = (dayOfCycle === 13 || dayOfCycle === 14) ? -0.15 : 0;
  return parseFloat((base + variation + dip).toFixed(2));
}

function getCervicalMucus(dayOfCycle: number): CervicalMucus {
  if (dayOfCycle <= 5) return 'dry';
  if (dayOfCycle <= 9) return 'moist';
  if (dayOfCycle <= 12) return 'creamy';
  if (dayOfCycle <= 16) return 'egg-white';
  if (dayOfCycle <= 20) return 'creamy';
  return 'dry';
}

function getSymptoms(phase: CyclePhase, dayOfCycle: number): string[] {
  const allSymptoms: Record<CyclePhase, string[][]> = {
    menstruation: [
      ['Krämpfe', 'Müdigkeit'],
      ['Krämpfe', 'Kopfschmerzen', 'Müdigkeit'],
      ['Krämpfe'],
      ['Müdigkeit'],
      [],
    ],
    follicular: [
      ['Energie hoch'],
      [],
      ['Leichte Blähungen'],
      ['Energie hoch'],
      [],
    ],
    ovulation: [
      ['Mittelschmerz', 'Energie hoch'],
      ['Mittelschmerz'],
      ['Leichtes Ziehen'],
    ],
    luteal: [
      ['Blähungen'],
      [],
      ['PMS', 'Stimmungsschwankungen'],
      ['PMS', 'Müdigkeit'],
      ['Brustspannen'],
      ['Müdigkeit'],
      [],
      ['Stimmungsschwankungen'],
    ],
  };

  const options = allSymptoms[phase];
  return options[dayOfCycle % options.length];
}

// Generate 6 cycles, current cycle is on day 14 today (2026-05-18)
// Cycle start = 2026-05-05 (13 days ago, today is day 14)
const CYCLE_LENGTH = 29;
const PERIOD_LENGTH = 5;

export const cycleData: CycleDay[] = [];

// Build from oldest to newest
// 6 cycles total, current cycle day 14
// Cycle 6 (current): started daysAgo = 13 (May 5), day 14 is today
// Cycle 5 started: 13 + 29 = 42 days ago
// Cycle 4: 42 + 29 = 71 days ago
// ...

const cycleStartsAgo = [13, 42, 71, 100, 129, 158];

for (let ci = cycleStartsAgo.length - 1; ci >= 0; ci--) {
  const cycleStartDaysAgo = cycleStartsAgo[ci];
  const isCurrentCycle = ci === 0;
  const cycleMaxDay = isCurrentCycle ? 14 : CYCLE_LENGTH;

  for (let d = 1; d <= cycleMaxDay; d++) {
    const daysAgo = cycleStartDaysAgo - (d - 1);
    const phase = getPhase(d);
    const temp = getTemperature(d, ci);
    const cervicalMucus = getCervicalMucus(d);
    const symptoms = getSymptoms(phase, d);

    // Inject anomaly: in cycle 3 (ci=2), around day 20, HRV dip correlates with temp anomaly
    const isAnomalyDay = ci === 2 && d >= 18 && d <= 22;
    const anomalyTempBoost = isAnomalyDay ? 0.2 : 0;

    // Skip future days
    if (daysAgo < 0) continue;

    // Some days without temperature (realistic gaps)
    const hasTemp = d > (PERIOD_LENGTH - 1) && !(d % 11 === 0);

    cycleData.push({
      date: dateStr(daysAgo),
      dayOfCycle: d,
      phase,
      temperature: hasTemp ? parseFloat((temp + anomalyTempBoost).toFixed(2)) : undefined,
      symptoms,
      cervicalMucus,
      mood: Math.min(5, Math.max(1, Math.round(3 + Math.sin(d * 0.5 + ci) * 1.2))),
      energy: Math.min(5, Math.max(1, Math.round(3 + Math.cos(d * 0.4 + ci) * 1.5))),
      notes: d === 14 && ci === 0 ? 'LH-Test positiv heute!' : undefined,
    });
  }
}

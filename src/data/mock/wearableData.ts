import type { WearableDay } from '../../types';

function dateStr(daysAgo: number): string {
  const d = new Date('2026-05-18');
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

function getHRV(dayIndex: number): number {
  // Baseline 45ms, varies with cycle phase and stress events
  const baseline = 45;
  const cycleVariation = Math.sin(dayIndex * (2 * Math.PI / 29)) * 8;
  const noise = (Math.sin(dayIndex * 7.3) * 4);

  // Anomaly events (stress weeks)
  const isStressWeek1 = dayIndex >= 45 && dayIndex <= 52;
  const isStressWeek2 = dayIndex >= 72 && dayIndex <= 78;
  const stressDip = isStressWeek1 ? -17 : isStressWeek2 ? -12 : 0;

  return Math.max(22, Math.min(75, Math.round(baseline + cycleVariation + noise + stressDip)));
}

function getSleepScore(dayIndex: number): number {
  const base = 74;
  const variation = Math.sin(dayIndex * 0.4) * 12;
  const noise = Math.cos(dayIndex * 2.1) * 5;
  const isStressWeek = (dayIndex >= 45 && dayIndex <= 52) || (dayIndex >= 72 && dayIndex <= 78);
  const stressDip = isStressWeek ? -15 : 0;
  return Math.max(40, Math.min(98, Math.round(base + variation + noise + stressDip)));
}

export const wearableData: WearableDay[] = [];

for (let i = 0; i < 90; i++) {
  const hrv = getHRV(i);
  const sleepScore = getSleepScore(i);
  const deepSleepHours = parseFloat((0.8 + Math.sin(i * 0.3) * 0.4 + (sleepScore < 60 ? -0.3 : 0)).toFixed(1));
  const remSleepHours = parseFloat((1.5 + Math.cos(i * 0.25) * 0.5).toFixed(1));
  const lightSleepHours = parseFloat((3.5 + Math.sin(i * 0.2) * 0.8).toFixed(1));

  wearableData.push({
    date: dateStr(89 - i),
    hrv,
    restingHR: Math.round(62 - (hrv - 45) * 0.3),
    sleepScore,
    deepSleep: Math.max(0.2, deepSleepHours),
    remSleep: Math.max(0.5, remSleepHours),
    lightSleep: Math.max(1.0, lightSleepHours),
    steps: Math.round(7500 + Math.sin(i * 0.8) * 3000 + (i % 7 >= 5 ? -2000 : 0)),
    activeCalories: Math.round(320 + Math.cos(i * 0.7) * 120),
  });
}

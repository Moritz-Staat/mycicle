import type { CycleDay } from '../types';
import { formatShortDate } from '../utils/cycleUtils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface CycleHistoryProps {
  cycleData: CycleDay[];
}

interface CycleSummary {
  startDate: string;
  length: number;
  periodLength: number;
  ovulationDay?: number;
  index: number;
}

export function CycleHistory({ cycleData }: CycleHistoryProps) {
  // Build cycle summaries from data
  const cycles: CycleSummary[] = [];
  const sortedData = [...cycleData].sort((a, b) => a.date.localeCompare(b.date));

  const cycleStarts = sortedData.filter((d) => d.dayOfCycle === 1);

  for (let i = 0; i < cycleStarts.length - 1; i++) {
    const start = new Date(cycleStarts[i].date);
    const nextStart = new Date(cycleStarts[i + 1].date);
    const length = Math.round((nextStart.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    const ovulationDay = sortedData.find(
      (d) => d.date >= cycleStarts[i].date && d.date < cycleStarts[i + 1].date && d.phase === 'ovulation'
    )?.dayOfCycle;

    const periodDays = sortedData.filter(
      (d) => d.date >= cycleStarts[i].date && d.date < cycleStarts[i + 1].date && d.phase === 'menstruation'
    ).length;

    if (length > 10 && length < 50) {
      cycles.push({
        startDate: cycleStarts[i].date,
        length,
        periodLength: periodDays,
        ovulationDay,
        index: i,
      });
    }
  }

  const avgLength = cycles.length > 0
    ? Math.round(cycles.reduce((a, b) => a + b.length, 0) / cycles.length)
    : 29;

  const recentCycles = cycles.slice(-6).reverse();

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">Zyklus-Verlauf</h3>
        <span className="text-xs text-gray-500">Ø {avgLength} Tage</span>
      </div>

      <div className="space-y-2">
        {recentCycles.map((cycle, i) => {
          const diff = cycle.length - avgLength;
          const TrendIcon = diff > 1 ? TrendingUp : diff < -1 ? TrendingDown : Minus;
          const trendColor = diff > 1 ? 'text-amber-500' : diff < -1 ? 'text-[#6F7CFF]' : 'text-gray-400';

          return (
            <div key={cycle.startDate} className="flex items-center gap-4 py-2.5 border-b border-gray-50 last:border-0">
              <div className="w-24 text-xs text-gray-500">{formatShortDate(cycle.startDate)}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {/* Cycle bar */}
                  <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-rose-300 via-purple-200 via-amber-200 to-teal-200 rounded-full"
                      style={{ width: `${(cycle.length / 35) * 100}%` }}
                    />
                  </div>
                  <span className={`text-sm font-semibold ${i === 0 ? 'text-gray-400 italic' : 'text-gray-700'}`}>
                    {cycle.length} Tage
                  </span>
                  <TrendIcon size={14} className={trendColor} />
                </div>
                <div className="flex gap-3 mt-1 text-xs text-gray-400">
                  <span>Periode: {cycle.periodLength} T.</span>
                  {cycle.ovulationDay && <span>Ovulation: Tag {cycle.ovulationDay}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

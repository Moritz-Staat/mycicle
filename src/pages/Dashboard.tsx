import { useState } from 'react';
import { Calendar, Clock, Activity, Zap } from 'lucide-react';
import { useCycleStore } from '../store/cycleStore';
import { useWearableStore } from '../store/wearableStore';
import {
  getCurrentCycleDay,
  calculateCycleStats,
  predictNextPeriod,
  getPhaseLabel,
  formatDate,
} from '../utils/cycleUtils';
import type { CycleDay } from '../types';
import { StatCard } from '../components/ui/StatCard';
import { TemperatureChart } from '../components/charts/TemperatureChart';
import { CycleCalendar } from '../components/CycleCalendar';
import { FertileWindowCard } from '../components/FertileWindowCard';
import { CycleProgressBar } from '../components/CycleProgressBar';
import { CycleHistory } from '../components/CycleHistory';
import { DayEntrySlideOver } from '../components/DayEntrySlideOver';
import { Badge } from '../components/ui/Badge';
import { useDemoDelay } from '../hooks/useDemoDelay';
import { SkeletonCard, Skeleton } from '../components/ui/Skeleton';
import { SymptomHeatmap } from '../components/charts/SymptomHeatmap';
import { ConfidenceBandChart } from '../components/charts/ConfidenceBandChart';

export default function Dashboard() {
  const { cycleHistory } = useCycleStore();
  const { wearableHistory } = useWearableStore();
  const [selectedDay, setSelectedDay] = useState<CycleDay | null>(null);
  const loaded = useDemoDelay(600);

  const today = getCurrentCycleDay(cycleHistory);
  const stats = calculateCycleStats(cycleHistory);
  const nextPeriod = predictNextPeriod(cycleHistory);

  const todayWearable = wearableHistory[wearableHistory.length - 1];
  const recentHRV = wearableHistory.slice(-7).map((d) => d.hrv);

  const daysUntilPeriod = nextPeriod
    ? Math.round((new Date(nextPeriod).getTime() - new Date('2026-05-18').getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const phaseColors: Record<string, 'rose' | 'purple' | 'amber' | 'teal'> = {
    menstruation: 'rose',
    follicular: 'purple',
    ovulation: 'amber',
    luteal: 'teal',
  };

  if (!loaded) {
    return (
      <div className="space-y-6">
        <Skeleton variant="text" width={300} height={32} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
        </div>
        <SkeletonCard className="h-64" />
        <div className="grid md:grid-cols-2 gap-4">
          <SkeletonCard className="h-72" />
          <SkeletonCard className="h-72" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero section */}
      {today && (
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Tag {today.dayOfCycle}</h2>
              <Badge color={phaseColors[today.phase] ?? 'slate'} size="md">
                {getPhaseLabel(today.phase)}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{formatDate(today.date)}</p>
          </div>
          <button
            onClick={() => setSelectedDay(today)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-rose-200 dark:border-rose-800 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-sm font-medium transition-colors"
          >
            <Calendar size={16} />
            Tageseintrag
          </button>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Calendar size={18} />}
          label="Zyklustag"
          value={today?.dayOfCycle ?? '–'}
          unit={`/ ${stats.avgLength}`}
          trend="neutral"
          iconBg="bg-rose-100 text-rose-600"
          sparklineData={[1, 3, 5, 8, 10, 12, 14]}
        />
        <StatCard
          icon={<Clock size={18} />}
          label="Nächste Periode"
          value={daysUntilPeriod !== null ? `in ${daysUntilPeriod}` : '–'}
          unit="Tagen"
          trend={daysUntilPeriod !== null && daysUntilPeriod < 5 ? 'down' : 'neutral'}
          trendValue={nextPeriod ? formatDate(nextPeriod) : ''}
          iconBg="bg-purple-100 text-purple-600"
        />
        <StatCard
          icon={<Activity size={18} />}
          label="Ø Zykluslänge"
          value={stats.avgLength}
          unit="Tage"
          trend="neutral"
          trendValue={`Letzter: ${stats.lastCycleLength} T.`}
          iconBg="bg-teal-100 text-teal-600"
        />
        <StatCard
          icon={<Zap size={18} />}
          label="HRV heute"
          value={todayWearable?.hrv ?? '–'}
          unit="ms"
          trend={todayWearable?.hrv > 45 ? 'up' : todayWearable?.hrv < 38 ? 'down' : 'neutral'}
          trendValue="Baseline 45ms"
          iconBg="bg-amber-100 text-amber-600"
          sparklineData={recentHRV}
        />
      </div>

      {/* Temperature Chart */}
      <TemperatureChart cycleData={cycleHistory} />

      {/* Calendar + Fertile Window + Confidence Band */}
      <div className="grid md:grid-cols-2 gap-6">
        <CycleCalendar
          cycleData={cycleHistory}
          onDayClick={setSelectedDay}
        />
        <div className="space-y-6">
          <FertileWindowCard
            cycleData={cycleHistory}
            currentDay={today?.dayOfCycle ?? 14}
            predictedOvulation={14}
          />
          <ConfidenceBandChart />
        </div>
      </div>

      {/* Cycle Progress */}
      <CycleProgressBar
        currentDay={today?.dayOfCycle ?? 14}
        cycleLength={stats.avgLength}
      />

      {/* Cycle History */}
      <CycleHistory cycleData={cycleHistory} />

      {/* Symptom Heatmap */}
      <SymptomHeatmap />

      {/* Day Entry Slide-over */}
      <DayEntrySlideOver
        day={selectedDay}
        onClose={() => setSelectedDay(null)}
      />
    </div>
  );
}

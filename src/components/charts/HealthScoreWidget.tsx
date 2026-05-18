import { TrendingUp, TrendingDown } from 'lucide-react';
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from 'recharts';

interface SubScore {
  label: string;
  score: number;
  fill: string;
  trend: 'up' | 'down' | 'neutral';
}

const SUB_SCORES: SubScore[] = [
  { label: 'Zyklus', score: 82, fill: '#E11D48', trend: 'up' },
  { label: 'Schlaf', score: 74, fill: '#A855F7', trend: 'neutral' },
  { label: 'HRV', score: 78, fill: '#14B8A6', trend: 'up' },
  { label: 'Aktivität', score: 71, fill: '#F59E0B', trend: 'down' },
];

const OVERALL_SCORE = Math.round(
  SUB_SCORES.reduce((a, b) => a + b.score, 0) / SUB_SCORES.length
);

const chartData = SUB_SCORES.map((s) => ({
  name: s.label,
  value: s.score,
  fill: s.fill,
}));

export function HealthScoreWidget() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <h3 className="text-base font-semibold text-gray-900 mb-4">Gesundheitsscore</h3>

      {/* Radial chart with center score */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={200}>
          <RadialBarChart
            innerRadius={40}
            outerRadius={90}
            data={chartData}
            startAngle={90}
            endAngle={-270}
          >
            <RadialBar
              dataKey="value"
              background={{ fill: '#F3F4F6' }}
              cornerRadius={6}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        {/* Center score overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-4xl font-bold text-gray-900">{OVERALL_SCORE}</span>
          <span className="text-xs text-gray-500">/ 100</span>
        </div>
      </div>

      {/* Sub-scores */}
      <div className="space-y-2.5 mt-4">
        {SUB_SCORES.map((s) => (
          <div key={s.label} className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.fill }} />
            <span className="text-sm text-gray-600 w-16">{s.label}</span>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${s.score}%`, backgroundColor: s.fill }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-900 w-8 text-right">{s.score}</span>
            {s.trend === 'up' && <TrendingUp size={14} className="text-green-500 flex-shrink-0" />}
            {s.trend === 'down' && <TrendingDown size={14} className="text-red-500 flex-shrink-0" />}
            {s.trend === 'neutral' && <div className="w-3.5 h-0.5 bg-gray-300 flex-shrink-0" />}
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400 text-center">
        Berechnet aus Zyklus, Schlaf, HRV & Aktivitätsdaten
      </div>
    </div>
  );
}

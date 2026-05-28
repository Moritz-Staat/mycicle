import { useState } from 'react';
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { useCycleStore } from '../../store/cycleStore';
import { useWearableStore } from '../../store/wearableStore';
import { splitIntoCycles, buildOverlayData } from '../../utils/cycleUtils';

type Metric = 'temperature' | 'hrv';

export function MultiCycleOverlayChart() {
  const { cycleHistory } = useCycleStore();
  const { wearableHistory } = useWearableStore();
  const [metric, setMetric] = useState<Metric>('temperature');

  const cycles = splitIntoCycles(cycleHistory);
  const data = buildOverlayData(cycles, metric, wearableHistory);

  const cycleOpacities = [0.15, 0.25, 0.35, 0.45, 0.6];
  const cycleColors = ['#94a3b8', '#94a3b8', '#94a3b8', '#94a3b8', '#94a3b8'];

  const yDomain: [number | 'auto', number | 'auto'] =
    metric === 'temperature' ? [36.0, 37.2] : ['auto', 'auto'];

  const unit = metric === 'temperature' ? '°C' : 'ms';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Zyklusvergleich</h3>
        <div className="flex gap-2">
          {(['temperature', 'hrv'] as Metric[]).map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                metric === m
                  ? 'bg-[#6F7CFF] text-white border-[#6F7CFF]'
                  : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-[#B3B9FF]'
              }`}
            >
              {m === 'temperature' ? 'Temperatur' : 'HRV'}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="day"
            tickLine={false}
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            label={{ value: 'Zyklustag', position: 'insideBottomRight', offset: -8, fontSize: 10, fill: '#9ca3af' }}
          />
          <YAxis
            domain={yDomain}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            unit={unit}
            width={50}
          />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
            formatter={(val, name) => [`${val}${unit}`, name]}
          />
          <ReferenceLine x={14} stroke="#f59e0b" strokeDasharray="4 2" label={{ value: 'Ov.', fontSize: 10, fill: '#f59e0b' }} />

          {/* Past cycles with decreasing opacity */}
          {cycles.slice(0, -1).map((_, i) => {
            const key = `cycle${i}`;
            const opacity = cycleOpacities[Math.min(i, cycleOpacities.length - 1)];
            return (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={cycleColors[0]}
                strokeWidth={1}
                strokeOpacity={opacity}
                dot={false}
                name={`Zyklus ${cycles.length - 1 - i}`}
                connectNulls
              />
            );
          })}

          {/* Average */}
          <Line
            type="monotone"
            dataKey="avg"
            stroke="#94a3b8"
            strokeWidth={1.5}
            strokeDasharray="5 3"
            dot={false}
            name="Durchschnitt"
            connectNulls
          />

          {/* Current cycle */}
          <Line
            type="monotone"
            dataKey={`cycle${cycles.length - 1}`}
            stroke="#e11d48"
            strokeWidth={2.5}
            dot={false}
            name="Aktuell"
            connectNulls
          />
        </ComposedChart>
      </ResponsiveContainer>

      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <p className="text-xs text-gray-500 dark:text-gray-400 italic">
          KI-Analyse: Dein aktueller Zyklus folgt dem typischen biphasischen Muster. Die Temperaturkurve liegt im normalen Bereich. Kein Hinweis auf Zyklusanomalien.
        </p>
      </div>
    </div>
  );
}

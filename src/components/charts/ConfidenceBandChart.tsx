import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { useCycleStore } from '../../store/cycleStore';
import { calculateConfidenceBand } from '../../utils/cycleUtils';

export function ConfidenceBandChart() {
  const { cycleHistory } = useCycleStore();
  const data = calculateConfidenceBand(cycleHistory);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">Periodenprognose</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Konfidenzband der nächsten 20 Tage</p>

      <ResponsiveContainer width="100%" height={180}>
        <ComposedChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="label"
            tickLine={false}
            tick={{ fontSize: 10, fill: '#9ca3af' }}
          />
          <YAxis
            domain={[0, 1]}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            tickFormatter={(v) => `${Math.round(v * 100)}%`}
            width={40}
          />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
            formatter={(val) => [`${Math.round(Number(val) * 100)}%`, 'Wahrscheinlichkeit']}
          />
          <ReferenceLine x="Heute" stroke="#64748b" strokeDasharray="4 2" label={{ value: 'Heute', fontSize: 10, fill: '#64748b' }} />
          <Area
            type="monotone"
            dataKey="band"
            fill="#ffe4e6"
            stroke="none"
            name="Konfidenzband"
          />
          <Line
            type="monotone"
            dataKey="median"
            stroke="#e11d48"
            strokeWidth={2}
            dot={false}
            name="Median"
            connectNulls
          />
        </ComposedChart>
      </ResponsiveContainer>

      <div className="mt-3 p-3 bg-[#EEF0FF] dark:bg-rose-950/20 rounded-lg">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          <span className="font-medium text-[#6F7CFF]">Prognose:</span> Nächste Periode mit 80% Wahrscheinlichkeit am <span className="font-medium">1. Juni 2026</span> (±2 Tage). Basierend auf Ø 29.2 Tagen aus 6 Zyklen.
        </p>
      </div>
    </div>
  );
}

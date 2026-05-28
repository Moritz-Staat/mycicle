import type { WearableDay, CycleDay } from '../../types';
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface TempOverlayChartProps {
  wearableData: WearableDay[];
  cycleData: CycleDay[];
}

interface TooltipPayload {
  value: number;
  name: string;
  color: string;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayload[]; label?: string }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-sm">
      <p className="text-gray-500 text-xs mb-1">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex justify-between gap-4">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="font-medium">{p.value?.toFixed(p.name === 'HRV (ms)' ? 0 : 2)}</span>
        </div>
      ))}
    </div>
  );
}

export function TempOverlayChart({ wearableData, cycleData }: TempOverlayChartProps) {
  const last30Wearable = wearableData.slice(-30);
  const cycleMap = new Map(cycleData.map((d) => [d.date, d]));

  const chartData = last30Wearable.map((w) => {
    const cycleDay = cycleMap.get(w.date);
    return {
      date: new Date(w.date).toLocaleDateString('de-DE', { day: 'numeric', month: 'short' }),
      hrv: w.hrv,
      temp: cycleDay?.temperature ?? null,
    };
  });

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-900">Korrelation: HRV & Temperatur</h3>
        <p className="text-xs text-gray-500 mt-0.5">30 Tage · Doppelte Y-Achse</p>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} axisLine={false} interval={7} />
          <YAxis
            yAxisId="hrv"
            domain={[20, 75]}
            tick={{ fontSize: 10, fill: '#14B8A6' }}
            tickLine={false}
            axisLine={false}
            unit="ms"
          />
          <YAxis
            yAxisId="temp"
            orientation="right"
            domain={[36.0, 37.2]}
            tick={{ fontSize: 10, fill: '#E11D48' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => v.toFixed(1)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
          <Area
            yAxisId="hrv"
            type="monotone"
            dataKey="hrv"
            name="HRV (ms)"
            stroke="#14B8A6"
            fill="#CCFBF1"
            strokeWidth={2}
            dot={false}
          />
          <Line
            yAxisId="temp"
            type="monotone"
            dataKey="temp"
            name="Temperatur (°C)"
            stroke="#6F7CFF"
            strokeWidth={2}
            dot={{ r: 2, fill: '#E11D48', strokeWidth: 0 }}
            connectNulls={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

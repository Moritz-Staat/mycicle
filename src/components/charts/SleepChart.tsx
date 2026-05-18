import type { WearableDay } from '../../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';

interface SleepChartProps {
  data: WearableDay[];
}

interface TooltipPayload {
  value: number;
  name: string;
  color: string;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayload[]; label?: string }) {
  if (!active || !payload || payload.length === 0) return null;
  const total = payload.reduce((a, b) => a + (b.value || 0), 0);
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-sm min-w-[140px]">
      <p className="text-gray-500 text-xs mb-1">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex justify-between gap-4">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="font-medium">{p.value.toFixed(1)}h</span>
        </div>
      ))}
      <div className="border-t border-gray-100 mt-1 pt-1 flex justify-between font-semibold">
        <span>Gesamt</span>
        <span>{total.toFixed(1)}h</span>
      </div>
    </div>
  );
}

export function SleepChart({ data }: SleepChartProps) {
  const last30 = data.slice(-30);
  const chartData = last30.map((d) => ({
    date: new Date(d.date).toLocaleDateString('de-DE', { day: 'numeric', month: 'short' }),
    Tiefschlaf: d.deepSleep,
    REM: d.remSleep,
    Leichtschlaf: d.lightSleep,
  }));

  const avgTotal = last30.reduce((a, b) => a + b.deepSleep + b.remSleep + b.lightSleep, 0) / last30.length;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Schlafphasen</h3>
          <p className="text-xs text-gray-500 mt-0.5">30 Tage · Ø {avgTotal.toFixed(1)}h Gesamt</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} axisLine={false} interval={6} />
          <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} axisLine={false} unit="h" />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
          <ReferenceLine y={avgTotal} stroke="#9CA3AF" strokeDasharray="4 4" />
          <Bar dataKey="Tiefschlaf" stackId="sleep" fill="#334155" radius={[0, 0, 0, 0]} />
          <Bar dataKey="REM" stackId="sleep" fill="#A855F7" />
          <Bar dataKey="Leichtschlaf" stackId="sleep" fill="#93C5FD" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

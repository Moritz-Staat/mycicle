import type { WearableDay } from '../../types';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
  Brush,
  ResponsiveContainer,
} from 'recharts';

interface HRVChartProps {
  data: WearableDay[];
}

interface TooltipPayload {
  value: number;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayload[]; label?: string }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-sm">
      <p className="text-gray-500 text-xs">{label}</p>
      <p className="font-semibold text-teal-600">{payload[0].value} ms HRV</p>
    </div>
  );
}

export function HRVChart({ data }: HRVChartProps) {
  const chartData = data.map((d) => ({
    date: new Date(d.date).toLocaleDateString('de-DE', { day: 'numeric', month: 'short' }),
    hrv: d.hrv,
  }));

  const avgHRV = Math.round(data.reduce((a, b) => a + b.hrv, 0) / data.length);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">HRV (Herzratenvariabilität)</h3>
          <p className="text-xs text-gray-500 mt-0.5">90 Tage · Baseline: {avgHRV} ms</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-teal-500" />
          <span className="text-xs text-gray-500">Tageswert</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 20 }}>
          <defs>
            <linearGradient id="hrv-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#14B8A6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: '#9CA3AF' }}
            tickLine={false}
            axisLine={false}
            interval={14}
          />
          <YAxis
            domain={[20, 75]}
            tick={{ fontSize: 10, fill: '#9CA3AF' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={avgHRV} stroke="#F59E0B" strokeDasharray="4 4" strokeWidth={1.5} />
          {/* Stress anomaly zones */}
          <ReferenceArea x1={chartData[36]?.date} x2={chartData[43]?.date} fill="#FEE2E2" fillOpacity={0.4} />
          <ReferenceArea x1={chartData[62]?.date} x2={chartData[68]?.date} fill="#FEE2E2" fillOpacity={0.3} />
          <Area
            type="monotone"
            dataKey="hrv"
            stroke="#14B8A6"
            strokeWidth={2}
            fill="url(#hrv-gradient)"
            dot={false}
            activeDot={{ r: 4, fill: '#14B8A6' }}
          />
          <Brush dataKey="date" height={20} stroke="#E5E7EB" fill="#F9FAFB" travellerWidth={6} startIndex={60} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

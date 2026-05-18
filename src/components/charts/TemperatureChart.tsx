import type { CycleDay } from '../../types';
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  ReferenceArea,
} from 'recharts';
import { getPhaseLabel, getDeckline } from '../../utils/cycleUtils';

interface TemperatureChartProps {
  cycleData: CycleDay[];
}

interface TooltipPayload {
  value: number;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayload[]; label?: string | number }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-sm">
      <p className="font-semibold text-gray-700">Tag {label}</p>
      {payload[0] && (
        <p className="text-rose-600">{payload[0].value.toFixed(2)} °C</p>
      )}
    </div>
  );
}

export function TemperatureChart({ cycleData }: TemperatureChartProps) {
  const currentCycle = cycleData
    .filter((d) => d.dayOfCycle <= 30)
    .sort((a, b) => a.dayOfCycle - b.dayOfCycle);

  const chartData = Array.from({ length: 30 }, (_, i) => {
    const day = currentCycle.find((d) => d.dayOfCycle === i + 1);
    return {
      day: i + 1,
      temp: day?.temperature ?? null,
      phase: day ? getPhaseLabel(day.phase) : '',
    };
  });

  const deckline = getDeckline(currentCycle);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Basaltemperatur</h3>
          <p className="text-xs text-gray-500 mt-0.5">Aktueller Zyklus – 30 Tage</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-0.5 bg-rose-500 rounded" />
            <span className="text-gray-600">Temperatur</span>
          </div>
          {deckline && (
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-0.5 bg-amber-500 rounded border-dashed border-t-2 border-amber-500 bg-transparent" />
              <span className="text-gray-600">Decklinie {deckline}°C</span>
            </div>
          )}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={chartData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            tickLine={false}
            axisLine={false}
            label={{ value: 'Zyklustag', position: 'insideBottom', offset: -2, fontSize: 11, fill: '#9CA3AF' }}
          />
          <YAxis
            domain={[36.0, 37.2]}
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => v.toFixed(1)}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Phase backgrounds */}
          <ReferenceArea x1={1} x2={5} fill="#FEE2E2" fillOpacity={0.4} />
          <ReferenceArea x1={6} x2={13} fill="#F3E8FF" fillOpacity={0.4} />
          <ReferenceArea x1={14} x2={16} fill="#FEF3C7" fillOpacity={0.5} />
          <ReferenceArea x1={17} x2={30} fill="#CCFBF1" fillOpacity={0.3} />

          {/* Decklinie */}
          {deckline && (
            <ReferenceLine
              y={deckline}
              stroke="#F59E0B"
              strokeDasharray="5 5"
              strokeWidth={1.5}
            />
          )}

          <Line
            type="monotone"
            dataKey="temp"
            stroke="#E11D48"
            strokeWidth={2}
            dot={{ r: 3, fill: '#E11D48', strokeWidth: 0 }}
            activeDot={{ r: 5 }}
            connectNulls={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
      {/* Phase labels */}
      <div className="flex mt-2 text-xs">
        <div className="flex-[5] text-center text-rose-500 font-medium">Mens.</div>
        <div className="flex-[8] text-center text-purple-500 font-medium">Follikel</div>
        <div className="flex-[3] text-center text-amber-500 font-medium">Ovulation</div>
        <div className="flex-[14] text-center text-teal-500 font-medium">Lutealphase</div>
      </div>
    </div>
  );
}

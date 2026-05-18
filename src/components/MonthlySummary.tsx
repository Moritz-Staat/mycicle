import { useState } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MonthMetric {
  label: string;
  value: string;
  prev: string;
  delta: number;
  unit: string;
}

const MONTHS_DATA: Record<string, MonthMetric[]> = {
  'April 2026': [
    { label: 'Zykluslänge', value: '28', prev: '29', delta: -1, unit: 'Tage' },
    { label: 'Ø HRV', value: '43', prev: '45', delta: -2, unit: 'ms' },
    { label: 'Ø Schlaf-Score', value: '71', prev: '74', delta: -3, unit: '/100' },
    { label: 'PMS-Tage', value: '4', prev: '2', delta: 2, unit: 'Tage' },
  ],
  'März 2026': [
    { label: 'Zykluslänge', value: '24', prev: '29', delta: -5, unit: 'Tage' },
    { label: 'Ø HRV', value: '41', prev: '45', delta: -4, unit: 'ms' },
    { label: 'Ø Schlaf-Score', value: '68', prev: '74', delta: -6, unit: '/100' },
    { label: 'PMS-Tage', value: '6', prev: '2', delta: 4, unit: 'Tage' },
  ],
  'Februar 2026': [
    { label: 'Zykluslänge', value: '30', prev: '29', delta: 1, unit: 'Tage' },
    { label: 'Ø HRV', value: '44', prev: '45', delta: -1, unit: 'ms' },
    { label: 'Ø Schlaf-Score', value: '75', prev: '74', delta: 1, unit: '/100' },
    { label: 'PMS-Tage', value: '2', prev: '2', delta: 0, unit: 'Tage' },
  ],
};

const MONTH_LIST = Object.keys(MONTHS_DATA);

export function MonthlySummary() {
  const [monthIndex, setMonthIndex] = useState(0);
  const currentMonth = MONTH_LIST[monthIndex];
  const metrics = MONTHS_DATA[currentMonth];

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">Monatszusammenfassung</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMonthIndex(Math.min(monthIndex + 1, MONTH_LIST.length - 1))}
            disabled={monthIndex === MONTH_LIST.length - 1}
            className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-medium text-gray-700 min-w-[100px] text-center">{currentMonth}</span>
          <button
            onClick={() => setMonthIndex(Math.max(monthIndex - 1, 0))}
            disabled={monthIndex === 0}
            className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {metrics.map((m) => {
          const TrendIcon = m.delta > 0 ? TrendingUp : m.delta < 0 ? TrendingDown : Minus;
          const isGood = (m.label === 'Zykluslänge' && Math.abs(m.delta) <= 2)
            || (m.label === 'Ø HRV' && m.delta >= 0)
            || (m.label === 'Ø Schlaf-Score' && m.delta >= 0)
            || (m.label === 'PMS-Tage' && m.delta <= 0);
          const trendColor = m.delta === 0 ? 'text-gray-400' : isGood ? 'text-green-500' : 'text-red-500';

          return (
            <div key={m.label} className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-500 font-medium">{m.label}</p>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl font-bold text-gray-900">{m.value}</span>
                <span className="text-xs text-gray-400">{m.unit}</span>
              </div>
              <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${trendColor}`}>
                <TrendIcon size={12} />
                <span>{m.delta > 0 ? '+' : ''}{m.delta} vs. Ø</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

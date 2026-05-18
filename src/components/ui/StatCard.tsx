import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  sparklineData?: number[];
  iconBg?: string;
  className?: string;
}

export function StatCard({
  icon,
  label,
  value,
  unit,
  trend,
  trendValue,
  sparklineData,
  iconBg = 'bg-rose-100 text-rose-600',
  className = '',
}: StatCardProps) {
  const trendIcon = trend === 'up'
    ? <TrendingUp size={14} />
    : trend === 'down'
    ? <TrendingDown size={14} />
    : <Minus size={14} />;

  const trendColor = trend === 'up'
    ? 'text-green-600'
    : trend === 'down'
    ? 'text-red-500'
    : 'text-gray-400';

  return (
    <div className={`bg-white rounded-xl border border-gray-100 shadow-sm p-5 ${className}`}>
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-lg ${iconBg}`}>
          {icon}
        </div>
        {sparklineData && sparklineData.length > 0 && (
          <div className="w-20 h-10">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData.map((v, i) => ({ v, i }))}>
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke="#E11D48"
                  strokeWidth={1.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <div className="flex items-baseline gap-1.5 mt-1">
          <span className="text-2xl font-bold text-gray-900">{value}</span>
          {unit && <span className="text-sm text-gray-500">{unit}</span>}
        </div>
        {trend && trendValue && (
          <div className={`flex items-center gap-1 mt-1.5 text-xs font-medium ${trendColor}`}>
            {trendIcon}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  );
}

interface CorrelationCardProps {
  title: string;
  description: string;
  confidence: number; // 0-100
  phase1Label: string;
  phase1Value: number;
  phase2Label: string;
  phase2Value: number;
  maxValue: number;
  unit: string;
  positive?: boolean;
}

export function CorrelationCard({
  title,
  description,
  confidence,
  phase1Label,
  phase1Value,
  phase2Label,
  phase2Value,
  maxValue,
  unit,
  positive = true,
}: CorrelationCardProps) {
  const bar1Width = (phase1Value / maxValue) * 100;
  const bar2Width = (phase2Value / maxValue) * 100;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
        <div className={`px-2 py-0.5 rounded-full text-xs font-medium border ${positive ? 'bg-teal-50 text-teal-700 border-teal-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
          KI-Konfidenz: {confidence}%
        </div>
      </div>
      <p className="text-xs text-gray-500 mb-4">{description}</p>

      {/* Mini bar comparison */}
      <div className="space-y-2">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600">{phase1Label}</span>
            <span className="font-medium text-gray-900">{phase1Value} {unit}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-400 rounded-full transition-all duration-700"
              style={{ width: `${bar1Width}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600">{phase2Label}</span>
            <span className="font-medium text-gray-900">{phase2Value} {unit}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-400 rounded-full transition-all duration-700"
              style={{ width: `${bar2Width}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

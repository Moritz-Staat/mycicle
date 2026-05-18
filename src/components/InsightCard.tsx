import { useState } from 'react';
import { Pin, ChevronDown, ChevronUp, Lightbulb, TrendingUp, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';
import type { KIInsight, Severity } from '../types';

interface InsightCardProps {
  insight: KIInsight;
}

const severityConfig: Record<Severity, { stripe: string; icon: typeof AlertTriangle; iconColor: string; bg: string }> = {
  alert: { stripe: 'bg-red-500', icon: AlertCircle, iconColor: 'text-red-500', bg: 'bg-red-50' },
  warning: { stripe: 'bg-amber-500', icon: AlertTriangle, iconColor: 'text-amber-500', bg: 'bg-amber-50' },
  info: { stripe: 'bg-blue-500', icon: TrendingUp, iconColor: 'text-blue-500', bg: 'bg-blue-50' },
  positive: { stripe: 'bg-green-500', icon: CheckCircle, iconColor: 'text-green-500', bg: 'bg-green-50' },
};

export function InsightCard({ insight }: InsightCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [pinned, setPinned] = useState(insight.pinned ?? false);

  const config = severityConfig[insight.severity];
  const Icon = insight.type === 'recommendation' ? Lightbulb : config.icon;
  const formattedDate = new Date(insight.date).toLocaleDateString('de-DE', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex">
      {/* Severity stripe */}
      <div className={`w-1 flex-shrink-0 ${config.stripe}`} />

      <div className="flex-1 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`p-1.5 rounded-lg flex-shrink-0 ${config.bg}`}>
              <Icon size={16} className={config.iconColor} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900">{insight.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{formattedDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => setPinned(!pinned)}
              className={`p-1.5 rounded-lg transition-colors ${pinned ? 'text-rose-500 bg-rose-50' : 'text-gray-300 hover:text-gray-500 hover:bg-gray-50'}`}
              title={pinned ? 'Entpinnen' : 'Anpinnen'}
            >
              <Pin size={14} fill={pinned ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
            >
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </div>

        {/* Description - collapsed shows first line, expanded shows all */}
        <p className={`text-xs text-gray-600 mt-2 leading-relaxed ${!expanded ? 'line-clamp-2' : ''}`}>
          {insight.description}
        </p>

        {/* Actionable hint - only shown when expanded */}
        {expanded && insight.actionableHint && (
          <div className="mt-3 bg-amber-50 border border-amber-100 rounded-lg p-3 flex items-start gap-2">
            <Lightbulb size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">{insight.actionableHint}</p>
          </div>
        )}

        {!expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="mt-1 text-xs text-rose-500 hover:text-rose-700 font-medium transition-colors"
          >
            Mehr anzeigen
          </button>
        )}
      </div>
    </div>
  );
}

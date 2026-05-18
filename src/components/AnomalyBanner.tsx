import { useState } from 'react';
import { X, AlertTriangle, Info, CheckCircle, AlertCircle } from 'lucide-react';
import type { Severity } from '../types';

interface AnomalyBannerProps {
  severity: Severity;
  title: string;
  message: string;
}

const severityConfig: Record<Severity, { bg: string; border: string; text: string; icon: typeof AlertTriangle }> = {
  alert: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: AlertCircle },
  warning: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', icon: AlertTriangle },
  info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', icon: Info },
  positive: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', icon: CheckCircle },
};

export function AnomalyBanner({ severity, title, message }: AnomalyBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <div className={`rounded-xl border ${config.bg} ${config.border} p-4 flex items-start gap-3`}>
      <Icon size={18} className={`flex-shrink-0 mt-0.5 ${config.text}`} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${config.text}`}>{title}</p>
        <p className={`text-xs mt-0.5 ${config.text} opacity-80`}>{message}</p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className={`flex-shrink-0 p-1 rounded-md hover:bg-black/10 transition-colors ${config.text}`}
      >
        <X size={14} />
      </button>
    </div>
  );
}

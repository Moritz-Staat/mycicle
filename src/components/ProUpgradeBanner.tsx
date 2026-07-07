import { Crown, Check } from 'lucide-react';

interface ProUpgradeBannerProps {
  title?: string;
  description?: string;
  features?: string[];
  compact?: boolean;
}

export function ProUpgradeBanner({
  title = 'Mehr mit mycycle+',
  description = 'Schalte erweiterte Features frei: Wearable-Integration, KI-Insights, Arzt-Export und mehr.',
  features,
  compact = false,
}: ProUpgradeBannerProps) {
  if (compact) {
    return (
      <div
        className="rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap"
        style={{
          background:
            'linear-gradient(135deg, rgba(179,145,200,0.10) 0%, rgba(111,124,255,0.10) 50%, rgba(124,200,181,0.10) 100%)',
        }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-100 text-amber-600 flex-shrink-0">
            <Crown size={16} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#1A1625] dark:text-gray-100">{title}</p>
            <p className="text-xs text-[#68627A] dark:text-gray-400 truncate">{description}</p>
          </div>
        </div>
        <button
          className="flex-shrink-0 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #6F7CFF 0%, #B391C8 100%)' }}
        >
          Upgrade · 4,99 €/Mo.
        </button>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-6 space-y-4"
      style={{
        background:
          'linear-gradient(135deg, rgba(179,145,200,0.08) 0%, rgba(111,124,255,0.08) 50%, rgba(124,200,181,0.08) 100%)',
      }}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-amber-100 text-amber-600 flex-shrink-0">
          <Crown size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-[#1A1625] dark:text-gray-100">{title}</h3>
          <p className="text-sm text-[#68627A] dark:text-gray-400 mt-1 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {features && features.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-2 pl-16">
          {features.map((f) => (
            <div key={f} className="flex items-center gap-2 text-sm text-[#1A1625] dark:text-gray-200">
              <Check size={14} className="text-[#7CC8B5] flex-shrink-0" />
              {f}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 pt-1 pl-16">
        <button
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 shadow-md"
          style={{ background: 'linear-gradient(135deg, #6F7CFF 0%, #B391C8 100%)' }}
        >
          Upgrade auf mycycle+
        </button>
        <span className="text-sm text-[#68627A]">
          ab <strong className="text-[#1A1625] dark:text-gray-100">4,99 €</strong>/Monat · oder 44,99 €/Jahr
        </span>
      </div>
    </div>
  );
}

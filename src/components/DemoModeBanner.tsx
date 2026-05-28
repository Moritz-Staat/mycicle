import { Info } from 'lucide-react';

export function DemoModeBanner() {
  return (
    <div className="sticky top-0 z-50 px-4 py-2.5 flex items-center justify-between gap-3 shadow-sm" style={{ background: 'linear-gradient(135deg, #B391C8 0%, #6F7CFF 47%, #7CC8B5 100%)' }}>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Info size={16} className="flex-shrink-0 text-white" />
        <p className="text-sm font-medium text-white truncate">
          Demo-Modus – Du siehst Beispieldaten von Sarah
        </p>
      </div>
      <button
        disabled
        className="flex-shrink-0 px-3 py-1 rounded-lg bg-white/20 text-white text-xs font-semibold opacity-75 cursor-not-allowed whitespace-nowrap"
      >
        Echten Account erstellen
      </button>
    </div>
  );
}

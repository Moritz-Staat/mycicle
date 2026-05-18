import { Info } from 'lucide-react';

export function DemoModeBanner() {
  return (
    <div className="sticky top-0 z-50 bg-amber-400 text-amber-900 px-4 py-2.5 flex items-center justify-between gap-3 shadow-sm">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Info size={16} className="flex-shrink-0" />
        <p className="text-sm font-medium truncate">
          Demo-Modus – Du siehst Beispieldaten von Sarah
        </p>
      </div>
      <button
        disabled
        className="flex-shrink-0 px-3 py-1 rounded-lg bg-amber-900/20 text-amber-900 text-xs font-semibold opacity-60 cursor-not-allowed whitespace-nowrap"
      >
        Echten Account erstellen
      </button>
    </div>
  );
}

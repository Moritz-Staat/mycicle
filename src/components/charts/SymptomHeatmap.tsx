import { useState, useRef } from 'react';
import { useCycleStore } from '../../store/cycleStore';
import { useWearableStore } from '../../store/wearableStore';

type HeatmapMode = 'phase' | 'symptoms' | 'hrv';

interface TooltipData {
  x: number;
  y: number;
  date: string;
  phase?: string;
  temp?: number;
  symptoms?: string[];
  hrv?: number;
}

const PHASE_COLORS: Record<string, string> = {
  menstruation: 'bg-rose-400',
  follicular: 'bg-purple-300',
  ovulation: 'bg-amber-400',
  luteal: 'bg-teal-300',
};

const PHASE_LABELS: Record<string, string> = {
  menstruation: 'Menstruation',
  follicular: 'Follikelphase',
  ovulation: 'Ovulation',
  luteal: 'Lutealphase',
};

const MONTHS_DE = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
const DAYS_DE = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

function allDays2026(): string[] {
  const days: string[] = [];
  const start = new Date('2026-01-01');
  const end = new Date('2026-12-31');
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

function getSymptomColor(count: number): string {
  if (count === 0) return 'bg-gray-100 dark:bg-gray-700';
  if (count === 1) return 'bg-rose-200';
  if (count === 2) return 'bg-rose-400';
  return 'bg-[#5A68E8]';
}

function getHRVColor(hrv: number, baseline: number): string {
  if (hrv > baseline * 1.1) return 'bg-teal-300';
  if (hrv >= baseline * 0.9) return 'bg-gray-200 dark:bg-gray-600';
  if (hrv >= baseline * 0.8) return 'bg-rose-300';
  return 'bg-[#6F7CFF]';
}

export function SymptomHeatmap() {
  const { cycleHistory } = useCycleStore();
  const { wearableHistory } = useWearableStore();
  const [mode, setMode] = useState<HeatmapMode>('phase');
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const today = '2026-05-18';
  const days = allDays2026();
  const cycleMap = new Map(cycleHistory.map((d) => [d.date, d]));
  const wearMap = new Map(wearableHistory.map((d) => [d.date, d]));
  const HRV_BASELINE = 45;

  const jan1 = new Date('2026-01-01');
  const jan1DayOfWeek = (jan1.getDay() + 6) % 7;
  const gridStart = new Date(jan1);
  gridStart.setDate(gridStart.getDate() - jan1DayOfWeek);

  const cells: { date: string | null; isYear: boolean }[] = [];
  const cur = new Date(gridStart);
  while (cur <= new Date('2026-12-31')) {
    const ds = cur.toISOString().split('T')[0];
    cells.push({ date: ds, isYear: ds >= '2026-01-01' && ds <= '2026-12-31' });
    cur.setDate(cur.getDate() + 1);
  }

  const totalCols = Math.ceil(cells.length / 7);

  const monthLabels: { col: number; label: string }[] = [];
  const seenMonths = new Set<number>();
  cells.forEach((cell, idx) => {
    if (!cell.date || !cell.isYear) return;
    const d = new Date(cell.date);
    const m = d.getMonth();
    if (!seenMonths.has(m)) {
      seenMonths.add(m);
      monthLabels.push({ col: Math.floor(idx / 7), label: MONTHS_DE[m] });
    }
  });

  function getCellColor(date: string | null): string {
    if (!date || !days.includes(date)) return 'bg-transparent';
    const cycleDay = cycleMap.get(date);
    const wearDay = wearMap.get(date);

    if (mode === 'phase') {
      if (!cycleDay) return 'bg-gray-100 dark:bg-gray-700';
      return PHASE_COLORS[cycleDay.phase] ?? 'bg-gray-100 dark:bg-gray-700';
    }
    if (mode === 'symptoms') {
      const count = cycleDay?.symptoms?.length ?? 0;
      return getSymptomColor(count);
    }
    if (mode === 'hrv') {
      if (!wearDay) return 'bg-gray-100 dark:bg-gray-700';
      return getHRVColor(wearDay.hrv, HRV_BASELINE);
    }
    return 'bg-gray-100 dark:bg-gray-700';
  }

  function handleMouseEnter(e: React.MouseEvent, date: string | null) {
    if (!date || !days.includes(date)) return;
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const cycleDay = cycleMap.get(date);
    const wearDay = wearMap.get(date);
    setTooltip({
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY,
      date,
      phase: cycleDay ? PHASE_LABELS[cycleDay.phase] : undefined,
      temp: cycleDay?.temperature,
      symptoms: cycleDay?.symptoms,
      hrv: wearDay?.hrv,
    });
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Jahresübersicht 2026</h3>
        <div className="flex gap-2">
          {(['phase', 'symptoms', 'hrv'] as HeatmapMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                mode === m
                  ? 'bg-[#6F7CFF] text-white border-[#6F7CFF]'
                  : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-[#B3B9FF]'
              }`}
            >
              {m === 'phase' ? 'Phase' : m === 'symptoms' ? 'Symptome' : 'HRV'}
            </button>
          ))}
        </div>
      </div>

      <div ref={containerRef} className="overflow-x-auto">
        <div className="relative" style={{ minWidth: `${totalCols * 16}px` }}>
          <div className="flex mb-1" style={{ marginLeft: '28px' }}>
            {monthLabels.map(({ col, label }) => (
              <div
                key={label}
                className="absolute text-[10px] text-gray-400 dark:text-gray-500"
                style={{ left: `${28 + col * 16}px` }}
              >
                {label}
              </div>
            ))}
          </div>

          <div className="flex mt-4">
            <div className="flex flex-col gap-[3px] mr-1">
              {DAYS_DE.map((d) => (
                <div key={d} className="h-[13px] text-[9px] text-gray-400 dark:text-gray-500 flex items-center">
                  {d}
                </div>
              ))}
            </div>

            <div
              className="grid gap-[3px]"
              style={{
                gridTemplateColumns: `repeat(${totalCols}, 13px)`,
                gridTemplateRows: 'repeat(7, 13px)',
                gridAutoFlow: 'column',
              }}
            >
              {cells.map((cell, idx) => {
                const isToday = cell.date === today;
                const color = getCellColor(cell.date);
                return (
                  <div
                    key={idx}
                    className={`w-[13px] h-[13px] rounded-sm transition-opacity ${color} ${
                      isToday ? 'outline outline-2 outline-gray-800 dark:outline-gray-200' : ''
                    } ${cell.date && days.includes(cell.date) ? 'cursor-pointer hover:opacity-75' : ''}`}
                    onMouseEnter={(e) => handleMouseEnter(e, cell.date)}
                    onMouseLeave={() => setTooltip(null)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl max-w-[200px]"
          style={{ left: tooltip.x + 16, top: tooltip.y - 8 }}
        >
          <p className="font-medium">{new Date(tooltip.date).toLocaleDateString('de-DE', { day: 'numeric', month: 'short' })}</p>
          {tooltip.phase && <p className="text-gray-300 mt-0.5">Phase: {tooltip.phase}</p>}
          {tooltip.temp && <p className="text-gray-300">Temp: {tooltip.temp}°C</p>}
          {tooltip.symptoms && tooltip.symptoms.length > 0 && (
            <p className="text-gray-300">Symptome: {tooltip.symptoms.join(', ')}</p>
          )}
          {tooltip.hrv !== undefined && <p className="text-gray-300">HRV: {tooltip.hrv}ms</p>}
        </div>
      )}

      <div className="mt-3 flex items-center gap-4 flex-wrap">
        {mode === 'phase' && (
          <>
            {Object.entries(PHASE_COLORS).map(([phase, color]) => (
              <div key={phase} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded-sm ${color}`} />
                <span className="text-xs text-gray-500 dark:text-gray-400">{PHASE_LABELS[phase]}</span>
              </div>
            ))}
          </>
        )}
        {mode === 'symptoms' && (
          <>
            {[['0', 'bg-gray-100'], ['1', 'bg-rose-200'], ['2', 'bg-rose-400'], ['3+', 'bg-[#5A68E8]']].map(([label, color]) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded-sm ${color}`} />
                <span className="text-xs text-gray-500 dark:text-gray-400">{label} Symptome</span>
              </div>
            ))}
          </>
        )}
        {mode === 'hrv' && (
          <>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-teal-300" /><span className="text-xs text-gray-500 dark:text-gray-400">Hoch</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-gray-200" /><span className="text-xs text-gray-500 dark:text-gray-400">Normal</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-rose-300" /><span className="text-xs text-gray-500 dark:text-gray-400">Niedrig</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-[#6F7CFF]" /><span className="text-xs text-gray-500 dark:text-gray-400">Sehr niedrig</span></div>
          </>
        )}
      </div>
    </div>
  );
}

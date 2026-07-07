import type { CycleDay } from '../types';
import { getPhaseTailwindBg } from '../utils/cycleUtils';
import { useMedicationStore } from '../store/medicationStore';

interface CycleCalendarProps {
  cycleData: CycleDay[];
  onDayClick: (day: CycleDay) => void;
}

const TODAY = '2026-05-18';
const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

export function CycleCalendar({ cycleData, onDayClick }: CycleCalendarProps) {
  const { hasAnyIntakeOnDate } = useMedicationStore();
  const year = 2026;
  const month = 4; // May (0-indexed)

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDow = (firstDay.getDay() + 6) % 7; // 0=Monday

  const dataMap = new Map(cycleData.map((d) => [d.date, d]));

  const cells: (CycleDay | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const dateStr = `${year}-05-${String(d).padStart(2, '0')}`;
    cells.push(dataMap.get(dateStr) ?? null);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">Mai 2026</h3>
        <div className="flex gap-3 text-xs">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-rose-200 border border-rose-400 inline-block" />Mens.</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-purple-100 border border-purple-300 inline-block" />Follikel</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-amber-200 border border-amber-400 inline-block" />Ovulation</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-teal-100 border border-teal-300 inline-block" />Luteal</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#B391C8] inline-block" />Medi</span>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) {
            return <div key={`empty-${i}`} />;
          }
          const isToday = day.date === TODAY;
          const phaseClasses = getPhaseTailwindBg(day.phase);
          const hasMeds = hasAnyIntakeOnDate(day.date);

          return (
            <button
              key={day.date}
              onClick={() => onDayClick(day)}
              className={`
                relative aspect-square rounded-lg border text-xs font-medium
                flex items-center justify-center cursor-pointer
                transition-all duration-150 hover:scale-105 hover:shadow-md
                ${phaseClasses}
                ${isToday ? 'ring-2 ring-gray-800 ring-offset-1' : ''}
              `}
            >
              {new Date(day.date).getDate()}
              {hasMeds && (
                <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-[#B391C8]" />
              )}
              {isToday && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gray-800" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

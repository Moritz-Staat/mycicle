interface CycleProgressBarProps {
  currentDay: number;
  cycleLength: number;
}

const PHASES = [
  { label: 'Menstruation', days: 5, color: 'bg-rose-300', textColor: 'text-rose-700' },
  { label: 'Follikel', days: 8, color: 'bg-purple-200', textColor: 'text-purple-700' },
  { label: 'Ovulation', days: 3, color: 'bg-amber-300', textColor: 'text-amber-700' },
  { label: 'Luteal', days: 13, color: 'bg-teal-200', textColor: 'text-teal-700' },
];

export function CycleProgressBar({ currentDay, cycleLength }: CycleProgressBarProps) {
  const progress = (currentDay / cycleLength) * 100;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-900">Zyklus-Fortschritt</h3>
        <span className="text-sm text-gray-500">Tag {currentDay} von {cycleLength}</span>
      </div>

      {/* Progress bar with phase segments */}
      <div className="relative h-6 rounded-full overflow-hidden flex">
        {PHASES.map((phase) => {
          const widthPercent = (phase.days / cycleLength) * 100;
          return (
            <div
              key={phase.label}
              className={`${phase.color} transition-all duration-300`}
              style={{ width: `${widthPercent}%` }}
            />
          );
        })}
        {/* Needle marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-gray-800 shadow-md transition-all duration-500"
          style={{ left: `${progress}%` }}
        >
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-gray-800 rounded-full shadow" />
        </div>
      </div>

      {/* Phase labels */}
      <div className="flex mt-2 text-xs">
        {PHASES.map((phase) => {
          const widthPercent = (phase.days / cycleLength) * 100;
          return (
            <div
              key={phase.label}
              className={`text-center ${phase.textColor} font-medium`}
              style={{ width: `${widthPercent}%` }}
            >
              {phase.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

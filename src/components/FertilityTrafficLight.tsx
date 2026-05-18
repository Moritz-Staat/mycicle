interface FertilityTrafficLightProps {
  currentDay: number;
  ovulationDay: number;
  mode: 'contraception' | 'conception';
}

type LightStatus = 'red' | 'yellow' | 'green';

function getStatus(currentDay: number, ovulationDay: number, mode: 'contraception' | 'conception'): {
  status: LightStatus;
  title: string;
  message: string;
  daysUntil: number | null;
} {
  const fertileStart = ovulationDay - 5;
  const fertileEnd = ovulationDay + 1;
  const isFertile = currentDay >= fertileStart && currentDay <= fertileEnd;
  const isPeak = currentDay === ovulationDay || currentDay === ovulationDay - 1;
  const daysToFertile = Math.max(0, fertileStart - currentDay);
  const daysToEnd = Math.max(0, fertileEnd - currentDay);

  if (mode === 'conception') {
    if (isPeak) return { status: 'green', title: 'Beste Zeit!', message: 'Sarah ist maximal fruchtbar. Höchste Chance für eine Schwangerschaft.', daysUntil: null };
    if (isFertile) return { status: 'yellow', title: 'Fruchtbar', message: 'Sarah ist in der fruchtbaren Phase. Gute Chancen für eine Empfängnis.', daysUntil: daysToEnd };
    return { status: 'red', title: 'Nicht fruchtbar', message: `Fruchtbare Phase beginnt in ${daysToFertile} Tagen.`, daysUntil: daysToFertile };
  } else {
    if (isPeak) return { status: 'red', title: 'Hohes Risiko', message: 'Sarah ist maximal fruchtbar. Verhütung besonders wichtig.', daysUntil: null };
    if (isFertile) return { status: 'yellow', title: 'Erhöhtes Risiko', message: 'Sarah ist in der fruchtbaren Phase. Vorsicht geboten.', daysUntil: daysToEnd };
    return { status: 'green', title: 'Sicher', message: 'Sarah ist aktuell nicht fruchtbar.', daysUntil: daysToFertile };
  }
}

export function FertilityTrafficLight({ currentDay, ovulationDay, mode }: FertilityTrafficLightProps) {
  const { status, title, message } = getStatus(currentDay, ovulationDay, mode);

  const lights: LightStatus[] = ['red', 'yellow', 'green'];
  const lightColors = {
    red: { on: 'bg-red-500 shadow-red-300', off: 'bg-red-100' },
    yellow: { on: 'bg-amber-400 shadow-amber-200', off: 'bg-amber-100' },
    green: { on: 'bg-green-500 shadow-green-300', off: 'bg-green-100' },
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <h3 className="text-base font-semibold text-gray-900 mb-4">Fruchtbarkeitsampel</h3>

      <div className="flex flex-col items-center gap-4">
        {/* Traffic light SVG */}
        <div className="bg-gray-800 rounded-2xl p-4 flex flex-col gap-3">
          {lights.map((light) => (
            <div
              key={light}
              className={`w-14 h-14 rounded-full transition-all duration-500 ${
                status === light
                  ? `${lightColors[light].on} shadow-lg`
                  : `${lightColors[light].off} opacity-40`
              }`}
            />
          ))}
        </div>

        {/* Status text */}
        <div className="text-center">
          <p className={`text-lg font-bold ${
            status === 'red' ? 'text-red-600' : status === 'yellow' ? 'text-amber-600' : 'text-green-600'
          }`}>
            {title}
          </p>
          <p className="text-sm text-gray-600 mt-1 max-w-[220px]">{message}</p>
        </div>
      </div>
    </div>
  );
}

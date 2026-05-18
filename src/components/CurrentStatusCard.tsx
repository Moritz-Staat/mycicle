import type { CycleDay } from '../types';
import { getPhaseLabel, formatDate } from '../utils/cycleUtils';

interface CurrentStatusCardProps {
  today: CycleDay | undefined;
}

const PHASE_PARTNER_TEXT: Record<string, { title: string; description: string; emoji: string }> = {
  menstruation: {
    title: 'Sarah hat ihre Periode',
    description: 'Sarah befindet sich in ihrer Menstruationsphase. Diese Phase dauert typischerweise 5 Tage. Wärme und Fürsorge werden besonders geschätzt.',
    emoji: '🌺',
  },
  follicular: {
    title: 'Energie und Aufbruchstimmung',
    description: 'Sarah ist in der Follikelphase – Östrogen steigt und sie hat oft viel Energie und gute Laune. Eine gute Zeit für gemeinsame Aktivitäten!',
    emoji: '🌱',
  },
  ovulation: {
    title: 'Fruchtbare Phase',
    description: 'Sarah befindet sich in der Ovulationsphase. LH-Surge und Eisprung stehen bevor oder finden gerade statt. Besonders wichtig für Familienplanung.',
    emoji: '✨',
  },
  luteal: {
    title: 'Entspannungsphase',
    description: 'Sarah ist in der Lutealphase. Progesteron überwiegt. In dieser Zeit ist Sarah vielleicht ruhiger und braucht mehr Erholung. Unterstützung wird sehr geschätzt.',
    emoji: '🌙',
  },
};

export function CurrentStatusCard({ today }: CurrentStatusCardProps) {
  if (!today) return null;

  const phaseInfo = PHASE_PARTNER_TEXT[today.phase];

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-start gap-4">
        <div className="text-4xl">{phaseInfo.emoji}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-semibold text-gray-900">{phaseInfo.title}</h3>
          </div>
          <p className="text-xs text-gray-500 mb-2">{formatDate(today.date)} · Tag {today.dayOfCycle} · {getPhaseLabel(today.phase)}</p>
          <p className="text-sm text-gray-600 leading-relaxed">{phaseInfo.description}</p>
          {today.mood !== undefined && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-gray-500">Stimmung:</span>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${i <= (today.mood ?? 0) ? 'bg-rose-400' : 'bg-gray-200'}`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-400">({today.mood}/5)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

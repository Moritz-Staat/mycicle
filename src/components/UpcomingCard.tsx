import { Calendar, Zap, Heart } from 'lucide-react';

interface UpcomingCardProps {
  currentDay: number;
  cycleLength: number;
  ovulationDay: number;
  periodStart: number;
}

export function UpcomingCard({ currentDay, cycleLength, ovulationDay, periodStart }: UpcomingCardProps) {
  const daysToOvulation = ovulationDay - currentDay;
  const daysToPeriod = cycleLength - currentDay;
  const daysToFertileWindow = Math.max(0, (ovulationDay - 5) - currentDay);

  const events = [
    {
      icon: <Zap size={16} className="text-amber-500" />,
      label: 'Ovulation',
      days: daysToOvulation,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      icon: <Heart size={16} className="text-purple-500" />,
      label: 'Fruchtbares Fenster',
      days: daysToFertileWindow,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      icon: <Calendar size={16} className="text-[#6F7CFF]" />,
      label: 'Nächste Periode',
      days: daysToPeriod,
      color: 'text-[#6F7CFF]',
      bg: 'bg-[#EEF0FF]',
    },
  ].filter((e) => e.days >= 0);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <h3 className="text-base font-semibold text-gray-900 mb-4">Sarahs nächste Ereignisse</h3>
      <div className="space-y-3">
        {events.map((event) => (
          <div key={event.label} className={`flex items-center gap-3 p-3 rounded-xl ${event.bg}`}>
            {event.icon}
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">{event.label}</p>
            </div>
            <div className="text-right">
              {event.days === 0 ? (
                <span className={`text-sm font-bold ${event.color}`}>Heute</span>
              ) : event.days < 0 ? (
                <span className="text-sm text-gray-400">Vergangen</span>
              ) : (
                <span className={`text-sm font-bold ${event.color}`}>in {event.days} T.</span>
              )}
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-4 text-center">
        Basierend auf Tag {periodStart} des letzten Zyklus · Prognose
      </p>
    </div>
  );
}

import type { CycleDay } from '../types';
import { Heart, Leaf } from 'lucide-react';

interface FertileWindowCardProps {
  cycleData: CycleDay[];
  currentDay: number;
  predictedOvulation: number;
}

export function FertileWindowCard({ cycleData: _cycleData, currentDay, predictedOvulation }: FertileWindowCardProps) {
  const fertileStart = predictedOvulation - 5;
  const fertileEnd = predictedOvulation + 1;
  const daysToOvulation = predictedOvulation - currentDay;

  const isFertile = currentDay >= fertileStart && currentDay <= fertileEnd;
  const isPeakFertile = currentDay === predictedOvulation || currentDay === predictedOvulation - 1;

  const fertilityLevel = isPeakFertile ? 'Hoch' : isFertile ? 'Mittel' : 'Niedrig';
  const fertilityColor = isPeakFertile
    ? 'text-amber-600 bg-amber-50 border-amber-200'
    : isFertile
    ? 'text-purple-600 bg-purple-50 border-purple-200'
    : 'text-gray-500 bg-gray-50 border-gray-200';

  const windowDays = [fertileStart - 1, fertileStart, fertileStart + 1, fertileStart + 2, fertileStart + 3, fertileStart + 4, fertileEnd, fertileEnd + 1];

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">Fruchtbarkeitsfenster</h3>
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${fertilityColor}`}>
          {fertilityLevel}
        </span>
      </div>

      {/* Timeline bar */}
      <div className="mb-4">
        <div className="flex gap-1 mb-2">
          {windowDays.map((d) => {
            const isInWindow = d >= fertileStart && d <= fertileEnd;
            const isPeak = d === predictedOvulation;
            const isCurrent = d === currentDay;
            return (
              <div
                key={d}
                className={`
                  flex-1 h-8 rounded flex items-center justify-center text-xs font-bold
                  relative transition-all duration-200
                  ${isPeak ? 'bg-amber-400 text-white' : isInWindow ? 'bg-purple-200 text-purple-700' : 'bg-gray-100 text-gray-400'}
                  ${isCurrent ? 'ring-2 ring-gray-800 ring-offset-1' : ''}
                `}
              >
                {d}
                {isPeak && <Heart size={8} className="absolute top-0.5 right-0.5" fill="white" />}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>Tag {fertileStart - 1}</span>
          <span className="text-amber-500 font-medium">Ovulation Tag {predictedOvulation}</span>
          <span>Tag {fertileEnd + 1}</span>
        </div>
      </div>

      {/* Countdown */}
      <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
        <Leaf size={18} className="text-teal-500 flex-shrink-0" />
        <div>
          {daysToOvulation > 0 ? (
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-amber-600">{daysToOvulation} Tage</span> bis zur voraussichtlichen Ovulation
            </p>
          ) : daysToOvulation === 0 ? (
            <p className="text-sm font-semibold text-amber-600">Ovulation voraussichtlich heute!</p>
          ) : (
            <p className="text-sm text-gray-700">
              Ovulation war vor <span className="font-semibold">{Math.abs(daysToOvulation)} Tagen</span>
            </p>
          )}
          <p className="text-xs text-gray-400 mt-0.5">Sensiplan-Methode · Nur zu Informationszwecken</p>
        </div>
      </div>
    </div>
  );
}

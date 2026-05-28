import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface EducationSlide {
  phase: string;
  emoji: string;
  title: string;
  content: string;
  tip: string;
  color: string;
}

const SLIDES: EducationSlide[] = [
  {
    phase: 'Menstruation',
    emoji: '🌺',
    title: 'Was passiert gerade in Sarahs Körper?',
    content: 'Die Gebärmutterschleimhaut wird abgebaut. Progesteron und Östrogen sind auf dem tiefsten Stand. Viele Frauen empfinden Schmerzen, Müdigkeit und möchten sich zurückziehen.',
    tip: 'Tipp: Wärme, kein Druck, gemeinsames Netflix schauen – mehr braucht es oft nicht.',
    color: 'bg-[#EEF0FF] border-[#C5CAFF]',
  },
  {
    phase: 'Follikelphase',
    emoji: '🌱',
    title: 'Aufbruch und Energie',
    content: 'Östrogen steigt. Sarah fühlt sich wahrscheinlich energetisch, kommunikativ und optimistisch. Das Gehirn arbeitet anders: Kreativität und soziale Verbindung stehen im Vordergrund.',
    tip: 'Tipp: Jetzt ist eine gute Zeit für Dates, Unternehmungen und wichtige Gespräche!',
    color: 'bg-purple-50 border-purple-200',
  },
  {
    phase: 'Ovulationsphase',
    emoji: '✨',
    title: 'Der Höhepunkt des Zyklus',
    content: 'LH-Surge löst den Eisprung aus. Sarah ist maximal fruchtbar. Östrogen ist auf dem Höhepunkt – viele Frauen fühlen sich besonders attraktiv und selbstsicher.',
    tip: 'Tipp: Die fruchtbarsten Tage sind Tag 12-16. Für Familienplanung ist das die entscheidende Zeit.',
    color: 'bg-amber-50 border-amber-200',
  },
  {
    phase: 'Lutealphase',
    emoji: '🌙',
    title: 'Ruhe und Reflexion',
    content: 'Progesteron dominiert. Der Körper bereitet sich auf eine mögliche Schwangerschaft vor. Viele Frauen werden ruhiger, nach innen gerichtet, und brauchen mehr Schlaf.',
    tip: 'Tipp: In dieser Phase weniger planen, mehr Verständnis zeigen. PMS ist real – nimm es ernst.',
    color: 'bg-teal-50 border-teal-200',
  },
];

export function EducationCard() {
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];

  return (
    <div className={`rounded-xl border p-5 ${slide.color}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Wissen für Tom</span>
        <div className="flex gap-1">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === index ? 'bg-gray-600 scale-125' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      </div>

      <div className="text-3xl mb-3">{slide.emoji}</div>
      <p className="text-xs font-medium text-gray-500 mb-1">{slide.phase}</p>
      <h4 className="text-sm font-semibold text-gray-900 mb-2">{slide.title}</h4>
      <p className="text-sm text-gray-600 leading-relaxed mb-3">{slide.content}</p>
      <div className="bg-white/60 rounded-lg p-3 text-xs text-gray-700 font-medium">
        {slide.tip}
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={() => setIndex(Math.max(0, index - 1))}
          disabled={index === 0}
          className="p-1.5 rounded-lg hover:bg-white/50 disabled:opacity-30 transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-xs text-gray-400 self-center">{index + 1} / {SLIDES.length}</span>
        <button
          onClick={() => setIndex(Math.min(SLIDES.length - 1, index + 1))}
          disabled={index === SLIDES.length - 1}
          className="p-1.5 rounded-lg hover:bg-white/50 disabled:opacity-30 transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

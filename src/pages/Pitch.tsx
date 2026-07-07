import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, X } from 'lucide-react';

const SLIDES = [
  {
    id: 'problem',
    label: '01 · Problem',
    badge: 'bg-red-100 text-red-700',
    headline: 'Frauen-Gesundheit wird\n systematisch ignoriert',
    subline: 'In medizinischen Studien sind 70% der Probanden männlich. Frauen werden mit falschen Referenzwerten behandelt.',
    bullets: [
      '💊 Medikamentendosierungen für männliche Körper optimiert',
      '📊 Keine Zyklusdaten in medizinischen Diagnosen',
      '🔴 Wearables messen HRV ohne Zykluskontext',
      '😔 Frauen leiden still – PMS, Endometriose, Zyklusunregelmäßigkeiten unerkannt',
    ],
    bg: 'from-red-50 to-rose-100',
    accent: 'text-red-600',
  },
  {
    id: 'solution',
    label: '02 · Lösung',
    badge: 'bg-[#EEF0FF] text-[#6F7CFF]',
    headline: 'mycycle – KI + Wearables\n + Zyklus in einem',
    subline: 'Wir korrelieren Oura/Apple Watch Daten mit Zyklusdaten und geben Frauen zum ersten Mal ein vollständiges Bild ihrer Gesundheit.',
    bullets: [
      '🌡️ Sensiplan-konforme Temperaturauswertung mit KI',
      '💓 HRV und Schlafdaten im Zykluskontext',
      '🤖 KI erkennt Anomalien bevor sie zu Problemen werden',
      '👫 Partner-Ansicht mit Bildungsinhalt',
    ],
    bg: 'from-rose-50 to-pink-100',
    accent: 'text-[#6F7CFF]',
  },
  {
    id: 'demo',
    label: '03 · Demo',
    badge: 'bg-purple-100 text-purple-700',
    headline: 'Live Demo',
    subline: 'Die App, die du gerade siehst, ist die vollständige Lösung.',
    demo: true,
    bullets: [
      '📅 Dashboard mit Temperaturkurve & Zykluskalender',
      '⌚ Wearable-Charts: HRV, Schlaf, Korrelationen',
      '🧠 KI-Insights mit Severity-Levels und Handlungshinweisen',
      '👫 Partner-Login & Fruchtbarkeitsampel',
    ],
    bg: 'from-purple-50 to-violet-100',
    accent: 'text-purple-600',
  },
  {
    id: 'business',
    label: '04 · Business',
    badge: 'bg-amber-100 text-amber-700',
    headline: 'Business Model',
    subline: 'Drei Einnahmequellen mit klarem Skalierungspfad',
    bullets: [
      '💳 B2C Premium: €9.99/Monat (Freemium-Einstieg)',
      '🏢 B2B Health Insurance: Lizenzmodell für Krankenkassen',
      '🔬 B2B Research: Anonymisierte Aggregatdaten für Studien',
    ],
    metrics: [
      { label: 'TAM', value: '€2.4 Mrd', sub: 'FemTech EU 2026' },
      { label: 'Ziel Y1', value: '10.000', sub: 'zahlende User' },
      { label: 'ARR Ziel', value: '€1.2M', sub: 'nach 18 Monaten' },
    ],
    bg: 'from-amber-50 to-yellow-100',
    accent: 'text-amber-600',
  },
  {
    id: 'cta',
    label: '05 · CTA',
    badge: 'bg-teal-100 text-teal-700',
    headline: 'Bereit für die\nnächste Runde?',
    subline: 'Wir suchen €500K Pre-Seed für 12 Monate Runway: iOS-App, Arzt-Export, Kasse-Piloten.',
    cta: true,
    bullets: [
      '✅ MVP live & technisch validiert',
      '✅ Erste Nutzerfeedbacks extrem positiv',
      '✅ Team: Tech + Medical + Growth',
      '🚀 Go-to-market: Q3 2026',
    ],
    bg: 'from-teal-50 to-cyan-100',
    accent: 'text-teal-600',
  },
];

export default function Pitch() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const slide = SLIDES[current];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        setCurrent((prev) => Math.min(prev + 1, SLIDES.length - 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrent((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Escape') {
        navigate(-1);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate]);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${slide.bg} flex flex-col`}>
      {/* Nav bar */}
      <div className="flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#6F7CFF] flex items-center justify-center">
            <Heart size={14} className="text-white" fill="white" />
          </div>
          <span className="text-base font-bold text-gray-900">mycycle</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${slide.badge}`}>
            {slide.label}
          </span>
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-lg hover:bg-white/50 text-gray-500 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-8 py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -60, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="max-w-3xl w-full"
          >
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-4 whitespace-pre-line">
              {slide.headline}
            </h1>
            <p className={`text-lg ${slide.accent} font-medium mb-8`}>
              {slide.subline}
            </p>

            <div className="grid gap-3 mb-8">
              {slide.bullets.map((b, i) => (
                <div key={i} className="bg-white/70 backdrop-blur-sm rounded-xl px-5 py-3.5 text-sm text-gray-700 font-medium shadow-sm">
                  {b}
                </div>
              ))}
            </div>

            {/* Metrics for Business slide */}
            {'metrics' in slide && slide.metrics && (
              <div className="grid grid-cols-3 gap-4">
                {slide.metrics.map((m) => (
                  <div key={m.label} className="bg-white/80 rounded-2xl p-5 text-center shadow-sm">
                    <p className="text-xs text-gray-500 font-medium">{m.label}</p>
                    <p className="text-3xl font-black text-gray-900 mt-1">{m.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{m.sub}</p>
                  </div>
                ))}
              </div>
            )}

            {/* CTA for last slide */}
            {'cta' in slide && slide.cta && (
              <div className="flex flex-wrap gap-3 mt-4">
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-3 bg-[#6F7CFF] text-white rounded-xl font-semibold hover:bg-[#5A68E8] transition-colors shadow-md"
                >
                  Demo testen →
                </button>
                <a
                  href="mailto:hello@mycycle.app"
                  className="px-6 py-3 bg-white/80 text-gray-700 rounded-xl font-semibold hover:bg-white transition-colors shadow-sm"
                >
                  Kontakt aufnehmen
                </a>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between px-8 py-5">
        <button
          onClick={() => setCurrent(Math.max(0, current - 1))}
          disabled={current === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 hover:bg-white/80 text-gray-700 text-sm font-medium transition-colors disabled:opacity-30"
        >
          <ChevronLeft size={18} />
          Zurück
        </button>

        {/* Progress dots */}
        <div className="flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current ? 'w-6 h-3 bg-gray-700' : 'w-3 h-3 bg-gray-300 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrent(Math.min(SLIDES.length - 1, current + 1))}
          disabled={current === SLIDES.length - 1}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 hover:bg-white/80 text-gray-700 text-sm font-medium transition-colors disabled:opacity-30"
        >
          Weiter
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="text-center pb-3 text-xs text-gray-400">← → Navigation · ESC zum Schließen</div>
    </div>
  );
}

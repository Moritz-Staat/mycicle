import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Heart, Activity, Sparkles, Users } from 'lucide-react';
import { useUIStore } from '../store/uiStore';
import { useUserStore } from '../store/userStore';

const SLIDES = [
  {
    icon: <Heart size={32} className="text-[#6F7CFF]" />,
    title: 'Willkommen bei mycicle',
    description: 'Deine KI-gestützte App für Zyklusmonitoring mit Wearable-Integration. Verstehe deinen Körper besser – Zyklus für Zyklus.',
    bg: 'bg-[#EEF0FF]',
  },
  {
    icon: <div className="text-5xl">🌡️</div>,
    title: 'Zyklusdaten tracken',
    description: 'Erfasse täglich Basaltemperatur, Zervixschleim und Symptome. Die KI erkennt Muster und bestätigt deine Ovulation nach der Sensiplan-Methode.',
    bg: 'bg-purple-50',
  },
  {
    icon: <Activity size={32} className="text-teal-500" />,
    title: 'Wearable-Daten nutzen',
    description: 'Verbinde deinen Oura Ring oder deine Smartwatch. HRV, Schlaf und Herzrate werden mit deinem Zyklus korreliert – für tiefere Einblicke.',
    bg: 'bg-teal-50',
  },
  {
    icon: <Sparkles size={32} className="text-amber-500" />,
    title: 'KI-Insights',
    description: 'Erhalte personalisierte Erkenntnisse: Anomalien, Muster und konkrete Empfehlungen für Training, Schlaf und Stressmanagement.',
    bg: 'bg-amber-50',
  },
  {
    icon: <Users size={32} className="text-blue-500" />,
    title: 'Partner einbinden',
    description: 'Teile ausgewählte Informationen mit deinem Partner. Über den Partner-Zugang versteht er oder sie deinen Zyklus besser – mit Fruchtbarkeitsampel und Bildungsinhalt.',
    bg: 'bg-blue-50',
  },
];

export function OnboardingTour() {
  const { showTour, setShowTour } = useUIStore();
  const authState = useUserStore((s) => s.authState);
  const [step, setStep] = useState(0);

  if (!showTour || authState === 'guest') return null;

  const slide = SLIDES[step];
  const isLast = step === SLIDES.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          {/* Slide content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -30, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Hero area */}
              <div className={`${slide.bg} px-8 py-10 flex flex-col items-center text-center`}>
                <div className="mb-4">{slide.icon}</div>
                <h2 className="text-xl font-bold text-gray-900">{slide.title}</h2>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{slide.description}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Footer */}
          <div className="px-6 py-4">
            {/* Dots */}
            <div className="flex justify-center gap-2 mb-4">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  className={`rounded-full transition-all duration-200 ${
                    i === step ? 'w-4 h-2 bg-[#6F7CFF]' : 'w-2 h-2 bg-gray-200 hover:bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowTour(false)}
                className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1"
              >
                <X size={14} />
                Überspringen
              </button>
              <div className="flex-1 flex gap-2">
                {step > 0 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft size={16} />
                    Zurück
                  </button>
                )}
                <button
                  onClick={() => isLast ? setShowTour(false) : setStep(step + 1)}
                  className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-[#6F7CFF] text-white text-sm font-semibold hover:bg-[#5A68E8] transition-colors"
                >
                  {isLast ? 'Los geht\'s!' : 'Weiter'}
                  {!isLast && <ChevronRight size={16} />}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

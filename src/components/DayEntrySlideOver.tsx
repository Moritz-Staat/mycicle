import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Thermometer, Pill, Check } from 'lucide-react';
import type { CycleDay } from '../types';
import { getPhaseLabel, formatDate } from '../utils/cycleUtils';
import { useMedicationStore } from '../store/medicationStore';
import { Chip } from './ui/Chip';
import { Button } from './ui/Button';

interface DayEntrySlideOverProps {
  day: CycleDay | null;
  onClose: () => void;
}

const SYMPTOM_OPTIONS = [
  'Krämpfe', 'Kopfschmerzen', 'Müdigkeit', 'Blähungen', 'Rückenschmerzen',
  'Energie hoch', 'Mittelschmerz', 'Übelkeit', 'Brustspannen', 'PMS',
  'Stimmungsschwankungen', 'Libido hoch', 'Libido niedrig', 'Akne',
];

const MUCUS_OPTIONS: Array<{ value: CycleDay['cervicalMucus']; label: string }> = [
  { value: 'dry', label: 'Trocken' },
  { value: 'moist', label: 'Feucht' },
  { value: 'creamy', label: 'Cremig' },
  { value: 'egg-white', label: 'Spinnbar' },
];

const MOOD_EMOJIS = ['😞', '😕', '😐', '🙂', '😄'];

export function DayEntrySlideOver({ day, onClose }: DayEntrySlideOverProps) {
  const [temperature, setTemperature] = useState(day?.temperature?.toString() ?? '');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(day?.symptoms ?? []);
  const [mucus, setMucus] = useState<CycleDay['cervicalMucus']>(day?.cervicalMucus);
  const [mood, setMood] = useState<number>(day?.mood ?? 3);
  const [notes, setNotes] = useState(day?.notes ?? '');

  const toggleSymptom = (s: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  return (
    <AnimatePresence>
      {day && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50"
            onClick={onClose}
          />

          {/* Slide-over panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full md:w-[420px] bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Tag {day.dayOfCycle} – {getPhaseLabel(day.phase)}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">{formatDate(day.date)}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
              {/* Temperature */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <Thermometer size={14} className="inline mr-1 text-[#6F7CFF]" />
                  Basaltemperatur (°C)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="35.5"
                  max="38.5"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  placeholder="z.B. 36.45"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
              </div>

              {/* Cervical mucus */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Zervixschleim</label>
                <div className="grid grid-cols-2 gap-2">
                  {MUCUS_OPTIONS.map((opt) => (
                    <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="mucus"
                        value={opt.value}
                        checked={mucus === opt.value}
                        onChange={() => setMucus(opt.value)}
                        className="accent-rose-500"
                      />
                      <span className="text-sm text-gray-700">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Symptoms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Symptome</label>
                <div className="flex flex-wrap gap-2">
                  {SYMPTOM_OPTIONS.map((s) => (
                    <Chip
                      key={s}
                      active={selectedSymptoms.includes(s)}
                      onClick={() => toggleSymptom(s)}
                    >
                      {s}
                    </Chip>
                  ))}
                </div>
              </div>

              {/* Mood */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stimmung</label>
                <div className="flex gap-3">
                  {MOOD_EMOJIS.map((emoji, i) => (
                    <button
                      key={i}
                      onClick={() => setMood(i + 1)}
                      className={`text-2xl p-2 rounded-lg transition-all duration-150 ${
                        mood === i + 1 ? 'bg-[#EEF0FF] scale-110' : 'hover:bg-gray-100'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Medications */}
              <MedicationCheckSection date={day.date} />

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Notizen</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Besonderheiten, Medikamente, ..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-gray-100 flex gap-3">
              <Button variant="ghost" onClick={onClose} className="flex-1">Abbrechen</Button>
              <Button variant="primary" onClick={onClose} className="flex-1">Speichern</Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── Medication check section inside day entry ─── */
function MedicationCheckSection({ date }: { date: string }) {
  const { medications, isTakenOnDate, logIntake } = useMedicationStore();
  const activeMeds = medications.filter((m) => m.active);

  if (activeMeds.length === 0) return null;

  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
        <Pill size={14} className="text-[#B391C8]" />
        Medikamente
      </label>
      <div className="space-y-2">
        {activeMeds.map((med) => {
          const taken = isTakenOnDate(date, med.id);
          return (
            <button
              key={med.id}
              onClick={() => logIntake(date, med.id, !taken)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all text-left ${
                taken
                  ? 'bg-[#EBF8F4] border-[#7CC8B5] dark:bg-teal-950/30'
                  : 'bg-white border-gray-200 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-colors ${
                  taken
                    ? 'bg-[#7CC8B5] text-white'
                    : 'border-2 border-gray-300 dark:border-gray-600'
                }`}
              >
                {taken && <Check size={12} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${taken ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}>
                  {med.name}
                </p>
                <p className="text-xs text-gray-400">
                  {med.dosage}{med.time ? ` · ${med.time} Uhr` : ''}
                </p>
              </div>
              {taken && (
                <span className="text-[10px] font-medium text-[#7CC8B5]">Eingenommen</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

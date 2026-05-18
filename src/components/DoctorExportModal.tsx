import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Download } from 'lucide-react';
import { Button } from './ui/Button';

interface DoctorExportModalProps {
  open: boolean;
  onClose: () => void;
}

const DATA_OPTIONS = [
  { id: 'cycle', label: 'Zyklusdaten (Temperatur, Zervixschleim)' },
  { id: 'symptoms', label: 'Symptome & Stimmung' },
  { id: 'hrv', label: 'HRV & Ruhepuls (Oura)' },
  { id: 'sleep', label: 'Schlafanalyse' },
  { id: 'insights', label: 'KI-Erkenntnisse & Anomalien' },
];

export function DoctorExportModal({ open, onClose }: DoctorExportModalProps) {
  const [period, setPeriod] = useState('3months');
  const [selectedData, setSelectedData] = useState<string[]>(['cycle', 'symptoms', 'insights']);
  const [exporting, setExporting] = useState(false);

  const toggleData = (id: string) => {
    setSelectedData((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-rose-600" />
                  <h2 className="text-base font-semibold text-gray-900">Arzt-Export erstellen</h2>
                </div>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
                  <X size={16} />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-5 space-y-5">
                {/* Time period */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Zeitraum</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: '1month', label: '1 Monat' },
                      { id: '3months', label: '3 Monate' },
                      { id: '6months', label: '6 Monate' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setPeriod(opt.id)}
                        className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                          period === opt.id
                            ? 'bg-rose-600 text-white border-rose-600'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-rose-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Data selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Enthaltene Daten</label>
                  <div className="space-y-2">
                    {DATA_OPTIONS.map((opt) => (
                      <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedData.includes(opt.id)}
                          onChange={() => toggleData(opt.id)}
                          className="accent-rose-500 w-4 h-4"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-gray-900">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-gray-400">
                  Generiert ein PDF-Dokument für deinen Arzt oder Gynäkologen. Alle Daten bleiben auf deinem Gerät.
                </p>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
                <Button variant="ghost" onClick={onClose} className="flex-1">Abbrechen</Button>
                <Button
                  variant="primary"
                  onClick={handleExport}
                  loading={exporting}
                  leftIcon={<Download size={14} />}
                  className="flex-1"
                >
                  PDF exportieren
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

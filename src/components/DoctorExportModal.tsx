import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Download, Check } from 'lucide-react';
import { Button } from './ui/Button';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  const [generating, setGenerating] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggleData = (id: string) => {
    setSelectedData((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleGeneratePDF = async () => {
    setGenerating(true);
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageW = 210;
    const margin = 20;

    // SEITE 1: Deckblatt
    pdf.setFillColor(194, 24, 91);
    pdf.rect(0, 0, pageW, 40, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('mycicle', margin, 20);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text('KI-gestuetzte Zyklusgesundheit', margin, 30);

    pdf.setTextColor(30, 30, 30);
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Gesundheitsbericht', margin, 65);
    pdf.text('Sarah M.', margin, 78);

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text('Zeitraum: 01. Februar 2026 - 18. Mai 2026', margin, 92);
    pdf.text(`Erstellt am: ${new Date().toLocaleDateString('de-DE')}`, margin, 100);

    pdf.setFontSize(9);
    pdf.setTextColor(130, 130, 130);
    const disclaimer = 'Dieser Bericht wurde automatisch durch mycicle generiert und dient als Gesprächsgrundlage für das Arztgespräch. Er ersetzt keine medizinische Diagnose.';
    pdf.text(pdf.splitTextToSize(disclaimer, pageW - 2 * margin), margin, 200);

    pdf.setDrawColor(194, 24, 91);
    pdf.line(margin, 280, pageW - margin, 280);
    pdf.setFontSize(8);
    pdf.text('mycicle · KI-gestuetzte Zyklusgesundheit · mycicle.staatsprojekte.uk', margin, 286);

    // SEITE 2: Zyklusübersicht
    pdf.addPage();
    pdf.setTextColor(30, 30, 30);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Zyklusuebersicht', margin, 30);

    autoTable(pdf, {
      startY: 38,
      margin: { left: margin, right: margin },
      head: [['Zyklus', 'Startdatum', 'Laenge (Tage)', 'Periodendauer', 'Besonderheiten']],
      body: [
        ['#6 (aktuell)', '05. Mai 2026', '-', '-', 'Laufend'],
        ['#5', '06. Apr. 2026', '29', '5 Tage', 'Normal'],
        ['#4', '08. Mär. 2026', '29', '5 Tage', 'HRV-Anomalie'],
        ['#3', '07. Feb. 2026', '30', '6 Tage', 'Verlängerte Periode'],
        ['#2', '09. Jan. 2026', '29', '5 Tage', 'Normal'],
        ['#1', '11. Dez. 2025', '29', '5 Tage', 'Normal'],
      ],
      headStyles: { fillColor: [194, 24, 91], textColor: 255 },
      alternateRowStyles: { fillColor: [254, 242, 242] },
      styles: { fontSize: 9 },
    });

    const statsY = (pdf as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Statistik:', margin, statsY);
    pdf.setFont('helvetica', 'normal');
    pdf.text(
      'Ø Zyklus: 29.2 Tage  |  Kürzester: 29 Tage  |  Laengster: 30 Tage  |  Ø Periode: 5.2 Tage',
      margin,
      statsY + 7
    );

    // SEITE 3: Wearable-Daten
    pdf.addPage();
    pdf.setTextColor(30, 30, 30);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Wearable-Daten (Oura Ring)', margin, 30);

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(80, 80, 80);
    pdf.text('Ø HRV (30 Tage): 45ms  |  Ø Schlaf: 7.1h  |  Ø Schritte: 9.240', margin, 40);

    autoTable(pdf, {
      startY: 48,
      margin: { left: margin, right: margin },
      head: [['Woche', 'Ø HRV (ms)', 'Ø Schlaf (h)', 'Ø Schritte', 'Ø Resting HR']],
      body: [
        ['05.-11. Mai', '38', '6.8', '8.900', '63'],
        ['28. Apr-04. Mai', '44', '7.2', '9.400', '61'],
        ['21.-27. Apr.', '47', '7.4', '9.800', '60'],
        ['14.-20. Apr.', '43', '6.9', '9.100', '62'],
      ],
      headStyles: { fillColor: [0, 137, 123], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 253, 250] },
      styles: { fontSize: 9 },
    });

    const wearY = (pdf as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 12;
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(30, 30, 30);
    pdf.text('Erkannte Anomalien:', margin, wearY);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(80, 80, 80);
    pdf.text(
      '- HRV-Einbruch (38ms, -15%) in der Woche 05.-11. Mai - korreliert mit Lutealphase',
      margin,
      wearY + 8
    );
    pdf.text(
      '- 2 Naechte unter 6h Schlaf (08.-09. Mai) - moegliche Stressreaktion',
      margin,
      wearY + 15
    );

    // SEITE 4: KI-Insights
    pdf.addPage();
    pdf.setTextColor(30, 30, 30);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('KI-Insights & Empfehlungen', margin, 30);

    const insights = [
      {
        title: 'HRV-Einbruch vor Periode',
        desc: 'Dein HRV sinkt konsistent 3 Tage vor der Periode um durchschnittlich 22%. Dies ist ein zuverlaessiger Fruehindikator.',
        hint: 'Plane intensive Trainingseinheiten nicht in die letzten 3 Tage vor der Periode.',
      },
      {
        title: 'Regelmaessige Lutealphase',
        desc: 'Deine Lutealphase ist konstant 14 Tage lang - ein Zeichen eines gut funktionierenden Progesteronspiegels.',
        hint: 'Diese Regelmaessigkeit erleichtert die Zyklusprognose erheblich.',
      },
      {
        title: 'Schlaf-Zyklus-Korrelation',
        desc: 'Dein Schlaf ist in der Follikelphase am besten (7.4h) und in der Lutealphase am schlechtesten (6.6h).',
        hint: 'In der Lutealphase: Abendrituale staerken, Bildschirmzeit reduzieren.',
      },
    ];

    let insightY = 42;
    insights.forEach((insight, i) => {
      pdf.setFillColor(254, 242, 242);
      pdf.rect(margin, insightY, pageW - 2 * margin, 28, 'F');
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(194, 24, 91);
      pdf.text(`${i + 1}. ${insight.title}`, margin + 3, insightY + 7);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(60, 60, 60);
      pdf.setFontSize(8.5);
      pdf.text(pdf.splitTextToSize(insight.desc, pageW - 2 * margin - 6), margin + 3, insightY + 14);
      pdf.setTextColor(0, 137, 123);
      pdf.setFont('helvetica', 'italic');
      pdf.text(`-> ${insight.hint}`, margin + 3, insightY + 23);
      insightY += 34;
    });

    pdf.save(`mycicle-bericht-sarah-${new Date().toISOString().slice(0, 7)}.pdf`);
    setGenerating(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
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
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-rose-600" />
                  <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Arzt-Export erstellen</h2>
                </div>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
                  <X size={16} />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-5 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Zeitraum</label>
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
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-rose-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Enthaltene Daten</label>
                  <div className="space-y-2">
                    {DATA_OPTIONS.map((opt) => (
                      <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedData.includes(opt.id)}
                          onChange={() => toggleData(opt.id)}
                          className="accent-rose-500 w-4 h-4"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Generiert ein 4-seitiges PDF-Dokument für deinen Arzt. Alle Daten bleiben auf deinem Gerät.
                </p>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex gap-3">
                <Button variant="ghost" onClick={onClose} className="flex-1">Abbrechen</Button>
                <Button
                  variant="primary"
                  onClick={handleGeneratePDF}
                  loading={generating}
                  disabled={generating || success}
                  leftIcon={success ? <Check size={14} /> : <Download size={14} />}
                  className="flex-1"
                >
                  {success ? 'PDF heruntergeladen' : generating ? 'Wird generiert...' : 'PDF erstellen'}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

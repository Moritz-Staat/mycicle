import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Download, Check } from 'lucide-react';
import { Button } from './ui/Button';
import { useUserStore } from '../store/userStore';
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

/* ─── Brand palette (RGB) ─── */
const C = {
  periwinkle: [111, 124, 255] as [number, number, number],
  periwinkleLight: [238, 240, 255] as [number, number, number],
  purple: [179, 145, 200] as [number, number, number],
  purpleLight: [243, 237, 248] as [number, number, number],
  teal: [124, 200, 181] as [number, number, number],
  tealDark: [13, 148, 136] as [number, number, number],
  tealLight: [240, 253, 250] as [number, number, number],
  text: [26, 22, 37] as [number, number, number],
  muted: [104, 98, 122] as [number, number, number],
  bg: [248, 247, 250] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
};

export function DoctorExportModal({ open, onClose }: DoctorExportModalProps) {
  const profile = useUserStore((s) => s.profile);
  const [period, setPeriod] = useState('3months');
  const [selectedData, setSelectedData] = useState<string[]>(['cycle', 'symptoms', 'insights']);
  const [generating, setGenerating] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggleData = (id: string) => {
    setSelectedData((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleGeneratePDF = async () => {
    setGenerating(true);

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const W = 210;
    const M = 20;
    const contentW = W - 2 * M;
    const userName = profile.name || 'Nutzerin';
    const today = new Date().toLocaleDateString('de-DE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    const totalPages = 4;

    /* ─── helpers ─── */
    const footer = (page: number) => {
      pdf.setDrawColor(...C.periwinkle);
      pdf.setLineWidth(0.4);
      pdf.line(M, 279, W - M, 279);
      pdf.setFontSize(7.5);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...C.muted);
      pdf.text('mycycle  \u00B7  KI-gestuetzte Zyklusgesundheit', M, 285);
      pdf.text(`Seite ${page} von ${totalPages}`, W - M, 285, { align: 'right' });
    };

    const sectionTitle = (title: string, y: number, accent: [number, number, number]) => {
      pdf.setFillColor(...accent);
      pdf.rect(M, y - 5, 3, 12, 'F');
      pdf.setFontSize(15);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...C.text);
      pdf.text(title, M + 8, y + 4);
    };

    const drawLogo = (x: number, y: number, size: number) => {
      pdf.setFillColor(145, 155, 255);
      pdf.roundedRect(x, y, size, size, size * 0.17, size * 0.17, 'F');
      // Heart shape
      const cx = x + size / 2;
      const cy = y + size * 0.4;
      const r = size * 0.14;
      pdf.setFillColor(...C.white);
      pdf.circle(cx - r * 1.1, cy, r, 'F');
      pdf.circle(cx + r * 1.1, cy, r, 'F');
      pdf.triangle(
        cx - r * 2.4, cy + r * 0.4,
        cx + r * 2.4, cy + r * 0.4,
        cx, cy + r * 3,
        'F',
      );
    };

    /* ════════════════════════════════════════
       PAGE 1 — Cover
       ════════════════════════════════════════ */
    // Header bar
    pdf.setFillColor(...C.periwinkle);
    pdf.rect(0, 0, W, 48, 'F');

    // Teal accent stripe
    pdf.setFillColor(...C.teal);
    pdf.rect(0, 48, W, 1.5, 'F');

    // Logo
    drawLogo(M, 12, 24);

    // Header text
    pdf.setTextColor(...C.white);
    pdf.setFontSize(22);
    pdf.setFont('helvetica', 'bold');
    pdf.text('mycycle', M + 30, 26);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('KI-gestuetzte Zyklusgesundheit', M + 30, 35);

    // Title
    pdf.setTextColor(...C.text);
    pdf.setFontSize(26);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Gesundheitsbericht', M, 76);

    // Decorative line
    pdf.setFillColor(...C.periwinkle);
    pdf.rect(M, 81, 40, 1.5, 'F');

    // Patient info
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(userName, M, 96);

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...C.muted);
    pdf.text('Zeitraum: 01. Februar 2026 \u2013 18. Mai 2026', M, 106);
    pdf.text(`Erstellt am: ${today}`, M, 113);

    // Summary box
    pdf.setFillColor(...C.bg);
    pdf.roundedRect(M, 126, contentW, 52, 3, 3, 'F');
    pdf.setFillColor(...C.periwinkle);
    pdf.rect(M, 126, 3, 52, 'F');

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...C.text);
    pdf.text('Zusammenfassung', M + 10, 138);

    pdf.setFontSize(9.5);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...C.muted);
    [
      '\u00D8 Zykluslaenge: 29.2 Tage   \u00B7   \u00D8 Periode: 5.2 Tage',
      'HRV-Baseline: 45 ms   \u00B7   \u00D8 Schlaf: 7.1 h/Nacht',
      '6 Zyklen dokumentiert   \u00B7   1 Anomalie erkannt',
      'Datenquelle: Oura Ring Gen 3 + manuelle Eingabe',
    ].forEach((line, i) => pdf.text(line, M + 10, 147 + i * 8));

    // Disclaimer
    pdf.setFontSize(8);
    pdf.setTextColor(155, 155, 165);
    const disclaimer =
      'Dieser Bericht wurde automatisch durch mycycle generiert und dient als Gespraechsgrundlage ' +
      'fuer das Arztgespraech. Er ersetzt keine medizinische Diagnose. Alle Daten stammen aus ' +
      'der Selbstdokumentation der Nutzerin und Wearable-Sensoren.';
    pdf.text(pdf.splitTextToSize(disclaimer, contentW), M, 230);

    footer(1);

    /* ════════════════════════════════════════
       PAGE 2 — Zyklusübersicht
       ════════════════════════════════════════ */
    pdf.addPage();
    sectionTitle('Zyklusuebersicht', 26, C.periwinkle);

    autoTable(pdf, {
      startY: 42,
      margin: { left: M, right: M },
      head: [['Zyklus', 'Startdatum', 'Laenge (Tage)', 'Periodendauer', 'Besonderheiten']],
      body: [
        ['#6 (aktuell)', '05. Mai 2026', '\u2013', '\u2013', 'Laufend (Tag 14)'],
        ['#5', '06. Apr. 2026', '29', '5 Tage', 'Normal'],
        ['#4', '08. Maer. 2026', '29', '5 Tage', 'HRV-Anomalie'],
        ['#3', '07. Feb. 2026', '30', '6 Tage', 'Verlaengerte Periode'],
        ['#2', '09. Jan. 2026', '29', '5 Tage', 'Normal'],
        ['#1', '11. Dez. 2025', '29', '5 Tage', 'Normal'],
      ],
      headStyles: {
        fillColor: C.periwinkle,
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 9,
      },
      bodyStyles: { fontSize: 9, textColor: C.text },
      alternateRowStyles: { fillColor: C.periwinkleLight },
      styles: { cellPadding: 3.5 },
    });

    const statsY =
      (pdf as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 14;

    pdf.setFillColor(...C.bg);
    pdf.roundedRect(M, statsY, contentW, 30, 3, 3, 'F');
    pdf.setFillColor(...C.teal);
    pdf.rect(M, statsY, 3, 30, 'F');

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...C.text);
    pdf.text('Statistik', M + 10, statsY + 10);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(...C.muted);
    pdf.text(
      '\u00D8 Zykluslaenge: 29.2 Tage   |   Kuerzester: 29 Tage   |   Laengster: 30 Tage',
      M + 10,
      statsY + 18,
    );
    pdf.text('\u00D8 Periode: 5.2 Tage   |   Biphasischer Temperaturverlauf in allen Zyklen', M + 10, statsY + 25);

    footer(2);

    /* ════════════════════════════════════════
       PAGE 3 — Wearable-Daten
       ════════════════════════════════════════ */
    pdf.addPage();
    sectionTitle('Wearable-Daten (Oura Ring)', 26, C.tealDark);

    pdf.setFontSize(9.5);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...C.muted);
    pdf.text(
      '\u00D8 HRV (30 Tage): 45 ms   \u00B7   \u00D8 Schlaf: 7.1 h   \u00B7   \u00D8 Schritte: 9.240',
      M + 8,
      40,
    );

    autoTable(pdf, {
      startY: 48,
      margin: { left: M, right: M },
      head: [['Woche', '\u00D8 HRV (ms)', '\u00D8 Schlaf (h)', '\u00D8 Schritte', '\u00D8 Resting HR']],
      body: [
        ['05.\u201311. Mai', '38', '6.8', '8.900', '63'],
        ['28. Apr\u201304. Mai', '44', '7.2', '9.400', '61'],
        ['21.\u201327. Apr.', '47', '7.4', '9.800', '60'],
        ['14.\u201320. Apr.', '43', '6.9', '9.100', '62'],
      ],
      headStyles: {
        fillColor: C.tealDark,
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 9,
      },
      bodyStyles: { fontSize: 9, textColor: C.text },
      alternateRowStyles: { fillColor: C.tealLight },
      styles: { cellPadding: 3.5 },
    });

    const anomY =
      (pdf as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 14;

    pdf.setFillColor(...C.bg);
    pdf.roundedRect(M, anomY, contentW, 40, 3, 3, 'F');
    pdf.setFillColor(...C.purple);
    pdf.rect(M, anomY, 3, 40, 'F');

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...C.text);
    pdf.text('Erkannte Anomalien', M + 10, anomY + 10);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(...C.muted);
    const anomalies = [
      '\u2022  HRV-Einbruch (38 ms, \u221215 %) in KW 19 \u2013 korreliert mit Lutealphase',
      '\u2022  2 Naechte unter 6 h Schlaf (08.\u201309. Mai) \u2013 moegliche Stressreaktion',
      '\u2022  Temperaturanomalie +0.2 \u00B0C an Tagen 18\u201320 in Zyklus #4',
    ];
    anomalies.forEach((a, i) => pdf.text(a, M + 10, anomY + 19 + i * 7));

    footer(3);

    /* ════════════════════════════════════════
       PAGE 4 — KI-Insights & Empfehlungen
       ════════════════════════════════════════ */
    pdf.addPage();
    sectionTitle('KI-Insights & Empfehlungen', 26, C.purple);

    const insights = [
      {
        title: 'HRV-Einbruch vor Periode',
        desc: 'HRV sinkt konsistent 3 Tage vor der Periode um durchschnittlich 22 %. Dies ist ein zuverlaessiger Fruehindikator fuer den Periodenbeginn.',
        hint: 'Intensive Trainingseinheiten nicht in die letzten 3 Tage vor der Periode legen.',
      },
      {
        title: 'Regelmaessige Lutealphase',
        desc: 'Die Lutealphase ist konstant 14 Tage lang \u2013 ein Zeichen eines stabilen Progesteronspiegels und regelmaessiger Ovulation.',
        hint: 'Diese Regelmaessigkeit erleichtert die Zyklusprognose erheblich.',
      },
      {
        title: 'Schlaf-Zyklus-Korrelation',
        desc: 'Schlafqualitaet ist in der Follikelphase am besten (7.4 h) und in der Lutealphase am schlechtesten (6.6 h). Korrelation HRV \u2194 Schlaf: r = 0.78.',
        hint: 'In der Lutealphase: Abendrituale staerken, Bildschirmzeit reduzieren.',
      },
    ];

    let cardY = 42;
    insights.forEach((insight, i) => {
      const cardH = 38;

      // Card background
      pdf.setFillColor(...C.bg);
      pdf.roundedRect(M, cardY, contentW, cardH, 3, 3, 'F');

      // Left accent
      pdf.setFillColor(...C.periwinkle);
      pdf.rect(M, cardY, 3, cardH, 'F');

      // Number badge
      pdf.setFillColor(...C.periwinkle);
      pdf.circle(M + 12, cardY + 9, 4, 'F');
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...C.white);
      pdf.text(String(i + 1), M + 10.8, cardY + 11);

      // Title
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...C.text);
      pdf.text(insight.title, M + 20, cardY + 10);

      // Description
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8.5);
      pdf.setTextColor(...C.muted);
      const descLines = pdf.splitTextToSize(insight.desc, contentW - 18);
      pdf.text(descLines, M + 10, cardY + 18);

      // Hint
      pdf.setTextColor(...C.tealDark);
      pdf.setFont('helvetica', 'italic');
      pdf.text(`\u2192 ${insight.hint}`, M + 10, cardY + 31);

      cardY += cardH + 6;
    });

    // Closing note
    pdf.setFillColor(...C.periwinkleLight);
    pdf.roundedRect(M, cardY + 4, contentW, 18, 3, 3, 'F');
    pdf.setFontSize(8.5);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...C.muted);
    pdf.text(
      'Alle KI-Insights basieren auf 6 Monaten Zyklusdaten und 90 Tagen Wearable-Daten.',
      M + 6,
      cardY + 12,
    );
    pdf.text(
      'Die Analyse dient zur Unterstuetzung des Arztgespraechs und ersetzt keine Diagnose.',
      M + 6,
      cardY + 18,
    );

    footer(4);

    /* ─── Download ─── */
    const safeName = userName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    pdf.save(`mycycle-bericht-${safeName}-${new Date().toISOString().slice(0, 7)}.pdf`);

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
                  <FileText size={18} className="text-[#6F7CFF]" />
                  <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    Arzt-Export erstellen
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-5 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Zeitraum
                  </label>
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
                            ? 'bg-[#6F7CFF] text-white border-[#6F7CFF]'
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-[#B3B9FF]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Enthaltene Daten
                  </label>
                  <div className="space-y-2">
                    {DATA_OPTIONS.map((opt) => (
                      <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedData.includes(opt.id)}
                          onChange={() => toggleData(opt.id)}
                          className="accent-[#6F7CFF] w-4 h-4"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900">
                          {opt.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Generiert ein 4-seitiges PDF-Dokument fuer deinen Arzt. Alle Daten bleiben auf
                  deinem Geraet.
                </p>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex gap-3">
                <Button variant="ghost" onClick={onClose} className="flex-1">
                  Abbrechen
                </Button>
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

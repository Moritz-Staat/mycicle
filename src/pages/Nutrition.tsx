import { useState } from 'react';
import {
  Apple,
  Dumbbell,
  Droplets,
  Flame,
  Leaf,
  Pill,
  Sun,
  Moon,
  Zap,
  Heart,
  Timer,
  TrendingUp,
  Wind,
  AlertTriangle,
} from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { useCycleStore } from '../store/cycleStore';
import { getCurrentCycleDay, getPhaseLabel } from '../utils/cycleUtils';
import { EmptyState } from '../components/EmptyState';
import { Button } from '../components/ui/Button';
import { Card, CardBody } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useDemoDelay } from '../hooks/useDemoDelay';
import { SkeletonCard } from '../components/ui/Skeleton';

type Tab = 'ernaehrung' | 'training';

/* ─── Phase colors ─── */
const PHASE_COLORS: Record<string, { bg: string; text: string; badge: 'rose' | 'purple' | 'amber' | 'teal' }> = {
  menstruation: { bg: 'bg-rose-50 dark:bg-rose-950/30', text: 'text-rose-700', badge: 'rose' },
  follicular: { bg: 'bg-purple-50 dark:bg-purple-950/30', text: 'text-purple-700', badge: 'purple' },
  ovulation: { bg: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-700', badge: 'amber' },
  luteal: { bg: 'bg-teal-50 dark:bg-teal-950/30', text: 'text-teal-700', badge: 'teal' },
};

/* ═══════════════════════════════════
   ERNÄHRUNG DATA
   ═══════════════════════════════════ */

interface Meal {
  type: string;
  icon: React.ReactNode;
  name: string;
  nutrients: string[];
  kcal: number;
  macros: string;
}

const MEALS_BY_PHASE: Record<string, Meal[]> = {
  menstruation: [
    { type: 'Frühstück', icon: <Sun size={16} />, name: 'Warmes Porridge mit Beeren & Leinsamen', nutrients: ['Eisen', 'Omega-3', 'Ballaststoffe'], kcal: 380, macros: '12g P · 52g K · 14g F' },
    { type: 'Mittagessen', icon: <Flame size={16} />, name: 'Linsensuppe mit Spinat & Vollkornbrot', nutrients: ['Eisen', 'Folsäure', 'Protein'], kcal: 520, macros: '24g P · 68g K · 12g F' },
    { type: 'Abendessen', icon: <Moon size={16} />, name: 'Lachs mit Süßkartoffel & Brokkoli', nutrients: ['Omega-3', 'Vitamin D', 'Magnesium'], kcal: 580, macros: '34g P · 48g K · 22g F' },
  ],
  follicular: [
    { type: 'Frühstück', icon: <Sun size={16} />, name: 'Avocado-Toast mit Ei & Sprossen', nutrients: ['Protein', 'Vitamin E', 'Folsäure'], kcal: 420, macros: '18g P · 38g K · 24g F' },
    { type: 'Mittagessen', icon: <Flame size={16} />, name: 'Buddha Bowl mit Quinoa & Kichererbsen', nutrients: ['Eisen', 'Protein', 'Zink'], kcal: 550, macros: '22g P · 72g K · 16g F' },
    { type: 'Abendessen', icon: <Moon size={16} />, name: 'Hähnchen-Gemüse-Pfanne mit Reis', nutrients: ['Protein', 'Vitamin B6', 'Zink'], kcal: 510, macros: '32g P · 56g K · 14g F' },
  ],
  ovulation: [
    { type: 'Frühstück', icon: <Sun size={16} />, name: 'Smoothie Bowl mit Mango & Chiasamen', nutrients: ['Vitamin C', 'Antioxidantien', 'Omega-3'], kcal: 360, macros: '10g P · 58g K · 12g F' },
    { type: 'Mittagessen', icon: <Flame size={16} />, name: 'Bunter Salat mit Lachs & Walnüssen', nutrients: ['Omega-3', 'Vitamin D', 'Selen'], kcal: 480, macros: '28g P · 24g K · 28g F' },
    { type: 'Abendessen', icon: <Moon size={16} />, name: 'Zucchini-Nudeln mit Pesto & Garnelen', nutrients: ['Protein', 'Zink', 'Vitamin B12'], kcal: 440, macros: '30g P · 32g K · 20g F' },
  ],
  luteal: [
    { type: 'Frühstück', icon: <Sun size={16} />, name: 'Bananen-Pancakes mit Nussbutter & Zimt', nutrients: ['Magnesium', 'Vitamin B6', 'Kalium'], kcal: 450, macros: '14g P · 62g K · 18g F' },
    { type: 'Mittagessen', icon: <Flame size={16} />, name: 'Vollkorn-Pasta mit Linsen-Bolognese', nutrients: ['Eisen', 'Ballaststoffe', 'Protein'], kcal: 580, macros: '26g P · 78g K · 12g F' },
    { type: 'Abendessen', icon: <Moon size={16} />, name: 'Ofengemüse mit Feta & Kürbiskernen', nutrients: ['Magnesium', 'Calcium', 'Zink'], kcal: 420, macros: '16g P · 44g K · 22g F' },
  ],
};

interface Nutrient {
  name: string;
  why: string;
  percent: number;
  sources: string[];
  icon: React.ReactNode;
}

const NUTRIENTS_BY_PHASE: Record<string, Nutrient[]> = {
  menstruation: [
    { name: 'Eisen', why: 'Gleicht den Blutverlust aus und beugt Müdigkeit vor', percent: 45, sources: ['Spinat', 'Linsen', 'Rotes Fleisch', 'Kürbiskerne'], icon: <Droplets size={18} /> },
    { name: 'Omega-3', why: 'Wirkt entzündungshemmend und lindert Krämpfe', percent: 60, sources: ['Lachs', 'Leinsamen', 'Walnüsse'], icon: <Heart size={18} /> },
    { name: 'Magnesium', why: 'Entspannt die Muskulatur und lindert Unterleibsschmerzen', percent: 55, sources: ['Bananen', 'Dunkle Schokolade', 'Mandeln'], icon: <Zap size={18} /> },
    { name: 'Vitamin C', why: 'Verbessert die Eisenaufnahme aus pflanzlichen Quellen', percent: 70, sources: ['Paprika', 'Kiwi', 'Brokkoli'], icon: <Sun size={18} /> },
  ],
  follicular: [
    { name: 'Folsäure', why: 'Unterstützt den Östrogenanstieg und die Zellbildung', percent: 50, sources: ['Spinat', 'Spargel', 'Hülsenfrüchte'], icon: <Leaf size={18} /> },
    { name: 'Vitamin E', why: 'Fördert die Follikelreifung und schützt Zellen', percent: 40, sources: ['Avocado', 'Mandeln', 'Sonnenblumenkerne'], icon: <Sun size={18} /> },
    { name: 'Zink', why: 'Wichtig für die Eizellentwicklung', percent: 55, sources: ['Kürbiskerne', 'Kichererbsen', 'Rindfleisch'], icon: <Zap size={18} /> },
    { name: 'Protein', why: 'Steigender Energiebedarf in der aktiven Phase', percent: 65, sources: ['Eier', 'Hähnchen', 'Quinoa', 'Tofu'], icon: <Flame size={18} /> },
  ],
  ovulation: [
    { name: 'Antioxidantien', why: 'Schützen die Eizelle vor oxidativem Stress', percent: 60, sources: ['Beeren', 'Grüner Tee', 'Dunkle Schokolade'], icon: <Heart size={18} /> },
    { name: 'Vitamin D', why: 'Unterstützt die Hormonbalance um den Eisprung', percent: 35, sources: ['Lachs', 'Eier', 'Sonnenlicht'], icon: <Sun size={18} /> },
    { name: 'Selen', why: 'Fördert die Schilddrüsenfunktion und Fruchtbarkeit', percent: 50, sources: ['Paranüsse', 'Thunfisch', 'Eier'], icon: <Zap size={18} /> },
    { name: 'Omega-3', why: 'Fördert die Durchblutung der Gebärmutter', percent: 55, sources: ['Lachs', 'Chiasamen', 'Walnüsse'], icon: <Heart size={18} /> },
  ],
  luteal: [
    { name: 'Magnesium', why: 'Lindert PMS-Symptome und verbessert den Schlaf', percent: 40, sources: ['Dunkle Schokolade', 'Bananen', 'Cashews'], icon: <Zap size={18} /> },
    { name: 'Vitamin B6', why: 'Reguliert Progesteron und reduziert Stimmungsschwankungen', percent: 45, sources: ['Kartoffeln', 'Hähnchen', 'Bananen'], icon: <Pill size={18} /> },
    { name: 'Calcium', why: 'Kann PMS-Beschwerden um bis zu 50% reduzieren', percent: 55, sources: ['Joghurt', 'Brokkoli', 'Mandelmilch'], icon: <Droplets size={18} /> },
    { name: 'Ballaststoffe', why: 'Unterstützen den Östrogenabbau über den Darm', percent: 60, sources: ['Haferflocken', 'Leinsamen', 'Vollkorn'], icon: <Leaf size={18} /> },
  ],
};

/* ═══════════════════════════════════
   TRAINING DATA
   ═══════════════════════════════════ */

interface Workout {
  name: string;
  duration: string;
  intensity: 'Leicht' | 'Moderat' | 'Intensiv';
  icon: React.ReactNode;
  description: string;
  benefits: string[];
}

const WORKOUTS_BY_PHASE: Record<string, Workout[]> = {
  menstruation: [
    { name: 'Sanftes Yoga', duration: '30 Min.', intensity: 'Leicht', icon: <Wind size={18} />, description: 'Restorative Posen und sanfte Dehnungen zur Entspannung der Beckenbodenmuskulatur.', benefits: ['Krämpfe lindern', 'Entspannung', 'Durchblutung'] },
    { name: 'Spaziergang', duration: '20–30 Min.', intensity: 'Leicht', icon: <Heart size={18} />, description: 'Leichte Bewegung an der frischen Luft fördert die Durchblutung und hebt die Stimmung.', benefits: ['Stimmung', 'Kreislauf', 'Frische Luft'] },
    { name: 'Leichtes Stretching', duration: '15 Min.', intensity: 'Leicht', icon: <Wind size={18} />, description: 'Sanfte Dehnübungen für Hüfte, unteren Rücken und Beine.', benefits: ['Verspannungen lösen', 'Flexibilität', 'Schmerzlinderung'] },
  ],
  follicular: [
    { name: 'Krafttraining', duration: '45 Min.', intensity: 'Intensiv', icon: <Dumbbell size={18} />, description: 'Steigendes Östrogen verbessert Muskelaufbau und Regeneration. Ideale Phase für schwere Gewichte.', benefits: ['Muskelaufbau', 'Kraft', 'Knochendichte'] },
    { name: 'HIIT / Intervalltraining', duration: '30 Min.', intensity: 'Intensiv', icon: <Zap size={18} />, description: 'Hohe Energielevel und bessere Schmerztoleranz machen diese Phase ideal für intensive Einheiten.', benefits: ['Ausdauer', 'Fettverbrennung', 'Kardio'] },
    { name: 'Neue Sportart ausprobieren', duration: '45–60 Min.', intensity: 'Moderat', icon: <TrendingUp size={18} />, description: 'Steigende Energie und Motivation — perfekt für Klettern, Tanzen, Kampfsport oder Gruppenkurse.', benefits: ['Motivation', 'Koordination', 'Spaß'] },
  ],
  ovulation: [
    { name: 'Peak-Performance Training', duration: '45–60 Min.', intensity: 'Intensiv', icon: <TrendingUp size={18} />, description: 'Höchste Leistungsfähigkeit im Zyklus. Ideal für persönliche Bestleistungen und Wettkämpfe.', benefits: ['Höchstleistung', 'Schnellkraft', 'Power'] },
    { name: 'Gruppentraining / Mannschaftssport', duration: '60 Min.', intensity: 'Intensiv', icon: <Flame size={18} />, description: 'Hoher Östrogenspiegel steigert Kommunikation und soziale Energie — ideal für Teamsport.', benefits: ['Teamgeist', 'Ausdauer', 'Spaß'] },
    { name: 'Laufen / Joggen', duration: '30–45 Min.', intensity: 'Moderat', icon: <Timer size={18} />, description: 'Gute Ausdauerbasis nutzen. Tempo und Distanz können gesteigert werden.', benefits: ['Ausdauer', 'Kardio', 'Stressabbau'] },
  ],
  luteal: [
    { name: 'Moderates Krafttraining', duration: '40 Min.', intensity: 'Moderat', icon: <Dumbbell size={18} />, description: 'Gewichte leicht reduzieren, mehr Wiederholungen. Progesteron erhöht die Körpertemperatur und Ermüdung.', benefits: ['Muskelerhalt', 'Stressabbau', 'Routine'] },
    { name: 'Yoga / Pilates', duration: '45 Min.', intensity: 'Moderat', icon: <Wind size={18} />, description: 'Fokus auf Atemübungen und kontrollierte Bewegungen. Hilft bei PMS-Beschwerden und Schlafqualität.', benefits: ['PMS-Linderung', 'Schlaf', 'Balance'] },
    { name: 'Schwimmen', duration: '30 Min.', intensity: 'Leicht', icon: <Droplets size={18} />, description: 'Gelenkschonendes Training, das die Wassereinlagerungen reduziert und die Stimmung hebt.', benefits: ['Gelenkschonend', 'Entwässerung', 'Entspannung'] },
  ],
};

interface TrainingTip {
  title: string;
  text: string;
  icon: React.ReactNode;
  type: 'info' | 'warning';
}

const TRAINING_TIPS_BY_PHASE: Record<string, TrainingTip[]> = {
  menstruation: [
    { title: 'Höre auf deinen Körper', text: 'Wenn du dich müde oder unwohl fühlst, reduziere die Intensität oder pausiere. Bewegung ist kein Muss.', icon: <Heart size={16} />, type: 'info' },
    { title: 'Kein Inversions-Yoga', text: 'Vermeide Umkehrhaltungen wie Kopfstand. Sanfte Vorwärtsbeugen und Seitdehnungen sind besser.', icon: <AlertTriangle size={16} />, type: 'warning' },
  ],
  follicular: [
    { title: 'Beste Phase für Progression', text: 'Steigende Östrogenspiegel fördern Muskelreparatur und -aufbau. Nutze die Phase für neue Trainingsreize.', icon: <TrendingUp size={16} />, type: 'info' },
    { title: 'Verletzungsrisiko beachten', text: 'Östrogen erhöht die Gelenkflexibilität. Achte auf saubere Technik und angemessenes Aufwärmen.', icon: <AlertTriangle size={16} />, type: 'warning' },
  ],
  ovulation: [
    { title: 'Leistungspeak nutzen', text: 'Testosteron und Östrogen sind am höchsten — idealer Zeitpunkt für PRs, Wettkämpfe oder anspruchsvolle Sessions.', icon: <TrendingUp size={16} />, type: 'info' },
    { title: 'Erhöhtes Verletzungsrisiko', text: 'Die hohe Bandlaxität (v.a. Knie) erhöht das Kreuzband-Risiko. Stabilisationsübungen einbauen.', icon: <AlertTriangle size={16} />, type: 'warning' },
  ],
  luteal: [
    { title: 'Intensität anpassen', text: 'Progesteron erhöht die Körperkerntemperatur und Herzfrequenz. RPE fühlt sich höher an bei gleicher Belastung.', icon: <Heart size={16} />, type: 'info' },
    { title: 'Mehr Regeneration einplanen', text: 'Die Regeneration ist in dieser Phase verlangsamt. Ausreichend Schlaf und aktive Recovery sind wichtiger als sonst.', icon: <AlertTriangle size={16} />, type: 'warning' },
  ],
};

/* ─── Combined phase guide ─── */
const PHASE_GUIDE = [
  {
    phase: 'menstruation',
    label: 'Menstruation',
    days: 'Tag 1–5',
    color: '#E11D48',
    nutritionTips: ['Warme, nährstoffreiche Mahlzeiten', 'Eisenreiche Lebensmittel + Vitamin C', 'Ingwer-/Kamillentee gegen Krämpfe'],
    trainingTips: ['Sanftes Yoga & Stretching', 'Leichte Spaziergänge', 'Auf den Körper hören, Pausen okay'],
    keyNutrients: ['Eisen', 'Omega-3', 'Magnesium'],
  },
  {
    phase: 'follicular',
    label: 'Follikelphase',
    days: 'Tag 6–13',
    color: '#B391C8',
    nutritionTips: ['Proteinreich für Muskelaufbau', 'Fermentierte Lebensmittel', 'Kreuzblütler-Gemüse'],
    trainingTips: ['Krafttraining & HIIT ideal', 'Neue Sportarten ausprobieren', 'Höchste Trainingstoleranz'],
    keyNutrients: ['Folsäure', 'Vitamin E', 'Zink'],
  },
  {
    phase: 'ovulation',
    label: 'Ovulation',
    days: 'Tag 14–16',
    color: '#F59E0B',
    nutritionTips: ['Antioxidantienreich essen', 'Ausreichend Wasser trinken', 'Leichte Mahlzeiten'],
    trainingTips: ['Leistungspeak — PRs möglich', 'Teamsport & Gruppentraining', 'Auf Kreuzband-Stabilität achten'],
    keyNutrients: ['Antioxidantien', 'Vitamin D', 'Selen'],
  },
  {
    phase: 'luteal',
    label: 'Lutealphase',
    days: 'Tag 17–29',
    color: '#7CC8B5',
    nutritionTips: ['Komplexe Kohlenhydrate', 'Magnesiumreich gegen PMS', 'Kräutertee statt Koffein'],
    trainingTips: ['Intensität reduzieren', 'Yoga, Pilates, Schwimmen', 'Mehr Recovery einplanen'],
    keyNutrients: ['Magnesium', 'Vitamin B6', 'Calcium'],
  },
];

/* ═══════════════════════════════════
   COMPONENT
   ═══════════════════════════════════ */

export default function Nutrition() {
  const [activeTab, setActiveTab] = useState<Tab>('ernaehrung');
  const { authState, enterDemo } = useUserStore();
  const { cycleHistory } = useCycleStore();
  const loaded = useDemoDelay(600);

  const today = getCurrentCycleDay(cycleHistory);
  const phase = today?.phase ?? 'luteal';
  const phaseStyle = PHASE_COLORS[phase] ?? PHASE_COLORS.luteal;
  const meals = MEALS_BY_PHASE[phase] ?? MEALS_BY_PHASE.luteal;
  const nutrients = NUTRIENTS_BY_PHASE[phase] ?? NUTRIENTS_BY_PHASE.luteal;
  const workouts = WORKOUTS_BY_PHASE[phase] ?? WORKOUTS_BY_PHASE.luteal;
  const trainingTips = TRAINING_TIPS_BY_PHASE[phase] ?? TRAINING_TIPS_BY_PHASE.luteal;

  if (authState === 'authenticated') {
    return (
      <EmptyState
        icon={<Apple size={28} />}
        title="Ernährung & Training"
        description="Zyklusbasierte Empfehlungen für Ernährung und Sport — angepasst an deine aktuelle Phase. Starte mit dem Demo-Modus."
        action={
          <Button variant="secondary" onClick={enterDemo}>
            Demo ansehen
          </Button>
        }
      />
    );
  }

  if (!loaded) {
    return (
      <div className="space-y-6">
        <SkeletonCard className="h-24" />
        <div className="grid md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} className="h-48" />
          ))}
        </div>
        <SkeletonCard className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Phase header */}
      <div>
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Ernährung & Training
          </h2>
          <Badge color={phaseStyle.badge} size="md">
            {getPhaseLabel(phase)}
          </Badge>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Empfehlungen angepasst an deine aktuelle Zyklusphase · Tag {today?.dayOfCycle ?? '–'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('ernaehrung')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === 'ernaehrung'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          <Apple size={16} />
          Ernährung
        </button>
        <button
          onClick={() => setActiveTab('training')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === 'training'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          <Dumbbell size={16} />
          Training
        </button>
      </div>

      {/* ═══ ERNÄHRUNG TAB ═══ */}
      {activeTab === 'ernaehrung' && (
        <>
          {/* Nutrients (important — shown first) */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Wichtige Nährstoffe in dieser Phase
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {nutrients.map((n) => (
                <Card key={n.name} className="dark:bg-gray-900 dark:border-gray-800">
                  <CardBody>
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${phaseStyle.bg} ${phaseStyle.text}`}>
                        {n.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {n.name}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                          {n.why}
                        </p>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                            <span>Dein Bedarf</span>
                            <span>{n.percent}%</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${n.percent}%`,
                                background: PHASE_GUIDE.find((p) => p.phase === phase)?.color ?? '#7CC8B5',
                              }}
                            />
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {n.sources.map((s) => (
                            <span
                              key={s}
                              className="px-1.5 py-0.5 rounded text-[10px] bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>

          {/* Meals */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Mahlzeiten-Empfehlungen
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {meals.map((meal) => (
                <Card key={meal.type} className="dark:bg-gray-900 dark:border-gray-800">
                  <CardBody className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                      {meal.icon}
                      {meal.type}
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug">
                      {meal.name}
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {meal.nutrients.map((n) => (
                        <span
                          key={n}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${phaseStyle.bg} ${phaseStyle.text}`}
                        >
                          {n}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs text-gray-400 pt-1 border-t border-gray-100 dark:border-gray-800">
                      {meal.kcal} kcal · {meal.macros}
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>

        </>
      )}

      {/* ═══ TRAINING TAB ═══ */}
      {activeTab === 'training' && (
        <>
          {/* Workout recommendations */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Empfohlene Workouts
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {workouts.map((w) => {
                const intensityColor =
                  w.intensity === 'Leicht'
                    ? 'bg-green-50 text-green-700 dark:bg-green-950/30'
                    : w.intensity === 'Moderat'
                      ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/30'
                      : 'bg-rose-50 text-rose-700 dark:bg-rose-950/30';
                return (
                  <Card key={w.name} className="dark:bg-gray-900 dark:border-gray-800">
                    <CardBody className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${phaseStyle.bg} ${phaseStyle.text}`}>
                          {w.icon}
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${intensityColor}`}>
                          {w.intensity}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {w.name}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-400">
                          <Timer size={12} />
                          {w.duration}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        {w.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1 border-t border-gray-100 dark:border-gray-800">
                        {w.benefits.map((b) => (
                          <span
                            key={b}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${phaseStyle.bg} ${phaseStyle.text}`}
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Training tips */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Hinweise für diese Phase
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {trainingTips.map((tip) => (
                <div
                  key={tip.title}
                  className={`rounded-xl p-4 flex items-start gap-3 ${
                    tip.type === 'warning'
                      ? 'bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800'
                      : 'bg-[#EEF0FF] dark:bg-[#6F7CFF]/10 border border-[#C5CAFF] dark:border-[#6F7CFF]/30'
                  }`}
                >
                  <div className={`mt-0.5 ${tip.type === 'warning' ? 'text-amber-600' : 'text-[#6F7CFF]'}`}>
                    {tip.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {tip.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                      {tip.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Phase Guide (shared) */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Phasen-Guide
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PHASE_GUIDE.map((pg) => {
            const isCurrent = pg.phase === phase;
            const tips = activeTab === 'ernaehrung' ? pg.nutritionTips : pg.trainingTips;
            return (
              <div
                key={pg.phase}
                className={`rounded-xl border-2 p-4 transition-all ${
                  isCurrent
                    ? 'border-current shadow-md'
                    : 'border-gray-100 dark:border-gray-800'
                }`}
                style={isCurrent ? { borderColor: pg.color } : undefined}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: pg.color }}
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {pg.label}
                    </h4>
                    <p className="text-[10px] text-gray-400">{pg.days}</p>
                  </div>
                  {isCurrent && (
                    <span className="ml-auto text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full" style={{ background: pg.color }}>
                      Jetzt
                    </span>
                  )}
                </div>
                <ul className="space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
                  {tips.map((tip) => (
                    <li key={tip} className="flex items-start gap-1.5">
                      <span style={{ color: pg.color }}>•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-1 mt-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                  {pg.keyNutrients.map((kn) => (
                    <span
                      key={kn}
                      className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                      style={{
                        background: `${pg.color}15`,
                        color: pg.color,
                      }}
                    >
                      {kn}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

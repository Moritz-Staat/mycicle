import { Apple, Droplets, Flame, Leaf, Pill, Sun, Moon, Zap, Heart } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { useCycleStore } from '../store/cycleStore';
import { getCurrentCycleDay, getPhaseLabel } from '../utils/cycleUtils';
import { EmptyState } from '../components/EmptyState';
import { Button } from '../components/ui/Button';
import { Card, CardBody } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useDemoDelay } from '../hooks/useDemoDelay';
import { SkeletonCard } from '../components/ui/Skeleton';

/* ─── Phase-dependent data ─── */
const PHASE_COLORS: Record<string, { bg: string; text: string; badge: 'rose' | 'purple' | 'amber' | 'teal' }> = {
  menstruation: { bg: 'bg-rose-50 dark:bg-rose-950/30', text: 'text-rose-700', badge: 'rose' },
  follicular: { bg: 'bg-purple-50 dark:bg-purple-950/30', text: 'text-purple-700', badge: 'purple' },
  ovulation: { bg: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-700', badge: 'amber' },
  luteal: { bg: 'bg-teal-50 dark:bg-teal-950/30', text: 'text-teal-700', badge: 'teal' },
};

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

/* ─── Phase guide data ─── */
const PHASE_GUIDE = [
  {
    phase: 'menstruation',
    label: 'Menstruation',
    days: 'Tag 1–5',
    color: '#E11D48',
    tips: ['Warme, nährstoffreiche Mahlzeiten bevorzugen', 'Eisenreiche Lebensmittel kombiniert mit Vitamin C', 'Ingwer- und Kamillentee gegen Krämpfe', 'Auf Koffein und Alkohol verzichten'],
    keyNutrients: ['Eisen', 'Omega-3', 'Magnesium'],
  },
  {
    phase: 'follicular',
    label: 'Follikelphase',
    days: 'Tag 6–13',
    color: '#B391C8',
    tips: ['Leichte, frische Kost mit viel Gemüse', 'Fermentierte Lebensmittel für die Darmgesundheit', 'Proteinreich essen für steigende Energie', 'Kreuzblütler-Gemüse unterstützen Östrogen-Metabolismus'],
    keyNutrients: ['Folsäure', 'Vitamin E', 'Zink'],
  },
  {
    phase: 'ovulation',
    label: 'Ovulation',
    days: 'Tag 14–16',
    color: '#F59E0B',
    tips: ['Antioxidantienreiche Lebensmittel wählen', 'Ballaststoffe für den Östrogenabbau', 'Leichte Mahlzeiten, da Appetit oft geringer', 'Ausreichend Wasser trinken'],
    keyNutrients: ['Antioxidantien', 'Vitamin D', 'Selen'],
  },
  {
    phase: 'luteal',
    label: 'Lutealphase',
    days: 'Tag 17–29',
    color: '#7CC8B5',
    tips: ['Komplexe Kohlenhydrate stabilisieren den Blutzucker', 'Magnesiumreiche Lebensmittel gegen PMS', 'Heißhunger mit gesunden Alternativen stillen', 'Kräutertee statt Koffein am Nachmittag'],
    keyNutrients: ['Magnesium', 'Vitamin B6', 'Calcium'],
  },
];

export default function Nutrition() {
  const { authState, enterDemo } = useUserStore();
  const { cycleHistory } = useCycleStore();
  const loaded = useDemoDelay(600);

  const today = getCurrentCycleDay(cycleHistory);
  const phase = today?.phase ?? 'luteal';
  const phaseStyle = PHASE_COLORS[phase] ?? PHASE_COLORS.luteal;
  const meals = MEALS_BY_PHASE[phase] ?? MEALS_BY_PHASE.luteal;
  const nutrients = NUTRIENTS_BY_PHASE[phase] ?? NUTRIENTS_BY_PHASE.luteal;

  if (authState === 'authenticated') {
    return (
      <EmptyState
        icon={<Apple size={28} />}
        title="Ernährung"
        description="Personalisierte Ernährungsempfehlungen basierend auf deiner Zyklusphase. Starte mit dem Demo-Modus."
        action={
          <Button variant="secondary" onClick={enterDemo}>
            Demo-Ernährung ansehen
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Ernährung</h2>
          <Badge color={phaseStyle.badge} size="md">
            {getPhaseLabel(phase)}
          </Badge>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Empfehlungen angepasst an deine aktuelle Zyklusphase · Tag {today?.dayOfCycle ?? '–'}
        </p>
      </div>

      {/* Meals */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Heute für dich
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

      {/* Nutrients */}
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

      {/* Phase Guide */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Phasen-Ernährungsguide
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PHASE_GUIDE.map((pg) => {
            const isCurrent = pg.phase === phase;
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
                  {pg.tips.map((tip) => (
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

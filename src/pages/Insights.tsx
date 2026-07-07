import { useState } from 'react';
import { FileText, Moon, Dumbbell, Pill, Sparkles } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { insightsData } from '../data/mock/insightsData';
import { AnomalyBanner } from '../components/AnomalyBanner';
import { InsightFeed } from '../components/InsightFeed';
import { HealthScoreWidget } from '../components/charts/HealthScoreWidget';
import { RecommendationCard } from '../components/RecommendationCard';
import { MonthlySummary } from '../components/MonthlySummary';
import { DoctorExportModal } from '../components/DoctorExportModal';
import { EmptyState } from '../components/EmptyState';
import { Button } from '../components/ui/Button';
import { useDemoDelay } from '../hooks/useDemoDelay';
import { SkeletonCard } from '../components/ui/Skeleton';
import { useUIStore } from '../store/uiStore';

type Tab = 'all' | 'anomaly' | 'recommendation' | 'positive';

const TABS: Array<{ id: Tab; label: string; count?: number }> = [
  { id: 'all', label: 'Alle' },
  { id: 'anomaly', label: 'Anomalien' },
  { id: 'recommendation', label: 'Empfehlungen' },
  { id: 'positive', label: 'Positiv' },
];

export default function Insights() {
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const { showDoctorExport, setShowDoctorExport } = useUIStore();
  const { authState, enterDemo } = useUserStore();
  const loaded = useDemoDelay(600);

  if (authState === 'authenticated') {
    return (
      <EmptyState
        icon={<Sparkles size={28} />}
        title="Noch keine KI-Insights"
        description="Sobald genügend Zyklusdaten vorliegen, generiert die KI personalisierte Erkenntnisse und Empfehlungen."
        action={
          <Button variant="secondary" onClick={enterDemo}>
            Demo-Insights ansehen
          </Button>
        }
      />
    );
  }

  const alertInsights = insightsData.filter((i) => i.severity === 'alert');

  if (!loaded) {
    return (
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
        </div>
        <div className="space-y-4">
          <SkeletonCard className="h-64" />
          <SkeletonCard className="h-48" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alert banners */}
      {alertInsights.slice(0, 2).map((insight) => (
        <AnomalyBanner
          key={insight.id}
          severity={insight.severity}
          title={insight.title}
          message={insight.description.slice(0, 100) + '...'}
        />
      ))}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left: Insight Feed */}
        <div className="md:col-span-2 space-y-4">
          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <InsightFeed insights={insightsData} activeTab={activeTab} />

          {/* Doctor export */}
          <div className="pt-2">
            <Button
              variant="secondary"
              leftIcon={<FileText size={16} />}
              onClick={() => setShowDoctorExport(true)}
              className="w-full"
            >
              Arzt-Export erstellen
            </Button>
          </div>
        </div>

        {/* Right: Widgets */}
        <div className="space-y-4">
          <HealthScoreWidget />
          <MonthlySummary />

          {/* Recommendations */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Empfehlungen für heute</h3>
            <div className="space-y-3">
              <RecommendationCard
                icon={<Moon size={16} />}
                title="30 Minuten früher schlafen"
                description="In deiner Lutealphase braucht dein Körper mehr Schlaf. Geh heute um 22:30 Uhr ins Bett."
                difficulty="leicht"
                category="Schlaf"
              />
              <RecommendationCard
                icon={<Dumbbell size={16} />}
                title="Moderates Training heute"
                description="Deine HRV ist leicht unter Baseline. Statt HIIT lieber Yoga oder leichtes Joggen."
                difficulty="leicht"
                category="Bewegung"
              />
              <RecommendationCard
                icon={<Pill size={16} />}
                title="Magnesium am Abend"
                description="Magnesium kann PMS-Symptome und Schlafqualität in der Lutealphase verbessern."
                difficulty="leicht"
                category="Ernährung"
              />
            </div>
          </div>
        </div>
      </div>

      <DoctorExportModal
        open={showDoctorExport}
        onClose={() => setShowDoctorExport(false)}
      />
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import { LogOut, Users } from 'lucide-react';
import { useCycleStore } from '../store/cycleStore';
import { useUserStore } from '../store/userStore';
import { getCurrentCycleDay, calculateCycleStats } from '../utils/cycleUtils';
import { CurrentStatusCard } from '../components/CurrentStatusCard';
import { FertilityTrafficLight } from '../components/FertilityTrafficLight';
import { FamilyPlanningToggle } from '../components/FamilyPlanningToggle';
import { EducationCard } from '../components/EducationCard';
import { UpcomingCard } from '../components/UpcomingCard';
import { useDemoDelay } from '../hooks/useDemoDelay';
import { SkeletonCard } from '../components/ui/Skeleton';

export default function Partner() {
  const navigate = useNavigate();
  const { cycleHistory } = useCycleStore();
  const { isPartnerView, setIsPartnerView, familyPlanningMode } = useUserStore();
  const loaded = useDemoDelay(500);

  const today = getCurrentCycleDay(cycleHistory);
  const stats = calculateCycleStats(cycleHistory);

  const handleLogout = () => {
    setIsPartnerView(false);
    navigate('/partner-login');
  };

  if (!isPartnerView) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Users size={48} className="text-gray-300" />
        <p className="text-gray-500 text-sm">Bitte melde dich als Partner an.</p>
        <button
          onClick={() => navigate('/partner-login')}
          className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors"
        >
          Zur Anmeldung
        </button>
      </div>
    );
  }

  if (!loaded) {
    return (
      <div className="space-y-6">
        <SkeletonCard className="h-32" />
        <div className="grid md:grid-cols-2 gap-6">
          <SkeletonCard className="h-64" />
          <SkeletonCard className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Partner header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sarahs Übersicht</h2>
          <p className="text-sm text-gray-500 mt-0.5">Partner-Ansicht · Nur von Sarah geteilte Informationen</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <LogOut size={14} />
          Abmelden
        </button>
      </div>

      {/* Current status */}
      <CurrentStatusCard today={today} />

      {/* Main grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-4">
          <FertilityTrafficLight
            currentDay={today?.dayOfCycle ?? 14}
            ovulationDay={14}
            mode={familyPlanningMode}
          />
          <FamilyPlanningToggle />
          <UpcomingCard
            currentDay={today?.dayOfCycle ?? 14}
            cycleLength={stats.avgLength}
            ovulationDay={14}
            periodStart={1}
          />
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <EducationCard />

          {/* Quick stats */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Kurzübersicht</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500">Zyklustag</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{today?.dayOfCycle ?? '–'}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500">Ø Länge</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.avgLength}</p>
                <p className="text-xs text-gray-400">Tage</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500">Stimmung</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {today?.mood === 1 ? '😞' : today?.mood === 2 ? '😕' : today?.mood === 3 ? '😐' : today?.mood === 4 ? '🙂' : '😄'}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500">Energie</p>
                <div className="flex justify-center gap-0.5 mt-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`w-2 h-4 rounded-sm ${i <= (today?.energy ?? 0) ? 'bg-teal-400' : 'bg-gray-200'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

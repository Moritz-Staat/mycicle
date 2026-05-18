import { useWearableStore } from '../store/wearableStore';
import { useCycleStore } from '../store/cycleStore';
import { DeviceCard } from '../components/DeviceCard';
import { HRVChart } from '../components/charts/HRVChart';
import { SleepChart } from '../components/charts/SleepChart';
import { TempOverlayChart } from '../components/charts/TempOverlayChart';
import { MultiCycleOverlayChart } from '../components/charts/MultiCycleOverlayChart';
import { ActivityRing } from '../components/ActivityRing';
import { CorrelationCard } from '../components/CorrelationCard';
import { useDemoDelay } from '../hooks/useDemoDelay';
import { SkeletonCard } from '../components/ui/Skeleton';

export default function Wearables() {
  const { wearableHistory, devices } = useWearableStore();
  const { cycleHistory } = useCycleStore();
  const loaded = useDemoDelay(700);

  const today = wearableHistory[wearableHistory.length - 1];
  const yesterday = wearableHistory[wearableHistory.length - 2];

  if (!loaded) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
        <SkeletonCard className="h-72" />
        <SkeletonCard className="h-72" />
      </div>
    );
  }

  const rings = [
    { value: today?.steps ?? 0, max: 10000, color: '#E11D48', label: 'Schritte', unit: 'Schr.' },
    { value: Math.round((today?.deepSleep ?? 0) * 60 + (today?.remSleep ?? 0) * 60 + (today?.lightSleep ?? 0) * 60), max: 480, color: '#14B8A6', label: 'Schlaf', unit: 'min' },
    { value: today?.activeCalories ?? 0, max: 500, color: '#F59E0B', label: 'Kalorien', unit: 'kcal' },
  ];

  return (
    <div className="space-y-6">
      {/* Device cards */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Verbundene Geräte</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {devices.map((device) => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>
      </div>

      {/* Today's Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Heute (Oura Ring)</h3>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <ActivityRing rings={rings} size={160} />
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-teal-50 dark:bg-teal-950/30 rounded-xl p-3 text-center">
              <p className="text-xs text-teal-600 font-medium">HRV</p>
              <p className="text-2xl font-bold text-teal-700 mt-1">{today?.hrv}</p>
              <p className="text-xs text-teal-500">ms</p>
            </div>
            <div className="bg-rose-50 dark:bg-rose-950/30 rounded-xl p-3 text-center">
              <p className="text-xs text-rose-600 font-medium">Ruhepuls</p>
              <p className="text-2xl font-bold text-rose-700 mt-1">{today?.restingHR}</p>
              <p className="text-xs text-rose-500">bpm</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-950/30 rounded-xl p-3 text-center">
              <p className="text-xs text-purple-600 font-medium">Schlaf-Score</p>
              <p className="text-2xl font-bold text-purple-700 mt-1">{today?.sleepScore}</p>
              <p className="text-xs text-purple-500">/ 100</p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-3 text-center">
              <p className="text-xs text-amber-600 font-medium">vs. Gestern</p>
              <p className={`text-2xl font-bold mt-1 ${(today?.hrv ?? 0) >= (yesterday?.hrv ?? 0) ? 'text-green-600' : 'text-red-500'}`}>
                {(today?.hrv ?? 0) >= (yesterday?.hrv ?? 0) ? '+' : ''}{(today?.hrv ?? 0) - (yesterday?.hrv ?? 0)}
              </p>
              <p className="text-xs text-amber-500">ms HRV</p>
            </div>
          </div>
        </div>
      </div>

      {/* HRV Chart */}
      <HRVChart data={wearableHistory} />

      {/* Sleep Chart + Temp Overlay */}
      <div className="grid md:grid-cols-2 gap-6">
        <SleepChart data={wearableHistory} />
        <TempOverlayChart wearableData={wearableHistory} cycleData={cycleHistory} />
      </div>

      {/* Multi-Cycle Overlay */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Zyklusvergleich</h3>
        <MultiCycleOverlayChart />
      </div>

      {/* Correlation cards */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">KI-Korrelationen</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <CorrelationCard
            title="HRV nach Zyklusphase"
            description="Deine HRV ist in der Follikelphase signifikant höher als in der Lutealphase – ein typisches Muster bei gesundem Zyklus."
            confidence={87}
            phase1Label="Follikelphase (Tag 6-13)"
            phase1Value={48}
            phase2Label="Lutealphase (Tag 17-29)"
            phase2Value={39}
            maxValue={60}
            unit="ms"
            positive={true}
          />
          <CorrelationCard
            title="Schlaf & Zyklusphase"
            description="Dein Schlaf-Score fällt in der Lutealphase ab. Das ist auf Progesteron-Einfluss zurückzuführen – normal aber optimierbar."
            confidence={79}
            phase1Label="Follikelphase"
            phase1Value={78}
            phase2Label="Lutealphase"
            phase2Value={69}
            maxValue={100}
            unit="/100"
            positive={false}
          />
        </div>
      </div>
    </div>
  );
}

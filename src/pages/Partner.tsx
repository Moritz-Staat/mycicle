import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut,
  Users,
  Link2,
  Copy,
  Check,
  Eye,
  EyeOff,
  Shield,
} from 'lucide-react';
import { useCycleStore } from '../store/cycleStore';
import { useUserStore } from '../store/userStore';
import { getCurrentCycleDay, calculateCycleStats } from '../utils/cycleUtils';
import { CurrentStatusCard } from '../components/CurrentStatusCard';
import { FertilityTrafficLight } from '../components/FertilityTrafficLight';
import { FamilyPlanningToggle } from '../components/FamilyPlanningToggle';
import { EducationCard } from '../components/EducationCard';
import { UpcomingCard } from '../components/UpcomingCard';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { EmptyState } from '../components/EmptyState';
import { useDemoDelay } from '../hooks/useDemoDelay';
import { SkeletonCard } from '../components/ui/Skeleton';

/* ─── Sharing permission rows ─── */
const PERMISSIONS = [
  { label: 'Aktuelle Zyklusphase', enabled: true },
  { label: 'Fruchtbarkeitsstatus', enabled: true },
  { label: 'Stimmung & Energie', enabled: true },
  { label: 'Nächste Periode / Ovulation', enabled: true },
  { label: 'Temperaturkurve', enabled: false },
  { label: 'Symptom-Details', enabled: false },
];

export default function Partner() {
  const navigate = useNavigate();
  const { cycleHistory } = useCycleStore();
  const {
    isPartnerView,
    setIsPartnerView,
    familyPlanningMode,
    authState,
    profile,
    enterDemo,
  } = useUserStore();
  const loaded = useDemoDelay(500);

  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);

  const today = getCurrentCycleDay(cycleHistory);
  const stats = calculateCycleStats(cycleHistory);

  const handlePartnerLogout = () => {
    setIsPartnerView(false);
    navigate('/partner-login');
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText('https://mycicle.app/partner-invite/sarah-001');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ══════════════════════════════════════
     Partner view (logged in as Tom)
     ══════════════════════════════════════ */
  if (isPartnerView) {
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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Sarahs Übersicht
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Partner-Ansicht · Nur von Sarah geteilte Informationen
            </p>
          </div>
          <button
            onClick={handlePartnerLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <LogOut size={14} />
            Abmelden
          </button>
        </div>

        <CurrentStatusCard today={today} />

        <div className="grid md:grid-cols-2 gap-6">
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
          <div className="space-y-4">
            <EducationCard />
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Kurzübersicht
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500">Zyklustag</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                    {today?.dayOfCycle ?? '–'}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500">Ø Länge</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                    {stats.avgLength}
                  </p>
                  <p className="text-xs text-gray-400">Tage</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500">Stimmung</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                    {today?.mood === 1
                      ? '😞'
                      : today?.mood === 2
                        ? '😕'
                        : today?.mood === 3
                          ? '😐'
                          : today?.mood === 4
                            ? '🙂'
                            : '😄'}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
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

  /* ══════════════════════════════════════
     Empty state for authenticated users
     ══════════════════════════════════════ */
  if (authState === 'authenticated') {
    return (
      <EmptyState
        icon={<Users size={28} />}
        title="Partner-Zugang"
        description="Teile ausgewählte Zyklus-Informationen mit deinem Partner. Probiere den Demo-Modus, um die Partner-Funktionen kennenzulernen."
        action={
          <Button variant="secondary" onClick={enterDemo}>
            Demo-Partner-Ansicht testen
          </Button>
        }
      />
    );
  }

  /* ══════════════════════════════════════
     Main user view — Partner management
     ══════════════════════════════════════ */
  if (!loaded) {
    return (
      <div className="space-y-6">
        <SkeletonCard className="h-40" />
        <SkeletonCard className="h-40" />
      </div>
    );
  }

  const firstName = profile.name.split(' ')[0] || 'Nutzerin';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Partner-Zugang
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Teile ausgewählte Zyklus-Informationen sicher mit deinem Partner.
        </p>
      </div>

      {/* ── Connected partner ── */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-calm-text dark:text-gray-100">
              Verbundener Partner
            </span>
            <Badge color="teal" size="sm">
              Aktiv
            </Badge>
          </div>
        </CardHeader>
        <CardBody>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <Avatar name="Tom Müller" size="md" />
              <div>
                <p className="text-sm font-semibold text-calm-text dark:text-gray-100">
                  Tom Müller
                </p>
                <p className="text-xs text-calm-muted">
                  tom@demo.mycicle.app · Verbunden seit Jan. 2026
                </p>
              </div>
            </div>
            <button
              disabled
              className="text-xs text-red-400 px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-800 opacity-50 cursor-not-allowed"
            >
              Zugang widerrufen
            </button>
          </div>
        </CardBody>
      </Card>

      {/* ── Invite link ── */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Link2 size={16} className="text-[#6F7CFF]" />
            <span className="text-sm font-semibold text-calm-text dark:text-gray-100">
              Einladungslink
            </span>
          </div>
        </CardHeader>
        <CardBody className="space-y-3">
          <p className="text-xs text-calm-muted leading-relaxed">
            Teile diesen Link mit deinem Partner. Er kann sich damit anmelden und
            nur die von dir freigegebenen Informationen sehen.
          </p>
          <div className="flex gap-2">
            <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 text-sm text-calm-muted font-mono truncate border border-gray-100 dark:border-gray-700">
              mycicle.app/partner-invite/{firstName.toLowerCase()}-001
            </div>
            <Button
              variant={copied ? 'ghost' : 'secondary'}
              size="sm"
              onClick={handleCopyLink}
              leftIcon={copied ? <Check size={14} /> : <Copy size={14} />}
            >
              {copied ? 'Kopiert' : 'Kopieren'}
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* ── Sharing permissions ── */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-[#7CC8B5]" />
            <span className="text-sm font-semibold text-calm-text dark:text-gray-100">
              Geteilte Informationen
            </span>
          </div>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            {PERMISSIONS.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span
                  className={`text-sm ${item.enabled ? 'text-calm-text dark:text-gray-100' : 'text-calm-muted'}`}
                >
                  {item.label}
                </span>
                <div
                  className={`w-9 h-5 rounded-full transition-colors relative ${
                    item.enabled
                      ? 'bg-[#7CC8B5]'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                      item.enabled ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-calm-muted mt-4">
            Dein Partner sieht nur die aktivierten Informationen. Sensible Daten wie
            Temperaturkurve und Symptom-Details sind standardmäßig deaktiviert.
          </p>
        </CardBody>
      </Card>

      {/* ── Preview toggle ── */}
      <Card variant="elevated">
        <CardBody>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EEF0FF] dark:bg-[#6F7CFF]/20 flex items-center justify-center text-[#6F7CFF]">
                {showPreview ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
              <div>
                <p className="text-sm font-semibold text-calm-text dark:text-gray-100">
                  Partner-Ansicht Vorschau
                </p>
                <p className="text-xs text-calm-muted">
                  Sieh, was dein Partner sehen würde
                </p>
              </div>
            </div>
            <Button
              variant={showPreview ? 'ghost' : 'secondary'}
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              leftIcon={showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
            >
              {showPreview ? 'Ausblenden' : 'Vorschau'}
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* ── Inline preview ── */}
      {showPreview && (
        <div className="border-2 border-dashed border-[#6F7CFF]/30 rounded-2xl p-6 bg-[#EEF0FF]/30 dark:bg-[#6F7CFF]/5 space-y-6">
          <div className="flex items-center gap-2 text-xs text-[#6F7CFF] font-medium">
            <Eye size={14} />
            Partner-Ansicht Vorschau — so sieht Tom diese Seite
          </div>

          <CurrentStatusCard today={today} />

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <FertilityTrafficLight
                currentDay={today?.dayOfCycle ?? 14}
                ovulationDay={14}
                mode={familyPlanningMode}
              />
              <UpcomingCard
                currentDay={today?.dayOfCycle ?? 14}
                cycleLength={stats.avgLength}
                ovulationDay={14}
                periodStart={1}
              />
            </div>
            <div className="space-y-4">
              <EducationCard />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import {
  MessageCircle,
  Heart,
  Bookmark,
  TrendingUp,
  ShieldCheck,
  PenSquare,
} from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { EmptyState } from '../components/EmptyState';
import { Button } from '../components/ui/Button';
import { Card, CardBody } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { ProBadge } from '../components/ProBadge';
import { useDemoDelay } from '../hooks/useDemoDelay';
import { SkeletonCard } from '../components/ui/Skeleton';

/* ─── Categories ─── */
type Category = 'all' | 'zykluswissen' | 'kinderwunsch' | 'verhuetung' | 'ernaehrung' | 'erfahrungen';

const TABS: Array<{ id: Category; label: string }> = [
  { id: 'all', label: 'Alle' },
  { id: 'zykluswissen', label: 'Zykluswissen' },
  { id: 'kinderwunsch', label: 'Kinderwunsch' },
  { id: 'verhuetung', label: 'Verhütung' },
  { id: 'ernaehrung', label: 'Ernährung & Fitness' },
  { id: 'erfahrungen', label: 'Erfahrungen' },
];

const CATEGORY_COLORS: Record<string, 'teal' | 'purple' | 'rose' | 'amber' | 'green' | 'slate'> = {
  zykluswissen: 'teal',
  kinderwunsch: 'purple',
  verhuetung: 'rose',
  ernaehrung: 'green',
  erfahrungen: 'amber',
};

/* ─── Mock posts ─── */
interface Post {
  id: number;
  author: string;
  timeAgo: string;
  category: Exclude<Category, 'all'>;
  title: string;
  preview: string;
  likes: number;
  comments: number;
  pro?: boolean;
}

const POSTS: Post[] = [
  {
    id: 1,
    author: 'Lisa K.',
    timeAgo: 'vor 2 Stunden',
    category: 'zykluswissen',
    title: 'Temperaturanstieg erst an Tag 18 – normal?',
    preview:
      'Mein Eisprung war laut App an Tag 14, aber mein Temperaturanstieg kam erst 4 Tage später. Hat jemand ähnliche Erfahrungen? Mein Zyklus ist sonst sehr regelmäßig mit 29 Tagen...',
    likes: 24,
    comments: 12,
  },
  {
    id: 2,
    author: 'Anna M.',
    timeAgo: 'vor 5 Stunden',
    category: 'kinderwunsch',
    title: 'Oura Ring & Kinderwunsch – meine Erfahrung nach 6 Monaten',
    preview:
      'Ich nutze den Oura Ring jetzt seit 6 Monaten parallel zur symptothermalen Methode. Die HRV-Daten haben mir tatsächlich geholfen, meinen Eisprung genauer einzugrenzen...',
    likes: 67,
    comments: 23,
    pro: true,
  },
  {
    id: 3,
    author: 'Sarah B.',
    timeAgo: 'vor 8 Stunden',
    category: 'ernaehrung',
    title: 'Ernährung in der Lutealphase – was hilft wirklich gegen PMS?',
    preview:
      'Ich habe in den letzten 3 Zyklen meine Ernährung in der Lutealphase umgestellt: mehr Magnesium, weniger Zucker, kein Koffein ab Tag 20. Der Unterschied ist erstaunlich...',
    likes: 89,
    comments: 34,
  },
  {
    id: 4,
    author: 'Julia R.',
    timeAgo: 'vor 1 Tag',
    category: 'verhuetung',
    title: 'Von der Pille zur symptothermalen Methode – mein Übergang',
    preview:
      'Nach 8 Jahren Pille habe ich vor 4 Monaten abgesetzt. Die ersten 2 Zyklen waren chaotisch, aber jetzt pendelt sich alles ein. Hier meine Tipps für den Umstieg...',
    likes: 112,
    comments: 45,
  },
  {
    id: 5,
    author: 'Marie W.',
    timeAgo: 'vor 1 Tag',
    category: 'erfahrungen',
    title: 'Wie ich meinem Partner mycycle erklärt habe',
    preview:
      'Mein Freund wusste kaum etwas über den Zyklus. Seit ich ihm die Partner-Ansicht gezeigt habe, versteht er viel besser, warum ich an manchen Tagen mehr Ruhe brauche...',
    likes: 156,
    comments: 28,
  },
  {
    id: 6,
    author: 'Dr. Lena H.',
    timeAgo: 'vor 2 Tagen',
    category: 'zykluswissen',
    title: 'Zervixschleim richtig beobachten – häufige Fehler',
    preview:
      'Als Gynäkologin sehe ich oft, dass die Zervixschleimbeobachtung falsch durchgeführt wird. Hier die 5 häufigsten Fehler und wie ihr sie vermeidet...',
    likes: 203,
    comments: 41,
    pro: true,
  },
  {
    id: 7,
    author: 'Kathrin S.',
    timeAgo: 'vor 3 Tagen',
    category: 'ernaehrung',
    title: 'Seed Cycling – Hype oder Hilfe?',
    preview:
      'Ich habe 3 Monate lang Seed Cycling ausprobiert (Leinsamen & Kürbiskerne in Phase 1, Sesam & Sonnenblumenkerne in Phase 2). Meine ehrliche Bewertung...',
    likes: 78,
    comments: 19,
  },
  {
    id: 8,
    author: 'Nina F.',
    timeAgo: 'vor 3 Tagen',
    category: 'kinderwunsch',
    title: 'HRV-Tracking hat meinen Eisprung verraten, bevor der LH-Test positiv war',
    preview:
      'Spannende Entdeckung: Mein HRV-Dip kam konsistent 1-2 Tage vor dem positiven LH-Test. Hat jemand ähnliche Muster beobachtet?',
    likes: 94,
    comments: 31,
    pro: true,
  },
];

const TRENDING = [
  { label: 'Lutealphase verlängern', count: 234 },
  { label: 'HRV & Eisprung', count: 189 },
  { label: 'NFP Anfängerinnen', count: 156 },
  { label: 'Pille absetzen', count: 143 },
  { label: 'Zyklusgerechtes Training', count: 128 },
];

export default function Community() {
  const [activeTab, setActiveTab] = useState<Category>('all');
  const { authState, enterDemo } = useUserStore();
  const loaded = useDemoDelay(500);

  if (authState === 'authenticated') {
    return (
      <EmptyState
        icon={<MessageCircle size={28} />}
        title="Community"
        description="Tausche dich mit anderen Nutzerinnen aus, stelle Fragen und teile deine Erfahrungen rund um Zyklusgesundheit."
        action={
          <Button variant="secondary" onClick={enterDemo}>
            Demo-Community ansehen
          </Button>
        }
      />
    );
  }

  if (!loaded) {
    return (
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className="space-y-4">
          <SkeletonCard className="h-64" />
          <SkeletonCard className="h-48" />
        </div>
      </div>
    );
  }

  const filtered =
    activeTab === 'all' ? POSTS : POSTS.filter((p) => p.category === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Community</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {POSTS.length} Beiträge · {POSTS.reduce((s, p) => s + p.comments, 0)} Kommentare
          </p>
        </div>
        <Button variant="secondary" leftIcon={<PenSquare size={16} />} disabled>
          Neuen Beitrag erstellen
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Feed */}
        <div className="md:col-span-2 space-y-4">
          {filtered.map((post) => (
            <Card key={post.id} className="dark:bg-gray-900 dark:border-gray-800 hover:shadow-md transition-shadow cursor-pointer">
              <CardBody className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Avatar name={post.author} size="sm" />
                    <div>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {post.author}
                      </span>
                      <span className="text-xs text-gray-400 ml-2">{post.timeAgo}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {post.pro && <ProBadge />}
                    <Badge color={CATEGORY_COLORS[post.category] ?? 'slate'} size="sm">
                      {TABS.find((t) => t.id === post.category)?.label ?? post.category}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                    {post.preview}
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-1">
                  <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-rose-500 transition-colors">
                    <Heart size={14} />
                    {post.likes}
                  </button>
                  <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#6F7CFF] transition-colors">
                    <MessageCircle size={14} />
                    {post.comments}
                  </button>
                  <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-amber-500 transition-colors ml-auto">
                    <Bookmark size={14} />
                  </button>
                </div>
              </CardBody>
            </Card>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-sm text-gray-400">
              Keine Beiträge in dieser Kategorie.
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Trending */}
          <Card className="dark:bg-gray-900 dark:border-gray-800">
            <CardBody>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={16} className="text-[#6F7CFF]" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Beliebte Themen
                </h3>
              </div>
              <div className="space-y-3">
                {TRENDING.map((topic, i) => (
                  <div key={topic.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-bold text-gray-300 w-4">{i + 1}</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300 hover:text-[#6F7CFF] cursor-pointer transition-colors">
                        {topic.label}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">{topic.count} Beiträge</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Rules */}
          <Card className="dark:bg-gray-900 dark:border-gray-800">
            <CardBody>
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck size={16} className="text-[#7CC8B5]" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Community-Regeln
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                <li>• Respektvoller Umgang miteinander</li>
                <li>• Keine medizinischen Diagnosen stellen</li>
                <li>• Persönliche Daten schützen</li>
                <li>• Werbung und Spam sind nicht erlaubt</li>
                <li>• Bei Beschwerden: Immer ärztlichen Rat einholen</li>
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

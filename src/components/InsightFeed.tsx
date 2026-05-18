import { motion, AnimatePresence } from 'framer-motion';
import type { KIInsight, InsightType, Severity } from '../types';
import { InsightCard } from './InsightCard';

type Tab = 'all' | InsightType | Severity;

interface InsightFeedProps {
  insights: KIInsight[];
  activeTab: Tab;
}

export function InsightFeed({ insights, activeTab }: InsightFeedProps) {
  const filtered = insights.filter((insight) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'anomaly') return insight.type === 'anomaly' || insight.type === 'warning';
    if (activeTab === 'recommendation') return insight.type === 'recommendation';
    if (activeTab === 'positive') return insight.severity === 'positive';
    return true;
  });

  // Sort: pinned first, then by date desc
  const sorted = [...filtered].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.date.localeCompare(a.date);
  });

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {sorted.map((insight, i) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, delay: i * 0.05 }}
          >
            <InsightCard insight={insight} />
          </motion.div>
        ))}
      </AnimatePresence>
      {sorted.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-sm">Keine Insights in dieser Kategorie</p>
        </div>
      )}
    </div>
  );
}

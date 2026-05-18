import { useState } from 'react';
import { CheckSquare, Square } from 'lucide-react';
import type { ReactNode } from 'react';

interface RecommendationCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  difficulty: 'leicht' | 'mittel' | 'schwer';
  category: string;
}

const difficultyConfig = {
  leicht: 'bg-green-100 text-green-700',
  mittel: 'bg-amber-100 text-amber-700',
  schwer: 'bg-red-100 text-red-700',
};

export function RecommendationCard({ icon, title, description, difficulty, category }: RecommendationCardProps) {
  const [done, setDone] = useState(false);

  return (
    <div className={`bg-white rounded-xl border border-gray-100 shadow-sm p-4 transition-all duration-200 ${done ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-3">
        <div className="p-2 bg-rose-50 rounded-lg text-rose-600 flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className={`text-sm font-semibold text-gray-900 ${done ? 'line-through' : ''}`}>{title}</p>
            <button
              onClick={() => setDone(!done)}
              className="flex-shrink-0 text-gray-400 hover:text-teal-500 transition-colors"
            >
              {done ? <CheckSquare size={18} className="text-teal-500" /> : <Square size={18} />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyConfig[difficulty]}`}>
              {difficulty}
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              {category}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

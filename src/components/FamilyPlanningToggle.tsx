import { Shield, Baby } from 'lucide-react';
import { useUserStore } from '../store/userStore';

export function FamilyPlanningToggle() {
  const { familyPlanningMode, setFamilyPlanningMode } = useUserStore();
  const isConception = familyPlanningMode === 'conception';

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Modus</h3>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setFamilyPlanningMode('contraception')}
          className={`flex items-center gap-2 px-3 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
            !isConception
              ? 'bg-[#EEF0FF] border-[#B3B9FF] text-[#6F7CFF]'
              : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'
          }`}
        >
          <Shield size={16} />
          Verhütung
        </button>
        <button
          onClick={() => setFamilyPlanningMode('conception')}
          className={`flex items-center gap-2 px-3 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
            isConception
              ? 'bg-green-50 border-green-300 text-green-700'
              : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'
          }`}
        >
          <Baby size={16} />
          Kinderwunsch
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-2">
        Ändert die Bedeutung der Fruchtbarkeitsampel
      </p>
    </div>
  );
}

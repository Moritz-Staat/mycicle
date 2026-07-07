import { Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';

export function DemoModeBanner() {
  const { authState, logout, switchToAccount } = useUserStore();
  const navigate = useNavigate();

  if (authState !== 'demo') return null;

  const hasAccount = !!localStorage.getItem('mycycle-account');

  const handleAction = () => {
    if (hasAccount) {
      switchToAccount();
    } else {
      logout();
      navigate('/signup');
    }
  };

  return (
    <div
      className="sticky top-0 z-50 px-4 py-2.5 flex items-center justify-between gap-3 shadow-sm"
      style={{ background: 'linear-gradient(135deg, #B391C8 0%, #6F7CFF 47%, #7CC8B5 100%)' }}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Info size={16} className="flex-shrink-0 text-white" />
        <p className="text-sm font-medium text-white truncate">
          Demo-Modus – Du siehst Beispieldaten von Sarah
        </p>
      </div>
      <button
        onClick={handleAction}
        className="flex-shrink-0 px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-semibold transition-colors whitespace-nowrap"
      >
        {hasAccount ? 'Zurück zu meinem Account' : 'Echten Account erstellen'}
      </button>
    </div>
  );
}

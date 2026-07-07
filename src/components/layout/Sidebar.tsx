import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Activity, Sparkles, Users, LogOut, Dumbbell, MessageCircle } from 'lucide-react';
import { useUserStore } from '../../store/userStore';
import { MycycleLogo } from '../MycycleLogo';
import { ProBadge } from '../ProBadge';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  to: string;
  pro?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: <Home size={20} />, to: '/' },
  { label: 'Ernährung & Sport', icon: <Dumbbell size={20} />, to: '/nutrition' },
  { label: 'Wearables', icon: <Activity size={20} />, to: '/wearables', pro: true },
  { label: 'Insights', icon: <Sparkles size={20} />, to: '/insights', pro: true },
  { label: 'Community', icon: <MessageCircle size={20} />, to: '/community' },
  { label: 'Partner', icon: <Users size={20} />, to: '/partner', pro: true },
];

export function Sidebar() {
  const navigate = useNavigate();
  const { authState, profile, logout } = useUserStore();

  const handleLogout = () => {
    logout();
    navigate('/welcome');
  };

  return (
    <aside className="hidden md:flex flex-col w-60 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 min-h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-gray-100 dark:border-gray-800">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #B391C8 0%, #6F7CFF 47%, #7CC8B5 100%)' }}>
          <MycycleLogo size={22} />
        </div>
        <span className="text-lg font-bold tracking-tight" style={{ color: '#1A1625' }}>mycycle</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-[#EEF0FF] dark:bg-[#6F7CFF]/20 text-[#6F7CFF]'
                  : 'text-[#68627A] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[#1A1625] dark:hover:text-gray-100'
              }`
            }
          >
            {item.icon}
            <span className="flex-1">{item.label}</span>
            {item.pro && <ProBadge size="sm" />}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-800">
        {authState === 'demo' ? (
          <div className="rounded-lg px-3 py-2.5 text-xs" style={{ background: 'linear-gradient(135deg, rgba(179,145,200,0.12) 0%, rgba(111,124,255,0.10) 100%)' }}>
            <p className="font-semibold" style={{ color: '#6F7CFF' }}>Demo-Modus</p>
            <p className="mt-0.5" style={{ color: '#68627A' }}>Daten von Sarah M.</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="rounded-lg px-3 py-2.5 text-xs bg-gray-50 dark:bg-gray-800">
              <p className="font-semibold text-calm-text dark:text-gray-200 truncate">{profile.name}</p>
              <p className="mt-0.5 text-calm-muted truncate">{profile.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-calm-muted hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={14} />
              Abmelden
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

// Bottom Navigation for mobile — 5 key items with short labels
const mobileNav: Array<{ icon: React.ReactNode; label: string; to: string }> = [
  { icon: <Home size={20} />, label: 'Home', to: '/' },
  { icon: <Dumbbell size={20} />, label: 'Coaching', to: '/nutrition' },
  { icon: <Sparkles size={20} />, label: 'Insights', to: '/insights' },
  { icon: <MessageCircle size={20} />, label: 'Community', to: '/community' },
  { icon: <Users size={20} />, label: 'Partner', to: '/partner' },
];

export function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 z-50 safe-area-bottom">
      <div className="flex justify-around py-2 px-1">
        {mobileNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-lg transition-all duration-200 min-w-0 ${
                isActive ? 'text-[#6F7CFF]' : 'text-[#68627A] dark:text-gray-400'
              }`
            }
          >
            {item.icon}
            <span className="text-[10px] font-medium leading-tight">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

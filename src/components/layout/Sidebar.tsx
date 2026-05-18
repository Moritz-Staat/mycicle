import { NavLink } from 'react-router-dom';
import { Home, Activity, Sparkles, Users, Heart } from 'lucide-react';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  to: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: <Home size={20} />, to: '/' },
  { label: 'Wearables', icon: <Activity size={20} />, to: '/wearables' },
  { label: 'Insights', icon: <Sparkles size={20} />, to: '/insights' },
  { label: 'Partner', icon: <Users size={20} />, to: '/partner' },
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-60 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 min-h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-gray-100 dark:border-gray-800">
        <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center">
          <Heart size={16} className="text-white" fill="white" />
        </div>
        <span className="text-lg font-bold text-gray-900 dark:text-gray-100">mycicle</span>
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
                  ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Demo mode indicator */}
      <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-800">
        <div className="bg-amber-50 dark:bg-yellow-900/30 rounded-lg px-3 py-2.5 text-xs text-amber-700 dark:text-yellow-200">
          <p className="font-semibold">Demo-Modus</p>
          <p className="mt-0.5 text-amber-600 dark:text-yellow-300">Daten von Sarah M.</p>
        </div>
      </div>
    </aside>
  );
}

// Bottom Navigation for mobile
export function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 z-50">
      <div className="flex justify-around py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all duration-200 min-w-[60px] ${
                isActive ? 'text-rose-600' : 'text-gray-500 dark:text-gray-400'
              }`
            }
          >
            {item.icon}
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

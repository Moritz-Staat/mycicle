import { NavLink } from 'react-router-dom';
import { Home, Activity, Sparkles, Users } from 'lucide-react';

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

function MycycleLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M143 38 C107 19 60 38 42 82 C23 129 49 184 99 201 C132 212 170 202 194 176" fill="none" stroke="white" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M82 104 C82 82 110 76 128 101 C146 76 174 82 174 104 C174 135 128 164 128 164 C128 164 82 135 82 104 Z" fill="none" stroke="white" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M111 135 L121 135 L126 121 L133 153 L140 135 L153 135" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function Sidebar() {
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
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Demo mode indicator */}
      <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-800">
        <div className="rounded-lg px-3 py-2.5 text-xs" style={{ background: 'linear-gradient(135deg, rgba(179,145,200,0.12) 0%, rgba(111,124,255,0.10) 100%)' }}>
          <p className="font-semibold" style={{ color: '#6F7CFF' }}>Demo-Modus</p>
          <p className="mt-0.5" style={{ color: '#68627A' }}>Daten von Sarah M.</p>
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
                isActive ? 'text-[#6F7CFF]' : 'text-[#68627A] dark:text-gray-400'
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

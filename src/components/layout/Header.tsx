import { Bell, Sun, Moon, Monitor } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { useUIStore } from '../../store/uiStore';
import { NotificationCenter } from './NotificationCenter';

interface HeaderProps {
  title: string;
}

const themeIcons = {
  light: Sun,
  dark: Moon,
  system: Monitor,
} as const;

const themeOrder: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];

export function Header({ title }: HeaderProps) {
  const { unreadCount, notifOpen, setNotifOpen, theme, setTheme } = useUIStore();

  const cycleTheme = () => {
    const idx = themeOrder.indexOf(theme);
    setTheme(themeOrder[(idx + 1) % 3]);
  };

  const ThemeIcon = themeIcons[theme];

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={cycleTheme}
            className="p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
            aria-label="Theme wechseln"
          >
            <ThemeIcon size={20} />
          </button>

          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
              aria-label="Benachrichtigungen"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <NotificationCenter />
          </div>

          <Avatar name="Sarah M." size="sm" />
        </div>
      </div>
    </header>
  );
}

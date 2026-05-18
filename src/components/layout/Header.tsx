import { useState } from 'react';
import { Bell, Settings } from 'lucide-react';
import { Avatar } from '../ui/Avatar';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const [hasNotifications] = useState(true);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        <div className="flex items-center gap-3">
          <button
            className="relative p-2 rounded-lg hover:bg-gray-50 text-gray-500 transition-colors"
            aria-label="Benachrichtigungen"
          >
            <Bell size={20} />
            {hasNotifications && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
            )}
          </button>
          <button
            className="p-2 rounded-lg hover:bg-gray-50 text-gray-500 transition-colors"
            aria-label="Einstellungen"
          >
            <Settings size={20} />
          </button>
          <Avatar name="Sarah M." size="sm" />
        </div>
      </div>
    </header>
  );
}

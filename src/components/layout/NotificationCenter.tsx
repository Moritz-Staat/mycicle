import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCheck, Thermometer, Flower2, Activity, BarChart2, Users, Moon, Calendar, FileText } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useNavigate } from 'react-router-dom';

const iconMap: Record<string, React.ElementType> = {
  Thermometer,
  Flower2,
  Activity,
  BarChart2,
  Users,
  Moon,
  Calendar,
  FileText,
};

export function NotificationCenter() {
  const { notifOpen, setNotifOpen, notifications, markAllRead, markRead } = useUIStore();
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    if (notifOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [notifOpen, setNotifOpen]);

  return (
    <AnimatePresence>
      {notifOpen && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: -8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ duration: 0.15 }}
          className="absolute right-0 top-full mt-2 w-[380px] bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Benachrichtigungen</p>
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-medium"
            >
              <CheckCheck size={14} />
              Alle gelesen
            </button>
          </div>

          {/* List */}
          <div className="overflow-y-auto max-h-[480px]">
            {notifications.map((n) => {
              const Icon = iconMap[n.lucideIcon] ?? Activity;
              return (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`flex gap-3 px-4 py-3 border-b border-gray-50 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                    !n.read ? 'border-l-2 border-l-rose-500 bg-rose-50 dark:bg-rose-950/20' : ''
                  }`}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${n.iconBg}`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-medium leading-tight ${!n.read ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}>
                        {n.title}
                      </p>
                      <span className="text-xs text-gray-400 flex-shrink-0">{n.timestamp}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{n.body}</p>
                    {n.action && (
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(n.action!.route); setNotifOpen(false); }}
                        className="mt-1 text-xs text-rose-600 font-medium hover:underline"
                      >
                        {n.action.label} →
                      </button>
                    )}
                  </div>
                  {!n.read && (
                    <div className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0 mt-1.5" />
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

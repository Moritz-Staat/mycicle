import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar, BottomNav } from './Sidebar';
import { Header } from './Header';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/nutrition': 'Ernährung',
  '/wearables': 'Wearables',
  '/insights': 'KI-Insights',
  '/community': 'Community',
  '/partner': 'Partner-Ansicht',
};

export function AppLayout() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'mycycle';

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={title} />
        <main className="flex-1 p-6 pb-24 md:pb-6">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  );
}

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Outlet />
    </div>
  );
}

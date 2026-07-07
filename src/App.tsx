import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppLayout, AuthLayout } from './components/layout/AppLayout';
import { DemoModeBanner } from './components/DemoModeBanner';
import { OnboardingTour } from './components/OnboardingTour';
import { PageTransition } from './components/PageTransition';
import { AIChatButton } from './components/AIChat/AIChatButton';
import { AIChatDrawer } from './components/AIChat/AIChatDrawer';
import { useUserStore } from './store/userStore';
import Dashboard from './pages/Dashboard';
import Nutrition from './pages/Nutrition';
import Wearables from './pages/Wearables';
import Insights from './pages/Insights';
import Community from './pages/Community';
import Partner from './pages/Partner';
import PartnerLogin from './pages/PartnerLogin';
import Pitch from './pages/Pitch';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Signup from './pages/Signup';

const GUEST_ONLY = ['/welcome', '/login', '/signup'];
const PUBLIC = [...GUEST_ONLY, '/partner-login', '/pitch'];

function AnimatedRoutes() {
  const location = useLocation();
  const authState = useUserStore((s) => s.authState);
  const isPitch = location.pathname === '/pitch';

  // Redirect guests away from protected routes
  if (authState === 'guest' && !PUBLIC.includes(location.pathname)) {
    return <Navigate to="/welcome" replace />;
  }

  // Redirect authenticated users away from guest-only routes
  if (authState !== 'guest' && GUEST_ONLY.includes(location.pathname)) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public standalone pages */}
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/pitch" element={<Pitch />} />

          {/* Auth pages (standalone layout) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Partner login */}
          <Route element={<AuthLayout />}>
            <Route path="/partner-login" element={<PageTransition><PartnerLogin /></PageTransition>} />
          </Route>

          {/* Main app routes */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<PageTransition><Dashboard /></PageTransition>} />
            <Route path="/nutrition" element={<PageTransition><Nutrition /></PageTransition>} />
            <Route path="/wearables" element={<PageTransition><Wearables /></PageTransition>} />
            <Route path="/insights" element={<PageTransition><Insights /></PageTransition>} />
            <Route path="/community" element={<PageTransition><Community /></PageTransition>} />
            <Route path="/partner" element={<PageTransition><Partner /></PageTransition>} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to={authState === 'guest' ? '/welcome' : '/'} replace />} />
        </Routes>
      </AnimatePresence>

      {!isPitch && authState !== 'guest' && (
        <>
          <AIChatButton />
          <AIChatDrawer />
        </>
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <DemoModeBanner />
      <OnboardingTour />
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

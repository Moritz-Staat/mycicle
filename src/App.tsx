import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppLayout, AuthLayout } from './components/layout/AppLayout';
import { DemoModeBanner } from './components/DemoModeBanner';
import { OnboardingTour } from './components/OnboardingTour';
import { PageTransition } from './components/PageTransition';
import Dashboard from './pages/Dashboard';
import Wearables from './pages/Wearables';
import Insights from './pages/Insights';
import Partner from './pages/Partner';
import PartnerLogin from './pages/PartnerLogin';
import Pitch from './pages/Pitch';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Main app routes */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<PageTransition><Dashboard /></PageTransition>} />
          <Route path="/wearables" element={<PageTransition><Wearables /></PageTransition>} />
          <Route path="/insights" element={<PageTransition><Insights /></PageTransition>} />
          <Route path="/partner" element={<PageTransition><Partner /></PageTransition>} />
        </Route>

        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/partner-login" element={<PageTransition><PartnerLogin /></PageTransition>} />
        </Route>

        {/* Standalone routes */}
        <Route path="/pitch" element={<Pitch />} />
      </Routes>
    </AnimatePresence>
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

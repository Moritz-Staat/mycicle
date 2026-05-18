
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout, AuthLayout } from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Wearables from './pages/Wearables';
import Insights from './pages/Insights';
import Partner from './pages/Partner';
import PartnerLogin from './pages/PartnerLogin';
import Pitch from './pages/Pitch';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main app routes */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/wearables" element={<Wearables />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/partner" element={<Partner />} />
        </Route>

        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/partner-login" element={<PartnerLogin />} />
        </Route>

        {/* Standalone routes */}
        <Route path="/pitch" element={<Pitch />} />
      </Routes>
    </BrowserRouter>
  );
}

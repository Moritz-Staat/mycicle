import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Eye, EyeOff, Users } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { DEMO_CREDENTIALS } from '../data/mock/profiles';
import { Button } from '../components/ui/Button';

export default function PartnerLogin() {
  const navigate = useNavigate();
  const { setIsPartnerView } = useUserStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (
        email === DEMO_CREDENTIALS.tom.email &&
        password === DEMO_CREDENTIALS.tom.password
      ) {
        setIsPartnerView(true);
        navigate('/partner');
      } else {
        setError('E-Mail oder Passwort ungültig. Demo: tom@demo.mycycle.app / partner2026');
      }
      setLoading(false);
    }, 800);
  };

  const handleDemoLogin = () => {
    setEmail(DEMO_CREDENTIALS.tom.email);
    setPassword(DEMO_CREDENTIALS.tom.password);
  };

  return (
    <div className="w-full max-w-md">
      {/* Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#6F7CFF] flex items-center justify-center mb-3">
            <Heart size={24} className="text-white" fill="white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">mycycle</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
            <Users size={14} />
            Partner-Zugang
          </p>
        </div>

        {/* Demo hint */}
        <button
          onClick={handleDemoLogin}
          className="w-full mb-6 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700 hover:bg-amber-100 transition-colors text-left"
        >
          <span className="font-semibold">Demo-Zugangsdaten einfügen →</span>
          <br />
          <span className="text-xs opacity-80">tom@demo.mycycle.app / partner2026</span>
        </button>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">E-Mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tom@demo.mycycle.app"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 transition-shadow"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Passwort</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 transition-shadow pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="w-full"
            size="lg"
          >
            Anmelden
          </Button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Dieser Zugang wurde von deinem Partner geteilt.
        </p>
      </div>
    </div>
  );
}

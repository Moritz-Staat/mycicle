import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { Button } from '../components/ui/Button';
import { MycycleLogo } from '../components/MycycleLogo';

export default function Login() {
  const navigate = useNavigate();
  const { login, enterDemo } = useUserStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (login(email, password)) {
        navigate('/');
      } else {
        setError('E-Mail oder Passwort ungültig.');
      }
      setLoading(false);
    }, 800);
  };

  const handleDemo = () => {
    enterDemo();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F7FA] to-[#EEF0FF] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-calm-md border border-gray-100 p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
              style={{ background: 'linear-gradient(135deg, #B391C8 0%, #6F7CFF 47%, #7CC8B5 100%)' }}
            >
              <MycycleLogo size={28} />
            </div>
            <h1 className="text-2xl font-bold text-calm-text">Willkommen zurück</h1>
            <p className="text-sm text-calm-muted mt-1">Melde dich bei mycycle an</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-calm-text mb-1.5">E-Mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="deine@email.de"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6F7CFF]/30 focus:border-[#6F7CFF] transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-calm-text mb-1.5">Passwort</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6F7CFF]/30 focus:border-[#6F7CFF] transition-all pr-10"
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

            <Button type="submit" variant="primary" loading={loading} className="w-full" size="lg">
              Anmelden
            </Button>
          </form>

          <div className="mt-6 flex flex-col items-center gap-3">
            <p className="text-sm text-calm-muted">
              Noch kein Konto?{' '}
              <Link to="/signup" className="text-[#6F7CFF] font-medium hover:underline">
                Registrieren
              </Link>
            </p>
            <button
              onClick={handleDemo}
              className="text-sm text-calm-muted hover:text-[#6F7CFF] transition-colors"
            >
              Demo ausprobieren &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

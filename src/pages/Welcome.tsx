import { useNavigate, Link } from 'react-router-dom';
import { Heart, Activity, Sparkles, Users, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUserStore } from '../store/userStore';
import { Button } from '../components/ui/Button';
import { MycycleLogo } from '../components/MycycleLogo';

const FEATURES = [
  {
    icon: <Heart size={20} />,
    label: 'Zyklustracking',
    desc: 'Sensiplan-Methode mit Temperatur & Zervixschleim',
    color: 'text-cycle-menstruation',
    bg: 'bg-red-50',
  },
  {
    icon: <Activity size={20} />,
    label: 'Wearable-Daten',
    desc: 'HRV, Schlaf & Aktivität von Oura, Apple Watch & Co.',
    color: 'text-calm-teal',
    bg: 'bg-teal-50',
  },
  {
    icon: <Sparkles size={20} />,
    label: 'KI-Insights',
    desc: 'Personalisierte Muster, Anomalien & Empfehlungen',
    color: 'text-calm-periwinkle',
    bg: 'bg-[#EEF0FF]',
  },
  {
    icon: <Users size={20} />,
    label: 'Partner-Ansicht',
    desc: 'Teile Zyklus-Infos sicher mit deinem Partner',
    color: 'text-calm-purple',
    bg: 'bg-purple-50',
  },
];

export default function Welcome() {
  const navigate = useNavigate();
  const { enterDemo } = useUserStore();

  const handleDemo = () => {
    enterDemo();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-calm-bg flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md text-center"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-calm-md"
            style={{ background: 'linear-gradient(135deg, #B391C8 0%, #6F7CFF 47%, #7CC8B5 100%)' }}
          >
            <MycycleLogo size={40} />
          </div>
          <h1 className="text-3xl font-bold text-calm-text tracking-tight">mycycle</h1>
          <p className="text-calm-muted mt-3 text-base leading-relaxed max-w-sm">
            KI-gestützte Zyklusgesundheit — verstehe deinen Körper besser mit
            personalisierten Insights und Wearable-Daten.
          </p>
        </div>

        {/* CTAs */}
        <div className="space-y-3 mb-6">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            rightIcon={<ArrowRight size={18} />}
            onClick={() => navigate('/signup')}
          >
            Konto erstellen
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={handleDemo}
          >
            Demo ausprobieren
          </Button>
        </div>

        <p className="text-sm text-calm-muted">
          Bereits ein Konto?{' '}
          <Link to="/login" className="text-[#6F7CFF] font-medium hover:underline">
            Anmelden
          </Link>
        </p>
      </motion.div>

      {/* Feature highlights */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-12 w-full max-w-lg grid grid-cols-2 gap-3"
      >
        {FEATURES.map((f) => (
          <div key={f.label} className={`${f.bg} rounded-xl p-4 text-left`}>
            <div className={`${f.color} mb-2`}>{f.icon}</div>
            <p className="text-sm font-semibold text-calm-text">{f.label}</p>
            <p className="text-xs text-calm-muted mt-0.5 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

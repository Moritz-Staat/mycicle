import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { Button } from '../components/ui/Button';
import { MycycleLogo } from '../components/MycycleLogo';

const STEP_LABELS = ['Konto', 'Datenschutz', 'Zyklus', 'Wearable'];

const WEARABLES = [
  { id: 'oura', name: 'Oura Ring', desc: 'Gen 3 / Gen 4', emoji: '\uD83D\uDC8D' },
  { id: 'apple', name: 'Apple Watch', desc: 'Series 7+', emoji: '\u231A' },
  { id: 'garmin', name: 'Garmin', desc: 'Forerunner / Venu', emoji: '\uD83C\uDFC3' },
];

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useUserStore();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
    privacy: false,
    healthData: false,
    marketing: false,
    cycleLength: 28,
    periodLength: 5,
    lastPeriod: '',
    cycleUnknown: false,
    wearable: null as string | null,
  });

  const set = (field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateStep = (): boolean => {
    const errs: Record<string, string> = {};

    if (step === 0) {
      if (!form.name.trim()) errs.name = 'Name ist erforderlich';
      if (!form.email.trim()) errs.email = 'E-Mail ist erforderlich';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        errs.email = 'Ungültige E-Mail-Adresse';
      if (form.password.length < 8)
        errs.password = 'Mindestens 8 Zeichen erforderlich';
      if (form.password !== form.confirmPassword)
        errs.confirmPassword = 'Passwörter stimmen nicht überein';
    }

    if (step === 1) {
      if (!form.terms) errs.terms = 'Bitte akzeptiere die AGB';
      if (!form.privacy) errs.privacy = 'Bitte akzeptiere die Datenschutzerklärung';
      if (!form.healthData) errs.healthData = 'Einwilligung erforderlich';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;

    if (step === STEP_LABELS.length - 1) {
      setLoading(true);
      setTimeout(() => {
        signup({
          name: form.name,
          email: form.email,
          password: form.password,
          cycleLength: form.cycleLength,
          periodLength: form.periodLength,
        });
        navigate('/');
      }, 1000);
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step === 0) navigate('/welcome');
    else setStep(step - 1);
  };

  const inputClass =
    'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6F7CFF]/30 focus:border-[#6F7CFF] transition-all';

  const checkboxClass = 'mt-0.5 h-4 w-4 rounded border-gray-300 accent-[#6F7CFF] flex-shrink-0';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F7FA] to-[#EEF0FF] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #B391C8 0%, #6F7CFF 47%, #7CC8B5 100%)' }}
          >
            <MycycleLogo size={22} />
          </div>
          <span className="text-lg font-bold text-calm-text tracking-tight">mycycle</span>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-1 sm:gap-2 mb-8">
          {STEP_LABELS.map((label, i) => (
            <div key={label} className="flex items-center gap-1 sm:gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  i < step
                    ? 'bg-[#7CC8B5] text-white'
                    : i === step
                      ? 'bg-[#6F7CFF] text-white'
                      : 'bg-gray-100 text-[#68627A]'
                }`}
              >
                {i < step ? <Check size={16} /> : i + 1}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block ${
                  i === step ? 'text-calm-text' : 'text-calm-muted'
                }`}
              >
                {label}
              </span>
              {i < STEP_LABELS.length - 1 && (
                <div className={`w-6 sm:w-8 h-0.5 ${i < step ? 'bg-[#7CC8B5]' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-calm-md border border-gray-100 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="p-8"
            >
              {/* ── Step 0: Account ── */}
              {step === 0 && (
                <>
                  <h2 className="text-xl font-bold text-calm-text mb-2">Erstelle dein Konto</h2>
                  <p className="text-sm text-calm-muted mb-6">
                    Deine Daten bleiben privat und sicher.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-calm-text mb-1.5">Name</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => set('name', e.target.value)}
                        placeholder="Dein Vorname"
                        className={inputClass}
                      />
                      {errors.name && (
                        <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-calm-text mb-1.5">E-Mail</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => set('email', e.target.value)}
                        placeholder="deine@email.de"
                        className={inputClass}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-calm-text mb-1.5">Passwort</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={form.password}
                          onChange={(e) => set('password', e.target.value)}
                          placeholder="Mindestens 8 Zeichen"
                          className={`${inputClass} pr-10`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-calm-text mb-1.5">
                        Passwort bestätigen
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={form.confirmPassword}
                        onChange={(e) => set('confirmPassword', e.target.value)}
                        placeholder="Passwort wiederholen"
                        className={inputClass}
                      />
                      {errors.confirmPassword && (
                        <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* ── Step 1: Consent ── */}
              {step === 1 && (
                <>
                  <h2 className="text-xl font-bold text-calm-text mb-2">Datenschutz & Einwilligung</h2>
                  <p className="text-sm text-calm-muted mb-6">
                    Wir nehmen den Schutz deiner Daten ernst. Bitte lies und akzeptiere die
                    folgenden Bedingungen.
                  </p>

                  <div className="space-y-4">
                    {/* AGB */}
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.terms}
                        onChange={(e) => set('terms', e.target.checked)}
                        className={checkboxClass}
                      />
                      <div>
                        <span className="text-sm font-medium text-calm-text">
                          Allgemeine Geschäftsbedingungen *
                        </span>
                        <p className="text-xs text-calm-muted mt-0.5">
                          Ich akzeptiere die{' '}
                          <span className="text-[#6F7CFF] underline cursor-pointer">AGB</span> von
                          mycycle.
                        </p>
                        {errors.terms && (
                          <p className="text-xs text-red-500 mt-1">{errors.terms}</p>
                        )}
                      </div>
                    </label>

                    {/* Datenschutz */}
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.privacy}
                        onChange={(e) => set('privacy', e.target.checked)}
                        className={checkboxClass}
                      />
                      <div>
                        <span className="text-sm font-medium text-calm-text">
                          Datenschutzerklärung *
                        </span>
                        <p className="text-xs text-calm-muted mt-0.5">
                          Ich habe die{' '}
                          <span className="text-[#6F7CFF] underline cursor-pointer">
                            Datenschutzerklärung
                          </span>{' '}
                          gelesen und verstanden.
                        </p>
                        {errors.privacy && (
                          <p className="text-xs text-red-500 mt-1">{errors.privacy}</p>
                        )}
                      </div>
                    </label>

                    {/* Gesundheitsdaten – DSGVO Art. 9 */}
                    <div className="bg-purple-50 rounded-xl p-4">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.healthData}
                          onChange={(e) => set('healthData', e.target.checked)}
                          className={checkboxClass}
                        />
                        <div>
                          <span className="text-sm font-medium text-calm-text">
                            Verarbeitung von Gesundheitsdaten *
                          </span>
                          <p className="text-xs text-calm-muted mt-1.5 leading-relaxed">
                            Ich willige gemäß{' '}
                            <span className="font-semibold">Art.&nbsp;9 Abs.&nbsp;2 lit.&nbsp;a DSGVO</span>{' '}
                            ausdrücklich in die Verarbeitung meiner Gesundheitsdaten ein. Dies umfasst
                            Zyklusdaten (Basaltemperatur, Zervixschleim, Symptome), Wearable-Gesundheitsdaten
                            (HRV, Schlafphasen, Herzfrequenz) sowie daraus abgeleitete Analysen.
                          </p>
                          <p className="text-xs text-calm-muted mt-1.5 leading-relaxed">
                            Diese Daten werden ausschließlich zur Bereitstellung der App-Funktionen
                            verwendet und nicht an Dritte weitergegeben. Die Einwilligung kann jederzeit
                            mit Wirkung für die Zukunft widerrufen werden.
                          </p>
                          {errors.healthData && (
                            <p className="text-xs text-red-500 mt-1.5">{errors.healthData}</p>
                          )}
                        </div>
                      </label>
                    </div>

                    {/* Marketing – optional */}
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.marketing}
                        onChange={(e) => set('marketing', e.target.checked)}
                        className={checkboxClass}
                      />
                      <div>
                        <span className="text-sm font-medium text-calm-text">
                          Produkt-Updates & Gesundheitstipps
                        </span>
                        <p className="text-xs text-calm-muted mt-0.5">
                          Ich möchte gelegentlich Produkt-Updates und personalisierte Gesundheitstipps
                          per E-Mail erhalten (jederzeit abbestellbar).
                        </p>
                      </div>
                    </label>
                  </div>

                  <p className="text-xs text-calm-muted mt-6">* Pflichtfeld — erforderlich zur Nutzung von mycycle</p>
                </>
              )}

              {/* ── Step 2: Cycle ── */}
              {step === 2 && (
                <>
                  <h2 className="text-xl font-bold text-calm-text mb-2">Dein Zyklus</h2>
                  <p className="text-sm text-calm-muted mb-6">
                    Diese Angaben helfen uns, deine Prognosen zu personalisieren. Du kannst sie
                    später jederzeit anpassen.
                  </p>

                  <div className="space-y-6">
                    {/* Zykluslänge */}
                    <div>
                      <label className="flex items-center justify-between text-sm font-medium text-calm-text mb-2">
                        <span>Durchschnittliche Zykluslänge</span>
                        <span className="text-[#6F7CFF] font-semibold">{form.cycleLength} Tage</span>
                      </label>
                      <input
                        type="range"
                        min={20}
                        max={45}
                        value={form.cycleLength}
                        onChange={(e) => set('cycleLength', parseInt(e.target.value))}
                        className="w-full accent-[#6F7CFF]"
                      />
                      <div className="flex justify-between text-xs text-calm-muted mt-1">
                        <span>20 Tage</span>
                        <span>45 Tage</span>
                      </div>
                    </div>

                    {/* Periodenlänge */}
                    <div>
                      <label className="flex items-center justify-between text-sm font-medium text-calm-text mb-2">
                        <span>Periodenlänge</span>
                        <span className="text-[#6F7CFF] font-semibold">{form.periodLength} Tage</span>
                      </label>
                      <input
                        type="range"
                        min={2}
                        max={10}
                        value={form.periodLength}
                        onChange={(e) => set('periodLength', parseInt(e.target.value))}
                        className="w-full accent-[#6F7CFF]"
                      />
                      <div className="flex justify-between text-xs text-calm-muted mt-1">
                        <span>2 Tage</span>
                        <span>10 Tage</span>
                      </div>
                    </div>

                    {/* Letzter Periodenbeginn */}
                    {!form.cycleUnknown && (
                      <div>
                        <label className="block text-sm font-medium text-calm-text mb-1.5">
                          Letzter Periodenbeginn
                        </label>
                        <input
                          type="date"
                          value={form.lastPeriod}
                          onChange={(e) => set('lastPeriod', e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    )}

                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.cycleUnknown}
                        onChange={(e) => set('cycleUnknown', e.target.checked)}
                        className={checkboxClass}
                      />
                      <span className="text-sm text-calm-muted">
                        Ich bin mir nicht sicher / Zyklus unregelmäßig
                      </span>
                    </label>
                  </div>
                </>
              )}

              {/* ── Step 3: Wearable ── */}
              {step === 3 && (
                <>
                  <h2 className="text-xl font-bold text-calm-text mb-2">Wearable verbinden</h2>
                  <p className="text-sm text-calm-muted mb-6">
                    Verbinde dein Wearable für tiefere Einblicke in HRV, Schlaf und Aktivität.
                    Du kannst diesen Schritt auch überspringen.
                  </p>

                  <div className="space-y-3">
                    {WEARABLES.map((w) => (
                      <button
                        key={w.id}
                        onClick={() => set('wearable', form.wearable === w.id ? null : w.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                          form.wearable === w.id
                            ? 'border-[#6F7CFF] bg-[#EEF0FF]'
                            : 'border-gray-100 hover:border-gray-200 bg-white'
                        }`}
                      >
                        <span className="text-2xl">{w.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-calm-text">{w.name}</p>
                          <p className="text-xs text-calm-muted">{w.desc}</p>
                        </div>
                        {form.wearable === w.id && (
                          <div className="w-6 h-6 rounded-full bg-[#6F7CFF] flex items-center justify-center flex-shrink-0">
                            <Check size={14} className="text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  <p className="text-xs text-calm-muted mt-4 text-center">
                    Du kannst jederzeit in den Einstellungen weitere Geräte verbinden.
                  </p>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Footer */}
          <div className="px-8 py-4 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center gap-1 text-sm text-calm-muted hover:text-calm-text transition-colors"
            >
              <ChevronLeft size={16} />
              Zurück
            </button>
            <Button
              variant="primary"
              onClick={handleNext}
              loading={loading}
              rightIcon={step < STEP_LABELS.length - 1 ? <ChevronRight size={16} /> : undefined}
            >
              {step === STEP_LABELS.length - 1 ? 'Konto erstellen' : 'Weiter'}
            </Button>
          </div>
        </div>

        <p className="text-center text-sm text-calm-muted mt-6">
          Bereits ein Konto?{' '}
          <Link to="/login" className="text-[#6F7CFF] font-medium hover:underline">
            Anmelden
          </Link>
        </p>
      </div>
    </div>
  );
}

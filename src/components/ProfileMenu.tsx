import { useState, useRef, useEffect } from 'react';
import { X, Camera, Play, LogOut, Check, Pill, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '../store/userStore';
import { useMedicationStore } from '../store/medicationStore';
import { Avatar } from './ui/Avatar';
import { Button } from './ui/Button';

interface ProfileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function ProfileMenu({ open, onClose }: ProfileMenuProps) {
  const navigate = useNavigate();
  const { profile, authState, updateProfile, enterDemo, switchToAccount, logout } =
    useUserStore();
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [saved, setSaved] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync fields when profile or open state changes
  useEffect(() => {
    setName(profile.name);
    setEmail(profile.email);
    setSaved(false);
  }, [profile.name, profile.email, open]);

  // Click outside to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, onClose]);

  const handleSave = () => {
    updateProfile({ name, email });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateProfile({ avatar: ev.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleDemoToggle = () => {
    if (authState === 'demo') {
      switchToAccount();
    } else {
      enterDemo();
    }
    onClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/welcome');
    onClose();
  };

  const hasAccount = !!localStorage.getItem('mycicle-account');
  const canEdit = authState === 'authenticated';
  const hasChanges = name !== profile.name || email !== profile.email;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
          transition={{ duration: 0.15 }}
          className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-800">
            <span className="text-sm font-semibold text-calm-text dark:text-gray-100">
              Profil
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"
            >
              <X size={14} />
            </button>
          </div>

          <div className="px-5 py-4 space-y-4">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar name={profile.name} src={profile.avatar} size="lg" />
                {canEdit && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#6F7CFF] text-white flex items-center justify-center shadow-sm hover:bg-[#5A68E8] transition-colors"
                  >
                    <Camera size={12} />
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-calm-text dark:text-gray-100 truncate">
                  {profile.name}
                </p>
                <p className="text-xs text-calm-muted truncate">{profile.email}</p>
              </div>
            </div>

            {/* Editable fields (only for authenticated users) */}
            {canEdit && (
              <>
                <div>
                  <label className="block text-xs font-medium text-calm-muted mb-1">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6F7CFF]/30 focus:border-[#6F7CFF] bg-white dark:bg-gray-800 text-calm-text dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-calm-muted mb-1">E-Mail</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6F7CFF]/30 focus:border-[#6F7CFF] bg-white dark:bg-gray-800 text-calm-text dark:text-gray-100"
                  />
                </div>
                <Button
                  variant={saved ? 'ghost' : 'primary'}
                  size="sm"
                  onClick={handleSave}
                  leftIcon={saved ? <Check size={14} /> : undefined}
                  disabled={!hasChanges && !saved}
                  className="w-full"
                >
                  {saved ? 'Gespeichert!' : 'Speichern'}
                </Button>
              </>
            )}
          </div>

          {/* Medication settings */}
          <MedicationSettings />

          {/* Actions */}
          <div className="border-t border-gray-100 dark:border-gray-800 px-5 py-3 space-y-1">
            {authState === 'authenticated' && (
              <button
                onClick={handleDemoToggle}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-calm-muted hover:bg-[#EEF0FF] hover:text-[#6F7CFF] transition-colors text-left"
              >
                <Play size={14} />
                Demo-Modus testen
              </button>
            )}
            {authState === 'demo' && hasAccount && (
              <button
                onClick={handleDemoToggle}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-calm-muted hover:bg-[#EEF0FF] hover:text-[#6F7CFF] transition-colors text-left"
              >
                <Play size={14} />
                Zurück zu meinem Account
              </button>
            )}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-calm-muted hover:bg-red-50 hover:text-red-600 transition-colors text-left"
            >
              <LogOut size={14} />
              Abmelden
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Medication settings section ─── */
function MedicationSettings() {
  const { medications, addMedication, removeMedication, toggleMedication } =
    useMedicationStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDosage, setNewDosage] = useState('');
  const [newFreq, setNewFreq] = useState<'daily' | 'as-needed'>('daily');

  const handleAdd = () => {
    if (!newName.trim()) return;
    addMedication({
      name: newName.trim(),
      dosage: newDosage.trim() || '–',
      frequency: newFreq,
      active: true,
    });
    setNewName('');
    setNewDosage('');
    setShowAdd(false);
  };

  return (
    <div className="border-t border-gray-100 dark:border-gray-800 px-5 py-3">
      <div className="flex items-center justify-between mb-2">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-calm-muted">
          <Pill size={12} />
          Medikamente
        </span>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-[#6F7CFF] transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>

      {medications.length === 0 && !showAdd && (
        <p className="text-xs text-gray-400">Keine Medikamente eingerichtet</p>
      )}

      <div className="space-y-1">
        {medications.map((med) => (
          <div
            key={med.id}
            className="flex items-center gap-2 py-1.5 group"
          >
            <button
              onClick={() => toggleMedication(med.id)}
              className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                med.active
                  ? 'bg-[#7CC8B5] text-white'
                  : 'border border-gray-300 dark:border-gray-600'
              }`}
            >
              {med.active && <Check size={10} />}
            </button>
            <div className="flex-1 min-w-0">
              <p className={`text-xs truncate ${med.active ? 'text-calm-text dark:text-gray-200' : 'text-gray-400 line-through'}`}>
                {med.name}
              </p>
              <p className="text-[10px] text-gray-400">
                {med.dosage} · {med.frequency === 'daily' ? 'Täglich' : 'Bei Bedarf'}
              </p>
            </div>
            <button
              onClick={() => removeMedication(med.id)}
              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 text-gray-300 hover:text-red-500 transition-all"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="mt-2 space-y-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Name (z.B. Pille, Eisen)"
            className="w-full border border-gray-200 dark:border-gray-700 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#6F7CFF] bg-white dark:bg-gray-900 text-calm-text dark:text-gray-100"
          />
          <div className="flex gap-2">
            <input
              type="text"
              value={newDosage}
              onChange={(e) => setNewDosage(e.target.value)}
              placeholder="Dosis"
              className="flex-1 border border-gray-200 dark:border-gray-700 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#6F7CFF] bg-white dark:bg-gray-900 text-calm-text dark:text-gray-100"
            />
            <select
              value={newFreq}
              onChange={(e) => setNewFreq(e.target.value as 'daily' | 'as-needed')}
              className="border border-gray-200 dark:border-gray-700 rounded px-2 py-1.5 text-xs bg-white dark:bg-gray-900 text-calm-text dark:text-gray-100"
            >
              <option value="daily">Täglich</option>
              <option value="as-needed">Bei Bedarf</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAdd(false)}
              className="flex-1 py-1.5 rounded text-xs text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Abbrechen
            </button>
            <button
              onClick={handleAdd}
              disabled={!newName.trim()}
              className="flex-1 py-1.5 rounded text-xs font-medium text-white bg-[#6F7CFF] hover:bg-[#5A68E8] disabled:opacity-40 transition-colors"
            >
              Hinzufügen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

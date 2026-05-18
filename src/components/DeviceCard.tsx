import { useState } from 'react';
import { Watch, RefreshCw, Check } from 'lucide-react';
import { Badge } from './ui/Badge';
import { motion } from 'framer-motion';

interface Device {
  id: string;
  name: string;
  connected: boolean;
  lastSync: string;
}

interface DeviceCardProps {
  device: Device;
}

function formatSyncTime(isoStr: string): string {
  if (!isoStr) return 'Nie synchronisiert';
  const d = new Date(isoStr);
  return d.toLocaleString('de-DE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export function DeviceCard({ device }: DeviceCardProps) {
  const [syncing, setSyncing] = useState(false);
  const [justSynced, setJustSynced] = useState(false);

  const handleSync = () => {
    if (!device.connected || syncing) return;
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setJustSynced(true);
      setTimeout(() => setJustSynced(false), 2000);
    }, 2000);
  };

  return (
    <div className={`bg-white rounded-xl border shadow-sm p-5 ${device.connected ? 'border-gray-100' : 'border-gray-100 opacity-70'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${device.connected ? 'bg-teal-100 text-teal-600' : 'bg-gray-100 text-gray-400'}`}>
            <Watch size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{device.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {device.connected ? `Sync: ${formatSyncTime(device.lastSync)}` : 'Nicht verbunden'}
            </p>
          </div>
        </div>
        <Badge color={device.connected ? 'green' : 'slate'} size="sm">
          {device.connected ? 'Verbunden' : 'Getrennt'}
        </Badge>
      </div>

      {device.connected && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {justSynced ? (
              <Check size={14} className="text-green-500" />
            ) : (
              <motion.div
                animate={syncing ? { rotate: 360 } : { rotate: 0 }}
                transition={syncing ? { duration: 0.8, repeat: Infinity, ease: 'linear' } : {}}
              >
                <RefreshCw size={14} />
              </motion.div>
            )}
            {justSynced ? 'Synchronisiert!' : syncing ? 'Synchronisiere...' : 'Synchronisieren'}
          </button>
        </div>
      )}

      {!device.connected && (
        <div className="mt-4">
          <button className="w-full py-2 text-sm text-gray-500 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Gerät verbinden
          </button>
        </div>
      )}
    </div>
  );
}

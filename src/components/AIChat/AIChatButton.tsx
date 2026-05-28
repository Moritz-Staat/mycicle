import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

export function AIChatButton() {
  const { chatOpen, setChatOpen } = useUIStore();

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setChatOpen(!chatOpen)}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#6F7CFF] text-white shadow-lg flex items-center justify-center hover:bg-[#5A68E8] transition-colors"
      aria-label="KI-Chat öffnen"
    >
      <MessageCircle size={24} />
    </motion.button>
  );
}

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { chatConversations, fallbackResponse, quickReplies } from '../../data/mock/chatData';
import { ChatMessage } from './ChatMessage';
import { QuickReplies } from './QuickReplies';

function findResponse(input: string): string {
  const lower = input.toLowerCase();
  const match = chatConversations.find((c) => c.triggers.some((t) => lower.includes(t)));
  return match ? match.aiResponse : fallbackResponse;
}

export function AIChatDrawer() {
  const { chatOpen, setChatOpen, chatHistory, addChatMessage } = useUIStore();
  const [input, setInput] = useState('');
  const [lastAiIdx, setLastAiIdx] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    addChatMessage('user', text.trim());
    setInput('');
    setTimeout(() => {
      const response = findResponse(text);
      const newIdx = chatHistory.length + 1;
      addChatMessage('ai', response);
      setLastAiIdx(newIdx);
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <AnimatePresence>
      {chatOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={() => setChatOpen(false)}
          />
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-screen w-96 bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#EEF0FF] flex items-center justify-center">
                  <Sparkles size={16} className="text-[#6F7CFF]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">mycycle KI</p>
                  <p className="text-xs text-green-500">Online</p>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {chatHistory.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-[#EEF0FF] flex items-center justify-center mx-auto mb-3">
                    <Sparkles size={22} className="text-[#6F7CFF]" />
                  </div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Hallo Sarah!</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Ich bin deine KI-Assistentin. Frag mich alles über deinen Zyklus.</p>
                </div>
              )}
              {chatHistory.map((msg, idx) => (
                <ChatMessage
                  key={msg.id}
                  role={msg.role}
                  text={msg.text}
                  animate={msg.role === 'ai' && idx === lastAiIdx}
                />
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Quick replies */}
            {chatHistory.length === 0 && (
              <div className="px-4 pb-2 flex-shrink-0">
                <QuickReplies replies={quickReplies} onSelect={sendMessage} />
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 flex-shrink-0">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Frag mich etwas..."
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:border-[#6F7CFF] transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="p-2 rounded-lg bg-[#6F7CFF] text-white hover:bg-[#5A68E8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

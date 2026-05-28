import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'ai';
  text: string;
  animate?: boolean;
}

export function ChatMessage({ role, text, animate = false }: ChatMessageProps) {
  const [displayedText, setDisplayedText] = useState(animate ? '' : text);
  const [isTyping, setIsTyping] = useState(animate);

  useEffect(() => {
    if (!animate) {
      setDisplayedText(text);
      return;
    }
    setDisplayedText('');
    setIsTyping(true);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 15);
    return () => clearInterval(interval);
  }, [text, animate]);

  if (role === 'user') {
    return (
      <div className="flex justify-end mb-3">
        <div className="max-w-[80%] px-4 py-2.5 bg-[#6F7CFF] text-white rounded-l-2xl rounded-tr-2xl text-sm leading-relaxed">
          {text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2 mb-3">
      <div className="w-7 h-7 rounded-full bg-[#EEF0FF] flex items-center justify-center flex-shrink-0 mt-0.5">
        <Sparkles size={14} className="text-[#6F7CFF]" />
      </div>
      <div className="max-w-[85%] px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-r-2xl rounded-tl-2xl text-sm leading-relaxed whitespace-pre-line">
        {isTyping && displayedText.length === 0 ? (
          <span className="flex items-center gap-1 text-gray-400">
            mycycle schreibt
            <span className="flex gap-0.5 ml-1">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          </span>
        ) : (
          <>
            {displayedText}
            {isTyping && <span className="animate-pulse">|</span>}
          </>
        )}
      </div>
    </div>
  );
}

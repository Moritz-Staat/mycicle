interface QuickRepliesProps {
  replies: string[];
  onSelect: (reply: string) => void;
}

export function QuickReplies({ replies, onSelect }: QuickRepliesProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {replies.map((reply) => (
        <button
          key={reply}
          onClick={() => onSelect(reply)}
          className="flex-shrink-0 px-3 py-1.5 rounded-full border border-rose-200 text-rose-600 text-xs font-medium hover:bg-rose-50 transition-colors whitespace-nowrap"
        >
          {reply}
        </button>
      ))}
    </div>
  );
}

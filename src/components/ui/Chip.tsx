
import { X } from 'lucide-react';

interface ChipProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  className?: string;
  disabled?: boolean;
}

export function Chip({ children, active = false, onClick, onRemove, className = '', disabled = false }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
        transition-all duration-200 cursor-pointer border
        disabled:opacity-50 disabled:cursor-not-allowed
        ${active
          ? 'bg-rose-600 text-white border-rose-600'
          : 'bg-white text-gray-600 border-gray-200 hover:border-rose-300 hover:text-rose-600'
        }
        ${className}
      `}
    >
      {children}
      {onRemove && (
        <span
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="hover:opacity-70 transition-opacity"
        >
          <X size={12} />
        </span>
      )}
    </button>
  );
}

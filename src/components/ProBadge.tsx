import { Crown } from 'lucide-react';

interface ProBadgeProps {
  size?: 'sm' | 'md';
}

export function ProBadge({ size = 'sm' }: ProBadgeProps) {
  const iconSize = size === 'sm' ? 12 : 14;
  const cls =
    size === 'sm'
      ? 'px-1.5 py-0.5 text-[10px] gap-0.5'
      : 'px-2 py-0.5 text-xs gap-1';

  return (
    <span
      className={`inline-flex items-center rounded-full font-bold text-white ${cls}`}
      style={{ background: 'linear-gradient(135deg, #6F7CFF 0%, #B391C8 100%)' }}
    >
      <Crown size={iconSize} />
      Pro
    </span>
  );
}

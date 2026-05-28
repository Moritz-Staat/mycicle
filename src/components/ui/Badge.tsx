

type BadgeColor = 'rose' | 'purple' | 'teal' | 'amber' | 'slate' | 'green' | 'red';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  color?: BadgeColor;
  size?: BadgeSize;
  children: React.ReactNode;
  className?: string;
}

const colorClasses: Record<BadgeColor, string> = {
  rose: 'bg-[#EEF0FF] text-[#6F7CFF] border border-[#C5CAFF]',
  purple: 'bg-[#F3EEF8] text-[#B391C8] border border-[#D9C9E8]',
  teal: 'bg-[#EBF8F4] text-[#5AA898] border border-[#B3DFCF]',
  amber: 'bg-amber-50 text-amber-700 border border-amber-200',
  slate: 'bg-[#F3F2F5] text-[#68627A] border border-[#E0DDE5]',
  green: 'bg-green-50 text-green-700 border border-green-200',
  red: 'bg-red-50 text-red-600 border border-red-200',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
};

export function Badge({ color = 'slate', size = 'sm', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full font-medium
        ${colorClasses[color]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

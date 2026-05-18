

type BadgeColor = 'rose' | 'purple' | 'teal' | 'amber' | 'slate' | 'green' | 'red';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  color?: BadgeColor;
  size?: BadgeSize;
  children: React.ReactNode;
  className?: string;
}

const colorClasses: Record<BadgeColor, string> = {
  rose: 'bg-rose-100 text-rose-700 border border-rose-200',
  purple: 'bg-purple-100 text-purple-700 border border-purple-200',
  teal: 'bg-teal-100 text-teal-700 border border-teal-200',
  amber: 'bg-amber-100 text-amber-700 border border-amber-200',
  slate: 'bg-slate-100 text-slate-700 border border-slate-200',
  green: 'bg-green-100 text-green-700 border border-green-200',
  red: 'bg-red-100 text-red-700 border border-red-200',
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

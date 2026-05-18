

interface AvatarProps {
  name?: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getColor(name: string): string {
  const colors = [
    'bg-rose-400',
    'bg-purple-400',
    'bg-teal-400',
    'bg-amber-400',
    'bg-blue-400',
    'bg-pink-400',
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export function Avatar({ name = '', src, size = 'md', className = '' }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`rounded-full object-cover flex-shrink-0 ${sizeClasses[size]} ${className}`}
      />
    );
  }

  return (
    <div
      className={`
        rounded-full flex items-center justify-center flex-shrink-0
        text-white font-semibold
        ${getColor(name || 'User')}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {getInitials(name || 'U')}
    </div>
  );
}

interface AvatarGroupProps {
  users: Array<{ name: string; src?: string }>;
  max?: number;
  size?: AvatarProps['size'];
}

export function AvatarGroup({ users, max = 3, size = 'sm' }: AvatarGroupProps) {
  const visible = users.slice(0, max);
  const remaining = users.length - max;

  return (
    <div className="flex -space-x-2">
      {visible.map((user, i) => (
        <div key={i} className="ring-2 ring-white rounded-full">
          <Avatar name={user.name} src={user.src} size={size} />
        </div>
      ))}
      {remaining > 0 && (
        <div
          className={`
            rounded-full flex items-center justify-center ring-2 ring-white
            bg-gray-200 text-gray-600 font-semibold text-xs
            ${sizeClasses[size]}
          `}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}

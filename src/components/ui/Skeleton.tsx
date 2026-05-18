

interface SkeletonProps {
  variant?: 'text' | 'circle' | 'rect';
  width?: string | number;
  height?: string | number;
  className?: string;
  lines?: number;
}

export function Skeleton({ variant = 'rect', width, height, className = '', lines = 1 }: SkeletonProps) {
  const baseClass = 'animate-pulse bg-gray-200 rounded';

  if (variant === 'text') {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`${baseClass} h-4`}
            style={{
              width: i === lines - 1 && lines > 1 ? '60%' : width || '100%',
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'circle') {
    const size = width || height || 40;
    return (
      <div
        className={`${baseClass} rounded-full ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={`${baseClass} ${className}`}
      style={{ width: width || '100%', height: height || 100 }}
    />
  );
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white rounded-xl p-5 shadow-sm border border-gray-100 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <Skeleton variant="circle" width={40} />
        <Skeleton variant="text" width={120} />
      </div>
      <Skeleton variant="rect" height={80} className="mb-3" />
      <Skeleton variant="text" lines={2} />
    </div>
  );
}

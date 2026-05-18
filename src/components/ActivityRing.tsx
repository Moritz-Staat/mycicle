import { motion } from 'framer-motion';

interface Ring {
  value: number; // 0-100
  max: number;
  color: string;
  label: string;
  unit: string;
}

interface ActivityRingProps {
  rings: Ring[];
  size?: number;
}

const STROKE_WIDTH = 12;
const GAP = 6;

export function ActivityRing({ rings, size = 160 }: ActivityRingProps) {
  const center = size / 2;

  return (
    <div className="flex items-center gap-6">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          {rings.map((ring, i) => {
            const radius = center - STROKE_WIDTH / 2 - i * (STROKE_WIDTH + GAP);
            const circumference = 2 * Math.PI * radius;
            const progress = Math.min(ring.value / ring.max, 1);
            const dashoffset = circumference * (1 - progress);

            return (
              <g key={i}>
                {/* Background track */}
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={ring.color}
                  strokeWidth={STROKE_WIDTH}
                  opacity={0.15}
                />
                {/* Progress arc */}
                <motion.circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={ring.color}
                  strokeWidth={STROKE_WIDTH}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: dashoffset }}
                  transition={{ duration: 1.2, delay: i * 0.2, ease: 'easeOut' }}
                  transform={`rotate(-90 ${center} ${center})`}
                />
              </g>
            );
          })}
        </svg>
      </div>
      <div className="flex flex-col gap-3">
        {rings.map((ring, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ring.color }} />
            <div>
              <p className="text-xs text-gray-500">{ring.label}</p>
              <p className="text-sm font-semibold text-gray-900">
                {ring.value.toLocaleString('de-DE')} <span className="text-xs font-normal text-gray-400">{ring.unit}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

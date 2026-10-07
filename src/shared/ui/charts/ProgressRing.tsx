import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';
import { BrandGradientStops, useSvgId } from './svg';

interface ProgressRingProps {
  /** Доля заполнения от 0 до 1. */
  value: number;
  size?: number;
  strokeWidth?: number;
  children?: ReactNode;
  className?: string;
}

export const ProgressRing = ({ value, size = 128, strokeWidth = 12, children, className }: ProgressRingProps) => {
  const gradientId = useSvgId();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(value, 0), 1);

  return (
    <div className={cn('relative grid shrink-0 place-items-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0 -rotate-90" aria-hidden>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <BrandGradientStops />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={strokeWidth} className="stroke-surface-strong" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          className="transition-[stroke-dashoffset] duration-700"
        />
      </svg>
      <div className="relative text-center">{children}</div>
    </div>
  );
};

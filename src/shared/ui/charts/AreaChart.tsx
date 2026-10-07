import { cn } from '@/shared/lib/cn';
import { useSvgId } from './svg';

const WIDTH = 100;
const HEIGHT = 40;
const PADDING = 4;

interface Point {
  x: number;
  y: number;
}

const toPoints = (values: number[]): Point[] => {
  const min = Math.min(...values);
  const range = Math.max(...values) - min;
  return values.map((value, index) => ({
    x: values.length > 1 ? (index / (values.length - 1)) * WIDTH : WIDTH,
    y: range > 0 ? HEIGHT - PADDING - ((value - min) / range) * (HEIGHT - PADDING * 2) : HEIGHT / 2,
  }));
};

/** Сглаженная линия: контрольные точки кривых лежат посередине между соседними точками. */
const toSmoothPath = (points: Point[]): string =>
  points.reduce((path, point, index) => {
    if (index === 0) return `M${point.x},${point.y}`;
    const previous = points[index - 1];
    const middleX = (previous.x + point.x) / 2;
    return `${path} C${middleX},${previous.y} ${middleX},${point.y} ${point.x},${point.y}`;
  }, '');

interface AreaChartProps {
  values: number[];
  /** Цвет линии и заливки задаётся через `text-*`. */
  className?: string;
}

export const AreaChart = ({ values, className }: AreaChartProps) => {
  const gradientId = useSvgId();
  if (values.length === 0) return null;

  const points = toPoints(values);
  const line = toSmoothPath(points);
  const last = points[points.length - 1];

  return (
    <div className={cn('relative', className)} aria-hidden>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none" className="block h-full w-full overflow-visible">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="currentColor" stopOpacity="0.35" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${line} L${WIDTH},${HEIGHT} L0,${HEIGHT} Z`} fill={`url(#${gradientId})`} />
        <path d={line} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>
      <span
        className="absolute size-3 -translate-1/2 rounded-full bg-current ring-4 ring-current/30"
        style={{ left: `${(last.x / WIDTH) * 100}%`, top: `${(last.y / HEIGHT) * 100}%` }}
      />
    </div>
  );
};

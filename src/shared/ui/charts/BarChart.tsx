import { cn } from '@/shared/lib/cn';

export interface BarChartSeries {
  label: string;
  className: string;
}

export interface BarChartItem {
  label: string;
  /** Значения в порядке `series`. */
  values: number[];
}

interface BarChartProps {
  series: BarChartSeries[];
  items: BarChartItem[];
}

export const BarChart = ({ series, items }: BarChartProps) => {
  const max = Math.max(...items.flatMap((item) => item.values), 0);

  return (
    <div>
      <div className="flex h-40 items-stretch justify-between gap-2" aria-hidden>
        {items.map((item) => (
          <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex flex-1 items-stretch gap-1">
              {series.map((serie, index) => (
                <div key={serie.label} className="relative w-2.5 overflow-hidden rounded-full bg-surface-strong">
                  <div
                    className={cn('absolute inset-x-0 bottom-0 rounded-full transition-[height] duration-700', serie.className)}
                    style={{ height: `${max > 0 ? (item.values[index] / max) * 100 : 0}%` }}
                  />
                </div>
              ))}
            </div>
            <span className="text-xs text-muted">{item.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-center gap-5 text-sm text-fg-soft">
        {series.map((serie) => (
          <span key={serie.label} className="flex items-center gap-2">
            <span className={cn('size-2.5 rounded-full', serie.className)} />
            {serie.label}
          </span>
        ))}
      </div>
    </div>
  );
};

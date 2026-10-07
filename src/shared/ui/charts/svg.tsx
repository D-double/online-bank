import { useId } from 'react';

/** Идентификатор, пригодный для ссылок вида `url(#id)` внутри SVG. */
export const useSvgId = (): string => useId().replace(/[^\w-]/g, '');

export const BrandGradientStops = () => (
  <>
    <stop offset="0" style={{ stopColor: 'var(--color-gradient-from)' }} />
    <stop offset="0.5" style={{ stopColor: 'var(--color-gradient-via)' }} />
    <stop offset="1" style={{ stopColor: 'var(--color-gradient-to)' }} />
  </>
);

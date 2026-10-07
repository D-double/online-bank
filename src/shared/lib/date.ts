const DAY_MS = 24 * 60 * 60 * 1000;

export const startOfDay = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const daysAgo = (days: number, from = new Date()): Date =>
  new Date(startOfDay(from).getTime() - days * DAY_MS);

export const isSameDay = (a: Date, b: Date): boolean =>
  startOfDay(a).getTime() === startOfDay(b).getTime();

const pad = (value: number): string => String(value).padStart(2, '0');

export const formatTime = (iso: string): string => {
  const date = new Date(iso);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

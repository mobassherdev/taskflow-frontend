import { format, formatDistanceToNow, isPast, isToday, isTomorrow } from 'date-fns';

export function formatDate(date: string | Date, fmt = 'MMM d, yyyy') {
  return format(new Date(date), fmt);
}

export function relativeTime(date: string | Date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function deadlineLabel(date?: string | null) {
  if (!date) return null;
  const d = new Date(date);
  if (isPast(d)) return { label: 'Overdue', variant: 'danger' as const };
  if (isToday(d)) return { label: 'Due today', variant: 'warning' as const };
  if (isTomorrow(d)) return { label: 'Due tomorrow', variant: 'warning' as const };
  return { label: formatDate(d), variant: 'default' as const };
}

export function bytesToHuman(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
}

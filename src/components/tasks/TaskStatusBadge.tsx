import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/cn';
import type { TaskStatus } from '@/types/task.types';

const config: Record<TaskStatus, { label: string; className: string }> = {
  TODO: {
    label: 'To do',
    className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  },
  IN_PROGRESS: {
    label: 'In progress',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  },
  COMPLETED: {
    label: 'Completed',
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  },
};

export default function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const { label, className } = config[status];
  return (
    <Badge variant="secondary" className={cn('font-medium', className)}>
      {label}
    </Badge>
  );
}

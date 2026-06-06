import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/cn';
import type { ProjectStatus } from '@/types/project.types';

const config: Record<ProjectStatus, { label: string; className: string }> = {
  ACTIVE: {
    label: 'Active',
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  },
  COMPLETED: {
    label: 'Completed',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  },
  ON_HOLD: {
    label: 'On Hold',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  },
};

export default function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const { label, className } = config[status];
  return (
    <Badge variant="secondary" className={cn('font-medium', className)}>
      {label}
    </Badge>
  );
}

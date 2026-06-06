import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/cn';
import type { TaskPriority } from '@/types/task.types';
import { ArrowUp, Minus, ArrowDown } from 'lucide-react';

const config: Record<TaskPriority, {
  label: string;
  className: string;
  icon: React.ElementType;
}> = {
  HIGH: {
    label: 'High',
    className: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
    icon: ArrowUp,
  },
  MEDIUM: {
    label: 'Medium',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
    icon: Minus,
  },
  LOW: {
    label: 'Low',
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    icon: ArrowDown,
  },
};

export default function TaskPriorityBadge({ priority }: { priority: TaskPriority }) {
  const { label, className, icon: Icon } = config[priority];
  return (
    <Badge variant="secondary" className={cn('gap-1 font-medium', className)}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}

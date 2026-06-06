import { cn } from '@/utils/cn';

interface WorkloadBarProps {
  completed: number;
  total: number;
  className?: string;
}

export default function WorkloadBar({ completed, total, className }: WorkloadBarProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{completed} completed</span>
        <span>{total} total</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

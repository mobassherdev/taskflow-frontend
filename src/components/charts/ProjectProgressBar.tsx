'use client';
import { useProjectProgress } from '@/hooks/useAnalytics';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProjectProgressBar({ projectId }: { projectId: string }) {
  const { data, isLoading } = useProjectProgress(projectId);

  if (isLoading) {
    return <Skeleton className="h-4 w-full" />;
  }

  if (!data) return null;

  const percentage = data.percentage;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span>Progress</span>
        <span>{percentage}%</span>
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

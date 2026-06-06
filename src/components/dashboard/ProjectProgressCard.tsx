'use client';
import { useProjectProgress } from '@/hooks/useAnalytics';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProjectProgressCard({ projectId }: { projectId: string }) {
  const { data, isLoading } = useProjectProgress(projectId);

  if (isLoading) {
    return <Skeleton className="h-20 w-full" />;
  }

  if (!data) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Progress</span>
        <span className="text-muted-foreground">{data.percentage}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${data.percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{data.completed} completed</span>
        <span>{data.inProgress} in progress</span>
        <span>{data.todo} to do</span>
      </div>
    </div>
  );
}

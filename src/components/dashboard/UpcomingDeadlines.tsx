'use client';
import { useDashboard } from '@/hooks/useAnalytics';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/formatters';

export default function UpcomingDeadlines() {
  const { data, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  const tasks = data?.recentActivities?.filter((a: any) => a.entityType === 'Task') ?? [];

  return (
    <ScrollArea className="h-80">
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">No upcoming deadlines</p>
        ) : (
          tasks.map((task: any) => (
            <div key={task.id} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">{task.entityName}</p>
                <p className="text-xs text-muted-foreground">{task.description}</p>
              </div>
              <Badge variant="outline" className="text-xs">
                {formatDate(task.createdAt)}
              </Badge>
            </div>
          ))
        )}
      </div>
    </ScrollArea>
  );
}

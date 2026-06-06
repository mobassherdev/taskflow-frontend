'use client';
import { useDashboard } from '@/hooks/useAnalytics';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

export default function TeamWorkloadTable() {
  const { data, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-2 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const workload = data?.workloadSummary ?? [];

  return (
    <div className="space-y-4">
      {workload.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-8">No workload data</p>
      ) : (
        workload.map((entry: any) => {
          const percentage = entry.total > 0 ? Math.round((entry.completed / entry.total) * 100) : 0;
          return (
            <div key={entry.user?.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={entry.user?.avatar} />
                    <AvatarFallback className="text-xs">
                      {entry.user?.name?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{entry.user?.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {entry.completed}/{entry.total} tasks
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

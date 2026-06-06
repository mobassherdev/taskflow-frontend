'use client';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { activityApi } from '@/lib/api/activity.api';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import type { ActivityLog } from '@/types/api.types';

const actionIcons: Record<string, string> = {
  PROJECT_CREATED: '📁',
  PROJECT_UPDATED: '✏️',
  TASK_CREATED: '➕',
  TASK_STATUS_CHANGED: '✅',
  TASK_DELETED: '🗑️',
  MEMBER_ADDED: '👤',
  COMMENT_ADDED: '💬',
};

export default function RecentActivity() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.activities.recent,
    queryFn: () => activityApi.getRecent().then(r => r.data.data),
    refetchInterval: 30_000,
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <ScrollArea className="h-80">
      <div className="space-y-4">
        {(data as ActivityLog[] | undefined)?.map(activity => (
          <div key={activity.id} className="flex items-start gap-3">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src={activity.actor.avatar} />
              <AvatarFallback className="text-xs">
                {activity.actor.name[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-0.5">
              <p className="text-sm">
                <span className="mr-1">{actionIcons[activity.action] ?? '🔔'}</span>
                {activity.description}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

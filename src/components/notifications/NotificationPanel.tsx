'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useNotifications, useUnreadCount, useMarkNotificationRead, useMarkAllNotificationsRead } from '@/hooks/useNotifications';
import type { Notification } from '@/lib/api/notifications.api';
import { relativeTime } from '@/utils/formatters';
import { Bell, Check, CheckCheck, MessageSquare, UserPlus, FileText } from 'lucide-react';

const typeIcons: Record<string, typeof Bell> = {
  TASK_ASSIGNED: UserPlus,
  TASK_STATUS_CHANGED: Check,
  COMMENT_ADDED: MessageSquare,
  MEMBER_ADDED: UserPlus,
  PROJECT_CREATED: FileText,
};

export default function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const { data: unreadData } = useUnreadCount();
  const { data: notifData } = useNotifications(1, 20);
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const unreadCount = unreadData?.count ?? 0;
  const notifications: Notification[] = notifData?.data ?? [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground"
        >
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 size-2 bg-destructive rounded-full" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h4 className="font-semibold text-sm">Notifications</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-auto p-0"
              onClick={() => markAllRead.mutate()}
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notif) => {
                const Icon = typeIcons[notif.type] || Bell;
                return (
                  <button
                    key={notif.id}
                    className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors ${
                      !notif.read ? 'bg-primary/5' : ''
                    }`}
                    onClick={() => {
                      if (!notif.read) markRead.mutate(notif.id);
                    }}
                  >
                    <div className="flex gap-3">
                      <div className="mt-0.5">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">{notif.title}</p>
                          {!notif.read && (
                            <span className="size-1.5 bg-primary rounded-full shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {notif.message}
                        </p>
                        <p className="text-[0.625rem] text-muted-foreground mt-1">
                          {relativeTime(notif.createdAt)}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

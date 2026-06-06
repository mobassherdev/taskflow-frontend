'use client';
import { Card, CardContent } from '@/components/ui/card';
import TaskStatusBadge from './TaskStatusBadge';
import TaskPriorityBadge from './TaskPriorityBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDate } from '@/utils/formatters';
import type { Task } from '@/types/task.types';
import { Calendar, MessageSquare, Paperclip } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-medium line-clamp-2">{task.title}</h4>
            <TaskPriorityBadge priority={task.priority} />
          </div>

          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
          )}

          <div className="flex items-center justify-between">
            <TaskStatusBadge status={task.status} />
            {task.dueDate && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {formatDate(task.dueDate)}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            {task.assignee ? (
              <Avatar className="h-6 w-6">
                <AvatarImage src={task.assignee.avatar} />
                <AvatarFallback className="text-xs">
                  {task.assignee.name[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ) : (
              <span className="text-xs text-muted-foreground">Unassigned</span>
            )}

            <div className="flex items-center gap-2 text-muted-foreground">
              {task._count?.comments ? (
                <div className="flex items-center gap-1 text-xs">
                  <MessageSquare className="h-3 w-3" />
                  {task._count.comments}
                </div>
              ) : null}
              {task._count?.attachments ? (
                <div className="flex items-center gap-1 text-xs">
                  <Paperclip className="h-3 w-3" />
                  {task._count.attachments}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

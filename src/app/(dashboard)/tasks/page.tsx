'use client';
import PageHeader from '@/components/shared/PageHeader';
import TaskDetailSheet from '@/components/tasks/TaskDetailSheet';
import TaskFiltersBar from '@/components/tasks/TaskFilters';
import TaskPriorityBadge from '@/components/tasks/TaskPriorityBadge';
import TaskStatusBadge from '@/components/tasks/TaskStatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useMyTasks } from '@/hooks/useTasks';
import { Task, TaskFilters } from '@/types/task.types';
import { formatDate } from '@/utils/formatters';
import { Calendar, FolderKanban, MessageSquare, Paperclip } from 'lucide-react';
import { useState } from 'react';


export default function TasksPage() {
  const [filters, setFilters] = useState<TaskFilters>({});
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { data, isLoading } = useMyTasks(filters);

  const tasks: Task[] = data?.data ?? [];

  return (
    <div className="lg:space-y-6 md:space-y-5 space-y-4 lg:p-2 md:p-1 p-0">
      <PageHeader
        title="My Tasks"
        description="View and manage all your assigned tasks"
      />

      <TaskFiltersBar filters={filters} onChange={setFilters} />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="rounded-md border p-8 text-center text-muted-foreground">
          No tasks found
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onClick={() => setSelectedTask(task)}
            />
          ))}
        </div>
      )}

      {selectedTask && (
        <TaskDetailSheet
          task={selectedTask}
          open={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          projectId={selectedTask.projectId}
        />
      )}
    </div>
  );
}

function TaskRow({ task, onClick }: { task: Task; onClick: () => void }) {
  return (
    <Card className="cursor-pointer hover:shadow-sm transition-shadow" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-medium text-sm">{task.title}</h3>
              <TaskStatusBadge status={task.status} />
              <TaskPriorityBadge priority={task.priority} />
            </div>
            {task.description && (
              <p className="text-xs text-muted-foreground line-clamp-1">{task.description}</p>
            )}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <FolderKanban className="h-3 w-3" />
                <span>{(task as any).project?.name ?? 'Unknown project'}</span>
              </div>
              {task.dueDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(task.dueDate)}</span>
                </div>
              )}
              {task._count?.comments ? (
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>{task._count.comments}</span>
                </div>
              ) : null}
              {task._count?.attachments ? (
                <div className="flex items-center gap-1">
                  <Paperclip className="h-3 w-3" />
                  <span>{task._count.attachments}</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

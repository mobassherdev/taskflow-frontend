'use client';
import { useTasks } from '@/hooks/useTasks';
import type { TaskStatus, Task } from '@/types/task.types';
import TaskCard from './TaskCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/utils/cn';

const COLUMNS: { status: TaskStatus; label: string; color: string }[] = [
  { status: 'TODO', label: 'To do', color: 'border-t-slate-400' },
  { status: 'IN_PROGRESS', label: 'In progress', color: 'border-t-blue-500' },
  { status: 'COMPLETED', label: 'Completed', color: 'border-t-emerald-500' },
];

interface TaskKanbanProps {
  projectId: string;
  onTaskClick?: (task: Task) => void;
}

export default function TaskKanban({ projectId, onTaskClick }: TaskKanbanProps) {
  const { data } = useTasks(projectId);
  const tasks: Task[] = data?.data ?? [];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {COLUMNS.map(col => {
        const colTasks = tasks.filter(t => t.status === col.status);
        return (
          <div
            key={col.status}
            className={cn(
              'flex flex-col rounded-xl border-t-4 bg-muted/30 p-4',
              col.color,
            )}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold">{col.label}</h3>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-medium">
                {colTasks.length}
              </span>
            </div>
            <ScrollArea className="flex-1">
              <div className="space-y-3">
                {colTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() => onTaskClick?.(task)}
                  />
                ))}
                {colTasks.length === 0 && (
                  <p className="py-8 text-center text-xs text-muted-foreground">
                    No tasks here
                  </p>
                )}
              </div>
            </ScrollArea>
          </div>
        );
      })}
    </div>
  );
}

'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import ProjectForm from '@/components/projects/ProjectForm';
import ProjectStatusBadge from '@/components/projects/ProjectStatusBadge';
import TaskCard from '@/components/tasks/TaskCard';
import TaskForm from '@/components/tasks/TaskForm';
import TaskDetailSheet from '@/components/tasks/TaskDetailSheet';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import DeleteConfirmModal from '@/components/shared/DeleteConfirmModal';
import { useProject, useUpdateProject, useDeleteProject } from '@/hooks/useProjects';
import { useTasks, useCreateTask } from '@/hooks/useTasks';
import { useUser } from '@/store/hooks';
import { formatDate, deadlineLabel } from '@/utils/formatters';
import { Calendar, Users, CheckSquare, Plus, ArrowLeft, Pencil, Trash2, Loader2 } from 'lucide-react';
import type { Task } from '@/types/task.types';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const currentUser = useUser();

  const { data: project, isLoading: projectLoading } = useProject(id);
  const { data: tasksData, isLoading: tasksLoading } = useTasks(id);
  const updateProject = useUpdateProject(id);
  const deleteProject = useDeleteProject();
  const createTask = useCreateTask(id);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const canManage =
    currentUser?.role === 'ADMIN' ||
    currentUser?.role === 'PROJECT_MANAGER' ||
    project?.ownerId === currentUser?.id;

  if (projectLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6">
        <EmptyState
          title="Project not found"
          description="This project may have been deleted."
          action={{ label: 'Back to Projects', onClick: () => router.push('/projects') }}
        />
      </div>
    );
  }

  const tasks = tasksData?.data ?? [];
  const deadline = deadlineLabel(project.deadline);

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title={project.name}
        description={project.description ?? 'No description'}
        action={
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => router.push('/projects')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            {canManage && (
              <>
                <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => setDeleteOpen(true)}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="tasks">
            <TabsList>
              <TabsTrigger value="tasks">
                <CheckSquare className="h-4 w-4 mr-1" />
                Tasks ({tasks.length})
              </TabsTrigger>
              <TabsTrigger value="members">
                <Users className="h-4 w-4 mr-1" />
                Members ({project.members?.length ?? 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tasks" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Tasks</h3>
                {canManage && (
                  <Button size="sm" onClick={() => setTaskFormOpen(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Task
                  </Button>
                )}
              </div>

              {tasksLoading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : tasks.length === 0 ? (
                <EmptyState
                  title="No tasks yet"
                  description="Create the first task for this project"
                  action={canManage ? { label: 'Add Task', onClick: () => setTaskFormOpen(true) } : undefined}
                />
              ) : (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onClick={() => setSelectedTask(task)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="members" className="space-y-4">
              <h3 className="text-lg font-semibold">Members</h3>
              {project.members && project.members.length > 0 ? (
                <div className="space-y-3">
                  {project.members.map((member) => (
                    <div key={member.id} className="flex items-center gap-3 rounded-lg border p-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={member.user.avatar} />
                        <AvatarFallback>
                          {member.user.name[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{member.user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{member.user.email}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {member.user.role.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState title="No members" description="Add members to this project" />
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Status</p>
                <ProjectStatusBadge status={project.status} />
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Owner</p>
                <div className="flex items-center gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={project.owner.avatar} />
                    <AvatarFallback className="text-xs">
                      {project.owner.name[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{project.owner.name}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Deadline</p>
                {project.deadline ? (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{formatDate(project.deadline)}</span>
                    {deadline && (
                      <Badge
                        variant={deadline.variant === 'danger' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {deadline.label}
                      </Badge>
                    )}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">No deadline</span>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Tasks</p>
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{project._count?.tasks ?? 0} tasks</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Created</p>
                <span className="text-sm">{formatDate(project.createdAt)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ProjectForm
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initialData={{
          name: project.name,
          description: project.description ?? undefined,
          deadline: project.deadline,
          status: project.status,
        }}
        onSubmit={async (data) => {
          await updateProject.mutateAsync(data);
          setEditOpen(false);
        }}
        isLoading={updateProject.isPending}
        showStatus={canManage}
      />

      <TaskForm
        open={taskFormOpen}
        onClose={() => setTaskFormOpen(false)}
        onSubmit={async (data) => {
          await createTask.mutateAsync(data);
          setTaskFormOpen(false);
        }}
        isLoading={createTask.isPending}
        members={project.members?.map(m => m.user) ?? []}
      />

      <DeleteConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={async () => {
          await deleteProject.mutateAsync(id);
          router.push('/projects');
        }}
        title="Delete Project"
        description="Are you sure you want to delete this project? This will also delete all tasks."
        isLoading={deleteProject.isPending}
      />

      <TaskDetailSheet
        task={selectedTask}
        open={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        projectId={id}
        members={project?.members?.map(m => m.user) ?? []}
      />
    </div>
  );
}

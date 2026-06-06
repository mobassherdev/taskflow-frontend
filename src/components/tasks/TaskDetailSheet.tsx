'use client';
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppSelector } from '@/store/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import TaskStatusBadge from './TaskStatusBadge';
import TaskPriorityBadge from './TaskPriorityBadge';
import { formatDate, relativeTime } from '@/utils/formatters';
import { useAddComment, useUpdateTask, useDeleteTask } from '@/hooks/useTasks';
import { tasksApi } from '@/lib/api/tasks.api';
import DeleteConfirmModal from '@/components/shared/DeleteConfirmModal';
import type { Task, TaskStatus, TaskPriority } from '@/types/task.types';
import { toast } from 'sonner';
import {
  MessageSquare,
  Paperclip,
  Calendar,
  User,
  Pencil,
  Trash2,
  Upload,
  X,
  Save,
  ChevronDown,
} from 'lucide-react';

interface TaskDetailSheetProps {
  task: Task | null;
  open: boolean;
  onClose: () => void;
  projectId: string;
  members?: { id: string; name: string; email: string; avatar?: string }[];
}

const editSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().max(2000).optional(),
});

export default function TaskDetailSheet({ task, open, onClose, projectId, members = [] }: TaskDetailSheetProps) {
  const [comment, setComment] = useState('');
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAppSelector((s) => s.auth);
  const canManage = user?.role === 'ADMIN' || user?.role === 'PROJECT_MANAGER';

  const addComment = useAddComment(projectId, task?.id ?? '');
  const updateTask = useUpdateTask(projectId, task?.id ?? '');
  const deleteTask = useDeleteTask(projectId);

  const handleAddComment = async () => {
    if (!comment.trim() || !task) return;
    await addComment.mutateAsync(comment);
    setComment('');
  };

  const handleStatusChange = async (status: TaskStatus) => {
    if (!task) return;
    await updateTask.mutateAsync({ status });
  };

  const handlePriorityChange = async (priority: TaskPriority) => {
    if (!task) return;
    await updateTask.mutateAsync({ priority });
  };

  const handleAssigneeChange = async (assigneeId: string | undefined) => {
    if (!task) return;
    await updateTask.mutateAsync({ assigneeId: assigneeId || undefined });
  };

  const startEditing = () => {
    if (!task) return;
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditing(true);
  };

  const saveEdit = async () => {
    if (!task) return;
    await updateTask.mutateAsync({
      title: editTitle,
      description: editDescription || undefined,
    });
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!task) return;
    await deleteTask.mutateAsync(task.id);
    onClose();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !task) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      await tasksApi.uploadAttachment(projectId, task.id, formData);
      toast.success('File uploaded successfully');
      // Refresh task data
    } catch {
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (!task) return null;

  return (
    <>
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              {editing ? (
                <div className="space-y-2">
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="font-semibold"
                  />
                  <Textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Description"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={saveEdit} disabled={editTitle.length < 2}>
                      <Save className="h-3 w-3 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <SheetTitle className="flex items-center gap-2">
                    {task.title}
                    {canManage && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={startEditing}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                    )}
                    {canManage && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive hover:text-destructive"
                        onClick={() => setDeleteOpen(true)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </SheetTitle>
                  <SheetDescription>
                    Created by {task.creator.name} · {relativeTime(task.createdAt)}
                  </SheetDescription>
                </>
              )}
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="mt-6 h-[calc(100vh-200px)]">
          <div className="space-y-6">
            {/* Status and Priority */}
            <div className="flex items-center gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Status</Label>
                <Select value={task.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-[140px] h-8">
                    <SelectValue>
                      <TaskStatusBadge status={task.status} />
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODO">
                      <TaskStatusBadge status="TODO" />
                    </SelectItem>
                    <SelectItem value="IN_PROGRESS">
                      <TaskStatusBadge status="IN_PROGRESS" />
                    </SelectItem>
                    <SelectItem value="COMPLETED">
                      <TaskStatusBadge status="COMPLETED" />
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {canManage && (
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Priority</Label>
                  <Select value={task.priority} onValueChange={handlePriorityChange}>
                    <SelectTrigger className="w-[120px] h-8">
                      <SelectValue>
                        <TaskPriorityBadge priority={task.priority} />
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HIGH">
                        <TaskPriorityBadge priority="HIGH" />
                      </SelectItem>
                      <SelectItem value="MEDIUM">
                        <TaskPriorityBadge priority="MEDIUM" />
                      </SelectItem>
                      <SelectItem value="LOW">
                        <TaskPriorityBadge priority="LOW" />
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Description */}
            {task.description && !editing && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Description</h4>
                <p className="text-sm text-muted-foreground">{task.description}</p>
              </div>
            )}

            {/* Details */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Details</h4>
              <div className="grid grid-cols-2 gap-3">
                {canManage && members.length > 0 && (
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Assignee</Label>
                    <Select
                      value={task.assigneeId ?? 'unassigned'}
                      onValueChange={(v) => handleAssigneeChange(v === 'unassigned' ? undefined : v)}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue>
                          {task.assignee ? (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={task.assignee.avatar} />
                                <AvatarFallback className="text-[10px]">
                                  {task.assignee.name[0].toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs">{task.assignee.name}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">Unassigned</span>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {members.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={m.avatar} />
                                <AvatarFallback className="text-[10px]">
                                  {m.name[0].toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span>{m.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {!canManage && task.assignee && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{task.assignee.name}</span>
                  </div>
                )}
                {task.dueDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{formatDate(task.dueDate)}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Attachments */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Attachments</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <Upload className="h-3 w-3 mr-1" />
                  {uploading ? 'Uploading...' : 'Upload'}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept="image/*,.pdf,.doc,.docx,.txt"
                />
              </div>
              {task.attachments && task.attachments.length > 0 ? (
                <div className="space-y-2">
                  {task.attachments.map((att) => (
                    <div key={att.id} className="flex items-center gap-2 text-sm p-2 rounded bg-muted/50">
                      <Paperclip className="h-3 w-3 text-muted-foreground" />
                      <a
                        href={att.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 truncate hover:underline"
                      >
                        {att.filename}
                      </a>
                      <span className="text-xs text-muted-foreground">
                        {(att.size / 1024).toFixed(1)}KB
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No attachments</p>
              )}
            </div>

            <Separator />

            {/* Comments */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Comments</h4>
              <div className="space-y-3">
                {task.comments?.map((c) => (
                  <div key={c.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={c.author.avatar} />
                      <AvatarFallback className="text-xs">
                        {c.author.name[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{c.author.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {relativeTime(c.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{c.body}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <Button
                  size="sm"
                  onClick={handleAddComment}
                  disabled={!comment.trim()}
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>

    <DeleteConfirmModal
      open={deleteOpen}
      onClose={() => setDeleteOpen(false)}
      onConfirm={handleDelete}
      title="Delete Task"
      description="Are you sure you want to delete this task? This action cannot be undone."
      isLoading={deleteTask.isPending}
    />
    </>
  );
}

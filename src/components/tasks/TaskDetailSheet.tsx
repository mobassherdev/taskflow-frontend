'use client';
import DeleteConfirmModal from '@/components/shared/DeleteConfirmModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea, ScrollArea as ScrollAreaInner } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { useAddComment, useDeleteTask, useUpdateTask } from '@/hooks/useTasks';
import { queryKeys } from '@/lib/query/keys';
import { tasksApi } from '@/lib/api/tasks.api';
import { useAppSelector } from '@/store/hooks';
import type { Task, TaskPriority, TaskStatus } from '@/types/task.types';
import { formatDate, relativeTime } from '@/utils/formatters';
import {
  Calendar,
  Check,
  ChevronDown,
  Paperclip,
  Pencil,
  Save,
  Search,
  Trash2,
  Upload,
  User
} from 'lucide-react';
import { useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import TaskPriorityBadge from './TaskPriorityBadge';
import TaskStatusBadge from './TaskStatusBadge';

interface TaskDetailSheetProps {
  task: Task | null;
  open: boolean;
  onClose: () => void;
  projectId: string;
  members?: { id: string; name: string; email: string; avatar?: string }[];
}


export default function TaskDetailSheet({ task, open, onClose, projectId, members = [] }: TaskDetailSheetProps) {
  const qc = useQueryClient();
  const [assigneeSearch, setAssigneeSearch] = useState('');
  const [assigneePickerOpen, setAssigneePickerOpen] = useState(false);

  const filteredAssigneeMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(assigneeSearch.toLowerCase()) ||
      m.email.toLowerCase().includes(assigneeSearch.toLowerCase()),
  );

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
      qc.invalidateQueries({ queryKey: queryKeys.tasks.detail(projectId, task.id) });
      toast.success('File uploaded successfully');
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
                      {/* Searchable assignee picker */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setAssigneePickerOpen((v) => !v)}
                          className="flex items-center justify-between w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-8"
                        >
                          {task.assignee ? (
                            <div className="flex items-center gap-1.5">
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
                          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                        </button>

                        {assigneePickerOpen && (
                          <div className="absolute z-50 mt-1 w-56 rounded-md border bg-popover shadow-md">
                            <div className="p-1.5 border-b">
                              <div className="relative">
                                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                                <input
                                  placeholder="Search…"
                                  value={assigneeSearch}
                                  onChange={(e) => setAssigneeSearch(e.target.value)}
                                  className="w-full pl-6 pr-2 py-1 text-xs rounded border-0 bg-transparent outline-none focus:ring-0 placeholder:text-muted-foreground"
                                  autoFocus
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                            </div>
                            <ScrollAreaInner className="max-h-40">
                              <div className="p-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleAssigneeChange(undefined);
                                    setAssigneePickerOpen(false);
                                    setAssigneeSearch('');
                                  }}
                                  className={`flex items-center gap-2 w-full rounded px-2 py-1.5 text-xs text-left hover:bg-muted ${!task.assigneeId ? 'bg-muted/60' : ''
                                    }`}
                                >
                                  <span className="text-muted-foreground flex-1">Unassigned</span>
                                  {!task.assigneeId && <Check className="h-3 w-3 text-primary" />}
                                </button>
                                {filteredAssigneeMembers.length === 0 ? (
                                  <p className="text-xs text-center text-muted-foreground py-2">No members found</p>
                                ) : (
                                  filteredAssigneeMembers.map((m) => (
                                    <button
                                      key={m.id}
                                      type="button"
                                      onClick={() => {
                                        handleAssigneeChange(m.id);
                                        setAssigneePickerOpen(false);
                                        setAssigneeSearch('');
                                      }}
                                      className={`flex items-center gap-2 w-full rounded px-2 py-1.5 text-xs text-left hover:bg-muted ${task.assigneeId === m.id ? 'bg-muted/60' : ''
                                        }`}
                                    >
                                      <Avatar className="h-5 w-5 shrink-0">
                                        <AvatarImage src={m.avatar} />
                                        <AvatarFallback className="text-[8px]">
                                          {m.name[0].toUpperCase()}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1 min-w-0">
                                        <p className="truncate">{m.name}</p>
                                      </div>
                                      {task.assigneeId === m.id && (
                                        <Check className="h-3 w-3 text-primary shrink-0" />
                                      )}
                                    </button>
                                  ))
                                )}
                              </div>
                            </ScrollAreaInner>
                          </div>
                        )}
                      </div>
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

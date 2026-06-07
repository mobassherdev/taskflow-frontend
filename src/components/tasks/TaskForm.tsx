'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { CreateTaskPayload, TaskPriority, TaskStatus } from '@/types/task.types';
import { Search, Check, ChevronDown } from 'lucide-react';

const schema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional(),
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW']).default('MEDIUM'),
  status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']).default('TODO'),
  dueDate: z.string().optional(),
  assigneeId: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskPayload) => void;
  initialData?: Partial<CreateTaskPayload>;
  isLoading?: boolean;
  members?: { id: string; name: string; email: string; avatar?: string }[];
}

export default function TaskForm({ open, onClose, onSubmit, initialData, isLoading, members = [] }: TaskFormProps) {
  const [assigneeSearch, setAssigneeSearch] = useState('');
  const [assigneeOpen, setAssigneeOpen] = useState(false);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialData?.title ?? '',
      description: initialData?.description ?? '',
      priority: initialData?.priority ?? 'MEDIUM',
      status: initialData?.status ?? 'TODO',
      dueDate: initialData?.dueDate?.split('T')[0] ?? '',
      assigneeId: initialData?.assigneeId ?? '',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        title: initialData?.title ?? '',
        description: initialData?.description ?? '',
        priority: initialData?.priority ?? 'MEDIUM',
        status: initialData?.status ?? 'TODO',
        dueDate: initialData?.dueDate?.split('T')[0] ?? '',
        assigneeId: initialData?.assigneeId ?? '',
      });
    }
  }, [open, initialData, reset]);

  const assigneeId = watch('assigneeId');
  const selectedMember = members.find((m) => m.id === assigneeId);

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(assigneeSearch.toLowerCase()) ||
      m.email.toLowerCase().includes(assigneeSearch.toLowerCase()),
  );

  const handleFormSubmit = (values: FormValues) => {
    onSubmit({
      ...values,
      dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : undefined,
    });
    reset();
    setAssigneeSearch('');
  };

  const handleClose = () => {
    reset();
    setAssigneeSearch('');
    setAssigneeOpen(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Task' : 'Create Task'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Update the task details below.' : 'Add a new task to the project.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Task title" {...register('title')} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Optional description" {...register('description')} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={watch('priority')} onValueChange={(v) => setValue('priority', v as TaskPriority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={watch('status')} onValueChange={(v) => setValue('status', v as TaskStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODO">To do</SelectItem>
                  <SelectItem value="IN_PROGRESS">In progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input id="dueDate" type="date" {...register('dueDate')} />
          </div>

          {members.length > 0 && (
            <div className="space-y-2">
              <Label>Assignee</Label>
              {/* Custom searchable assignee picker */}
              <div className="relative">
                <button
                  type="button"
                  id="assignee-trigger"
                  onClick={() => setAssigneeOpen((v) => !v)}
                  className="flex items-center justify-between w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {selectedMember ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={selectedMember.avatar} />
                        <AvatarFallback className="text-[10px]">
                          {selectedMember.name[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span>{selectedMember.name}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Unassigned</span>
                  )}
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>

                {assigneeOpen && (
                  <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
                    {/* Search field inside dropdown */}
                    <div className="p-2 border-b">
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                          id="assignee-search"
                          placeholder="Search members…"
                          value={assigneeSearch}
                          onChange={(e) => setAssigneeSearch(e.target.value)}
                          className="pl-7 h-8 text-sm"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    <ScrollArea className="max-h-48">
                      <div className="p-1">
                        {/* Unassigned option */}
                        <button
                          type="button"
                          onClick={() => {
                            setValue('assigneeId', undefined);
                            setAssigneeOpen(false);
                            setAssigneeSearch('');
                          }}
                          className={`flex items-center gap-2 w-full rounded px-3 py-2 text-sm text-left hover:bg-muted ${
                            !assigneeId ? 'bg-muted/60' : ''
                          }`}
                        >
                          <span className="text-muted-foreground">Unassigned</span>
                          {!assigneeId && <Check className="h-3.5 w-3.5 ml-auto text-primary" />}
                        </button>

                        {filteredMembers.length === 0 ? (
                          <p className="text-xs text-center text-muted-foreground py-3">No members found</p>
                        ) : (
                          filteredMembers.map((m) => (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => {
                                setValue('assigneeId', m.id);
                                setAssigneeOpen(false);
                                setAssigneeSearch('');
                              }}
                              className={`flex items-center gap-2 w-full rounded px-3 py-2 text-sm text-left hover:bg-muted ${
                                assigneeId === m.id ? 'bg-muted/60' : ''
                              }`}
                            >
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={m.avatar} />
                                <AvatarFallback className="text-[10px]">
                                  {m.name[0].toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="truncate">{m.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{m.email}</p>
                              </div>
                              {assigneeId === m.id && (
                                <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                              )}
                            </button>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : initialData ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

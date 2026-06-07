'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { CreateProjectPayload, ProjectStatus } from '@/types/project.types';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  deadline: z.string().optional(),
  status: z.enum(['ACTIVE', 'COMPLETED', 'ON_HOLD']).default('ACTIVE'),
});

type FormValues = z.infer<typeof schema>;

interface ProjectFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProjectPayload) => void;
  initialData?: Partial<CreateProjectPayload>;
  isLoading?: boolean;
  showStatus?: boolean;
}

export default function ProjectForm({ open, onClose, onSubmit, initialData, isLoading, showStatus = true }: ProjectFormProps) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData?.name ?? '',
      description: initialData?.description ?? '',
      deadline: initialData?.deadline?.split('T')[0] ?? '',
      status: initialData?.status ?? 'ACTIVE',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: initialData?.name ?? '',
        description: initialData?.description ?? '',
        deadline: initialData?.deadline?.split('T')[0] ?? '',
        status: initialData?.status ?? 'ACTIVE',
      });
    }
  }, [open, initialData, reset]);

  const handleFormSubmit = (values: FormValues) => {
    onSubmit({
      ...values,
      deadline: values.deadline ? new Date(values.deadline).toISOString() : undefined,
    });
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Project' : 'Create Project'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Update the project details below.' : 'Start a new project for your team.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Project name" {...register('name')} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Optional description" {...register('description')} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {showStatus && (
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={watch('status')} onValueChange={(v) => setValue('status', v as ProjectStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="ON_HOLD">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input id="deadline" type="date" {...register('deadline')} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : initialData ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

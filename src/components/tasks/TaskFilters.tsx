'use client';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import type { TaskFilters, TaskStatus, TaskPriority } from '@/types/task.types';

interface TaskFiltersProps {
  filters: TaskFilters;
  onChange: (filters: Partial<TaskFilters>) => void;
}

export default function TaskFiltersBar({ filters, onChange }: TaskFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          className="pl-9"
          value={filters.search ?? ''}
          onChange={e => onChange({ search: e.target.value || undefined })}
        />
      </div>

      <Select
        value={filters.status ?? 'all'}
        onValueChange={v => onChange({ status: v === 'all' ? undefined : v as TaskStatus })}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="TODO">To do</SelectItem>
          <SelectItem value="IN_PROGRESS">In progress</SelectItem>
          <SelectItem value="COMPLETED">Completed</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.priority ?? 'all'}
        onValueChange={v => onChange({ priority: v === 'all' ? undefined : v as TaskPriority })}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priority</SelectItem>
          <SelectItem value="HIGH">High</SelectItem>
          <SelectItem value="MEDIUM">Medium</SelectItem>
          <SelectItem value="LOW">Low</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.deadlineStatus ?? 'all'}
        onValueChange={v => onChange({ deadlineStatus: v === 'all' ? undefined : v as 'upcoming' | 'overdue' })}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Deadline" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Deadlines</SelectItem>
          <SelectItem value="upcoming">Upcoming</SelectItem>
          <SelectItem value="overdue">Overdue</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

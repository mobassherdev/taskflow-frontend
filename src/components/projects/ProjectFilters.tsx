'use client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import type { ProjectFilters, ProjectStatus } from '@/types/project.types';

interface ProjectFiltersProps {
  filters: ProjectFilters;
  onChange: (filters: Partial<ProjectFilters>) => void;
}

export default function ProjectFiltersBar({ filters, onChange }: ProjectFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          className="pl-9"
          value={filters.search ?? ''}
          onChange={e => onChange({ search: e.target.value || undefined })}
        />
      </div>

      <Select
        value={filters.status ?? 'all'}
        onValueChange={v => onChange({ status: v === 'all' ? undefined : v as ProjectStatus })}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="ACTIVE">Active</SelectItem>
          <SelectItem value="COMPLETED">Completed</SelectItem>
          <SelectItem value="ON_HOLD">On Hold</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.sortBy ?? 'createdAt'}
        onValueChange={v => onChange({ sortBy: v as any })}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="createdAt">Created</SelectItem>
          <SelectItem value="name">Name</SelectItem>
          <SelectItem value="deadline">Deadline</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

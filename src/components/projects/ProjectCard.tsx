'use client';
import DeleteConfirmModal from '@/components/shared/DeleteConfirmModal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/store/hooks';
import type { Project } from '@/types/project.types';
import { formatDate } from '@/utils/formatters';
import { Calendar, CheckSquare, Pencil, Trash2, Users } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  COMPLETED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  ON_HOLD: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
};

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (id: string) => void;
}

export default function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const currentUser = useUser();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const canManage =
    currentUser?.role === 'ADMIN' ||
    currentUser?.role === 'PROJECT_MANAGER' ||
    project.ownerId === currentUser?.id;

  return (
    <Card className="transition-shadow hover:shadow-md h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/projects/${project.id}`} className="flex-1 min-w-0">
            <CardTitle className="text-base line-clamp-1 hover:text-primary transition-colors cursor-pointer">
              {project.name}
            </CardTitle>
          </Link>
          <div className="flex items-center gap-1">
            <Badge variant="secondary" className={statusColors[project.status]}>
              {project.status}
            </Badge>
            {canManage && (
              <div className="flex items-center gap-0.5 ml-1">
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={(e) => {
                      e.preventDefault();
                      onEdit(project);
                    }}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={(e) => {
                      e.preventDefault();
                      setDeleteOpen(true);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Link href={`/projects/${project.id}`}>
          {project.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 cursor-pointer hover:text-foreground transition-colors mb-3">
              {project.description}
            </p>
          )}
        </Link>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <CheckSquare className="h-4 w-4" />
            <span>{project._count?.tasks ?? 0} tasks</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{project._count?.members ?? 0} members</span>
          </div>
          {project.deadline && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(project.deadline)}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={project.owner.avatar} />
            <AvatarFallback className="text-xs">
              {project.owner.name[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">{project.owner.name}</span>
        </div>
      </CardContent>

      <DeleteConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => {
          onDelete?.(project.id);
          setDeleteOpen(false);
        }}
        title="Delete Project"
        description="Are you sure you want to delete this project? This will also delete all tasks."
      />
    </Card>
  );
}

'use client';
import ProjectCard from '@/components/projects/ProjectCard';
import ProjectFiltersBar from '@/components/projects/ProjectFilters';
import ProjectForm from '@/components/projects/ProjectForm';
import DeleteConfirmModal from '@/components/shared/DeleteConfirmModal';
import EmptyState from '@/components/shared/EmptyState';
import PageHeader from '@/components/shared/PageHeader';
import Pagination from '@/components/shared/Pagination';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCreateProject, useDeleteProject, useProjects, useUpdateProject } from '@/hooks/useProjects';
import { useAppSelector } from '@/store/hooks';
import type { Project, ProjectFilters } from '@/types/project.types';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function ProjectsPage() {
  const [filters, setFilters] = useState<ProjectFilters>({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [formOpen, setFormOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
  const { user } = useAppSelector((s) => s.auth);
  const { data, isLoading } = useProjects({ ...filters, page, limit });
  const createProject = useCreateProject();
  const updateProject = useUpdateProject(editProject?.id ?? '');
  const deleteProject = useDeleteProject();

  const canManage = user?.role === 'ADMIN' || user?.role === 'PROJECT_MANAGER';
  const canChangeStatus = canManage;

  return (
    <div className="lg:space-y-6 md:space-y-5 space-y-4 lg:p-2 md:p-1 p-0">
      <PageHeader
        title="Projects"
        description="Manage your team's projects"
        action={
          canManage ? (
            <Button onClick={() => setFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          ) : undefined
        }
      />

      <ProjectFiltersBar filters={filters} onChange={(f) => { setFilters(f); setPage(1); }} />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[200px]" />
          ))}
        </div>
      ) : data?.data?.length === 0 ? (
        <EmptyState
          title="No projects"
          description="Get started by creating your first project"
          action={
            canManage
              ? { label: 'Create Project', onClick: () => setFormOpen(true) }
              : undefined
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data?.data?.map((project: any) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={(p) => setEditProject(p)}
                onDelete={(id) => setDeleteProjectId(id)}
              />
            ))}
          </div>
          {data?.pagination && data.pagination.totalPages > 1 && (
            <Pagination
              pagination={data.pagination}
              onPageChange={setPage}
              onPageSizeChange={(v) => { setLimit(v); setPage(1); }}
            />
          )}
        </>
      )}

      <ProjectForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={async (data) => {
          await createProject.mutateAsync(data);
          setFormOpen(false);
        }}
        isLoading={createProject.isPending}
        showStatus={canChangeStatus}
      />

      <ProjectForm
        open={!!editProject}
        onClose={() => setEditProject(null)}
        initialData={
          editProject
            ? {
              name: editProject.name,
              description: editProject.description,
              deadline: editProject.deadline,
              status: editProject.status,
            }
            : undefined
        }
        onSubmit={async (data) => {
          await updateProject.mutateAsync(data);
          setEditProject(null);
        }}
        isLoading={updateProject.isPending}
        showStatus={canChangeStatus}
      />

      <DeleteConfirmModal
        open={!!deleteProjectId}
        onClose={() => setDeleteProjectId(null)}
        onConfirm={() => {
          if (deleteProjectId) {
            deleteProject.mutate(deleteProjectId);
            setDeleteProjectId(null);
          }
        }}
        title="Delete Project"
        description="Are you sure you want to delete this project? This will also delete all tasks."
        isLoading={deleteProject.isPending}
      />
    </div>
  );
}

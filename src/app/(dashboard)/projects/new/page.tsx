'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import ProjectForm from '@/components/projects/ProjectForm';
import PageHeader from '@/components/shared/PageHeader';
import { useCreateProject } from '@/hooks/useProjects';
import { ArrowLeft } from 'lucide-react';

export default function NewProjectPage() {
  const router = useRouter();
  const createProject = useCreateProject();

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Create Project"
        description="Start a new project for your team"
        action={
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        }
      />

      <div className="mx-auto max-w-lg">
        <ProjectForm
          open={true}
          onClose={() => router.back()}
          onSubmit={async (data) => {
            await createProject.mutateAsync(data);
            router.push('/projects');
          }}
          isLoading={createProject.isPending}
        />
      </div>
    </div>
  );
}

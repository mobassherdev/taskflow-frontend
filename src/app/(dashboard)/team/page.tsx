'use client';
import PageHeader from '@/components/shared/PageHeader';
import Pagination from '@/components/shared/Pagination';
import DeleteConfirmModal from '@/components/shared/DeleteConfirmModal';
import MemberCard from '@/components/team/MemberCard';
import UserForm from '@/components/team/UserForm';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { usersApi } from '@/lib/api/users.api';
import { useAppSelector } from '@/store/hooks';
import type { PaginationMeta } from '@/types/api.types';
import type { User, Role } from '@/types/auth.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function TeamPage() {
  const qc = useQueryClient();
  const { user: currentUser } = useAppSelector((s) => s.auth);
  const isAdmin = currentUser?.role === 'ADMIN';

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['users', page, limit],
    queryFn: () => usersApi.getAll({ page, limit }).then(r => r.data.data),
  });

  const users: User[] = data?.users ?? [];
  const pagination: PaginationMeta | undefined = data?.pagination;

  const createUser = useMutation({
    mutationFn: (data: { name: string; email: string; password: string; role: string }) =>
      usersApi.create({ ...data, role: data.role as Role }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      setCreateOpen(false);
      toast.success('User created successfully');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Failed to create user');
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => usersApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      setDeleteUser(null);
      toast.success('User deleted successfully');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Failed to delete user');
    },
  });

  return (
    <div className="lg:space-y-6 md:space-y-5 space-y-4 lg:p-2 md:p-1 p-0">
      <PageHeader
        title="Team"
        description="View all team members"
        action={
          isAdmin ? (
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          ) : undefined
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[72px]" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-md border p-8 text-center text-muted-foreground">
          No team members found
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {users.map((u) => (
              <MemberCard
                key={u.id}
                user={u}
                showRemove={isAdmin && u.id !== currentUser?.id}
                onRemove={() => setDeleteUser(u)}
              />
            ))}
          </div>
          {pagination && pagination.totalPages > 1 && (
            <Pagination
              pagination={pagination}
              onPageChange={setPage}
              onPageSizeChange={(v) => { setLimit(v); setPage(1); }}
            />
          )}
        </>
      )}

      <UserForm
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={(data) => createUser.mutateAsync(data)}
        isLoading={createUser.isPending}
      />

      <DeleteConfirmModal
        open={!!deleteUser}
        onClose={() => setDeleteUser(null)}
        onConfirm={() => {
          if (deleteUser) deleteUserMutation.mutateAsync(deleteUser.id);
        }}
        title="Delete User"
        description={`Are you sure you want to delete ${deleteUser?.name ?? 'this user'}? This action cannot be undone.`}
        isLoading={deleteUserMutation.isPending}
      />
    </div>
  );
}

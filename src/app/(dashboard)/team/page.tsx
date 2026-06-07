'use client';
import PageHeader from '@/components/shared/PageHeader';
import Pagination from '@/components/shared/Pagination';
import MemberCard from '@/components/team/MemberCard';
import { Skeleton } from '@/components/ui/skeleton';
import { usersApi } from '@/lib/api/users.api';
import type { PaginationMeta } from '@/types/api.types';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export default function TeamPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);

  const { data, isLoading } = useQuery({
    queryKey: ['users', page, limit],
    queryFn: () => usersApi.getAll({ page, limit }).then(r => r.data.data),
  });

  const users = data?.users ?? [];
  const pagination: PaginationMeta | undefined = data?.pagination;

  return (
    <div className="lg:space-y-6 md:space-y-5 space-y-4 lg:p-2 md:p-1 p-0">
      <PageHeader
        title="Team"
        description="View all team members"
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
            {users.map((user: any) => (
              <MemberCard key={user.id} user={user} />
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
    </div>
  );
}

'use client';
import PageHeader from '@/components/shared/PageHeader';
import MemberCard from '@/components/team/MemberCard';
import { Skeleton } from '@/components/ui/skeleton';
import { usersApi } from '@/lib/api/users.api';
import { useQuery } from '@tanstack/react-query';

export default function TeamPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getAll().then(r => r.data.data.users),
  });

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
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data?.map((user: any) => (
            <MemberCard key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}

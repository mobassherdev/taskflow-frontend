'use client';
import { useDashboard } from '@/hooks/useAnalytics';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

export default function TeamProductivityChart() {
  const { data, isLoading } = useDashboard();

  if (isLoading) {
    return <Skeleton className="h-[200px] w-full" />;
  }

  const chartData = data?.workloadSummary?.map((entry: any) => ({
    name: entry.user?.name ?? 'Unknown',
    completed: entry.completed,
    pending: entry.pending,
  })) ?? [];

  if (chartData.length === 0) {
    return <p className="text-center text-sm text-muted-foreground py-8">No data</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" fontSize={12} />
        <YAxis fontSize={12} />
        <Tooltip />
        <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} />
        <Bar dataKey="pending" fill="#64748b" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

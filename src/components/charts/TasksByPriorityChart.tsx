'use client';
import { useDashboard } from '@/hooks/useAnalytics';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

const COLORS = ['#ef4444', '#f59e0b', '#10b981'];

export default function TasksByPriorityChart() {
  const { data, isLoading } = useDashboard();

  if (isLoading) {
    return <Skeleton className="h-[200px] w-full" />;
  }

  const chartData = data?.tasksByPriority?.map((item: any) => ({
    name: item.priority,
    value: item._count._all,
  })) ?? [];

  if (chartData.length === 0) {
    return <p className="text-center text-sm text-muted-foreground py-8">No data</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {chartData.map((_: any, index: number) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

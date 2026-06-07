'use client';
import TasksByPriorityChart from '@/components/charts/TasksByPriorityChart';
import TaskStatusDonutChart from '@/components/charts/TaskStatusDonutChart';
import KpiCard from '@/components/dashboard/KpiCard';
import RecentActivity from '@/components/dashboard/RecentActivity';
import TeamWorkloadTable from '@/components/dashboard/TeamWorkloadTable';
import UpcomingDeadlines from '@/components/dashboard/UpcomingDeadlines';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboard } from '@/hooks/useAnalytics';
import {
  AlertTriangle,
  CheckSquare, Clock,
  FolderKanban,
} from 'lucide-react';
import { Suspense } from 'react';

function DashboardKpis() {
  const { data, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-[100px]" />
        ))}
      </div>
    );
  }

  const kpis = data?.kpis;

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
      <KpiCard title="Projects" value={kpis?.totalProjects ?? 0} icon={FolderKanban} variant="default" />
      <KpiCard title="Total Tasks" value={kpis?.totalTasks ?? 0} icon={CheckSquare} variant="default" />
      <KpiCard title="Completed" value={kpis?.completedTasks ?? 0} icon={CheckSquare} variant="success" />
      <KpiCard title="Pending" value={kpis?.pendingTasks ?? 0} icon={Clock} variant="warning" />
      <KpiCard title="Overdue" value={kpis?.overdueTasks ?? 0} icon={AlertTriangle} variant="danger" />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="lg:space-y-6 md:space-y-5 space-y-4 lg:p-2 md:p-1 p-0">
      <PageHeader
        title="Dashboard"
        description="Welcome back — here's what's happening across your projects"
      />

      <Suspense fallback={<div className="grid grid-cols-2 gap-4 lg:grid-cols-5" />}>
        <DashboardKpis />
      </Suspense>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Tasks by priority</CardTitle>
          </CardHeader>
          <CardContent>
            <TasksByPriorityChart />
          </CardContent>
        </Card>
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Task status</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskStatusDonutChart />
          </CardContent>
        </Card>
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Recent activity</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Team workload</CardTitle>
          </CardHeader>
          <CardContent>
            <TeamWorkloadTable />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upcoming deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <UpcomingDeadlines />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

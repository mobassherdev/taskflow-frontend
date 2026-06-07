'use client';
import TasksByPriorityChart from '@/components/charts/TasksByPriorityChart';
import TaskStatusDonutChart from '@/components/charts/TaskStatusDonutChart';
import TeamProductivityChart from '@/components/charts/TeamProductivityChart';
import TeamWorkloadTable from '@/components/dashboard/TeamWorkloadTable';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AnalyticsPage() {
  return (
    <div className="lg:space-y-6 md:space-y-5 space-y-4 lg:p-2 md:p-1 p-0">
      <PageHeader
        title="Analytics"
        description="Track your team's performance and project progress"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tasks by Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <TasksByPriorityChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Task Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskStatusDonutChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Team Productivity</CardTitle>
          </CardHeader>
          <CardContent>
            <TeamProductivityChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Team Workload</CardTitle>
          </CardHeader>
          <CardContent>
            <TeamWorkloadTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

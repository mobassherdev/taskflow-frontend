'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageHeader from '@/components/shared/PageHeader';
import TasksByPriorityChart from '@/components/charts/TasksByPriorityChart';
import TaskStatusDonutChart from '@/components/charts/TaskStatusDonutChart';
import TeamProductivityChart from '@/components/charts/TeamProductivityChart';
import TeamWorkloadTable from '@/components/dashboard/TeamWorkloadTable';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 p-6">
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

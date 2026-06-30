import { BookOpen, CalendarDays, CheckSquare, Timer } from "lucide-react";

import { StatCard } from "@/components/common/stat-card";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const dashboardStats = [
  {
    label: "Study Hours",
    value: "8.5h",
    description: "Tracked this week",
    icon: Timer,
  },
  {
    label: "Active Plans",
    value: "3",
    description: "Currently in progress",
    icon: CalendarDays,
  },
  {
    label: "Completed Tasks",
    value: "12",
    description: "Finished this week",
    icon: CheckSquare,
  },
  {
    label: "Subjects",
    value: "5",
    description: "Learning categories",
    icon: BookOpen,
  },
];

import { requireUser } from "@/lib/auth-guard";

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <DashboardShell>
      <div>
        <p className="text-sm text-slate-500">Welcome back, {user.name}</p>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            description={stat.description}
          />
        ))}
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Study Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid h-72 grid-cols-7 items-end gap-3">
              {[40, 70, 50, 90, 65, 80, 55].map((height, index) => (
                <div
                  key={index}
                  className="rounded-full bg-gradient-to-t from-indigo-600 to-cyan-400"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Plans</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700">Next.js Fullstack</p>
                <p className="text-sm font-semibold text-slate-950">72%</p>
              </div>
              <Progress value={72} />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700">Django API Integration</p>
                <p className="text-sm font-semibold text-slate-950">48%</p>
              </div>
              <Progress value={48} />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700">Database Design</p>
                <p className="text-sm font-semibold text-slate-950">86%</p>
              </div>
              <Progress value={86} />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}

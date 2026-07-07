import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function DashboardPreviewCard() {
  return (
    <Card className="relative overflow-hidden p-5">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">This Week</p>
          <h2 className="text-2xl font-bold tracking-tight text-slate-950">Learning Overview</h2>
        </div>
        <Badge variant="success">On Track</Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-500">Study Hours</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950">8.5h</p>
          <p className="mt-1 text-sm text-slate-500">+2.1h from last week</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-500">Tasks Done</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950">12/18</p>
          <p className="mt-1 text-sm text-slate-500">66% completion rate</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-500">Study Streak</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950">4 days</p>
          <p className="mt-1 text-sm text-slate-500">Keep it going</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-500">Active Plans</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950">3</p>
          <p className="mt-1 text-sm text-slate-500">Currently in progress</p>
        </div>
      </div>

      <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium text-slate-700">Next.js Fullstack</p>
          <p className="text-sm font-semibold text-slate-950">72%</p>
        </div>
        <Progress value={72} />
      </div>

      <div className="mt-5 grid grid-cols-5 items-end gap-2 rounded-3xl border border-slate-200 bg-white p-5">
        {[35, 70, 45, 90, 60].map((height, index) => (
          <div
            key={index}
            className="rounded-full bg-gradient-to-t from-indigo-600 to-cyan-400"
            style={{ height: `${height}px` }}
          />
        ))}
      </div>
    </Card>
  );
}

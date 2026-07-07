import { BarChart3, BookOpen, CheckCircle2, TrendingUp } from "lucide-react";

import { SectionHeader } from "@/components/common/section-header";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const previewItems = [
  {
    title: "Study Hours This Week",
    value: "24.5h",
    trend: "+12%",
    icon: TrendingUp,
    color: "from-indigo-600 to-cyan-400",
  },
  {
    title: "Tasks Completed",
    value: "45/60",
    percentage: 75,
    icon: CheckCircle2,
  },
  {
    title: "Active Subjects",
    value: "4",
    description: "Next.js, Django, DB Design, English",
    icon: BookOpen,
  },
  {
    title: "Weekly Progress",
    value: "82%",
    percentage: 82,
    icon: BarChart3,
  },
];

export function AnalyticsPreviewSection() {
  return (
    <section id="analytics" className="border-t border-slate-200 bg-slate-50 py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Analytics"
          title="Understand your learning habits"
          description="Visualize your progress, track study hours, and see where your time goes."
          align="center"
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {previewItems.map((item) => {
            const Icon = item.icon;

            return (
              <Card key={item.title} className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  {"trend" in item && item.trend ? (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                      {item.trend}
                    </span>
                  ) : null}
                </div>

                <p className="text-2xl font-bold tracking-tight text-slate-950">{item.value}</p>
                <p className="mt-1 text-sm text-slate-500">{item.title}</p>

                {"percentage" in item && item.percentage !== undefined ? (
                  <div className="mt-4">
                    <Progress value={item.percentage} />
                  </div>
                ) : null}

                {"description" in item && item.description ? (
                  <p className="mt-2 text-sm text-slate-400">{item.description}</p>
                ) : null}
              </Card>
            );
          })}
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="p-6">
            <h3 className="text-lg font-semibold tracking-tight text-slate-950">
              Weekly Study Distribution
            </h3>
            <div className="mt-6 grid h-64 grid-cols-7 items-end gap-3">
              {[40, 70, 50, 90, 65, 80, 55].map((height, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div
                    className="w-full rounded-full bg-gradient-to-t from-indigo-600 to-cyan-400"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-slate-400">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold tracking-tight text-slate-950">
              Subject Breakdown
            </h3>
            <div className="mt-6 space-y-4">
              {[
                { name: "Next.js", hours: "12h", percentage: 48 },
                { name: "Django", hours: "6.5h", percentage: 26 },
                { name: "DB Design", hours: "4h", percentage: 16 },
                { name: "English", hours: "2h", percentage: 10 },
              ].map((subject) => (
                <div key={subject.name}>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-700">{subject.name}</p>
                    <p className="text-sm font-semibold text-slate-950">{subject.hours}</p>
                  </div>
                  <Progress value={subject.percentage} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

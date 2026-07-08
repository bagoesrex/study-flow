"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { StudyHoursBySubjectItem } from "@/types/analytics";
import { Card } from "@/components/ui/card";

type StudyHoursBySubjectChartProps = {
  data: StudyHoursBySubjectItem[];
};

export function StudyHoursBySubjectChart({ data }: StudyHoursBySubjectChartProps) {
  if (data.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="mb-1 text-lg font-semibold tracking-tight text-slate-950">
          Study Hours by Subject
        </h3>
        <p className="mb-6 text-sm text-slate-500">Total study hours grouped by subject.</p>

        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-slate-400">No study sessions recorded yet.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="mb-1 text-lg font-semibold tracking-tight text-slate-950">
        Study Hours by Subject
      </h3>
      <p className="mb-6 text-sm text-slate-500">Total study hours grouped by subject.</p>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="subjectName"
              tick={{ fontSize: 12, fill: "#64748b" }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              unit="h"
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
              }}
              formatter={(value) => [`${Number(value).toFixed(1)}h`, "Study Hours"]}
            />
            <Bar dataKey="hours" fill="#0f172a" radius={[6, 6, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { WeeklyStudyHourItem } from "@/types/analytics";
import { Card } from "@/components/ui/card";

type WeeklyStudyHoursChartProps = {
  data: WeeklyStudyHourItem[];
};

export function WeeklyStudyHoursChart({ data }: WeeklyStudyHoursChartProps) {
  const hasData = data.some((item) => item.minutes > 0);

  return (
    <Card className="p-6">
      <h3 className="mb-1 text-lg font-semibold tracking-tight text-slate-950">
        Weekly Study Hours
      </h3>
      <p className="mb-6 text-sm text-slate-500">Total study hours per day this week.</p>

      {!hasData ? (
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-slate-400">No study sessions this week yet.</p>
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 0, right: 0, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="label"
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
      )}
    </Card>
  );
}

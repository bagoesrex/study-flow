"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import type { TaskStatusItem } from "@/types/analytics";
import { Card } from "@/components/ui/card";

type TaskStatusChartProps = {
  data: TaskStatusItem[];
};

const COLORS = {
  TODO: "#e2e8f0",
  IN_PROGRESS: "#0f172a",
  DONE: "#22c55e",
};

const LABELS = {
  TODO: "Todo",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

export function TaskStatusChart({ data }: TaskStatusChartProps) {
  const total = data.reduce((sum, item) => sum + item.total, 0);

  if (total === 0) {
    return (
      <Card className="p-6">
        <h3 className="mb-1 text-lg font-semibold tracking-tight text-slate-950">Task Status</h3>
        <p className="mb-6 text-sm text-slate-500">Distribution of task statuses.</p>

        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-slate-400">No tasks created yet.</p>
        </div>
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    ...item,
    label: LABELS[item.status],
    fill: COLORS[item.status],
  }));

  return (
    <Card className="p-6">
      <h3 className="mb-1 text-lg font-semibold tracking-tight text-slate-950">Task Status</h3>
      <p className="mb-6 text-sm text-slate-500">Distribution of task statuses.</p>

      <div className="flex h-64 flex-col items-center justify-center">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="total"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={4}
              strokeWidth={0}
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
              }}
              formatter={(value, name) => [`${value} tasks`, name]}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {chartData.map((item) => (
            <div key={item.status} className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.fill }} />
              <span className="text-sm text-slate-600">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

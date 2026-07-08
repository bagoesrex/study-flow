"use client";

import { TaskCard } from "@/features/tasks/components/task-card";
import { TaskEmptyState } from "@/features/tasks/components/task-empty-state";
import { useTasksQuery } from "@/features/tasks/hooks/use-tasks-query";
import { Card } from "@/components/ui/card";

export function TaskList() {
  const query = useTasksQuery();

  if (query.isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="h-56 animate-pulse bg-slate-100" />
        ))}
      </div>
    );
  }

  if (query.isError) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-950">Gagal memuat task</h3>
        <p className="mt-2 text-sm text-slate-500">Silakan refresh halaman atau coba lagi nanti.</p>
      </Card>
    );
  }

  const tasks = query.data ?? [];

  if (tasks.length === 0) {
    return <TaskEmptyState />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}

"use client";

import { TaskCard } from "@/features/tasks/components/task-card";
import { TaskEmptyState } from "@/features/tasks/components/task-empty-state";
import { useTasksQuery } from "@/features/tasks/hooks/use-tasks-query";
import { CardGridSkeleton } from "@/components/skeletons/card-grid-skeleton";
import { ErrorState } from "@/components/common/error-state";

export function TaskList() {
  const query = useTasksQuery();

  if (query.isLoading) {
    return <CardGridSkeleton count={4} />;
  }

  if (query.isError) {
    return <ErrorState onRetry={() => query.refetch()} />;
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

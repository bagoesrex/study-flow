"use client";

import { FilteredEmptyState } from "@/components/common/filtered-empty-state";
import { CardGridSkeleton } from "@/components/skeletons/card-grid-skeleton";
import { ErrorState } from "@/components/common/error-state";
import { TaskCard } from "@/features/tasks/components/task-card";
import { TaskDataControls } from "@/features/tasks/components/task-data-controls";
import { TaskEmptyState } from "@/features/tasks/components/task-empty-state";
import { useTaskFilters } from "@/features/tasks/hooks/use-task-filters";
import { useTasksQuery } from "@/features/tasks/hooks/use-tasks-query";

export function TaskList() {
  const query = useTasksQuery();
  const tasks = query.data ?? [];
  const filters = useTaskFilters(tasks);

  if (query.isLoading) {
    return <CardGridSkeleton count={4} />;
  }

  if (query.isError) {
    return <ErrorState onRetry={() => query.refetch()} />;
  }

  if (tasks.length === 0) {
    return <TaskEmptyState />;
  }

  const subjectOptions = Array.from(
    new Map(
      tasks.map((task) => [
        task.subjectId,
        {
          value: task.subjectId,
          label: task.subjectName,
        },
      ])
    ).values()
  );

  const studyPlanOptions = Array.from(
    new Map(
      tasks.map((task) => [
        task.studyPlanId,
        {
          value: task.studyPlanId,
          label: task.studyPlanTitle,
        },
      ])
    ).values()
  );

  if (filters.filteredTasks.length === 0) {
    return (
      <div className="space-y-6">
        <TaskDataControls
          search={filters.search}
          onSearchChange={filters.setSearch}
          subjectId={filters.subjectId}
          onSubjectChange={filters.setSubjectId}
          studyPlanId={filters.studyPlanId}
          onStudyPlanChange={filters.setStudyPlanId}
          status={filters.status}
          onStatusChange={filters.setStatus}
          priority={filters.priority}
          onPriorityChange={filters.setPriority}
          sort={filters.sort}
          onSortChange={filters.setSort}
          subjectOptions={subjectOptions}
          studyPlanOptions={studyPlanOptions}
          filteredCount={filters.filteredTasks.length}
          totalCount={tasks.length}
          hasActiveFilters={filters.hasActiveFilters}
          onReset={filters.resetFilters}
        />

        <FilteredEmptyState onReset={filters.resetFilters} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TaskDataControls
        search={filters.search}
        onSearchChange={filters.setSearch}
        subjectId={filters.subjectId}
        onSubjectChange={filters.setSubjectId}
        studyPlanId={filters.studyPlanId}
        onStudyPlanChange={filters.setStudyPlanId}
        status={filters.status}
        onStatusChange={filters.setStatus}
        priority={filters.priority}
        onPriorityChange={filters.setPriority}
        sort={filters.sort}
        onSortChange={filters.setSort}
        subjectOptions={subjectOptions}
        studyPlanOptions={studyPlanOptions}
        filteredCount={filters.filteredTasks.length}
        totalCount={tasks.length}
        hasActiveFilters={filters.hasActiveFilters}
        onReset={filters.resetFilters}
      />

      <div className="grid gap-4 md:grid-cols-2">
        {filters.filteredTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}

"use client";

import { useCallback, useDeferredValue, useMemo, useState } from "react";

import { filterTasks } from "@/features/tasks/utils/filter-tasks";
import type { TaskSort } from "@/types/data-controls";
import type { TaskItem } from "@/types/task";

export function useTaskFilters(tasks: TaskItem[]) {
  const [search, setSearch] = useState("");
  const [subjectId, setSubjectId] = useState("ALL");
  const [studyPlanId, setStudyPlanId] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [priority, setPriority] = useState("ALL");
  const [sort, setSort] = useState<TaskSort>("NEWEST");

  const deferredSearch = useDeferredValue(search);

  const filteredTasks = useMemo(
    () =>
      filterTasks({
        tasks,
        search: deferredSearch,
        subjectId,
        studyPlanId,
        status,
        priority,
        sort,
      }),
    [tasks, deferredSearch, subjectId, studyPlanId, status, priority, sort]
  );

  const handleSubjectChange = useCallback((newSubjectId: string) => {
    setSubjectId(newSubjectId);
    setStudyPlanId("ALL");
  }, []);

  function resetFilters() {
    setSearch("");
    setSubjectId("ALL");
    setStudyPlanId("ALL");
    setStatus("ALL");
    setPriority("ALL");
    setSort("NEWEST");
  }

  const hasActiveFilters =
    search.length > 0 ||
    subjectId !== "ALL" ||
    studyPlanId !== "ALL" ||
    status !== "ALL" ||
    priority !== "ALL" ||
    sort !== "NEWEST";

  return {
    search,
    setSearch,
    subjectId,
    setSubjectId: handleSubjectChange,
    studyPlanId,
    setStudyPlanId,
    status,
    setStatus,
    priority,
    setPriority,
    sort,
    setSort,
    filteredTasks,
    resetFilters,
    hasActiveFilters,
  };
}

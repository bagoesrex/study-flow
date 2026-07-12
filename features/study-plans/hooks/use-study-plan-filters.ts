"use client";

import { useDeferredValue, useMemo, useState } from "react";

import { filterStudyPlans } from "@/features/study-plans/utils/filter-study-plans";
import type { StudyPlanSort } from "@/types/data-controls";
import type { StudyPlanWithProgress } from "@/types/study-plan-progress";

export function useStudyPlanFilters(plans: StudyPlanWithProgress[]) {
  const [search, setSearch] = useState("");
  const [subjectId, setSubjectId] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [priority, setPriority] = useState("ALL");
  const [sort, setSort] = useState<StudyPlanSort>("NEWEST");

  const deferredSearch = useDeferredValue(search);

  const filteredPlans = useMemo(
    () =>
      filterStudyPlans({
        plans,
        search: deferredSearch,
        subjectId,
        status,
        priority,
        sort,
      }),
    [plans, deferredSearch, subjectId, status, priority, sort]
  );

  function resetFilters() {
    setSearch("");
    setSubjectId("ALL");
    setStatus("ALL");
    setPriority("ALL");
    setSort("NEWEST");
  }

  const hasActiveFilters =
    search.length > 0 ||
    subjectId !== "ALL" ||
    status !== "ALL" ||
    priority !== "ALL" ||
    sort !== "NEWEST";

  return {
    search,
    setSearch,
    subjectId,
    setSubjectId,
    status,
    setStatus,
    priority,
    setPriority,
    sort,
    setSort,
    filteredPlans,
    resetFilters,
    hasActiveFilters,
  };
}

"use client";

import { useDeferredValue, useMemo, useState } from "react";

import { filterStudySessions } from "@/features/study-sessions/utils/filter-study-sessions";
import type { StudySessionSort } from "@/types/data-controls";
import type { StudySessionItem } from "@/types/study-session";

export function useStudySessionFilters(sessions: StudySessionItem[]) {
  const [search, setSearch] = useState("");
  const [subjectId, setSubjectId] = useState("ALL");
  const [studyPlanId, setStudyPlanId] = useState("ALL");
  const [mood, setMood] = useState("ALL");
  const [sort, setSort] = useState<StudySessionSort>("NEWEST");

  const deferredSearch = useDeferredValue(search);

  const filteredSessions = useMemo(
    () =>
      filterStudySessions({
        sessions,
        search: deferredSearch,
        subjectId,
        studyPlanId,
        mood,
        sort,
      }),
    [sessions, deferredSearch, subjectId, studyPlanId, mood, sort]
  );

  function resetFilters() {
    setSearch("");
    setSubjectId("ALL");
    setStudyPlanId("ALL");
    setMood("ALL");
    setSort("NEWEST");
  }

  const hasActiveFilters =
    search.length > 0 ||
    subjectId !== "ALL" ||
    studyPlanId !== "ALL" ||
    mood !== "ALL" ||
    sort !== "NEWEST";

  return {
    search,
    setSearch,
    subjectId,
    setSubjectId,
    studyPlanId,
    setStudyPlanId,
    mood,
    setMood,
    sort,
    setSort,
    filteredSessions,
    resetFilters,
    hasActiveFilters,
  };
}

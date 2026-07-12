"use client";

import { useDeferredValue, useMemo, useState } from "react";

import { filterSubjects } from "@/features/subjects/utils/filter-subjects";
import type { SubjectArchiveFilter, SubjectSort } from "@/types/data-controls";
import type { SubjectItem } from "@/types/subject";

export function useSubjectFilters(subjects: SubjectItem[]) {
  const [search, setSearch] = useState("");
  const [archive, setArchive] = useState<SubjectArchiveFilter>("ALL");
  const [sort, setSort] = useState<SubjectSort>("NEWEST");

  const deferredSearch = useDeferredValue(search);

  const filteredSubjects = useMemo(
    () =>
      filterSubjects({
        subjects,
        search: deferredSearch,
        archive,
        sort,
      }),
    [subjects, deferredSearch, archive, sort]
  );

  function resetFilters() {
    setSearch("");
    setArchive("ALL");
    setSort("NEWEST");
  }

  const hasActiveFilters = search.length > 0 || archive !== "ALL" || sort !== "NEWEST";

  return {
    search,
    setSearch,
    archive,
    setArchive,
    sort,
    setSort,
    filteredSubjects,
    resetFilters,
    hasActiveFilters,
  };
}

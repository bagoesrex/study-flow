"use client";

import { Button } from "@/components/ui/button";
import { DataControls } from "@/components/common/data-controls";
import { FilterSelect } from "@/components/common/filter-select";
import { ResultCount } from "@/components/common/result-count";
import { SearchInput } from "@/components/common/search-input";
import type { StudySessionSort } from "@/types/data-controls";

type StudySessionDataControlsProps = {
  search: string;
  onSearchChange: (value: string) => void;
  subjectId: string;
  onSubjectChange: (value: string) => void;
  studyPlanId: string;
  onStudyPlanChange: (value: string) => void;
  mood: string;
  onMoodChange: (value: string) => void;
  sort: StudySessionSort;
  onSortChange: (value: StudySessionSort) => void;
  subjectOptions: { value: string; label: string }[];
  studyPlanOptions: { value: string; label: string }[];
  filteredCount: number;
  totalCount: number;
  hasActiveFilters: boolean;
  onReset: () => void;
};

export function StudySessionDataControls({
  search,
  onSearchChange,
  subjectId,
  onSubjectChange,
  studyPlanId,
  onStudyPlanChange,
  mood,
  onMoodChange,
  sort,
  onSortChange,
  subjectOptions,
  studyPlanOptions,
  filteredCount,
  totalCount,
  hasActiveFilters,
  onReset,
}: StudySessionDataControlsProps) {
  return (
    <DataControls
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <ResultCount filteredCount={filteredCount} totalCount={totalCount} label="sessions" />

          {hasActiveFilters ? (
            <Button type="button" variant="outline" size="sm" onClick={onReset}>
              Reset Filters
            </Button>
          ) : null}
        </div>
      }
    >
      <SearchInput
        value={search}
        onChange={onSearchChange}
        placeholder="Search session notes, subjects, plans, or tasks..."
        className="sm:col-span-2 xl:min-w-72 xl:flex-1"
      />

      <FilterSelect
        value={subjectId}
        onChange={onSubjectChange}
        label="Subject filter"
        options={[{ value: "ALL", label: "All Subjects" }, ...subjectOptions]}
        className="xl:w-44"
      />

      <FilterSelect
        value={studyPlanId}
        onChange={onStudyPlanChange}
        label="Study plan filter"
        options={[{ value: "ALL", label: "All Study Plans" }, ...studyPlanOptions]}
        className="xl:w-44"
      />

      <FilterSelect
        value={mood}
        onChange={onMoodChange}
        label="Mood filter"
        options={[
          { value: "ALL", label: "All Moods" },
          { value: "FOCUSED", label: "Focused" },
          { value: "NORMAL", label: "Normal" },
          { value: "TIRED", label: "Tired" },
          { value: "DISTRACTED", label: "Distracted" },
        ]}
        className="xl:w-44"
      />

      <FilterSelect
        value={sort}
        onChange={(value) => onSortChange(value as StudySessionSort)}
        label="Sort"
        options={[
          { value: "NEWEST", label: "Newest" },
          { value: "OLDEST", label: "Oldest" },
          { value: "DURATION_ASC", label: "Duration Shortest" },
          { value: "DURATION_DESC", label: "Duration Longest" },
        ]}
        className="xl:w-44"
      />
    </DataControls>
  );
}

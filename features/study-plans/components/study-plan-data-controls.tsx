"use client";

import { Button } from "@/components/ui/button";
import { DataControls } from "@/components/common/data-controls";
import { FilterSelect } from "@/components/common/filter-select";
import { ResultCount } from "@/components/common/result-count";
import { SearchInput } from "@/components/common/search-input";
import type { StudyPlanSort } from "@/types/data-controls";

type StudyPlanDataControlsProps = {
  search: string;
  onSearchChange: (value: string) => void;
  subjectId: string;
  onSubjectChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  priority: string;
  onPriorityChange: (value: string) => void;
  sort: StudyPlanSort;
  onSortChange: (value: StudyPlanSort) => void;
  subjectOptions: { value: string; label: string }[];
  filteredCount: number;
  totalCount: number;
  hasActiveFilters: boolean;
  onReset: () => void;
};

export function StudyPlanDataControls({
  search,
  onSearchChange,
  subjectId,
  onSubjectChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  sort,
  onSortChange,
  subjectOptions,
  filteredCount,
  totalCount,
  hasActiveFilters,
  onReset,
}: StudyPlanDataControlsProps) {
  return (
    <DataControls
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <ResultCount filteredCount={filteredCount} totalCount={totalCount} label="study plans" />

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
        placeholder="Search study plans..."
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
        value={status}
        onChange={onStatusChange}
        label="Status filter"
        options={[
          { value: "ALL", label: "All Statuses" },
          { value: "NOT_STARTED", label: "Not Started" },
          { value: "IN_PROGRESS", label: "In Progress" },
          { value: "COMPLETED", label: "Completed" },
          { value: "PAUSED", label: "Paused" },
          { value: "CANCELLED", label: "Cancelled" },
        ]}
        className="xl:w-44"
      />

      <FilterSelect
        value={priority}
        onChange={onPriorityChange}
        label="Priority filter"
        options={[
          { value: "ALL", label: "All Priorities" },
          { value: "LOW", label: "Low" },
          { value: "MEDIUM", label: "Medium" },
          { value: "HIGH", label: "High" },
          { value: "URGENT", label: "Urgent" },
        ]}
        className="xl:w-44"
      />

      <FilterSelect
        value={sort}
        onChange={(value) => onSortChange(value as StudyPlanSort)}
        label="Sort"
        options={[
          { value: "NEWEST", label: "Newest" },
          { value: "OLDEST", label: "Oldest" },
          { value: "TITLE_ASC", label: "Title A\u2013Z" },
          { value: "TITLE_DESC", label: "Title Z\u2013A" },
          { value: "DEADLINE_ASC", label: "Deadline Nearest" },
          { value: "DEADLINE_DESC", label: "Deadline Farthest" },
          { value: "PROGRESS_ASC", label: "Progress Low to High" },
          { value: "PROGRESS_DESC", label: "Progress High to Low" },
        ]}
        className="xl:w-44"
      />
    </DataControls>
  );
}

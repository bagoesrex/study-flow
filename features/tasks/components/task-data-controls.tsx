"use client";

import { Button } from "@/components/ui/button";
import { DataControls } from "@/components/common/data-controls";
import { FilterSelect } from "@/components/common/filter-select";
import { ResultCount } from "@/components/common/result-count";
import { SearchInput } from "@/components/common/search-input";
import type { TaskSort } from "@/types/data-controls";

type TaskDataControlsProps = {
  search: string;
  onSearchChange: (value: string) => void;
  subjectId: string;
  onSubjectChange: (value: string) => void;
  studyPlanId: string;
  onStudyPlanChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  priority: string;
  onPriorityChange: (value: string) => void;
  sort: TaskSort;
  onSortChange: (value: TaskSort) => void;
  subjectOptions: { value: string; label: string }[];
  studyPlanOptions: { value: string; label: string }[];
  filteredCount: number;
  totalCount: number;
  hasActiveFilters: boolean;
  onReset: () => void;
};

export function TaskDataControls({
  search,
  onSearchChange,
  subjectId,
  onSubjectChange,
  studyPlanId,
  onStudyPlanChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  sort,
  onSortChange,
  subjectOptions,
  studyPlanOptions,
  filteredCount,
  totalCount,
  hasActiveFilters,
  onReset,
}: TaskDataControlsProps) {
  return (
    <DataControls
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <ResultCount filteredCount={filteredCount} totalCount={totalCount} label="tasks" />

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
        placeholder="Search tasks..."
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
        value={status}
        onChange={onStatusChange}
        label="Status filter"
        options={[
          { value: "ALL", label: "All Statuses" },
          { value: "TODO", label: "Todo" },
          { value: "IN_PROGRESS", label: "In Progress" },
          { value: "DONE", label: "Done" },
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
        onChange={(value) => onSortChange(value as TaskSort)}
        label="Sort"
        options={[
          { value: "NEWEST", label: "Newest" },
          { value: "OLDEST", label: "Oldest" },
          { value: "TITLE_ASC", label: "Title A\u2013Z" },
          { value: "TITLE_DESC", label: "Title Z\u2013A" },
          { value: "DUE_DATE_ASC", label: "Due Date Nearest" },
          { value: "DUE_DATE_DESC", label: "Due Date Farthest" },
          { value: "PRIORITY_DESC", label: "Priority Highest" },
          { value: "POSITION_ASC", label: "Position" },
        ]}
        className="xl:w-44"
      />
    </DataControls>
  );
}

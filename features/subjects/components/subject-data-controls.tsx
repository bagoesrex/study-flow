"use client";

import { Button } from "@/components/ui/button";
import { DataControls } from "@/components/common/data-controls";
import { FilterSelect } from "@/components/common/filter-select";
import { ResultCount } from "@/components/common/result-count";
import { SearchInput } from "@/components/common/search-input";
import type { SubjectArchiveFilter, SubjectSort } from "@/types/data-controls";

type SubjectDataControlsProps = {
  search: string;
  onSearchChange: (value: string) => void;
  archive: SubjectArchiveFilter;
  onArchiveChange: (value: SubjectArchiveFilter) => void;
  sort: SubjectSort;
  onSortChange: (value: SubjectSort) => void;
  filteredCount: number;
  totalCount: number;
  hasActiveFilters: boolean;
  onReset: () => void;
};

export function SubjectDataControls({
  search,
  onSearchChange,
  archive,
  onArchiveChange,
  sort,
  onSortChange,
  filteredCount,
  totalCount,
  hasActiveFilters,
  onReset,
}: SubjectDataControlsProps) {
  return (
    <DataControls
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <ResultCount filteredCount={filteredCount} totalCount={totalCount} label="subjects" />

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
        placeholder="Search subjects..."
        className="sm:col-span-2 xl:min-w-72 xl:flex-1"
      />

      <FilterSelect
        value={archive}
        onChange={(value) => onArchiveChange(value as SubjectArchiveFilter)}
        label="Archive filter"
        options={[
          { value: "ALL", label: "All Subjects" },
          { value: "ACTIVE", label: "Active" },
          { value: "ARCHIVED", label: "Archived" },
        ]}
        className="xl:w-44"
      />

      <FilterSelect
        value={sort}
        onChange={(value) => onSortChange(value as SubjectSort)}
        label="Sort"
        options={[
          { value: "NEWEST", label: "Newest" },
          { value: "OLDEST", label: "Oldest" },
          { value: "NAME_ASC", label: "Name A\u2013Z" },
          { value: "NAME_DESC", label: "Name Z\u2013A" },
          { value: "TARGET_HOURS_ASC", label: "Target Hours: Low to High" },
          { value: "TARGET_HOURS_DESC", label: "Target Hours: High to Low" },
        ]}
        className="xl:w-44"
      />
    </DataControls>
  );
}

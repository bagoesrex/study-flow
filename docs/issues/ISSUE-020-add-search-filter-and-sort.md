# ISSUE-020 — Add Search, Filter, and Sort

## Status

Planned

## Priority

Medium

## Type

Feature / Data Navigation

## Summary

Menambahkan fitur search, filter, dan sort pada halaman data utama StudyFlow agar user lebih mudah menemukan subject, study plan, task, dan study session.

Fitur ini bekerja menggunakan data yang sudah diambil melalui TanStack Query. Untuk scope MVP, proses search, filter, dan sort dilakukan di client tanpa membuat API route baru dan tanpa menambah schema database.

Affected routes:

```txt
/dashboard/subjects
/dashboard/plans
/dashboard/tasks
/dashboard/sessions
```

## Background

Setelah user menggunakan StudyFlow dalam waktu lama, jumlah data dapat bertambah:

```txt
Subjects
Study Plans
Tasks
Study Sessions
```

Tanpa search dan filter, user harus melakukan scroll panjang untuk menemukan data tertentu.

Contoh kebutuhan:

```txt
Cari task dengan kata "Drizzle"
Tampilkan task berstatus TODO
Tampilkan study plan priority HIGH
Tampilkan subject yang masih active
Urutkan session berdasarkan durasi terbesar
Urutkan task berdasarkan deadline terdekat
```

Issue ini membuat pola data controls yang konsisten dan reusable.

## Goals

- Menambahkan search pada halaman Subjects.
- Menambahkan search pada halaman Study Plans.
- Menambahkan search pada halaman Tasks.
- Menambahkan search pada halaman Study Sessions.
- Menambahkan filter status.
- Menambahkan filter priority.
- Menambahkan filter subject.
- Menambahkan filter study plan.
- Menambahkan filter archive subject.
- Menambahkan filter mood study session.
- Menambahkan sort terbaru dan terlama.
- Menambahkan sort nama A–Z dan Z–A.
- Menambahkan sort deadline terdekat.
- Menambahkan sort progress study plan.
- Menambahkan sort duration study session.
- Membuat reusable search input.
- Membuat reusable filter select.
- Membuat reusable empty filtered result.
- Menampilkan jumlah hasil setelah filter.
- Menambahkan tombol reset filter.
- Memastikan filtering tidak memodifikasi data cache.
- Memastikan UI responsive pada mobile dan desktop.
- Memastikan filter dapat digunakan dengan keyboard.

## Non-Goals

- Tidak membuat global search seluruh aplikasi.
- Tidak membuat PostgreSQL full-text search.
- Tidak membuat fuzzy search.
- Tidak membuat pagination.
- Tidak membuat infinite scrolling.
- Tidak membuat saved filter.
- Tidak membuat filter persistence ke database.
- Tidak membuat autocomplete search.
- Tidak membuat server-side search.
- Tidak membuat API route baru.
- Tidak mengubah schema database.
- Tidak menambahkan shadcn/ui.
- Tidak mengubah business logic CRUD.

## Data Strategy

Untuk MVP:

```txt
TanStack Query mengambil seluruh data milik user
↓
Search/filter/sort dijalankan pada client
↓
Hasil ditampilkan oleh list component
```

Jangan memodifikasi array asli dari query cache.

Gunakan:

```ts
const filteredData = [...data];
```

atau:

```ts
data.filter(...).sort(...)
```

Pastikan `.sort()` tidak dijalankan langsung pada array cache.

Salah:

```ts
query.data.sort(...)
```

Benar:

```ts
[...query.data].sort(...)
```

## Search Behavior

Search harus:

```txt
Case-insensitive
Menghapus whitespace awal dan akhir
Mencari beberapa field relevan
Tidak memanggil database setiap karakter
Menampilkan seluruh data jika search kosong
```

Contoh normalisasi:

```ts
const normalizedSearch = search.trim().toLowerCase();
```

## Filter Scope

### Subjects

Search field:

```txt
name
description
```

Filter:

```txt
ALL
ACTIVE
ARCHIVED
```

Sort:

```txt
NEWEST
OLDEST
NAME_ASC
NAME_DESC
TARGET_HOURS_ASC
TARGET_HOURS_DESC
```

### Study Plans

Search field:

```txt
title
description
goal
subjectName
```

Filter:

```txt
subject
status
priority
```

Sort:

```txt
NEWEST
OLDEST
TITLE_ASC
TITLE_DESC
DEADLINE_ASC
DEADLINE_DESC
PROGRESS_ASC
PROGRESS_DESC
```

### Tasks

Search field:

```txt
title
description
studyPlanTitle
subjectName
```

Filter:

```txt
subject
study plan
status
priority
```

Sort:

```txt
NEWEST
OLDEST
TITLE_ASC
TITLE_DESC
DUE_DATE_ASC
DUE_DATE_DESC
PRIORITY_DESC
POSITION_ASC
```

### Study Sessions

Search field:

```txt
note
subjectName
studyPlanTitle
taskTitle
```

Filter:

```txt
subject
study plan
mood
```

Sort:

```txt
NEWEST
OLDEST
DURATION_ASC
DURATION_DESC
```

## Folder Structure

Gunakan struktur tanpa `src/`.

```txt
components/
└── common/
    ├── data-controls.tsx
    ├── filter-select.tsx
    ├── filtered-empty-state.tsx
    ├── result-count.tsx
    └── search-input.tsx

features/
├── subjects/
│   ├── components/
│   │   └── subject-data-controls.tsx
│   ├── hooks/
│   │   └── use-subject-filters.ts
│   └── utils/
│       └── filter-subjects.ts
├── study-plans/
│   ├── components/
│   │   └── study-plan-data-controls.tsx
│   ├── hooks/
│   │   └── use-study-plan-filters.ts
│   └── utils/
│       └── filter-study-plans.ts
├── tasks/
│   ├── components/
│   │   └── task-data-controls.tsx
│   ├── hooks/
│   │   └── use-task-filters.ts
│   └── utils/
│       └── filter-tasks.ts
└── study-sessions/
    ├── components/
    │   └── study-session-data-controls.tsx
    ├── hooks/
    │   └── use-study-session-filters.ts
    └── utils/
        └── filter-study-sessions.ts

types/
└── data-controls.ts
```

## Implementation Steps

### 1. Create Data Control Types

Buat file:

```txt
types/data-controls.ts
```

Isi:

```ts
export type SubjectArchiveFilter = "ALL" | "ACTIVE" | "ARCHIVED";

export type SubjectSort =
  "NEWEST" | "OLDEST" | "NAME_ASC" | "NAME_DESC" | "TARGET_HOURS_ASC" | "TARGET_HOURS_DESC";

export type StudyPlanSort =
  | "NEWEST"
  | "OLDEST"
  | "TITLE_ASC"
  | "TITLE_DESC"
  | "DEADLINE_ASC"
  | "DEADLINE_DESC"
  | "PROGRESS_ASC"
  | "PROGRESS_DESC";

export type TaskSort =
  | "NEWEST"
  | "OLDEST"
  | "TITLE_ASC"
  | "TITLE_DESC"
  | "DUE_DATE_ASC"
  | "DUE_DATE_DESC"
  | "PRIORITY_DESC"
  | "POSITION_ASC";

export type StudySessionSort = "NEWEST" | "OLDEST" | "DURATION_ASC" | "DURATION_DESC";
```

---

### 2. Create Reusable Search Input

Buat file:

```txt
components/common/search-input.tsx
```

Isi:

```tsx
"use client";

import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className,
}: SearchInputProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <Search
        className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
        aria-hidden="true"
      />

      <Input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full pr-10 pl-9"
      />

      {value ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Clear search"
          className="absolute top-1/2 right-1 h-9 w-9 -translate-y-1/2"
          onClick={() => onChange("")}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </Button>
      ) : null}
    </div>
  );
}
```

Requirements:

```txt
Search input full width pada mobile
Clear button hanya tampil jika value tidak kosong
Clear button memiliki aria-label
Tidak menyebabkan form submit
```

---

### 3. Create Reusable Filter Select

Buat file:

```txt
components/common/filter-select.tsx
```

Isi:

```tsx
"use client";

type FilterOption = {
  value: string;
  label: string;
};

type FilterSelectProps = {
  value: string;
  onChange: (value: string) => void;
  label: string;
  options: FilterOption[];
  className?: string;
};

export function FilterSelect({ value, onChange, label, options, className }: FilterSelectProps) {
  return (
    <label className={className}>
      <span className="sr-only">{label}</span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={label}
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 transition outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
```

Untuk MVP, native select tetap digunakan.

---

### 4. Create Data Controls Wrapper

Buat file:

```txt
components/common/data-controls.tsx
```

Isi:

```tsx
import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

type DataControlsProps = {
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export function DataControls({ children, footer, className }: DataControlsProps) {
  return (
    <Card className={cn("p-4 sm:p-5", className)}>
      <div className="grid gap-3 sm:grid-cols-2 xl:flex xl:flex-wrap">{children}</div>

      {footer ? <div className="mt-4 border-t border-slate-100 pt-4">{footer}</div> : null}
    </Card>
  );
}
```

---

### 5. Create Result Count

Buat file:

```txt
components/common/result-count.tsx
```

Isi:

```tsx
type ResultCountProps = {
  filteredCount: number;
  totalCount: number;
  label: string;
};

export function ResultCount({ filteredCount, totalCount, label }: ResultCountProps) {
  return (
    <p className="text-sm text-slate-500" aria-live="polite">
      Showing <span className="font-medium text-slate-950">{filteredCount}</span> of{" "}
      <span className="font-medium text-slate-950">{totalCount}</span> {label}
    </p>
  );
}
```

Contoh:

```txt
Showing 4 of 12 tasks
```

---

### 6. Create Filtered Empty State

Buat file:

```txt
components/common/filtered-empty-state.tsx
```

Isi:

```tsx
import { SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/empty-state";

type FilteredEmptyStateProps = {
  title?: string;
  description?: string;
  onReset: () => void;
};

export function FilteredEmptyState({
  title = "No matching data",
  description = "Tidak ada data yang sesuai dengan search atau filter saat ini.",
  onReset,
}: FilteredEmptyStateProps) {
  return (
    <EmptyState
      icon={SearchX}
      title={title}
      description={description}
      action={
        <Button type="button" variant="outline" onClick={onReset}>
          Reset Filters
        </Button>
      }
    />
  );
}
```

Bedakan:

```txt
Data kosong = feature EmptyState
Data tersedia tetapi filter tidak cocok = FilteredEmptyState
```

---

## Subject Search, Filter, and Sort

### 7. Create Subject Filter Utility

Buat file:

```txt
features/subjects/utils/filter-subjects.ts
```

Isi:

```ts
import type { SubjectArchiveFilter, SubjectSort } from "@/types/data-controls";
import type { SubjectItem } from "@/types/subject";

type FilterSubjectsParams = {
  subjects: SubjectItem[];
  search: string;
  archive: SubjectArchiveFilter;
  sort: SubjectSort;
};

export function filterSubjects({ subjects, search, archive, sort }: FilterSubjectsParams) {
  const normalizedSearch = search.trim().toLowerCase();

  const filtered = subjects.filter((subject) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      subject.name.toLowerCase().includes(normalizedSearch) ||
      subject.description?.toLowerCase().includes(normalizedSearch);

    const matchesArchive =
      archive === "ALL" ||
      (archive === "ACTIVE" && !subject.isArchived) ||
      (archive === "ARCHIVED" && subject.isArchived);

    return matchesSearch && matchesArchive;
  });

  return [...filtered].sort((a, b) => {
    if (sort === "OLDEST") {
      return a.createdAt.getTime() - b.createdAt.getTime();
    }

    if (sort === "NAME_ASC") {
      return a.name.localeCompare(b.name);
    }

    if (sort === "NAME_DESC") {
      return b.name.localeCompare(a.name);
    }

    if (sort === "TARGET_HOURS_ASC") {
      return (a.targetHours ?? 0) - (b.targetHours ?? 0);
    }

    if (sort === "TARGET_HOURS_DESC") {
      return (b.targetHours ?? 0) - (a.targetHours ?? 0);
    }

    return b.createdAt.getTime() - a.createdAt.getTime();
  });
}
```

---

### 8. Create Subject Filter Hook

Buat file:

```txt
features/subjects/hooks/use-subject-filters.ts
```

Isi:

```ts
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
```

---

### 9. Create Subject Data Controls

Buat file:

```txt
features/subjects/components/subject-data-controls.tsx
```

Requirements:

- Search placeholder: `Search subjects...`
- Archive filter.
- Sort filter.
- Result count.
- Reset filters button jika filter aktif.

Options:

```txt
Archive:
All Subjects
Active
Archived

Sort:
Newest
Oldest
Name A–Z
Name Z–A
Target Hours: Low to High
Target Hours: High to Low
```

---

### 10. Update Subject List

Edit:

```txt
features/subjects/components/subject-list.tsx
```

Flow:

```tsx
const subjects = query.data ?? [];

const filters = useSubjectFilters(subjects);
```

Render:

```txt
Jika subjects.length === 0:
SubjectEmptyState

Jika subjects ada:
SubjectDataControls

Jika filteredSubjects.length === 0:
FilteredEmptyState

Jika filteredSubjects ada:
Render card grid
```

Pastikan card menggunakan:

```tsx
filters.filteredSubjects.map(...)
```

---

## Study Plan Search, Filter, and Sort

### 11. Create Study Plan Filter Utility

Buat file:

```txt
features/study-plans/utils/filter-study-plans.ts
```

Filter params:

```ts
type FilterStudyPlansParams = {
  plans: StudyPlanItem[];
  search: string;
  subjectId: string;
  status: string;
  priority: string;
  sort: StudyPlanSort;
};
```

Search fields:

```txt
title
description
goal
subjectName
```

Filter values:

```txt
subjectId = ALL atau subject UUID
status = ALL atau StudyPlanStatus
priority = ALL atau StudyPlanPriority
```

Date sort rules:

```txt
Plan tanpa endDate ditempatkan paling akhir pada DEADLINE_ASC.
Plan tanpa endDate ditempatkan paling akhir pada DEADLINE_DESC.
```

Progress sort:

```ts
a.progress - b.progress;
```

atau:

```ts
b.progress - a.progress;
```

---

### 12. Create Study Plan Filter Hook

Buat file:

```txt
features/study-plans/hooks/use-study-plan-filters.ts
```

State:

```txt
search
subjectId
status
priority
sort
```

Default:

```txt
search = ""
subjectId = "ALL"
status = "ALL"
priority = "ALL"
sort = "NEWEST"
```

Gunakan:

```ts
useDeferredValue(search)
useMemo(...)
```

---

### 13. Create Study Plan Data Controls

Buat file:

```txt
features/study-plans/components/study-plan-data-controls.tsx
```

Controls:

```txt
Search input
Subject filter
Status filter
Priority filter
Sort
Reset filters
Result count
```

Status options:

```txt
All Statuses
Not Started
In Progress
Completed
Paused
Cancelled
```

Priority options:

```txt
All Priorities
Low
Medium
High
Urgent
```

Sort options:

```txt
Newest
Oldest
Title A–Z
Title Z–A
Deadline Nearest
Deadline Farthest
Progress Low to High
Progress High to Low
```

Subject options dapat dibentuk dari plan list agar tidak perlu query tambahan:

```ts
const subjectOptions = Array.from(
  new Map(
    plans.map((plan) => [
      plan.subjectId,
      {
        value: plan.subjectId,
        label: plan.subjectName,
      },
    ])
  ).values()
);
```

---

### 14. Update Study Plan List

Edit:

```txt
features/study-plans/components/study-plan-list.tsx
```

Rules:

```txt
Data asli kosong → StudyPlanEmptyState
Hasil filter kosong → FilteredEmptyState
Hasil filter tersedia → StudyPlanCard
```

Pastikan search/filter tidak memengaruhi create form.

---

## Task Search, Filter, and Sort

### 15. Create Task Filter Utility

Buat file:

```txt
features/tasks/utils/filter-tasks.ts
```

Search fields:

```txt
title
description
studyPlanTitle
subjectName
```

Filter:

```txt
subjectId
studyPlanId
status
priority
```

Catatan:

Type `TaskItem` dari ISSUE-009 belum memiliki `subjectId`. Tambahkan:

```ts
subjectId: string;
```

Pastikan `getTasksAction()` ikut memilih:

```ts
subjectId: subjects.id,
```

Task priority order:

```ts
const priorityWeight = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  URGENT: 4,
};
```

`PRIORITY_DESC`:

```ts
priorityWeight[b.priority] - priorityWeight[a.priority];
```

Due date rules:

```txt
Task tanpa dueDate ditempatkan paling akhir.
```

---

### 16. Create Task Filter Hook

Buat file:

```txt
features/tasks/hooks/use-task-filters.ts
```

State:

```txt
search
subjectId
studyPlanId
status
priority
sort
```

Default:

```txt
search = ""
subjectId = "ALL"
studyPlanId = "ALL"
status = "ALL"
priority = "ALL"
sort = "NEWEST"
```

Saat subject berubah, reset study plan filter jika study plan yang dipilih tidak termasuk subject tersebut.

Minimal MVP:

```ts
setStudyPlanId("ALL");
```

---

### 17. Create Task Data Controls

Buat file:

```txt
features/tasks/components/task-data-controls.tsx
```

Controls:

```txt
Search
Subject
Study Plan
Status
Priority
Sort
Reset
Result count
```

Status options:

```txt
All Statuses
Todo
In Progress
Done
```

Sort options:

```txt
Newest
Oldest
Title A–Z
Title Z–A
Due Date Nearest
Due Date Farthest
Priority Highest
Position
```

Study plan filter sebaiknya menampilkan plan yang sesuai subject terpilih.

---

### 18. Update Task List

Edit:

```txt
features/tasks/components/task-list.tsx
```

Rules:

```txt
Semua task kosong → TaskEmptyState
Filter tidak menemukan data → FilteredEmptyState
Task ditemukan → TaskCard
```

Pastikan quick status update tetap bekerja pada hasil filter.

Setelah status berubah:

```txt
Task bisa langsung hilang dari list jika tidak cocok dengan filter status aktif.
```

Contoh:

```txt
Filter TODO aktif
Task diubah menjadi DONE
Task hilang dari hasil karena sudah tidak cocok
```

Perilaku tersebut benar.

---

## Study Session Search, Filter, and Sort

### 19. Update Study Session Type

Pastikan `StudySessionItem` memiliki:

```ts
subjectId: string;
studyPlanId: string | null;
taskId: string | null;
```

Field ini sudah seharusnya tersedia dari ISSUE-010.

---

### 20. Create Study Session Filter Utility

Buat file:

```txt
features/study-sessions/utils/filter-study-sessions.ts
```

Search fields:

```txt
note
subjectName
studyPlanTitle
taskTitle
```

Filter:

```txt
subjectId
studyPlanId
mood
```

Sort:

```txt
NEWEST
OLDEST
DURATION_ASC
DURATION_DESC
```

Newest menggunakan:

```ts
b.startedAt.getTime() - a.startedAt.getTime();
```

---

### 21. Create Study Session Filter Hook

Buat file:

```txt
features/study-sessions/hooks/use-study-session-filters.ts
```

State:

```txt
search
subjectId
studyPlanId
mood
sort
```

Default:

```txt
search = ""
subjectId = "ALL"
studyPlanId = "ALL"
mood = "ALL"
sort = "NEWEST"
```

---

### 22. Create Study Session Data Controls

Buat file:

```txt
features/study-sessions/components/study-session-data-controls.tsx
```

Controls:

```txt
Search
Subject
Study Plan
Mood
Sort
Reset
Result count
```

Mood options:

```txt
All Moods
Focused
Normal
Tired
Distracted
```

Sort options:

```txt
Newest
Oldest
Duration Shortest
Duration Longest
```

Search placeholder:

```txt
Search session notes, subjects, plans, or tasks...
```

---

### 23. Update Study Session List

Edit:

```txt
features/study-sessions/components/study-session-list.tsx
```

Rules:

```txt
Semua session kosong → StudySessionEmptyState
Filter tidak menemukan hasil → FilteredEmptyState
Session ditemukan → StudySessionCard
```

---

## Responsive Behavior

### 24. Data Controls Mobile Layout

Pada mobile:

```txt
Search input full width
Filter select stack
Sort full width
Reset button full width atau berada di footer
```

Pada desktop:

```txt
Search mengambil ruang lebih besar
Select dapat berada dalam satu baris
Controls wrap jika ruang tidak cukup
```

Recommended search class:

```tsx
className = "sm:col-span-2 xl:min-w-72 xl:flex-1";
```

Recommended select:

```tsx
className = "xl:w-44";
```

---

### 25. Reset Filter Behavior

Reset harus mengembalikan:

```txt
Search kosong
Semua filter = ALL
Sort = default
```

Reset tidak boleh:

```txt
Menghapus data
Menjalankan mutation
Melakukan refresh halaman
Menghapus query cache
```

Tombol reset hanya tampil jika:

```txt
hasActiveFilters === true
```

---

### 26. Search Performance

Gunakan:

```ts
useDeferredValue(search);
```

Tujuan:

```txt
Input tetap responsive ketika array mulai besar.
Filtering dilakukan menggunakan deferred search value.
```

Tidak perlu menambahkan debounce package.

---

### 27. Date Comparison Safety

Database date dapat diterima sebagai `Date` atau string tergantung driver dan serialization.

Gunakan helper:

```ts
function toTimestamp(value: Date | string | null) {
  if (!value) {
    return null;
  }

  return new Date(value).getTime();
}
```

Jangan mengasumsikan semua data selalu instance `Date` pada Client Component.

Gunakan helper yang sama untuk:

```txt
createdAt
startedAt
dueDate
endDate
```

---

### 28. Null Sorting Rules

Gunakan aturan konsisten:

```txt
Data tanpa tanggal selalu ditempatkan paling akhir.
Data tanpa targetHours dianggap 0.
Data tanpa estimatedHours tidak memengaruhi sorting issue ini.
Data tanpa description tetap dapat dicari berdasarkan field lain.
```

---

### 29. Query Cache Safety

Filter tidak boleh menjalankan:

```ts
queryClient.setQueryData(...)
```

Search/filter/sort hanya presentation logic.

CRUD mutation tetap menjadi satu-satunya bagian yang mengubah data.

---

### 30. Accessibility Requirements

Search dan filter wajib:

```txt
Memiliki aria-label
Dapat digunakan dengan keyboard
Clear search button memiliki aria-label
Result count memakai aria-live
Reset button mudah ditemukan
Tidak hanya mengandalkan warna
```

Filtered empty state harus menjelaskan bahwa data sebenarnya tersedia tetapi tidak cocok dengan filter.

---

### 31. Run Checks

Jalankan:

```bash
pnpm lint
pnpm format:check
pnpm build
```

Expected:

```txt
Tidak ada lint error.
Tidak ada format error.
Build berhasil.
```

## Expected Folder Structure

```txt
components/
└── common/
    ├── data-controls.tsx
    ├── filter-select.tsx
    ├── filtered-empty-state.tsx
    ├── result-count.tsx
    └── search-input.tsx

features/
├── subjects/
│   ├── components/
│   │   └── subject-data-controls.tsx
│   ├── hooks/
│   │   └── use-subject-filters.ts
│   └── utils/
│       └── filter-subjects.ts
├── study-plans/
│   ├── components/
│   │   └── study-plan-data-controls.tsx
│   ├── hooks/
│   │   └── use-study-plan-filters.ts
│   └── utils/
│       └── filter-study-plans.ts
├── tasks/
│   ├── components/
│   │   └── task-data-controls.tsx
│   ├── hooks/
│   │   └── use-task-filters.ts
│   └── utils/
│       └── filter-tasks.ts
└── study-sessions/
    ├── components/
    │   └── study-session-data-controls.tsx
    ├── hooks/
    │   └── use-study-session-filters.ts
    └── utils/
        └── filter-study-sessions.ts

types/
└── data-controls.ts
```

Existing list components ikut diperbarui.

## Acceptance Criteria

- Subjects memiliki search.
- Subjects memiliki active/archive filter.
- Subjects memiliki sort.
- Study Plans memiliki search.
- Study Plans memiliki subject filter.
- Study Plans memiliki status filter.
- Study Plans memiliki priority filter.
- Study Plans memiliki sort.
- Tasks memiliki search.
- Tasks memiliki subject filter.
- Tasks memiliki study plan filter.
- Tasks memiliki status filter.
- Tasks memiliki priority filter.
- Tasks memiliki sort.
- Study Sessions memiliki search.
- Study Sessions memiliki subject filter.
- Study Sessions memiliki study plan filter.
- Study Sessions memiliki mood filter.
- Study Sessions memiliki sort.
- Search bersifat case-insensitive.
- Search menghapus whitespace awal dan akhir.
- Search tidak memanggil database.
- Filter tidak mengubah query cache.
- Sort tidak memodifikasi array query asli.
- Result count tampil.
- Reset filter tersedia.
- Reset filter bekerja.
- Filtered empty state tersedia.
- Empty data dan filtered empty dibedakan.
- Search input memiliki clear button.
- Clear button memiliki accessibility label.
- Select memiliki accessibility label.
- Result count menggunakan `aria-live`.
- Controls responsive pada mobile.
- Tidak ada horizontal overflow.
- CRUD mutation tetap bekerja.
- Query invalidation tetap bekerja.
- Toast notification tetap bekerja.
- Loading, empty, dan error state tetap bekerja.
- Tidak ada API route baru.
- Tidak ada schema database yang diubah.
- Tidak ada shadcn/ui yang ditambahkan.
- Tidak ada folder di dalam `src/`.
- Tidak ada error TypeScript.
- Tidak ada error lint.
- `pnpm format:check` berhasil.
- `pnpm build` berhasil.

## Testing Checklist

### 1. Test Subject Search

Buat subject:

```txt
Next.js
Django
English
```

Search:

```txt
next
```

Expected:

```txt
Hanya Next.js yang tampil.
Search tidak case-sensitive.
```

---

### 2. Test Subject Archive Filter

Archive satu subject.

Filter:

```txt
Archived
```

Expected:

```txt
Hanya subject archived yang tampil.
```

Reset:

```txt
Semua subject tampil kembali.
```

---

### 3. Test Study Plan Search

Search menggunakan:

```txt
Title
Goal
Subject name
```

Expected:

```txt
Study plan yang sesuai tampil.
```

---

### 4. Test Study Plan Filters

Gunakan:

```txt
Subject: Next.js
Status: IN_PROGRESS
Priority: HIGH
```

Expected:

```txt
Hanya plan yang memenuhi semua filter yang tampil.
```

---

### 5. Test Study Plan Progress Sort

Buat plan:

```txt
Plan A = 20%
Plan B = 80%
Plan C = 50%
```

Sort:

```txt
Progress High to Low
```

Expected:

```txt
Plan B
Plan C
Plan A
```

---

### 6. Test Task Search

Search:

```txt
drizzle
```

Expected:

```txt
Task title atau description yang mengandung Drizzle tampil.
```

---

### 7. Test Task Status Filter

Filter:

```txt
TODO
```

Ubah satu task menjadi `DONE`.

Expected:

```txt
Task tersebut hilang dari hasil filter TODO.
Toast status update tetap tampil.
```

---

### 8. Test Task Due Date Sort

Buat task dengan:

```txt
Tomorrow
Next week
No due date
```

Sort:

```txt
Due Date Nearest
```

Expected:

```txt
Tomorrow
Next week
No due date
```

---

### 9. Test Task Priority Sort

Buat task:

```txt
LOW
URGENT
MEDIUM
HIGH
```

Sort:

```txt
Priority Highest
```

Expected:

```txt
URGENT
HIGH
MEDIUM
LOW
```

---

### 10. Test Study Session Search

Search berdasarkan:

```txt
Note
Subject
Study Plan
Task
```

Expected:

```txt
Session yang sesuai tampil.
```

---

### 11. Test Study Session Mood Filter

Filter:

```txt
FOCUSED
```

Expected:

```txt
Hanya session dengan mood FOCUSED yang tampil.
```

---

### 12. Test Session Duration Sort

Buat session:

```txt
30 minutes
90 minutes
60 minutes
```

Sort:

```txt
Duration Longest
```

Expected:

```txt
90
60
30
```

---

### 13. Test Filtered Empty State

Gunakan search yang tidak cocok:

```txt
this-data-does-not-exist
```

Expected:

```txt
Filtered empty state tampil.
Reset Filters button tampil.
Feature empty state tidak tampil.
```

Klik reset.

Expected:

```txt
Semua data tampil kembali.
```

---

### 14. Test Mobile Controls

Gunakan viewport:

```txt
320 × 568
375 × 667
```

Expected:

```txt
Search dan filter stack.
Tidak ada horizontal overflow.
Select dapat digunakan.
Reset button mudah ditekan.
```

---

### 15. Test Query Cache Safety

Lakukan sort beberapa kali.

Expected:

```txt
Urutan query cache tidak berubah secara tidak sengaja.
Navigasi ulang tetap menggunakan default sort.
Tidak ada data duplikat atau hilang.
```

---

### 16. Test CRUD with Active Filters

Aktifkan filter status atau subject.

Create/update/delete data.

Expected:

```txt
Mutation berhasil.
Toast tampil.
Query di-invalidate.
Hasil filter dihitung ulang.
Data hanya tampil jika cocok dengan filter aktif.
```

---

### 17. Test Accessibility

Gunakan keyboard.

Expected:

```txt
Search dapat difokuskan.
Select dapat digunakan.
Clear search dapat ditekan.
Reset filter dapat ditekan.
Result count diperbarui.
```

---

### 18. Run Checks

```bash
pnpm lint
pnpm format:check
pnpm build
```

Expected:

```txt
Tidak ada lint error.
Tidak ada format error.
Build berhasil.
```

## Notes

- Search/filter/sort pada issue ini dilakukan di client.
- Pendekatan ini cukup untuk portfolio dan jumlah data MVP.
- Jika data bertambah sangat besar, pindahkan ke server-side query pada issue terpisah.
- Jangan melakukan `.sort()` langsung pada query cache.
- Jangan membuat API route.
- Jangan mengubah schema database.
- Gunakan `useDeferredValue` untuk search input.
- Hindari abstraction berlebihan.
- Setiap feature boleh memiliki filter hook sendiri karena filter yang dibutuhkan berbeda.
- Global search dapat dibuat sebagai issue terpisah.

## Suggested Commit Message

```bash
feat: add search filter and sort controls
```

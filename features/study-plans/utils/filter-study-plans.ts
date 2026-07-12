import type { StudyPlanSort } from "@/types/data-controls";
import type { StudyPlanWithProgress } from "@/types/study-plan-progress";

type FilterStudyPlansParams = {
  plans: StudyPlanWithProgress[];
  search: string;
  subjectId: string;
  status: string;
  priority: string;
  sort: StudyPlanSort;
};

function toTimestamp(value: Date | string | null) {
  if (!value) {
    return null;
  }

  return new Date(value).getTime();
}

export function filterStudyPlans({
  plans,
  search,
  subjectId,
  status,
  priority,
  sort,
}: FilterStudyPlansParams) {
  const normalizedSearch = search.trim().toLowerCase();

  const filtered = plans.filter((plan) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      plan.title.toLowerCase().includes(normalizedSearch) ||
      (plan.description ?? "").toLowerCase().includes(normalizedSearch) ||
      (plan.goal ?? "").toLowerCase().includes(normalizedSearch) ||
      plan.subjectName.toLowerCase().includes(normalizedSearch);

    const matchesSubject = subjectId === "ALL" || plan.subjectId === subjectId;
    const matchesStatus = status === "ALL" || plan.status === status;
    const matchesPriority = priority === "ALL" || plan.priority === priority;

    return matchesSearch && matchesSubject && matchesStatus && matchesPriority;
  });

  return [...filtered].sort((a, b) => {
    if (sort === "OLDEST") {
      return (toTimestamp(a.createdAt) ?? 0) - (toTimestamp(b.createdAt) ?? 0);
    }

    if (sort === "TITLE_ASC") {
      return a.title.localeCompare(b.title);
    }

    if (sort === "TITLE_DESC") {
      return b.title.localeCompare(a.title);
    }

    if (sort === "DEADLINE_ASC") {
      return (toTimestamp(a.endDate) ?? Infinity) - (toTimestamp(b.endDate) ?? Infinity);
    }

    if (sort === "DEADLINE_DESC") {
      return (toTimestamp(b.endDate) ?? -Infinity) - (toTimestamp(a.endDate) ?? -Infinity);
    }

    if (sort === "PROGRESS_ASC") {
      return a.progress - b.progress;
    }

    if (sort === "PROGRESS_DESC") {
      return b.progress - a.progress;
    }

    return (toTimestamp(b.createdAt) ?? 0) - (toTimestamp(a.createdAt) ?? 0);
  });
}

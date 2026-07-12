import type { TaskSort } from "@/types/data-controls";
import type { TaskItem, TaskPriority, TaskStatus } from "@/types/task";

type FilterTasksParams = {
  tasks: TaskItem[];
  search: string;
  subjectId: string;
  studyPlanId: string;
  status: string;
  priority: string;
  sort: TaskSort;
};

const priorityWeight: Record<TaskPriority, number> = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  URGENT: 4,
};

function toTimestamp(value: Date | string | null) {
  if (!value) {
    return null;
  }

  return new Date(value).getTime();
}

export function filterTasks({
  tasks,
  search,
  subjectId,
  studyPlanId,
  status,
  priority,
  sort,
}: FilterTasksParams) {
  const normalizedSearch = search.trim().toLowerCase();

  const filtered = tasks.filter((task) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      task.title.toLowerCase().includes(normalizedSearch) ||
      (task.description ?? "").toLowerCase().includes(normalizedSearch) ||
      task.studyPlanTitle.toLowerCase().includes(normalizedSearch) ||
      task.subjectName.toLowerCase().includes(normalizedSearch);

    const matchesSubject = subjectId === "ALL" || task.subjectId === subjectId;

    const matchesStudyPlan = studyPlanId === "ALL" || task.studyPlanId === studyPlanId;

    const matchesStatus = status === "ALL" || task.status === (status as TaskStatus);

    const matchesPriority = priority === "ALL" || task.priority === (priority as TaskPriority);

    return matchesSearch && matchesSubject && matchesStudyPlan && matchesStatus && matchesPriority;
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

    if (sort === "DUE_DATE_ASC") {
      return (toTimestamp(a.dueDate) ?? Infinity) - (toTimestamp(b.dueDate) ?? Infinity);
    }

    if (sort === "DUE_DATE_DESC") {
      return (toTimestamp(b.dueDate) ?? -Infinity) - (toTimestamp(a.dueDate) ?? -Infinity);
    }

    if (sort === "PRIORITY_DESC") {
      return (priorityWeight[b.priority] ?? 0) - (priorityWeight[a.priority] ?? 0);
    }

    if (sort === "POSITION_ASC") {
      return a.position - b.position;
    }

    return (toTimestamp(b.createdAt) ?? 0) - (toTimestamp(a.createdAt) ?? 0);
  });
}

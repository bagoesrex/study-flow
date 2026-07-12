import type { StudySessionSort } from "@/types/data-controls";
import type { StudySessionItem, StudySessionMood } from "@/types/study-session";

type FilterStudySessionsParams = {
  sessions: StudySessionItem[];
  search: string;
  subjectId: string;
  studyPlanId: string;
  mood: string;
  sort: StudySessionSort;
};

function toTimestamp(value: Date | string | null) {
  if (!value) {
    return null;
  }

  return new Date(value).getTime();
}

export function filterStudySessions({
  sessions,
  search,
  subjectId,
  studyPlanId,
  mood,
  sort,
}: FilterStudySessionsParams) {
  const normalizedSearch = search.trim().toLowerCase();

  const filtered = sessions.filter((session) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      (session.note ?? "").toLowerCase().includes(normalizedSearch) ||
      session.subjectName.toLowerCase().includes(normalizedSearch) ||
      (session.studyPlanTitle ?? "").toLowerCase().includes(normalizedSearch) ||
      (session.taskTitle ?? "").toLowerCase().includes(normalizedSearch);

    const matchesSubject = subjectId === "ALL" || session.subjectId === subjectId;
    const matchesStudyPlan = studyPlanId === "ALL" || session.studyPlanId === studyPlanId;
    const matchesMood = mood === "ALL" || session.mood === (mood as StudySessionMood);

    return matchesSearch && matchesSubject && matchesStudyPlan && matchesMood;
  });

  return [...filtered].sort((a, b) => {
    if (sort === "OLDEST") {
      return (toTimestamp(a.startedAt) ?? 0) - (toTimestamp(b.startedAt) ?? 0);
    }

    if (sort === "DURATION_ASC") {
      return a.durationMinutes - b.durationMinutes;
    }

    if (sort === "DURATION_DESC") {
      return b.durationMinutes - a.durationMinutes;
    }

    return (toTimestamp(b.startedAt) ?? 0) - (toTimestamp(a.startedAt) ?? 0);
  });
}

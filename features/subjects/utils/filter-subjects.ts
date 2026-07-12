import type { SubjectArchiveFilter, SubjectSort } from "@/types/data-controls";
import type { SubjectItem } from "@/types/subject";

type FilterSubjectsParams = {
  subjects: SubjectItem[];
  search: string;
  archive: SubjectArchiveFilter;
  sort: SubjectSort;
};

function toTimestamp(value: Date | string | null) {
  if (!value) {
    return null;
  }

  return new Date(value).getTime();
}

export function filterSubjects({ subjects, search, archive, sort }: FilterSubjectsParams) {
  const normalizedSearch = search.trim().toLowerCase();

  const filtered = subjects.filter((subject) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      subject.name.toLowerCase().includes(normalizedSearch) ||
      (subject.description ?? "").toLowerCase().includes(normalizedSearch);

    const matchesArchive =
      archive === "ALL" ||
      (archive === "ACTIVE" && !subject.isArchived) ||
      (archive === "ARCHIVED" && subject.isArchived);

    return matchesSearch && matchesArchive;
  });

  return [...filtered].sort((a, b) => {
    if (sort === "OLDEST") {
      return (toTimestamp(a.createdAt) ?? 0) - (toTimestamp(b.createdAt) ?? 0);
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

    return (toTimestamp(b.createdAt) ?? 0) - (toTimestamp(a.createdAt) ?? 0);
  });
}

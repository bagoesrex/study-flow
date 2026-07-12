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

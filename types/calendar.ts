export type CalendarEventType = "TASK_DEADLINE" | "STUDY_PLAN_START" | "STUDY_PLAN_END";

export type CalendarEventStatus = "OVERDUE" | "TODAY" | "UPCOMING" | "COMPLETED";

export type CalendarEventItem = {
  id: string;
  sourceId: string;
  type: CalendarEventType;
  status: CalendarEventStatus;
  title: string;
  description: string | null;
  date: string;
  subjectName: string;
  subjectColor: string;
  studyPlanTitle: string | null;
  taskStatus: "TODO" | "IN_PROGRESS" | "DONE" | null;
  taskPriority: "LOW" | "MEDIUM" | "HIGH" | "URGENT" | null;
};

export type CalendarSummary = {
  totalEvents: number;
  overdueTasks: number;
  dueTodayTasks: number;
  upcomingTasks: number;
  completedTasks: number;
};

export type CalendarData = {
  summary: CalendarSummary;
  events: CalendarEventItem[];
};

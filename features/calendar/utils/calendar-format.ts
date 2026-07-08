import type { CalendarEventStatus, CalendarEventType } from "@/types/calendar";

export function formatCalendarDate(date: string | Date) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
  }).format(new Date(date));
}

export function formatCalendarDay(date: string | Date) {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
  }).format(new Date(date));
}

export function getDateKey(date: string | Date) {
  return new Date(date).toISOString().split("T")[0];
}

export function getCalendarEventTypeLabel(type: CalendarEventType) {
  if (type === "TASK_DEADLINE") {
    return "Task Deadline";
  }

  if (type === "STUDY_PLAN_START") {
    return "Study Plan Start";
  }

  return "Study Plan End";
}

export function getCalendarEventStatusLabel(status: CalendarEventStatus) {
  if (status === "OVERDUE") {
    return "Overdue";
  }

  if (status === "TODAY") {
    return "Today";
  }

  if (status === "COMPLETED") {
    return "Completed";
  }

  return "Upcoming";
}

export function getCalendarEventStatusVariant(status: CalendarEventStatus) {
  if (status === "OVERDUE") {
    return "danger";
  }

  if (status === "TODAY") {
    return "warning";
  }

  if (status === "COMPLETED") {
    return "success";
  }

  return "info";
}

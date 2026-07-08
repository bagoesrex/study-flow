import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  formatCalendarDate,
  getCalendarEventStatusLabel,
  getCalendarEventStatusVariant,
  getCalendarEventTypeLabel,
} from "@/features/calendar/utils/calendar-format";
import type { CalendarEventItem } from "@/types/calendar";

type CalendarEventCardProps = {
  event: CalendarEventItem;
};

function getEventHref(event: CalendarEventItem) {
  if (event.type === "TASK_DEADLINE") {
    return "/dashboard/tasks";
  }

  return "/dashboard/plans";
}

export function CalendarEventCard({ event }: CalendarEventCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: event.subjectColor }}
            />

            <p className="text-xs font-medium text-slate-500">{event.subjectName}</p>

            <Badge variant={getCalendarEventStatusVariant(event.status)}>
              {getCalendarEventStatusLabel(event.status)}
            </Badge>
          </div>

          <h3 className="truncate text-base font-semibold tracking-tight text-slate-950">
            {event.title}
          </h3>

          {event.studyPlanTitle ? (
            <p className="mt-1 truncate text-sm text-slate-500">{event.studyPlanTitle}</p>
          ) : null}
        </div>

        <p className="shrink-0 text-sm font-medium text-slate-500">
          {formatCalendarDate(event.date)}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge variant="info">{getCalendarEventTypeLabel(event.type)}</Badge>

        {event.taskStatus ? (
          <Badge variant={event.taskStatus === "DONE" ? "success" : "default"}>
            {event.taskStatus}
          </Badge>
        ) : null}

        {event.taskPriority ? (
          <Badge
            variant={
              event.taskPriority === "URGENT"
                ? "danger"
                : event.taskPriority === "HIGH"
                  ? "warning"
                  : event.taskPriority === "MEDIUM"
                    ? "info"
                    : "default"
            }
          >
            {event.taskPriority}
          </Badge>
        ) : null}
      </div>

      {event.description ? (
        <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500">{event.description}</p>
      ) : null}

      <div className="mt-4">
        <Link
          href={getEventHref(event)}
          className="text-sm font-medium text-slate-500 hover:text-slate-950"
        >
          View source
        </Link>
      </div>
    </Card>
  );
}

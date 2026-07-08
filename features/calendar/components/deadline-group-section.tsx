import { CalendarEventCard } from "@/features/calendar/components/calendar-event-card";
import { formatCalendarDay, formatCalendarDate } from "@/features/calendar/utils/calendar-format";
import type { CalendarEventItem } from "@/types/calendar";

type DeadlineGroupSectionProps = {
  date: string;
  events: CalendarEventItem[];
};

export function DeadlineGroupSection({ date, events }: DeadlineGroupSectionProps) {
  return (
    <section>
      <div className="mb-3">
        <h2 className="text-lg font-semibold tracking-tight text-slate-950">
          {formatCalendarDay(date)}
        </h2>
        <p className="text-sm text-slate-500">{formatCalendarDate(date)}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {events.map((event) => (
          <CalendarEventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}

import { DeadlineGroupSection } from "@/features/calendar/components/deadline-group-section";
import { getDateKey } from "@/features/calendar/utils/calendar-format";
import type { CalendarEventItem } from "@/types/calendar";

type CalendarEventListProps = {
  events: CalendarEventItem[];
};

function groupEventsByDate(events: CalendarEventItem[]) {
  return events.reduce<Record<string, CalendarEventItem[]>>((groups, event) => {
    const key = getDateKey(event.date);

    if (!groups[key]) {
      groups[key] = [];
    }

    groups[key].push(event);

    return groups;
  }, {});
}

export function CalendarEventList({ events }: CalendarEventListProps) {
  const groupedEvents = groupEventsByDate(events);
  const dates = Object.keys(groupedEvents).sort();

  return (
    <div className="space-y-8">
      {dates.map((date) => (
        <DeadlineGroupSection key={date} date={date} events={groupedEvents[date]} />
      ))}
    </div>
  );
}

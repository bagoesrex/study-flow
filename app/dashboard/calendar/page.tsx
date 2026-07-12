import { getCalendarDataAction } from "@/actions/calendar";
import { CalendarEmptyState } from "@/features/calendar/components/calendar-empty-state";
import { CalendarEventList } from "@/features/calendar/components/calendar-event-list";
import { CalendarSummaryCards } from "@/features/calendar/components/calendar-summary-cards";
import { PageHeader } from "@/components/common/page-header";

export default async function CalendarPage() {
  const result = await getCalendarDataAction();

  if (!result.success || !result.data) {
    return (
      <div className="space-y-6 lg:space-y-8">
        <PageHeader
          title="Calendar"
          description="Review your study plan timeline and task deadlines."
        />
        <div className="rounded-2xl border border-slate-200 p-6 text-center">
          <p className="text-sm text-slate-500">
            Failed to load calendar. Please refresh or try again later.
          </p>
        </div>
      </div>
    );
  }

  const data = result.data;

  if (data.events.length === 0) {
    return (
      <div className="space-y-6 lg:space-y-8">
        <PageHeader
          title="Calendar"
          description="Review your study plan timeline and task deadlines."
        />
        <CalendarEmptyState />
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <PageHeader
        title="Calendar"
        description="Review your study plan timeline, upcoming deadlines, and overdue tasks."
      />

      <CalendarSummaryCards summary={data.summary} />

      <CalendarEventList events={data.events} />
    </div>
  );
}

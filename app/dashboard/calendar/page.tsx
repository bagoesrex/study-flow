import { getCalendarDataAction } from "@/actions/calendar";
import { CalendarEmptyState } from "@/features/calendar/components/calendar-empty-state";
import { CalendarEventList } from "@/features/calendar/components/calendar-event-list";
import { CalendarSummaryCards } from "@/features/calendar/components/calendar-summary-cards";
import { Card } from "@/components/ui/card";

export default async function CalendarPage() {
  const result = await getCalendarDataAction();

  if (!result.success || !result.data) {
    return (
      <Card className="p-6">
        <h1 className="text-lg font-semibold text-slate-950">Gagal memuat calendar</h1>
        <p className="mt-2 text-sm text-slate-500">Silakan refresh halaman atau coba lagi nanti.</p>
      </Card>
    );
  }

  const data = result.data;

  if (data.events.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Calendar</h1>
          <p className="mt-2 text-sm text-slate-500">
            Review your study plan timeline and task deadlines.
          </p>
        </div>

        <CalendarEmptyState />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">Calendar</h1>
        <p className="mt-2 text-sm text-slate-500">
          Review your study plan timeline, upcoming deadlines, and overdue tasks.
        </p>
      </div>

      <CalendarSummaryCards summary={data.summary} />

      <CalendarEventList events={data.events} />
    </div>
  );
}

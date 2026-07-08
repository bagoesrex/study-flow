import Link from "next/link";
import { CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function CalendarEmptyState() {
  return (
    <Card className="flex flex-col items-center justify-center p-10 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-slate-600">
        <CalendarDays className="h-6 w-6" />
      </div>

      <h2 className="text-lg font-semibold tracking-tight text-slate-950">Belum ada deadline</h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        Buat study plan dengan tanggal mulai/selesai atau tambahkan due date pada task untuk melihat
        jadwal di calendar.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/dashboard/plans">Create Study Plan</Link>
        </Button>

        <Button asChild variant="outline">
          <Link href="/dashboard/tasks">Create Task</Link>
        </Button>
      </div>
    </Card>
  );
}

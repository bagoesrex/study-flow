import { CalendarDays } from "lucide-react";

import { Card } from "@/components/ui/card";

export function StudyPlanEmptyState() {
  return (
    <Card className="flex flex-col items-center justify-center p-10 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-slate-600">
        <CalendarDays className="h-6 w-6" />
      </div>

      <h3 className="text-lg font-semibold tracking-tight text-slate-950">Belum ada study plan</h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        Buat study plan pertama untuk mengatur target belajar, deadline, dan progres kamu.
      </p>
    </Card>
  );
}

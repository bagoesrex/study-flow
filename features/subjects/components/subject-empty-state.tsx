import { BookOpen } from "lucide-react";

import { Card } from "@/components/ui/card";

export function SubjectEmptyState() {
  return (
    <Card className="flex flex-col items-center justify-center p-10 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-slate-600">
        <BookOpen className="h-6 w-6" />
      </div>

      <h3 className="text-lg font-semibold tracking-tight text-slate-950">Belum ada subject</h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        Buat subject pertama untuk mengelompokkan rencana belajar, task, dan study session kamu.
      </p>
    </Card>
  );
}

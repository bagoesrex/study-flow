import { Timer } from "lucide-react";

import { Card } from "@/components/ui/card";

export function StudySessionEmptyState() {
  return (
    <Card className="flex flex-col items-center justify-center p-10 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-slate-600">
        <Timer className="h-6 w-6" />
      </div>

      <h3 className="text-lg font-semibold tracking-tight text-slate-950">
        Belum ada study session
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        Catat sesi belajar pertama untuk mulai melihat total jam belajar dan produktivitas kamu.
      </p>
    </Card>
  );
}

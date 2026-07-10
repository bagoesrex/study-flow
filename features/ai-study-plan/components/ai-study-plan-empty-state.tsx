import { Sparkles } from "lucide-react";

import { Card } from "@/components/ui/card";

export function AiStudyPlanEmptyState() {
  return (
    <Card className="flex flex-col items-center justify-center p-10 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-slate-600">
        <Sparkles className="h-6 w-6" />
      </div>

      <h2 className="text-lg font-semibold tracking-tight text-slate-950">
        Belum ada generated plan
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        Isi form di samping untuk membuat draft study plan dan task dengan bantuan AI dari NVIDIA
        Build.
      </p>
    </Card>
  );
}

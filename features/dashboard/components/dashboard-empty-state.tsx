import Link from "next/link";
import { LayoutDashboard } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function DashboardEmptyState() {
  return (
    <Card className="flex flex-col items-center justify-center p-10 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-slate-600">
        <LayoutDashboard className="h-6 w-6" />
      </div>

      <h2 className="text-lg font-semibold tracking-tight text-slate-950">
        Dashboard masih kosong
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        Mulai dengan membuat subject pertama, lalu buat study plan, task, dan catat study session
        kamu.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/dashboard/subjects">Create Subject</Link>
        </Button>

        <Button asChild variant="outline">
          <Link href="/dashboard/plans">Create Study Plan</Link>
        </Button>
      </div>
    </Card>
  );
}

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FeedbackMessage } from "@/components/common/feedback-message";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { GeneratedTaskList } from "@/features/ai-study-plan/components/generated-task-list";
import { useSaveGeneratedStudyPlanMutation } from "@/features/ai-study-plan/hooks/use-save-generated-study-plan-mutation";
import type { AiGeneratedStudyPlan } from "@/types/ai-study-plan";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

type AiStudyPlanPreviewProps = {
  subjectId: string;
  generatedPlan: AiGeneratedStudyPlan;
};

function getPriorityVariant(priority: AiGeneratedStudyPlan["priority"]) {
  if (priority === "URGENT") return "danger";
  if (priority === "HIGH") return "warning";
  if (priority === "MEDIUM") return "info";
  return "default";
}

export function AiStudyPlanPreview({ subjectId, generatedPlan }: AiStudyPlanPreviewProps) {
  const saveMutation = useSaveGeneratedStudyPlanMutation();

  async function handleSave() {
    await saveMutation.mutateAsync({
      subjectId,
      generatedPlan,
    });
  }

  if (saveMutation.isSuccess && saveMutation.data?.success) {
    return (
      <Card className="flex flex-col items-center justify-center p-10 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-6 w-6" />
        </div>

        <h2 className="text-lg font-semibold tracking-tight text-slate-950">
          Generated study plan berhasil disimpan ke StudyFlow.
        </h2>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link href="/dashboard/plans">View Study Plans</Link>
          </Button>

          <Button asChild variant="outline">
            <Link href="/dashboard/tasks">View Tasks</Link>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-slate-950">
              {generatedPlan.title}
            </h2>

            {generatedPlan.description ? (
              <p className="mt-2 text-sm leading-6 text-slate-500">{generatedPlan.description}</p>
            ) : null}
          </div>

          <Badge variant={getPriorityVariant(generatedPlan.priority)} className="shrink-0">
            {generatedPlan.priority}
          </Badge>
        </div>

        <div className="mb-4 rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-700">Goal</p>
          <p className="mt-1 text-sm leading-6 text-slate-500">{generatedPlan.goal}</p>
        </div>

        {generatedPlan.estimatedHours ? (
          <p className="text-sm text-slate-500">
            Estimated time:{" "}
            <span className="font-semibold text-slate-950">{generatedPlan.estimatedHours}h</span>
          </p>
        ) : null}
      </Card>

      <div>
        <h3 className="mb-3 text-lg font-semibold tracking-tight text-slate-950">
          Generated Tasks ({generatedPlan.tasks.length})
        </h3>
        <GeneratedTaskList tasks={generatedPlan.tasks} />
      </div>

      {saveMutation.isError ? (
        <FeedbackMessage variant="error" message="Gagal menyimpan generated study plan." />
      ) : null}

      <Button onClick={handleSave} disabled={saveMutation.isPending}>
        {saveMutation.isPending ? (
          <>
            <LoadingSpinner className="mr-2 h-4 w-4" />
            Saving...
          </>
        ) : (
          "Save to StudyFlow"
        )}
      </Button>
    </div>
  );
}

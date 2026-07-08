"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  updateStudyPlanSchema,
  type UpdateStudyPlanInput,
} from "@/features/study-plans/schemas/study-plan-schema";
import { useUpdateStudyPlanMutation } from "@/features/study-plans/hooks/use-update-study-plan-mutation";
import { useSubjectsQuery } from "@/features/subjects/hooks/use-subjects-query";
import type { StudyPlanItem } from "@/types/study-plan";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type StudyPlanUpdateFormProps = {
  plan: StudyPlanItem;
  onSuccess: () => void;
};

export function StudyPlanUpdateForm({ plan, onSuccess }: StudyPlanUpdateFormProps) {
  const mutation = useUpdateStudyPlanMutation();
  const subjectsQuery = useSubjectsQuery();

  const subjects = subjectsQuery.data ?? [];

  const form = useForm<UpdateStudyPlanInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(updateStudyPlanSchema) as any,
    defaultValues: {
      id: plan.id,
      subjectId: plan.subjectId,
      title: plan.title,
      description: plan.description ?? "",
      goal: plan.goal ?? "",
      startDate: plan.startDate ?? "",
      endDate: plan.endDate ?? "",
      status: plan.status,
      priority: plan.priority,
      estimatedHours: plan.estimatedHours ?? "",
    },
  });

  async function onSubmit(values: UpdateStudyPlanInput) {
    const result = await mutation.mutateAsync(values);

    if (!result.success) {
      form.setError("root", {
        message: result.message,
      });
      return;
    }

    onSuccess();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Subject</label>
        <select
          {...form.register("subjectId")}
          className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 shadow-sm transition outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
        >
          <option value="">Pilih subject</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>
        {form.formState.errors.subjectId ? (
          <p className="mt-2 text-sm text-rose-600">{form.formState.errors.subjectId.message}</p>
        ) : null}
      </div>

      <div>
        <Input placeholder="Study plan title" {...form.register("title")} />
        {form.formState.errors.title ? (
          <p className="mt-2 text-sm text-rose-600">{form.formState.errors.title.message}</p>
        ) : null}
      </div>

      <div>
        <Input placeholder="Description (optional)" {...form.register("description")} />
        {form.formState.errors.description ? (
          <p className="mt-2 text-sm text-rose-600">{form.formState.errors.description.message}</p>
        ) : null}
      </div>

      <div>
        <Input placeholder="Goal (optional)" {...form.register("goal")} />
        {form.formState.errors.goal ? (
          <p className="mt-2 text-sm text-rose-600">{form.formState.errors.goal.message}</p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Start Date</label>
          <Input type="date" {...form.register("startDate")} />
          {form.formState.errors.startDate ? (
            <p className="mt-2 text-sm text-rose-600">{form.formState.errors.startDate.message}</p>
          ) : null}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">End Date</label>
          <Input type="date" {...form.register("endDate")} />
          {form.formState.errors.endDate ? (
            <p className="mt-2 text-sm text-rose-600">{form.formState.errors.endDate.message}</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
          <select
            {...form.register("status")}
            className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 shadow-sm transition outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
          >
            <option value="NOT_STARTED">Not Started</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="PAUSED">Paused</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          {form.formState.errors.status ? (
            <p className="mt-2 text-sm text-rose-600">{form.formState.errors.status.message}</p>
          ) : null}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Priority</label>
          <select
            {...form.register("priority")}
            className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 shadow-sm transition outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
          {form.formState.errors.priority ? (
            <p className="mt-2 text-sm text-rose-600">{form.formState.errors.priority.message}</p>
          ) : null}
        </div>
      </div>

      <div>
        <Input
          type="number"
          placeholder="Estimated hours (optional)"
          {...form.register("estimatedHours")}
        />
        {form.formState.errors.estimatedHours ? (
          <p className="mt-2 text-sm text-rose-600">
            {form.formState.errors.estimatedHours.message}
          </p>
        ) : null}
      </div>

      {form.formState.errors.root ? (
        <p className="text-sm text-rose-600">{form.formState.errors.root.message}</p>
      ) : null}

      <Button type="submit" disabled={mutation.isPending} className="w-full">
        {mutation.isPending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}

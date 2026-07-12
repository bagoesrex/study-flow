"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

import {
  studyPlanSchema,
  type StudyPlanInput,
} from "@/features/study-plans/schemas/study-plan-schema";
import { useCreateStudyPlanMutation } from "@/features/study-plans/hooks/use-create-study-plan-mutation";
import { useSubjectsQuery } from "@/features/subjects/hooks/use-subjects-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type StudyPlanCreateFormProps = {
  onSuccess?: () => void;
};

export function StudyPlanCreateForm({ onSuccess }: StudyPlanCreateFormProps) {
  const mutation = useCreateStudyPlanMutation();
  const subjectsQuery = useSubjectsQuery();

  const subjects = subjectsQuery.data ?? [];
  const hasSubjects = subjects.length > 0;

  const form = useForm<StudyPlanInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(studyPlanSchema) as any,
    defaultValues: {
      subjectId: "",
      title: "",
      description: "",
      goal: "",
      startDate: "",
      endDate: "",
      status: "NOT_STARTED",
      priority: "MEDIUM",
      estimatedHours: "",
    },
  });

  async function onSubmit(values: StudyPlanInput) {
    const result = await mutation.mutateAsync(values);

    if (!result.success) {
      form.setError("root", {
        message: result.message,
      });
      return;
    }

    form.reset({
      subjectId: "",
      title: "",
      description: "",
      goal: "",
      startDate: "",
      endDate: "",
      status: "NOT_STARTED",
      priority: "MEDIUM",
      estimatedHours: "",
    });

    onSuccess?.();
  }

  if (!hasSubjects) {
    return (
      <div className="space-y-4">
        <div>
          <p className="text-sm text-slate-500">Buat rencana belajar baru.</p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-5 text-center">
          <p className="text-sm text-slate-600">
            Belum ada subject.{" "}
            <Link
              href="/dashboard/subjects"
              className="font-medium text-slate-950 underline underline-offset-2"
            >
              Buat subject
            </Link>{" "}
            terlebih dahulu sebelum membuat study plan.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-slate-500">Buat rencana belajar baru.</p>
      </div>

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
            <p className="mt-2 text-sm text-rose-600">
              {form.formState.errors.description.message}
            </p>
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
              <p className="mt-2 text-sm text-rose-600">
                {form.formState.errors.startDate.message}
              </p>
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

        <Button type="submit" disabled={mutation.isPending} className="w-full">
          {mutation.isPending ? "Creating..." : "Create Study Plan"}
        </Button>
      </form>
    </div>
  );
}

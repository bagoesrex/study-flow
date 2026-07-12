"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { taskSchema, type TaskInput } from "@/features/tasks/schemas/task-schema";
import { useCreateTaskMutation } from "@/features/tasks/hooks/use-create-task-mutation";
import { useStudyPlansQuery } from "@/features/study-plans/hooks/use-study-plans-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type TaskCreateFormProps = {
  onSuccess?: () => void;
};

export function TaskCreateForm({ onSuccess }: TaskCreateFormProps) {
  const mutation = useCreateTaskMutation();
  const studyPlansQuery = useStudyPlansQuery();

  const studyPlans = studyPlansQuery.data ?? [];
  const hasStudyPlans = studyPlans.length > 0;

  const form = useForm<TaskInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(taskSchema) as any,
    defaultValues: {
      studyPlanId: "",
      title: "",
      description: "",
      status: "TODO",
      priority: "MEDIUM",
      dueDate: "",
      position: "",
    },
  });

  async function onSubmit(values: TaskInput) {
    const result = await mutation.mutateAsync(values);

    if (!result.success) {
      form.setError("root", {
        message: result.message,
      });
      return;
    }

    form.reset({
      studyPlanId: "",
      title: "",
      description: "",
      status: "TODO",
      priority: "MEDIUM",
      dueDate: "",
      position: "",
    });

    onSuccess?.();
  }

  if (!hasStudyPlans) {
    return (
      <div className="space-y-4">
        <div>
          <p className="text-sm text-slate-500">Buat task baru untuk study plan kamu.</p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-5 text-center">
          <p className="text-sm text-slate-600">
            Belum ada study plan.{" "}
            <Link
              href="/dashboard/plans"
              className="font-medium text-slate-950 underline underline-offset-2"
            >
              Buat study plan
            </Link>{" "}
            terlebih dahulu sebelum membuat task.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-slate-500">Buat task baru untuk study plan kamu.</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Study Plan</label>
          <select
            {...form.register("studyPlanId")}
            className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 shadow-sm transition outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
          >
            <option value="">Pilih study plan</option>
            {studyPlans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.title}
              </option>
            ))}
          </select>
          {form.formState.errors.studyPlanId ? (
            <p className="mt-2 text-sm text-rose-600">
              {form.formState.errors.studyPlanId.message}
            </p>
          ) : null}
        </div>

        <div>
          <Input placeholder="Task title" {...form.register("title")} />
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

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
            <select
              {...form.register("status")}
              className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 shadow-sm transition outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
            >
              <option value="TODO">Todo</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
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
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Due Date</label>
          <Input type="date" {...form.register("dueDate")} />
          {form.formState.errors.dueDate ? (
            <p className="mt-2 text-sm text-rose-600">{form.formState.errors.dueDate.message}</p>
          ) : null}
        </div>

        <div>
          <Input type="number" placeholder="Position (optional)" {...form.register("position")} />
          {form.formState.errors.position ? (
            <p className="mt-2 text-sm text-rose-600">{form.formState.errors.position.message}</p>
          ) : null}
        </div>

        <Button type="submit" disabled={mutation.isPending} className="w-full">
          {mutation.isPending ? "Creating..." : "Create Task"}
        </Button>
      </form>
    </div>
  );
}

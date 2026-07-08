"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { updateTaskSchema, type UpdateTaskInput } from "@/features/tasks/schemas/task-schema";
import { useUpdateTaskMutation } from "@/features/tasks/hooks/use-update-task-mutation";
import { useStudyPlansQuery } from "@/features/study-plans/hooks/use-study-plans-query";
import type { TaskItem } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type TaskUpdateFormProps = {
  task: TaskItem;
  onSuccess: () => void;
};

export function TaskUpdateForm({ task, onSuccess }: TaskUpdateFormProps) {
  const mutation = useUpdateTaskMutation();
  const studyPlansQuery = useStudyPlansQuery();

  const studyPlans = studyPlansQuery.data ?? [];

  const form = useForm<UpdateTaskInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(updateTaskSchema) as any,
    defaultValues: {
      id: task.id,
      studyPlanId: task.studyPlanId,
      title: task.title,
      description: task.description ?? "",
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ?? "",
      position: task.position,
    },
  });

  async function onSubmit(values: UpdateTaskInput) {
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
          <p className="mt-2 text-sm text-rose-600">{form.formState.errors.studyPlanId.message}</p>
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
          <p className="mt-2 text-sm text-rose-600">{form.formState.errors.description.message}</p>
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

      {form.formState.errors.root ? (
        <p className="text-sm text-rose-600">{form.formState.errors.root.message}</p>
      ) : null}

      <Button type="submit" disabled={mutation.isPending} className="w-full">
        {mutation.isPending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}

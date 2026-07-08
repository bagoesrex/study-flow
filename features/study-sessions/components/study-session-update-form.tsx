"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  updateStudySessionSchema,
  type UpdateStudySessionInput,
} from "@/features/study-sessions/schemas/study-session-schema";
import { useUpdateStudySessionMutation } from "@/features/study-sessions/hooks/use-update-study-session-mutation";
import { useSubjectsQuery } from "@/features/subjects/hooks/use-subjects-query";
import { useStudyPlansQuery } from "@/features/study-plans/hooks/use-study-plans-query";
import { useTasksQuery } from "@/features/tasks/hooks/use-tasks-query";
import type { StudySessionItem } from "@/types/study-session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type StudySessionUpdateFormProps = {
  session: StudySessionItem;
  onSuccess: () => void;
};

function toDatetimeLocal(date: Date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

export function StudySessionUpdateForm({ session, onSuccess }: StudySessionUpdateFormProps) {
  const mutation = useUpdateStudySessionMutation();
  const subjectsQuery = useSubjectsQuery();
  const studyPlansQuery = useStudyPlansQuery();
  const tasksQuery = useTasksQuery();

  const subjects = subjectsQuery.data ?? [];

  const form = useForm<UpdateStudySessionInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(updateStudySessionSchema) as any,
    defaultValues: {
      id: session.id,
      subjectId: session.subjectId,
      studyPlanId: session.studyPlanId ?? "",
      taskId: session.taskId ?? "",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      durationMinutes: session.durationMinutes as any,
      note: session.note ?? "",
      mood: session.mood,
      startedAt: toDatetimeLocal(session.startedAt),
      endedAt: session.endedAt ? toDatetimeLocal(session.endedAt) : "",
    },
  });

  async function onSubmit(values: UpdateStudySessionInput) {
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
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Study Plan (optional)
        </label>
        <select
          {...form.register("studyPlanId")}
          className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 shadow-sm transition outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
        >
          <option value="">Pilih study plan</option>
          {studyPlansQuery.data?.map((plan) => (
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
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Task (optional)</label>
        <select
          {...form.register("taskId")}
          className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 shadow-sm transition outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
        >
          <option value="">Pilih task</option>
          {tasksQuery.data?.map((task) => (
            <option key={task.id} value={task.id}>
              {task.title}
            </option>
          ))}
        </select>
        {form.formState.errors.taskId ? (
          <p className="mt-2 text-sm text-rose-600">{form.formState.errors.taskId.message}</p>
        ) : null}
      </div>

      <div>
        <Input
          type="number"
          placeholder="Duration (minutes)"
          {...form.register("durationMinutes")}
        />
        {form.formState.errors.durationMinutes ? (
          <p className="mt-2 text-sm text-rose-600">
            {form.formState.errors.durationMinutes.message}
          </p>
        ) : null}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Mood</label>
        <select
          {...form.register("mood")}
          className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 shadow-sm transition outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
        >
          <option value="FOCUSED">Focused</option>
          <option value="NORMAL">Normal</option>
          <option value="TIRED">Tired</option>
          <option value="DISTRACTED">Distracted</option>
        </select>
        {form.formState.errors.mood ? (
          <p className="mt-2 text-sm text-rose-600">{form.formState.errors.mood.message}</p>
        ) : null}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Started At</label>
        <Input type="datetime-local" {...form.register("startedAt")} />
        {form.formState.errors.startedAt ? (
          <p className="mt-2 text-sm text-rose-600">{form.formState.errors.startedAt.message}</p>
        ) : null}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Ended At (optional)
        </label>
        <Input type="datetime-local" {...form.register("endedAt")} />
        {form.formState.errors.endedAt ? (
          <p className="mt-2 text-sm text-rose-600">{form.formState.errors.endedAt.message}</p>
        ) : null}
      </div>

      <div>
        <Input placeholder="Note (optional)" {...form.register("note")} />
        {form.formState.errors.note ? (
          <p className="mt-2 text-sm text-rose-600">{form.formState.errors.note.message}</p>
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

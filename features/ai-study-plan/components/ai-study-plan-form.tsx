"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  generateStudyPlanSchema,
  type GenerateStudyPlanInput,
} from "@/features/ai-study-plan/schemas/ai-study-plan-schema";
import { useGenerateStudyPlanMutation } from "@/features/ai-study-plan/hooks/use-generate-study-plan-mutation";
import { useSubjectsQuery } from "@/features/subjects/hooks/use-subjects-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Loader2, Sparkles } from "lucide-react";
import type { AiGeneratedStudyPlan } from "@/types/ai-study-plan";

type AiStudyPlanFormProps = {
  onGenerated: (subjectId: string, plan: AiGeneratedStudyPlan) => void;
};

export function AiStudyPlanForm({ onGenerated }: AiStudyPlanFormProps) {
  const subjectsQuery = useSubjectsQuery();
  const generateMutation = useGenerateStudyPlanMutation();

  const form = useForm<GenerateStudyPlanInput>({
    resolver: zodResolver(generateStudyPlanSchema) as any,
    defaultValues: {
      subjectId: "",
      goal: "",
      difficulty: "BEGINNER",
      deadlineDays: 14,
      availableHoursPerDay: 2,
      additionalNotes: "",
      isCodingRelated: false,
    },
  });

  async function onSubmit(values: GenerateStudyPlanInput) {
    const result = await generateMutation.mutateAsync(values);

    if (!result.success) {
      form.setError("root", {
        message: result.message,
      });
      return;
    }

    form.clearErrors("root");

    if (result.data) {
      onGenerated(values.subjectId, result.data);
    }
  }

  const hasNoSubjects = subjectsQuery.data && subjectsQuery.data.length === 0;

  return (
    <Card className="p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold tracking-tight text-slate-950">
          <Sparkles className="mr-2 inline h-5 w-5 text-slate-600" />
          Generate Plan
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Fill in your learning target and let AI create a study plan.
        </p>
      </div>

      {hasNoSubjects ? (
        <div className="rounded-2xl border border-slate-200 p-4 text-center">
          <p className="text-sm text-slate-500">
            Belum ada subject. Buat subject terlebih dahulu sebelum menggunakan AI generator.
          </p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/subjects">Create Subject</Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Subject</label>
            <select
              className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 placeholder:text-slate-400"
              {...form.register("subjectId")}
            >
              <option value="">Select a subject</option>
              {subjectsQuery.data?.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
            {form.formState.errors.subjectId ? (
              <p className="mt-1 text-sm text-rose-600">
                {form.formState.errors.subjectId.message}
              </p>
            ) : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Goal</label>
            <textarea
              className="flex min-h-[80px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 placeholder:text-slate-400"
              placeholder="e.g. Bisa membuat aplikasi fullstack dengan Next.js"
              {...form.register("goal")}
            />
            {form.formState.errors.goal ? (
              <p className="mt-1 text-sm text-rose-600">{form.formState.errors.goal.message}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Difficulty</label>
            <select
              className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950"
              {...form.register("difficulty")}
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Deadline (days)
              </label>
              <Input
                type="number"
                min={1}
                max={365}
                placeholder="14"
                {...form.register("deadlineDays")}
              />
              {form.formState.errors.deadlineDays ? (
                <p className="mt-1 text-sm text-rose-600">
                  {form.formState.errors.deadlineDays.message}
                </p>
              ) : null}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Hours / day</label>
              <Input
                type="number"
                step={0.5}
                min={0.5}
                max={24}
                placeholder="2"
                {...form.register("availableHoursPerDay")}
              />
              {form.formState.errors.availableHoursPerDay ? (
                <p className="mt-1 text-sm text-rose-600">
                  {form.formState.errors.availableHoursPerDay.message}
                </p>
              ) : null}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Additional Notes (optional)
            </label>
            <textarea
              className="flex min-h-[60px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 placeholder:text-slate-400"
              placeholder="Any specific focus areas?"
              {...form.register("additionalNotes")}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isCodingRelated"
              className="h-4 w-4 rounded border-slate-300 text-slate-600"
              {...form.register("isCodingRelated")}
            />
            <label htmlFor="isCodingRelated" className="text-sm text-slate-700">
              This is coding/project related
            </label>
          </div>

          {form.formState.errors.root ? (
            <p className="text-sm text-rose-600">{form.formState.errors.root.message}</p>
          ) : null}

          <Button type="submit" disabled={generateMutation.isPending} className="w-full">
            {generateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Plan
              </>
            )}
          </Button>
        </form>
      )}
    </Card>
  );
}

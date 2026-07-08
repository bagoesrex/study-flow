"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { subjectSchema, type SubjectInput } from "@/features/subjects/schemas/subject-schema";
import { useCreateSubjectMutation } from "@/features/subjects/hooks/use-create-subject-mutation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export function SubjectCreateForm() {
  const mutation = useCreateSubjectMutation();

  const form = useForm<SubjectInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(subjectSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      color: "#4F46E5",
      targetHours: "",
    },
  });

  async function onSubmit(values: SubjectInput) {
    const result = await mutation.mutateAsync(values);

    if (!result.success) {
      form.setError("root", {
        message: result.message,
      });
      return;
    }

    form.reset({
      name: "",
      description: "",
      color: "#4F46E5",
      targetHours: "",
    });
  }

  return (
    <Card className="p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold tracking-tight text-slate-950">Create Subject</h2>
        <p className="mt-1 text-sm text-slate-500">Tambahkan kategori belajar baru.</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input placeholder="Subject name" {...form.register("name")} />
          {form.formState.errors.name ? (
            <p className="mt-2 text-sm text-rose-600">{form.formState.errors.name.message}</p>
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
            <Input type="color" {...form.register("color")} />
            {form.formState.errors.color ? (
              <p className="mt-2 text-sm text-rose-600">{form.formState.errors.color.message}</p>
            ) : null}
          </div>

          <div>
            <Input type="number" placeholder="Target hours" {...form.register("targetHours")} />
            {form.formState.errors.targetHours ? (
              <p className="mt-2 text-sm text-rose-600">
                {form.formState.errors.targetHours.message}
              </p>
            ) : null}
          </div>
        </div>

        {form.formState.errors.root ? (
          <p className="text-sm text-rose-600">{form.formState.errors.root.message}</p>
        ) : null}

        <Button type="submit" disabled={mutation.isPending} className="w-full">
          {mutation.isPending ? "Creating..." : "Create Subject"}
        </Button>
      </form>
    </Card>
  );
}

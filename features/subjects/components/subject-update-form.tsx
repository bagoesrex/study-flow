"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  updateSubjectSchema,
  type UpdateSubjectInput,
} from "@/features/subjects/schemas/subject-schema";
import { useUpdateSubjectMutation } from "@/features/subjects/hooks/use-update-subject-mutation";
import type { SubjectItem } from "@/types/subject";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SubjectUpdateFormProps = {
  subject: SubjectItem;
  onSuccess: () => void;
};

export function SubjectUpdateForm({ subject, onSuccess }: SubjectUpdateFormProps) {
  const mutation = useUpdateSubjectMutation();

  const form = useForm<UpdateSubjectInput>({
    resolver: zodResolver(updateSubjectSchema) as any,
    defaultValues: {
      id: subject.id,
      name: subject.name,
      description: subject.description ?? "",
      color: subject.color,
      targetHours: subject.targetHours ?? "",
    },
  });

  async function onSubmit(values: UpdateSubjectInput) {
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
        <Input placeholder="Subject name" {...form.register("name")} />
        {form.formState.errors.name ? (
          <p className="mt-2 text-sm text-rose-600">{form.formState.errors.name.message}</p>
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
        {mutation.isPending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}

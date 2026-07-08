"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

import {
  updateProfileSchema,
  type UpdateProfileInput,
} from "@/features/settings/schemas/settings-schema";
import { useUpdateProfileMutation } from "@/features/settings/hooks/use-update-profile-mutation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { CurrentUserProfile } from "@/types/settings";

type ProfileSettingsFormProps = {
  user: CurrentUserProfile;
};

export function ProfileSettingsForm({ user }: ProfileSettingsFormProps) {
  const mutation = useUpdateProfileMutation();
  const prevUserRef = useRef(user);

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      image: user.image ?? "",
    },
  });

  useEffect(() => {
    if (prevUserRef.current !== user) {
      prevUserRef.current = user;
      form.reset({
        name: user.name,
        email: user.email,
        image: user.image ?? "",
      });
    }
  }, [user, form]);

  async function onSubmit(values: UpdateProfileInput) {
    const result = await mutation.mutateAsync(values);

    if (!result.success) {
      form.setError("root", {
        message: result.message,
      });
      return;
    }

    form.clearErrors("root");

    if (result.data) {
      form.reset({
        name: result.data.name,
        email: result.data.email,
        image: result.data.image ?? "",
      });
    }
  }

  const showSuccess = mutation.isSuccess && mutation.data?.success;

  return (
    <Card className="p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold tracking-tight text-slate-950">Profile Information</h2>
        <p className="mt-1 text-sm text-slate-500">Update informasi dasar akun kamu.</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input placeholder="Name" {...form.register("name")} />
          {form.formState.errors.name ? (
            <p className="mt-2 text-sm text-rose-600">{form.formState.errors.name.message}</p>
          ) : null}
        </div>

        <div>
          <Input type="email" placeholder="Email" {...form.register("email")} />
          {form.formState.errors.email ? (
            <p className="mt-2 text-sm text-rose-600">{form.formState.errors.email.message}</p>
          ) : null}
        </div>

        <div>
          <Input placeholder="Profile image URL" {...form.register("image")} />
          {form.formState.errors.image ? (
            <p className="mt-2 text-sm text-rose-600">{form.formState.errors.image.message}</p>
          ) : null}
        </div>

        {form.formState.errors.root ? (
          <p className="text-sm text-rose-600">{form.formState.errors.root.message}</p>
        ) : null}

        {showSuccess ? (
          <p className="text-sm text-emerald-600">Profile berhasil diperbarui.</p>
        ) : null}

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Card>
  );
}

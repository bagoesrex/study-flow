"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { registerSchema, type RegisterInput } from "@/features/auth/schemas/auth-schema";
import { useRegisterMutation } from "@/features/auth/hooks/use-register-mutation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function RegisterForm() {
  const router = useRouter();
  const mutation = useRegisterMutation();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: RegisterInput) {
    const result = await mutation.mutateAsync(values);

    if (result.success) {
      router.push("/login");
      return;
    }

    form.setError("root", {
      message: result.message,
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input placeholder="Nama" {...form.register("name")} />
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
        <Input type="password" placeholder="Password" {...form.register("password")} />
        {form.formState.errors.password ? (
          <p className="mt-2 text-sm text-rose-600">{form.formState.errors.password.message}</p>
        ) : null}
      </div>

      {form.formState.errors.root ? (
        <p className="text-sm text-rose-600">{form.formState.errors.root.message}</p>
      ) : null}

      <Button type="submit" className="w-full" disabled={mutation.isPending}>
        {mutation.isPending ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
}

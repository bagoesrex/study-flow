"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { loginSchema, type LoginInput } from "@/features/auth/schemas/auth-schema";
import { useLoginMutation } from "@/features/auth/hooks/use-login-mutation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();
  const mutation = useLoginMutation();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginInput) {
    const result = await mutation.mutateAsync(values);

    if (result.success) {
      router.push("/dashboard");
      router.refresh();
      return;
    }

    form.setError("root", {
      message: result.message,
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
        {mutation.isPending ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
}

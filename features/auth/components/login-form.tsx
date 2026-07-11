"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { FeedbackMessage } from "@/components/common/feedback-message";
import { LoadingSpinner } from "@/components/common/loading-spinner";
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
        <FeedbackMessage
          variant="error"
          message={form.formState.errors.root.message ?? "Terjadi kesalahan."}
        />
      ) : null}

      <Button type="submit" className="w-full" disabled={mutation.isPending}>
        {mutation.isPending ? (
          <>
            <LoadingSpinner className="mr-2 h-4 w-4" />
            Logging in...
          </>
        ) : (
          "Login"
        )}
      </Button>
    </form>
  );
}

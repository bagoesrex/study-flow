import Link from "next/link";

import { LoginForm } from "@/features/auth/components/login-form";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 sm:px-6">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Login to StudyFlow</h1>
          <p className="mt-2 text-sm text-slate-500">Masuk untuk melanjutkan rencana belajarmu.</p>
        </div>

        <LoginForm />

        <p className="mt-6 text-center text-sm text-slate-500">
          Belum punya akun?{" "}
          <Link href="/register" className="font-medium text-slate-950">
            Register
          </Link>
        </p>
      </Card>
    </main>
  );
}

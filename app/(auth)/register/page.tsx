import Link from "next/link";

import { RegisterForm } from "@/features/auth/components/register-form";
import { Card } from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 sm:px-6">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Create your account</h1>
          <p className="mt-2 text-sm text-slate-500">
            Mulai susun rencana belajar dengan lebih terarah.
          </p>
        </div>

        <RegisterForm />

        <p className="mt-6 text-center text-sm text-slate-500">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-medium text-slate-950">
            Login
          </Link>
        </p>
      </Card>
    </main>
  );
}

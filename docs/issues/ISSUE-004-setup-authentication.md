# ISSUE-004 — Setup Authentication

## Status

Planned

## Priority

High

## Type

Authentication / Security

## Summary

Setup authentication untuk StudyFlow menggunakan Auth.js Credentials Provider, Drizzle ORM, PostgreSQL, Server Actions di folder root `actions/`, dan TanStack Query untuk mutation login/register di client.

Issue ini akan membuat flow auth dasar:

```txt
Register → Login → Protected Dashboard → Logout
```

Authentication menggunakan email dan password. Password akan di-hash sebelum disimpan ke database. Login akan memvalidasi email/password dari tabel `users`.

## Background

Pada issue sebelumnya, project sudah memiliki database schema menggunakan Drizzle dan PostgreSQL.

Tabel `users` sudah memiliki field:

```txt
id
name
email
password_hash
image
role
created_at
updated_at
```

Pada issue ini, data user tersebut akan digunakan untuk register dan login.

Project juga akan memakai folder root `actions/` agar semua Server Actions lebih terorganisir dan tidak tercampur dengan UI component.

## Goals

- Menginstall Auth.js / NextAuth.
- Menginstall bcrypt untuk hash password.
- Menginstall TanStack Query.
- Menginstall React Hook Form dan resolver Zod.
- Membuat konfigurasi Auth.js.
- Membuat route handler Auth.js.
- Membuat password utility.
- Membuat validation schema untuk login/register.
- Membuat Server Actions di folder `actions/`.
- Membuat TanStack Query Provider.
- Membuat login/register mutation hooks.
- Membuat halaman login.
- Membuat halaman register.
- Membuat protected dashboard route.
- Membuat logout action.
- Menambahkan environment variable auth.
- Memastikan user bisa register, login, logout, dan mengakses dashboard.

## Non-Goals

- Tidak membuat OAuth Google/GitHub.
- Tidak membuat forgot password.
- Tidak membuat email verification.
- Tidak membuat reset password.
- Tidak membuat two-factor authentication.
- Tidak membuat role admin dashboard.
- Tidak membuat user profile edit.
- Tidak membuat CRUD subject/study plan/task.
- Tidak membuat session table custom.
- Tidak membuat rate limiting.
- Tidak membuat captcha.

## Tech Stack

- Auth.js / NextAuth
- Drizzle ORM
- PostgreSQL
- bcryptjs
- Zod
- React Hook Form
- TanStack Query
- Server Actions
- Next.js App Router

## Folder Structure

Karena project tidak menggunakan `src/`, gunakan struktur berikut:

```txt
actions/
├── auth.ts

app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx
│   └── register/
│       └── page.tsx
├── api/
│   └── auth/
│       └── [...nextauth]/
│           └── route.ts
├── dashboard/
│   └── page.tsx
├── layout.tsx
└── providers.tsx

components/
├── providers/
│   └── query-provider.tsx

features/
└── auth/
    ├── components/
    │   ├── login-form.tsx
    │   └── register-form.tsx
    ├── hooks/
    │   ├── use-login-mutation.ts
    │   └── use-register-mutation.ts
    └── schemas/
        └── auth-schema.ts

lib/
├── password.ts
└── auth-guard.ts

types/
├── action-response.ts
└── next-auth.d.ts

auth.ts
proxy.ts
```

## Required Packages

Install package berikut:

```bash
pnpm add next-auth bcryptjs zod @tanstack/react-query @tanstack/react-query-devtools react-hook-form @hookform/resolvers
```

Jika TypeScript memberi error untuk bcryptjs, install type tambahan:

```bash
pnpm add -D @types/bcryptjs
```

## Environment Variables

Update file:

```txt
.env
```

Tambahkan:

```env
AUTH_SECRET="your-random-secret"
AUTH_URL="http://localhost:3000"
```

Update file:

```txt
.env.example
```

Tambahkan:

```env
AUTH_SECRET="your-random-secret"
AUTH_URL="http://localhost:3000"
```

Catatan:

- Jangan commit `.env`.
- Commit `.env.example`.
- Untuk production, `AUTH_URL` disesuaikan dengan domain deploy.
- `AUTH_SECRET` harus random dan panjang.

## Authentication Strategy

Gunakan strategy:

```txt
Credentials Provider + JWT Session
```

Alasan:

- Tabel `users` sudah custom.
- Password disimpan di `users.password_hash`.
- Tidak perlu membuat tabel session Auth.js dulu.
- Cocok untuk MVP portfolio.
- Lebih sederhana untuk integrasi Drizzle custom schema.

## Implementation Steps

### 1. Install Dependencies

Jalankan:

```bash
pnpm add next-auth bcryptjs zod @tanstack/react-query @tanstack/react-query-devtools react-hook-form @hookform/resolvers
```

Lalu jalankan:

```bash
pnpm lint
pnpm format
```

Expected:

```txt
Tidak ada error lint dan format.
```

---

### 2. Create Action Response Type

Buat file:

```txt
types/action-response.ts
```

Isi:

```ts
export type ActionResponse<T = null> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
};
```

Tujuan:

- Semua Server Actions punya format response konsisten.
- Client lebih mudah membaca success/error.
- TanStack Query mutation lebih rapi.

---

### 3. Create Auth Validation Schema

Buat file:

```txt
features/auth/schemas/auth-schema.ts
```

Isi:

```ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid").toLowerCase(),
  password: z.string().min(1, "Password wajib diisi"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid").toLowerCase(),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
```

---

### 4. Create Password Utility

Buat file:

```txt
lib/password.ts
```

Isi:

```ts
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export async function hashPassword(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword);
}
```

---

### 5. Create Auth.js Config

Buat file di root project:

```txt
auth.ts
```

Isi:

```ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema";
import { loginSchema } from "@/features/auth/schemas/auth-schema";
import { verifyPassword } from "@/lib/password";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;

        const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

        if (!user || !user.passwordHash) {
          return null;
        }

        const isPasswordValid = await verifyPassword(password, user.passwordHash);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "USER" | "ADMIN";
      }

      return session;
    },
  },
});
```

Catatan:

- Auth.js akan memakai `authorize()` untuk validasi login.
- Jika `authorize()` return `null`, login gagal.
- Session memakai JWT agar tidak perlu Auth.js session table dulu.

---

### 6. Create NextAuth Type Declaration

Buat file:

```txt
types/next-auth.d.ts
```

Isi:

```ts
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "USER" | "ADMIN";
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    role: "USER" | "ADMIN";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "USER" | "ADMIN";
  }
}
```

---

### 7. Create Auth Route Handler

Buat folder:

```txt
app/api/auth/[...nextauth]/
```

Buat file:

```txt
app/api/auth/[...nextauth]/route.ts
```

Isi:

```ts
import { handlers } from "@/auth";

export const { GET, POST } = handlers;
```

---

### 8. Create Server Actions Folder

Buat folder di root:

```txt
actions/
```

Buat file:

```txt
actions/auth.ts
```

Isi:

```ts
"use server";

import { AuthError } from "next-auth";
import { eq } from "drizzle-orm";

import { signIn, signOut } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import {
  loginSchema,
  type LoginInput,
  registerSchema,
  type RegisterInput,
} from "@/features/auth/schemas/auth-schema";
import { hashPassword } from "@/lib/password";
import type { ActionResponse } from "@/types/action-response";

export async function registerAction(
  input: RegisterInput
): Promise<ActionResponse<{ userId: string }>> {
  const parsed = registerSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Input tidak valid.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = parsed.data;

  const [existingUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser) {
    return {
      success: false,
      message: "Email sudah terdaftar.",
    };
  }

  const passwordHash = await hashPassword(password);

  const [newUser] = await db
    .insert(users)
    .values({
      name,
      email,
      passwordHash,
      role: "USER",
    })
    .returning({
      id: users.id,
    });

  return {
    success: true,
    message: "Registrasi berhasil. Silakan login.",
    data: {
      userId: newUser.id,
    },
  };
}

export async function loginAction(input: LoginInput): Promise<ActionResponse> {
  const parsed = loginSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Input tidak valid.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });

    return {
      success: true,
      message: "Login berhasil.",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        message: "Email atau password salah.",
      };
    }

    return {
      success: false,
      message: "Terjadi kesalahan saat login.",
    };
  }
}

export async function logoutAction() {
  await signOut({
    redirectTo: "/login",
  });
}
```

Catatan:

- `registerAction` membuat user baru.
- `loginAction` memanggil Auth.js `signIn`.
- `logoutAction` memanggil Auth.js `signOut`.
- Semua action berada di folder root `actions/`.

---

### 9. Create TanStack Query Provider

Buat folder:

```txt
components/providers/
```

Buat file:

```txt
components/providers/query-provider.tsx
```

Isi:

```tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

type QueryProviderProps = {
  children: React.ReactNode;
};

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

---

### 10. Create App Providers

Buat file:

```txt
app/providers.tsx
```

Isi:

```tsx
import { QueryProvider } from "@/components/providers/query-provider";

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return <QueryProvider>{children}</QueryProvider>;
}
```

---

### 11. Update Root Layout

Edit file:

```txt
app/layout.tsx
```

Pastikan children dibungkus dengan `Providers`.

Contoh:

```tsx
import type { Metadata } from "next";

import { Providers } from "@/app/providers";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "StudyFlow",
  description: "A modern study planner for focused learners.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

---

### 12. Create Login Mutation Hook

Buat file:

```txt
features/auth/hooks/use-login-mutation.ts
```

Isi:

```ts
"use client";

import { useMutation } from "@tanstack/react-query";

import { loginAction } from "@/actions/auth";
import type { LoginInput } from "@/features/auth/schemas/auth-schema";

export function useLoginMutation() {
  return useMutation({
    mutationFn: (input: LoginInput) => loginAction(input),
  });
}
```

---

### 13. Create Register Mutation Hook

Buat file:

```txt
features/auth/hooks/use-register-mutation.ts
```

Isi:

```ts
"use client";

import { useMutation } from "@tanstack/react-query";

import { registerAction } from "@/actions/auth";
import type { RegisterInput } from "@/features/auth/schemas/auth-schema";

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (input: RegisterInput) => registerAction(input),
  });
}
```

---

### 14. Create Login Form

Buat file:

```txt
features/auth/components/login-form.tsx
```

Isi minimal:

```tsx
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
```

---

### 15. Create Register Form

Buat file:

```txt
features/auth/components/register-form.tsx
```

Isi minimal:

```tsx
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
```

---

### 16. Create Login Page

Buat folder:

```txt
app/(auth)/login/
```

Buat file:

```txt
app/(auth)/login/page.tsx
```

Isi:

```tsx
import Link from "next/link";

import { LoginForm } from "@/features/auth/components/login-form";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
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
```

---

### 17. Create Register Page

Buat folder:

```txt
app/(auth)/register/
```

Buat file:

```txt
app/(auth)/register/page.tsx
```

Isi:

```tsx
import Link from "next/link";

import { RegisterForm } from "@/features/auth/components/register-form";
import { Card } from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
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
```

---

### 18. Create Auth Guard Helper

Buat file:

```txt
lib/auth-guard.ts
```

Isi:

```ts
import { redirect } from "next/navigation";

import { auth } from "@/auth";

export async function requireUser() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return session.user;
}
```

---

### 19. Protect Dashboard Page

Edit file:

```txt
app/dashboard/page.tsx
```

Tambahkan auth guard di awal page component:

```tsx
import { requireUser } from "@/lib/auth-guard";

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <DashboardShell>
      <div>
        <p className="text-sm text-slate-500">Welcome back, {user.name}</p>
      </div>

      {/* existing dashboard content */}
    </DashboardShell>
  );
}
```

Catatan:

- Jangan hanya mengandalkan proxy untuk proteksi data.
- Server Component dashboard tetap wajib cek session.
- Nanti semua Server Actions untuk CRUD juga wajib cek session.

---

### 20. Create Proxy Route Protection

Buat file di root project:

```txt
proxy.ts
```

Isi:

```ts
import { NextResponse } from "next/server";

import { auth } from "@/auth";

const authRoutes = ["/login", "/register"];

export default auth((request) => {
  const isLoggedIn = Boolean(request.auth);
  const pathname = request.nextUrl.pathname;

  const isAuthRoute = authRoutes.includes(pathname);
  const isDashboardRoute = pathname.startsWith("/dashboard");

  if (isDashboardRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
```

Catatan:

- Untuk Next.js versi baru, gunakan `proxy.ts`.
- Jika project kamu masih memakai convention lama, file ini bisa diganti menjadi `middleware.ts`.
- Proteksi utama tetap harus ada di server component/action, bukan hanya proxy.

---

### 21. Add Logout Button Optional

Buat file:

```txt
features/auth/components/logout-button.tsx
```

Isi:

```tsx
import { logoutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Button type="submit" variant="outline">
        Logout
      </Button>
    </form>
  );
}
```

Nanti bisa dipasang di dashboard header atau sidebar.

---

## Expected Folder Structure

Setelah issue selesai:

```txt
actions/
└── auth.ts

app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx
│   └── register/
│       └── page.tsx
├── api/
│   └── auth/
│       └── [...nextauth]/
│           └── route.ts
├── dashboard/
│   └── page.tsx
├── layout.tsx
└── providers.tsx

components/
└── providers/
    └── query-provider.tsx

features/
└── auth/
    ├── components/
    │   ├── login-form.tsx
    │   ├── logout-button.tsx
    │   └── register-form.tsx
    ├── hooks/
    │   ├── use-login-mutation.ts
    │   └── use-register-mutation.ts
    └── schemas/
        └── auth-schema.ts

lib/
├── auth-guard.ts
└── password.ts

types/
├── action-response.ts
└── next-auth.d.ts

auth.ts
proxy.ts
```

## Acceptance Criteria

- Package `next-auth` berhasil diinstall.
- Package `bcryptjs` berhasil diinstall.
- Package `zod` berhasil diinstall.
- Package `@tanstack/react-query` berhasil diinstall.
- Package `@tanstack/react-query-devtools` berhasil diinstall.
- Package `react-hook-form` berhasil diinstall.
- Package `@hookform/resolvers` berhasil diinstall.
- Environment variable `AUTH_SECRET` tersedia.
- Environment variable `AUTH_URL` tersedia.
- File `auth.ts` tersedia di root project.
- File `app/api/auth/[...nextauth]/route.ts` tersedia.
- Folder `actions/` tersedia di root project.
- File `actions/auth.ts` tersedia.
- `registerAction` tersedia.
- `loginAction` tersedia.
- `logoutAction` tersedia.
- Password user di-hash sebelum masuk database.
- Password plain text tidak pernah disimpan.
- Login menggunakan Auth.js Credentials Provider.
- TanStack Query Provider tersedia.
- Login mutation hook tersedia.
- Register mutation hook tersedia.
- Login page tersedia di `/login`.
- Register page tersedia di `/register`.
- Dashboard route terlindungi.
- User yang belum login diarahkan ke `/login` saat mengakses `/dashboard`.
- User yang sudah login diarahkan ke `/dashboard` saat membuka `/login` atau `/register`.
- Logout berhasil menghapus session.
- Tidak ada fitur OAuth di issue ini.
- Tidak ada CRUD study plan/task di issue ini.
- Tidak ada folder auth di dalam `src/`.
- Tidak ada error TypeScript.
- Tidak ada error lint.
- `pnpm format:check` berhasil.

## Testing Checklist

### 1. Run Development Server

Jalankan:

```bash
pnpm dev
```

Expected:

```txt
Aplikasi berjalan di localhost:3000.
```

---

### 2. Test Register

Buka:

```txt
http://localhost:3000/register
```

Input:

```txt
Name: Demo User
Email: demo@example.com
Password: password123
```

Expected:

```txt
User berhasil dibuat.
Password tersimpan sebagai hash.
User diarahkan ke halaman login.
```

Cek database:

```txt
users.email = demo@example.com
users.password_hash tidak null
users.password_hash bukan "password123"
```

---

### 3. Test Login

Buka:

```txt
http://localhost:3000/login
```

Input:

```txt
Email: demo@example.com
Password: password123
```

Expected:

```txt
Login berhasil.
User diarahkan ke /dashboard.
```

---

### 4. Test Invalid Login

Input password salah.

Expected:

```txt
Login gagal.
Muncul pesan error.
User tetap di halaman login.
```

---

### 5. Test Protected Dashboard

Logout, lalu buka:

```txt
http://localhost:3000/dashboard
```

Expected:

```txt
User diarahkan ke /login.
```

---

### 6. Test Auth Route Redirect

Saat sudah login, buka:

```txt
http://localhost:3000/login
http://localhost:3000/register
```

Expected:

```txt
User diarahkan ke /dashboard.
```

---

### 7. Test Logout

Klik logout.

Expected:

```txt
Session terhapus.
User diarahkan ke /login.
```

---

### 8. Run Checks

Jalankan:

```bash
pnpm lint
pnpm format:check
pnpm build
```

Expected:

```txt
Tidak ada lint error.
Tidak ada format error.
Build berhasil.
```

## Notes

- Gunakan folder root `actions/`.
- Jangan taruh action di dalam component.
- Jangan taruh action di dalam `src/`.
- Jangan validasi auth hanya di client.
- Semua Server Actions yang mengubah data harus validasi input pakai Zod.
- Semua Server Actions yang butuh user login harus cek session dengan `auth()`.
- Jangan menyimpan password plain text.
- Jangan expose `passwordHash` ke client.
- TanStack Query digunakan untuk mutation login/register.
- Untuk data dashboard nanti, boleh tetap ambil dari Server Component dulu agar simpel.
- TanStack Query untuk data dashboard bisa dibuat di issue berikutnya jika butuh interaksi client-side.

## Suggested Commit Message

```bash
feat: setup authentication
```

Simpan sebagai:

```txt
docs/issues/ISSUE-012-build-user-settings-page.md
```

# ISSUE-012 — Build User Settings Page

## Status

Planned

## Priority

Medium

## Type

Feature / User Account

## Summary

Membangun halaman User Settings untuk StudyFlow. Halaman ini digunakan user untuk melihat dan mengubah informasi akun dasar seperti nama, email, dan profile image URL.

Issue ini melanjutkan fitur authentication yang sudah dibuat sebelumnya. Setelah user bisa register dan login, user perlu memiliki halaman pengaturan akun agar aplikasi terasa lebih lengkap dan production-ready.

Route utama:

```txt
/dashboard/settings
```

## Background

StudyFlow sudah memiliki authentication menggunakan Auth.js Credentials Provider. Tabel `users` sudah menyimpan data:

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

Pada issue ini, user bisa memperbarui data dasar akun miliknya sendiri.

Fitur ini penting untuk portfolio karena menunjukkan kemampuan:

```txt
Authenticated user update
Server Actions
Form validation
User-specific database update
Session-safe data handling
TanStack Query mutation
Clean dashboard settings UI
```

## Goals

- Membuat halaman User Settings.
- Menampilkan informasi user yang sedang login.
- User bisa mengubah nama.
- User bisa mengubah email.
- User bisa mengubah profile image URL.
- Validasi input menggunakan Zod.
- Form menggunakan React Hook Form.
- Update menggunakan Server Actions di folder root `actions/`.
- Mutation menggunakan TanStack Query.
- Semua action wajib memvalidasi session user.
- User hanya bisa mengubah data miliknya sendiri.
- Menampilkan loading state.
- Menampilkan error state.
- Menampilkan success state sederhana.
- Memastikan email baru tidak dipakai user lain.
- Memastikan password hash tidak pernah dikirim ke client.
- UI mengikuti clean white dashboard style StudyFlow.

## Non-Goals

- Tidak membuat change password.
- Tidak membuat forgot password.
- Tidak membuat email verification.
- Tidak membuat upload image ke storage.
- Tidak membuat delete account.
- Tidak membuat OAuth account linking.
- Tidak membuat role management.
- Tidak membuat admin settings.
- Tidak membuat notification settings.
- Tidak membuat theme settings.
- Tidak membuat API route.
- Tidak mengubah schema database.
- Tidak menambahkan shadcn/ui.

## Tech Stack

- Next.js App Router
- TypeScript
- Drizzle ORM
- PostgreSQL
- Auth.js
- Server Actions
- TanStack Query
- React Hook Form
- Zod
- Tailwind CSS
- Custom UI Components
- Lucide React

## Route

Fitur ini berada di:

```txt
/dashboard/settings
```

## Database Table

Gunakan tabel yang sudah ada:

```txt
users
```

Field yang boleh diupdate:

```txt
name
email
image
updated_at
```

Field yang tidak boleh diupdate pada issue ini:

```txt
id
password_hash
role
created_at
```

## Folder Structure

Gunakan struktur tanpa `src/`.

```txt
actions/
└── settings.ts

app/
└── dashboard/
    └── settings/
        └── page.tsx

features/
└── settings/
    ├── components/
    │   ├── account-info-card.tsx
    │   ├── profile-settings-form.tsx
    │   └── settings-page-header.tsx
    ├── hooks/
    │   ├── use-current-user-query.ts
    │   └── use-update-profile-mutation.ts
    └── schemas/
        └── settings-schema.ts

types/
└── settings.ts
```

## Implementation Steps

### 1. Create Settings Types

Buat file:

```txt
types/settings.ts
```

Isi:

```ts
export type CurrentUserProfile = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: "USER" | "ADMIN";
  createdAt: Date;
  updatedAt: Date;
};
```

---

### 2. Create Settings Validation Schema

Buat file:

```txt
features/settings/schemas/settings-schema.ts
```

Isi:

```ts
import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").max(120, "Nama maksimal 120 karakter"),
  email: z.string().email("Email tidak valid").toLowerCase(),
  image: z.string().url("Image harus berupa URL valid").optional().or(z.literal("")),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
```

Catatan:

- Image menggunakan URL dulu.
- Upload image ke storage tidak dibuat di issue ini.
- Jika image kosong, simpan sebagai `null`.

---

### 3. Create Settings Actions

Buat file:

```txt
actions/settings.ts
```

Isi:

```ts
"use server";

import { and, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import {
  updateProfileSchema,
  type UpdateProfileInput,
} from "@/features/settings/schemas/settings-schema";
import type { ActionResponse } from "@/types/action-response";
import type { CurrentUserProfile } from "@/types/settings";

function normalizeImage(value?: string) {
  if (!value || value.trim().length === 0) {
    return null;
  }

  return value.trim();
}

async function requireAuthUser() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return session.user;
}

export async function getCurrentUserAction(): Promise<ActionResponse<CurrentUserProfile>> {
  try {
    const sessionUser = await requireAuthUser();

    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, sessionUser.id))
      .limit(1);

    if (!user) {
      return {
        success: false,
        message: "User tidak ditemukan.",
      };
    }

    return {
      success: true,
      message: "User berhasil diambil.",
      data: user,
    };
  } catch {
    return {
      success: false,
      message: "Gagal mengambil data user.",
    };
  }
}

export async function updateProfileAction(
  input: UpdateProfileInput
): Promise<ActionResponse<CurrentUserProfile>> {
  const parsed = updateProfileSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Input tidak valid.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const sessionUser = await requireAuthUser();

    const [existingEmailUser] = await db
      .select({
        id: users.id,
      })
      .from(users)
      .where(and(eq(users.email, parsed.data.email), ne(users.id, sessionUser.id)))
      .limit(1);

    if (existingEmailUser) {
      return {
        success: false,
        message: "Email sudah digunakan oleh user lain.",
      };
    }

    const [updatedUser] = await db
      .update(users)
      .set({
        name: parsed.data.name.trim(),
        email: parsed.data.email,
        image: normalizeImage(parsed.data.image),
        updatedAt: new Date(),
      })
      .where(eq(users.id, sessionUser.id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Profile berhasil diperbarui.",
      data: updatedUser,
    };
  } catch {
    return {
      success: false,
      message: "Gagal memperbarui profile.",
    };
  }
}
```

Catatan:

- Jangan return `passwordHash`.
- Jangan izinkan user mengubah `role`.
- Email harus unik.
- Session JWT mungkin belum langsung berubah setelah update name/email. Untuk MVP, tampilkan data dari query database di Settings. Refresh session bisa dibuat di issue polish.

---

### 4. Create Current User Query Hook

Buat file:

```txt
features/settings/hooks/use-current-user-query.ts
```

Isi:

```ts
"use client";

import { useQuery } from "@tanstack/react-query";

import { getCurrentUserAction } from "@/actions/settings";

export const currentUserQueryKey = ["current-user"];

export function useCurrentUserQuery() {
  return useQuery({
    queryKey: currentUserQueryKey,
    queryFn: async () => {
      const result = await getCurrentUserAction();

      if (!result.success || !result.data) {
        throw new Error(result.message);
      }

      return result.data;
    },
  });
}
```

---

### 5. Create Update Profile Mutation Hook

Buat file:

```txt
features/settings/hooks/use-update-profile-mutation.ts
```

Isi:

```ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateProfileAction } from "@/actions/settings";
import type { UpdateProfileInput } from "@/features/settings/schemas/settings-schema";
import { currentUserQueryKey } from "@/features/settings/hooks/use-current-user-query";

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProfileInput) => updateProfileAction(input),
    onSuccess: async (result) => {
      if (result.success) {
        await queryClient.invalidateQueries({
          queryKey: currentUserQueryKey,
        });
      }
    },
  });
}
```

---

### 6. Create Settings Page Header

Buat file:

```txt
features/settings/components/settings-page-header.tsx
```

Isi:

```tsx
export function SettingsPageHeader() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-950">Settings</h1>
      <p className="mt-2 text-sm text-slate-500">
        Kelola informasi akun dan profil StudyFlow kamu.
      </p>
    </div>
  );
}
```

---

### 7. Create Account Info Card

Buat file:

```txt
features/settings/components/account-info-card.tsx
```

Isi:

```tsx
import { UserCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { CurrentUserProfile } from "@/types/settings";

type AccountInfoCardProps = {
  user: CurrentUserProfile;
};

export function AccountInfoCard({ user }: AccountInfoCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-slate-100 text-slate-600">
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
          ) : (
            <UserCircle className="h-7 w-7" />
          )}
        </div>

        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h2 className="truncate text-lg font-semibold tracking-tight text-slate-950">
              {user.name}
            </h2>
            <Badge variant="info">{user.role}</Badge>
          </div>

          <p className="text-sm text-slate-500">{user.email}</p>

          <p className="mt-4 text-xs text-slate-400">
            Account created at{" "}
            {new Intl.DateTimeFormat("id-ID", {
              dateStyle: "medium",
            }).format(user.createdAt)}
          </p>
        </div>
      </div>
    </Card>
  );
}
```

Catatan:

- Untuk MVP, `img` biasa boleh digunakan.
- Jika ingin pakai `next/image`, pastikan domain remote image dikonfigurasi.

---

### 8. Create Profile Settings Form

Buat file:

```txt
features/settings/components/profile-settings-form.tsx
```

Isi:

```tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
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

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      image: user.image ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      name: user.name,
      email: user.email,
      image: user.image ?? "",
    });
  }, [form, user]);

  async function onSubmit(values: UpdateProfileInput) {
    const result = await mutation.mutateAsync(values);

    if (!result.success) {
      form.setError("root", {
        message: result.message,
      });
      return;
    }

    form.clearErrors("root");
  }

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

        {mutation.isSuccess && mutation.data.success ? (
          <p className="text-sm text-emerald-600">Profile berhasil diperbarui.</p>
        ) : null}

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Card>
  );
}
```

---

### 9. Update Settings Page

Edit file:

```txt
app/dashboard/settings/page.tsx
```

Isi:

```tsx
"use client";

import { AccountInfoCard } from "@/features/settings/components/account-info-card";
import { ProfileSettingsForm } from "@/features/settings/components/profile-settings-form";
import { SettingsPageHeader } from "@/features/settings/components/settings-page-header";
import { useCurrentUserQuery } from "@/features/settings/hooks/use-current-user-query";
import { Card } from "@/components/ui/card";

export default function SettingsPage() {
  const query = useCurrentUserQuery();

  if (query.isLoading) {
    return (
      <div className="space-y-6">
        <SettingsPageHeader />

        <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
          <Card className="h-40 animate-pulse bg-slate-100" />
          <Card className="h-72 animate-pulse bg-slate-100" />
        </div>
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className="space-y-6">
        <SettingsPageHeader />

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-slate-950">Gagal memuat settings</h2>
          <p className="mt-2 text-sm text-slate-500">
            Silakan refresh halaman atau coba lagi nanti.
          </p>
        </Card>
      </div>
    );
  }

  const user = query.data;

  return (
    <div className="space-y-6">
      <SettingsPageHeader />

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <AccountInfoCard user={user} />
        <ProfileSettingsForm user={user} />
      </div>
    </div>
  );
}
```

Catatan:

- Settings page dibuat client component karena memakai TanStack Query.
- Alternatif server-first bisa dibuat nanti jika ingin mengurangi client fetching.

---

### 10. Optional: Update Dashboard Topbar User Data

Jika dashboard topbar masih mengambil data dari session, nama/email mungkin belum update langsung setelah settings diubah.

Untuk issue ini, cukup beri catatan:

```txt
Setelah update email/name, user bisa refresh halaman atau login ulang agar session display ikut berubah.
```

Improvement ini bisa dibuat issue terpisah:

```txt
ISSUE-XXX — Sync Auth Session After Profile Update
```

---

### 11. Run Checks

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

## Expected Folder Structure

Setelah issue selesai:

```txt
actions/
└── settings.ts

app/
└── dashboard/
    └── settings/
        └── page.tsx

features/
└── settings/
    ├── components/
    │   ├── account-info-card.tsx
    │   ├── profile-settings-form.tsx
    │   └── settings-page-header.tsx
    ├── hooks/
    │   ├── use-current-user-query.ts
    │   └── use-update-profile-mutation.ts
    └── schemas/
        └── settings-schema.ts

types/
└── settings.ts
```

## Acceptance Criteria

- Halaman `/dashboard/settings` tersedia.
- Halaman hanya bisa diakses user yang sudah login.
- Data user yang sedang login tampil.
- User bisa mengubah nama.
- User bisa mengubah email.
- User bisa mengubah profile image URL.
- Email baru tidak boleh sama dengan email user lain.
- Password hash tidak pernah dikirim ke client.
- Role tidak bisa diubah dari settings page.
- Form update menggunakan React Hook Form.
- Validasi input menggunakan Zod.
- Mutation update menggunakan TanStack Query.
- Current user query menggunakan TanStack Query.
- Query current user di-invalidate setelah update berhasil.
- Server Actions berada di folder root `actions/`.
- Server Actions memvalidasi session user.
- Query database memfilter berdasarkan user login.
- Loading state tampil saat data sedang dimuat.
- Error state tampil jika gagal mengambil data.
- Success message tampil setelah update berhasil.
- UI mengikuti clean white dashboard style.
- Tidak ada API route baru.
- Tidak ada schema database yang diubah.
- Tidak ada shadcn/ui yang ditambahkan.
- Tidak ada folder di dalam `src/`.
- Tidak ada error TypeScript.
- Tidak ada error lint.
- `pnpm format:check` berhasil.
- `pnpm build` berhasil.

## Testing Checklist

### 1. Run Development Server

Jalankan:

```bash
pnpm dev
```

Buka:

```txt
http://localhost:3000/dashboard/settings
```

Expected:

```txt
Halaman Settings tampil.
```

---

### 2. Test Protected Access

Logout, lalu buka:

```txt
http://localhost:3000/dashboard/settings
```

Expected:

```txt
User diarahkan ke /login.
```

---

### 3. Test Display Current User

Login sebagai user.

Expected:

```txt
Nama, email, role, image, dan tanggal pembuatan akun tampil.
Password hash tidak tampil.
```

---

### 4. Test Update Name

Ubah nama:

```txt
Bagus Rex Updated
```

Expected:

```txt
Nama berhasil diperbarui.
Data database berubah.
Success message tampil.
```

---

### 5. Test Update Email

Ubah email menjadi email valid baru.

Expected:

```txt
Email berhasil diperbarui.
Data database berubah.
```

---

### 6. Test Duplicate Email

Ubah email menjadi email yang sudah digunakan user lain.

Expected:

```txt
Update gagal.
Muncul pesan email sudah digunakan.
Database tidak berubah.
```

---

### 7. Test Invalid Image URL

Input image:

```txt
not-a-url
```

Expected:

```txt
Validasi gagal.
Muncul pesan image harus berupa URL valid.
```

---

### 8. Test Empty Image

Kosongkan image URL.

Expected:

```txt
Image tersimpan sebagai null.
Avatar fallback tampil.
```

---

### 9. Test User Isolation

Login sebagai user A.

Coba update profile user A.

Login sebagai user B.

Expected:

```txt
User B hanya melihat data miliknya sendiri.
User B tidak bisa mengubah data user A.
```

---

### 10. Run Checks

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

- Jangan membuat change password di issue ini.
- Jangan membuat forgot password di issue ini.
- Jangan membuat upload image di issue ini.
- Jangan membuat delete account di issue ini.
- Jangan membuat API route.
- Jangan expose `passwordHash`.
- Jangan izinkan update `role`.
- Jangan izinkan update user lain.
- Jika nama/email di topbar belum langsung berubah karena session JWT, itu bisa ditangani di issue polish terpisah.
- Settings page ini cukup untuk MVP portfolio.

## Suggested Commit Message

```bash
feat: build user settings page
```

# ISSUE-001 — Project Setup: Next.js, Tailwind, Prettier, and Husky

## Status

Planned

## Priority

High

## Type

Setup / Foundation

## Summary

Setup project awal StudyFlow menggunakan Next.js App Router, TypeScript, Tailwind CSS, Prettier, Prettier Tailwind plugin, ESLint, dan Husky. Issue ini menjadi pondasi awal sebelum masuk ke fitur aplikasi seperti authentication, dashboard, study plan, task, dan analytics.

## Background

Project StudyFlow akan dikembangkan menggunakan pendekatan issue-first development. Setiap perubahan besar harus dimulai dari issue agar pengerjaan lebih terarah, mudah dilacak, dan tidak melebar.

Pada issue pertama ini, fokus hanya pada setup project dan tooling dasar. Belum perlu membuat fitur aplikasi, database, authentication, atau dashboard.

## Goals

- Membuat project Next.js baru.
- Menggunakan App Router.
- Menggunakan TypeScript.
- Menggunakan Tailwind CSS.
- Menggunakan alias import `@/*`.
- Menambahkan Prettier.
- Menambahkan Prettier plugin untuk Tailwind CSS.
- Menambahkan script format.
- Menambahkan Husky untuk pre-commit hook.
- Menjalankan lint dan format sebelum commit.
- Membuat struktur folder awal yang rapi.

## Non-Goals

- Belum membuat authentication.
- Belum membuat database.
- Belum setup Prisma.
- Belum membuat dashboard.
- Belum membuat landing page final.
- Belum membuat CRUD.
- Belum setup shadcn/ui.
- Belum deploy ke Vercel.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- ESLint
- Prettier
- prettier-plugin-tailwindcss
- Husky
- pnpm

## Package Manager

Gunakan `pnpm`.

## Implementation Steps

### 1. Create Next.js Project

Buat project baru menggunakan command berikut:

```bash
pnpm create next-app studyflow
```

Gunakan pilihan berikut saat prompt muncul:

```txt
TypeScript: Yes
ESLint: Yes
Tailwind CSS: Yes
src/ directory: Yes
App Router: Yes
Turbopack: Yes
Import alias: Yes
Import alias value: @/*
```

Masuk ke folder project:

```bash
cd studyflow
```

Jalankan development server:

```bash
pnpm dev
```

Pastikan aplikasi bisa berjalan di:

```txt
http://localhost:3000
```

---

### 2. Clean Default Files

Rapikan file default dari Next.js.

File yang perlu dicek:

```txt
src/app/page.tsx
src/app/layout.tsx
src/app/globals.css
```

Untuk sementara, `page.tsx` cukup menampilkan halaman sederhana:

```tsx
export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-4xl font-bold tracking-tight">StudyFlow</h1>
    </main>
  );
}
```

---

### 3. Setup Basic Folder Structure

Buat struktur folder awal:

```txt
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── common/
│   ├── layout/
│   └── ui/
├── constants/
├── features/
├── hooks/
├── lib/
├── types/
└── utils/
```

Penjelasan folder:

```txt
components/common  = komponen reusable umum
components/layout  = navbar, footer, sidebar, dashboard layout
components/ui      = komponen UI dasar
constants          = data statis seperti nav link dan config
features           = fitur utama aplikasi
hooks              = custom React hooks
lib                = helper library, config, dan server utilities
types              = global TypeScript types
utils              = utility function umum
```

---

### 4. Install Prettier and Tailwind Plugin

Install Prettier dan plugin Tailwind:

```bash
pnpm add -D prettier prettier-plugin-tailwindcss
```

Buat file `.prettierrc` di root project:

```json
{
  "plugins": ["prettier-plugin-tailwindcss"],
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

Buat file `.prettierignore`:

```txt
.next
node_modules
dist
build
coverage
pnpm-lock.yaml
```

---

### 5. Add Format Scripts

Tambahkan script berikut di `package.json`:

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

Catatan:

Jika versi Next.js yang digunakan tidak lagi memakai `next lint`, sesuaikan script lint mengikuti konfigurasi ESLint yang dibuat oleh `create-next-app`.

---

### 6. Run Format

Jalankan:

```bash
pnpm format
```

Lalu cek:

```bash
pnpm format:check
```

Pastikan tidak ada error format.

---

### 7. Setup Husky

Install Husky:

```bash
pnpm add -D husky
```

Inisialisasi Husky:

```bash
pnpm exec husky init
```

Command tersebut akan membuat folder:

```txt
.husky/
```

Dan menambahkan script `prepare` di `package.json`.

---

### 8. Configure Pre-Commit Hook

Edit file:

```txt
.husky/pre-commit
```

Isi dengan:

```bash
pnpm format:check
pnpm lint
```

Tujuannya:

- Commit gagal jika format belum rapi.
- Commit gagal jika lint error.

---

### 9. Test Husky

Buat perubahan kecil, lalu coba commit:

```bash
git add .
git commit -m "chore: setup nextjs project tooling"
```

Expected result:

- Husky menjalankan `pnpm format:check`.
- Husky menjalankan `pnpm lint`.
- Commit berhasil jika tidak ada error.
- Commit gagal jika ada error.

---

### 10. Setup Initial Git Commit

Jika semua sudah berjalan:

```bash
git add .
git commit -m "chore: initialize studyflow project"
```

## Expected Folder Structure

Setelah issue selesai, struktur minimal project:

```txt
studyflow/
├── .husky/
│   └── pre-commit
├── public/
├── src/
│   ├── app/
│   ├── components/
│   ├── constants/
│   ├── features/
│   ├── hooks/
│   ├── lib/
│   ├── types/
│   └── utils/
├── .prettierrc
├── .prettierignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
└── tsconfig.json
```

## Acceptance Criteria

- Next.js project berhasil dibuat.
- Project menggunakan App Router.
- Project menggunakan TypeScript.
- Project menggunakan Tailwind CSS.
- Project menggunakan alias import `@/*`.
- Project bisa dijalankan dengan `pnpm dev`.
- Prettier berhasil diinstall.
- `prettier-plugin-tailwindcss` berhasil diinstall.
- File `.prettierrc` tersedia.
- File `.prettierignore` tersedia.
- Script `format` tersedia di `package.json`.
- Script `format:check` tersedia di `package.json`.
- Husky berhasil diinstall.
- Folder `.husky` tersedia.
- Pre-commit hook menjalankan format check dan lint.
- Commit gagal jika format/lint bermasalah.
- Commit berhasil jika format/lint aman.
- Struktur folder awal sudah tersedia.
- Tidak ada fitur aplikasi yang dibuat di issue ini.

## Testing Checklist

Jalankan command berikut:

```bash
pnpm dev
```

Expected:

```txt
Aplikasi berjalan di localhost:3000
```

Jalankan:

```bash
pnpm format:check
```

Expected:

```txt
All matched files use Prettier code style
```

Jalankan:

```bash
pnpm lint
```

Expected:

```txt
Tidak ada lint error
```

Jalankan:

```bash
git add .
git commit -m "test: verify husky pre-commit"
```

Expected:

```txt
Pre-commit hook berjalan sebelum commit
```

## Notes

- Jangan install library lain di issue ini.
- Jangan setup Prisma di issue ini.
- Jangan setup Auth.js di issue ini.
- Jangan setup shadcn/ui di issue ini.
- Fokus issue ini hanya foundation tooling.
- Jika ingin menambahkan library baru, buat issue terpisah.

## Suggested Commit Message

```bash
chore: initialize nextjs project tooling
```

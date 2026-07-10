# ISSUE-016 — Build AI Study Plan Generator

## Status

Planned

## Priority

Medium

## Type

Feature / AI Assistant

## Summary

Membangun fitur AI Study Plan Generator untuk StudyFlow menggunakan provider NVIDIA Build / NVIDIA NIM.

Fitur ini membantu user membuat draft study plan dan task berdasarkan input seperti subject, target belajar, deadline, tingkat kesulitan, dan estimasi waktu belajar.

AI tidak langsung menyimpan hasil ke database. AI hanya menghasilkan draft rekomendasi. User tetap harus meninjau hasil AI dan menekan tombol save sebelum data disimpan.

Route utama:

```txt
/dashboard/ai
```

## Background

StudyFlow sudah memiliki fitur utama:

```txt
Subject Management
Study Plan Management
Task Management
Study Session Tracker
Analytics Dashboard
Calendar Deadline View
```

Pada issue ini, StudyFlow ditambahkan fitur AI untuk membantu user membuat rencana belajar lebih cepat.

Contoh input user:

```txt
Subject: Next.js
Goal: Bisa membuat aplikasi fullstack dengan Auth, Database, dan Dashboard
Difficulty: Intermediate
Deadline: 14 hari
Available time: 2 jam per hari
Additional Notes: Fokus untuk portfolio project
```

Contoh output AI:

```txt
Study Plan Title: Belajar Next.js Fullstack dalam 14 Hari

Goal:
Mampu membangun aplikasi fullstack menggunakan Next.js App Router, Auth.js, Drizzle ORM, PostgreSQL, dan dashboard analytics.

Tasks:
1. Setup project Next.js
2. Membuat layout dan reusable components
3. Setup database PostgreSQL dan Drizzle
4. Membuat authentication
5. Membuat CRUD utama
6. Membuat dashboard analytics
7. Testing dan deployment
```

## Provider

AI provider yang digunakan:

```txt
NVIDIA Build / NVIDIA NIM
```

Model catalog:

```txt
https://build.nvidia.com/models
```

Base URL:

```txt
https://integrate.api.nvidia.com/v1
```

NVIDIA NIM digunakan sebagai OpenAI-compatible provider melalui AI SDK.

## Model Strategy

### General Study Plan Generator

Gunakan model general untuk membuat study plan umum:

```txt
Primary:
meta/llama-3.3-70b-instruct

Fallback:
meta/llama-3.1-70b-instruct

Alternative:
qwen/qwen3-next-80b-a3b-instruct
```

### Coding-Related Feature

Gunakan model coding untuk fitur yang berhubungan dengan coding, project breakdown, issue generation, dan technical learning path:

```txt
Primary:
qwen/qwen3-coder-480b-a35b-instruct

Fallback:
deepseek-ai/deepseek-v4-pro

Alternative:
deepseek-ai/deepseek-v4-flash
```

### Usage Rule

Untuk issue ini, gunakan model general terlebih dahulu:

```txt
meta/llama-3.3-70b-instruct
```

Fallback otomatis:

```txt
meta/llama-3.3-70b-instruct
↓
meta/llama-3.1-70b-instruct
↓
qwen/qwen3-next-80b-a3b-instruct
```

Coding model disiapkan di environment dan utility, tetapi belum wajib dipakai pada issue ini.

## Goals

- Membuat halaman AI Study Plan Generator.
- Menggunakan NVIDIA Build / NVIDIA NIM sebagai AI provider.
- Menggunakan model primary `meta/llama-3.3-70b-instruct`.
- Menyediakan fallback ke `meta/llama-3.1-70b-instruct`.
- Menyediakan alternative ke Qwen Instruct.
- Menyiapkan model coding untuk fitur AI coding-related.
- Membuat form input untuk kebutuhan belajar user.
- Menghasilkan draft study plan menggunakan AI.
- Menghasilkan daftar task dari hasil AI.
- User bisa review hasil AI sebelum menyimpan.
- User bisa menyimpan hasil AI sebagai Study Plan.
- User bisa menyimpan generated tasks sebagai Study Tasks.
- Menggunakan Server Actions di folder root `actions/`.
- Menggunakan TanStack Query untuk mutation generate dan save.
- Menggunakan Zod untuk validasi input.
- Menggunakan React Hook Form untuk form.
- Semua action wajib memvalidasi session user.
- Semua data yang disimpan wajib menggunakan `userId` dari session.
- AI response wajib divalidasi dengan Zod.
- NVIDIA API key tidak boleh terekspos ke client.
- UI mengikuti clean white dashboard style StudyFlow.

## Non-Goals

- Tidak membuat chatbot panjang.
- Tidak membuat AI streaming chat.
- Tidak membuat AI memory.
- Tidak membuat AI analytics insight.
- Tidak membuat AI note summary.
- Tidak membuat AI task breakdown terpisah.
- Tidak membuat AI coding task generator penuh.
- Tidak membuat usage billing.
- Tidak membuat limit per user.
- Tidak membuat admin AI monitoring.
- Tidak membuat API route.
- Tidak mengubah schema database.
- Tidak otomatis menyimpan hasil AI tanpa konfirmasi user.
- Tidak menambahkan shadcn/ui.

## Tech Stack

- Next.js App Router
- TypeScript
- Drizzle ORM
- PostgreSQL
- Server Actions
- TanStack Query
- React Hook Form
- Zod
- Tailwind CSS
- Custom UI Components
- AI SDK
- NVIDIA NIM
- OpenAI-compatible provider
- Lucide React

## Required Package

Install AI SDK dan provider OpenAI-compatible:

```bash
pnpm add ai @ai-sdk/openai-compatible
```

Jangan install package ini untuk issue ini:

```bash
pnpm add @ai-sdk/openai
```

Karena NVIDIA NIM akan dipakai melalui OpenAI-compatible provider.

## Environment Variables

Tambahkan ke `.env`:

```env
NVIDIA_API_KEY="your-nvidia-api-key"
NVIDIA_BASE_URL="https://integrate.api.nvidia.com/v1"

NVIDIA_PRIMARY_MODEL="meta/llama-3.3-70b-instruct"
NVIDIA_FALLBACK_MODEL="meta/llama-3.1-70b-instruct"
NVIDIA_ALTERNATIVE_MODEL="qwen/qwen3-next-80b-a3b-instruct"

NVIDIA_CODING_MODEL="qwen/qwen3-coder-480b-a35b-instruct"
NVIDIA_CODING_FALLBACK_MODEL="deepseek-ai/deepseek-v4-pro"
NVIDIA_CODING_ALTERNATIVE_MODEL="deepseek-ai/deepseek-v4-flash"
```

Tambahkan ke `.env.example`:

```env
NVIDIA_API_KEY="your-nvidia-api-key"
NVIDIA_BASE_URL="https://integrate.api.nvidia.com/v1"

NVIDIA_PRIMARY_MODEL="meta/llama-3.3-70b-instruct"
NVIDIA_FALLBACK_MODEL="meta/llama-3.1-70b-instruct"
NVIDIA_ALTERNATIVE_MODEL="qwen/qwen3-next-80b-a3b-instruct"

NVIDIA_CODING_MODEL="qwen/qwen3-coder-480b-a35b-instruct"
NVIDIA_CODING_FALLBACK_MODEL="deepseek-ai/deepseek-v4-pro"
NVIDIA_CODING_ALTERNATIVE_MODEL="deepseek-ai/deepseek-v4-flash"
```

Rules:

```txt
Jangan commit .env
Jangan expose NVIDIA_API_KEY ke client
Semua request AI wajib berjalan di server
Client hanya memanggil Server Action
```

## Route

Fitur ini berada di:

```txt
/dashboard/ai
```

## AI Behavior

AI harus menghasilkan output terstruktur:

```txt
title
description
goal
priority
estimatedHours
tasks[]
```

Setiap task minimal memiliki:

```txt
title
description
priority
position
```

AI tidak boleh langsung membuat data ke database saat generate.

Flow yang benar:

```txt
Input form
→ Generate draft
→ Preview result
→ User review
→ Save to database
```

## Folder Structure

Gunakan struktur tanpa `src/`.

```txt
actions/
└── ai-study-plan.ts

app/
└── dashboard/
    └── ai/
        └── page.tsx

features/
└── ai-study-plan/
    ├── components/
    │   ├── ai-study-plan-empty-state.tsx
    │   ├── ai-study-plan-form.tsx
    │   ├── ai-study-plan-preview.tsx
    │   └── generated-task-list.tsx
    ├── hooks/
    │   ├── use-generate-study-plan-mutation.ts
    │   └── use-save-generated-study-plan-mutation.ts
    ├── schemas/
    │   └── ai-study-plan-schema.ts
    └── utils/
        └── ai-study-plan-prompt.ts

lib/
└── ai/
    └── nvidia.ts

types/
└── ai-study-plan.ts
```

File yang kemungkinan ikut diubah:

```txt
constants/navigation.ts
.env.example
package.json
```

## Implementation Steps

### 1. Install AI Package

Jalankan:

```bash
pnpm add ai @ai-sdk/openai-compatible
```

Lalu jalankan:

```bash
pnpm lint
pnpm format
```

Expected:

```txt
Tidak ada lint error.
Tidak ada format error.
```

---

### 2. Create NVIDIA AI Provider Utility

Buat folder:

```txt
lib/ai/
```

Buat file:

```txt
lib/ai/nvidia.ts
```

Isi:

```ts
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export const nvidia = createOpenAICompatible({
  name: "nvidia",
  baseURL: process.env.NVIDIA_BASE_URL ?? "https://integrate.api.nvidia.com/v1",
  headers: {
    Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
  },
});

export type NvidiaModelPurpose =
  | "general"
  | "general-fallback"
  | "alternative"
  | "coding"
  | "coding-fallback"
  | "coding-alternative";

export function getNvidiaModelName(purpose: NvidiaModelPurpose = "general") {
  if (purpose === "coding") {
    return process.env.NVIDIA_CODING_MODEL ?? "qwen/qwen3-coder-480b-a35b-instruct";
  }

  if (purpose === "coding-fallback") {
    return process.env.NVIDIA_CODING_FALLBACK_MODEL ?? "deepseek-ai/deepseek-v4-pro";
  }

  if (purpose === "coding-alternative") {
    return process.env.NVIDIA_CODING_ALTERNATIVE_MODEL ?? "deepseek-ai/deepseek-v4-flash";
  }

  if (purpose === "general-fallback") {
    return process.env.NVIDIA_FALLBACK_MODEL ?? "meta/llama-3.1-70b-instruct";
  }

  if (purpose === "alternative") {
    return process.env.NVIDIA_ALTERNATIVE_MODEL ?? "qwen/qwen3-next-80b-a3b-instruct";
  }

  return process.env.NVIDIA_PRIMARY_MODEL ?? "meta/llama-3.3-70b-instruct";
}

export function getNvidiaChatModel(purpose: NvidiaModelPurpose = "general") {
  return nvidia.chatModel(getNvidiaModelName(purpose));
}
```

Catatan:

- File ini hanya dipakai di server.
- Jangan import file ini dari Client Component.
- Jangan pakai prefix `NEXT_PUBLIC_` untuk API key.

---

### 3. Create AI Study Plan Types

Buat file:

```txt
types/ai-study-plan.ts
```

Isi:

```ts
export type AiStudyPlanDifficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export type AiGeneratedTask = {
  title: string;
  description: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  position: number;
};

export type AiGeneratedStudyPlan = {
  title: string;
  description: string | null;
  goal: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  estimatedHours: number | null;
  tasks: AiGeneratedTask[];
};

export type SavedGeneratedStudyPlan = {
  studyPlanId: string;
  taskIds: string[];
};
```

---

### 4. Create AI Study Plan Schema

Buat file:

```txt
features/ai-study-plan/schemas/ai-study-plan-schema.ts
```

Isi:

```ts
import { z } from "zod";

export const aiStudyPlanDifficultySchema = z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]);

export const generateStudyPlanSchema = z.object({
  subjectId: z.string().uuid("Subject tidak valid"),
  goal: z.string().min(10, "Goal minimal 10 karakter").max(1000, "Goal maksimal 1000 karakter"),
  difficulty: aiStudyPlanDifficultySchema.default("BEGINNER"),
  deadlineDays: z.coerce
    .number()
    .int("Deadline harus angka bulat")
    .min(1, "Deadline minimal 1 hari")
    .max(365, "Deadline maksimal 365 hari"),
  availableHoursPerDay: z.coerce
    .number()
    .min(0.5, "Minimal 0.5 jam per hari")
    .max(24, "Maksimal 24 jam per hari"),
  additionalNotes: z
    .string()
    .max(1000, "Catatan tambahan maksimal 1000 karakter")
    .optional()
    .or(z.literal("")),
  isCodingRelated: z.boolean().default(false),
});

export const generatedTaskSchema = z.object({
  title: z.string().min(3).max(180),
  description: z.string().nullable(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  position: z.number().int().min(0),
});

export const generatedStudyPlanSchema = z.object({
  title: z.string().min(3).max(180),
  description: z.string().nullable(),
  goal: z.string().min(3).max(1000),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  estimatedHours: z.number().int().min(1).max(1000).nullable(),
  tasks: z.array(generatedTaskSchema).min(1).max(30),
});

export const saveGeneratedStudyPlanSchema = z.object({
  subjectId: z.string().uuid("Subject tidak valid"),
  generatedPlan: generatedStudyPlanSchema,
});

export type GenerateStudyPlanInput = z.infer<typeof generateStudyPlanSchema>;
export type SaveGeneratedStudyPlanInput = z.infer<typeof saveGeneratedStudyPlanSchema>;
```

Catatan:

- `isCodingRelated` digunakan untuk memilih model general atau coding.
- Untuk MVP, default `false`.
- Jika user membuat study plan coding/project development, bisa set `true`.

---

### 5. Create AI Prompt Utility

Buat file:

```txt
features/ai-study-plan/utils/ai-study-plan-prompt.ts
```

Isi:

```ts
import type { GenerateStudyPlanInput } from "@/features/ai-study-plan/schemas/ai-study-plan-schema";

type CreateStudyPlanPromptParams = {
  subjectName: string;
  input: GenerateStudyPlanInput;
};

export function createStudyPlanPrompt({ subjectName, input }: CreateStudyPlanPromptParams) {
  return `
You are an expert study planner.

Create a structured study plan for the following learning target.

Subject:
${subjectName}

Goal:
${input.goal}

Difficulty:
${input.difficulty}

Deadline:
${input.deadlineDays} days

Available time:
${input.availableHoursPerDay} hours per day

Additional notes:
${input.additionalNotes || "-"}

Is coding related:
${input.isCodingRelated ? "Yes" : "No"}

Return ONLY valid JSON with this exact structure:
{
  "title": "string",
  "description": "string or null",
  "goal": "string",
  "priority": "LOW | MEDIUM | HIGH | URGENT",
  "estimatedHours": number or null,
  "tasks": [
    {
      "title": "string",
      "description": "string or null",
      "priority": "LOW | MEDIUM | HIGH | URGENT",
      "position": number
    }
  ]
}

Rules:
- Generate 5 to 12 tasks.
- Make tasks practical and sequential.
- Use concise task titles.
- Keep descriptions short.
- Match the difficulty level.
- Match the deadline and available time.
- If coding related, make tasks implementation-oriented.
- If not coding related, make tasks learning-oriented.
- Do not include markdown.
- Do not include explanation outside JSON.
- Do not wrap JSON in triple backticks.
`;
}
```

---

### 6. Create AI Study Plan Actions

Buat file:

```txt
actions/ai-study-plan.ts
```

Isi:

````ts
"use server";

import { generateText } from "ai";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { db } from "@/db";
import { studyPlans, studyTasks, subjects } from "@/db/schema";
import {
  generateStudyPlanSchema,
  generatedStudyPlanSchema,
  saveGeneratedStudyPlanSchema,
  type GenerateStudyPlanInput,
  type SaveGeneratedStudyPlanInput,
} from "@/features/ai-study-plan/schemas/ai-study-plan-schema";
import { createStudyPlanPrompt } from "@/features/ai-study-plan/utils/ai-study-plan-prompt";
import { getNvidiaChatModel, type NvidiaModelPurpose } from "@/lib/ai/nvidia";
import type { ActionResponse } from "@/types/action-response";
import type { AiGeneratedStudyPlan, SavedGeneratedStudyPlan } from "@/types/ai-study-plan";

async function requireAuthUser() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return session.user;
}

async function ensureSubjectBelongsToUser(subjectId: string, userId: string) {
  const [subject] = await db
    .select({
      id: subjects.id,
      name: subjects.name,
    })
    .from(subjects)
    .where(and(eq(subjects.id, subjectId), eq(subjects.userId, userId)))
    .limit(1);

  return subject;
}

function parseAiJsonResponse(content: string) {
  const cleaned = content
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleaned);
}

function getModelOrder(isCodingRelated: boolean): NvidiaModelPurpose[] {
  if (isCodingRelated) {
    return ["coding", "coding-fallback", "coding-alternative"];
  }

  return ["general", "general-fallback", "alternative"];
}

async function generateWithFallback({
  prompt,
  isCodingRelated,
}: {
  prompt: string;
  isCodingRelated: boolean;
}) {
  const modelOrder = getModelOrder(isCodingRelated);

  let lastError: unknown = null;

  for (const modelPurpose of modelOrder) {
    try {
      return await generateText({
        model: getNvidiaChatModel(modelPurpose),
        prompt,
        temperature: 0.2,
        maxOutputTokens: 2048,
      });
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

export async function generateStudyPlanAction(
  input: GenerateStudyPlanInput
): Promise<ActionResponse<AiGeneratedStudyPlan>> {
  const parsed = generateStudyPlanSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Input tidak valid.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await requireAuthUser();

    const subject = await ensureSubjectBelongsToUser(parsed.data.subjectId, user.id);

    if (!subject) {
      return {
        success: false,
        message: "Subject tidak ditemukan.",
      };
    }

    const prompt = createStudyPlanPrompt({
      subjectName: subject.name,
      input: parsed.data,
    });

    const result = await generateWithFallback({
      prompt,
      isCodingRelated: parsed.data.isCodingRelated,
    });

    const rawJson = parseAiJsonResponse(result.text);

    const validatedGeneratedPlan = generatedStudyPlanSchema.safeParse(rawJson);

    if (!validatedGeneratedPlan.success) {
      return {
        success: false,
        message: "AI menghasilkan format yang tidak valid.",
      };
    }

    return {
      success: true,
      message: "Study plan berhasil digenerate.",
      data: validatedGeneratedPlan.data,
    };
  } catch {
    return {
      success: false,
      message: "Gagal generate study plan.",
    };
  }
}

export async function saveGeneratedStudyPlanAction(
  input: SaveGeneratedStudyPlanInput
): Promise<ActionResponse<SavedGeneratedStudyPlan>> {
  const parsed = saveGeneratedStudyPlanSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Input tidak valid.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await requireAuthUser();

    const subject = await ensureSubjectBelongsToUser(parsed.data.subjectId, user.id);

    if (!subject) {
      return {
        success: false,
        message: "Subject tidak ditemukan.",
      };
    }

    const generatedPlan = parsed.data.generatedPlan;

    const [newStudyPlan] = await db
      .insert(studyPlans)
      .values({
        userId: user.id,
        subjectId: parsed.data.subjectId,
        title: generatedPlan.title,
        description: generatedPlan.description,
        goal: generatedPlan.goal,
        status: "NOT_STARTED",
        priority: generatedPlan.priority,
        estimatedHours: generatedPlan.estimatedHours,
      })
      .returning({
        id: studyPlans.id,
      });

    const insertedTasks = await db
      .insert(studyTasks)
      .values(
        generatedPlan.tasks.map((task) => ({
          userId: user.id,
          studyPlanId: newStudyPlan.id,
          title: task.title,
          description: task.description,
          status: "TODO",
          priority: task.priority,
          position: task.position,
        }))
      )
      .returning({
        id: studyTasks.id,
      });

    revalidatePath("/dashboard/ai");
    revalidatePath("/dashboard/plans");
    revalidatePath("/dashboard/tasks");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/analytics");
    revalidatePath("/dashboard/calendar");

    return {
      success: true,
      message: "Generated study plan berhasil disimpan.",
      data: {
        studyPlanId: newStudyPlan.id,
        taskIds: insertedTasks.map((task) => task.id),
      },
    };
  } catch {
    return {
      success: false,
      message: "Gagal menyimpan generated study plan.",
    };
  }
}
````

Catatan:

- Generate action memakai NVIDIA model fallback.
- Save action tidak memanggil AI.
- Save action hanya menyimpan hasil AI yang sudah tervalidasi.
- Jangan import action ini dari Server Component untuk generate otomatis.
- Generate harus dipicu user dari form.

---

### 7. Create Generate Mutation Hook

Buat file:

```txt
features/ai-study-plan/hooks/use-generate-study-plan-mutation.ts
```

Isi:

```ts
"use client";

import { useMutation } from "@tanstack/react-query";

import { generateStudyPlanAction } from "@/actions/ai-study-plan";
import type { GenerateStudyPlanInput } from "@/features/ai-study-plan/schemas/ai-study-plan-schema";

export function useGenerateStudyPlanMutation() {
  return useMutation({
    mutationFn: (input: GenerateStudyPlanInput) => generateStudyPlanAction(input),
  });
}
```

---

### 8. Create Save Generated Study Plan Mutation Hook

Buat file:

```txt
features/ai-study-plan/hooks/use-save-generated-study-plan-mutation.ts
```

Isi:

```ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { saveGeneratedStudyPlanAction } from "@/actions/ai-study-plan";
import type { SaveGeneratedStudyPlanInput } from "@/features/ai-study-plan/schemas/ai-study-plan-schema";
import { analyticsQueryKey } from "@/features/analytics/hooks/use-analytics-query";
import { studyPlansQueryKey } from "@/features/study-plans/hooks/use-study-plans-query";
import { tasksQueryKey } from "@/features/tasks/hooks/use-tasks-query";

export function useSaveGeneratedStudyPlanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SaveGeneratedStudyPlanInput) => saveGeneratedStudyPlanAction(input),
    onSuccess: async (result) => {
      if (result.success) {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: studyPlansQueryKey }),
          queryClient.invalidateQueries({ queryKey: tasksQueryKey }),
          queryClient.invalidateQueries({ queryKey: analyticsQueryKey }),
        ]);
      }
    },
  });
}
```

Catatan:

- Jika `analyticsQueryKey` belum tersedia karena analytics page server-first, hapus import tersebut.
- Minimal invalidate study plans dan tasks.

---

### 9. Create AI Study Plan Empty State

Buat file:

```txt
features/ai-study-plan/components/ai-study-plan-empty-state.tsx
```

Isi:

```tsx
import { Sparkles } from "lucide-react";

import { Card } from "@/components/ui/card";

export function AiStudyPlanEmptyState() {
  return (
    <Card className="flex flex-col items-center justify-center p-10 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-slate-600">
        <Sparkles className="h-6 w-6" />
      </div>

      <h2 className="text-lg font-semibold tracking-tight text-slate-950">
        Belum ada generated plan
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        Isi form di samping untuk membuat draft study plan dan task dengan bantuan AI dari NVIDIA
        Build.
      </p>
    </Card>
  );
}
```

---

### 10. Create AI Study Plan Form

Buat file:

```txt
features/ai-study-plan/components/ai-study-plan-form.tsx
```

Requirements:

- Client component.
- Menggunakan React Hook Form.
- Menggunakan `generateStudyPlanSchema`.
- Menggunakan `useSubjectsQuery`.
- Menggunakan `useGenerateStudyPlanMutation`.
- Jika belum ada subject, tampilkan instruksi membuat subject dulu.
- Submit generate draft AI.
- Hasil generate dikirim ke parent state.
- Tambahkan checkbox `isCodingRelated`.

Field:

```txt
subjectId
goal
difficulty
deadlineDays
availableHoursPerDay
additionalNotes
isCodingRelated
```

Expected behavior:

```txt
Klik Generate
→ loading
→ Server Action memanggil NVIDIA NIM
→ output divalidasi Zod
→ preview muncul
```

Error handling:

```txt
Jika NVIDIA API gagal, tampilkan pesan error.
Jika semua fallback model gagal, tampilkan pesan error.
Jika AI output tidak valid, tampilkan pesan error.
```

No subject state:

```txt
Belum ada subject. Buat subject terlebih dahulu sebelum menggunakan AI generator.
```

Link:

```txt
/dashboard/subjects
```

---

### 11. Create Generated Task List

Buat file:

```txt
features/ai-study-plan/components/generated-task-list.tsx
```

Requirements:

- Menerima array generated tasks.
- Menampilkan title.
- Menampilkan description.
- Menampilkan priority.
- Menampilkan position.
- Tidak perlu edit task satu per satu pada issue ini.
- Task preview harus mudah dibaca.

Example UI:

```txt
1. Setup Project
Priority: HIGH
Description: Initialize Next.js project and configure Tailwind.
```

---

### 12. Create AI Study Plan Preview

Buat file:

```txt
features/ai-study-plan/components/ai-study-plan-preview.tsx
```

Requirements:

- Menerima `generatedPlan`.
- Menerima `subjectId`.
- Menampilkan:

  - title
  - description
  - goal
  - priority
  - estimated hours
  - generated task list

- Tombol Save to StudyFlow.
- Menggunakan `useSaveGeneratedStudyPlanMutation`.
- Setelah berhasil save, tampilkan success message.
- Setelah berhasil save, tampilkan link ke:

  - `/dashboard/plans`
  - `/dashboard/tasks`

Expected behavior:

```txt
Generated plan tidak disimpan sebelum user klik Save.
```

Save success copy:

```txt
Generated study plan berhasil disimpan ke StudyFlow.
```

---

### 13. Create AI Page

Buat folder:

```txt
app/dashboard/ai/
```

Buat file:

```txt
app/dashboard/ai/page.tsx
```

Isi:

```tsx
"use client";

import { useState } from "react";

import { AiStudyPlanEmptyState } from "@/features/ai-study-plan/components/ai-study-plan-empty-state";
import { AiStudyPlanForm } from "@/features/ai-study-plan/components/ai-study-plan-form";
import { AiStudyPlanPreview } from "@/features/ai-study-plan/components/ai-study-plan-preview";
import type { AiGeneratedStudyPlan } from "@/types/ai-study-plan";

export default function AiStudyPlanPage() {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [generatedPlan, setGeneratedPlan] = useState<AiGeneratedStudyPlan | null>(null);

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <AiStudyPlanForm
        onGenerated={(subjectId, plan) => {
          setSelectedSubjectId(subjectId);
          setGeneratedPlan(plan);
        }}
      />

      <div>
        <div className="mb-5">
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            AI Study Plan Generator
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Generate draft study plans and tasks using NVIDIA Build models.
          </p>
        </div>

        {generatedPlan && selectedSubjectId ? (
          <AiStudyPlanPreview subjectId={selectedSubjectId} generatedPlan={generatedPlan} />
        ) : (
          <AiStudyPlanEmptyState />
        )}
      </div>
    </div>
  );
}
```

---

### 14. Add AI Navigation Item

Edit file:

```txt
constants/navigation.ts
```

Tambahkan icon:

```ts
import { Sparkles } from "lucide-react";
```

Tambahkan item:

```ts
{
  label: "AI Generator",
  href: "/dashboard/ai",
  icon: Sparkles,
},
```

Urutan menu yang direkomendasikan:

```txt
Overview
Subjects
Study Plans
Tasks
Sessions
Calendar
Analytics
AI Generator
Settings
```

Expected:

```txt
Menu AI Generator tampil di sidebar desktop dan mobile.
Active state berjalan saat membuka /dashboard/ai.
```

---

### 15. Handle No Subject State

Karena AI generator membutuhkan subject, form harus menangani kondisi subject kosong.

Jika `useSubjectsQuery()` menghasilkan array kosong:

```txt
Belum ada subject. Buat subject terlebih dahulu sebelum menggunakan AI generator.
```

Tampilkan link ke:

```txt
/dashboard/subjects
```

Expected behavior:

```txt
Jika belum ada subject, tombol generate disabled.
Jika ada subject, form aktif.
```

---

### 16. Validate AI Output

AI output wajib divalidasi dengan:

```txt
generatedStudyPlanSchema
```

Jika output tidak valid:

```txt
Tampilkan error: AI menghasilkan format yang tidak valid.
Jangan tampilkan preview.
Jangan simpan ke database.
```

Valid output:

```json
{
  "title": "Belajar Next.js Fullstack dalam 14 Hari",
  "description": "Rencana belajar untuk membangun aplikasi fullstack dengan Next.js.",
  "goal": "Mampu membangun aplikasi fullstack dengan Auth, Database, dan Dashboard.",
  "priority": "HIGH",
  "estimatedHours": 28,
  "tasks": [
    {
      "title": "Setup project Next.js",
      "description": "Initialize project dan setup Tailwind.",
      "priority": "HIGH",
      "position": 1
    }
  ]
}
```

---

### 17. Save Generated Plan

Saat user klik Save:

```txt
Insert study_plans
Insert study_tasks
Invalidate study plans query
Invalidate tasks query
Revalidate dashboard/plans/tasks/analytics/calendar
```

Expected:

```txt
Generated study plan muncul di /dashboard/plans.
Generated tasks muncul di /dashboard/tasks.
Dashboard statistics ikut update.
Analytics ikut update.
Calendar ikut update jika task/study plan memiliki tanggal di issue lanjutan.
```

---

### 18. Optional Dummy Mode for Development

Jika belum ingin memakai API NVIDIA saat awal development, boleh buat temporary dummy mode.

Tambahkan `.env`:

```env
AI_DUMMY_MODE="false"
```

Contoh helper:

```ts
function isDummyMode() {
  return process.env.AI_DUMMY_MODE === "true";
}
```

Rule:

```txt
Dummy mode hanya untuk local development.
Default production harus false.
Jangan lupa test dengan NVIDIA API asli sebelum issue dianggap done.
```

---

### 19. Run Checks

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
└── ai-study-plan.ts

app/
└── dashboard/
    └── ai/
        └── page.tsx

features/
└── ai-study-plan/
    ├── components/
    │   ├── ai-study-plan-empty-state.tsx
    │   ├── ai-study-plan-form.tsx
    │   ├── ai-study-plan-preview.tsx
    │   └── generated-task-list.tsx
    ├── hooks/
    │   ├── use-generate-study-plan-mutation.ts
    │   └── use-save-generated-study-plan-mutation.ts
    ├── schemas/
    │   └── ai-study-plan-schema.ts
    └── utils/
        └── ai-study-plan-prompt.ts

lib/
└── ai/
    └── nvidia.ts

types/
└── ai-study-plan.ts
```

File yang kemungkinan diubah:

```txt
constants/navigation.ts
.env.example
package.json
```

## Acceptance Criteria

- Route `/dashboard/ai` tersedia.
- AI Generator page hanya bisa diakses user login.
- Menu AI Generator tampil di dashboard sidebar.
- Active nav state AI Generator berjalan.
- NVIDIA Build / NVIDIA NIM digunakan sebagai AI provider.
- Package `@ai-sdk/openai-compatible` digunakan.
- Package `@ai-sdk/openai` tidak digunakan.
- `NVIDIA_API_KEY` tersedia di `.env`.
- `NVIDIA_BASE_URL` tersedia di `.env`.
- `NVIDIA_PRIMARY_MODEL` menggunakan `meta/llama-3.3-70b-instruct`.
- `NVIDIA_FALLBACK_MODEL` menggunakan `meta/llama-3.1-70b-instruct`.
- `NVIDIA_ALTERNATIVE_MODEL` menggunakan Qwen Instruct.
- `NVIDIA_CODING_MODEL` disiapkan untuk coding-related feature.
- AI call berjalan di Server Action.
- NVIDIA API key tidak terekspos ke client.
- User bisa memilih subject.
- User bisa mengisi goal belajar.
- User bisa memilih difficulty.
- User bisa mengisi deadline days.
- User bisa mengisi available hours per day.
- User bisa mengisi additional notes optional.
- User bisa menandai apakah request coding-related.
- User bisa generate draft study plan.
- Generated plan tampil dalam preview.
- Generated tasks tampil dalam preview.
- Generated plan tidak otomatis disimpan.
- User bisa menyimpan generated plan ke database.
- User bisa menyimpan generated tasks ke database.
- Data study plan tersimpan dengan userId dari session.
- Data task tersimpan dengan userId dari session.
- Subject yang dipakai wajib milik user login.
- AI action berada di folder root `actions/`.
- AI action memvalidasi session user.
- Generate input divalidasi dengan Zod.
- AI output divalidasi dengan Zod.
- Save input divalidasi dengan Zod.
- TanStack Query digunakan untuk generate mutation.
- TanStack Query digunakan untuk save mutation.
- Jika model primary gagal, fallback model bisa digunakan.
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
http://localhost:3000/dashboard/ai
```

Expected:

```txt
AI Study Plan Generator tampil.
```

---

### 2. Test Protected Access

Logout, lalu buka:

```txt
http://localhost:3000/dashboard/ai
```

Expected:

```txt
User diarahkan ke /login.
```

---

### 3. Test No Subject State

Gunakan user baru tanpa subject.

Expected:

```txt
Form generate disabled atau menampilkan pesan untuk membuat subject dulu.
Link ke /dashboard/subjects tersedia.
```

---

### 4. Test NVIDIA Environment

Pastikan `.env` memiliki:

```env
NVIDIA_API_KEY="valid-api-key"
NVIDIA_BASE_URL="https://integrate.api.nvidia.com/v1"
NVIDIA_PRIMARY_MODEL="meta/llama-3.3-70b-instruct"
```

Expected:

```txt
Generate action bisa memanggil NVIDIA NIM dari server.
NVIDIA_API_KEY tidak muncul di browser devtools.
```

---

### 5. Test Generate General Study Plan

Input:

```txt
Subject: English
Goal: Bisa meningkatkan kemampuan speaking dan listening untuk interview kerja
Difficulty: INTERMEDIATE
Deadline: 30
Available Hours Per Day: 1
Additional Notes: Fokus percakapan sehari-hari dan interview
Is Coding Related: false
```

Expected:

```txt
Model general digunakan.
Generated study plan muncul.
Generated tasks muncul.
Data belum tersimpan ke database sebelum klik Save.
```

---

### 6. Test Generate Coding Study Plan

Input:

```txt
Subject: Next.js
Goal: Bisa membuat aplikasi fullstack dengan Auth, Database, Dashboard, dan Deployment
Difficulty: INTERMEDIATE
Deadline: 14
Available Hours Per Day: 2
Additional Notes: Fokus portfolio project
Is Coding Related: true
```

Expected:

```txt
Model coding digunakan.
Generated tasks lebih implementation-oriented.
Generated study plan muncul.
Data belum tersimpan ke database sebelum klik Save.
```

---

### 7. Test Save Generated Study Plan

Klik:

```txt
Save to StudyFlow
```

Expected:

```txt
Study plan tersimpan ke database.
Tasks tersimpan ke database.
Generated study plan muncul di /dashboard/plans.
Generated tasks muncul di /dashboard/tasks.
Dashboard statistics ikut update.
```

---

### 8. Test Invalid Input

Input goal terlalu pendek.

Expected:

```txt
Validasi gagal.
AI tidak dipanggil.
Preview tidak berubah.
```

---

### 9. Test Invalid AI Output

Simulasikan AI output tidak valid.

Expected:

```txt
Muncul error AI menghasilkan format tidak valid.
Data tidak disimpan.
```

---

### 10. Test Fallback Model

Simulasikan primary model gagal.

Expected:

```txt
System mencoba fallback model.
Jika fallback berhasil, generated plan tetap muncul.
Jika semua model gagal, tampilkan error.
```

---

### 11. Test User Isolation

Login sebagai user A dan generate/save plan.

Login sebagai user B.

Expected:

```txt
User B tidak melihat generated plan milik user A.
User B tidak bisa memakai subject user A.
```

---

### 12. Test API Key Safety

Cek browser devtools.

Expected:

```txt
NVIDIA_API_KEY tidak muncul di client bundle.
AI request hanya terjadi di Server Action.
Tidak ada NEXT_PUBLIC_NVIDIA_API_KEY.
```

---

### 13. Run Checks

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

- Untuk general study plan generator, gunakan Llama 3.3 70B Instruct sebagai model utama.
- Jika Llama 3.3 gagal atau tidak tersedia, fallback ke Llama 3.1 70B Instruct.
- Jika butuh variasi hasil atau output lebih agentic, gunakan Qwen Instruct sebagai alternative.
- Untuk fitur coding-related, gunakan Qwen Coder atau DeepSeek.
- Jangan langsung menyimpan hasil AI tanpa review user.
- Selalu validasi AI output menggunakan Zod.
- Jangan expose NVIDIA_API_KEY ke client.
- Jangan gunakan `NEXT_PUBLIC_NVIDIA_API_KEY`.
- Jangan membuat API route kecuali benar-benar diperlukan.
- Semua AI logic harus berjalan di server.
- Jika ingin menyimpan riwayat generate AI, buat issue terpisah untuk tabel `ai_generations`.
- Jika ingin limit penggunaan AI, buat issue terpisah untuk rate limit.
- Jika ingin streaming result, buat issue terpisah.
- Jika ingin AI coding task breakdown lebih serius, buat issue terpisah.

## Suggested Commit Message

```bash
feat: build ai study plan generator
```

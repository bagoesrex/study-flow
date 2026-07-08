"use server";

import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { subjects } from "@/db/schema";
import {
  deleteSubjectSchema,
  subjectSchema,
  updateSubjectSchema,
  type DeleteSubjectInput,
  type SubjectInput,
  type UpdateSubjectInput,
} from "@/features/subjects/schemas/subject-schema";
import { auth } from "@/auth";
import type { ActionResponse } from "@/types/action-response";
import type { SubjectItem } from "@/types/subject";

function normalizeTargetHours(value: SubjectInput["targetHours"]) {
  if (value === "" || value === undefined) {
    return null;
  }

  return value;
}

function normalizeDescription(value: SubjectInput["description"]) {
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

export async function getSubjectsAction(): Promise<ActionResponse<SubjectItem[]>> {
  try {
    const user = await requireAuthUser();

    const data = await db
      .select({
        id: subjects.id,
        name: subjects.name,
        description: subjects.description,
        color: subjects.color,
        targetHours: subjects.targetHours,
        isArchived: subjects.isArchived,
        createdAt: subjects.createdAt,
        updatedAt: subjects.updatedAt,
      })
      .from(subjects)
      .where(eq(subjects.userId, user.id))
      .orderBy(desc(subjects.createdAt));

    return {
      success: true,
      message: "Subject berhasil diambil.",
      data,
    };
  } catch {
    return {
      success: false,
      message: "Gagal mengambil data subject.",
      data: [],
    };
  }
}

export async function createSubjectAction(
  input: SubjectInput
): Promise<ActionResponse<{ id: string }>> {
  const parsed = subjectSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Input tidak valid.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await requireAuthUser();

    const [existingSubject] = await db
      .select({ id: subjects.id })
      .from(subjects)
      .where(and(eq(subjects.userId, user.id), eq(subjects.name, parsed.data.name)))
      .limit(1);

    if (existingSubject) {
      return {
        success: false,
        message: "Subject dengan nama tersebut sudah ada.",
      };
    }

    const [newSubject] = await db
      .insert(subjects)
      .values({
        userId: user.id,
        name: parsed.data.name.trim(),
        description: normalizeDescription(parsed.data.description),
        color: parsed.data.color,
        targetHours: normalizeTargetHours(parsed.data.targetHours),
      })
      .returning({
        id: subjects.id,
      });

    revalidatePath("/dashboard/subjects");

    return {
      success: true,
      message: "Subject berhasil dibuat.",
      data: {
        id: newSubject.id,
      },
    };
  } catch {
    return {
      success: false,
      message: "Gagal membuat subject.",
    };
  }
}

export async function updateSubjectAction(input: UpdateSubjectInput): Promise<ActionResponse> {
  const parsed = updateSubjectSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Input tidak valid.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await requireAuthUser();

    const [existingSubject] = await db
      .select({ id: subjects.id })
      .from(subjects)
      .where(and(eq(subjects.id, parsed.data.id), eq(subjects.userId, user.id)))
      .limit(1);

    if (!existingSubject) {
      return {
        success: false,
        message: "Subject tidak ditemukan.",
      };
    }

    await db
      .update(subjects)
      .set({
        name: parsed.data.name.trim(),
        description: normalizeDescription(parsed.data.description),
        color: parsed.data.color,
        targetHours: normalizeTargetHours(parsed.data.targetHours),
        updatedAt: new Date(),
      })
      .where(and(eq(subjects.id, parsed.data.id), eq(subjects.userId, user.id)));

    revalidatePath("/dashboard/subjects");

    return {
      success: true,
      message: "Subject berhasil diperbarui.",
    };
  } catch {
    return {
      success: false,
      message: "Gagal memperbarui subject.",
    };
  }
}

export async function toggleArchiveSubjectAction(
  input: DeleteSubjectInput
): Promise<ActionResponse> {
  const parsed = deleteSubjectSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Input tidak valid.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await requireAuthUser();

    const [subject] = await db
      .select({
        id: subjects.id,
        isArchived: subjects.isArchived,
      })
      .from(subjects)
      .where(and(eq(subjects.id, parsed.data.id), eq(subjects.userId, user.id)))
      .limit(1);

    if (!subject) {
      return {
        success: false,
        message: "Subject tidak ditemukan.",
      };
    }

    await db
      .update(subjects)
      .set({
        isArchived: !subject.isArchived,
        updatedAt: new Date(),
      })
      .where(and(eq(subjects.id, parsed.data.id), eq(subjects.userId, user.id)));

    revalidatePath("/dashboard/subjects");

    return {
      success: true,
      message: subject.isArchived
        ? "Subject berhasil diaktifkan kembali."
        : "Subject berhasil diarsipkan.",
    };
  } catch {
    return {
      success: false,
      message: "Gagal mengubah status arsip subject.",
    };
  }
}

export async function deleteSubjectAction(input: DeleteSubjectInput): Promise<ActionResponse> {
  const parsed = deleteSubjectSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Input tidak valid.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await requireAuthUser();

    const [existingSubject] = await db
      .select({ id: subjects.id })
      .from(subjects)
      .where(and(eq(subjects.id, parsed.data.id), eq(subjects.userId, user.id)))
      .limit(1);

    if (!existingSubject) {
      return {
        success: false,
        message: "Subject tidak ditemukan.",
      };
    }

    await db
      .delete(subjects)
      .where(and(eq(subjects.id, parsed.data.id), eq(subjects.userId, user.id)));

    revalidatePath("/dashboard/subjects");

    return {
      success: true,
      message: "Subject berhasil dihapus.",
    };
  } catch {
    return {
      success: false,
      message: "Gagal menghapus subject. Pastikan subject tidak sedang digunakan.",
    };
  }
}

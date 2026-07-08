"use server";

import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { db } from "@/db";
import { studyPlans, studySessions, studyTasks, subjects } from "@/db/schema";
import {
  deleteStudySessionSchema,
  studySessionSchema,
  updateStudySessionSchema,
  type DeleteStudySessionInput,
  type StudySessionInput,
  type UpdateStudySessionInput,
} from "@/features/study-sessions/schemas/study-session-schema";
import type { ActionResponse } from "@/types/action-response";
import type { StudySessionItem } from "@/types/study-session";

function normalizeText(value?: string) {
  if (!value || value.trim().length === 0) {
    return null;
  }

  return value.trim();
}

function normalizeOptionalId(value?: string) {
  if (!value || value.trim().length === 0) {
    return null;
  }

  return value;
}

function normalizeOptionalDate(value?: string) {
  if (!value || value.trim().length === 0) {
    return null;
  }

  return new Date(value);
}

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
    })
    .from(subjects)
    .where(and(eq(subjects.id, subjectId), eq(subjects.userId, userId)))
    .limit(1);

  return subject;
}

async function ensureStudyPlanBelongsToUser(studyPlanId: string, userId: string) {
  const [plan] = await db
    .select({
      id: studyPlans.id,
    })
    .from(studyPlans)
    .where(and(eq(studyPlans.id, studyPlanId), eq(studyPlans.userId, userId)))
    .limit(1);

  return plan;
}

async function ensureTaskBelongsToUser(taskId: string, userId: string) {
  const [task] = await db
    .select({
      id: studyTasks.id,
    })
    .from(studyTasks)
    .where(and(eq(studyTasks.id, taskId), eq(studyTasks.userId, userId)))
    .limit(1);

  return task;
}

async function validateOptionalRelations(input: StudySessionInput, userId: string) {
  const subject = await ensureSubjectBelongsToUser(input.subjectId, userId);

  if (!subject) {
    return "Subject tidak ditemukan.";
  }

  if (input.studyPlanId) {
    const plan = await ensureStudyPlanBelongsToUser(input.studyPlanId, userId);

    if (!plan) {
      return "Study plan tidak ditemukan.";
    }
  }

  if (input.taskId) {
    const task = await ensureTaskBelongsToUser(input.taskId, userId);

    if (!task) {
      return "Task tidak ditemukan.";
    }
  }

  return null;
}

export async function getStudySessionsAction(): Promise<ActionResponse<StudySessionItem[]>> {
  try {
    const user = await requireAuthUser();

    const data = await db
      .select({
        id: studySessions.id,
        subjectId: studySessions.subjectId,
        subjectName: subjects.name,
        subjectColor: subjects.color,
        studyPlanId: studySessions.studyPlanId,
        studyPlanTitle: studyPlans.title,
        taskId: studySessions.taskId,
        taskTitle: studyTasks.title,
        durationMinutes: studySessions.durationMinutes,
        note: studySessions.note,
        mood: studySessions.mood,
        startedAt: studySessions.startedAt,
        endedAt: studySessions.endedAt,
        createdAt: studySessions.createdAt,
        updatedAt: studySessions.updatedAt,
      })
      .from(studySessions)
      .innerJoin(subjects, eq(studySessions.subjectId, subjects.id))
      .leftJoin(studyPlans, eq(studySessions.studyPlanId, studyPlans.id))
      .leftJoin(studyTasks, eq(studySessions.taskId, studyTasks.id))
      .where(eq(studySessions.userId, user.id))
      .orderBy(desc(studySessions.startedAt));

    return {
      success: true,
      message: "Study session berhasil diambil.",
      data,
    };
  } catch {
    return {
      success: false,
      message: "Gagal mengambil data study session.",
      data: [],
    };
  }
}

export async function createStudySessionAction(
  input: StudySessionInput
): Promise<ActionResponse<{ id: string }>> {
  const parsed = studySessionSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Input tidak valid.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await requireAuthUser();

    const relationError = await validateOptionalRelations(parsed.data, user.id);

    if (relationError) {
      return {
        success: false,
        message: relationError,
      };
    }

    const [newSession] = await db
      .insert(studySessions)
      .values({
        userId: user.id,
        subjectId: parsed.data.subjectId,
        studyPlanId: normalizeOptionalId(parsed.data.studyPlanId),
        taskId: normalizeOptionalId(parsed.data.taskId),
        durationMinutes: parsed.data.durationMinutes,
        note: normalizeText(parsed.data.note),
        mood: parsed.data.mood,
        startedAt: new Date(parsed.data.startedAt),
        endedAt: normalizeOptionalDate(parsed.data.endedAt),
      })
      .returning({
        id: studySessions.id,
      });

    revalidatePath("/dashboard/sessions");
    revalidatePath("/dashboard/analytics");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Study session berhasil dibuat.",
      data: {
        id: newSession.id,
      },
    };
  } catch {
    return {
      success: false,
      message: "Gagal membuat study session.",
    };
  }
}

export async function updateStudySessionAction(
  input: UpdateStudySessionInput
): Promise<ActionResponse> {
  const parsed = updateStudySessionSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Input tidak valid.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await requireAuthUser();

    const [existingSession] = await db
      .select({
        id: studySessions.id,
      })
      .from(studySessions)
      .where(and(eq(studySessions.id, parsed.data.id), eq(studySessions.userId, user.id)))
      .limit(1);

    if (!existingSession) {
      return {
        success: false,
        message: "Study session tidak ditemukan.",
      };
    }

    const relationError = await validateOptionalRelations(parsed.data, user.id);

    if (relationError) {
      return {
        success: false,
        message: relationError,
      };
    }

    await db
      .update(studySessions)
      .set({
        subjectId: parsed.data.subjectId,
        studyPlanId: normalizeOptionalId(parsed.data.studyPlanId),
        taskId: normalizeOptionalId(parsed.data.taskId),
        durationMinutes: parsed.data.durationMinutes,
        note: normalizeText(parsed.data.note),
        mood: parsed.data.mood,
        startedAt: new Date(parsed.data.startedAt),
        endedAt: normalizeOptionalDate(parsed.data.endedAt),
        updatedAt: new Date(),
      })
      .where(and(eq(studySessions.id, parsed.data.id), eq(studySessions.userId, user.id)));

    revalidatePath("/dashboard/sessions");
    revalidatePath("/dashboard/analytics");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Study session berhasil diperbarui.",
    };
  } catch {
    return {
      success: false,
      message: "Gagal memperbarui study session.",
    };
  }
}

export async function deleteStudySessionAction(
  input: DeleteStudySessionInput
): Promise<ActionResponse> {
  const parsed = deleteStudySessionSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Input tidak valid.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await requireAuthUser();

    const [existingSession] = await db
      .select({
        id: studySessions.id,
      })
      .from(studySessions)
      .where(and(eq(studySessions.id, parsed.data.id), eq(studySessions.userId, user.id)))
      .limit(1);

    if (!existingSession) {
      return {
        success: false,
        message: "Study session tidak ditemukan.",
      };
    }

    await db
      .delete(studySessions)
      .where(and(eq(studySessions.id, parsed.data.id), eq(studySessions.userId, user.id)));

    revalidatePath("/dashboard/sessions");
    revalidatePath("/dashboard/analytics");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Study session berhasil dihapus.",
    };
  } catch {
    return {
      success: false,
      message: "Gagal menghapus study session.",
    };
  }
}

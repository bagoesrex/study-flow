"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { db } from "@/db";
import { studyPlans, subjects } from "@/db/schema";
import {
  deleteStudyPlanSchema,
  studyPlanSchema,
  updateStudyPlanSchema,
  type DeleteStudyPlanInput,
  type StudyPlanInput,
  type UpdateStudyPlanInput,
} from "@/features/study-plans/schemas/study-plan-schema";
import { getStudyPlansWithProgress } from "@/features/study-plans/queries/get-study-plan-progress";
import type { ActionResponse } from "@/types/action-response";
import type { StudyPlanWithProgress } from "@/types/study-plan-progress";

function normalizeText(value?: string) {
  if (!value || value.trim().length === 0) {
    return null;
  }

  return value.trim();
}

function normalizeNumber(value: StudyPlanInput["estimatedHours"]) {
  if (value === "" || value === undefined) {
    return null;
  }

  return value;
}

function normalizeDate(value?: string) {
  if (!value || value.trim().length === 0) {
    return null;
  }

  return value;
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

export async function getStudyPlansAction(): Promise<ActionResponse<StudyPlanWithProgress[]>> {
  try {
    const user = await requireAuthUser();

    const data = await getStudyPlansWithProgress(user.id);

    return {
      success: true,
      message: "Study plan berhasil diambil.",
      data,
    };
  } catch {
    return {
      success: false,
      message: "Gagal mengambil data study plan.",
      data: [],
    };
  }
}

export async function createStudyPlanAction(
  input: StudyPlanInput
): Promise<ActionResponse<{ id: string }>> {
  const parsed = studyPlanSchema.safeParse(input);

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

    const [newStudyPlan] = await db
      .insert(studyPlans)
      .values({
        userId: user.id,
        subjectId: parsed.data.subjectId,
        title: parsed.data.title.trim(),
        description: normalizeText(parsed.data.description),
        goal: normalizeText(parsed.data.goal),
        startDate: normalizeDate(parsed.data.startDate),
        endDate: normalizeDate(parsed.data.endDate),
        status: parsed.data.status,
        priority: parsed.data.priority,
        estimatedHours: normalizeNumber(parsed.data.estimatedHours),
      })
      .returning({
        id: studyPlans.id,
      });

    revalidatePath("/dashboard/plans");
    revalidatePath("/dashboard/calendar");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Study plan berhasil dibuat.",
      data: {
        id: newStudyPlan.id,
      },
    };
  } catch {
    return {
      success: false,
      message: "Gagal membuat study plan.",
    };
  }
}

export async function updateStudyPlanAction(input: UpdateStudyPlanInput): Promise<ActionResponse> {
  const parsed = updateStudyPlanSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Input tidak valid.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await requireAuthUser();

    const [existingStudyPlan] = await db
      .select({
        id: studyPlans.id,
      })
      .from(studyPlans)
      .where(and(eq(studyPlans.id, parsed.data.id), eq(studyPlans.userId, user.id)))
      .limit(1);

    if (!existingStudyPlan) {
      return {
        success: false,
        message: "Study plan tidak ditemukan.",
      };
    }

    const subject = await ensureSubjectBelongsToUser(parsed.data.subjectId, user.id);

    if (!subject) {
      return {
        success: false,
        message: "Subject tidak ditemukan.",
      };
    }

    await db
      .update(studyPlans)
      .set({
        subjectId: parsed.data.subjectId,
        title: parsed.data.title.trim(),
        description: normalizeText(parsed.data.description),
        goal: normalizeText(parsed.data.goal),
        startDate: normalizeDate(parsed.data.startDate),
        endDate: normalizeDate(parsed.data.endDate),
        status: parsed.data.status,
        priority: parsed.data.priority,
        estimatedHours: normalizeNumber(parsed.data.estimatedHours),
        updatedAt: new Date(),
      })
      .where(and(eq(studyPlans.id, parsed.data.id), eq(studyPlans.userId, user.id)));

    revalidatePath("/dashboard/plans");
    revalidatePath("/dashboard/calendar");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Study plan berhasil diperbarui.",
    };
  } catch {
    return {
      success: false,
      message: "Gagal memperbarui study plan.",
    };
  }
}

export async function deleteStudyPlanAction(input: DeleteStudyPlanInput): Promise<ActionResponse> {
  const parsed = deleteStudyPlanSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Input tidak valid.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await requireAuthUser();

    const [existingStudyPlan] = await db
      .select({
        id: studyPlans.id,
      })
      .from(studyPlans)
      .where(and(eq(studyPlans.id, parsed.data.id), eq(studyPlans.userId, user.id)))
      .limit(1);

    if (!existingStudyPlan) {
      return {
        success: false,
        message: "Study plan tidak ditemukan.",
      };
    }

    await db
      .delete(studyPlans)
      .where(and(eq(studyPlans.id, parsed.data.id), eq(studyPlans.userId, user.id)));

    revalidatePath("/dashboard/plans");
    revalidatePath("/dashboard/calendar");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Study plan berhasil dihapus.",
    };
  } catch {
    return {
      success: false,
      message: "Gagal menghapus study plan. Pastikan data terkait tidak bermasalah.",
    };
  }
}

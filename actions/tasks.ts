"use server";

import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { db } from "@/db";
import { studyPlans, studyTasks, subjects } from "@/db/schema";
import {
  deleteTaskSchema,
  taskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
  type DeleteTaskInput,
  type TaskInput,
  type UpdateTaskInput,
  type UpdateTaskStatusInput,
} from "@/features/tasks/schemas/task-schema";
import type { ActionResponse } from "@/types/action-response";
import type { TaskItem } from "@/types/task";

function normalizeText(value?: string) {
  if (!value || value.trim().length === 0) {
    return null;
  }

  return value.trim();
}

function normalizeDate(value?: string) {
  if (!value || value.trim().length === 0) {
    return null;
  }

  return value;
}

function normalizePosition(value: TaskInput["position"]) {
  if (value === "" || value === undefined) {
    return 0;
  }

  return value;
}

function getCompletedAt(status: UpdateTaskStatusInput["status"]) {
  if (status === "DONE") {
    return new Date();
  }

  return null;
}

async function requireAuthUser() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return session.user;
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

export async function getTasksAction(): Promise<ActionResponse<TaskItem[]>> {
  try {
    const user = await requireAuthUser();

    const data = await db
      .select({
        id: studyTasks.id,
        studyPlanId: studyTasks.studyPlanId,
        studyPlanTitle: studyPlans.title,
        subjectName: subjects.name,
        subjectColor: subjects.color,
        title: studyTasks.title,
        description: studyTasks.description,
        status: studyTasks.status,
        priority: studyTasks.priority,
        dueDate: studyTasks.dueDate,
        position: studyTasks.position,
        completedAt: studyTasks.completedAt,
        createdAt: studyTasks.createdAt,
        updatedAt: studyTasks.updatedAt,
      })
      .from(studyTasks)
      .innerJoin(studyPlans, eq(studyTasks.studyPlanId, studyPlans.id))
      .innerJoin(subjects, eq(studyPlans.subjectId, subjects.id))
      .where(eq(studyTasks.userId, user.id))
      .orderBy(desc(studyTasks.createdAt));

    return {
      success: true,
      message: "Task berhasil diambil.",
      data,
    };
  } catch {
    return {
      success: false,
      message: "Gagal mengambil data task.",
      data: [],
    };
  }
}

export async function createTaskAction(input: TaskInput): Promise<ActionResponse<{ id: string }>> {
  const parsed = taskSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Input tidak valid.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await requireAuthUser();

    const plan = await ensureStudyPlanBelongsToUser(parsed.data.studyPlanId, user.id);

    if (!plan) {
      return {
        success: false,
        message: "Study plan tidak ditemukan.",
      };
    }

    const [newTask] = await db
      .insert(studyTasks)
      .values({
        userId: user.id,
        studyPlanId: parsed.data.studyPlanId,
        title: parsed.data.title.trim(),
        description: normalizeText(parsed.data.description),
        status: parsed.data.status,
        priority: parsed.data.priority,
        dueDate: normalizeDate(parsed.data.dueDate),
        position: normalizePosition(parsed.data.position),
        completedAt: parsed.data.status === "DONE" ? new Date() : null,
      })
      .returning({
        id: studyTasks.id,
      });

    revalidatePath("/dashboard/tasks");
    revalidatePath("/dashboard/plans");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Task berhasil dibuat.",
      data: {
        id: newTask.id,
      },
    };
  } catch {
    return {
      success: false,
      message: "Gagal membuat task.",
    };
  }
}

export async function updateTaskAction(input: UpdateTaskInput): Promise<ActionResponse> {
  const parsed = updateTaskSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Input tidak valid.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await requireAuthUser();

    const [existingTask] = await db
      .select({
        id: studyTasks.id,
      })
      .from(studyTasks)
      .where(and(eq(studyTasks.id, parsed.data.id), eq(studyTasks.userId, user.id)))
      .limit(1);

    if (!existingTask) {
      return {
        success: false,
        message: "Task tidak ditemukan.",
      };
    }

    const plan = await ensureStudyPlanBelongsToUser(parsed.data.studyPlanId, user.id);

    if (!plan) {
      return {
        success: false,
        message: "Study plan tidak ditemukan.",
      };
    }

    await db
      .update(studyTasks)
      .set({
        studyPlanId: parsed.data.studyPlanId,
        title: parsed.data.title.trim(),
        description: normalizeText(parsed.data.description),
        status: parsed.data.status,
        priority: parsed.data.priority,
        dueDate: normalizeDate(parsed.data.dueDate),
        position: normalizePosition(parsed.data.position),
        completedAt: parsed.data.status === "DONE" ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(and(eq(studyTasks.id, parsed.data.id), eq(studyTasks.userId, user.id)));

    revalidatePath("/dashboard/tasks");
    revalidatePath("/dashboard/plans");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Task berhasil diperbarui.",
    };
  } catch {
    return {
      success: false,
      message: "Gagal memperbarui task.",
    };
  }
}

export async function updateTaskStatusAction(
  input: UpdateTaskStatusInput
): Promise<ActionResponse> {
  const parsed = updateTaskStatusSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Input tidak valid.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await requireAuthUser();

    const [existingTask] = await db
      .select({
        id: studyTasks.id,
      })
      .from(studyTasks)
      .where(and(eq(studyTasks.id, parsed.data.id), eq(studyTasks.userId, user.id)))
      .limit(1);

    if (!existingTask) {
      return {
        success: false,
        message: "Task tidak ditemukan.",
      };
    }

    await db
      .update(studyTasks)
      .set({
        status: parsed.data.status,
        completedAt: getCompletedAt(parsed.data.status),
        updatedAt: new Date(),
      })
      .where(and(eq(studyTasks.id, parsed.data.id), eq(studyTasks.userId, user.id)));

    revalidatePath("/dashboard/tasks");
    revalidatePath("/dashboard/plans");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Status task berhasil diperbarui.",
    };
  } catch {
    return {
      success: false,
      message: "Gagal memperbarui status task.",
    };
  }
}

export async function deleteTaskAction(input: DeleteTaskInput): Promise<ActionResponse> {
  const parsed = deleteTaskSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Input tidak valid.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await requireAuthUser();

    const [existingTask] = await db
      .select({
        id: studyTasks.id,
      })
      .from(studyTasks)
      .where(and(eq(studyTasks.id, parsed.data.id), eq(studyTasks.userId, user.id)))
      .limit(1);

    if (!existingTask) {
      return {
        success: false,
        message: "Task tidak ditemukan.",
      };
    }

    await db
      .delete(studyTasks)
      .where(and(eq(studyTasks.id, parsed.data.id), eq(studyTasks.userId, user.id)));

    revalidatePath("/dashboard/tasks");
    revalidatePath("/dashboard/plans");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Task berhasil dihapus.",
    };
  } catch {
    return {
      success: false,
      message: "Gagal menghapus task.",
    };
  }
}

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

    const taskValues: (typeof studyTasks.$inferInsert)[] = generatedPlan.tasks.map((task) => ({
      userId: user.id,
      studyPlanId: newStudyPlan.id,
      title: task.title,
      description: task.description,
      status: "TODO" as const,
      priority: task.priority,
      position: task.position,
    }));

    const insertedTasks = await db.insert(studyTasks).values(taskValues).returning({
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

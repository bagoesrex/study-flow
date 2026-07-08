import { and, desc, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { studyPlans, studyTasks, subjects } from "@/db/schema";
import { calculateStudyPlanProgress } from "@/features/study-plans/utils/study-plan-progress";
import type { StudyPlanWithProgress } from "@/types/study-plan-progress";

export async function getStudyPlansWithProgress(userId: string) {
  const plans = await db
    .select({
      id: studyPlans.id,
      subjectId: studyPlans.subjectId,
      subjectName: subjects.name,
      subjectColor: subjects.color,
      title: studyPlans.title,
      description: studyPlans.description,
      goal: studyPlans.goal,
      startDate: studyPlans.startDate,
      endDate: studyPlans.endDate,
      status: studyPlans.status,
      priority: studyPlans.priority,
      estimatedHours: studyPlans.estimatedHours,
      totalTasks: sql<number>`count(${studyTasks.id})::int`,
      completedTasks: sql<number>`count(case when ${studyTasks.status} = 'DONE' then 1 end)::int`,
      createdAt: studyPlans.createdAt,
      updatedAt: studyPlans.updatedAt,
    })
    .from(studyPlans)
    .innerJoin(subjects, eq(studyPlans.subjectId, subjects.id))
    .leftJoin(studyTasks, eq(studyTasks.studyPlanId, studyPlans.id))
    .where(and(eq(studyPlans.userId, userId), eq(subjects.userId, userId)))
    .groupBy(
      studyPlans.id,
      studyPlans.subjectId,
      subjects.name,
      subjects.color,
      studyPlans.title,
      studyPlans.description,
      studyPlans.goal,
      studyPlans.startDate,
      studyPlans.endDate,
      studyPlans.status,
      studyPlans.priority,
      studyPlans.estimatedHours,
      studyPlans.createdAt,
      studyPlans.updatedAt
    )
    .orderBy(desc(studyPlans.createdAt));

  return plans.map<StudyPlanWithProgress>((plan) => ({
    ...plan,
    progress: calculateStudyPlanProgress({
      totalTasks: plan.totalTasks,
      completedTasks: plan.completedTasks,
    }),
  }));
}

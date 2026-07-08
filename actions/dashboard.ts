"use server";

import { and, desc, eq, inArray, sql } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/db";
import { studyPlans, studySessions, studyTasks, subjects } from "@/db/schema";
import type { ActionResponse } from "@/types/action-response";
import type {
  DashboardActivePlanProgress,
  DashboardData,
  DashboardRecentSession,
  DashboardRecentTask,
} from "@/types/dashboard";

async function requireAuthUser() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return session.user;
}

export async function getDashboardDataAction(): Promise<ActionResponse<DashboardData>> {
  try {
    const user = await requireAuthUser();

    const [subjectsOverview] = await db
      .select({
        totalSubjects: sql<number>`count(${subjects.id})::int`,
      })
      .from(subjects)
      .where(eq(subjects.userId, user.id));

    const [plansOverview] = await db
      .select({
        activeStudyPlans: sql<number>`count(${studyPlans.id})::int`,
      })
      .from(studyPlans)
      .where(
        and(
          eq(studyPlans.userId, user.id),
          inArray(studyPlans.status, ["NOT_STARTED", "IN_PROGRESS", "PAUSED"])
        )
      );

    const [tasksOverview] = await db
      .select({
        totalTasks: sql<number>`count(${studyTasks.id})::int`,
        completedTasks: sql<number>`count(case when ${studyTasks.status} = 'DONE' then 1 end)::int`,
      })
      .from(studyTasks)
      .where(eq(studyTasks.userId, user.id));

    const [sessionsOverview] = await db
      .select({
        totalStudySessions: sql<number>`count(${studySessions.id})::int`,
        totalStudyMinutes: sql<number>`coalesce(sum(${studySessions.durationMinutes}), 0)::int`,
      })
      .from(studySessions)
      .where(eq(studySessions.userId, user.id));

    const taskCompletionRate =
      tasksOverview.totalTasks > 0
        ? Math.round((tasksOverview.completedTasks / tasksOverview.totalTasks) * 100)
        : 0;

    const recentTasksRaw = await db
      .select({
        id: studyTasks.id,
        title: studyTasks.title,
        status: studyTasks.status,
        priority: studyTasks.priority,
        dueDate: studyTasks.dueDate,
        studyPlanTitle: studyPlans.title,
        subjectName: subjects.name,
        subjectColor: subjects.color,
      })
      .from(studyTasks)
      .innerJoin(studyPlans, eq(studyTasks.studyPlanId, studyPlans.id))
      .innerJoin(subjects, eq(studyPlans.subjectId, subjects.id))
      .where(eq(studyTasks.userId, user.id))
      .orderBy(desc(studyTasks.createdAt))
      .limit(5);

    const recentTasks: DashboardRecentTask[] = recentTasksRaw.map((task) => ({
      id: task.id,
      title: task.title,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      studyPlanTitle: task.studyPlanTitle,
      subjectName: task.subjectName,
      subjectColor: task.subjectColor,
    }));

    const recentSessionsRaw = await db
      .select({
        id: studySessions.id,
        subjectName: subjects.name,
        subjectColor: subjects.color,
        studyPlanTitle: studyPlans.title,
        taskTitle: studyTasks.title,
        durationMinutes: studySessions.durationMinutes,
        mood: studySessions.mood,
        startedAt: studySessions.startedAt,
      })
      .from(studySessions)
      .innerJoin(subjects, eq(studySessions.subjectId, subjects.id))
      .leftJoin(studyPlans, eq(studySessions.studyPlanId, studyPlans.id))
      .leftJoin(studyTasks, eq(studySessions.taskId, studyTasks.id))
      .where(eq(studySessions.userId, user.id))
      .orderBy(desc(studySessions.startedAt))
      .limit(5);

    const recentSessions: DashboardRecentSession[] = recentSessionsRaw.map((session) => ({
      id: session.id,
      subjectName: session.subjectName,
      subjectColor: session.subjectColor,
      studyPlanTitle: session.studyPlanTitle,
      taskTitle: session.taskTitle,
      durationMinutes: session.durationMinutes,
      mood: session.mood,
      startedAt: session.startedAt,
    }));

    const activePlansRaw = await db
      .select({
        id: studyPlans.id,
        title: studyPlans.title,
        subjectName: subjects.name,
        subjectColor: subjects.color,
        totalTasks: sql<number>`count(${studyTasks.id})::int`,
        completedTasks: sql<number>`count(case when ${studyTasks.status} = 'DONE' then 1 end)::int`,
      })
      .from(studyPlans)
      .innerJoin(subjects, eq(studyPlans.subjectId, subjects.id))
      .leftJoin(studyTasks, eq(studyTasks.studyPlanId, studyPlans.id))
      .where(
        and(
          eq(studyPlans.userId, user.id),
          inArray(studyPlans.status, ["NOT_STARTED", "IN_PROGRESS", "PAUSED"])
        )
      )
      .groupBy(studyPlans.id, studyPlans.title, subjects.name, subjects.color)
      .orderBy(desc(studyPlans.createdAt))
      .limit(5);

    const activePlanProgress: DashboardActivePlanProgress[] = activePlansRaw.map((plan) => ({
      id: plan.id,
      title: plan.title,
      subjectName: plan.subjectName,
      subjectColor: plan.subjectColor,
      totalTasks: plan.totalTasks,
      completedTasks: plan.completedTasks,
      progress: plan.totalTasks > 0 ? Math.round((plan.completedTasks / plan.totalTasks) * 100) : 0,
    }));

    return {
      success: true,
      message: "Dashboard data berhasil diambil.",
      data: {
        overview: {
          totalSubjects: subjectsOverview.totalSubjects,
          activeStudyPlans: plansOverview.activeStudyPlans,
          totalTasks: tasksOverview.totalTasks,
          completedTasks: tasksOverview.completedTasks,
          taskCompletionRate,
          totalStudyHours: Number((sessionsOverview.totalStudyMinutes / 60).toFixed(1)),
          totalStudySessions: sessionsOverview.totalStudySessions,
        },
        recentTasks,
        recentSessions,
        activePlanProgress,
      },
    };
  } catch {
    return {
      success: false,
      message: "Gagal mengambil data dashboard.",
    };
  }
}

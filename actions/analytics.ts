"use server";

import { and, desc, eq, gte, sql } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/db";
import { studyPlans, studySessions, studyTasks, subjects } from "@/db/schema";
import type { ActionResponse } from "@/types/action-response";
import type {
  AnalyticsData,
  RecentStudySessionItem,
  StudyHoursBySubjectItem,
  TaskStatusItem,
  WeeklyStudyHourItem,
} from "@/types/analytics";

async function requireAuthUser() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return session.user;
}

function getLastSevenDays() {
  const days: Date[] = [];

  for (let index = 6; index >= 0; index -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - index);
    date.setHours(0, 0, 0, 0);
    days.push(date);
  }

  return days;
}

function formatDateKey(date: Date) {
  return date.toISOString().split("T")[0];
}

function formatDayLabel(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "short",
  }).format(date);
}

export async function getAnalyticsAction(): Promise<ActionResponse<AnalyticsData>> {
  try {
    const user = await requireAuthUser();

    const [sessionOverview] = await db
      .select({
        totalMinutes: sql<number>`coalesce(sum(${studySessions.durationMinutes}), 0)::int`,
        totalSessions: sql<number>`count(${studySessions.id})::int`,
      })
      .from(studySessions)
      .where(eq(studySessions.userId, user.id));

    const [taskOverview] = await db
      .select({
        totalTasks: sql<number>`count(${studyTasks.id})::int`,
        completedTasks: sql<number>`count(case when ${studyTasks.status} = 'DONE' then 1 end)::int`,
      })
      .from(studyTasks)
      .where(eq(studyTasks.userId, user.id));

    const [planOverview] = await db
      .select({
        activeStudyPlans: sql<number>`count(${studyPlans.id})::int`,
      })
      .from(studyPlans)
      .where(
        and(
          eq(studyPlans.userId, user.id),
          sql`${studyPlans.status} in ('NOT_STARTED', 'IN_PROGRESS', 'PAUSED')`
        )
      );

    const totalTasks = taskOverview.totalTasks;
    const totalCompletedTasks = taskOverview.completedTasks;
    const taskCompletionRate =
      totalTasks > 0 ? Math.round((totalCompletedTasks / totalTasks) * 100) : 0;

    const studyHoursBySubjectRaw = await db
      .select({
        subjectId: subjects.id,
        subjectName: subjects.name,
        subjectColor: subjects.color,
        minutes: sql<number>`coalesce(sum(${studySessions.durationMinutes}), 0)::int`,
      })
      .from(studySessions)
      .innerJoin(subjects, eq(studySessions.subjectId, subjects.id))
      .where(eq(studySessions.userId, user.id))
      .groupBy(subjects.id, subjects.name, subjects.color)
      .orderBy(sql`coalesce(sum(${studySessions.durationMinutes}), 0) desc`);

    const studyHoursBySubject: StudyHoursBySubjectItem[] = studyHoursBySubjectRaw.map((item) => ({
      subjectId: item.subjectId,
      subjectName: item.subjectName,
      subjectColor: item.subjectColor,
      minutes: item.minutes,
      hours: Number((item.minutes / 60).toFixed(1)),
    }));

    const mostStudiedSubject =
      studyHoursBySubject.length > 0 ? studyHoursBySubject[0].subjectName : null;

    const taskStatusDistribution = await db
      .select({
        status: studyTasks.status,
        total: sql<number>`count(${studyTasks.id})::int`,
      })
      .from(studyTasks)
      .where(eq(studyTasks.userId, user.id))
      .groupBy(studyTasks.status);

    const normalizedTaskStatusDistribution: TaskStatusItem[] = [
      {
        status: "TODO",
        total: taskStatusDistribution.find((item) => item.status === "TODO")?.total ?? 0,
      },
      {
        status: "IN_PROGRESS",
        total: taskStatusDistribution.find((item) => item.status === "IN_PROGRESS")?.total ?? 0,
      },
      {
        status: "DONE",
        total: taskStatusDistribution.find((item) => item.status === "DONE")?.total ?? 0,
      },
    ];

    const lastSevenDays = getLastSevenDays();
    const sevenDaysAgo = lastSevenDays[0];

    const weeklyRaw = await db
      .select({
        date: sql<string>`to_char(${studySessions.startedAt}, 'YYYY-MM-DD')`,
        minutes: sql<number>`coalesce(sum(${studySessions.durationMinutes}), 0)::int`,
      })
      .from(studySessions)
      .where(and(eq(studySessions.userId, user.id), gte(studySessions.startedAt, sevenDaysAgo)))
      .groupBy(sql`to_char(${studySessions.startedAt}, 'YYYY-MM-DD')`);

    const weeklyStudyHours: WeeklyStudyHourItem[] = lastSevenDays.map((day) => {
      const dateKey = formatDateKey(day);
      const data = weeklyRaw.find((item) => item.date === dateKey);
      const minutes = data?.minutes ?? 0;

      return {
        date: dateKey,
        label: formatDayLabel(day),
        minutes,
        hours: Number((minutes / 60).toFixed(1)),
      };
    });

    const recentStudySessionsRaw = await db
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

    const recentStudySessions: RecentStudySessionItem[] = recentStudySessionsRaw.map((item) => ({
      id: item.id,
      subjectName: item.subjectName,
      subjectColor: item.subjectColor,
      studyPlanTitle: item.studyPlanTitle,
      taskTitle: item.taskTitle,
      durationMinutes: item.durationMinutes,
      mood: item.mood,
      startedAt: item.startedAt,
    }));

    return {
      success: true,
      message: "Analytics berhasil diambil.",
      data: {
        overview: {
          totalStudyHours: Number((sessionOverview.totalMinutes / 60).toFixed(1)),
          totalStudySessions: sessionOverview.totalSessions,
          totalCompletedTasks,
          totalTasks,
          taskCompletionRate,
          activeStudyPlans: planOverview.activeStudyPlans,
          mostStudiedSubject,
        },
        weeklyStudyHours,
        studyHoursBySubject,
        taskStatusDistribution: normalizedTaskStatusDistribution,
        recentStudySessions,
      },
    };
  } catch {
    return {
      success: false,
      message: "Gagal mengambil data analytics.",
    };
  }
}

"use server";

import { and, eq, isNotNull, or, sql } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/db";
import { studyPlans, studyTasks, subjects } from "@/db/schema";
import type { ActionResponse } from "@/types/action-response";

export type TodayFocusTask = {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate: string | null;
  studyPlanTitle: string;
  subjectName: string;
  subjectColor: string;
};

export async function getTodayFocusAction(): Promise<ActionResponse<TodayFocusTask[]>> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    const userId = session.user.id;

    const tasks = await db
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
      .where(
        and(
          eq(studyTasks.userId, userId),
          or(eq(studyTasks.status, "TODO"), eq(studyTasks.status, "IN_PROGRESS")),
          isNotNull(studyTasks.dueDate)
        )
      )
      .orderBy(
        sql`CASE
          WHEN ${studyTasks.dueDate} < CURRENT_DATE THEN 0
          WHEN ${studyTasks.dueDate} = CURRENT_DATE THEN 1
          ELSE 2
        END`,
        sql`CASE ${studyTasks.priority}
          WHEN 'URGENT' THEN 0
          WHEN 'HIGH' THEN 1
          WHEN 'MEDIUM' THEN 2
          WHEN 'LOW' THEN 3
        END`,
        studyTasks.dueDate
      )
      .limit(3);

    return {
      success: true,
      message: "Today focus tasks berhasil diambil.",
      data: tasks.map((task) => ({
        id: task.id,
        title: task.title,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        studyPlanTitle: task.studyPlanTitle,
        subjectName: task.subjectName,
        subjectColor: task.subjectColor,
      })),
    };
  } catch {
    return {
      success: false,
      message: "Gagal mengambil today focus tasks.",
    };
  }
}

export async function getUpcomingDeadlinesAction(): Promise<ActionResponse<TodayFocusTask[]>> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    const userId = session.user.id;

    const tasks = await db
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
      .where(and(eq(studyTasks.userId, userId), isNotNull(studyTasks.dueDate)))
      .orderBy(studyTasks.dueDate)
      .limit(5);

    return {
      success: true,
      message: "Upcoming deadlines berhasil diambil.",
      data: tasks.map((task) => ({
        id: task.id,
        title: task.title,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        studyPlanTitle: task.studyPlanTitle,
        subjectName: task.subjectName,
        subjectColor: task.subjectColor,
      })),
    };
  } catch {
    return {
      success: false,
      message: "Gagal mengambil upcoming deadlines.",
    };
  }
}

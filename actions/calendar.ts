"use server";

import { asc, eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/db";
import { studyPlans, studyTasks, subjects } from "@/db/schema";
import type { ActionResponse } from "@/types/action-response";
import type { CalendarData, CalendarEventItem, CalendarEventStatus } from "@/types/calendar";

async function requireAuthUser() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return session.user;
}

function getTodayDateKey() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return today.toISOString().split("T")[0];
}

function getEventStatus({
  date,
  isCompleted,
}: {
  date: string;
  isCompleted?: boolean;
}): CalendarEventStatus {
  if (isCompleted) {
    return "COMPLETED";
  }

  const todayKey = getTodayDateKey();
  const dateKey = new Date(date).toISOString().split("T")[0];

  if (dateKey < todayKey) {
    return "OVERDUE";
  }

  if (dateKey === todayKey) {
    return "TODAY";
  }

  return "UPCOMING";
}

export async function getCalendarDataAction(): Promise<ActionResponse<CalendarData>> {
  try {
    const user = await requireAuthUser();

    const taskDeadlines = await db
      .select({
        id: studyTasks.id,
        title: studyTasks.title,
        description: studyTasks.description,
        dueDate: studyTasks.dueDate,
        status: studyTasks.status,
        priority: studyTasks.priority,
        studyPlanTitle: studyPlans.title,
        subjectName: subjects.name,
        subjectColor: subjects.color,
      })
      .from(studyTasks)
      .innerJoin(studyPlans, eq(studyTasks.studyPlanId, studyPlans.id))
      .innerJoin(subjects, eq(studyPlans.subjectId, subjects.id))
      .where(eq(studyTasks.userId, user.id))
      .orderBy(asc(studyTasks.dueDate));

    const studyPlanDates = await db
      .select({
        id: studyPlans.id,
        title: studyPlans.title,
        description: studyPlans.description,
        startDate: studyPlans.startDate,
        endDate: studyPlans.endDate,
        status: studyPlans.status,
        subjectName: subjects.name,
        subjectColor: subjects.color,
      })
      .from(studyPlans)
      .innerJoin(subjects, eq(studyPlans.subjectId, subjects.id))
      .where(eq(studyPlans.userId, user.id))
      .orderBy(asc(studyPlans.startDate));

    const taskEvents: CalendarEventItem[] = taskDeadlines
      .filter((task) => Boolean(task.dueDate))
      .map((task) => ({
        id: `task-${task.id}`,
        sourceId: task.id,
        type: "TASK_DEADLINE",
        status: getEventStatus({
          date: task.dueDate!,
          isCompleted: task.status === "DONE",
        }),
        title: task.title,
        description: task.description,
        date: task.dueDate!,
        subjectName: task.subjectName,
        subjectColor: task.subjectColor,
        studyPlanTitle: task.studyPlanTitle,
        taskStatus: task.status,
        taskPriority: task.priority,
      }));

    const planStartEvents: CalendarEventItem[] = studyPlanDates
      .filter((plan) => Boolean(plan.startDate))
      .map((plan) => ({
        id: `plan-start-${plan.id}`,
        sourceId: plan.id,
        type: "STUDY_PLAN_START",
        status: getEventStatus({
          date: plan.startDate!,
          isCompleted: plan.status === "COMPLETED",
        }),
        title: plan.title,
        description: plan.description,
        date: plan.startDate!,
        subjectName: plan.subjectName,
        subjectColor: plan.subjectColor,
        studyPlanTitle: plan.title,
        taskStatus: null,
        taskPriority: null,
      }));

    const planEndEvents: CalendarEventItem[] = studyPlanDates
      .filter((plan) => Boolean(plan.endDate))
      .map((plan) => ({
        id: `plan-end-${plan.id}`,
        sourceId: plan.id,
        type: "STUDY_PLAN_END",
        status: getEventStatus({
          date: plan.endDate!,
          isCompleted: plan.status === "COMPLETED",
        }),
        title: plan.title,
        description: plan.description,
        date: plan.endDate!,
        subjectName: plan.subjectName,
        subjectColor: plan.subjectColor,
        studyPlanTitle: plan.title,
        taskStatus: null,
        taskPriority: null,
      }));

    const events = [...taskEvents, ...planStartEvents, ...planEndEvents].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const overdueTasks = taskEvents.filter((event) => event.status === "OVERDUE").length;

    const dueTodayTasks = taskEvents.filter((event) => event.status === "TODAY").length;

    const upcomingTasks = taskEvents.filter((event) => event.status === "UPCOMING").length;

    const completedTasks = taskEvents.filter((event) => event.status === "COMPLETED").length;

    return {
      success: true,
      message: "Calendar data berhasil diambil.",
      data: {
        summary: {
          totalEvents: events.length,
          overdueTasks,
          dueTodayTasks,
          upcomingTasks,
          completedTasks,
        },
        events,
      },
    };
  } catch {
    return {
      success: false,
      message: "Gagal mengambil data calendar.",
    };
  }
}

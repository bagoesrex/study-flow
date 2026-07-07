import { sql } from "drizzle-orm";

import { db } from "@/db";
import { studyPlans, studySessions, studyTasks, testimonials, users } from "@/db/schema";

export type LandingStats = {
  totalUsers: number;
  totalStudyPlans: number;
  totalStudySessions: number;
  totalHoursTracked: number;
  averageCompletionRate: number;
  totalPublishedTestimonials: number;
};

export async function getLandingStats(): Promise<LandingStats> {
  const [result] = await db
    .select({
      totalUsers: sql<number>`count(distinct ${users.id})::int`,
      totalStudyPlans: sql<number>`count(distinct ${studyPlans.id})::int`,
      totalStudySessions: sql<number>`count(distinct ${studySessions.id})::int`,
      totalHoursTracked: sql<number>`coalesce(round(sum(${studySessions.durationMinutes}) / 60.0), 0)::int`,
      completedTasks: sql<number>`count(distinct case when ${studyTasks.status} = 'DONE' then ${studyTasks.id} end)::int`,
      totalTasks: sql<number>`count(distinct ${studyTasks.id})::int`,
      totalPublishedTestimonials: sql<number>`count(distinct case when ${testimonials.isPublished} = true then ${testimonials.id} end)::int`,
    })
    .from(users)
    .leftJoin(studyPlans, sql`${studyPlans.userId} = ${users.id}`)
    .leftJoin(studySessions, sql`${studySessions.userId} = ${users.id}`)
    .leftJoin(studyTasks, sql`${studyTasks.userId} = ${users.id}`)
    .leftJoin(testimonials, sql`${testimonials.isPublished} = true`);

  const completionRate =
    result.totalTasks > 0 ? Math.round((result.completedTasks / result.totalTasks) * 100) : 0;

  return {
    totalUsers: result.totalUsers,
    totalStudyPlans: result.totalStudyPlans,
    totalStudySessions: result.totalStudySessions,
    totalHoursTracked: result.totalHoursTracked,
    averageCompletionRate: completionRate,
    totalPublishedTestimonials: result.totalPublishedTestimonials,
  };
}

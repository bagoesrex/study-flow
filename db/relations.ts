import { relations } from "drizzle-orm";

import {
  feedbacks,
  studyPlans,
  studySessions,
  studyTasks,
  subjects,
  testimonials,
  users,
} from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  subjects: many(subjects),
  studyPlans: many(studyPlans),
  studyTasks: many(studyTasks),
  studySessions: many(studySessions),
  testimonials: many(testimonials),
  feedbacks: many(feedbacks),
}));

export const subjectsRelations = relations(subjects, ({ one, many }) => ({
  user: one(users, {
    fields: [subjects.userId],
    references: [users.id],
  }),
  studyPlans: many(studyPlans),
  studySessions: many(studySessions),
}));

export const studyPlansRelations = relations(studyPlans, ({ one, many }) => ({
  user: one(users, {
    fields: [studyPlans.userId],
    references: [users.id],
  }),
  subject: one(subjects, {
    fields: [studyPlans.subjectId],
    references: [subjects.id],
  }),
  tasks: many(studyTasks),
  sessions: many(studySessions),
}));

export const studyTasksRelations = relations(studyTasks, ({ one, many }) => ({
  user: one(users, {
    fields: [studyTasks.userId],
    references: [users.id],
  }),
  studyPlan: one(studyPlans, {
    fields: [studyTasks.studyPlanId],
    references: [studyPlans.id],
  }),
  sessions: many(studySessions),
}));

export const studySessionsRelations = relations(studySessions, ({ one }) => ({
  user: one(users, {
    fields: [studySessions.userId],
    references: [users.id],
  }),
  subject: one(subjects, {
    fields: [studySessions.subjectId],
    references: [subjects.id],
  }),
  studyPlan: one(studyPlans, {
    fields: [studySessions.studyPlanId],
    references: [studyPlans.id],
  }),
  task: one(studyTasks, {
    fields: [studySessions.taskId],
    references: [studyTasks.id],
  }),
}));

export const testimonialsRelations = relations(testimonials, ({ one }) => ({
  user: one(users, {
    fields: [testimonials.userId],
    references: [users.id],
  }),
}));

export const feedbacksRelations = relations(feedbacks, ({ one }) => ({
  user: one(users, {
    fields: [feedbacks.userId],
    references: [users.id],
  }),
}));

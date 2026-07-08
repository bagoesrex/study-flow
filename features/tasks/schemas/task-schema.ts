import { z } from "zod";

export const taskStatusSchema = z.enum(["TODO", "IN_PROGRESS", "DONE"]);

export const taskPrioritySchema = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);

export const taskSchema = z.object({
  studyPlanId: z.string().uuid("Study plan tidak valid"),
  title: z
    .string()
    .min(3, "Judul task minimal 3 karakter")
    .max(180, "Judul task maksimal 180 karakter"),
  description: z.string().max(700, "Deskripsi maksimal 700 karakter").optional().or(z.literal("")),
  status: taskStatusSchema.default("TODO"),
  priority: taskPrioritySchema.default("MEDIUM"),
  dueDate: z.string().optional().or(z.literal("")),
  position: z.coerce
    .number()
    .int("Position harus angka bulat")
    .min(0, "Position minimal 0")
    .optional()
    .or(z.literal("")),
});

export const updateTaskSchema = taskSchema.extend({
  id: z.string().uuid("ID task tidak valid"),
});

export const updateTaskStatusSchema = z.object({
  id: z.string().uuid("ID task tidak valid"),
  status: taskStatusSchema,
});

export const deleteTaskSchema = z.object({
  id: z.string().uuid("ID task tidak valid"),
});

export type TaskInput = z.infer<typeof taskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;
export type DeleteTaskInput = z.infer<typeof deleteTaskSchema>;

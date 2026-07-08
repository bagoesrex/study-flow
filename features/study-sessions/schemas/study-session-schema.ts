import { z } from "zod";

export const studySessionMoodSchema = z.enum(["FOCUSED", "NORMAL", "TIRED", "DISTRACTED"]);

export const studySessionSchema = z.object({
  subjectId: z.string().uuid("Subject tidak valid"),
  studyPlanId: z.string().uuid("Study plan tidak valid").optional().or(z.literal("")),
  taskId: z.string().uuid("Task tidak valid").optional().or(z.literal("")),
  durationMinutes: z.coerce
    .number()
    .int("Durasi harus berupa angka bulat")
    .min(1, "Durasi minimal 1 menit")
    .max(1440, "Durasi maksimal 1440 menit"),
  note: z.string().max(1000, "Catatan maksimal 1000 karakter").optional().or(z.literal("")),
  mood: studySessionMoodSchema.default("NORMAL"),
  startedAt: z.string().min(1, "Waktu mulai wajib diisi"),
  endedAt: z.string().optional().or(z.literal("")),
});

export const updateStudySessionSchema = studySessionSchema.extend({
  id: z.string().uuid("ID study session tidak valid"),
});

export const deleteStudySessionSchema = z.object({
  id: z.string().uuid("ID study session tidak valid"),
});

export type StudySessionInput = z.infer<typeof studySessionSchema>;
export type UpdateStudySessionInput = z.infer<typeof updateStudySessionSchema>;
export type DeleteStudySessionInput = z.infer<typeof deleteStudySessionSchema>;

export type StudySessionMood = "FOCUSED" | "NORMAL" | "TIRED" | "DISTRACTED";

export type StudySessionItem = {
  id: string;
  subjectId: string;
  subjectName: string;
  subjectColor: string;
  studyPlanId: string | null;
  studyPlanTitle: string | null;
  taskId: string | null;
  taskTitle: string | null;
  durationMinutes: number;
  note: string | null;
  mood: StudySessionMood;
  startedAt: Date;
  endedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

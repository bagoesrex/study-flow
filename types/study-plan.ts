export type StudyPlanStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "PAUSED" | "CANCELLED";

export type StudyPlanPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type StudyPlanItem = {
  id: string;
  subjectId: string;
  subjectName: string;
  subjectColor: string;
  title: string;
  description: string | null;
  goal: string | null;
  startDate: string | null;
  endDate: string | null;
  status: StudyPlanStatus;
  priority: StudyPlanPriority;
  estimatedHours: number | null;
  createdAt: Date;
  updatedAt: Date;
};

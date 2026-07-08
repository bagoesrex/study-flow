export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type TaskItem = {
  id: string;
  studyPlanId: string;
  studyPlanTitle: string;
  subjectName: string;
  subjectColor: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  position: number;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

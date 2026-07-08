export type StudyPlanProgress = {
  totalTasks: number;
  completedTasks: number;
  progress: number;
};

export type StudyPlanWithProgress = {
  id: string;
  subjectId: string;
  subjectName: string;
  subjectColor: string;
  title: string;
  description: string | null;
  goal: string | null;
  startDate: string | null;
  endDate: string | null;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "PAUSED" | "CANCELLED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  estimatedHours: number | null;
  totalTasks: number;
  completedTasks: number;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
};

export type AiStudyPlanDifficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export type AiGeneratedTask = {
  title: string;
  description: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  position: number;
};

export type AiGeneratedStudyPlan = {
  title: string;
  description: string | null;
  goal: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  estimatedHours: number | null;
  tasks: AiGeneratedTask[];
};

export type SavedGeneratedStudyPlan = {
  studyPlanId: string;
  taskIds: string[];
};

export type DashboardOverview = {
  totalSubjects: number;
  activeStudyPlans: number;
  totalTasks: number;
  completedTasks: number;
  taskCompletionRate: number;
  totalStudyHours: number;
  totalStudySessions: number;
};

export type DashboardRecentTask = {
  id: string;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate: string | null;
  studyPlanTitle: string;
  subjectName: string;
  subjectColor: string;
};

export type DashboardRecentSession = {
  id: string;
  subjectName: string;
  subjectColor: string;
  studyPlanTitle: string | null;
  taskTitle: string | null;
  durationMinutes: number;
  mood: "FOCUSED" | "NORMAL" | "TIRED" | "DISTRACTED";
  startedAt: Date;
};

export type DashboardActivePlanProgress = {
  id: string;
  title: string;
  subjectName: string;
  subjectColor: string;
  totalTasks: number;
  completedTasks: number;
  progress: number;
};

export type DashboardData = {
  overview: DashboardOverview;
  recentTasks: DashboardRecentTask[];
  recentSessions: DashboardRecentSession[];
  activePlanProgress: DashboardActivePlanProgress[];
};

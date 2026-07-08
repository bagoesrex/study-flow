export type AnalyticsOverview = {
  totalStudyHours: number;
  totalStudySessions: number;
  totalCompletedTasks: number;
  totalTasks: number;
  taskCompletionRate: number;
  activeStudyPlans: number;
  mostStudiedSubject: string | null;
};

export type WeeklyStudyHourItem = {
  date: string;
  label: string;
  minutes: number;
  hours: number;
};

export type StudyHoursBySubjectItem = {
  subjectId: string;
  subjectName: string;
  subjectColor: string;
  minutes: number;
  hours: number;
};

export type TaskStatusItem = {
  status: "TODO" | "IN_PROGRESS" | "DONE";
  total: number;
};

export type RecentStudySessionItem = {
  id: string;
  subjectName: string;
  subjectColor: string;
  studyPlanTitle: string | null;
  taskTitle: string | null;
  durationMinutes: number;
  mood: "FOCUSED" | "NORMAL" | "TIRED" | "DISTRACTED";
  startedAt: Date;
};

export type AnalyticsData = {
  overview: AnalyticsOverview;
  weeklyStudyHours: WeeklyStudyHourItem[];
  studyHoursBySubject: StudyHoursBySubjectItem[];
  taskStatusDistribution: TaskStatusItem[];
  recentStudySessions: RecentStudySessionItem[];
};

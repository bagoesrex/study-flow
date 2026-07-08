export function calculateStudyPlanProgress({
  totalTasks,
  completedTasks,
}: {
  totalTasks: number;
  completedTasks: number;
}) {
  if (totalTasks <= 0) {
    return 0;
  }

  return Math.round((completedTasks / totalTasks) * 100);
}

export function getProgressLabel(progress: number) {
  if (progress === 0) {
    return "Not started";
  }

  if (progress < 50) {
    return "In progress";
  }

  if (progress < 100) {
    return "Almost there";
  }

  return "Completed";
}

export function getProgressDescription({
  completedTasks,
  totalTasks,
}: {
  completedTasks: number;
  totalTasks: number;
}) {
  return `${completedTasks}/${totalTasks} tasks completed`;
}

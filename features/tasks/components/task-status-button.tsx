"use client";

import { useUpdateTaskStatusMutation } from "@/features/tasks/hooks/use-update-task-status-mutation";
import type { TaskStatus } from "@/types/task";
import { Button } from "@/components/ui/button";

type TaskStatusButtonProps = {
  taskId: string;
  currentStatus: TaskStatus;
};

const nextStatus: Record<TaskStatus, { label: string; status: TaskStatus }> = {
  TODO: { label: "Start", status: "IN_PROGRESS" },
  IN_PROGRESS: { label: "Complete", status: "DONE" },
  DONE: { label: "Reopen", status: "TODO" },
};

export function TaskStatusButton({ taskId, currentStatus }: TaskStatusButtonProps) {
  const mutation = useUpdateTaskStatusMutation();

  const next = nextStatus[currentStatus];

  async function handleClick() {
    await mutation.mutateAsync({ id: taskId, status: next.status });
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={mutation.isPending}
      onClick={handleClick}
    >
      {mutation.isPending ? "..." : next.label}
    </Button>
  );
}

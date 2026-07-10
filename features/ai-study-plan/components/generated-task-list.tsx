import { Badge } from "@/components/ui/badge";
import type { AiGeneratedTask } from "@/types/ai-study-plan";

type GeneratedTaskListProps = {
  tasks: AiGeneratedTask[];
};

function getPriorityVariant(priority: AiGeneratedTask["priority"]) {
  if (priority === "URGENT") return "danger";
  if (priority === "HIGH") return "warning";
  if (priority === "MEDIUM") return "info";
  return "default";
}

export function GeneratedTaskList({ tasks }: GeneratedTaskListProps) {
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div key={task.position} className="rounded-2xl border border-slate-200 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="mb-1 flex items-center gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-600">
                  {task.position}
                </span>
                <h4 className="truncate text-sm font-semibold text-slate-950">{task.title}</h4>
              </div>

              {task.description ? (
                <p className="mt-1 text-sm leading-6 text-slate-500">{task.description}</p>
              ) : null}
            </div>

            <Badge variant={getPriorityVariant(task.priority)} className="shrink-0">
              {task.priority}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}

import { PageHeader } from "@/components/common/page-header";
import { TaskCreateDialog } from "@/features/tasks/components/task-create-dialog";
import { TaskList } from "@/features/tasks/components/task-list";

export default function TasksPage() {
  return (
    <div className="space-y-6 lg:space-y-8">
      <PageHeader
        title="Tasks"
        description="Pecah study plan menjadi task kecil agar progres belajar lebih mudah dipantau."
        actions={<TaskCreateDialog />}
      />

      <TaskList />
    </div>
  );
}

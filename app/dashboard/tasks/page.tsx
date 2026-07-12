import { PageHeader } from "@/components/common/page-header";
import { TaskCreateForm } from "@/features/tasks/components/task-create-form";
import { TaskList } from "@/features/tasks/components/task-list";

export default function TasksPage() {
  return (
    <div className="space-y-6 lg:space-y-8">
      <PageHeader
        title="Tasks"
        description="Pecah study plan menjadi task kecil agar progres belajar lebih mudah dipantau."
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(320px,420px)_minmax(0,1fr)] xl:items-start">
        <div className="xl:sticky xl:top-24">
          <TaskCreateForm />
        </div>

        <div className="min-w-0">
          <TaskList />
        </div>
      </div>
    </div>
  );
}

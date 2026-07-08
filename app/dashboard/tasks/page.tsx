import { TaskCreateForm } from "@/features/tasks/components/task-create-form";
import { TaskList } from "@/features/tasks/components/task-list";

export default function TasksPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <TaskCreateForm />

      <div>
        <div className="mb-5">
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Tasks</h1>
          <p className="mt-2 text-sm text-slate-500">
            Pecah study plan menjadi task kecil agar progres belajar lebih mudah dipantau.
          </p>
        </div>

        <TaskList />
      </div>
    </div>
  );
}

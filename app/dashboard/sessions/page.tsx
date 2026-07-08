import { StudySessionCreateForm } from "@/features/study-sessions/components/study-session-create-form";
import { StudySessionList } from "@/features/study-sessions/components/study-session-list";

export default function SessionsPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <StudySessionCreateForm />

      <div>
        <div className="mb-5">
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Study Sessions</h1>
          <p className="mt-2 text-sm text-slate-500">
            Catat durasi belajar, mood, catatan, dan aktivitas belajar harian kamu.
          </p>
        </div>

        <StudySessionList />
      </div>
    </div>
  );
}

import { PageHeader } from "@/components/common/page-header";
import { StudySessionCreateForm } from "@/features/study-sessions/components/study-session-create-form";
import { StudySessionList } from "@/features/study-sessions/components/study-session-list";

export default function SessionsPage() {
  return (
    <div className="space-y-6 lg:space-y-8">
      <PageHeader
        title="Study Sessions"
        description="Catat durasi belajar, mood, catatan, dan aktivitas belajar harian kamu."
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(320px,420px)_minmax(0,1fr)] xl:items-start">
        <div className="xl:sticky xl:top-24">
          <StudySessionCreateForm />
        </div>

        <div className="min-w-0">
          <StudySessionList />
        </div>
      </div>
    </div>
  );
}

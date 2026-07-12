import { PageHeader } from "@/components/common/page-header";
import { StudySessionCreateDialog } from "@/features/study-sessions/components/study-session-create-dialog";
import { StudySessionList } from "@/features/study-sessions/components/study-session-list";

export default function SessionsPage() {
  return (
    <div className="space-y-6 lg:space-y-8">
      <PageHeader
        title="Study Sessions"
        description="Catat durasi belajar, mood, catatan, dan aktivitas belajar harian kamu."
        actions={<StudySessionCreateDialog />}
      />

      <StudySessionList />
    </div>
  );
}

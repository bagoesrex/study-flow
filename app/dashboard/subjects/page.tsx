import { PageHeader } from "@/components/common/page-header";
import { SubjectCreateDialog } from "@/features/subjects/components/subject-create-dialog";
import { SubjectList } from "@/features/subjects/components/subject-list";

export default function SubjectsPage() {
  return (
    <div className="space-y-6 lg:space-y-8">
      <PageHeader
        title="Subjects"
        description="Manage learning categories for your study plans, tasks, and sessions."
        actions={<SubjectCreateDialog />}
      />

      <SubjectList />
    </div>
  );
}

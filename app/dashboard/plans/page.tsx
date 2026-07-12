import { PageHeader } from "@/components/common/page-header";
import { StudyPlanCreateDialog } from "@/features/study-plans/components/study-plan-create-dialog";
import { StudyPlanList } from "@/features/study-plans/components/study-plan-list";

export default function PlansPage() {
  return (
    <div className="space-y-6 lg:space-y-8">
      <PageHeader
        title="Study Plans"
        description="Kelola rencana belajar kamu."
        actions={<StudyPlanCreateDialog />}
      />

      <StudyPlanList />
    </div>
  );
}

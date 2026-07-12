import { PageHeader } from "@/components/common/page-header";
import { StudyPlanCreateForm } from "@/features/study-plans/components/study-plan-create-form";
import { StudyPlanList } from "@/features/study-plans/components/study-plan-list";

export default function PlansPage() {
  return (
    <div className="space-y-6 lg:space-y-8">
      <PageHeader title="Study Plans" description="Kelola rencana belajar kamu." />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] xl:items-start">
        <div className="min-w-0">
          <StudyPlanList />
        </div>

        <div className="xl:sticky xl:top-24">
          <StudyPlanCreateForm />
        </div>
      </div>
    </div>
  );
}

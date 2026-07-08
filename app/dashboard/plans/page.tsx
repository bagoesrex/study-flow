import { StudyPlanCreateForm } from "@/features/study-plans/components/study-plan-create-form";
import { StudyPlanList } from "@/features/study-plans/components/study-plan-list";

export default function PlansPage() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-start">
      <section>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Study Plans</h1>
          <p className="mt-1 text-sm text-slate-500">Kelola rencana belajar kamu.</p>
        </div>

        <StudyPlanList />
      </section>

      <section>
        <StudyPlanCreateForm />
      </section>
    </div>
  );
}

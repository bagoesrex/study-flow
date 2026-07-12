import { PageHeader } from "@/components/common/page-header";
import { SubjectCreateForm } from "@/features/subjects/components/subject-create-form";
import { SubjectList } from "@/features/subjects/components/subject-list";

export default function SubjectsPage() {
  return (
    <div className="space-y-6 lg:space-y-8">
      <PageHeader
        title="Subjects"
        description="Kelola kategori belajar yang akan digunakan untuk study plan, task, dan session."
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(320px,420px)_minmax(0,1fr)] xl:items-start">
        <div className="xl:sticky xl:top-24">
          <SubjectCreateForm />
        </div>

        <div className="min-w-0">
          <SubjectList />
        </div>
      </div>
    </div>
  );
}

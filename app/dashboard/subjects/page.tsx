import { SubjectCreateForm } from "@/features/subjects/components/subject-create-form";
import { SubjectList } from "@/features/subjects/components/subject-list";

export default function SubjectsPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <SubjectCreateForm />

      <div>
        <div className="mb-5">
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Subjects</h1>
          <p className="mt-2 text-sm text-slate-500">
            Kelola kategori belajar yang akan digunakan untuk study plan, task, dan session.
          </p>
        </div>

        <SubjectList />
      </div>
    </div>
  );
}

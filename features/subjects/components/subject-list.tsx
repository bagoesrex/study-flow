"use client";

import { SubjectCard } from "@/features/subjects/components/subject-card";
import { SubjectEmptyState } from "@/features/subjects/components/subject-empty-state";
import { useSubjectsQuery } from "@/features/subjects/hooks/use-subjects-query";
import { Card } from "@/components/ui/card";

export function SubjectList() {
  const query = useSubjectsQuery();

  if (query.isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="h-44 animate-pulse bg-slate-100" />
        ))}
      </div>
    );
  }

  if (query.isError) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-950">Gagal memuat subject</h3>
        <p className="mt-2 text-sm text-slate-500">Silakan refresh halaman atau coba lagi nanti.</p>
      </Card>
    );
  }

  const subjects = query.data ?? [];

  if (subjects.length === 0) {
    return <SubjectEmptyState />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {subjects.map((subject) => (
        <SubjectCard key={subject.id} subject={subject} />
      ))}
    </div>
  );
}

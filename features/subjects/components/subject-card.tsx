"use client";

import { Archive, ArchiveRestore } from "lucide-react";

import { useToggleArchiveSubjectMutation } from "@/features/subjects/hooks/use-update-subject-mutation";
import { SubjectDeleteDialog } from "@/features/subjects/components/subject-delete-dialog";
import { SubjectUpdateDialog } from "@/features/subjects/components/subject-update-dialog";
import type { SubjectItem } from "@/types/subject";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type SubjectCardProps = {
  subject: SubjectItem;
};

export function SubjectCard({ subject }: SubjectCardProps) {
  const archiveMutation = useToggleArchiveSubjectMutation();

  async function handleArchiveToggle() {
    await archiveMutation.mutateAsync({
      id: subject.id,
    });
  }

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="mb-3 flex items-center gap-3">
            <span
              className="h-4 w-4 shrink-0 rounded-full"
              style={{ backgroundColor: subject.color }}
            />

            <h3 className="truncate text-lg font-semibold tracking-tight text-slate-950">
              {subject.name}
            </h3>
          </div>

          <p className="line-clamp-2 text-sm leading-6 text-slate-500">
            {subject.description ?? "No description"}
          </p>
        </div>

        {subject.isArchived ? (
          <Badge variant="warning">Archived</Badge>
        ) : (
          <Badge variant="success">Active</Badge>
        )}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          Target:{" "}
          <span className="font-medium text-slate-950">
            {subject.targetHours ? `${subject.targetHours}h` : "Not set"}
          </span>
        </p>

        <div className="flex items-center gap-2">
          <SubjectUpdateDialog subject={subject} />

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleArchiveToggle}
            disabled={archiveMutation.isPending}
          >
            {subject.isArchived ? (
              <ArchiveRestore className="h-4 w-4" />
            ) : (
              <Archive className="h-4 w-4" />
            )}
          </Button>

          <SubjectDeleteDialog subject={subject} />
        </div>
      </div>
    </Card>
  );
}

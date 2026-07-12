"use client";

import { Archive, ArchiveRestore, BookOpen, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useToggleArchiveSubjectMutation } from "@/features/subjects/hooks/use-update-subject-mutation";
import { SubjectDeleteDialog } from "@/features/subjects/components/subject-delete-dialog";
import { SubjectUpdateDialog } from "@/features/subjects/components/subject-update-dialog";
import type { SubjectItem } from "@/types/subject";
import { SurfaceCard } from "@/components/common/surface-card";
import { ActionMenu } from "@/components/common/action-menu";
import { StatusBadge } from "@/components/common/status-indicator";
import { Button } from "@/components/ui/button";

type SubjectCardProps = {
  subject: SubjectItem;
};

export function SubjectCard({ subject }: SubjectCardProps) {
  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const archiveMutation = useToggleArchiveSubjectMutation();

  async function handleArchiveToggle() {
    await archiveMutation.mutateAsync({ id: subject.id });
  }

  return (
    <>
      <SurfaceCard className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
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

          <div className="flex shrink-0 items-center gap-2">
            <StatusBadge variant={subject.isArchived ? "warning" : "success"}>
              {subject.isArchived ? "Archived" : "Active"}
            </StatusBadge>

            <ActionMenu
              label="Subject actions"
              items={[
                {
                  label: "Edit",
                  icon: Pencil,
                  onSelect: () => setUpdateOpen(true),
                },
                {
                  label: subject.isArchived ? "Unarchive" : "Archive",
                  icon: subject.isArchived ? ArchiveRestore : Archive,
                  onSelect: handleArchiveToggle,
                  disabled: archiveMutation.isPending,
                },
                {
                  label: "Delete",
                  icon: Trash2,
                  onSelect: () => setDeleteOpen(true),
                  destructive: true,
                },
              ]}
            />
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Target:{" "}
            <span className="font-medium text-slate-950">
              {subject.targetHours ? `${subject.targetHours}h` : "Not set"}
            </span>
          </p>

          <Button asChild variant="outline" size="sm">
            <Link href={`/dashboard/plans?subjectId=${subject.id}`}>
              <BookOpen className="mr-1.5 h-4 w-4" />
              View Plans
            </Link>
          </Button>
        </div>
      </SurfaceCard>

      <SubjectUpdateDialog subject={subject} open={updateOpen} onOpenChange={setUpdateOpen} />
      <SubjectDeleteDialog subject={subject} open={deleteOpen} onOpenChange={setDeleteOpen} />
    </>
  );
}

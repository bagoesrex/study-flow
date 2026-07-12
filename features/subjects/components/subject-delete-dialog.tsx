"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { useDeleteSubjectMutation } from "@/features/subjects/hooks/use-delete-subject-mutation";
import type { SubjectItem } from "@/types/subject";
import { Button } from "@/components/ui/button";

type SubjectDeleteDialogProps = {
  subject: SubjectItem;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function SubjectDeleteDialog({
  subject,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: SubjectDeleteDialogProps) {
  const mutation = useDeleteSubjectMutation();

  async function handleDelete() {
    const result = await mutation.mutateAsync({ id: subject.id });

    if (result.success) {
      controlledOnOpenChange?.(false);
    }
  }

  return (
    <Dialog.Root open={controlledOpen} onOpenChange={controlledOnOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm" />

        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-xl sm:p-6">
          <div className="mb-6 flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold tracking-tight text-slate-950">
              Delete Subject
            </Dialog.Title>

            <Dialog.Close asChild>
              <Button variant="ghost" size="sm" aria-label="Close">
                <X className="h-4 w-4" />
              </Button>
            </Dialog.Close>
          </div>

          <p className="text-sm leading-6 text-slate-600">
            Apakah kamu yakin ingin menghapus{" "}
            <span className="font-semibold text-slate-950">{subject.name}</span>?
          </p>

          <p className="mt-2 text-sm leading-6 text-rose-600">
            Tindakan ini akan menghapus semua study plan, task, dan session yang terkait dengan
            subject ini.
          </p>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Dialog.Close asChild>
              <Button type="button" variant="secondary" className="w-full sm:w-auto">
                Cancel
              </Button>
            </Dialog.Close>

            <Button
              type="button"
              variant="primary"
              disabled={mutation.isPending}
              onClick={handleDelete}
              className="w-full bg-rose-600 hover:bg-rose-700 focus-visible:ring-rose-600 sm:w-auto"
            >
              {mutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

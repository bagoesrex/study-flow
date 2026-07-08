"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Trash2, X } from "lucide-react";
import { useState } from "react";

import { useDeleteSubjectMutation } from "@/features/subjects/hooks/use-delete-subject-mutation";
import type { SubjectItem } from "@/types/subject";
import { Button } from "@/components/ui/button";

type SubjectDeleteDialogProps = {
  subject: SubjectItem;
};

export function SubjectDeleteDialog({ subject }: SubjectDeleteDialogProps) {
  const [open, setOpen] = useState(false);
  const mutation = useDeleteSubjectMutation();

  async function handleDelete() {
    const result = await mutation.mutateAsync({ id: subject.id });

    if (result.success) {
      setOpen(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button type="button" variant="outline" size="sm">
          <Trash2 className="h-4 w-4" />
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm" />

        <Dialog.Content className="fixed inset-1/2 z-50 h-fit w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
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

          <div className="mt-6 flex items-center justify-end gap-3">
            <Dialog.Close asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </Dialog.Close>

            <Button
              type="button"
              variant="primary"
              disabled={mutation.isPending}
              onClick={handleDelete}
              className="bg-rose-600 hover:bg-rose-700 focus-visible:ring-rose-600"
            >
              {mutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

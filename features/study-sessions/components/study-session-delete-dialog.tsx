"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Trash2, X } from "lucide-react";
import { useState } from "react";

import { useDeleteStudySessionMutation } from "@/features/study-sessions/hooks/use-delete-study-session-mutation";
import type { StudySessionItem } from "@/types/study-session";
import { formatDuration, formatSessionDate } from "@/features/study-sessions/utils/session-format";
import { Button } from "@/components/ui/button";

type StudySessionDeleteDialogProps = {
  session: StudySessionItem;
};

export function StudySessionDeleteDialog({ session }: StudySessionDeleteDialogProps) {
  const [open, setOpen] = useState(false);
  const mutation = useDeleteStudySessionMutation();

  async function handleDelete() {
    const result = await mutation.mutateAsync({ id: session.id });

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

        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-xl sm:p-6">
          <div className="mb-6 flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold tracking-tight text-slate-950">
              Delete Study Session
            </Dialog.Title>

            <Dialog.Close asChild>
              <Button variant="ghost" size="sm" aria-label="Close">
                <X className="h-4 w-4" />
              </Button>
            </Dialog.Close>
          </div>

          <p className="text-sm leading-6 text-slate-600">
            Apakah kamu yakin ingin menghapus sesi belajar{" "}
            <span className="font-semibold text-slate-950">{session.subjectName}</span> dengan
            durasi{" "}
            <span className="font-semibold text-slate-950">
              {formatDuration(session.durationMinutes)}
            </span>{" "}
            pada{" "}
            <span className="font-semibold text-slate-950">
              {formatSessionDate(session.startedAt)}
            </span>
            ?
          </p>

          <p className="mt-2 text-sm leading-6 text-rose-600">
            Menghapus study session akan menghapus catatan sesi belajar ini secara permanen.
            Tindakan ini tidak bisa dibatalkan.
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

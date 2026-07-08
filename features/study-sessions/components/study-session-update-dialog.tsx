"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Pencil, X } from "lucide-react";
import { useState } from "react";

import { StudySessionUpdateForm } from "@/features/study-sessions/components/study-session-update-form";
import type { StudySessionItem } from "@/types/study-session";
import { Button } from "@/components/ui/button";

type StudySessionUpdateDialogProps = {
  session: StudySessionItem;
};

export function StudySessionUpdateDialog({ session }: StudySessionUpdateDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button type="button" variant="outline" size="sm">
          <Pencil className="h-4 w-4" />
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm" />

        <Dialog.Content className="fixed inset-1/2 z-50 h-fit w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
          <div className="mb-6 flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold tracking-tight text-slate-950">
              Edit Study Session
            </Dialog.Title>

            <Dialog.Close asChild>
              <Button variant="ghost" size="sm" aria-label="Close">
                <X className="h-4 w-4" />
              </Button>
            </Dialog.Close>
          </div>

          <StudySessionUpdateForm session={session} onSuccess={() => setOpen(false)} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

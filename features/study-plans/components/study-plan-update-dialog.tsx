"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { StudyPlanUpdateForm } from "@/features/study-plans/components/study-plan-update-form";
import type { StudyPlanItem } from "@/types/study-plan";
import { Button } from "@/components/ui/button";

type StudyPlanUpdateDialogProps = {
  plan: StudyPlanItem;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function StudyPlanUpdateDialog({
  plan,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: StudyPlanUpdateDialogProps) {
  return (
    <Dialog.Root open={controlledOpen} onOpenChange={controlledOnOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm" />

        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-xl sm:p-6">
          <div className="mb-6 flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold tracking-tight text-slate-950">
              Edit Study Plan
            </Dialog.Title>

            <Dialog.Close asChild>
              <Button variant="ghost" size="sm" aria-label="Close">
                <X className="h-4 w-4" />
              </Button>
            </Dialog.Close>
          </div>

          <StudyPlanUpdateForm plan={plan} onSuccess={() => controlledOnOpenChange?.(false)} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

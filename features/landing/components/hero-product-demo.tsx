"use client";

import { useState } from "react";
import { CheckCircle2, Clock3, Sparkles, Target } from "lucide-react";
import { m } from "motion/react";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function HeroProductDemo() {
  const [taskDone, setTaskDone] = useState(false);

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <div className="absolute -inset-8 rounded-[3rem] bg-gradient-to-r from-indigo-200/50 via-violet-200/40 to-cyan-200/50 blur-3xl" />

      <m.div
        initial={{ opacity: 0, y: 32, rotateX: 4 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 p-3 shadow-2xl shadow-slate-950/10 backdrop-blur"
        style={{ perspective: "1000px" }}
      >
        <div className="rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-950 text-xs font-bold text-white">
                S
              </span>
              <span className="text-sm font-semibold text-slate-950">StudyFlow</span>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Badge variant="info" className="text-xs">
                <Sparkles className="mr-1 h-3 w-3" />
                AI Active
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 p-5">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Study Hours</p>
              <p className="mt-0.5 text-lg font-bold text-slate-950">8.5h</p>
              <p className="text-xs text-emerald-600">+12%</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Tasks Done</p>
              <p className="mt-0.5 text-lg font-bold text-slate-950">
                {taskDone ? "13/18" : "12/18"}
              </p>
              <p className="text-xs text-slate-400">66% complete</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Streak</p>
              <p className="mt-0.5 text-lg font-bold text-slate-950">4 days</p>
              <p className="text-xs text-emerald-600">Keep going</p>
            </div>
          </div>

          <div className="border-t border-slate-100 px-5 py-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-slate-500" aria-hidden="true" />
                <span className="text-sm font-medium text-slate-700">Next.js Fullstack</span>
              </div>
              <span className="text-sm font-semibold text-slate-950">72%</span>
            </div>
            <Progress value={72} />
          </div>

          <div className="border-t border-slate-100 px-5 py-4">
            <div className="mb-3 flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-slate-500" aria-hidden="true" />
              <span className="text-sm font-medium text-slate-700">Recent Tasks</span>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setTaskDone(!taskDone)}
                className="flex w-full items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5 text-left transition hover:bg-slate-100"
                aria-label={taskDone ? "Mark task as incomplete" : "Mark task as complete"}
              >
                <CheckCircle2
                  className={`h-4 w-4 shrink-0 transition ${
                    taskDone ? "text-emerald-500" : "text-slate-300"
                  }`}
                  aria-hidden="true"
                />
                <span
                  className={`text-sm transition ${
                    taskDone ? "text-slate-400 line-through" : "text-slate-700"
                  }`}
                >
                  Authentication setup
                </span>
                <Badge variant={taskDone ? "success" : "default"} className="ml-auto text-xs">
                  {taskDone ? "Done" : "Todo"}
                </Badge>
              </button>

              <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
                <span className="text-sm text-slate-700 line-through">Database schema</span>
                <Badge variant="success" className="ml-auto text-xs">
                  Done
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-end gap-1.5 border-t border-slate-100 px-5 py-4">
            {[35, 70, 45, 90, 60, 75, 50].map((height, index) => (
              <m.div
                key={index}
                initial={{ height: 0 }}
                animate={{ height }}
                transition={{
                  duration: 0.6,
                  delay: 0.4 + index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex-1 rounded-full bg-gradient-to-t from-indigo-600 to-cyan-400"
                style={{ minHeight: 0 }}
              />
            ))}
          </div>
        </div>
      </m.div>
    </div>
  );
}

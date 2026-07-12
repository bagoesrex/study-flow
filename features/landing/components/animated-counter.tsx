"use client";

import { useEffect, useRef } from "react";
import { m, useInView, useMotionValue, useTransform } from "motion/react";

type AnimatedCounterProps = {
  value: number;
  suffix?: string;
  prefix?: string;
};

export function AnimatedCounter({ value, suffix = "", prefix = "" }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const hasAnimated = useRef(false);

  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => Math.round(v));

  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true;

      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReduced) {
        motionValue.set(value);
        return;
      }

      const duration = 1500;
      const startTime = performance.now();

      function animate(currentTime: number) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const eased = 1 - Math.pow(1 - progress, 3);
        motionValue.set(value * eased);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      }

      requestAnimationFrame(animate);
    }
  }, [isInView, value, motionValue]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      <m.span>{rounded}</m.span>
      {suffix}
    </span>
  );
}

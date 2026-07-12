"use client";

import { useEffect, useState } from "react";

export const landingSectionIds = [
  "features",
  "product",
  "how-it-works",
  "analytics",
  "testimonials",
] as const;

export type LandingSectionId = (typeof landingSectionIds)[number];

export function useActiveLandingSection() {
  const [activeSection, setActiveSection] = useState<LandingSectionId | null>(null);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    for (const id of landingSectionIds) {
      const element = document.getElementById(id);

      if (!element) {
        continue;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          }
        },
        {
          rootMargin: "-40% 0px -55% 0px",
          threshold: 0,
        }
      );

      observer.observe(element);
      observers.push(observer);
    }

    return () => {
      for (const observer of observers) {
        observer.disconnect();
      }
    };
  }, []);

  return activeSection;
}

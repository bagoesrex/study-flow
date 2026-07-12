"use client";

import { useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type TestimonialItem = {
  id: string;
  name: string;
  role: string | null;
  message: string;
  rating: number;
};

type TestimonialCarouselProps = {
  testimonials: TestimonialItem[];
};

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [current, setCurrent] = useState(0);
  const total = testimonials.length;

  function goNext() {
    setCurrent((prev) => (prev + 1) % total);
  }

  function goPrev() {
    setCurrent((prev) => (prev - 1 + total) % total);
  }

  const testimonial = testimonials[current];

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <AnimatePresence mode="wait">
          <m.div
            key={current}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <Card className="mx-auto max-w-2xl p-8 text-center">
              <div className="mb-4 flex items-center justify-center gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < testimonial.rating
                        ? "fill-amber-400 text-amber-400"
                        : "fill-slate-200 text-slate-200"
                    }`}
                  />
                ))}
              </div>

              <blockquote className="text-lg leading-8 text-slate-600">
                &ldquo;{testimonial.message}&rdquo;
              </blockquote>

              <div className="mt-6">
                <p className="text-base font-semibold text-slate-950">{testimonial.name}</p>
                {testimonial.role ? (
                  <p className="mt-1 text-sm text-slate-500">{testimonial.role}</p>
                ) : null}
              </div>
            </Card>
          </m.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center justify-center gap-4">
        <Button variant="outline" size="sm" onClick={goPrev} aria-label="Previous testimonial">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </Button>

        <div className="flex items-center gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to testimonial ${index + 1}`}
              className={`h-2 rounded-full transition ${
                index === current ? "w-6 bg-slate-950" : "w-2 bg-slate-300 hover:bg-slate-400"
              }`}
              onClick={() => setCurrent(index)}
            />
          ))}
        </div>

        <Button variant="outline" size="sm" onClick={goNext} aria-label="Next testimonial">
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}

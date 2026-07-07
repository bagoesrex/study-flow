import { Star } from "lucide-react";

import { SectionHeader } from "@/components/common/section-header";
import { Card } from "@/components/ui/card";

type TestimonialItem = {
  id: string;
  name: string;
  role: string | null;
  message: string;
  rating: number;
};

type TestimonialsSectionProps = {
  testimonials: TestimonialItem[];
};

function TestimonialCard({ name, role, message, rating }: TestimonialItem) {
  return (
    <Card className="flex flex-col p-6">
      <div className="mb-4 flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}`}
          />
        ))}
      </div>

      <blockquote className="flex-1 text-sm leading-6 text-slate-600">
        &ldquo;{message}&rdquo;
      </blockquote>

      <div className="mt-6 border-t border-slate-100 pt-4">
        <p className="text-sm font-semibold text-slate-950">{name}</p>
        {role ? <p className="text-sm text-slate-500">{role}</p> : null}
      </div>
    </Card>
  );
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  return (
    <section id="testimonials" className="bg-white py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Testimonials"
          title="What learners say about StudyFlow"
          description="Hear from students and developers who use StudyFlow to organize their learning."
          align="center"
        />

        {testimonials.length > 0 ? (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} {...testimonial} />
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-3xl border border-slate-200 bg-slate-50 px-6 py-16 text-center">
            <p className="text-lg font-medium text-slate-500">
              No testimonials yet. Be the first focused learner.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

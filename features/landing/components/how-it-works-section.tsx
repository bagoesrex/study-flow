import { SectionHeader } from "@/components/common/section-header";
import { howItWorksSteps } from "@/features/landing/data/landing-content";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="border-t border-slate-200 bg-white py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="How It Works"
          title="Get started in three simple steps"
          description="From creating your first subject to tracking your daily progress."
          align="center"
        />

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {howItWorksSteps.map((step) => (
            <div key={step.step} className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-950 text-lg font-bold tracking-tight text-white">
                {step.step}
              </div>
              <h3 className="text-xl font-semibold tracking-tight text-slate-950">{step.title}</h3>
              <p className="mt-3 text-base leading-7 text-slate-500">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

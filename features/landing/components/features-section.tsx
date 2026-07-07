import { SectionHeader } from "@/components/common/section-header";
import { Card } from "@/components/ui/card";
import { landingFeatures } from "@/features/landing/data/landing-content";

export function FeaturesSection() {
  return (
    <section id="features" className="bg-white py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Features"
          title="Everything you need to stay consistent"
          description="Manage your learning plan, task, deadline, and session history from one focused workspace."
          align="center"
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {landingFeatures.map((feature) => {
            const Icon = feature.icon;

            return (
              <Card key={feature.title} className="p-6">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold tracking-tight text-slate-950">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

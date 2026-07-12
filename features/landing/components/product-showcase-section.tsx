import { LandingSection } from "@/features/landing/components/landing-section";
import { ProductShowcaseTabs } from "@/features/landing/components/product-showcase-tabs";
import { Reveal } from "@/features/landing/components/reveal";

export function ProductShowcaseSection() {
  return (
    <LandingSection
      id="product"
      className="border-t border-slate-200/70 bg-gradient-to-b from-white to-indigo-50/40"
    >
      <Reveal>
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full border border-indigo-200/60 bg-indigo-50/80 px-4 py-1.5 text-xs font-medium text-indigo-700">
            Explore the App
          </span>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            See StudyFlow in action
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-500">
            Every feature is designed to help you learn more effectively and stay consistent.
          </p>
        </div>
      </Reveal>

      <div className="mt-12">
        <Reveal delay={0.15}>
          <ProductShowcaseTabs />
        </Reveal>
      </div>
    </LandingSection>
  );
}

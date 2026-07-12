import { MarketingShell } from "@/components/layout/marketing-shell";
import { AnalyticsPreviewSection } from "@/features/landing/components/analytics-preview-section";
import { FeatureBentoSection } from "@/features/landing/components/feature-bento-section";
import { FinalCtaSection } from "@/features/landing/components/final-cta-section";
import { GlobalStatsSection } from "@/features/landing/components/global-stats-section";
import { HeroSection } from "@/features/landing/components/hero-section";
import { HowItWorksSection } from "@/features/landing/components/how-it-works-section";
import { ProductShowcaseSection } from "@/features/landing/components/product-showcase-section";
import { ProductTrustStrip } from "@/features/landing/components/product-trust-strip";
import { TestimonialsSection } from "@/features/landing/components/testimonials-section";
import { getLandingStats } from "@/features/landing/queries/get-landing-stats";
import { getPublishedTestimonials } from "@/features/landing/queries/get-published-testimonials";

export default async function HomePage() {
  const [stats, testimonials] = await Promise.all([getLandingStats(), getPublishedTestimonials()]);

  return (
    <MarketingShell>
      <main className="overflow-hidden">
        <HeroSection />
        <ProductTrustStrip />
        <GlobalStatsSection stats={stats} />
        <FeatureBentoSection />
        <ProductShowcaseSection />
        <HowItWorksSection />
        <AnalyticsPreviewSection />
        <TestimonialsSection testimonials={testimonials} />
        <FinalCtaSection />
      </main>
    </MarketingShell>
  );
}

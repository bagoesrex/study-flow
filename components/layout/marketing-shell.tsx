import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { LandingMotionProvider } from "@/components/providers/landing-motion-provider";

type MarketingShellProps = {
  children: React.ReactNode;
};

export function MarketingShell({ children }: MarketingShellProps) {
  return (
    <LandingMotionProvider>
      <div className="min-h-screen bg-white text-slate-950">
        <SiteHeader />
        {children}
        <SiteFooter />
      </div>
    </LandingMotionProvider>
  );
}

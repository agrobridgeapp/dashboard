import { Header } from "@/components/header"
import { HeroB2B } from "@/components/hero-b2b"
import { StatsSection } from "@/components/stats-section"
import { BuyerProblemSection } from "@/components/buyer-problem-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { WhyDifferentSection } from "@/components/why-different-section"
import { ComparisonSection } from "@/components/comparison-section"
import { WhoWeWorkWithSection } from "@/components/who-we-work-with-section"
import { CredibilitySection } from "@/components/credibility-section"
import { ImpactSection } from "@/components/impact-section"
import { MarketIntelSection } from "@/components/market-intel-section"
import { ContactSection } from "@/components/contact-section"
import { FinalCTASection } from "@/components/final-cta-section"
import { FooterB2B } from "@/components/footer-b2b"

export default function HomePage() {

  return (
    <>
      <Header />
      <main>
        <HeroB2B />
        <StatsSection />
        <BuyerProblemSection />
        <HowItWorksSection />
        <WhyDifferentSection />
        <ComparisonSection />
        <WhoWeWorkWithSection />
        <CredibilitySection />
        <ImpactSection />
        <MarketIntelSection />
        <ContactSection />
        <FinalCTASection />
      </main>
      <FooterB2B />
    </>
  )
}

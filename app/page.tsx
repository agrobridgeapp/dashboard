import { Header } from "@/components/header"
import { HeroB2B } from "@/components/hero-b2b"
import { TrustBar } from "@/components/trust-bar"
import { BuyerProblemSection } from "@/components/buyer-problem-section"
import { SolutionSection } from "@/components/solution-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { TractionSection } from "@/components/traction-section"
import { ComparisonSection } from "@/components/comparison-section"
import { ModelSection } from "@/components/model-section"
import { WhyThisMattersSection } from "@/components/why-this-matters-section"
import { WhoThisIsForSection } from "@/components/who-this-is-for-section"
import { ContactSection } from "@/components/contact-section"
import { FinalCTASection } from "@/components/final-cta-section"
import { FooterB2B } from "@/components/footer-b2b"

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroB2B />
        <TrustBar />
        <BuyerProblemSection />
        <SolutionSection />
        <HowItWorksSection />
        <TractionSection />
        <ComparisonSection />
        <ModelSection />
        <WhyThisMattersSection />
        <WhoThisIsForSection />
        <ContactSection />
        <FinalCTASection />
      </main>
      <FooterB2B />
    </>
  )
}

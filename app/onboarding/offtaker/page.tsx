import { OfftakerOnboardingForm } from "@/components/onboarding/offtaker-onboarding-form"
import { Header } from "@/components/header"

export default function OfftakerOnboardingPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-muted/30 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Buyer Registration</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Register as a buyer to access quality produce from our farmer network
            </p>
          </div>
          <OfftakerOnboardingForm />
        </div>
      </main>
    </>
  )
}

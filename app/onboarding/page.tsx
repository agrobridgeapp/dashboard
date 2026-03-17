import { FarmerOnboardingForm } from "@/components/onboarding/farmer-onboarding-form"
import { Header } from "@/components/header"

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12 pt-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-foreground mb-3">Farmer Onboarding</h1>
            <p className="text-muted-foreground text-lg">
              Join the AgroBridge network and access premium agricultural services
            </p>
          </div>
          <FarmerOnboardingForm />
        </div>
      </main>
    </div>
  )
}

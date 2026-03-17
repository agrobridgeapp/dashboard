import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FarmerDirectSignupForm } from "@/components/onboarding/farmer-direct-signup-form"

export default function FarmerDirectSignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-xl border-t-4 border-t-primary">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-3xl font-bold text-center">Join AgroBridge</CardTitle>
            <CardDescription className="text-center text-base">
              Register your farm to access coordinated agricultural services. We'll match you with a field agent in your
              area within 2-4 weeks to complete your onboarding.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FarmerDirectSignupForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

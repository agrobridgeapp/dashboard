import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AgentOnboardingForm } from "@/components/onboarding/agent-onboarding-form"

export default function AgentOnboardingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-xl border-t-4 border-t-primary">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-3xl font-bold text-center">Field Agent Application</CardTitle>
            <CardDescription className="text-center text-base">
              Join AgroBridge as a field agent and help farmers in your community access coordinated agricultural
              services. We'll review your application and get back to you within 3-5 business days.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AgentOnboardingForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

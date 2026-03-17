import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Home } from "lucide-react"
import Link from "next/link"

export default function AgentOnboardingSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-xl border-t-4 border-t-primary">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Application Submitted!</CardTitle>
          <CardDescription className="text-base">
            Thank you for applying to become a field agent with AgroBridge
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-6 space-y-4">
            <h3 className="font-semibold text-lg">What happens next?</h3>
            <ol className="space-y-3 text-sm text-muted-foreground list-decimal list-inside">
              <li>Our team will review your application within 3-5 business days</li>
              <li>If shortlisted, we'll contact you for a phone interview</li>
              <li>Selected candidates will be invited for in-person training</li>
              <li>After training, you'll be onboarded to a corridor and can start earning</li>
            </ol>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <p className="text-sm text-foreground">
              <strong>Keep your phone handy!</strong> We'll reach out via the phone number you provided. Make sure it's
              always reachable.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button asChild size="lg" className="flex-1">
              <Link href="/">
                <Home className="mr-2 h-5 w-5" />
                Back to Home
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="flex-1 bg-transparent">
              <Link href="/login">View Application Status</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

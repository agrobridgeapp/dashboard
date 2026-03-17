import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, MapPin, Phone, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function OnboardingSuccessPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12 pt-24">
        <div className="max-w-2xl mx-auto">
          <Card className="border-primary/20">
            <CardContent className="pt-8 pb-8">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10 text-primary" />
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">Application Submitted Successfully!</h1>
                  <p className="text-muted-foreground">
                    Welcome to the AgroBridge network. Your application is now being processed.
                  </p>
                </div>

                <Badge variant="outline" className="text-primary border-primary px-4 py-1">
                  Status: Pending Verification
                </Badge>
              </div>

              <div className="mt-8 space-y-4">
                <h2 className="font-semibold text-lg">What happens next?</h2>

                <div className="space-y-4">
                  <div className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Within 24-48 hours</h3>
                      <p className="text-sm text-muted-foreground">
                        Your assigned field agent will contact you to schedule a verification visit.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Farm Verification Visit</h3>
                      <p className="text-sm text-muted-foreground">
                        The agent will visit your farm to verify land size, capture GPS coordinates, and complete your
                        profile.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Activation & Service Scheduling</h3>
                      <p className="text-sm text-muted-foreground">
                        Once verified, your account will be activated and services will be scheduled according to your
                        crop cycle.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <span className="font-medium">Need Help?</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Call our support line at <span className="font-medium">+234 800 AGRO BRIDGE</span> or WhatsApp us for
                  assistance.
                </p>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button asChild className="flex-1">
                  <Link href="/login">
                    Go to Login
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild className="flex-1 bg-transparent">
                  <Link href="/">Return Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

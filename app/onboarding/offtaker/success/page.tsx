import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, ArrowRight, Mail, Phone, FileText } from "lucide-react"
import { Header } from "@/components/header"

export default function OfftakerSuccessPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-muted/30 pt-24 pb-12 flex items-center justify-center">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-primary" />
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Registration Submitted!</h1>
          <p className="text-muted-foreground mb-8">
            Thank you for registering as a buyer. Our sourcing team will review your application and contact you within
            2 business days.
          </p>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">What Happens Next?</h3>
              <div className="space-y-4 text-left">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Application Review</p>
                    <p className="text-sm text-muted-foreground">
                      Our team will verify your company details and sourcing requirements
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Onboarding Call</p>
                    <p className="text-sm text-muted-foreground">
                      We'll schedule a call to discuss your specific needs and available supply
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Account Activation</p>
                    <p className="text-sm text-muted-foreground">
                      You'll receive login credentials to access the buyer dashboard
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link href="/" className="gap-2">
                Back to Home
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/login">Go to Login</Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  )
}

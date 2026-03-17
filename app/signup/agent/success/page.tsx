"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Home, Mail, MessageCircle } from "lucide-react"

export default function AgentSignupSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardContent className="pt-12 pb-8 text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Application Submitted!</h1>
            <p className="text-muted-foreground">
              Thank you for applying to become an AgroBridge Field Agent. We've received your application and will
              review it carefully.
            </p>
          </div>

          <div className="bg-muted rounded-lg p-6 space-y-3 text-left">
            <p className="text-sm font-medium">What happens next?</p>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">1.</span>
                <span>Our team will review your application within 3-5 business days</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">2.</span>
                <span>If shortlisted, we'll contact you for a phone interview</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">3.</span>
                <span>Selected candidates will undergo training before starting</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button asChild variant="outline" className="flex-1 bg-transparent">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Button asChild className="flex-1">
              <Link href="/signup/agent">Apply for Another</Link>
            </Button>
          </div>

          <div className="pt-4 border-t space-y-2">
            <p className="text-sm text-muted-foreground">Questions about your application?</p>
            <div className="flex gap-2 justify-center">
              <Button variant="ghost" size="sm" asChild>
                <a href="mailto:agents@agrobridge.ng">
                  <Mail className="mr-2 h-4 w-4" />
                  Email Us
                </a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href="https://wa.me/2348000000000" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

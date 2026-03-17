import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MessageSquare, HelpCircle } from "lucide-react"

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12 pt-24">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">Help & Support</h1>
            <p className="text-lg text-muted-foreground">
              We're here to help you succeed. Find answers or get in touch with our support team.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <Phone className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Call Us</CardTitle>
                <CardDescription>Speak with our support team</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-medium">+234 916 491 3269</p>
                <p className="text-sm text-muted-foreground mt-1">Mon-Fri, 8AM-6PM WAT</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Mail className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Email Us</CardTitle>
                <CardDescription>Get help via email</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-medium">support@agrobridge.com</p>
                <p className="text-sm text-muted-foreground mt-1">Response within 24 hours</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <MessageSquare className="h-8 w-8 text-primary mb-2" />
                <CardTitle>WhatsApp</CardTitle>
                <CardDescription>Chat with us on WhatsApp</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-medium">+234 916 491 3269</p>
                <p className="text-sm text-muted-foreground mt-1">Quick responses</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Send Us a Message</CardTitle>
              <CardDescription>Fill out the form and we'll get back to you soon</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Name</label>
                    <Input placeholder="Your name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <Input type="email" placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Subject</label>
                  <Input placeholder="What do you need help with?" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Message</label>
                  <Textarea placeholder="Describe your issue or question..." rows={6} />
                </div>
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          <div>
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                {
                  q: "How do I register as a farmer?",
                  a: "Click 'Get Started' on the homepage and fill out the farmer registration form. Our field agent will contact you to complete the onboarding.",
                },
                {
                  q: "When will I receive payment for my produce?",
                  a: "Payment is processed after successful delivery and quality verification, typically within 7-14 business days.",
                },
                {
                  q: "How do I request agricultural services?",
                  a: "Log into your dashboard and navigate to 'Service Requests' to submit a new request. Our operations team will assign a partner.",
                },
                {
                  q: "What if I miss a scheduled service?",
                  a: "Contact your field agent or call our support line immediately. We'll work with you to reschedule the service.",
                },
              ].map((faq, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-start gap-2">
                      <HelpCircle className="h-5 w-5 text-primary mt-0.5" />
                      {faq.q}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

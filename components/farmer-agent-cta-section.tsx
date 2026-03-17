import Link from "next/link"
import { Users, Smartphone, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FarmerAgentCTASection() {
  return (
    <section className="py-16 bg-muted/30 border-y border-border/50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Subtle intro */}
          <p className="text-sm text-muted-foreground text-center mb-6">Looking to join the AgroBridge network?</p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Farmer Card */}
            <div className="bg-background rounded-lg border border-border p-6 hover:border-primary/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">For Farmers</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Access inputs, mechanization, and guaranteed markets through our corridor network.
                  </p>
                  <Link href="/signup/farmer">
                    <Button variant="outline" size="sm" className="group bg-transparent">
                      Register as Farmer
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Field Agent Card */}
            <div className="bg-background rounded-lg border border-border p-6 hover:border-primary/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">For Field Agents</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Join our network of coordinators managing farmer clusters and service delivery.
                  </p>
                  <Link href="/signup/agent">
                    <Button variant="outline" size="sm" className="group bg-transparent">
                      Apply as Agent
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

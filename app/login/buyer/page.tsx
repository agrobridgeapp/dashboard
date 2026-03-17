import { Header } from "@/components/header"
import { RoleLoginForm } from "@/components/auth/role-login-form"

export default function BuyerLoginPage() {
  return (
    <div className="min-h-screen bg-[#F5F3EE]">
      <Header />
      <main className="container mx-auto px-4 py-12 pt-24">
        <div className="flex justify-center">
          <RoleLoginForm
            role="offtaker"
            title="Buyer Portal"
            subtitle="Access verified supply from our farmer network and manage your contracts"
            image="/placeholder.svg"
            benefits={[
              "Guaranteed quality-graded produce",
              "Direct farm-to-buyer contracts",
              "Real-time delivery tracking",
              "Transparent pricing and settlement",
            ]}
            earningsHighlight="Buyers source up to 40% cheaper than open market"
            registerPath="/signup/buyer"
          />
        </div>
      </main>
    </div>
  )
}

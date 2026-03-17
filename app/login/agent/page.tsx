import { Header } from "@/components/header"
import { RoleLoginForm } from "@/components/auth/role-login-form"

export default function AgentLoginPage() {
  return (
    <div className="min-h-screen bg-[#F5F3EE]">
      <Header />
      <main className="container mx-auto px-4 py-12 pt-24">
        <div className="flex justify-center">
          <RoleLoginForm
            role="agent"
            title="Field Agent Portal"
            subtitle="Manage your farmers, track commissions, and grow your earnings"
            image="/agricultural-extension-officer-with-tablet-talking.jpg"
            benefits={[
              "Earn N5,000 per farmer onboarded",
              "N500/hectare service commission",
              "Performance bonuses up to N50K",
              "Tier progression & rewards",
            ]}
            earningsHighlight="Top agents earn N500K+/month"
            demoEmail="demo-agent@agrobridge.app"
            registerPath="/onboarding/agent"
          />
        </div>
      </main>
    </div>
  )
}

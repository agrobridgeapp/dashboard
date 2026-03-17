import { Header } from "@/components/header"
import { RoleLoginForm } from "@/components/auth/role-login-form"

export default function PartnerLoginPage() {
  return (
    <div className="min-h-screen bg-[#F5F3EE]">
      <Header />
      <main className="container mx-auto px-4 py-12 pt-24">
        <div className="flex justify-center">
          <RoleLoginForm
            role="partner"
            title="Service Partner Portal"
            subtitle="Manage jobs, track earnings, and grow your agricultural service business"
            image="/tractor-operator-on-green-john-deere-tractor-plowi.jpg"
            benefits={[
              "Steady job requests year-round",
              "Guaranteed payment on completion",
              "Fleet & inventory management",
              "Expand your service area",
            ]}
            earningsHighlight="Partners report 2-3x more jobs"
            demoEmail="demo-partner@agrobridge.app"
            registerPath="/onboarding/partner"
          />
        </div>
      </main>
    </div>
  )
}

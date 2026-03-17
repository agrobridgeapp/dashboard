import { Header } from "@/components/header"
import { RoleLoginForm } from "@/components/auth/role-login-form"

export default function OfftakerLoginPage() {
  return (
    <div className="min-h-screen bg-[#F5F3EE]">
      <Header />
      <main className="container mx-auto px-4 py-12 pt-24">
        <div className="flex justify-center">
          <RoleLoginForm
            role="offtaker"
            title="Buyer Portal"
            subtitle="Manage contracts, track deliveries, and monitor your supply pipeline"
            image="/grain-warehouse-interior-with-workers-and-agricult.jpg"
            benefits={[
              "Real-time supply visibility",
              "Farmer reliability scores",
              "Quality-assured deliveries",
              "Fulfilment forecasting",
            ]}
            demoEmail="demo-buyer@agrobridge.app"
            registerPath="/onboarding/offtaker"
          />
        </div>
      </main>
    </div>
  )
}

import { Header } from "@/components/header"
import { RoleLoginForm } from "@/components/auth/role-login-form"

export default function FarmerLoginPage() {
  return (
    <div className="min-h-screen bg-[#F5F3EE]">
      <Header />
      <main className="container mx-auto px-4 py-12 pt-24">
        <div className="flex justify-center">
          <RoleLoginForm
            role="farmer"
            title="Farmer Portal"
            subtitle="Access services, track your farm, and sell your harvest at guaranteed prices"
            image="/happy-african-farmer-in-maize-field-during-harvest.jpg"
            benefits={[
              "Quality inputs on credit",
              "Expert agronomic advice",
              "Guaranteed market access",
              "Fair prices locked at planting",
            ]}
            earningsHighlight="Farmers see 40-60% yield increase"
            demoEmail="demo-farmer@agrobridge.app"
            registerPath="/onboarding"
          />
        </div>
      </main>
    </div>
  )
}

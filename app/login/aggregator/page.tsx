import { Header } from "@/components/header"
import { RoleLoginForm } from "@/components/auth/role-login-form"

export default function AggregatorLoginPage() {
  return (
    <div className="min-h-screen bg-[#F5F3EE]">
      <Header />
      <main className="container mx-auto px-4 py-12 pt-24">
        <div className="flex justify-center">
          <RoleLoginForm
            role="aggregator"
            title="Aggregator Portal"
            subtitle="Manage supply orders, coordinate collections, and track deliveries"
            image="/grain-warehouse-with-trucks-loading-agricultural-c.jpg"
            benefits={[
              "Receive regular supply orders",
              "Access established farmer networks",
              "Guaranteed payment on delivery",
              "Real-time collection tracking",
            ]}
            earningsHighlight="Scale your aggregation business"
            demoEmail="demo-aggregator@agrobridge.app"
            registerPath="/signup/aggregator"
          />
        </div>
      </main>
    </div>
  )
}

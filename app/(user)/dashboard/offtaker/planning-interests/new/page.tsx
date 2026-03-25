"use client"

import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { PlanningInterestForm } from "@/components/offtaker/planning-interest-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NewPlanningInterestPage() {
  return (
    <DashboardLayout allowedRoles={["offtaker"]}>
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild className="-ml-1">
            <Link href="/dashboard/offtaker/planning-interests">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Link>
          </Button>
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Submit Planning Interest</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Tell us what you need so we can plan the right supply corridors for you.
          </p>
        </div>
        <PlanningInterestForm />
      </div>
    </DashboardLayout>
  )
}

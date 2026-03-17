"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TrendingUp, BarChart3, Bell, CheckCircle2 } from "lucide-react"

export function MarketIntelSection() {
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const benefits = [
    { icon: TrendingUp, text: "Corridor harvest forecasts" },
    { icon: BarChart3, text: "Regional price trends" },
    { icon: Bell, text: "New supply opportunities" },
  ]

  return (
    <section className="py-16 sm:py-20 bg-neutral-50 border-y border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Left - Value Proposition */}
          <div>
            <p className="text-xs sm:text-sm font-semibold text-primary mb-3 tracking-wider uppercase">
              Procurement Intelligence
            </p>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-900 mb-3 sm:mb-4 text-balance">
              Quarterly Supply Insights for Procurement Teams
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 mb-5 sm:mb-6 leading-relaxed">
              Get data-driven updates on corridor performance, harvest forecasts, and supply availability. Designed for
              supply chain managers and procurement professionals.
            </p>
            <ul className="space-y-3">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3 text-neutral-700">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium">{benefit.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right - Signup Form */}
          <div className="bg-white rounded-xl p-5 sm:p-6 lg:p-8 border border-neutral-200 shadow-sm">
            {submitted ? (
              <div className="text-center py-6 sm:py-8">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-2">Subscribed</h3>
                <p className="text-neutral-600 text-xs sm:text-sm">
                  You'll receive quarterly supply insights starting next quarter.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-1">
                  Subscribe to Supply Insights
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 mb-5 sm:mb-6">
                  Quarterly updates. Unsubscribe anytime.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="intel-email"
                      className="block text-xs sm:text-sm font-medium text-neutral-700 mb-1.5"
                    >
                      Work Email
                    </label>
                    <Input
                      id="intel-email"
                      type="email"
                      placeholder="procurement@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-10 sm:h-11 text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="intel-company"
                      className="block text-xs sm:text-sm font-medium text-neutral-700 mb-1.5"
                    >
                      Company Name
                    </label>
                    <Input
                      id="intel-company"
                      type="text"
                      placeholder="Your company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      required
                      className="h-10 sm:h-11 text-sm"
                    />
                  </div>
                  <Button type="submit" className="w-full h-10 sm:h-11 text-sm font-medium">
                    Get Quarterly Insights
                  </Button>
                  <p className="text-xs text-neutral-400 text-center">No spam. Unsubscribe anytime.</p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

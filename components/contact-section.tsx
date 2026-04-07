"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, ArrowRight } from "lucide-react"

export function ContactSection() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <section id="contact" className="py-20 lg:py-28 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 mb-4">
            Let's discuss your supply needs
          </h2>
          <p className="text-lg text-gray-600">
            Tell us what you're sourcing. We'll show you how we can help.
          </p>
        </div>

        {/* Form */}
        <div className="bg-gray-50 rounded-2xl p-6 sm:p-10 border border-gray-200">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Message received</h3>
              <p className="text-gray-600">
                Thank you for reaching out. We'll contact you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <Input
                    id="contact-name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    value={formState.name}
                    onChange={handleChange}
                    required
                    className="h-11 bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <Input
                    id="contact-email"
                    name="email"
                    type="email"
                    placeholder="you@company.com"
                    value={formState.email}
                    onChange={handleChange}
                    required
                    className="h-11 bg-white"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="contact-company" className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <Input
                  id="contact-company"
                  name="company"
                  type="text"
                  placeholder="Company name"
                  value={formState.company}
                  onChange={handleChange}
                  required
                  className="h-11 bg-white"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-2">
                  What do you need?
                </label>
                <Textarea
                  id="contact-message"
                  name="message"
                  placeholder="Tell us about your supply requirements..."
                  value={formState.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="bg-white resize-none"
                />
              </div>
              <Button type="submit" size="lg" className="w-full h-12 bg-[#0f3d2e] hover:bg-[#0a2d21] text-white">
                Send Message
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <p className="text-center text-sm text-gray-500">
                Or email us directly at{" "}
                <a href="mailto:supply@agrobridge.app" className="text-[#0f3d2e] hover:underline">
                  supply@agrobridge.app
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

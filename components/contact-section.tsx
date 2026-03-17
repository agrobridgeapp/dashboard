"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin, Clock, CheckCircle2, Send } from "lucide-react"

export function ContactSection() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
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

  const contactInfo = [
    {
      icon: Phone,
      label: "Phone",
      value: "+234 916 491 3269",
      subtext: "Mon-Fri, 8am-6pm WAT",
    },
    {
      icon: Mail,
      label: "Email",
      value: "supply@agrobridge.app",
      subtext: "We respond within 24 hours",
    },
    {
      icon: MapPin,
      label: "Office",
      value: "Lagos, Nigeria",
      subtext: "By appointment only",
    },
  ]

  return (
    <section id="contact" className="py-12 sm:py-16 lg:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <p className="text-sm font-medium text-primary mb-2 sm:mb-3 tracking-wide uppercase">Contact Us</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-neutral-900 mb-3 sm:mb-4 text-balance">
            Let's discuss your supply needs
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto px-2">
            Whether you're sourcing commodities or exploring partnership opportunities, our team is ready to help you
            understand what AgroBridge can deliver.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-16">
          {/* Contact Info - Shows first on mobile */}
          <div className="lg:col-span-2 lg:order-2 space-y-4 sm:space-y-6">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-3 sm:mb-4">Contact information</h3>
              <div className="flex flex-col gap-3 sm:gap-4 lg:space-y-5 lg:gap-0">
                {contactInfo.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 sm:gap-4 bg-neutral-50 lg:bg-transparent p-3 sm:p-4 lg:p-0 rounded-xl lg:rounded-none"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-neutral-500">{item.label}</p>
                      <p className="font-medium text-neutral-900 text-sm sm:text-base truncate">{item.value}</p>
                      <p className="text-xs text-neutral-400 mt-0.5 truncate">{item.subtext}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Response Time - Hidden on mobile to reduce clutter */}
            <div className="hidden sm:block bg-neutral-50 rounded-xl p-4 sm:p-5 border border-neutral-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-neutral-900 text-sm">Quick response</p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Our team typically responds within 24 hours during business days. For urgent supply inquiries,
                    please call directly.
                  </p>
                </div>
              </div>
            </div>

            {/* For Buyers Note - Hidden on mobile */}
            <div className="hidden sm:block bg-primary/5 rounded-xl p-4 sm:p-5 border border-primary/10">
              <p className="font-medium text-neutral-900 text-sm mb-2">For institutional buyers</p>
              <p className="text-xs text-neutral-600 leading-relaxed">
                If you're a processor, exporter, or institutional buyer looking to discuss supply coordination at scale,
                mention your estimated volumes and preferred commodities in your message for a faster, more relevant
                response.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3 lg:order-1">
            <div className="bg-neutral-50 rounded-xl p-4 sm:p-6 lg:p-8 border border-neutral-200 overflow-hidden">
              {submitted ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-2">Message received</h3>
                  <p className="text-sm sm:text-base text-neutral-600">
                    Thank you for reaching out. A member of our team will contact you within 24 hours.
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-1">Send us a message</h3>
                  <p className="text-xs sm:text-sm text-neutral-500 mb-4 sm:mb-6">
                    Fill out the form below and we'll get back to you promptly.
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="contact-name" className="block text-sm font-medium text-neutral-700 mb-1.5">
                          Full name *
                        </label>
                        <Input
                          id="contact-name"
                          name="name"
                          type="text"
                          placeholder="Your name"
                          value={formState.name}
                          onChange={handleChange}
                          required
                          className="h-12 sm:h-11 bg-white text-base sm:text-sm w-full"
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-email" className="block text-sm font-medium text-neutral-700 mb-1.5">
                          Work email *
                        </label>
                        <Input
                          id="contact-email"
                          name="email"
                          type="email"
                          placeholder="you@company.com"
                          value={formState.email}
                          onChange={handleChange}
                          required
                          className="h-12 sm:h-11 bg-white text-base sm:text-sm w-full"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="contact-company" className="block text-sm font-medium text-neutral-700 mb-1.5">
                          Company *
                        </label>
                        <Input
                          id="contact-company"
                          name="company"
                          type="text"
                          placeholder="Company name"
                          value={formState.company}
                          onChange={handleChange}
                          required
                          className="h-12 sm:h-11 bg-white text-base sm:text-sm w-full"
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-phone" className="block text-sm font-medium text-neutral-700 mb-1.5">
                          Phone (optional)
                        </label>
                        <Input
                          id="contact-phone"
                          name="phone"
                          type="tel"
                          placeholder="+234 XXX XXX XXXX"
                          value={formState.phone}
                          onChange={handleChange}
                          className="h-12 sm:h-11 bg-white text-base sm:text-sm w-full"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="contact-message" className="block text-sm font-medium text-neutral-700 mb-1.5">
                        How can we help? *
                      </label>
                      <Textarea
                        id="contact-message"
                        name="message"
                        placeholder="Tell us about your supply needs, volumes, and timeline..."
                        value={formState.message}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="bg-white resize-none text-base sm:text-sm w-full"
                      />
                    </div>
                    <Button type="submit" size="lg" className="w-full h-12 sm:h-11 text-base sm:text-sm">
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

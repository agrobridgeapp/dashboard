"use client"

import { Card } from "@/components/ui/card"
import { Quote } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    quote:
      "Before AgroBridge, I struggled to get quality fertilizer on time. Now everything comes when I need it, and the prices are fair. My maize yield increased by 30% this season.",
    name: "Ibrahim Musa",
    location: "Kaduna State, Nigeria",
    role: "Maize Farmer",
    image: "/african-male-farmer-testimonial-portrait.jpg",
  },
  {
    quote:
      "I used to worry about selling my harvest. Now I know the buyer before I even plant. The guaranteed purchase agreement gives me peace of mind.",
    name: "Amina Bello",
    location: "Kano State, Nigeria",
    role: "Rice Farmer",
    image: "/african-female-farmer-testimonial-portrait.jpg",
  },
  {
    quote:
      "As a service partner, AgroBridge gives me consistent work. I know where to go, when to be there, and I get paid on time. It's transformed my tractor business.",
    name: "Chinedu Okafor",
    location: "Enugu State, Nigeria",
    role: "Tractor Operator",
    image: "/african-tractor-operator-testimonial-portrait.jpg",
  },
  {
    quote:
      "The coordination is incredible. Instead of dealing with thousands of individual farmers, we work with organized corridors. Quality is consistent, delivery is reliable.",
    name: "Sarah Adeyemi",
    location: "Lagos, Nigeria",
    role: "Offtaker - Food Processing",
    image: "/african-businesswoman-testimonial-portrait.jpg",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-primary font-semibold mb-3 text-sm uppercase tracking-wider">Real Impact</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Stories from Our Community
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Hear directly from farmers, partners, and buyers who are growing together through AgroBridge.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-8 hover:shadow-xl transition-shadow relative overflow-hidden">
              <Quote className="absolute top-6 right-6 h-12 w-12 text-primary/10" />
              <div className="relative">
                <p className="text-muted-foreground text-lg leading-relaxed mb-6 italic">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div className="flex items-center gap-4">
                  <div className="relative h-14 w-14 rounded-full overflow-hidden bg-secondary shrink-0">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.location}</div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

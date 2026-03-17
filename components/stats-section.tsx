"use client"

import { useEffect, useState, useRef } from "react"
import { getLandingPageStats } from "@/lib/data/platform-stats"

function AnimatedCounter({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          let start = 0
          const increment = end / (duration / 16)
          const timer = setInterval(() => {
            start += increment
            if (start >= end) {
              setCount(end)
              clearInterval(timer)
            } else {
              setCount(Math.floor(start))
            }
          }, 16)
        }
      },
      { threshold: 0.5 },
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end, duration, hasAnimated])

  return (
    <div ref={ref} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-2">
      {count.toLocaleString()}
      {suffix}
    </div>
  )
}

export function StatsSection() {
  const stats = getLandingPageStats()

  return (
    <section
      id="stats"
      className="hidden py-16 sm:py-24 lg:py-32 xl:py-40 bg-gradient-to-b from-background via-secondary/20 to-background"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-16 lg:mb-20">
          <div className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 bg-primary/10 rounded-full mb-4 sm:mb-6">
            <span className="text-primary font-semibold text-xs sm:text-sm uppercase tracking-wider">Our Impact</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6">
            Growing One Corridor at a Time
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-lg lg:text-xl leading-relaxed px-2">
            Real numbers from our pilot operations. We're building this platform with farmers, one season at a time.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="relative group text-center p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-3xl bg-card border-2 border-border hover:border-primary/30 shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                <div className="text-sm sm:text-base lg:text-lg font-bold text-foreground mb-1 sm:mb-2">
                  {stat.label}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground leading-relaxed hidden sm:block">
                  {stat.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

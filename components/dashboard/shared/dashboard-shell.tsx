import type { ReactNode } from "react"

interface DashboardShellProps {
  children: ReactNode
  title?: string
  subtitle?: string
  className?: string
}

export function DashboardShell({ children, title, subtitle, className }: DashboardShellProps) {
  return (
    <div className={className}>
      {(title || subtitle) && (
        <div className="mb-6">
          {title && <h1 className="text-2xl font-semibold text-foreground">{title}</h1>}
          {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  )
}

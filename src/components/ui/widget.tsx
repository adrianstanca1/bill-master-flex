
import * as React from "react"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface WidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'neon' | 'floating'
  animated?: boolean
  shimmer?: boolean
}

const Widget = React.forwardRef<HTMLDivElement, WidgetProps>(
  ({ className, variant = 'default', animated = true, shimmer = false, children, ...props }, ref) => {
    const variantClasses = {
      default: 'bg-card border border-border shadow-widget',
      glass: 'bg-gradient-glass backdrop-blur-xl border border-border/50 shadow-floating',
      neon: 'bg-surface border-2 border-emerald/30 shadow-neon',
      floating: 'bg-surface shadow-floating border border-border/30'
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-xl p-6 transition-all duration-500",
          variantClasses[variant],
          animated && "hover:scale-[1.02] hover:shadow-glow animate-widget-float",
          shimmer && "before:absolute before:inset-0 before:bg-shimmer before:animate-shimmer",
          className
        )}
        {...props}
      >
        {shimmer && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
        )}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    )
  }
)
Widget.displayName = "Widget"

interface WidgetHeaderProps {
  title: string
  subtitle?: string
  icon?: LucideIcon
  action?: React.ReactNode
}

const WidgetHeader: React.FC<WidgetHeaderProps> = ({ title, subtitle, icon: Icon, action }) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="p-2 bg-gradient-primary rounded-lg shadow-glow animate-pulse-glow">
            <Icon className="h-5 w-5 text-primary-foreground" />
          </div>
        )}
        <div>
          <h3 className="font-semibold text-lg bg-gradient-primary bg-clip-text text-transparent">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-text-muted">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && <div className="animate-bounce-in">{action}</div>}
    </div>
  )
}

interface WidgetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'padded' | 'flush'
}

const WidgetContent = React.forwardRef<HTMLDivElement, WidgetContentProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variantClasses = {
      default: '',
      padded: 'p-4 bg-surface/50 rounded-lg',
      flush: '-m-6 mt-0'
    }

    return (
      <div
        ref={ref}
        className={cn(variantClasses[variant], className)}
        {...props}
      />
    )
  }
)
WidgetContent.displayName = "WidgetContent"

export { Widget, WidgetHeader, WidgetContent }

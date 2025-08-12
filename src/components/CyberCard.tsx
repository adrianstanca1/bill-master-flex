
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GlowEffect } from './EnhancedVisualEffects';

interface CyberCardProps {
  title?: string;
  children: React.ReactNode;
  icon?: LucideIcon;
  variant?: 'glass' | 'neon' | 'default';
  glow?: boolean;
  className?: string;
  onClick?: () => void;
}

export function CyberCard({ 
  title, 
  children, 
  icon: Icon, 
  variant = 'default',
  glow = false,
  className = '',
  onClick 
}: CyberCardProps) {
  const variantClasses = {
    glass: 'glass-card',
    neon: 'neon-card',
    default: 'bg-surface border border-border hover:bg-surface-hover transition-all duration-300'
  };

  const CardComponent = (
    <Card 
      className={cn(
        variantClasses[variant],
        "group cursor-pointer hover:shadow-cyber transition-all duration-500",
        "hover:transform hover:scale-[1.02] hover:-translate-y-1",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {title && (
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-text-primary group-hover:text-emerald transition-colors">
            {Icon && (
              <div className="p-2 bg-emerald/10 rounded-lg group-hover:bg-emerald/20 transition-all duration-300">
                <Icon className="h-5 w-5 text-emerald" />
              </div>
            )}
            <span className="bg-gradient-cyber bg-clip-text text-transparent group-hover:animate-pulse-glow">
              {title}
            </span>
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald/5 via-transparent to-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />
        <div className="relative z-10">
          {children}
        </div>
      </CardContent>
    </Card>
  );

  if (glow) {
    return (
      <GlowEffect intensity="medium">
        {CardComponent}
      </GlowEffect>
    );
  }

  return CardComponent;
}

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function CyberStatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend,
  className = ''
}: StatsCardProps) {
  return (
    <CyberCard variant="neon" glow className={className}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium text-text-muted uppercase tracking-wider">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl md:text-3xl font-bold bg-gradient-cyber bg-clip-text text-transparent">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {trend && (
              <span className={cn(
                "text-xs font-semibold px-2 py-1 rounded-full",
                trend.isPositive 
                  ? "bg-emerald/20 text-emerald" 
                  : "bg-red-500/20 text-red-400"
              )}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            )}
          </div>
        </div>
        <div className="p-3 bg-gradient-cyber rounded-xl shadow-glow">
          <Icon className="h-7 w-7 text-primary-foreground" />
        </div>
      </div>
    </CyberCard>
  );
}

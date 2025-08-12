
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface CyberButtonProps extends ButtonProps {
  variant?: 'cyber' | 'ghost' | 'neon' | 'default';
  icon?: LucideIcon;
  loading?: boolean;
  glow?: boolean;
}

export function CyberButton({ 
  children, 
  variant = 'cyber', 
  icon: Icon, 
  loading = false,
  glow = false,
  className = '',
  disabled,
  ...props 
}: CyberButtonProps) {
  const variantClasses = {
    cyber: 'cyber-button',
    ghost: 'ghost-button',
    neon: 'neon-card text-emerald font-semibold hover:text-primary-foreground',
    default: ''
  };

  const glowClass = glow ? 'shadow-glow hover:shadow-neon' : '';
  
  return (
    <Button
      className={cn(
        variantClasses[variant],
        glowClass,
        "touch-target relative overflow-hidden group",
        loading && "pointer-events-none",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      <div className="flex items-center gap-2 relative z-10">
        {loading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : Icon ? (
          <Icon className="h-4 w-4" />
        ) : null}
        {children}
      </div>
      
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
    </Button>
  );
}

interface FloatingActionButtonProps {
  icon: LucideIcon;
  onClick: () => void;
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export function FloatingActionButton({ 
  icon: Icon, 
  onClick, 
  className = '',
  position = 'bottom-right'
}: FloatingActionButtonProps) {
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'fixed z-50 p-4 rounded-full shadow-neon',
        'bg-gradient-cyber hover:scale-110 transition-all duration-300',
        'animate-float hover:animate-pulse-glow',
        positionClasses[position],
        className
      )}
    >
      <Icon className="h-6 w-6 text-primary-foreground" />
    </button>
  );
}


import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileNavigation } from '@/components/MobileNavigation';
import { useLocation } from 'react-router-dom';

interface MobileOptimizedProps {
  children: React.ReactNode;
  className?: string;
  showMobileNav?: boolean;
}

export function MobileOptimized({ 
  children, 
  className = '',
  showMobileNav = true 
}: MobileOptimizedProps) {
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Don't show mobile nav on auth and index pages
  const hideMobileNavRoutes = ['/', '/auth'];
  const shouldShowMobileNav = showMobileNav && 
    isMobile && 
    !hideMobileNavRoutes.includes(location.pathname);
  
  return (
    <>
      <div className={`${isMobile ? 'touch-manipulation select-none' : ''} ${className}`}>
        <div className={shouldShowMobileNav ? 'pb-20' : ''}>
          {children}
        </div>
      </div>
      {shouldShowMobileNav && <MobileNavigation />}
    </>
  );
}

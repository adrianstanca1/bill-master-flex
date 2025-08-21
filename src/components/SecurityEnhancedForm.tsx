import React, { ReactNode } from 'react';
import DOMPurify from 'dompurify';

interface SecurityEnhancedFormProps {
  onSubmit: (data: any) => void;
  children: ReactNode;
  className?: string;
}

export function SecurityEnhancedForm({ onSubmit, children, className }: SecurityEnhancedFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const data: { [key: string]: string } = {};
    
    // Sanitize all form inputs
    for (const [key, value] of formData.entries()) {
      if (typeof value === 'string') {
        data[key] = DOMPurify.sanitize(value, { 
          ALLOWED_TAGS: [],
          ALLOWED_ATTR: [] 
        });
      }
    }
    
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
    </form>
  );
}
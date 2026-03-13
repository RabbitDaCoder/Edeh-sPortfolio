import React from 'react';
import { cn } from '../../utils/cn';

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label className="text-body-sm font-medium text-text-primary">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full px-4 py-2 text-body-md font-sans',
            'border border-border rounded-sm',
            'bg-background text-text-primary placeholder-text-muted',
            'transition-smooth resize-none',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
            error && 'border-red-500',
            className
          )}
          {...props}
        />
        {error && <p className="text-body-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
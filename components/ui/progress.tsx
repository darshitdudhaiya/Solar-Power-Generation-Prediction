'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

// Temporary simple Progress component to isolate the issue
const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value?: number | null }
>(({ className, value, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative h-4 w-full overflow-hidden rounded-full bg-gray-700',
      className
    )}
    {...props}
  >
    <div
      className="h-full bg-green-500 transition-all duration-300"
      style={{ width: `${Math.min(Math.max(value || 0, 0), 100)}%` }}
    />
  </div>
));
Progress.displayName = 'Progress';

export { Progress };

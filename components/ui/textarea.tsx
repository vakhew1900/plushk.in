import * as React from 'react';
import { cn } from '@/lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        'w-full px-[11px] py-[9px] border border-border rounded-lg bg-bg text-muted text-[12.5px] leading-relaxed placeholder:text-faint outline-none focus:border-accent transition-colors resize-y font-sans',
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Textarea.displayName = 'Textarea';

export { Textarea };

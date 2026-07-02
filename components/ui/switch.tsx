import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cn } from '@/lib/utils';

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'relative inline-flex h-[18px] w-8 shrink-0 cursor-pointer items-center rounded-full border-0 transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-accent data-[state=unchecked]:bg-border',
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb className="pointer-events-none block h-3.5 w-3.5 rounded-full bg-white shadow-sm ring-0 transition-transform data-[state=checked]:translate-x-[14px] data-[state=unchecked]:translate-x-0.5" />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };

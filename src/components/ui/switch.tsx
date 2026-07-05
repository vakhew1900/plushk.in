import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import styles from './switch.module.css';

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ ...props }, ref) => (
  <SwitchPrimitives.Root className={styles.root} {...props} ref={ref}>
    <SwitchPrimitives.Thumb className={styles.thumb} />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };

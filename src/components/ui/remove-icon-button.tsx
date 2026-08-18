import * as React from 'react';
import { IconX } from '@/components/icons';
import { IconButton } from './icon-button';
import type { IconButtonProps } from './icon-button';

interface Props extends Omit<IconButtonProps, 'icon' | 'variant'> {
  /** Defaults to `IconX` — override only for a differently-iconed remove/delete action (e.g. `IconTrash`). */
  icon?: IconButtonProps['icon'];
}

/** `IconButton` pre-configured for the by-far most common case: a small "×" that removes a row/chip/condition. */
export const RemoveIconButton = React.forwardRef<HTMLButtonElement, Props>(
  ({ icon = IconX, ...props }, ref) => <IconButton ref={ref} icon={icon} variant="danger" {...props} />,
);
RemoveIconButton.displayName = 'RemoveIconButton';

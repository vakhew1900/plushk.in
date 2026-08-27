import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { clsx } from 'clsx';
import { IconX } from '@/components/icons';
import { IconButton } from './icon-button';
import styles from './dialog.module.css';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;

// React bubbles portaled content through the component tree, not the DOM
// tree — a Dialog opened from a trigger that sits inside some clickable
// ancestor (e.g. UI-15's gear button inside BookmarkCard's own onClick) would
// otherwise let a click on the overlay/backdrop bubble all the way up to
// that ancestor's handler. stopPropagation here doesn't interfere with
// Radix's own outside-click dismissal, which is wired via a native
// pointerdown listener, independent of this React onClick.
function stopPropagation(e: React.MouseEvent) {
  e.stopPropagation();
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className={styles.overlay} onClick={stopPropagation} />
    <DialogPrimitive.Content ref={ref} className={clsx(styles.content, className)} {...props}>
      {children}
      <DialogPrimitive.Close asChild>
        <IconButton icon={IconX} className={styles.close} />
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={clsx(styles.title, className)} {...props} />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

export { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose };

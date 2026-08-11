import * as RadixToast from '@radix-ui/react-toast';
import { clsx } from 'clsx';
import { IconCheck, IconX } from '@/components/icons';
import { ToastVariant } from '@/types/toast';
import styles from './toast.module.css';

const VARIANT_ICON = {
  [ToastVariant.SUCCESS]: IconCheck,
  [ToastVariant.ERROR]: IconX,
} satisfies Record<ToastVariant, typeof IconCheck>;

const VARIANT_CLASS: Record<ToastVariant, string> = {
  [ToastVariant.SUCCESS]: styles.success,
  [ToastVariant.ERROR]: styles.error,
};

interface ToastProps {
  variant: ToastVariant;
  title: string;
  description?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function Toast({ variant, title, description, open, onOpenChange }: ToastProps) {
  const Icon = VARIANT_ICON[variant];
  return (
    <RadixToast.Root className={clsx(styles.toast, VARIANT_CLASS[variant])} open={open} onOpenChange={onOpenChange}>
      <Icon size="md" className={styles.icon} />
      <div className={styles.body}>
        <RadixToast.Title className={styles.title}>{title}</RadixToast.Title>
        {description && <RadixToast.Description className={styles.description}>{description}</RadixToast.Description>}
      </div>
      <RadixToast.Close className={styles.close} aria-label="Close">
        <IconX size="sm" />
      </RadixToast.Close>
    </RadixToast.Root>
  );
}

export { Toast };

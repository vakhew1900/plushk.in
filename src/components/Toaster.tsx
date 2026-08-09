import * as RadixToast from '@radix-ui/react-toast';
import { Toast } from '@/components/ui/toast';
import { useToast } from '@/hooks/useToast';
import styles from './Toaster.module.css';

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <RadixToast.Provider swipeDirection="right">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          variant={toast.variant}
          title={toast.title}
          description={toast.description}
          open
          onOpenChange={(open) => {
            if (!open) dismiss(toast.id);
          }}
        />
      ))}
      <RadixToast.Viewport className={styles.viewport} />
    </RadixToast.Provider>
  );
}

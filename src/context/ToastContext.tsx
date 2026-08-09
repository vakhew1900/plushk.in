import { createContext, useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { ToastItem, ToastVariant } from '@/types/toast';

export interface ToastContextValue {
  toasts: ToastItem[];
  show: (toast: { variant: ToastVariant; title: string; description?: string }) => void;
  dismiss: (id: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

interface Props {
  children: ReactNode;
}

export function ToastProvider({ children }: Props) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const show = useCallback<ToastContextValue['show']>((toast) => {
    setToasts((prev) => [...prev, { ...toast, id: crypto.randomUUID() }]);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = useMemo<ToastContextValue>(() => ({ toasts, show, dismiss }), [toasts, show, dismiss]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

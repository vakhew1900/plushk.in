export const ToastVariant = {
  SUCCESS: "success",
  ERROR: "error",
} as const;

export type ToastVariant = (typeof ToastVariant)[keyof typeof ToastVariant];

export interface ToastItem {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
}

"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      richColors
      closeButton
      duration={3000}
      toastOptions={{
        classNames: {
          toast: "rounded-2xl shadow-md border border-border",
          description: "text-sm text-muted-foreground",
        },
      }}
    />
  );
}

"use client";

import { useEffect } from "react";
import { useAppStore } from "@/stores/useAppStore";

export function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isHighContrast } = useAppStore();

  useEffect(() => {
    if (isHighContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [isHighContrast]);

  return <>{children}</>;
}

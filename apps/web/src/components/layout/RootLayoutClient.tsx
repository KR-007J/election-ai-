"use client";

import { useAppStore } from "@/stores/useAppStore";

export function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isHighContrast } = useAppStore();

  return (
    <html lang="en" className={`dark ${isHighContrast ? 'high-contrast' : ''}`}>
      <body className="bg-background text-on-background font-body-md antialiased">
        {children}
      </body>
    </html>
  );
}

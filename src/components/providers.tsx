"use client";

import { useEffect } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  // Sinkron tema tersimpan di profile → html class
  useEffect(() => {
    const applyProfileTheme = (event: Event) => {
      const detail = (event as CustomEvent<{ theme: string }>).detail;
      const body = document.body;
      body.dataset["profileTheme"] = detail.theme;
    };
    window.addEventListener("wf-profile-theme", applyProfileTheme);
    return () => window.removeEventListener("wf-profile-theme", applyProfileTheme);
  }, []);

  return (
    <>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "var(--card)",
              color: "var(--card-foreground)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
            },
          }}
        />
      </NextThemesProvider>
    </>
  );
}

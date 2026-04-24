"use client"

import * as React from "react"

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  ...props
}: {
  children: React.ReactNode;
  defaultTheme?: string;
  [key: string]: any;
}) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const root = window.document.documentElement;
    root.classList.add("dark"); // Force dark mode as requested
  }, []);

  // Return children without the problematic script-injecting provider
  return <div {...props}>{children}</div>;
}

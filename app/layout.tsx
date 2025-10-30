import "./globals.css";
import { ReactNode } from "react";
import { ThemeScript } from "./theme-script";
import Provider from "@/components/Provider";

export const metadata = {
  title: "Pense-bêtes",
  description: "Gestion de pense-bêtes hiérarchiques",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* Injecte le thème avant le rendu */}
        <ThemeScript />
      </head>

      <body className="bg-[var(--background)] text-[var(--foreground)] transition-colors duration-200">
        <main className="max-w-6xl 2xl:max-w-7xl mx-auto p-6">
          <Provider>{children}</Provider>
        </main>
      </body>
    </html>
  );
}

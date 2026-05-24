import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ESP32 Presence Tracker",
  description: "Presence monitoring dashboard built with Next.js."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}

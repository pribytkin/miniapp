import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TG Services",
  description: "Знайдіть спеціалістів та послуги у Валенсії",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: "#ffffff"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          src="https://telegram.org/js/telegram-web-app.js"
          async
        />
      </head>
      <body className={cn(
        "min-h-[100dvh] bg-background font-sans antialiased overflow-x-hidden",
        "max-w-[500px] mx-auto safe-area-inset-top safe-area-inset-bottom",
        inter.className
      )}>
        {children}
      </body>
    </html>
  );
}

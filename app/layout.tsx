import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { THEME_BOOT_SCRIPT } from "@/lib/theme";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wi Sabi",
  description: "Wi Sabi — company knowledge base assistant",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // The theme boot script (below) sets `class="dark"` and `data-theme`
      // on this element directly via DOM mutation, before React hydrates,
      // to avoid a flash of the wrong theme on first paint. React's virtual
      // DOM has no knowledge of that mutation, so it will always flag this
      // element's attributes as a server/client mismatch — this is the
      // standard, narrow way to silence that specific expected mismatch
      // without hiding real ones elsewhere in the tree.
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <Script id="theme-boot" strategy="beforeInteractive">
          {THEME_BOOT_SCRIPT}
        </Script>
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">{children}</body>
    </html>
  );
}
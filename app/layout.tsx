import type { Metadata, Viewport } from "next"
import { Geist_Mono, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { GoogleTagManager } from "@next/third-parties/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SearchProvider } from "@/components/station-search"
import { SiteHeader } from "@/components/site-header"
import { AnnouncementBanner } from "@/components/announcement-banner"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: {
    default: "RAILR",
    template: "%s · RAILR",
  },
  description: "Suivez les horaires des prochains trains dans votre gare",
  applicationName: "RAILR",
  appleWebApp: { capable: true, title: "RAILR", statusBarStyle: "default" },
  other: { "google-adsense-account": "ca-pub-6617770352482613" },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-svh">
        <ThemeProvider>
          <TooltipProvider>
            <SearchProvider>
              <AnnouncementBanner />
              <SiteHeader />
              {children}
              <Toaster position="top-center" />
            </SearchProvider>
          </TooltipProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
        {process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER && (
          <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER} />
        )}
      </body>
    </html>
  )
}

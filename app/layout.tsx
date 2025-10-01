import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AuthProvider } from "@/context/auth"
import NextTopLoader from "nextjs-toploader";
import ConfirmScholarshipApplication from "@/components/confirm-application"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Newton Scholarship Nexus - Empowering Scholars, One Opportunity at a Time",
  description:
    "Connect with national and international scholarship opportunities. Find resources to help you succeed in your educational journey.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          
        <NextTopLoader />
          <AuthProvider>
            <Navigation />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <ConfirmScholarshipApplication/>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

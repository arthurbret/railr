import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import { HeaderMessage } from "@/components/layout/HeaderMessage";
import { Toaster } from "react-hot-toast";
import { Footer } from "@/components/layout/Footer";
import SearchBar from "@/components/layout/SearchBar";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RAILR",
  description: "Suivez les horaires des prochains trains dans votre gare",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta name="viewport" content="width=device-width, user-scalable=no" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-white text-black dark:bg-black dark:text-white`}
      >
        <ThemeProvider attribute="class" defaultTheme="system">
          <Toaster />
          <HeaderMessage />
          <Header />
          <div className="flex-1 relative bg-white dark:bg-black rounded-b-3xl z-10 shadow-xl">
            {children}
          </div>
          <SearchBar />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

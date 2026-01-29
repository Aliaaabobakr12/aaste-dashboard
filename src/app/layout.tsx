import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google"; // Using Inter as requested or default
import "./globals.css";
import Providers from "./providers";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });
const cairo = Cairo({ subsets: ["arabic"], variable: "--font-cairo" });

export const metadata: Metadata = {
  title: "AASTE Dashboard",
  description: "Aspect-Sentiment-Triplet Extraction Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${cairo.variable}`} suppressHydrationWarning>
        <Providers>
          <div className="h-full relative">
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
              <Sidebar />
            </div>
            <main className="md:pl-72">
              <Navbar />
              <div className="p-8">
                {children}
              </div>
            </main>
            <Toaster />
          </div>
        </Providers>
      </body>
    </html>
  );
}

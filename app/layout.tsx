import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Navbar } from "@/components/shared/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Logistics ERP",
  description: "Enterprise Resource Planning for Logistics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main className="min-h-[calc(100vh-64px)] pb-10">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}

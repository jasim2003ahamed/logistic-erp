import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Deal Universal Services",
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
          <div className="flex min-h-screen w-full bg-muted/40">
            <Sidebar />
            <div className="flex flex-col w-full pl-64 transition-all duration-300 ease-in-out has-[aside[style*='width: 4rem']]:pl-16">
              {/* 
                  Note: The padding-left (pl-64) corresponds to the sidebar width. 
                  We might need a context or simple CSS sibling selector to adjust this dynamically if the sidebar collapses.
                  For now, I'm making the sidebar fixed width for simplicity or handling it via global state if needed later.
                  However, the sidebar component has local state. 
                  To make the layout responsive to the sidebar state without complex state management, 
                  we can use a peer or group selector, or just let the main content flow.
                  Better yet, let's wrap the content in a way that respects the fixed sidebar.
               */}
              <Header />
              <main className="flex-1 p-6 overflow-auto">
                {children}
              </main>
            </div>
          </div>
        </Providers>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}

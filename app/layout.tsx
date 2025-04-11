import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";
import FloatingButtonsWrapper from "../components/ui/floating-buttons-wrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JoBless - Find Your Dream Job",
  description: "Find your dream job with JoBless. We connect talent with opportunity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen pt-16">
          {children}
        </main>
        <FloatingButtonsWrapper />
      </body>
    </html>
  );
}

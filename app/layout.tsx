import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";
import FloatingButtonsWrapper from "../components/ui/floating-buttons-wrapper";
import Script from 'next/script';

const inter = Inter({ subsets: ["latin"] });
const oswald = Oswald({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700"],
  variable: '--font-oswald' 
});

export const metadata: Metadata = {
  title: "JoBless - Your Daily Dose of Career Blessings",
  description: "Find your dream job with JoBless - Your daily dose of career blessings.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`light ${oswald.variable}`}>
      <head>
        {/* Keep the default metadata here */}
      </head>
      <body className={inter.className}>
        {/* Google tag (gtag.js) */}
        <Script 
          src="https://www.googletagmanager.com/gtag/js?id=G-ZDJPNTC8ZV" 
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ZDJPNTC8ZV');
          `}
        </Script>
        
        <Navbar />
        <main className="min-h-screen pt-16">
          {children}
        </main>
        <FloatingButtonsWrapper />
      </body>
    </html>
  );
}

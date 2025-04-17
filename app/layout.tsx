import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";
import FloatingButtonsWrapper from "../components/ui/floating-buttons-wrapper";
import Script from 'next/script';
import AnalyticsProvider from "@/components/AnalyticsProvider";
import Footer from "../components/ui/Footer";

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
        <meta name="monetag" content="0e5032126db1f13dd19297b00c3b0791" />
        <meta name="google-adsense-account" content="ca-pub-6216500614121854" />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6216500614121854"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
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
            gtag('config', 'G-ZDJPNTC8ZV', {
              page_path: window.location.pathname,
              stream_id: '10521646785',
              stream_name: 'JoBless',
              stream_url: 'https://www.jobless.careers/',
              send_page_view: true,
              debug_mode: true
            });
          `}
        </Script>
        
        <Navbar />
        <AnalyticsProvider>
          <main className="min-h-screen pt-16">
            {children}
          </main>
        </AnalyticsProvider>
        <Footer />
        <FloatingButtonsWrapper />
      </body>
    </html>
  );
}

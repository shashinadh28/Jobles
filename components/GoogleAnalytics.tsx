'use client';

import Script from 'next/script';

export default function GoogleAnalytics() {
  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-1MDFS8KLQP"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-1MDFS8KLQP', {
            page_path: window.location.pathname,
            stream_id: '10478746494',
            send_page_view: true
          });
        `}
      </Script>
    </>
  );
} 